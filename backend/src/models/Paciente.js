const pool = require('../config/db');

class Paciente {
  static async create({ nutricionista_id, nome, email, data_nasc, historico, alergias, objetivos }) {
    const [res] = await pool.query(
      `INSERT INTO paciente
       (nutricionista_id, nome, email, data_nasc, historico, alergias, objetivos)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nutricionista_id, nome, email, data_nasc, historico, alergias, objetivos]
    );
    return res.insertId;
  }

  static async findAllByNutri(nutriId) {
    const [rows] = await pool.query(
      `SELECT * FROM paciente WHERE nutricionista_id = ?`,
      [nutriId]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT * FROM paciente WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  static async update(id, data) {
    const cols = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const vals = [...Object.values(data), id];
    await pool.query(`UPDATE paciente SET ${cols} WHERE id = ?`, vals);
  }

  static async delete(id) {
    await pool.query(`DELETE FROM paciente WHERE id = ?`, [id]);
  }
}

module.exports = Paciente;
