import axios from 'axios';

export const getTanques = () => axios.get('/api/tanque-intermedio/listar');
export const getFlota = () => axios.get('/api/flota/listar');