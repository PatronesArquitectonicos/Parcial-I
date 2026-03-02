import { useState, useEffect, useCallback } from 'react';
import pedidoService from '../api/pedidoService';

export default function usePedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pedidoEditar, setPedidoEditar] = useState(null);
  const [notif, setNotif] = useState({ msg: null, tipo: 'ok' });

  /* ---- helpers ---- */
  const mostrarNotif = useCallback((msg, tipo = 'ok') => {
    setNotif({ msg, tipo });
    setTimeout(() => setNotif({ msg: null, tipo: 'ok' }), 3500);
  }, []);

  const fetchPedidos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await pedidoService.getAll();
      setPedidos(data);
    } catch {
      mostrarNotif('Error al cargar los pedidos', 'error');
    } finally {
      setLoading(false);
    }
  }, [mostrarNotif]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  /* ---- CRUD ---- */
  const crearPedido = async (pedido) => {
    try {
      await pedidoService.create(pedido);
      await fetchPedidos();
      mostrarNotif(`Pedido de "${pedido.producto}" creado correctamente.`);
    } catch {
      mostrarNotif('Error al crear el pedido', 'error');
    }
  };

  const actualizarPedido = async (pedido) => {
    if (!pedidoEditar) return;
    try {
      await pedidoService.update(pedidoEditar.id, pedido);
      await fetchPedidos();
      setPedidoEditar(null);
      mostrarNotif(`Pedido #${pedidoEditar.id} actualizado correctamente.`);
    } catch {
      mostrarNotif('Error al actualizar el pedido', 'error');
    }
  };

  const eliminarPedido = async (id) => {
    try {
      await pedidoService.delete(id);
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
      await pedidoService.cambiarEstado(id, pedido, nuevoEstado);
      await fetchPedidos();
      mostrarNotif(`Pedido #${id} → ${nuevoEstado.replace('_', ' ')}`);
    } catch {
      mostrarNotif('Error al cambiar el estado', 'error');
    }
  };

  const seleccionarEdicion = (pedido) => {
    setPedidoEditar(pedido);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => setPedidoEditar(null);

  return {
    pedidos,
    loading,
    notif,
    pedidoEditar,
    crearPedido,
    actualizarPedido,
    eliminarPedido,
    cambiarEstado,
    seleccionarEdicion,
    cancelarEdicion,
  };
}
