import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import DondeEstamos from './Components/DondeEstamos';
import Productos from './Components/Productos';
import InstrumentoDetalle from './Components/InstrumentoDetalle';
import ListaProductos from './Components/ListaProductos';
import ModificarInstrumento from './Components/ModificarInstrumento';
import CrearInstrumento from './Components/CrearInstrumento';

function App() {
  return (
    <Router>
    
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donde-estamos" element={<DondeEstamos />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/instrumentos/:id" element={<InstrumentoDetalle />} />
        <Route path="/listaProductos" element={<  ListaProductos/>} />
        <Route path="/modificarInstrumento/:id" element={ < ModificarInstrumento />} />
        <Route path="/crearInstrumento" element={<CrearInstrumento />} />

      </Routes>
    </Router>
  );
}

export default App;
