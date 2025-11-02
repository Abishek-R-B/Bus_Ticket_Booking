// // API endpoint test script
// import axios from 'axios';

// const BASE_URL = 'http://localhost:5001';

// // Test data
// const testUser = {
//   email: 'test1@example.com',
//   password: 'password123',
//   firstName: 'Test1',
//   lastName: 'User',
//   gender: 'male'
// };

// const testTrip = {
//   busId: 'TEST001',
//   busName: 'Test Bus',
//   busNumber: 'TB-001',
//   operator: 'Test Operator',
//   fromCity: 'Test City A',
//   toCity: 'Test City B',
//   departureTime: '2024-12-31T08:00:00Z',
//   arrivalTime: '2024-12-31T12:00:00Z',
//   duration: 240,
//   distance: 200.5,
//   basePrice: 50.00,
//   totalSeats: 40,
//   busType: 'AC'
// };

// async function testAPI() {
//   try {
//     console.log('🚀 Starting API tests...\n');
    
//     // Test 1: Health check
//     console.log('1️⃣ Testing health check...');
//     const healthResponse = await axios.get(`${BASE_URL}/health`);
//     console.log('✅ Health check:', healthResponse.data.message);
    
//     // Test 2: User registration
//     console.log('\n2️⃣ Testing user registration...');
//     try {
//       const registerResponse = await axios.post(`${BASE_URL}/api/users/register`, testUser);
//       console.log('✅ User registered:', registerResponse.data.data.user.email);
//       var authToken = registerResponse.data.data.token;
//     } catch (error) {
//       if (error.response?.status === 409) {
//         console.log('ℹ️  User already exists, testing login...');
//         const loginResponse = await axios.post(`${BASE_URL}/api/users/login`, {
//           email: testUser.email,
//           password: testUser.password
//         });
//         console.log('✅ User logged in:', loginResponse.data.data.user.email);
//         var authToken = loginResponse.data.data.token;
//       } else {
//         throw error;
//       }
//     }
    
//     // Test 3: Get user profile
//     console.log('\n3️⃣ Testing get user profile...');
//     const profileResponse = await axios.get(`${BASE_URL}/api/users/profile`, {
//       headers: { Authorization: `Bearer ${authToken}` }
//     });
//     console.log('✅ Profile retrieved:', profileResponse.data.data.user.firstName);
    
//     // Test 4: Search trips
//     console.log('\n4️⃣ Testing search trips...');
//     const searchResponse = await axios.get(`${BASE_URL}/api/trips/search`, {
//       params: {
//         fromCity: 'New York',
//         toCity: 'Boston',
//         passengers: 1
//       }
//     });
//     console.log('✅ Trips found:', searchResponse.data.data.count);
    
//     // Test 5: Get trip by ID
//     console.log('\n5️⃣ Testing get trip by ID...');
//     if (searchResponse.data.data.trips.length > 0) {
//       const tripId = searchResponse.data.data.trips[0].id;
//       const tripResponse = await axios.get(`${BASE_URL}/api/trips/${tripId}`);
//       console.log('✅ Trip retrieved:', tripResponse.data.data.trip.busName);
      
//       // Test 6: Create booking
//       console.log('\n6️⃣ Testing create booking...');
//       const bookingData = {
//         tripId: tripId,
//         passengerName: 'Test Passenger',
//         passengerEmail: 'passenger@example.com',
//         passengerPhone: '+1234567891',
//         passengerAge: 25,
//         passengerGender: 'male',
//         seatNumbers: [1, 2],
//         totalAmount: 100.00,
//         paymentMethod: 'credit_card',
//         travelDate: '2024-01-15'
//       };
      
//       const bookingResponse = await axios.post(`${BASE_URL}/api/bookings`, bookingData, {
//         headers: { Authorization: `Bearer ${authToken}` }
//       });
//       console.log('✅ Booking created:', bookingResponse.data.data.booking.bookingId);
      
//       // Test 7: Get user bookings
//       console.log('\n7️⃣ Testing get user bookings...');
//       const bookingsResponse = await axios.get(`${BASE_URL}/api/bookings/my-bookings`, {
//         headers: { Authorization: `Bearer ${authToken}` }
//       });
//       console.log('✅ User bookings retrieved:', bookingsResponse.data.data.bookings.length);
      
//     } else {
//       console.log('⚠️  No trips found, skipping booking tests');
//     }
    
//     // Test 8: Get popular routes
//     console.log('\n8️⃣ Testing get popular routes...');
//     const routesResponse = await axios.get(`${BASE_URL}/api/trips/popular-routes`);
//     console.log('✅ Popular routes retrieved:', routesResponse.data.data.routes.length);
    
//     // Test 9: Get bus types
//     console.log('\n9️⃣ Testing get bus types...');
//     const busTypesResponse = await axios.get(`${BASE_URL}/api/trips/bus-types`);
//     console.log('✅ Bus types retrieved:', busTypesResponse.data.data.busTypes.length);
    
//     console.log('\n🎉 All API tests completed successfully!');
    
//   } catch (error) {
//     console.error('❌ API test failed:', error.message);
//     if (error.response) {
//       console.error('Response status:', error.response.status);
//       console.error('Response data:', error.response.data);
//     }
//     process.exit(1);
//   }
// }

// // Run test if this script is executed directly
// if (import.meta.url === `file://${process.argv[1]}`) {
//   testAPI();
// }

// export default testAPI;
