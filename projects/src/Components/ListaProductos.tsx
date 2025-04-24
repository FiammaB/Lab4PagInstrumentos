import { useState,useEffect } from "react"; 
import Instrumento from "./types/instrumento";
import { Link, useNavigate } from "react-router-dom";

function ListaProductos() {
 
        const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
        const [loading, setLoading] = useState<boolean>(true);
        const [error, setError] = useState<string | null>(null);
        const [mensaje, setMensaje] = useState<string | null>(null);
        const navigate = useNavigate();
        const manejadorEliminar = async (id:number) => {
            const confirmar = window.confirm("¿Estás seguro que deseas eliminar este instrumento?");
            if (!confirmar) return;
            setLoading(true);
            try{
                const response = await fetch(`http://localhost:3000/instrumentos/${id}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) {
                    throw new Error('Error al eliminar el instrumento');
                }
                
          // Actualizar la lista de instrumentos después de eliminar
            setInstrumentos(instrumentos.filter(instr => instr.id !== id));
            setMensaje('Instrumento eliminado correctamente');
                
                //redirige a la lista de producto desp de 2 seg
                setTimeout(() => {
                    navigate('/listaProductos');
                }, 2000);
            }
            catch (error) {
                console.error('Error:', error);
                setError("error al cargar los instrumentos. Intente nuevamente más tarde.");
                // Mostrar mensaje de error al usuario
                setMensaje('Error al eliminar el instrumento');
            } finally {
                setLoading(false);
            }
        }
    useEffect(() => {
        const fetchInstrumentos = async () => {
            try {
                const response = await fetch("http://localhost:3000/instrumentos");
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                const data: Instrumento[] = await response.json();
                setInstrumentos(data);
            } catch (error) {
                console.error("Error fetching instrumentos:", error);
                setError("Error al cargar los instrumentos. Intente nuevamente más tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchInstrumentos();
    }, []);
    if (loading) {
        return <div className="text-center my-5">Cargando Instrumentos...</div>;
    }
    if (error) {
        return <div className="alert alert-danger text-center my-5">{error}</div>;
    }

    return (
        <div className="container-fluid my-4">
            <h1 className="text-center mb-4"> Lista de Instrumentos</h1>
             
        {mensaje && (
            <div className={`alert ${error ? 'alert-danger' : 'alert-success'} text-center`}>
                {mensaje}
            </div>
        )}
            <div  className="d-grid gap-2 col-2
             mx-auto">
                            <Link  to={`/FormularioCrearEditar/0`}
                                        className="btn btn-success border-1 border-shadow"
                                    >
                                       Crear Nuevo Instrumento
                                    </Link>
                        </div>
            <div className="row g-4 my-2 border-bottom border-1 border-shadow">   
                <div className="col-6">Instrumento</div>
                <div className="col-1">Marca</div>  
                <div className="col-1">Modelo</div>
                <div className="col-1">Precio</div> 
                <div className="col-1">Cantidad Vendida</div>
                <div className="col-1">Modificar</div>
                <div className="col-1">Eliminar</div>
                </div>
                {instrumentos.map((instrumento) => (
                    <div key={instrumento.id} >
                     
                       <div className="row g-4 my-2 border-bottom border-1 border-shadow  ">   
                        
                        <div className="col-6 ">{instrumento.nombre}</div>
                        <div className="col-1">{instrumento.marca}</div>
                        <div className="col-1">{instrumento.modelo}</div>
                        <div className="col-1">{instrumento.precio}</div>
                        <div className="col-1">{instrumento.cantidadVendida}</div>

                         <div className="col-1  text-center my-auto"><Link
                                        to={`/FormularioCrearEditar/${instrumento.id}`}
                                        className="btn btn-warning "
                                    >
                                       Modificar
                                    </Link>
                                    </div>
                        <div className="col-1  text-center my-auto" >
                            <button 
                            onClick={() => manejadorEliminar(instrumento.id)}
                            className="btn btn-danger"
                            disabled={loading} >
                                    {loading ? 'Eliminando...' : 'Eliminar'}

                            </button>
                                    </div>
                        
                                    </div>
                    </div>
                ))}
            </div>
        
    );
   
}
export default ListaProductos;