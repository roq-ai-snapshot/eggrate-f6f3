import axios from 'axios';
import queryString from 'query-string';
import { EggRateInterface, EggRateGetQueryInterface } from 'interfaces/egg-rate';
import { GetQueryInterface } from '../../interfaces';

export const getEggRates = async (query?: EggRateGetQueryInterface) => {
  const response = await axios.get(`/api/egg-rates${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEggRate = async (eggRate: EggRateInterface) => {
  const response = await axios.post('/api/egg-rates', eggRate);
  return response.data;
};

export const updateEggRateById = async (id: string, eggRate: EggRateInterface) => {
  const response = await axios.put(`/api/egg-rates/${id}`, eggRate);
  return response.data;
};

export const getEggRateById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/egg-rates/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEggRateById = async (id: string) => {
  const response = await axios.delete(`/api/egg-rates/${id}`);
  return response.data;
};
