import { useState,useEffect } from "react"; 
import { useParams } from "react-router-dom";
import Instrumento from "./types/instrumento";

const InstrumentoDetalle = () => {
    const { id } = useParams<{ id: string }>();
    const [instrumento, setInstrumento] = useState<Instrumento | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInstrumento = async () => {
            try {
                const response = await fetch(`http://localhost:3000/instrumentos/${id}`);
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data: Instrumento = await response.json();
                setInstrumento(data);
            } catch (error) {
                console.error("Error fetching instrumento:", error);
                setError("Error al cargar el instrumento. Intente nuevamente más tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchInstrumento();
    }, [id]);   
    if (loading) {
        return <div className="text-center my-5">Cargando Instrumento...</div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center my-5">{error}</div>;
    }
    return (
        <div className="container-fluid my-4">
            <h1 className="text-center mb-4">{instrumento?.nombre}</h1>
            <div className="row">
                <div className="col-md-6">
                    {instrumento?.imagen ? (
                        <img
                        src={`http://localhost:3000/uploads/${instrumento.imagen}`} 
                           className="img-fluid"
                            alt={instrumento.nombre}
                            style={{ height: '400px', objectFit: 'cover' }}
                        />
                    ) : (
                        <div className="text-center text-muted" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                            Imagen no disponible
                        </div>
                    )}
                </div>
                <div className="col-md-6">
                    <h5 className="card-title">{instrumento?.marca} {instrumento?.modelo}</h5>
                    <p className="card-text text-muted">{instrumento?.descripcion}</p>
                    <p className="card-text">
                        <strong>Precio:</strong> ${instrumento?.precio}
                    </p>
                    <p className="card-text">
                        <strong>Envío:</strong> {instrumento?.costoEnvio === 'G' ? "Gratuito" : "Costo adicional"}
                    </p>
                    <p className="card-text">
                        <strong>Cantidad Vendida:</strong> {instrumento?.cantidadVendida}
                    </p>
                </div>
            </div>
            <div className="text-center mt-4">
                <button className="btn btn-primary">Agregar al Carrito</button>
         </div> 
        </div>
        
    );       
};
export default InstrumentoDetalle;