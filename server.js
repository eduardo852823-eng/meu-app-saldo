const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// ==============================
// "Banco de dados" simples em arquivo JSON
// (pra um projeto maior, o ideal seria um banco de verdade tipo MongoDB/Postgres,
//  mas isso já funciona bem pra aprender e pra poucos usuários)
// ==============================
const CAMINHO_DB = path.join(__dirname, 'dados.json');

function lerDB() {
  if (!fs.existsSync(CAMINHO_DB)) {
    fs.writeFileSync(CAMINHO_DB, JSON.stringify({ usuarios: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(CAMINHO_DB, 'utf8'));
}

function salvarDB(db) {
  fs.writeFileSync(CAMINHO_DB, JSON.stringify(db, null, 2));
}

// ==============================
// Senha: nunca guardamos a senha em texto puro.
// Aqui usamos hash simples (sha256 + sal). Pra produção de verdade,
// o ideal é usar a biblioteca "bcrypt", mas isso já é bem mais seguro
// que guardar a senha crua.
// ==============================
function gerarHash(senha, sal) {
  return crypto.createHash('sha256').update(senha + sal).digest('hex');
}

function gerarToken() {
  return crypto.randomBytes(24).toString('hex');
}

// ==============================
// E-mail (Nodemailer)
// As credenciais vêm de variáveis de ambiente — configuradas no painel do
// Render, NUNCA escritas direto aqui no código.
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
      from: `"saldo." <${process.env.EMAIL_USUARIO}>`,
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
// Verifica se o token enviado no cabeçalho pertence a um usuário válido
// ==============================
function autenticar(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ erro: 'Não autenticado.' });

  const db = lerDB();
  const usuario = db.usuarios.find(u => u.token === token);
  if (!usuario) return res.status(401).json({ erro: 'Sessão inválida. Faça login de novo.' });

  req.usuario = usuario;
  next();
}

// ==============================
// Rotas
// ==============================

app.get('/', (req, res) => {
  res.send('API do saldo. rodando com sucesso!');
});

// Cadastro
app.post('/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha nome, e-mail e senha.' });
  }

  const db = lerDB();
  const jaExiste = db.usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (jaExiste) {
    return res.status(400).json({ erro: 'Já existe uma conta com esse e-mail.' });
  }

  const sal = crypto.randomBytes(8).toString('hex');
  const novoUsuario = {
    id: crypto.randomUUID(),
    nome,
    email: email.toLowerCase(),
    sal,
    senhaHash: gerarHash(senha, sal),
    token: gerarToken(),
    lancamentos: [],
    metaAlvo: null,
    criadoEm: new Date().toISOString()
  };

  db.usuarios.push(novoUsuario);
  salvarDB(db);

  res.json({
    token: novoUsuario.token,
    nome: novoUsuario.nome,
    email: novoUsuario.email
  });
});

// Login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ erro: 'Preencha e-mail e senha.' });
  }

  const db = lerDB();
  const usuario = db.usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!usuario) {
    return res.status(400).json({ erro: 'E-mail ou senha incorretos.' });
  }

  const hashDigitado = gerarHash(senha, usuario.sal);
  if (hashDigitado !== usuario.senhaHash) {
    return res.status(400).json({ erro: 'E-mail ou senha incorretos.' });
  }

  // Gera um novo token a cada login
  usuario.token = gerarToken();
  salvarDB(db);

  res.json({
    token: usuario.token,
    nome: usuario.nome,
    email: usuario.email
  });
});

// Pegar dados do usuário logado (lançamentos, meta)
app.get('/dados', autenticar, (req, res) => {
  res.json({
    nome: req.usuario.nome,
    email: req.usuario.email,
    lancamentos: req.usuario.lancamentos,
    metaAlvo: req.usuario.metaAlvo
  });
});

// Salvar dados do usuário logado (substitui tudo, igual o backup local)
app.post('/dados', autenticar, (req, res) => {
  const { lancamentos, metaAlvo } = req.body;

  const db = lerDB();
  const usuario = db.usuarios.find(u => u.id === req.usuario.id);
  usuario.lancamentos = lancamentos || [];
  usuario.metaAlvo = metaAlvo ?? null;
  salvarDB(db);

  res.json({ ok: true });
});

// ==============================
// E-mail diário — roda todo dia às 08:00 (horário do servidor)
// Manda um resumo pra cada usuário cadastrado
// ==============================
cron.schedule('0 8 * * *', async () => {
  console.log('Executando envio diário de e-mails...');
  const db = lerDB();

  for (const usuario of db.usuarios) {
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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
