
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const app = express();
app.use(cors({
  origin: [
    'https://economix.onrender.com',
    'https://eduardo852823-eng.github.io',
    'http://localhost:3000',
    'capacitor://localhost'
  ],
  credentials: true
}));
app.use(express.json({limit: '1mb'}));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(e => console.error('MongoDB erro', e.message));

const lancamentoSchema = new mongoose.Schema({
  id: Number, descricao: String, valor: Number, tipo: String,
  categoria: String, recorrente: Boolean, data: Date, confirmado: Boolean
}, {_id:false});

const metaSchema = new mongoose.Schema({
  id: Number, nome: String, valor: Number,
  acumulado: {type:Number, default:0}, completa: {type:Boolean, default:false}
}, {_id:false});

const usuarioSchema = new mongoose.Schema({
  nome: String,
  email: {type:String, unique:true, lowercase:true},
  sal: String, senhaHash: String, googleId: String,
  token: String, tokenExpira: Date,
  verificado: {type:Boolean, default:false},
  codigoVerificacao: String, codigoExpira: Date,
  foto: String,
  corEscolhida: {type:String, default:'azul'},
  corLivreHex: {type:String, default:'#3b82f6'},
  layoutAtual: {type:String, default:'poupix'},
  planoAtual: {type:String, default:'free'},
  devAtivo: {type:Boolean, default:false},
  limiteGasto: {type:Number, default:null},
  lancamentos: [lancamentoSchema],
  metaAlvo: {type:Number, default:null},
  metas: [metaSchema],
  telefone: {type:String, default:''},
  zapOptin: {type:Boolean, default:true},
  ultimoLancamento: {type:Date, default:null},
  streak: {type:Number, default:0},
  criadoEm: {type:Date, default:Date.now}
});
const Usuario = mongoose.model('Usuario', usuarioSchema);

function gerarHash(senha, sal){ return `scrypt:${crypto.scryptSync(senha, sal, 64).toString('hex')}` }
function senhaConfere(senha, sal, hash){
  if(!hash) return false;
  if(hash.startsWith('scrypt:')){
    const a = Buffer.from(gerarHash(senha, sal));
    const b = Buffer.from(hash);
    return a.length===b.length && crypto.timingSafeEqual(a,b);
  }
  return false;
}
function gerarToken(){ return crypto.randomBytes(24).toString('hex') }
function gerarValidadeToken(){ return new Date(Date.now()+30*24*60*60*1000) }
function gerarCodigo(){ return String(Math.floor(100000+Math.random()*900000)) }

const transporter = nodemailer.createTransport({
  service:'gmail',
  auth:{ user: process.env.EMAIL_USUARIO, pass: process.env.EMAIL_SENHA_APP }
});
async function enviarEmail(dest, assunto, texto){
  if(!process.env.EMAIL_USUARIO) return;
  try{ await transporter.sendMail({from:`"Economix" <${process.env.EMAIL_USUARIO}>`, to:dest, subject:assunto, text:texto}) }catch(e){ console.error('email erro', e.message) }
}

// EVOLUTION API
async function enviarZap(telefone, mensagem){
  const baseUrl = (process.env.EVOLUTION_API_URL || 'https://evolution-api-production-d61a.up.railway.app').replace(/\/$/,'');
  const apikey = process.env.EVOLUTION_API_KEY || '998142A660D9-4A2F-A04A-A01B1B9AE0C5';
  const instance = process.env.EVOLUTION_INSTANCE || 'economix';
  let tel = String(telefone).replace(/\D/g,'');
  if(tel.length<=11) tel='55'+tel;
  try{
    const resp = await fetch(`${baseUrl}/message/sendText/${instance}`, {
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':apikey},
      body: JSON.stringify({ number: tel, text: mensagem, options:{delay:1200, presence:'composing'} })
    });
    console.log('Zap', tel, resp.status);
    return resp.ok;
  }catch(e){ console.error('Zap erro', e.message); return false; }
}

async function autenticar(req,res,next){
  const token = req.headers.authorization?.replace('Bearer ','');
  if(!token) return res.status(401).json({erro:'Token não informado'});
  const u = await Usuario.findOne({token});
  if(!u || (u.tokenExpira && u.tokenExpira < new Date())) return res.status(401).json({erro:'Sessão expirada'});
  req.usuario = u; next();
}

app.post('/cadastro', async(req,res)=>{
  try{
    const {nome,email,senha}=req.body;
    if(!nome||!email||!senha) return res.status(400).json({erro:'Preencha tudo'});
    if(await Usuario.findOne({email:email.toLowerCase()})) return res.status(400).json({erro:'E-mail já cadastrado'});
    const sal=crypto.randomBytes(16).toString('hex');
    const codigo=gerarCodigo();
    const user = await Usuario.create({
      nome, email:email.toLowerCase(), sal, senhaHash:gerarHash(senha,sal),
      token:gerarToken(), tokenExpira:gerarValidadeToken(),
      codigoVerificacao:codigo, codigoExpira:new Date(Date.now()+15*60*1000),
      verificado:false, lancamentos:[], metas:[]
    });
    await enviarEmail(email, 'Código Economix', `Seu código: ${codigo}`);
    res.json({ok:true, precisaVerificar:true});
  }catch(e){ console.error(e); res.status(500).json({erro:'Erro cadastro'})}
});

app.post('/verificar-codigo', async(req,res)=>{
  const {email,codigo}=req.body;
  const u=await Usuario.findOne({email:email.toLowerCase()});
  if(!u||u.codigoVerificacao!==codigo||u.codigoExpira<new Date()) return res.status(400).json({erro:'Código inválido'});
  u.verificado=true; u.codigoVerificacao=''; u.token=gerarToken(); u.tokenExpira=gerarValidadeToken(); await u.save();
  res.json({token:u.token, nome:u.nome, email:u.email});
});

app.post('/login', async(req,res)=>{
  const {email,senha}=req.body;
  const u=await Usuario.findOne({email:email.toLowerCase()});
  if(!u||!senhaConfere(senha,u.sal,u.senhaHash)) return res.status(400).json({erro:'E-mail ou senha inválidos'});
  if(!u.verificado) return res.status(400).json({erro:'Confirme seu e-mail'});
  u.token=gerarToken(); u.tokenExpira=gerarValidadeToken(); await u.save();
  res.json({token:u.token, nome:u.nome, email:u.email});
});

app.post('/login-google', async(req,res)=>{
  try{
    const {credential}=req.body;
    const ticket=await googleClient.verifyIdToken({idToken:credential, audience:process.env.GOOGLE_CLIENT_ID});
    const p=ticket.getPayload();
    let u=await Usuario.findOne({email:p.email.toLowerCase()});
    if(!u){ u=await Usuario.create({nome:p.name, email:p.email.toLowerCase(), googleId:p.sub, verificado:true, token:gerarToken(), tokenExpira:gerarValidadeToken(), lancamentos:[]}) }
    else { u.token=gerarToken(); u.tokenExpira=gerarValidadeToken(); u.verificado=true; await u.save(); }
    res.json({token:u.token, nome:u.nome, email:u.email});
  }catch(e){ res.status(400).json({erro:'Google erro'}) }
});

app.get('/dados', autenticar, (req,res)=>{
  res.json({
    nome:req.usuario.nome, email:req.usuario.email, lancamentos:req.usuario.lancamentos,
    metaAlvo:req.usuario.metaAlvo, metas:req.usuario.metas, criadoEm:req.usuario.criadoEm,
    foto:req.usuario.foto, corEscolhida:req.usuario.corEscolhida, corLivreHex:req.usuario.corLivreHex,
    layoutAtual:req.usuario.layoutAtual, planoAtual:req.usuario.planoAtual, devAtivo:req.usuario.devAtivo,
    telefone:req.usuario.telefone, zapOptin:req.usuario.zapOptin, limiteGasto:req.usuario.limiteGasto,
    streak:req.usuario.streak
  });
});

app.post('/dados', autenticar, async(req,res)=>{
  const {lancamentos, metaAlvo, foto, planoAtual, devAtivo, corEscolhida, limiteGasto, metas, corLivreHex, layoutAtual} = req.body;
  const u=req.usuario;
  if(lancamentos) u.lancamentos=lancamentos;
  if(metaAlvo!==undefined) u.metaAlvo=metaAlvo;
  if(metas!==undefined) u.metas=metas;
  if(foto!==undefined) u.foto=foto;
  if(planoAtual!==undefined) u.planoAtual=planoAtual;
  if(devAtivo!==undefined) u.devAtivo=devAtivo;
  if(corEscolhida!==undefined) u.corEscolhida=corEscolhida;
  if(corLivreHex!==undefined) u.corLivreHex=corLivreHex;
  if(layoutAtual!==undefined) u.layoutAtual=layoutAtual;
  if(limiteGasto!==undefined) u.limiteGasto=limiteGasto;
  if(lancamentos && lancamentos.length) u.ultimoLancamento=new Date();
  await u.save();
  res.json({ok:true});
});

app.post('/verificar-dev', async(req,res)=>{
  const {senha}=req.body;
  if(senha===process.env.SENHA_DEV) return res.json({ok:true});
  res.status(401).json({erro:'Senha dev inválida'});
});

// TELEFONE + ZAP
app.post('/telefone', async(req,res)=>{
  try{
    const auth=req.headers.authorization?.replace('Bearer ','');
    const u=await Usuario.findOne({token:auth});
    if(!u) return res.status(401).json({erro:'Sessão inválida'});
    const {telefone, zapOptin}=req.body;
    u.telefone=String(telefone).replace(/\D/g,'');
    if(typeof zapOptin!=='undefined') u.zapOptin=!!zapOptin;
    await u.save();
    if(u.zapOptin){ await enviarZap(u.telefone, `Oi ${u.nome}! 👋 Economix ativado no zap ✅\nVou te mandar resumo diário 8h aqui.`) }
    res.json({ok:true});
  }catch(e){ res.status(500).json({erro:'Erro'}) }
});

app.post('/testar-zap', async(req,res)=>{
  const {telefone}=req.body;
  if(!telefone) return res.status(400).json({erro:'Telefone vazio'});
  const ok=await enviarZap(telefone, `Economix teste ✅ Seu Zap funciona na Evolution!`);
  res.json({ok});
});

// CRON 8h resumo
cron.schedule('0 8 * * *', async()=>{
  console.log('Cron 8h');
  try{
    const users=await Usuario.find({zapOptin:true});
    for(const u of users){
      if(!u.lancamentos.length) continue;
      const hoje=new Date(); const m=hoje.getMonth(); const y=hoje.getFullYear();
      const doMes=u.lancamentos.filter(l=>{ const d=new Date(l.data); return d.getMonth()===m && d.getFullYear()===y });
      const entradas=doMes.filter(l=>l.tipo==='entrada').reduce((s,l)=>s+l.valor,0);
      const saidas=doMes.filter(l=>l.tipo==='saida').reduce((s,l)=>s+l.valor,0);
      const saldo=entradas-saidas;
      await enviarEmail(u.email, 'Resumo diário 📊', `Olá ${u.nome}\nEntradas R$ ${entradas.toFixed(2)}\nSaídas R$ ${saidas.toFixed(2)}\nSaldo R$ ${saldo.toFixed(2)}`);
      if(u.telefone){
        await enviarZap(u.telefone, `📊 *Resumo Economix - ${hoje.toLocaleDateString('pt-BR')}*\nOlá ${u.nome}!\nEntradas: R$ ${entradas.toFixed(2)}\nSaídas: R$ ${saidas.toFixed(2)}\n*Saldo: R$ ${saldo.toFixed(2)}*\nAbra o app 👉 https://eduardo852823-eng.github.io/meu-app-saldo/`);
      }
    }
  }catch(e){ console.error('cron 8h erro', e.message) }
});

// CRON 19h inatividade - RETENÇÃO
cron.schedule('0 19 * * *', async()=>{
  console.log('Cron 19h inatividade');
  try{
    const limite = new Date(Date.now()-2*24*60*60*1000);
    const users = await Usuario.find({zapOptin:true, ultimoLancamento:{$lt:limite}, telefone:{$ne:''}});
    for(const u of users){
      await enviarZap(u.telefone, `Eita ${u.nome}, faz 2 dias que você não anota nada 😬\nSeu saldo pode estar errado. Bora anotar o de hoje em 10s? 👉 https://eduardo852823-eng.github.io/meu-app-saldo/`);
    }
  }catch(e){ console.error('cron 19h erro', e.message) }
});

const PORT=process.env.PORT||3000;
app.listen(PORT, ()=>console.log('Economix V5 rodando na porta '+PORT));
