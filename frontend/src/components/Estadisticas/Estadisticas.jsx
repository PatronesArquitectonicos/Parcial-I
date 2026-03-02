import React from 'react';
import { ESTADOS, ESTADO_COLORS, ESTADO_LABELS } from '../../constants';
import styles from './Estadisticas.module.css';

export default function Estadisticas({ pedidos }) {
  const total = pedidos.length;
  const totalImporte = pedidos.reduce((acc, p) => acc + (p.precioTotal || 0), 0);

  const conteo = ESTADOS.map((estado) => ({
    estado,
    label: ESTADO_LABELS[estado],
    count: pedidos.filter((p) => p.estado === estado).length,
    color: ESTADO_COLORS[estado],
  }));

  return (
    <div className={styles.wrapper}>
      {/* Total pedidos */}
      <div className={styles.card} style={{ background: '#2c3e50' }}>
        <div className={styles.valor}>{total}</div>
        <div className={styles.label}>Total pedidos</div>
      </div>

      {/* Importe total */}
      <div className={styles.card} style={{ background: '#8e44ad' }}>
        <div className={styles.valor}>
          ${totalImporte.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
        </div>
        <div className={styles.label}>Importe total</div>
      </div>

      {/* Por estado */}
      {conteo.map(({ estado, label, count, color }) => (
        <div key={estado} className={styles.card} style={{ background: color }}>
          <div className={styles.valor}>{count}</div>
          <div className={styles.label}>{label}</div>
        </div>
      ))}
    </div>
  );
}
