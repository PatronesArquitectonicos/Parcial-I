import React from 'react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>📦 Sistema de Gestión de Pedidos</h1>
      <p className={styles.subtitle}>Administra, filtra y controla todos tus pedidos</p>
    </header>
  );
}
