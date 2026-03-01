import React, { useState, useEffect } from 'react';

const ESTADOS = ['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO'];

const EMPTY_FORM = { cliente: '', producto: '', cantidad: 1, precioTotal: 0, estado: 'PENDIENTE' };

function PedidoForm({ onSubmit, pedidoEditar, onCancelarEdicion }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const esEdicion = Boolean(pedidoEditar);

  useEffect(() => {
    if (pedidoEditar) {
      setForm({
        cliente: pedidoEditar.cliente || '',
        producto: pedidoEditar.producto || '',
        cantidad: pedidoEditar.cantidad || 1,
        precioTotal: pedidoEditar.precioTotal || 0,
        estado: pedidoEditar.estado || 'PENDIENTE',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [pedidoEditar]);

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
    if (!esEdicion) setForm(EMPTY_FORM);
  };

  const inputStyle = {
    width: '100%', padding: '8px', marginBottom: '10px',
    border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box',
  };

  const accentColor = esEdicion ? '#e67e22' : '#3498db';

  return (
    <div style={{
      background: esEdicion ? '#fff8f0' : '#f8f9fa',
      padding: '20px', borderRadius: '8px', marginBottom: '20px',
      border: esEdicion ? '2px solid #e67e22' : '1px solid #dee2e6',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ margin: 0, color: '#34495e' }}>
          {esEdicion ? `✏️ Editando Pedido #${pedidoEditar.id}` : 'Nuevo Pedido'}
        </h2>
        {esEdicion && (
          <button onClick={onCancelarEdicion} style={{
            background: 'transparent', border: '1px solid #aaa', borderRadius: '4px',
            padding: '4px 12px', cursor: 'pointer', color: '#555'
          }}>
            Cancelar
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label>Cliente:</label>
            <input style={inputStyle} type="text" name="cliente" value={form.cliente} onChange={handleChange} required />
          </div>
          <div style={{ flex: 1 }}>
            <label>Producto:</label>
            <input style={inputStyle} type="text" name="producto" value={form.producto} onChange={handleChange} required />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label>Cantidad:</label>
            <input style={inputStyle} type="number" name="cantidad" value={form.cantidad} onChange={handleChange} min="1" required />
          </div>
          <div style={{ flex: 1 }}>
            <label>Precio Total ($):</label>
            <input style={inputStyle} type="number" name="precioTotal" value={form.precioTotal} onChange={handleChange} min="0" step="0.01" required />
          </div>
          <div style={{ flex: 1 }}>
            <label>Estado:</label>
            <select style={{ ...inputStyle, background: 'white' }} name="estado" value={form.estado} onChange={handleChange}>
              {ESTADOS.map(e => <option key={e} value={e}>{e.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>

        <button type="submit" style={{
          background: accentColor, color: 'white', border: 'none',
          padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold',
        }}>
          {esEdicion ? 'Guardar Cambios' : 'Crear Pedido'}
        </button>
      </form>
    </div>
  );
}

export default PedidoForm;
