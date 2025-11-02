// Test script to verify API integration
import { authAPI, tripAPI, bookingAPI } from '../services/api.js';

export const testApiIntegration = async () => {
  console.log('Testing API Integration...');
  
  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch('http://localhost:5000/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);

    // Test trip search
    console.log('2. Testing trip search...');
    const searchResult = await tripAPI.searchTrips({
      fromCity: 'Chennai',
      toCity: 'Coimbatore',
      departureDate: new Date().toISOString().split('T')[0],
      passengers: 1
    });
    console.log('Search result:', searchResult);

    // Test bus types
    console.log('3. Testing bus types...');
    const busTypesResult = await tripAPI.getBusTypes();
    console.log('Bus types:', busTypesResult);

    // Test popular routes
    console.log('4. Testing popular routes...');
    const popularRoutesResult = await tripAPI.getPopularRoutes();
    console.log('Popular routes:', popularRoutesResult);

    console.log('API Integration test completed successfully!');
    return true;
  } catch (error) {
    console.error('API Integration test failed:', error);
    return false;
  }
};

// Test user registration (for testing purposes)
export const testUserRegistration = async () => {
  console.log('Testing user registration...');
  
  try {
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123',
      phone: '+919876543210',
      dateOfBirth: '1990-01-01',
      gender: 'male'
    };

    const result = await authAPI.register(testUser);
    console.log('Registration result:', result);
    return result;
  } catch (error) {
    console.error('Registration test failed:', error);
    return { success: false, error: error.message };
  }
};

// Test user login
export const testUserLogin = async (email, password) => {
  console.log('Testing user login...');
  
  try {
    const result = await authAPI.login({ email, password });
    console.log('Login result:', result);
    return result;
  } catch (error) {
    console.error('Login test failed:', error);
    return { success: false, error: error.message };
  }
};

export default testApiIntegration;
