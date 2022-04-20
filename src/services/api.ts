import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path:
    process.env.NODE_ENV === 'development'
      ? path.join(__dirname, '..', '..', '.env.development')
      : path.join(__dirname, '..', '..', '.env.local'),
});

const api = axios.create({
  baseURL: 'https://api-sga-dev.pm.ce.gov.br',
  headers: {
    Authorization: `Bearer ${process.env.SGA_TOKEN}`,
  },
});

export default api;
