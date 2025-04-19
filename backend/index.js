import mysql from 'mysql2/promise';
import express from 'express';
import cors from 'cors';
 const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
 
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
app.put('/instrumentos/:id', async (req, res) => {
    const { id } = req.params;
    console.log('req.body:', req.body);
    const {
			nombre,
			marca,
			modelo,
			imagen,
			precio,
			costoEnvio,
			cantidadVendida,
			descripcion } = req.body;
            const params = [nombre, marca, modelo, imagen, precio, costoEnvio, cantidadVendida, descripcion, id];
    console.log('Parámetros a enviar:', params);
    try {
        const [result] = await db.execute('UPDATE instrumento SET nombre = ?, marca = ?, modelo = ? , imagen = ?, precio = ?, costoEnvio = ?, cantidadVendida = ?, descripcion = ? WHERE id = ?', [nombre,
			marca,
			modelo,
			imagen,
			precio,
			costoEnvio,
			cantidadVendida,
			descripcion, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Instrumento no encontrado' });
        }
        res.json({ message: 'Instrumento actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
app.post('/instrumentos', async (req, res) => {
    // 1. Debugging inicial - verifica EXACTAMENTE lo que llega
    console.log('Body recibido:', JSON.stringify(req.body, null, 2));
    
    // 2. Extracción segura de campos con valores por defecto
    const body = {
        nombre: req.body.nombre?.trim(),
        marca: req.body.marca?.trim() || null,
        modelo: req.body.modelo?.trim() || null,
        imagen: req.body.imagen?.trim() || null,
        precio: req.body.precio ? parseFloat(req.body.precio) : null,
        costoEnvio: req.body.costoEnvio?.trim() || 'G',
        cantidadVendida: parseInt(req.body.cantidadVendida) || 0,
        descripcion: req.body.descripcion?.trim() || null
    };

  

    // 4. Ejecución con manejo detallado de errores
    try {
        console.log('Intentando insertar:', body);
        
        const [result] = await db.execute(
            `INSERT INTO instrumento 
            (nombre, marca, modelo, imagen, precio, costoEnvio, cantidadVendida, descripcion) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
            [
                body.nombre,
                body.marca,
                body.modelo,
                body.imagen,
                body.precio,
                body.costoEnvio,
                body.cantidadVendida,
                body.descripcion
            ]
        );

        console.log('Inserción exitosa, ID:', result.insertId);
        
        return res.status(201).json({
            success: true,
            id: result.insertId,
            message: 'Instrumento creado correctamente',
            data: body
        });

    } catch (error) {
        console.error('ERROR EN BD:', {
            mensaje: error.message,
            sql: error.sql,
            parametros_enviados: [
                body.nombre,
                body.marca,
                body.modelo,
                body.imagen,
                body.precio,
                body.costoEnvio,
                body.cantidadVendida,
                body.descripcion
            ],
            stack: error.stack
        });

        return res.status(500).json({
            error: 'Error en la base de datos',
            mensaje: process.env.NODE_ENV === 'development' 
                   ? error.message 
                   : 'Ocurrió un error al procesar la solicitud',
            detalle: process.env.NODE_ENV === 'development'
                   ? `Columna problemática: ${error.sqlMessage.match(/Column '(.*?)'/)?.[1] || 'desconocida'}`
                   : undefined
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

