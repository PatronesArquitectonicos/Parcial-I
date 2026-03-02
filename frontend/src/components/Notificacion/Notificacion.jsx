import React from 'react';
import styles from './Notificacion.module.css';

export default function Notificacion({ msg, tipo, onClose }) {
  if (!msg) return null;

  const clasesTipo = tipo === 'error' ? styles.error : styles.success;

  return (
    <div className={`${styles.toast} ${clasesTipo}`} role="alert">
      <span>{msg}</span>
      {onClose && (
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
          ×
        </button>
      )}
    </div>
  );
}
