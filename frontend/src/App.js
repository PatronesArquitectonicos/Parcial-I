import React, { useState, useEffect, useCallback } from 'react';
import PedidoForm from './components/PedidoForm';
import PedidoList from './components/PedidoList';
import Estadisticas from './components/Estadisticas';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api/pedidos';

function Notificacion({ msg, tipo }) {
  if (!msg) return null;
  const bg = tipo === 'error' ? '#e74c3c' : '#27ae60';
  return (
    <div style={{
      background: bg, color: 'white', padding: '10px 16px',
      borderRadius: '5px', marginBottom: '14px', display: 'flex',
      justifyContent: 'space-between', alignItems: 'center',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    }}>
      <span>{msg}</span>
    </div>
  );
}

function App() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState({ msg: null, tipo: 'ok' });
  const [pedidoEditar, setPedidoEditar] = useState(null);

  const mostrarNotif = (msg, tipo = 'ok') => {
    setNotif({ msg, tipo });
    setTimeout(() => setNotif({ msg: null, tipo: 'ok' }), 3500);
  };

  const fetchPedidos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setPedidos(response.data);
    } catch (err) {
      mostrarNotif('Error al cargar los pedidos', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPedidos(); }, [fetchPedidos]);

  const crearPedido = async (pedido) => {
    try {
      await axios.post(API_URL, pedido);
      await fetchPedidos();
      mostrarNotif(`Pedido de "${pedido.producto}" creado correctamente.`);
    } catch {
      mostrarNotif('Error al crear el pedido', 'error');
    }
  };

  const actualizarPedido = async (pedido) => {
    try {
      await axios.put(`${API_URL}/${pedidoEditar.id}`, pedido);
      await fetchPedidos();
      setPedidoEditar(null);
      mostrarNotif(`Pedido #${pedidoEditar.id} actualizado correctamente.`);
    } catch {
      mostrarNotif('Error al actualizar el pedido', 'error');
    }
  };

  const eliminarPedido = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchPedidos();
      if (pedidoEditar?.id === id) setPedidoEditar(null);
      mostrarNotif(`Pedido #${id} eliminado.`);
    } catch {
      mostrarNotif('Error al eliminar el pedido', 'error');
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    const pedido = pedidos.find((p) => p.id === id);
    if (!pedido) return;
    try {
      await axios.put(`${API_URL}/${id}`, { ...pedido, estado: nuevoEstado });
      await fetchPedidos();
      mostrarNotif(`Pedido #${id} → ${nuevoEstado.replace('_', ' ')}`);
    } catch {
      mostrarNotif('Error al cambiar el estado', 'error');
    }
  };

  const handleSubmit = pedidoEditar ? actualizarPedido : crearPedido;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{
        textAlign: 'center', color: '#2c3e50', marginBottom: '4px',
        fontSize: '26px', letterSpacing: '0.5px',
      }}>
        📦 Sistema de Gestión de Pedidos
      </h1>
      <p style={{ textAlign: 'center', color: '#95a5a6', marginTop: 0, marginBottom: '24px' }}>
        Administra, filtra y controla todos tus pedidos
      </p>

      <Notificacion msg={notif.msg} tipo={notif.tipo} />

      {!loading && <Estadisticas pedidos={pedidos} />}

      <PedidoForm
        onSubmit={handleSubmit}
        pedidoEditar={pedidoEditar}
        onCancelarEdicion={() => setPedidoEditar(null)}
      />

      {loading ? (
        <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '40px 0' }}>Cargando pedidos…</p>
      ) : (
        <PedidoList
          pedidos={pedidos}
          onDelete={eliminarPedido}
          onEdit={(p) => { setPedidoEditar(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onCambiarEstado={cambiarEstado}
        />
      )}
    </div>
  );
}

export default App;
