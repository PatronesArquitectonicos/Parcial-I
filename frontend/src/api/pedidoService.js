import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api/pedidos';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const pedidoService = {
  getAll: async () => {
    const { data } = await apiClient.get('/');
    return data;
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/${id}`);
    return data;
  },

  create: async (pedido) => {
    const { data } = await apiClient.post('/', pedido);
    return data;
  },

  update: async (id, pedido) => {
    const { data } = await apiClient.put(`/${id}`, pedido);
    return data;
  },

  delete: async (id) => {
    await apiClient.delete(`/${id}`);
  },

  cambiarEstado: async (id, pedidoActual, nuevoEstado) => {
    const { data } = await apiClient.put(`/${id}`, {
      ...pedidoActual,
      estado: nuevoEstado,
    });
    return data;
  },
};

export default pedidoService;
