import React from 'react';
import Header from './components/Layout/Header';
import Notificacion from './components/Notificacion/Notificacion';
import Estadisticas from './components/Estadisticas/Estadisticas';
import PedidoForm from './components/PedidoForm/PedidoForm';
import PedidoList from './components/PedidoList/PedidoList';
import usePedidos from './hooks/usePedidos';
import styles from './App.module.css';

function App() {
  const {
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
  } = usePedidos();

  const handleSubmit = pedidoEditar ? actualizarPedido : crearPedido;

  return (
    <>
      <Header />

      <main className={styles.container}>
        <Notificacion msg={notif.msg} tipo={notif.tipo} />

        {!loading && <Estadisticas pedidos={pedidos} />}

        <PedidoForm
          onSubmit={handleSubmit}
          pedidoEditar={pedidoEditar}
          onCancelarEdicion={cancelarEdicion}
        />

        {loading ? (
          <p className={styles.loading}>Cargando pedidos…</p>
        ) : (
          <PedidoList
            pedidos={pedidos}
            onDelete={eliminarPedido}
            onEdit={seleccionarEdicion}
            onCambiarEstado={cambiarEstado}
          />
        )}
      </main>
    </>
  );
}

export default App;
