const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');
const cotizarRoutes = require('./routes/cotizar');
const reclamacionesRoutes = require('./routes/reclamaciones');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/cotizar', cotizarRoutes);
app.use('/api/reclamaciones', reclamacionesRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', async (req, res) => {
    try {
        await pool.execute('SELECT 1');
        res.json({ status: 'OK', database: 'Conectado' });
    } catch (err) {
        res.status(500).json({ status: 'ERROR', database: 'Sin conexión', detalle: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor TRIAD corriendo en http://localhost:${PORT}`);
});
