import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Necesario para usar __dirname con ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  let connection;
  try {
    // 1. Verificar la ruta del archivo
    const jsonPath = path.join(__dirname, 'instrumentos.json');
    console.log(`Buscando archivo en: ${jsonPath}`);

    // 2. Leer y verificar el archivo JSON
    if (!fs.existsSync(jsonPath)) {
      throw new Error('El archivo instrumentos.json no existe en la ruta especificada');
    }

    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    console.log('Contenido del archivo:', rawData);

    const data = JSON.parse(rawData);
    const instruments = data.instrumentos || data; // Compatible con ambos formatos
    
    // 3. Verificar que es un array
    if (!Array.isArray(instruments)) {
      throw new Error('El archivo JSON no contiene un array válido de instrumentos');
    }

    console.log(`Encontrados ${instruments.length} instrumentos`);

    // 4. Conectar a MySQL
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'mysql',
      database: 'instrumentos'
    });

    // 5. Crear tabla si no existe
    await connection.query(`
      CREATE TABLE IF NOT EXISTS instrumento (
        id INT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        marca VARCHAR(100),
        modelo VARCHAR(100),
        imagen VARCHAR(255),
        precio DECIMAL(10,2) NOT NULL,
        costoEnvio VARCHAR(10),
        cantidadVendida INT DEFAULT 0,
        descripcion TEXT,
      
      )
    `);
    console.log('✅ Tabla creada/verificada exitosamente');

    // 6. Insertar datos
    for (const instrumento of instruments) {
      try {
        await connection.query(
          `INSERT INTO instrumento 
          (id, nombre, marca, modelo, imagen, precio, costoEnvio, cantidadVendida, descripcion) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            instrumento.id,
            instrumento.instrumento, // Mapeado a 'nombre' en la tabla
            instrumento.marca,
            instrumento.modelo,
            instrumento.imagen,
            parseFloat(instrumento.precio), // Asegurar tipo numérico
            instrumento.costoEnvio,
            parseInt(instrumento.cantidadVendida) || 0,
            instrumento.descripcion
          ]
        );
        console.log(`✅ Insertado: ${instrumento.instrumento}`);
      } catch (insertError) {
        console.error(`⚠️ Error insertando ${instrumento.instrumento}:`, insertError.message);
      }
    }

    console.log('🎉 Proceso completado!');
  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    // 7. Cerrar conexión si existe
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

main();