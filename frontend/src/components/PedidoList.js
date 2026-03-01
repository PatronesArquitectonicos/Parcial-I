import React, { useState } from 'react';

const ESTADOS = ['TODOS', 'PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO'];

const estadoColor = {
  PENDIENTE: '#f39c12',
  EN_PROCESO: '#3498db',
  COMPLETADO: '#27ae60',
  CANCELADO: '#e74c3c',
};

function PedidoList({ pedidos, onDelete, onEdit, onCambiarEstado }) {
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const pedidosFiltrados = pedidos.filter((p) => {
    const coincideEstado = filtroEstado === 'TODOS' || p.estado === filtroEstado;
    const term = busqueda.toLowerCase();
    const coincideBusqueda =
      !busqueda ||
      p.cliente?.toLowerCase().includes(term) ||
      p.producto?.toLowerCase().includes(term) ||
      String(p.id).includes(term);
    return coincideEstado && coincideBusqueda;
  });

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  const btn = (label, color, onClick) => (
    <button onClick={onClick} style={{
      background: color, color: 'white', border: 'none',
      padding: '4px 10px', borderRadius: '4px', cursor: 'pointer',
      fontSize: '12px', marginLeft: '4px',
    }}>
      {label}
    </button>
  );

  return (
    <div>
      {/* Barra de herramientas */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '14px' }}>
        <h2 style={{ margin: 0, color: '#34495e', flex: 1 }}>
          Pedidos
          <span style={{ fontSize: '14px', color: '#7f8c8d', marginLeft: '8px' }}>
            ({pedidosFiltrados.length} / {pedidos.length})
          </span>
        </h2>
        <input
          type="text"
          placeholder="Buscar cliente, producto o ID…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            padding: '7px 12px', borderRadius: '4px', border: '1px solid #ddd',
            minWidth: '220px', fontSize: '13px',
          }}
        />
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {ESTADOS.map((est) => (
            <button
              key={est}
              onClick={() => setFiltroEstado(est)}
              style={{
                padding: '5px 12px', borderRadius: '20px', border: 'none',
                cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                background: filtroEstado === est
                  ? (est === 'TODOS' ? '#2c3e50' : estadoColor[est])
                  : '#e0e0e0',
                color: filtroEstado === est ? 'white' : '#555',
              }}
            >
              {est.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {pedidosFiltrados.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '30px 0' }}>
          No hay pedidos que coincidan con el filtro.
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#2c3e50', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Cliente</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Producto</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Cantidad</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Precio</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Fecha</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido, index) => (
                <tr
                  key={pedido.id}
                  style={{ background: index % 2 === 0 ? '#fff' : '#f7f9fb', verticalAlign: 'middle' }}
                >
                  <td style={{ padding: '10px', fontWeight: 'bold', color: '#7f8c8d' }}>#{pedido.id}</td>
                  <td style={{ padding: '10px' }}>{pedido.cliente}</td>
                  <td style={{ padding: '10px' }}>{pedido.producto}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{pedido.cantidad}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>
                    ${pedido.precioTotal?.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <select
                      value={pedido.estado}
                      onChange={(e) => onCambiarEstado(pedido.id, e.target.value)}
                      style={{
                        background: estadoColor[pedido.estado] || '#95a5a6',
                        color: 'white', border: 'none', borderRadius: '12px',
                        padding: '4px 8px', fontSize: '12px', cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      {['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO'].map((e) => (
                        <option key={e} value={e} style={{ background: '#fff', color: '#333' }}>
                          {e.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '10px', fontSize: '12px', color: '#7f8c8d' }}>
                    {pedido.fechaCreacion
                      ? new Date(pedido.fechaCreacion).toLocaleDateString('es-CO')
                      : '—'}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {btn('✏️ Editar', '#e67e22', () => onEdit(pedido))}
                    {confirmDelete === pedido.id
                      ? <>
                          {btn('✓ Confirmar', '#c0392b', () => handleDelete(pedido.id))}
                          {btn('✗', '#95a5a6', () => setConfirmDelete(null))}
                        </>
                      : btn('🗑 Eliminar', '#e74c3c', () => handleDelete(pedido.id))
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PedidoList;
