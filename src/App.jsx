import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";

import WhatsAppButton from "./components/WhatsAppButton";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Carrinho from "./pages/Carrinho";
import ProductPage from "./pages/ProductPage";
import Favoritos from "./pages/Favoritos";
import Pedidos from "./pages/Pedidos";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
  <Route path="/" element={<Home />} />

  <Route
    path="/produto/:id"
    element={<ProductPage />}
  />

  <Route
    path="/favoritos"
    element={<Favoritos />}
  />

  <Route
    path="/carrinho"
    element={<Carrinho />}
  />

  <Route
    path="/admin/login"
    element={<AdminLogin />}
  />

  <Route
    path="/admin"
    element={
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    }
  />

  <Route
    path="/admin/pedidos"
    element={
      <ProtectedRoute>
        <Pedidos />
      </ProtectedRoute>
    }
  />
</Routes>

      <Footer />

    <WhatsAppButton />

    </BrowserRouter>
  );
}

export default App;