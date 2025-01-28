// controllers/productController.js
const productService = require('../services/productService');
const excelGenerator = require('../utils/excelGenerator');

class ProductController {
  async index(req, res, next) {
    try {
      const products = await productService.getAllProducts();
      res.render('products/index', { 
        products,
        title: 'Controle de Estoque'
      });
    } catch (error) {
      next(error);
    }
  }

  async add(req, res, next) {
    try {
      await productService.addProduct(req.body);
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      await productService.updateProduct(req.params.id, req.body);
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id);
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  }

  async exportToExcel(req, res, next) {
    try {
      const products = await productService.getAllProducts();
      const buffer = await excelGenerator.generateExcel(products);
      
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=produtos${randomNumber}.xlsx`);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }

  // Método para buscar produtos
  async search(req, res, next) {
    try {
      const query = req.query.query || '';
      const products = await productService.searchProducts(query);
      res.json({ products });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
