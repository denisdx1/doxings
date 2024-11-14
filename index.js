// index.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

// Usar el puerto que nos da Render
const port = process.env.PORT || 3000;

// Configuración de la conexión a PostgreSQL usando variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(express.json());

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando correctamente' });
});

// Tu ruta para buscar por documento
app.get('/personas/:documento', async (req, res) => {
  const { documento } = req.params;
  
  try {
    const query = `
      SELECT *
      documento,
      paterno,
      materno,
      nombres,
      nacimiento,
      edad,
      ubigeo,
      ubicacion,
      direccion
      FROM data 
      WHERE documento = $1
      LIMIT 1
    `;
    
    const result = await pool.query(query, [documento]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontró ninguna persona con ese documento'
      });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor',
      detalle: error.message
    });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});


