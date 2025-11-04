import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { tripAPI } from '../../services/api';

// For date input min attribute
const today = new Date().toISOString().split('T')[0];

// Protected Route component for admin access
export const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading authentication...</div>;
  if (!user || user.role !== 'admin') {
    toast.error("Access Denied. Admin privileges required.");
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main Admin component for managing trips
function Admin() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [searchTripId, setSearchTripId] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    busId: '',
    busName: '',
    busNumber: '',
    operator: '',
    fromCity: '',
    toCity: '',
    departureTime: '',
    arrivalTime: '',
    duration: '',
    distance: '',
    basePrice: '',
    totalSeats: 37,
    busType: '',
    username: '',
    userId: ''
  });

  // Fetch trips
  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/trips?page=1&limit=1000');
      const dataTrips = response.data?.data?.trips || response.data?.trips || [];

      const mapped = dataTrips.map(t => ({
        id: t.id,
        from: t.from_city || t.fromCity || t.from,
        to: t.to_city || t.toCity || t.to,
        date: String(t.departure_time || t.departureTime || '').split('T')[0],
        username: t.username || '',
        userId: t.userId || '',
        raw: t
      }));
      setTrips(mapped);
      setFilteredTrips(mapped);
    } catch (error) {
      console.error('Failed to load trips', error);
      toast.error('Failed to load trips');
    } finally {
      setIsLoading(false);
    }
  };

  // Load trips on component mount
  useEffect(() => {
    fetchTrips();
  }, []);

  // --- Search logic ---
  useEffect(() => {
    let results = [...trips];
    if (searchTripId) {
      results = results.filter(trip =>
        String(trip.id).toLowerCase().includes(searchTripId.toLowerCase())
      );
    }
    if (searchUser) {
      results = results.filter(
        trip =>
          trip.userId.toLowerCase().includes(searchUser.toLowerCase()) ||
          trip.username.toLowerCase().includes(searchUser.toLowerCase())
      );
    }
    setFilteredTrips(results);
  }, [searchTripId, searchUser, trips]);

  const handleFormChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleClearForm = () => {
    setIsEditing(null);
    setFormData({
      busId: '',
      busName: '',
      busNumber: '',
      operator: '',
      fromCity: '',
      toCity: '',
      departureTime: '',
      arrivalTime: '',
      duration: '',
      distance: '',
      basePrice: '',
      totalSeats: 37,
      busType: '',
      username: '',
      userId: ''
    });
    setStatusMessage('');
    setErrors({});
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setStatusMessage('');
    setIsLoading(true);


    // VALIDATE REQUIRED FIELDS
    const requiredFields = ['busName', 'busNumber', 'operator', 'fromCity', 'toCity', 'departureTime', 'arrivalTime', 'basePrice', 'totalSeats', 'busType'];
    const validationErrors = {};
    requiredFields.forEach(field => {
      if (!formData[field]) {
        validationErrors[field] = 'This field is required.';
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    const departure = new Date(formData.departureTime);
    const arrival = new Date(formData.arrivalTime);
    const durationMinutes = Math.max(1, Math.round((arrival - departure) / (1000 * 60)));

    // CREATE AND FORMAT THE PAYLOAD
    const payload = {
      busId: formData.busId || `BUS${Math.floor(Math.random() * 10000)}`,
      busName: formData.busName,
      busNumber: formData.busNumber,
      operator: formData.operator,
      fromCity: formData.fromCity,
      toCity: formData.toCity,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      duration: durationMinutes,
      distance: Number(formData.distance) || 0,
      basePrice: Number(formData.basePrice) || 0,
      totalSeats: Number(formData.totalSeats) || 0,
      busType: formData.busType
    }

    // SUBMIT TO THE API
    try {
      if (isEditing) {
        console.log("UPDATING trip with payload:", payload);
        const response = await api.put(`/trips/${isEditing}`, payload);
        toast.success(response.data.message || 'Trip updated successfully!');
      } else {
        console.log("CREATING trip with payload:", payload);
        const response = await api.post('/trips', payload);
        toast.success(response.data.message || 'Trip created successfully!');
        // Initialize seats for the new trip
        console.log("Trip response = ",response);
        
        const seatsResponse = await tripAPI.createSeatsForTrip(response?.data?.data?.trip?.id);
        toast.success(seatsResponse.message || 'Seats created successfully! for the trip '+response?.data?.data?.id);
      }
      await fetchTrips();
      handleClearForm();
    } catch (error) {
      // --- FIX: Enhanced error handling to show backend validation messages ---
      if (error.response) {
        console.error('Backend Error:', error.response.data);
        const errorMessage = error.response.data.message || 'An error occurred on the server.';
        setErrors(error.response.data.errors || {});
        toast.error(errorMessage);
        setStatusMessage(errorMessage);
      } else {
        console.error('Network Error:', error.message);
        toast.error('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (trip) => {
    window.scrollTo(0, 0);
    setIsEditing(trip.id);
    const raw = trip.raw || {};

    const getCityName = (cityData) => {
      if (typeof cityData === 'object' && cityData !== null) {
        // It's an object like { name: 'Chennai' }, so return the name
        return cityData.name || '';
      }
      // It's already a string, or it's null/undefined
      return cityData || '';
    };

    setFormData({
      busId: raw.bus_id || raw.busId || '',
      busName: raw.bus_name || raw.busName || '',
      busNumber: raw.bus_number || raw.busNumber || '',
      operator: raw.operator || '',
      fromCity: getCityName(raw.from_city || raw.fromCity),
      toCity: getCityName(raw.to_city || raw.toCity),
      departureTime: String(raw.departure_time || raw.departureTime || '').slice(0, 16),
      arrivalTime: String(raw.arrival_time || raw.arrivalTime || '').slice(0, 16),
      duration: raw.duration || '',
      distance: raw.distance || '',
      basePrice: raw.base_price || raw.basePrice || '',
      totalSeats: raw.total_seats || raw.totalSeats || 37,
      busType: raw.bus_type || raw.busType || '',
    });
  };

  const handleDeleteClick = async (tripId) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this trip? This action is permanent.')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.delete(`/trips/${tripId}`);
      // --- FIX: Assume success if no error is thrown ---
      toast.success(response.data.message || 'Trip deleted successfully');
      setTrips(prev => prev.filter(t => t.id !== tripId));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete trip.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Admin - Manage Trips
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- FORM --- */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            {isEditing ? `Update Trip (ID: ${isEditing})` : 'Create New Trip'}
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Bus Name
              </label>
              <input
                type="text"
                name="busName"
                value={formData.busName}
                onChange={handleFormChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Bus Number
                </label>
                <input
                  type="text"
                  name="busNumber"
                  value={formData.busNumber}
                  onChange={handleFormChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Bus ID
                </label>
                <input
                  type="text"
                  name="busId"
                  value={formData.busId}
                  onChange={handleFormChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Operator
              </label>
              <input
                type="text"
                name="operator"
                value={formData.operator}
                onChange={handleFormChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  From City
                </label>
                <input
                  type="text"
                  name="fromCity"
                  value={formData.fromCity}
                  onChange={handleFormChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  To City
                </label>
                <input
                  type="text"
                  name="toCity"
                  value={formData.toCity}
                  onChange={handleFormChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Departure (local)
                </label>
                <input
                  type="datetime-local"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleFormChange}
                  required
                  min={today + 'T00:00'}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Arrival (local)
                </label>
                <input
                  type="datetime-local"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleFormChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Duration (mins)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleFormChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Distance (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="distance"
                  value={formData.distance}
                  onChange={handleFormChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Total Seats
                </label>
                <input
                  type="number"
                  name="totalSeats"
                  value={formData.totalSeats}
                  onChange={handleFormChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Base Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleFormChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Bus Type
                </label>
                <input
                  type="text"
                  name="busType"
                  value={formData.busType}
                  onChange={handleFormChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {isEditing ? 'Update Trip' : 'Create Trip'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* --- TABLE --- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Existing Trips
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by Trip ID..."
              value={searchTripId}
              onChange={e => setSearchTripId(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Search by User ID or Username..."
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trip ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTrips.length > 0 ? (
                    filteredTrips.map(trip => (
                      <tr key={trip.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {trip.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {trip.from}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {trip.to}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {trip.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div>{trip.username}</div>
                          <div className="text-xs text-gray-400">
                            {trip.userId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditClick(trip)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(trip.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No trips found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
