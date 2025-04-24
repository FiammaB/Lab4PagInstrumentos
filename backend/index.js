import mysql from 'mysql2/promise';
import express from 'express';
import cors from 'cors';

//toda la confi para imgenes
import multer from 'multer';
import path from 'path';
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
//npm install multer
//npm install -D @types/multer
app.use('/uploads', express.static('uploads'));

// Configuración de Multer para guardar archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});


const upload = multer({ storage: storage });
const db = await mysql.createConnection({ 
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'instrumentos'
});
app.get('/instrumentos', async (req, res) => {
    try {
        const [rows] =  await (await db).execute('SELECT * FROM instrumento');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);
app.get('/instrumentos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM instrumento WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Instrumento no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}  )
app.listen(port, () => {
    console.log(`El servidor esta corriendo en  http://localhost:${port}`);
}  )
// Endpoint para actualizar un instrumento
app.put('/instrumentos/:id', upload.single('imagenFile'), async (req, res) => {
  const { id } = req.params;
  
  try {
      let imagenUrl = req.body.imagen;  // Mantener la imagen existente por defecto
      
      // Si se subió nueva imagen
      if (req.file) {
          imagenUrl = `${req.file.filename}`;
          // Aquí podrías eliminar la imagen anterior si lo deseas
      }

      const instrumentoData = {
          nombre: req.body.nombre,
          marca: req.body.marca,
          modelo: req.body.modelo,
          imagen: imagenUrl,
          precio: parseFloat(req.body.precio),
          costoEnvio: req.body.costoEnvio,
          cantidadVendida: parseInt(req.body.cantidadVendida),
          descripcion: req.body.descripcion
      };

      const [result] = await db.execute(
          'UPDATE instrumento SET nombre=?, marca=?, modelo=?, imagen=?, precio=?, costoEnvio=?, cantidadVendida=?, descripcion=? WHERE id=?',
          [...Object.values(instrumentoData), id]
      );

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Instrumento no encontrado' });
      }

      res.json({ 
          success: true,
          imagenUrl: imagenUrl
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint para crear un nuevo instrumento
app.post('/instrumentos', upload.single('imagenFile'), async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ error: 'No se subió ninguna imagen' });
      }

      const imagenUrl = `${req.file.filename}`;  // URL accesible públicamente

      const instrumentoData = {
          nombre: req.body.nombre,
          marca: req.body.marca,
          modelo: req.body.modelo,
          imagen: imagenUrl,  // Guardamos la URL pública
          precio: parseFloat(req.body.precio),
          costoEnvio: req.body.costoEnvio || 'G',
          cantidadVendida: parseInt(req.body.cantidadVendida) || 0,
          descripcion: req.body.descripcion
      };

      const [result] = await db.execute(
          `INSERT INTO instrumento 
          (nombre, marca, modelo, imagen, precio, costoEnvio, cantidadVendida, descripcion) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
          Object.values(instrumentoData)
      );

      res.status(201).json({
          success: true,
          id: result.insertId,
          nombre: instrumentoData.nombre,
          imagenUrl: imagenUrl  // Enviamos la URL al frontend
      });

  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
          success: false,
          error: 'Error al procesar la solicitud',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
  }
});
app.delete('/instrumentos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute('DELETE FROM instrumento WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Instrumento no encontrado' });
        }
        res.json({ message: 'Instrumento eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
app.get('/instrumentos/buscar', async (req, res) => {
    const { q } = req.query;
    try {
        const [rows] = await db.execute('SELECT * FROM instrumento WHERE nombre LIKE ?', [`%${q}%`]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
app.get('/instrumentos/filtrar', async (req, res) => {
    const { marca } = req.query;
    try {
        const [rows] = await db.execute('SELECT * FROM instrumento WHERE marca = ?', [marca]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})  