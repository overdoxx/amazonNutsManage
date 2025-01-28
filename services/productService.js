const Database = require('../config/database');

class ProductService {
  async getAllProducts() {
    try {
      return await Database.read();
    } catch (error) {
      throw new Error('Erro ao buscar produtos');
    }
  }

  async addProduct(productData) {
    try {
      const products = await Database.read();
      const newProduct = {
        id: Date.now().toString(),
        name: productData.name,
        quantity: parseFloat(productData.quantity),
        unit: productData.unit || 'QTD',
        createdAt: new Date().toISOString()
      };
      
      products.push(newProduct);
      await Database.write(products);
      return newProduct;
    } catch (error) {
      throw new Error('Erro ao adicionar produto');
    }
  }

  async updateProduct(id, productData) {
    try {
      const products = await Database.read();
      const index = products.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new Error('Produto não encontrado');
      }

      products[index] = {
        ...products[index],
        name: productData.name,
        quantity: parseFloat(productData.quantity),
        unit: productData.unit || products[index].unit,
        updatedAt: new Date().toISOString()
      };

      await Database.write(products);
      return products[index];
    } catch (error) {
      throw new Error('Erro ao atualizar produto');
    }
  }

  async deleteProduct(id) {
    try {
      const products = await Database.read();
      const filteredProducts = products.filter(p => p.id !== id);
      await Database.write(filteredProducts);
    } catch (error) {
      throw new Error('Erro ao deletar produto');
    }
  }


  async searchProducts(query) {
    try {
      const products = await Database.read();
      
      return products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
    } catch (error) {
      throw new Error('Erro ao buscar produtos');
    }
  }
}

module.exports = new ProductService();
