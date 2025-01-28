// config/database.js
const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../data/products.json');

const Database = {
  async init() {
    try {
      await fs.access(dataPath);
    } catch {
      await fs.writeFile(dataPath, JSON.stringify([]));
    }
  },

  async read() {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  },

  async write(data) {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
  }
};

// Inicializa o banco de dados
Database.init();

module.exports = Database;