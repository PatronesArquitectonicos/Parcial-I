import React from 'react';

const estadoColor = {
  PENDIENTE: '#f39c12',
  EN_PROCESO: '#3498db',
  COMPLETADO: '#27ae60',
  CANCELADO: '#e74c3c',
};

function Estadisticas({ pedidos }) {
  const total = pedidos.length;
  const totalImporte = pedidos.reduce((acc, p) => acc + (p.precioTotal || 0), 0);

  const conteo = ['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO'].map((estado) => ({
    estado,
    count: pedidos.filter((p) => p.estado === estado).length,
  }));

  const cardStyle = (color) => ({
    background: color,
    color: 'white',
    borderRadius: '8px',
    padding: '16px 20px',
    flex: 1,
    minWidth: '110px',
    textAlign: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  });

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <div style={cardStyle('#2c3e50')}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{total}</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>Total pedidos</div>
        </div>
        <div style={cardStyle('#8e44ad')}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
            ${totalImporte.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
          </div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>Importe total</div>
        </div>
        {conteo.map(({ estado, count }) => (
          <div key={estado} style={cardStyle(estadoColor[estado])}>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{count}</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>{estado.replace('_', ' ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Estadisticas;
