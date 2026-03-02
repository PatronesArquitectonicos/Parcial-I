export const ESTADOS = ['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO'];

export const ESTADO_LABELS = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En Proceso',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado',
};

export const ESTADO_COLORS = {
  PENDIENTE: '#f39c12',
  EN_PROCESO: '#3498db',
  COMPLETADO: '#27ae60',
  CANCELADO: '#e74c3c',
};

export const FILTROS = ['TODOS', ...ESTADOS];

export const EMPTY_PEDIDO = {
  cliente: '',
  producto: '',
  cantidad: 1,
  precioTotal: 0,
  estado: 'PENDIENTE',
};
