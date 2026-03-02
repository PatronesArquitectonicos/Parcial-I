import React, { useState, useEffect } from 'react';
import { ESTADOS, ESTADO_LABELS, EMPTY_PEDIDO } from '../../constants';
import styles from './PedidoForm.module.css';

export default function PedidoForm({ onSubmit, pedidoEditar, onCancelarEdicion }) {
  const [form, setForm] = useState(EMPTY_PEDIDO);
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
      setForm(EMPTY_PEDIDO);
    }
  }, [pedidoEditar]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      cantidad: parseInt(form.cantidad, 10),
      precioTotal: parseFloat(form.precioTotal),
    });
    if (!esEdicion) setForm(EMPTY_PEDIDO);
  };

  const cardClase = esEdicion ? styles.cardEditar : styles.cardCrear;
  const btnClase = esEdicion ? styles.btnEditar : styles.btnCrear;

  return (
    <section className={`${styles.card} ${cardClase}`}>
      {/* Encabezado */}
      <div className={styles.header}>
        <h2 className={styles.titulo}>
          {esEdicion ? `✏️ Editando Pedido #${pedidoEditar.id}` : '➕ Nuevo Pedido'}
        </h2>
        {esEdicion && (
          <button type="button" className={styles.cancelBtn} onClick={onCancelarEdicion}>
            Cancelar
          </button>
        )}
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="cliente">Cliente</label>
            <input
              id="cliente"
              className={styles.input}
              type="text"
              name="cliente"
              value={form.cliente}
              onChange={handleChange}
              placeholder="Nombre del cliente"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="producto">Producto</label>
            <input
              id="producto"
              className={styles.input}
              type="text"
              name="producto"
              value={form.producto}
              onChange={handleChange}
              placeholder="Nombre del producto"
              required
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="cantidad">Cantidad</label>
            <input
              id="cantidad"
              className={styles.input}
              type="number"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="precioTotal">Precio Total ($)</label>
            <input
              id="precioTotal"
              className={styles.input}
              type="number"
              name="precioTotal"
              value={form.precioTotal}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              className={styles.select}
              name="estado"
              value={form.estado}
              onChange={handleChange}
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {ESTADO_LABELS[e]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className={`${styles.submitBtn} ${btnClase}`}>
          {esEdicion ? '💾 Guardar Cambios' : '📝 Crear Pedido'}
        </button>
      </form>
    </section>
  );
}
