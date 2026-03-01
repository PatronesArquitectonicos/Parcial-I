import React, { useState } from 'react';

function PedidoForm({ onSubmit }) {
  const [form, setForm] = useState({
    cliente: '',
    producto: '',
    cantidad: 1,
    precioTotal: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      cantidad: parseInt(form.cantidad),
      precioTotal: parseFloat(form.precioTotal),
    });
    setForm({ cliente: '', producto: '', cantidad: 1, precioTotal: 0 });
  };

  const inputStyle = {
    width: '100%', padding: '8px', marginBottom: '10px',
    border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box'
  };

  return (
    <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
      <h2 style={{ marginTop: 0, color: '#34495e' }}>Nuevo Pedido</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cliente:</label>
          <input style={inputStyle} type="text" name="cliente" value={form.cliente} onChange={handleChange} required />
        </div>
        <div>
          <label>Producto:</label>
          <input style={inputStyle} type="text" name="producto" value={form.producto} onChange={handleChange} required />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label>Cantidad:</label>
            <input style={inputStyle} type="number" name="cantidad" value={form.cantidad} onChange={handleChange} min="1" required />
          </div>
          <div style={{ flex: 1 }}>
            <label>Precio Total:</label>
            <input style={inputStyle} type="number" name="precioTotal" value={form.precioTotal} onChange={handleChange} min="0" step="0.01" required />
          </div>
        </div>
        <button type="submit" style={{
          background: '#3498db', color: 'white', border: 'none',
          padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '16px'
        }}>
          Crear Pedido
        </button>
      </form>
    </div>
  );
}

export default PedidoForm;
