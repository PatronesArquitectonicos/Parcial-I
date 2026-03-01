import React from 'react';

function PedidoList({ pedidos, onDelete }) {
  if (pedidos.length === 0) {
    return <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No hay pedidos registrados.</p>;
  }

  const estadoColor = {
    PENDIENTE: '#f39c12',
    EN_PROCESO: '#3498db',
    COMPLETADO: '#27ae60',
    CANCELADO: '#e74c3c',
  };

  return (
    <div>
      <h2 style={{ color: '#34495e' }}>Pedidos ({pedidos.length})</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#2c3e50', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Cliente</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Producto</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Cantidad</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Precio</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido, index) => (
            <tr key={pedido.id} style={{ background: index % 2 === 0 ? '#fff' : '#f2f2f2' }}>
              <td style={{ padding: '10px' }}>{pedido.id}</td>
              <td style={{ padding: '10px' }}>{pedido.cliente}</td>
              <td style={{ padding: '10px' }}>{pedido.producto}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>{pedido.cantidad}</td>
              <td style={{ padding: '10px', textAlign: 'right' }}>${pedido.precioTotal?.toFixed(2)}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <span style={{
                  background: estadoColor[pedido.estado] || '#95a5a6',
                  color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px'
                }}>
                  {pedido.estado}
                </span>
              </td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <button onClick={() => onDelete(pedido.id)} style={{
                  background: '#e74c3c', color: 'white', border: 'none',
                  padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'
                }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PedidoList;
