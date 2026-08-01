const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const app = express();
app.use(cors());
app.use(express.json());

// ==============================
// Conexão com o MongoDB Atlas (banco de verdade, não se apaga quando o
// servidor reinicia — ao contrário do arquivo JSON que usávamos antes)
// A string de conexão vem de uma variável de ambiente (MONGODB_URI),
// configurada no painel do Render.
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
  data: Date
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
  criadoEm: { type: Date, default: Date.now }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// ==============================
// Senha: hash com sal (nunca guardamos a senha em texto puro)
// ==============================
function gerarHash(senha, sal) {
  return crypto.createHash('sha256').update(senha + sal).digest('hex');
}

function gerarToken() {
  return crypto.randomBytes(24).toString('hex');
}

function gerarCodigo() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ==============================
// E-mail (Nodemailer) — credenciais vêm de variáveis de ambiente
// ==============================
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
// Middleware de autenticação
// ==============================
async function autenticar(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ erro: 'Não autenticado.' });

  const usuario = await Usuario.findOne({ token });
  if (!usuario) return res.status(401).json({ erro: 'Sessão inválida. Faça login de novo.' });

  req.usuario = usuario;
  next();
}

// ==============================
// Rotas
// ==============================

app.get('/', (req, res) => {
  res.send('API do Economix rodando com sucesso!');
});

// Cadastro
app.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Preencha nome, e-mail e senha.' });
    }

    const jaExiste = await Usuario.findOne({ email: email.toLowerCase() });
    if (jaExiste && jaExiste.verificado) {
      return res.status(400).json({ erro: 'Já existe uma conta com esse e-mail.' });
    }

    const sal = crypto.randomBytes(8).toString('hex');
    const codigo = gerarCodigo();
    const dadosUsuario = {
      nome,
      email: email.toLowerCase(),
      sal,
      senhaHash: gerarHash(senha, sal),
      verificado: false,
      codigoVerificacao: codigo,
      codigoExpira: new Date(Date.now() + 15 * 60 * 1000) // 15 minutos
    };

    if (jaExiste) {
      Object.assign(jaExiste, dadosUsuario);
      await jaExiste.save();
    } else {
      await Usuario.create({ ...dadosUsuario, lancamentos: [], metaAlvo: null });
    }

    await enviarEmail(
      email,
      'Confirme seu e-mail — Economix',
      `Olá, ${nome}!\n\nSeu código de confirmação é: ${codigo}\n\nEle vale por 15 minutos.`
    );

    res.json({ precisaVerificar: true, email: email.toLowerCase() });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro no servidor ao criar a conta.' });
  }
});

// Confirmar código de verificação
app.post('/verificar-email', async (req, res) => {
  try {
    const { email, codigo } = req.body;
    if (!email || !codigo) return res.status(400).json({ erro: 'Preencha o código.' });

    const usuario = await Usuario.findOne({ email: email.toLowerCase() });
    if (!usuario) return res.status(400).json({ erro: 'Conta não encontrada.' });

    if (usuario.verificado) {
      return res.status(400).json({ erro: 'Essa conta já foi verificada. Tenta entrar direto.' });
    }

    if (!usuario.codigoVerificacao || usuario.codigoVerificacao !== codigo) {
      return res.status(400).json({ erro: 'Código incorreto.' });
    }

    if (usuario.codigoExpira < new Date()) {
      return res.status(400).json({ erro: 'Código expirado. Pede um novo.' });
    }

    usuario.verificado = true;
    usuario.codigoVerificacao = undefined;
    usuario.codigoExpira = undefined;
    usuario.token = gerarToken();
    await usuario.save();

    res.json({ token: usuario.token, nome: usuario.nome, email: usuario.email });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro no servidor ao verificar o código.' });
  }
});

// Reenviar código de verificação
app.post('/reenviar-codigo', async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email: email?.toLowerCase() });
    if (!usuario) return res.status(400).json({ erro: 'Conta não encontrada.' });
    if (usuario.verificado) return res.status(400).json({ erro: 'Essa conta já está verificada.' });

    const codigo = gerarCodigo();
    usuario.codigoVerificacao = codigo;
    usuario.codigoExpira = new Date(Date.now() + 15 * 60 * 1000);
    await usuario.save();

    await enviarEmail(
      usuario.email,
      'Novo código de confirmação — Economix',
      `Seu novo código é: ${codigo}\n\nEle vale por 15 minutos.`
    );

    res.json({ ok: true });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro no servidor ao reenviar o código.' });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Preencha e-mail e senha.' });
    }

    const usuario = await Usuario.findOne({ email: email.toLowerCase() });
    if (!usuario) {
      return res.status(400).json({ erro: 'E-mail ou senha incorretos.' });
    }

    if (!usuario.verificado) {
      return res.status(400).json({ erro: 'Confirma seu e-mail antes de entrar.', precisaVerificar: true, email: usuario.email });
    }

    const hashDigitado = gerarHash(senha, usuario.sal);
    if (hashDigitado !== usuario.senhaHash) {
      return res.status(400).json({ erro: 'E-mail ou senha incorretos.' });
    }

    usuario.token = gerarToken();
    await usuario.save();

    res.json({
      token: usuario.token,
      nome: usuario.nome,
      email: usuario.email
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro no servidor ao entrar.' });
  }
});

// Login com Google
app.post('/login-google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ erro: 'Credencial do Google ausente.' });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();
    const nome = payload.name || 'Usuário';

    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      usuario = await Usuario.create({
        nome,
        email,
        googleId: payload.sub,
        verificado: true,
        token: gerarToken(),
        lancamentos: [],
        metaAlvo: null
      });
    } else {
      usuario.token = gerarToken();
      usuario.verificado = true;
      if (!usuario.googleId) usuario.googleId = payload.sub;
      await usuario.save();
    }

    res.json({ token: usuario.token, nome: usuario.nome, email: usuario.email });
  } catch (erro) {
    console.error('Erro no login com Google:', erro.message);
    res.status(400).json({ erro: 'Não foi possível verificar o login do Google.' });
  }
});

// Pegar dados do usuário logado
app.get('/dados', autenticar, (req, res) => {
  res.json({
    nome: req.usuario.nome,
    email: req.usuario.email,
    lancamentos: req.usuario.lancamentos,
    metaAlvo: req.usuario.metaAlvo,
    metas: req.usuario.metas,
    criadoEm: req.usuario.criadoEm,
    foto: req.usuario.foto,
    corEscolhida: req.usuario.corEscolhida,
    corLivreHex: req.usuario.corLivreHex,
    layoutAtual: req.usuario.layoutAtual,
    planoAtual: req.usuario.planoAtual,
    devAtivo: req.usuario.devAtivo,
    limiteGasto: req.usuario.limiteGasto
  });
});

// Salvar dados do usuário logado
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
    await req.usuario.save();
    res.json({ ok: true });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro no servidor ao salvar os dados.' });
  }
});

// ==============================
// E-mail diário — roda todo dia às 08:00 (horário do servidor)
// ==============================
cron.schedule('0 8 * * *', async () => {
  console.log('Executando envio diário de e-mails...');

  try {
    const usuarios = await Usuario.find();

    for (const usuario of usuarios) {
      const hoje = new Date();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();

      const doMes = usuario.lancamentos.filter(l => {
        const d = new Date(l.data);
        return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
      });

      const entradas = doMes.filter(l => l.tipo === 'entrada').reduce((s, l) => s + l.valor, 0);
      const saidas = doMes.filter(l => l.tipo === 'saida').reduce((s, l) => s + l.valor, 0);
      const saldo = entradas - saidas;

      const texto = `Olá, ${usuario.nome}!\n\nResumo do seu saldo esse mês:\nEntradas: R$ ${entradas.toFixed(2)}\nSaídas: R$ ${saidas.toFixed(2)}\nSaldo: R$ ${saldo.toFixed(2)}\n\nNão esqueça de registrar seus gastos de hoje no app!`;

      await enviarEmail(usuario.email, 'Resumo diário do seu saldo 📊', texto);
    }
  } catch (erro) {
    console.error('Erro ao rodar o envio diário:', erro.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
