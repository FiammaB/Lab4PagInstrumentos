import { useState,FormEvent, ChangeEvent } from "react"; 
import Instrumento from './types/instrumento';

// Estado inicial para el formulario

const initialState: Omit<Instrumento, 'id'> = {
    nombre: '',
    marca: '',
    modelo: '',
    imagen: '',
    precio: 0,
    costoEnvio: 'G',
    cantidadVendida: 0,
    descripcion: ''
  };
const CrearInstrumento = () => {
    const [instrumento,setInstrumento]= useState(initialState);
    const [mensaje,setMensaje]= useState<string|null>(null);
    const [isLoading,setIsloading]= useState(false);
    const[error,setError]=useState<boolean>(false);
    //cambios de inputs
    const manejadorCambiosInputs=(e:ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>{
        const{name,value}=e.target;
  // Manejar los campos numéricos los demas los deja ser
    if (name === 'precio' || name === 'cantidadVendida') {
        setInstrumento({
          ...instrumento,
          [name]: value ? Number(value) : 0
        });
      } else {
        setInstrumento({
          ...instrumento,
          [name]: value
        });
        }
    };
    // Envio de formulario
    const  manejadorEnvio=async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setIsloading(true);
        setError(false);
        setMensaje(null);
        try {
            const response = await fetch('http://localhost:3000/instrumentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(instrumento)
            });
            if (!response.ok) {
                throw new Error('Error al crear el instrumento');
            }
            const data = await response.json();
            setMensaje(`Instrumento creado con éxito: ${data.nombre}`);
        } catch (error) {
            console.error(error);
            setError(true);
        } finally {
            setIsloading(false);
        }
    }

    return (
        <div className="container mt-5">
            <h1>Crear Instrumento</h1>
            <form onSubmit={manejadorEnvio}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="nombre"name="nombre" 
                    value={instrumento.nombre} onChange={manejadorCambiosInputs}required  />
                </div>
                <div className="mb-3">
                    <label htmlFor="marca" className="form-label">Marca</label>
                    <input type="text" className="form-control" id="marca" name="marca"
                    value={instrumento.marca} onChange={manejadorCambiosInputs}required />
                </div>
                <div className="mb-3">
                    <label htmlFor="modelo" className="form-label">Modelo</label>
                    <input type="text" className="form-control" id="modelo" name="modelo"
                    value={instrumento.modelo} onChange={manejadorCambiosInputs} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="imagen" className="form-label"> URL Imagen</label>
                    <input type="text" className="form-control" id="imagen" name="imagen"
                    value={instrumento.imagen} onChange={manejadorCambiosInputs} required />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="precio" className="form-label">Precio</label>
                    <input type="number" className="form-control" id="precio" name="precio"
                    value={instrumento.precio} onChange={manejadorCambiosInputs} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="envio" className="form-label">Costo de Envio</label>
                    <input type="text" className="form-control" id="envio"  name="envio"
                    value={instrumento.costoEnvio} onChange={manejadorCambiosInputs} required />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="vendido" className="form-label">Cantidad Vendida</label>
                    <input type="number" className="form-control" id="vendido"  name="vendido"
                    value={instrumento.cantidadVendida} onChange={manejadorCambiosInputs} required />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <input type="text" className="form-control" id="descripcion" name="descripcion"
                    value={instrumento.descripcion} onChange={manejadorCambiosInputs} required />
                </div>
                
                <button type="submit" disabled={isLoading} className=" w-full bg-blue-500 text-white py-2 px-4 rounded">
                {isLoading ? 'Guardando...' : 'Guardar Instrumento'}
                    </button>
            </form>
            {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
            {error && <div className="alert alert-danger mt-3">Error al crear el instrumento</div>}

        </div>
    );
}
export default CrearInstrumento;
// Este componente es un formulario básico para crear un nuevo instrumento.