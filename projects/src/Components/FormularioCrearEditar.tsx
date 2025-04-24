import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import Instrumento from './types/instrumento';
import { useNavigate, useParams } from "react-router-dom";


const FormularioCrearEditar = () => {
    //usa el parametro id de la URL para determinar si es un formulario de creación o edición
    const {id}= useParams();
    //se usa para navegar entre paginas sin el <Link>
    // ,redirecciona desp de usar formulario
    const navigate=useNavigate();
    const crear= id === "0";

    const [instrumento, setInstrumento] = useState<Instrumento>({
        id: 0,
        nombre: '',
        marca: '',
        modelo: '',
        imagen: '',
        precio: 0,
        costoEnvio: 'G',
        cantidadVendida: 0,
        descripcion: ''
    });
    const [imagen, setImagen] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if(!crear) {
            cargarInstrumento(id as string);
        }}, [id,crear]);

        //para editar
    const cargarInstrumento = async (id: string) => {
        setIsloading(true);
        try {//traigo el instrumento para editarlo
            const response = await fetch(`http://localhost:3000/instrumentos/${id}`);	
            if (!response.ok) {
                throw new Error(`Error al cargar el instrumento:${response.status}`);
            }
            const data :Instrumento = await response.json();
            setInstrumento(data);
            if(data.imagen) {
                //mostramos vista previa
                setPreviewURL(`http://localhost:3000/uploads/${data.imagen.split('/').pop()}`);
            }
        }catch (error) {
            console.error('Error:', error);
            setError(true);
            setMensaje('Error al cargar el instrumento');
        }finally {
            setIsloading(false);
        }
    }

    const manejadorCambiosInputs = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
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

    const manejoCambioImagenes = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        
        if (files && files.length > 0) {
            const file = files[0];
            setImagen(file);
            
            const objectURL = URL.createObjectURL(file);
            setPreviewURL(objectURL);
        }
    };

    const manejadorEnvio = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsloading(true);
        setError(false);
        setMensaje(null);
    
        try {
            const formData = new FormData();
          
            // Añadir todos los campos del instrumento
            Object.entries(instrumento).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value.toString());
                }
            });
            
            // Añadir el archivo de imagen si existe
            if (imagen) {
                formData.append('imagenFile', imagen);
            }
    
            // Verificar contenido del FormData (para depuración)
            console.log('Contenido de FormData:');
            formData.forEach((value, key) => {
                console.log(key, value);
            });
    
            let response;
            if (crear) {
                response = await fetch('http://localhost:3000/instrumentos', {
                    method: 'POST',
                    body: formData
                });
            } else {
                response = await fetch(`http://localhost:3000/instrumentos/${id}`, {
                    method: 'PUT',
                    body: formData
                });
            }
            
            if (!response.ok) {
                throw new Error('Error en la operación al guardar el instrumento');
            }
            
            const data = await response.json();
            console.log('Respuesta del servidor:', data);
            setMensaje(crear ? 'Instrumento guardado correctamente' : 'Instrumento editado correctamente');
            
            //redirige a la lista de producto desp de 2 seg
            setTimeout(() => {
                navigate('/listaProductos');
            }, 2000);
        } catch (error) {
            console.error('Error:', error);
            setError(true);
            setMensaje('Error al guardar el instrumento');
        } finally {
            setIsloading(false);
        }
    };

    return (
      
       <div className="container mt-5">
            {/* Título condicional según el modo */}
            <h1 className="mb-4">
                {crear ? 'Crear Nuevo Instrumento' : 'Modificar Instrumento'}
            </h1>
            
            {/* Mostrar cargando mientras se cargan datos en modo edición */}
            {!crear && isLoading ? (
                <div className="text-center my-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando datos del instrumento...</p>
                </div>
            ) : (
                <form onSubmit={manejadorEnvio}>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="nombre"
                            name="nombre" 
                            value={instrumento.nombre} 
                            onChange={manejadorCambiosInputs}
                            required  
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="marca" className="form-label">Marca</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="marca" 
                            name="marca"
                            value={instrumento.marca} 
                            onChange={manejadorCambiosInputs}
                            required 
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="modelo" className="form-label">Modelo</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="modelo" 
                            name="modelo"
                            value={instrumento.modelo} 
                            onChange={manejadorCambiosInputs} 
                            required 
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="imagen" className="form-label">Imagen</label>
                        <input 
                            type="file" 
                            className="form-control" 
                            id="imagen" 
                            name="imagen"
                            onChange={manejoCambioImagenes} 
                            accept="image/*" 
                            required={crear} // Solo requerido en modo creación
                        />
                        {/* Mostrar imagen previa si existe */}
                        {previewURL && (
                            <div className="mt-2">
                                <img 
                                    src={previewURL}
                                    alt="Vista previa" 
                                    style={{ maxHeight: '200px', objectFit: 'contain' }}
                                    className="border rounded"
                                />
                            </div>
                        )}
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="precio" className="form-label">Precio</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            id="precio" 
                            name="precio"
                            value={instrumento.precio} 
                            onChange={manejadorCambiosInputs} 
                            required 
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="costoEnvio" className="form-label">Costo de Envío</label>
                        <select 
                            className="form-select" 
                            id="costoEnvio" 
                            name="costoEnvio"
                            value={instrumento.costoEnvio} 
                            onChange={manejadorCambiosInputs} 
                            required 
                        >
                            <option value="G">Gratis</option>
                            <option value="1500">$1500</option>
                            <option value="3000">$3000</option>
                            <option value="5000">$5000</option>
                        </select>
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="cantidadVendida" className="form-label">Cantidad Vendida</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            id="cantidadVendida" 
                            name="cantidadVendida"
                            value={instrumento.cantidadVendida} 
                            onChange={manejadorCambiosInputs} 
                            required 
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="descripcion" className="form-label">Descripción</label>
                        <textarea 
                            className="form-control" 
                            id="descripcion" 
                            name="descripcion"
                            value={instrumento.descripcion} 
                            onChange={manejadorCambiosInputs} 
                            required 
                            rows={4}
                        />
                    </div>
                    
                    {/* Botones con texto condicional según el modo */}
                    <div className="d-flex gap-2">
                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            className="btn btn-primary flex-grow-1"
                        >
                            {isLoading ? 'Guardando...' : 
                             crear ? 'Crear Instrumento' : 'Guardar Cambios'}
                        </button>
                        
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => navigate('/ListaProductos')}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
            
            {/* Mostrar mensajes de éxito o error */}
            {mensaje && (
                <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`}>
                    {mensaje}
                </div>
            )}
        </div>
    );
};

export default FormularioCrearEditar;