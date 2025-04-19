/* import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Instrumento from './types/instrumento';
 */
const ModificarInstrumento = () => {    
    return (
        <div>
            <h1>modificacion de Productos</h1>
            <p>Aquí se mostrará la lista de productos.</p>
        </div>
    );
   /*  const { id } = useParams(); // Obtener el ID del instrumento de la URL
    const [instrumento, setInstrumento] = useState<Instrumento|null>( null);
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [precio, setPrecio] = useState(0);
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState('');
    
    useEffect(() => {
        // Lógica para obtener el instrumento por ID y establecer los valores iniciales
        const fetchInstrumento = async () => {
        try {
            const response = await fetch(`http://localhost:3000/instrumentos/${id}`);
            if (!response.ok) {
            throw new Error('Error al obtener el instrumento');
            }
            const data = await response.json();
            setInstrumento(data);
            setNombre(data.nombre);
            setTipo(data.tipo);
            setPrecio(data.precio);
            setDescripcion(data.descripcion);
            setImagen(data.imagen);
        } catch (error) {
            console.error(error);
        }
        };
    
        fetchInstrumento();
    }, [id]); */

}
    export default ModificarInstrumento;