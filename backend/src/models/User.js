const pool = require('../config/db');

class User {
  static async create({ nome, email, senhaHash }) {
    const [res] = await pool.query(
      `INSERT INTO nutricionista (nome, email, senha_hash)
       VALUES (?, ?, ?)`,
      [nome, email, senhaHash]
    );
    return res.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      `SELECT * FROM nutricionista WHERE email = ?`,
      [email]
    );
    return rows[0];
  }
}

module.exports = User;
