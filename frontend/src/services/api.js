import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const landlordSignup = {
  step1: async (data) => {
    const response = await axios.post(`${API_URL}/auth/landlord/signup/step1`, data);
    return response.data;
  },
  step2: async (userId, data) => {
    const response = await axios.post(`${API_URL}/auth/landlord/signup/step2/${userId}`, data);
    return response.data;
  }
};

export const landlordAuth = {
  signup: landlordSignup,
  signin: async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/landlord/signin`, credentials);
    return response.data;
  }
};
