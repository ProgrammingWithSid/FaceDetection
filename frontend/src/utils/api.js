import axios from "axios";

const BASE_URL = "http://localhost:3001"; 

export const registerUser = async (userData) => {
  try {
    console.log('it came hereee')
    console.log(`${BASE_URL}/user/register`)
    const response = await axios.post(`${BASE_URL}/user/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, userData);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const fetchUserData = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};