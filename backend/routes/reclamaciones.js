const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
    const {
        nombre, apellido, tipo_documento, num_documento,
        correo, celular, tipo_bien, descripcion_bien,
        tipo_reclamo, detalle_reclamo, accion_tomada
    } = req.body;

    if (!nombre || !apellido || !num_documento || !correo || !celular) {
        return res.status(400).json({ error: 'Los campos nombre, apellido, documento, correo y celular son obligatorios.' });
    }

    try {
        const [result] = await pool.execute(
            `INSERT INTO reclamaciones
            (nombre, apellido, tipo_documento, num_documento, correo, celular, tipo_bien, descripcion_bien, tipo_reclamo, detalle_reclamo, accion_tomada)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, tipo_documento || 'DNI', num_documento,
             correo, celular, tipo_bien || 'Servicio',
             descripcion_bien || '', tipo_reclamo || 'Reclamo',
             detalle_reclamo || '', accion_tomada || '']
        );
        res.status(201).json({ message: 'Reclamación registrada correctamente.', id: result.insertId });
    } catch (err) {
        console.error('Error al guardar reclamación:', err.message);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM reclamaciones ORDER BY fecha_registro DESC');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener reclamaciones:', err.message);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;
