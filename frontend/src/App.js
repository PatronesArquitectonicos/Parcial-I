import React, { useState, useEffect } from 'react';
import PedidoForm from './components/PedidoForm';
import PedidoList from './components/PedidoList';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api/pedidos';

function App() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setPedidos(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los pedidos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const crearPedido = async (pedido) => {
    try {
      await axios.post(API_URL, pedido);
      fetchPedidos();
    } catch (err) {
      setError('Error al crear el pedido');
    }
  };

  const eliminarPedido = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchPedidos();
    } catch (err) {
      setError('Error al eliminar el pedido');
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>
        Sistema de Gestión de Pedidos
      </h1>

      {error && (
        <div style={{ background: '#e74c3c', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      <PedidoForm onSubmit={crearPedido} />

      {loading ? (
        <p style={{ textAlign: 'center' }}>Cargando pedidos...</p>
      ) : (
        <PedidoList pedidos={pedidos} onDelete={eliminarPedido} />
      )}
    </div>
  );
}

export default App;
