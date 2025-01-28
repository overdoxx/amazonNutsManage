// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.index);
router.post('/products/add', productController.add);
router.post('/products/edit/:id', productController.update);
router.post('/products/delete/:id', productController.delete);
router.get('/products/export', productController.exportToExcel);
router.get('/products/search', productController.search);


module.exports = router;