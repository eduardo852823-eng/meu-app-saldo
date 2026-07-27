const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Configuração do envio de e-mail (Nodemailer)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'SEU_EMAIL@gmail.com', // Substitua pelo seu e-mail
    pass: 'SUA_SENHA_DE_APP'     // Substitua pela sua Senha de App do Google
  }
});

// 2. Rota simples de teste
app.get('/', (req, res) => {
  res.send('API do App de Saldo rodando com sucesso!');
});

// 3. Agendador: roda todos os dias às 08:00 da manhã
cron.schedule('0 8 * * *', async () => {
  console.log('Executando envio diário de e-mails...');
  
  const mailOptions = {
    from: '"Meu App Saldo" <SEU_EMAIL@gmail.com>',
    to: 'usuario@exemplo.com', // E-mail que vai receber
    subject: 'Resumo Diário do seu Saldo 📊',
    text: 'Olá! Não se esqueça de registrar seus gastos de hoje no aplicativo.'
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
