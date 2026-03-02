import React, { useState } from 'react';
import { FILTROS, ESTADO_COLORS, ESTADO_LABELS } from '../../constants';
import styles from './PedidoList.module.css';

export default function PedidoList({ pedidos, onDelete, onEdit, onCambiarEstado }) {
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* ---- filtrado ---- */
  const pedidosFiltrados = pedidos.filter((p) => {
    const matchEstado = filtroEstado === 'TODOS' || p.estado === filtroEstado;
    const term = busqueda.toLowerCase();
    const matchBusqueda =
      !busqueda ||
      p.cliente?.toLowerCase().includes(term) ||
      p.producto?.toLowerCase().includes(term) ||
      String(p.id).includes(term);
    return matchEstado && matchBusqueda;
  });

  /* ---- delete confirm ---- */
  const handleDelete = (id) => {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  /* ---- render helpers ---- */
  const renderFiltros = () =>
    FILTROS.map((est) => {
      const activo = filtroEstado === est;
      const bgColor = activo
        ? est === 'TODOS'
          ? '#2c3e50'
          : ESTADO_COLORS[est]
        : undefined;

      return (
        <button
          key={est}
          className={`${styles.filtroBtn} ${activo ? styles.activo : ''}`}
          style={activo ? { background: bgColor } : undefined}
          onClick={() => setFiltroEstado(est)}
        >
          {est === 'TODOS' ? 'Todos' : ESTADO_LABELS[est]}
        </button>
      );
    });

  const renderAcciones = (pedido) => (
    <>
      <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => onEdit(pedido)}>
        ✏️ Editar
      </button>
      {confirmDelete === pedido.id ? (
        <>
          <button
            className={`${styles.actionBtn} ${styles.confirmBtn}`}
            onClick={() => handleDelete(pedido.id)}
          >
            ✓ Confirmar
          </button>
          <button
            className={`${styles.actionBtn} ${styles.cancelDeleteBtn}`}
            onClick={() => setConfirmDelete(null)}
          >
            ✗
          </button>
        </>
      ) : (
        <button
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          onClick={() => handleDelete(pedido.id)}
        >
          🗑 Eliminar
        </button>
      )}
    </>
  );

  return (
    <section>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <h2 className={styles.titulo}>
          Pedidos
          <span>
            ({pedidosFiltrados.length} / {pedidos.length})
          </span>
        </h2>

        <input
          type="text"
          className={styles.buscador}
          placeholder="Buscar cliente, producto o ID…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className={styles.filtros}>{renderFiltros()}</div>
      </div>

      {/* Contenido */}
      {pedidosFiltrados.length === 0 ? (
        <p className={styles.empty}>No hay pedidos que coincidan con el filtro.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th className={styles.thCenter}>Cant.</th>
                <th className={styles.thRight}>Precio</th>
                <th className={styles.thCenter}>Estado</th>
                <th>Fecha</th>
                <th className={styles.thCenter}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id}>
                  <td className={styles.tdId}>#{pedido.id}</td>
                  <td>{pedido.cliente}</td>
                  <td>{pedido.producto}</td>
                  <td className={styles.tdCenter}>{pedido.cantidad}</td>
                  <td className={styles.tdRight}>
                    ${pedido.precioTotal?.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                  </td>
                  <td className={styles.tdCenter}>
                    <select
                      className={styles.estadoSelect}
                      value={pedido.estado}
                      onChange={(e) => onCambiarEstado(pedido.id, e.target.value)}
                      style={{ background: ESTADO_COLORS[pedido.estado] || '#95a5a6' }}
                    >
                      {Object.entries(ESTADO_LABELS).map(([val, label]) => (
                        <option key={val} value={val} style={{ background: '#fff', color: '#333' }}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={styles.tdFecha}>
                    {pedido.fechaCreacion
                      ? new Date(pedido.fechaCreacion).toLocaleDateString('es-CO')
                      : '—'}
                  </td>
                  <td className={styles.tdAcciones}>{renderAcciones(pedido)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
