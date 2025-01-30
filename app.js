// app.js
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const errorHandler = require('./middlewares/errorHandler');
const https = require('https');
const fs = require('fs');
const http = require('http');

const app = express();

// Caminhos dos certificados SSL
const CERT_PATH = '/etc/letsencrypt/live/amazonnuts.com.br/fullchain.pem';
const KEY_PATH = '/etc/letsencrypt/live/amazonnuts.com.br/privkey.pem';

// Configurações
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
const routes = require('./routes');
app.use('/', routes);

// 404 - Not Found
app.use((req, res, next) => {
  const error = new Error('Página não encontrada');
  error.statusCode = 404;
  next(error);
});

// Tratamento de erros
app.use(errorHandler);

// Redirecionamento de HTTP para HTTPS
const redirectApp = express();
redirectApp.get('*', (req, res) => {
  res.redirect('https://' + req.headers.host + req.url);
});
http.createServer(redirectApp).listen(80, () => {
  console.log('Redirecionando HTTP para HTTPS na porta 80');
});

// Configuração do HTTPS
const options = {
  key: fs.readFileSync(KEY_PATH),
  cert: fs.readFileSync(CERT_PATH),
};

https.createServer(options, app).listen(443, () => {
  console.log('Servidor HTTPS rodando na porta 443');
});

// Caso precise rodar também na porta 3000 para testes locais (não é necessário em produção)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
