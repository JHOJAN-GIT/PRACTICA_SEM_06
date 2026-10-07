// App.jsx: BrowserRouter + 5 rutas (/, /products, /form, /messages, *)

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar   from './components/Navbar';
import Footer   from './components/Footer';
import Home     from './pages/Home';
import Products from './pages/Products';
import Form     from './pages/Form';
import Messages from './pages/Messages';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/form"     element={<Form />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="*"         element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
