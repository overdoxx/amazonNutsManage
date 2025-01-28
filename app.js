// app.js
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});