const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/login', async (req, res) => {
    const { usuario, password } = req.body;
    if (!usuario || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña son obligatorios.' });
    }
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM usuarios WHERE usuario = ? AND password = ?',
            [usuario, password]
        );
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
        }
        res.json({ ok: true, usuario: rows[0].usuario });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;