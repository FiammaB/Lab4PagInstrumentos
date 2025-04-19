import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Instrumento from "./types/instrumento";



function Productos() {
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
            <h1 className="text-center mb-4">Instrumentos</h1>
            <div className="row">
                {instrumentos.map((instrumento) => (
                    
                    <div key={instrumento.id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img
                                src={`/img/${instrumento.imagen}`}
                            
                                className="card-img-top img-fluid"
                                alt={instrumento.instrumento}
                                style={{ height: '200px', objectFit: 'cover' }} />
                                
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{instrumento.instrumento}</h5>
                                <p className="card-text text-muted">{instrumento.marca} {instrumento.modelo}</p>
                                <p className="card-text">
                                    <strong>Precio:</strong> ${instrumento.precio}
                                </p>
                                <p className="card-text">
                                    <strong>Envío:</strong> {instrumento.costoEnvio === 'G' ? (
                                        <span className="text-success">Gratis</span>
                                    ) : (
                                        `$${instrumento.costoEnvio}`
                                    )}
                                </p>
                                <div className="mt-auto">
                                    <Link
                                        to={`/instrumentos/${instrumento.id}`}
                                        className="btn btn-primary w-100"
                                    >
                                        Ver Detalle
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Productos;