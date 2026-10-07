// App.jsx: configuración de enrutamiento con BrowserRouter
// Estructura: BrowserRouter > Navbar > Routes > páginas > Footer

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout components
import Navbar   from './components/Navbar';
import Footer   from './components/Footer';

// Pages (lazy loading opcional según guía — aquí importación directa)
import Home     from './pages/Home';
import Products from './pages/Products';
import Form     from './pages/Form';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  return (
    // BrowserRouter: usa la History API del navegador (sin hash en la URL)
    // → cumple requisito de la guía: preferir BrowserRouter sobre HashRouter
    <BrowserRouter>
      {/* Layout persistente: Navbar siempre visible en todas las rutas */}
      <div className="app-layout">
        <Navbar />

        {/* Routes: solo renderiza la primera <Route> que coincide con la URL */}
        <div className="app-content">
          <Routes>
            {/* Ruta exacta: / → Home */}
            <Route path="/"         element={<Home />} />

            {/* Ruta: /products → lista de productos con consumo de API */}
            <Route path="/products" element={<Products />} />

            {/* Ruta: /form → formulario controlado de contacto */}
            <Route path="/form"     element={<Form />} />

            {/* Catch-all: cualquier ruta no definida → NotFound (404) */}
            <Route path="*"         element={<NotFound />} />
          </Routes>
        </div>

        {/* Footer persistente en todas las rutas */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
