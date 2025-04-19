import { useState,useEffect } from "react"; 
import Instrumento from "./types/instrumento";
import { Link } from "react-router-dom";

function ListaProductos() {
 
        const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
        const [loading, setLoading] = useState<boolean>(true);
        const [error, setError] = useState<string | null>(null);
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
            <div  className="d-grid gap-2 col-2
             mx-auto">
                            <Link  to={`/CrearInstrumento`}
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
                                        to={`/modificarInstrumento/${instrumento.id}`}
                                        className="btn btn-warning "
                                    >
                                       Modificar
                                    </Link>
                                    </div>
                        <div className="col-1  text-center my-auto" ><Link
                                        to={`/eliminarInstrumento/${instrumento.id}`}
                                        className="btn btn-danger "
                                    >
                                       Eliminar
                                    </Link> 
                                    </div>
                        
                                    </div>
                    </div>
                ))}
            </div>
        
    );
   
}
export default ListaProductos;