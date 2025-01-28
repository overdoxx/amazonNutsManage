// middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error(err.stack);
  
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Ocorreu um erro interno no servidor';
  
    res.status(statusCode).render('error', {
      title: 'Erro',
      statusCode,
      message,
      error: process.env.NODE_ENV === 'development' ? err : {}
    });
  }
  
  module.exports = errorHandler;