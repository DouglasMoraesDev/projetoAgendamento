const pool = require('../config/db');

class Consulta {
  static async create({ paciente_id, nutricionista_id, data_hora, tipo, status }) {
    const [res] = await pool.query(
      `INSERT INTO consulta
       (paciente_id, nutricionista_id, data_hora, tipo, status)
       VALUES (?, ?, ?, ?, ?)`,
      [paciente_id, nutricionista_id, data_hora, tipo, status]
    );
    return res.insertId;
  }

  static async findAllByNutri(nutriId) {
    const [rows] = await pool.query(
      `SELECT c.*, p.nome AS paciente_nome
       FROM consulta c
       JOIN paciente p ON c.paciente_id = p.id
       WHERE c.nutricionista_id = ?
       ORDER BY c.data_hora DESC`,
      [nutriId]
    );
    return rows;
  }

  static async updateStatus(id, status) {
    await pool.query(
      `UPDATE consulta SET status = ? WHERE id = ?`,
      [status, id]
    );
  }
}

module.exports = Consulta;
