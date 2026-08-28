const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
const rateLimit = require('express-rate-limit');

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
app.use(express.json());

// ==============================
// MongoDB
// ==============================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB com sucesso!'))
  .catch(erro => console.error('Erro ao conectar no MongoDB:', erro.message));

const lancamentoSchema = new mongoose.Schema({
  id: Number,
  descricao: String,
  valor: Number,
  tipo: String,
  categoria: String,
  recorrente: Boolean,
  data: Date,
  confirmado: Boolean
}, { _id: false });

const metaSchema = new mongoose.Schema({
  id: Number,
  nome: String,
  valor: Number,
  acumulado: { type: Number, default: 0 },
  completa: { type: Boolean, default: false }
}, { _id: false });

const usuarioSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true, lowercase: true },
  sal: String,
  senhaHash: String,
  googleId: String,
  token: String,
  tokenExpira: Date,
  verificado: { type: Boolean, default: false },
  codigoVerificacao: String,
  codigoExpira: Date,
  foto: String,
  corEscolhida: { type: String, default: 'azul' },
  corLivreHex: { type: String, default: '#3b82f6' },
  layoutAtual: { type: String, default: 'poupix' },
  planoAtual: { type: String, default: 'free' },
  devAtivo: { type: Boolean, default: false },
  limiteGasto: { type: Number, default: null },
  lancamentos: [lancamentoSchema],
  metaAlvo: { type: Number, default: null },
  metas: [metaSchema],
  telefone: { type: String, default: '' },
  zapOptin: { type: Boolean, default: true },
  ultimoLancamentoEm: { type: Date, default: null },
  avisoInatividadeEnviadoEm: { type: Date, default: null },
  desafioSemana: { type: String, default: '' },
  desafioPalavra: { type: String, default: '' },
  desafioSemanaChave: { type: String, default: '' },
  desafioAvisoEnviado: { type: Boolean, default: false },
  criadoEm: { type: Date, default: Date.now }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

function gerarHash(senha, sal) {
  const hash = crypto.scryptSync(senha, sal, 64).toString('hex');
  return `scrypt:${hash}`;
}
function gerarHashAntigo(senha, sal) {
  return crypto.createHash('sha256').update(senha + sal).digest('hex');
}
function senhaConfere(senha, sal, hashSalvo) {
  if (!hashSalvo) return false;
  if (hashSalvo.startsWith('scrypt:')) {
    const calculado = Buffer.from(gerarHash(senha, sal));
    const salvo = Buffer.from(hashSalvo);
    return calculado.length === salvo.length && crypto.timingSafeEqual(calculado, salvo);
  }
  return gerarHashAntigo(senha, sal) === hashSalvo;
}
function gerarToken() {
  return crypto.randomBytes(24).toString('hex');
}
function gerarValidadeToken() {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}
function gerarCodigo() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USUARIO,
    pass: process.env.EMAIL_SENHA_APP
  }
});

async function enviarEmail(destinatario, assunto, texto) {
  if (!process.env.EMAIL_USUARIO || !process.env.EMAIL_SENHA_APP) {
    console.log('E-mail não configurado (faltam variáveis de ambiente). Pulei o envio.');
    return;
  }
  try {
    await transporter.sendMail({
      from: `"Economix" <${process.env.EMAIL_USUARIO}>`,
      to: destinatario,
      subject: assunto,
      text: texto
    });
    console.log(`E-mail enviado para ${destinatario}`);
  } catch (erro) {
    console.error('Erro ao enviar e-mail:', erro.message);
  }
}

// ==============================
// EVOLUTION API - NOVO
// ==============================
async function enviarZap(telefone, mensagem){
  // Pode configurar no Render como variáveis, mas já deixo fallback com seus dados
  const baseUrl = (process.env.EVOLUTION_API_URL || 'https://evolution-api-production-d61a.up.railway.app').replace(/\/$/, '');
  const apikey = process.env.EVOLUTION_API_KEY || process.env.EVOLUTION_APIKEY || '998142A660D9-4A2F-A04A-A01B1B9AE0C5';
  const instance = process.env.EVOLUTION_INSTANCE || 'economix';

  if(!baseUrl || !apikey){
    console.log('[enviarZap] Evolution API não configurada, pulei envio para', telefone);
    return { ok: false, erro: 'Evolution API não configurada (faltam EVOLUTION_API_URL / EVOLUTION_API_KEY).' };
  }

  let telLimpo = String(telefone).replace(/\D/g,'');
  if(!telLimpo){
    console.log('[enviarZap] Telefone vazio ou inválido, pulei envio.');
    return { ok: false, erro: 'Telefone vazio ou inválido.' };
  }
  // Garante DDD + 55
  if(telLimpo.length <= 11) telLimpo = '55' + telLimpo;
  const telFinal = telLimpo; // Evolution aceita só número, sem @s.whatsapp.net no sendText

  try{
    const url = `${baseUrl}/message/sendText/${instance}`;
    console.log(`[enviarZap] Chamando ${url} pra ${telFinal}...`);
    const resp = await fetch(url, {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'apikey': apikey
      },
      body: JSON.stringify({
        number: telFinal,
        text: mensagem,
        options: {
          delay: 1200,
          presence: "composing"
        }
      })
    });
    const txt = await resp.text();
    console.log(`[enviarZap] Resposta Evolution para ${telFinal}: status ${resp.status} ->`, txt.slice(0,500));
    if (!resp.ok) return { ok: false, erro: `Evolution respondeu ${resp.status}: ${txt.slice(0,300)}` };
    return { ok: true };
  }catch(e){
    console.error('[enviarZap] Erro de conexão com a Evolution:', e.message);
    return { ok: false, erro: `Erro de conexão com a Evolution: ${e.message}` };
  }
}

// --- Middlewares e rotas (mantidas iguais) ---
async function autenticar(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ erro: 'Token não informado.' });
  const usuario = await Usuario.findOne({ token });
  if (!usuario || (usuario.tokenExpira && usuario.tokenExpira < new Date())) {
    return res.status(401).json({ erro: 'Sessão expirada ou inválida.' });
  }
  req.usuario = usuario;
  next();
}

const loginLimiter = rateLimit({ windowMs: 15*60*1000, max: 20, message: { erro: 'Muitas tentativas, tente em 15 min' } });

app.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ erro: 'Preencha todos os campos.' });
    const emailLower = email.toLowerCase();
    if (await Usuario.findOne({ email: emailLower })) return res.status(400).json({ erro: 'E-mail já cadastrado.' });
    const sal = crypto.randomBytes(16).toString('hex');
    const senhaHash = gerarHash(senha, sal);
    const codigo = gerarCodigo();
    const usuario = await Usuario.create({
      nome, email: emailLower, sal, senhaHash,
      token: gerarToken(), tokenExpira: gerarValidadeToken(),
      verificado: false, codigoVerificacao: codigo, codigoExpira: new Date(Date.now()+15*60*1000),
      lancamentos: [], metaAlvo: null
    });
    await enviarEmail(emailLower, 'Código de verificação - Economix', `Seu código é: ${codigo}`);
    res.json({ ok: true, msg: 'Cadastro criado, verifique seu e-mail.' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro no servidor ao cadastrar.' });
  }
});

app.post('/verificar-email', async (req, res) => {
  try {
    const { email, codigo } = req.body;
    const usuario = await Usuario.findOne({ email: email.toLowerCase() });
    if (!usuario) return res.status(400).json({ erro: 'Usuário não encontrado.' });
    if (usuario.codigoVerificacao !== codigo || usuario.codigoExpira < new Date()) return res.status(400).json({ erro: 'Código inválido ou expirado.' });
    usuario.verificado = true; usuario.codigoVerificacao = ''; await usuario.save();
    res.json({ ok: true, token: usuario.token, nome: usuario.nome, email: usuario.email });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao verificar.' });
  }
});

app.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email: email.toLowerCase() });
    if (!usuario || !usuario.sal || !usuario.senhaHash) return res.status(400).json({ erro: 'E-mail ou senha inválidos.' });
    if (!senhaConfere(senha, usuario.sal, usuario.senhaHash)) return res.status(400).json({ erro: 'E-mail ou senha inválidos.' });
    if (!usuario.verificado) return res.status(400).json({ erro: 'Confirme seu e-mail primeiro.' });
    // migra hash antigo se necessário
    if (!usuario.senhaHash.startsWith('scrypt:')) {
      usuario.senhaHash = gerarHash(senha, usuario.sal);
    }
    usuario.token = gerarToken(); usuario.tokenExpira = gerarValidadeToken(); await usuario.save();
    res.json({ token: usuario.token, nome: usuario.nome, email: usuario.email });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro no servidor ao entrar.' });
  }
});

app.post('/login-google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ erro: 'Credencial do Google ausente.' });
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();
    const nome = payload.name || 'Usuário';
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      usuario = await Usuario.create({ nome, email, googleId: payload.sub, verificado: true, token: gerarToken(), tokenExpira: gerarValidadeToken(), lancamentos: [], metaAlvo: null });
    } else {
      usuario.token = gerarToken(); usuario.tokenExpira = gerarValidadeToken(); usuario.verificado = true;
      if (!usuario.googleId) usuario.googleId = payload.sub; await usuario.save();
    }
    res.json({ token: usuario.token, nome: usuario.nome, email: usuario.email });
  } catch (erro) {
    console.error('Erro no login com Google:', erro.message);
    res.status(400).json({ erro: 'Não foi possível verificar o login do Google.' });
  }
});

app.post('/logout', autenticar, async (req, res) => {
  try { req.usuario.token = ''; req.usuario.tokenExpira = undefined; await req.usuario.save(); res.json({ ok: true }); }
  catch (erro) { res.status(500).json({ erro: 'Erro no servidor ao sair.' }); }
});

app.get('/dados', autenticar, (req, res) => {
  res.json({
    nome: req.usuario.nome, email: req.usuario.email, lancamentos: req.usuario.lancamentos,
    metaAlvo: req.usuario.metaAlvo, metas: req.usuario.metas, criadoEm: req.usuario.criadoEm,
    foto: req.usuario.foto, corEscolhida: req.usuario.corEscolhida, corLivreHex: req.usuario.corLivreHex,
    layoutAtual: req.usuario.layoutAtual, planoAtual: req.usuario.planoAtual, devAtivo: req.usuario.devAtivo,
    telefone: req.usuario.telefone, zapOptin: req.usuario.zapOptin, limiteGasto: req.usuario.limiteGasto,
    desafioSemana: req.usuario.desafioSemana
  });
});

app.post('/dados', autenticar, async (req, res) => {
  try {
    const { lancamentos, metaAlvo, foto, planoAtual, devAtivo, corEscolhida, limiteGasto, metas, corLivreHex, layoutAtual } = req.body;
    req.usuario.lancamentos = lancamentos || [];
    req.usuario.metaAlvo = metaAlvo ?? null;
    if (metas !== undefined) req.usuario.metas = metas;
    if (foto !== undefined) req.usuario.foto = foto;
    if (planoAtual !== undefined) req.usuario.planoAtual = planoAtual;
    if (devAtivo !== undefined) req.usuario.devAtivo = devAtivo;
    if (corEscolhida !== undefined) req.usuario.corEscolhida = corEscolhida;
    if (corLivreHex !== undefined) req.usuario.corLivreHex = corLivreHex;
    if (layoutAtual !== undefined) req.usuario.layoutAtual = layoutAtual;
    if (limiteGasto !== undefined) req.usuario.limiteGasto = limiteGasto;

    // Marca a data do lançamento mais recente (usado pra saber se o usuário ficou dias sem anotar nada)
    if (Array.isArray(lancamentos) && lancamentos.length > 0) {
      const datas = lancamentos.map(l => new Date(l.data)).filter(d => !isNaN(d));
      if (datas.length > 0) {
        const maisRecente = new Date(Math.max(...datas));
        req.usuario.ultimoLancamentoEm = maisRecente;
        req.usuario.avisoInatividadeEnviadoEm = null; // voltou a anotar, reseta o aviso de inatividade
      }
    }

    // Checa se algum gasto dessa semana quebrou o desafio ativo (ex: "Sem iFood")
    if (req.usuario.telefone && req.usuario.zapOptin && req.usuario.desafioPalavra && !req.usuario.desafioAvisoEnviado
        && Array.isArray(lancamentos)) {
      const chaveSemana = chaveSemanaAtual();
      if (req.usuario.desafioSemanaChave === chaveSemana) {
        const inicioSemana = new Date();
        inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
        inicioSemana.setHours(0, 0, 0, 0);
        const quebrou = lancamentos.some(l =>
          l.tipo === 'saida' &&
          new Date(l.data) >= inicioSemana &&
          String(l.descricao || '').toLowerCase().includes(req.usuario.desafioPalavra)
        );
        if (quebrou) {
          req.usuario.desafioAvisoEnviado = true;
          await enviarZap(req.usuario.telefone, `😬 Ih, achei um gasto que quebra o desafio da semana (${req.usuario.desafioSemana}). Bora tentar de novo semana que vem!`);
        }
      }
    }

    await req.usuario.save();
    res.json({ ok: true });
  } catch (erro) { res.status(500).json({ erro: 'Erro no servidor ao salvar os dados.' }); }
});

// --- Desafio da semana: rotação simples por número da semana do ano ---
const DESAFIOS_SEMANA = [
  { palavra: 'ifood', texto: 'Sem iFood essa semana 🍔🚫' },
  { palavra: 'uber', texto: 'Sem Uber essa semana 🚗🚫' },
  { palavra: 'lanche', texto: 'Sem lanchinho essa semana 🍟🚫' },
  { palavra: 'jogo', texto: 'Sem gastar com jogo essa semana 🎮🚫' },
  { palavra: 'delivery', texto: 'Sem pedir delivery essa semana 📦🚫' }
];
function chaveSemanaAtual() {
  const hoje = new Date();
  const inicioAno = new Date(hoje.getFullYear(), 0, 1);
  const semana = Math.ceil((((hoje - inicioAno) / 86400000) + inicioAno.getDay() + 1) / 7);
  return `${hoje.getFullYear()}-S${semana}`;
}
function desafioDaSemana() {
  const hoje = new Date();
  const inicioAno = new Date(hoje.getFullYear(), 0, 1);
  const semana = Math.ceil((((hoje - inicioAno) / 86400000) + inicioAno.getDay() + 1) / 7);
  return DESAFIOS_SEMANA[semana % DESAFIOS_SEMANA.length];
}

// Função reutilizável: envia o resumo diário (e-mail + zap) pra quem tem zapOptin ativo e telefone salvo.
// Chamada tanto pelo cron interno quanto pela rota /cron/resumo-diario (pra um cron externo poder disparar).
async function enviarResumosDiarios() {
  console.log('[resumo-diario] Iniciando envio diário...');
  const usuariosComZap = await Usuario.find({ telefone: { $ne: '' }, zapOptin: true });
  const usuariosComEmailSoTexto = await Usuario.find({ $or: [{ telefone: '' }, { zapOptin: false }] });
  const chaveSemana = chaveSemanaAtual();
  const ehSegunda = new Date().getDay() === 1;
  const desafio = desafioDaSemana();
  console.log(`[resumo-diario] ${usuariosComZap.length} usuário(s) com WhatsApp ativo, ${usuariosComEmailSoTexto.length} só por e-mail.`);

  async function processar(usuario, temZap) {
    const hoje = new Date(); const mesAtual = hoje.getMonth(); const anoAtual = hoje.getFullYear();
    const doMes = usuario.lancamentos.filter(l => { const d = new Date(l.data); return d.getMonth() === mesAtual && d.getFullYear() === anoAtual; });
    const entradas = doMes.filter(l => l.tipo === 'entrada').reduce((s, l) => s + l.valor, 0);
    const saidas = doMes.filter(l => l.tipo === 'saida').reduce((s, l) => s + l.valor, 0);
    const saldo = entradas - saidas;
    const texto = `Olá, ${usuario.nome}!\n\nResumo do seu saldo esse mês:\nEntradas: R$ ${entradas.toFixed(2)}\nSaídas: R$ ${saidas.toFixed(2)}\nSaldo: R$ ${saldo.toFixed(2)}\n\nNão esqueça de registrar seus gastos de hoje no app!`;
    console.log(`[resumo-diario] Enviando e-mail para ${usuario.email}...`);
    await enviarEmail(usuario.email, 'Resumo diário do seu saldo 📊', texto);

    if (temZap) {
      const textoZap = `📊 *Resumo Economix - ${hoje.toLocaleDateString('pt-BR')}*\nOlá ${usuario.nome}!\nEntradas: R$ ${entradas.toFixed(2)}\nSaídas: R$ ${saidas.toFixed(2)}\n*Saldo: R$ ${saldo.toFixed(2)}*\nAbra o app 👉 https://eduardo852823-eng.github.io/meu-app-saldo/`;
      console.log(`[resumo-diario] Enviando Zap para ${usuario.nome} (${usuario.telefone})...`);
      const ok = await enviarZap(usuario.telefone, textoZap);
      console.log(`[resumo-diario] Zap para ${usuario.telefone}: ${ok.ok ? 'ENVIADO ✅' : 'FALHOU ❌ (' + ok.erro + ')'}`);

      if (ehSegunda && usuario.desafioSemanaChave !== chaveSemana) {
        usuario.desafioSemana = desafio.texto;
        usuario.desafioPalavra = desafio.palavra;
        usuario.desafioSemanaChave = chaveSemana;
        usuario.desafioAvisoEnviado = false;
        await usuario.save();
        console.log(`[resumo-diario] Enviando desafio da semana para ${usuario.telefone}...`);
        await enviarZap(usuario.telefone, `🏆 *Desafio da semana:*\n${desafio.texto}\nBora tentar? Eu aviso se você quebrar 😉`);
      }
    }
  }

  for (const usuario of usuariosComZap) await processar(usuario, true);
  for (const usuario of usuariosComEmailSoTexto) await processar(usuario, false);
  console.log('[resumo-diario] Envio diário finalizado.');
}

// CRON 8h — resumo diário + desafio da semana (toda segunda)
cron.schedule('0 8 * * *', () => { enviarResumosDiarios().catch(e => console.error('[resumo-diario] Erro:', e.message)); });

// Rota de backup: um cron externo grátis (ex: cron-job.org) pode chamar isso todo dia 8h
// pra garantir o envio mesmo se o Render tiver colocado o servidor pra dormir (comum no plano free).
// Protegida por uma chave simples pra ninguém disparar resumo à toa.
app.post('/cron/resumo-diario', async (req, res) => {
  const chave = req.headers['x-cron-key'] || req.query.chave;
  if (process.env.CRON_SECRET && chave !== process.env.CRON_SECRET) {
    return res.status(401).json({ erro: 'Chave do cron inválida.' });
  }
  try {
    await enviarResumosDiarios();
    res.json({ ok: true });
  } catch (erro) {
    console.error('[resumo-diario] Erro via rota externa:', erro.message);
    res.status(500).json({ erro: erro.message });
  }
});

// CRON 21h — pergunta noturna "Como foi hoje?" por WhatsApp
cron.schedule('0 21 * * *', async () => {
  console.log('Executando pergunta noturna...');
  try {
    const usuarios = await Usuario.find({ telefone: { $ne: '' }, zapOptin: true });
    for (const usuario of usuarios) {
      const texto = `🌙 Como foi hoje, ${usuario.nome}?\nResponde aqui mesmo:\n😍 Gastei pouco\n😐 Normal\n😭 Gastei muito`;
      await enviarZap(usuario.telefone, texto);
    }
  } catch (erro) { console.error('Erro na pergunta noturna:', erro.message); }
});

// CRON 20h — avisa quem ficou 2 dias (ou mais) sem lançar nada
cron.schedule('0 20 * * *', async () => {
  console.log('Checando inatividade...');
  try {
    const usuarios = await Usuario.find({ telefone: { $ne: '' }, zapOptin: true });
    const agora = new Date();
    for (const usuario of usuarios) {
      if (!usuario.ultimoLancamentoEm) continue;
      const diasSemLancar = Math.floor((agora - new Date(usuario.ultimoLancamentoEm)) / 86400000);
      const diasDesdeUltimoAviso = usuario.avisoInatividadeEnviadoEm
        ? Math.floor((agora - new Date(usuario.avisoInatividadeEnviadoEm)) / 86400000)
        : Infinity;
      // Avisa a cada 2 dias sem lançar (e não repete no mesmo intervalo de 2 dias)
      if (diasSemLancar >= 2 && diasDesdeUltimoAviso >= 2) {
        await enviarZap(usuario.telefone, `Ei, faz ${diasSemLancar} dias que você não anota nada 😬\nBora dar uma olhada no Economix?`);
        usuario.avisoInatividadeEnviadoEm = agora;
        await usuario.save();
      }
    }
  } catch (erro) { console.error('Erro ao checar inatividade:', erro.message); }
});

app.post('/telefone', async (req, res) => {
  try{
    const auth = req.headers.authorization?.replace('Bearer ', '');
    const usuario = await Usuario.findOne({ token: auth });
    if(!usuario) return res.status(401).json({erro:'Sessão inválida'});
    const { telefone, zapOptin } = req.body;
    usuario.telefone = String(telefone).replace(/\D/g,'');
    if(typeof zapOptin !== 'undefined') usuario.zapOptin = !!zapOptin;
    await usuario.save();
    if(usuario.zapOptin){ await enviarZap(usuario.telefone, `Oi ${usuario.nome}! 👋 Economix ativado no zap ✅\nVou te mandar resumo diário 8h aqui.`); }
    res.json({ok:true});
  }catch(e){ console.error(e); res.status(500).json({erro:'Erro'}); }
});

app.post('/testar-zap', async (req, res) => {
  try{
    const { telefone } = req.body;
    if(!telefone) return res.status(400).json({erro:'Telefone vazio'});
    const resultado = await enviarZap(telefone, `Economix teste ✅ Seu Zap funciona na Evolution! Você vai receber resumos aqui.`);
    if (resultado.ok) return res.json({ ok: true, msg: 'Enviado via Evolution' });
    res.status(502).json({ ok: false, erro: resultado.erro || 'Falha ao enviar, sem detalhe.' });
  }catch(e){ console.error(e); res.status(500).json({erro: e.message}); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} - Evolution API integrada`);
});
