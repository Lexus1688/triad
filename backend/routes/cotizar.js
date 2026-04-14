const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
    const { nombres, telefono, correo, mensaje } = req.body;
    if (!nombres || !telefono || !correo) {
        return res.status(400).json({ error: 'Los campos nombres, teléfono y correo son obligatorios.' });
    }
    try {
        const [result] = await pool.execute(
            'INSERT INTO cotizaciones (nombres, telefono, correo, mensaje) VALUES (?, ?, ?, ?)',
            [nombres, telefono, correo, mensaje || '']
        );
        res.status(201).json({ message: 'Cotización registrada correctamente.', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM cotizaciones ORDER BY fecha_registro DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM cotizaciones WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Cotización no encontrada.' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

router.put('/:id', async (req, res) => {
    const { nombres, telefono, correo, mensaje } = req.body;
    if (!nombres || !telefono || !correo) {
        return res.status(400).json({ error: 'nombres, teléfono y correo son obligatorios.' });
    }
    try {
        const [result] = await pool.execute(
            'UPDATE cotizaciones SET nombres=?, telefono=?, correo=?, mensaje=? WHERE id=?',
            [nombres, telefono, correo, mensaje || '', req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cotización no encontrada.' });
        res.json({ message: 'Cotización actualizada correctamente.' });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM cotizaciones WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cotización no encontrada.' });
        res.json({ message: 'Cotización eliminada correctamente.' });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;
