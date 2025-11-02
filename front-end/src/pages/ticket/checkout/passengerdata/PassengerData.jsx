// src/pages/ticket/checkout/passengerdata/PassengerData.js (Full Code)

import React, { useState, useEffect } from 'react';
import PaymentMethod from './payment/PaymentMethod';
import { useAuth } from '../../../../contexts/AuthContext';

// This component is now a "container" for the form fields.
// It does NOT handle the final submission logic itself.
// It receives bookingDetails and its setter function from its parent (Checkout.js).
const PassengerData = ({ trip, bookingDetails, onBookingDetailsChange }) => {
    const { user } = useAuth();
    
    // State for form fields managed directly by this component
    const [contactDetails, setContactDetails] = useState({ email: '', phone: '' });
    const [passengers, setPassengers] = useState([]);
    const [errors, setErrors] = useState({});

    // Effect to initialize the form fields with user and trip data
    useEffect(() => {
        if (user) {
            setContactDetails({ email: user.email || '', phone: user.phone || '' });
        }
        if (trip?.selectedSeats) {
            const initialPassengers = trip.selectedSeats.map((seat, index) => {
                const name = index === 0 && user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
                return { seatNumber: seat, name, age: '', gender: 'male' };
            });
            setPassengers(initialPassengers);
        }
    }, [trip, user]);

    // Input handlers for the fields in this component
    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContactDetails(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handlePassengerChange = (index, e) => {
        const { name, value } = e.target;
        const updatedPassengers = [...passengers];
        updatedPassengers[index][name] = value;
        setPassengers(updatedPassengers);
        if (errors.passengers?.[index]?.[name]) {
            const updatedErrors = { ...errors };
            delete updatedErrors.passengers[index][name];
            if (Object.keys(updatedErrors.passengers[index]).length === 0) delete updatedErrors.passengers[index];
            setErrors(updatedErrors);
        }
    };

    // Handler for pickup/drop point changes (updates the parent state via prop function)
    const handleBookingDetailsChange = (e) => {
        const { name, value } = e.target;
        onBookingDetailsChange(prev => ({ ...prev, [name]: value }));
    };
    
    // This validation function is crucial. It stays here and gets passed down
    // to PaymentMethod so it can be called before the API request.
    const validateForm = () => {
        const newErrors = { passengers: [] };

        if (!contactDetails.email.trim() || !/\S+@\S+\.\S+/.test(contactDetails.email)) {
            newErrors.email = "A valid email is required";
        }
        if (!contactDetails.phone.trim()) {
            newErrors.phone = "Phone number is required";
        }

        passengers.forEach((passenger, index) => {
            const passengerErrors = {};
            if (!passenger.name.trim()) {
                passengerErrors.name = "Full name is required";
            }
            if (!passenger.age || passenger.age < 1 || passenger.age > 120) {
                passengerErrors.age = "A valid age is required";
            }
            if (Object.keys(passengerErrors).length > 0) {
                newErrors.passengers[index] = passengerErrors;
            }
        });
        
        if (newErrors.passengers.length === 0) delete newErrors.passengers;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className='w-full col-span-4 py-4 space-y-6'>
            <h1 className="text-xl text-neutral-700 font-semibold">
                Passenger & Contact Information
            </h1>
            
            <div className="space-y-7">
                {/* Contact Details Section */}
                <div className="p-4 border border-neutral-300 rounded-xl bg-white shadow-sm space-y-4">
                    <h2 className="text-lg font-medium text-neutral-800">Contact Details</h2>
                    <p className="text-sm text-neutral-500 -mt-2">Your ticket and booking details will be sent here.</p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="w-full space-y-2">
                            <label htmlFor="email" className="text-sm text-neutral-500 font-medium">Email Address *</label>
                            <input type="email" name="email" value={contactDetails.email} onChange={handleContactChange} placeholder='e.g. john@example.com' className={`w-full h-14 px-4 bg-neutral-100/40 focus:bg-neutral-100/70 border rounded-xl focus:outline-none text-base font-normal ${errors.email ? 'border-red-500' : 'border-neutral-400/50'}`} />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>
                        <div className="w-full space-y-2">
                            <label htmlFor="phone" className="text-sm text-neutral-500 font-medium">Phone Number *</label>
                            <input type="tel" name="phone" value={contactDetails.phone} onChange={handleContactChange} placeholder='e.g. +91 9876543210' className={`w-full h-14 px-4 bg-neutral-100/40 focus:bg-neutral-100/70 border rounded-xl focus:outline-none text-base font-normal ${errors.phone ? 'border-red-500' : 'border-neutral-400/50'}`} />
                            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                        </div>
                    </div>
                </div>

                {/* Passenger Forms Section */}
                {passengers.map((passenger, index) => (
                    <div key={index} className="p-4 border border-neutral-300 rounded-xl bg-white shadow-sm space-y-4">
                        <h2 className="text-lg font-medium text-neutral-800">
                            Passenger {index + 1} <span className="text-base font-normal text-neutral-600">(Seat: {passenger.seatNumber})</span>
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="w-full space-y-2 md:col-span-1">
                                <label className="text-sm text-neutral-500 font-medium">Full Name *</label>
                                <input type="text" name="name" value={passenger.name} onChange={(e) => handlePassengerChange(index, e)} placeholder='e.g. Jane Doe' className={`w-full h-14 px-4 bg-neutral-100/40 border rounded-xl ${errors.passengers?.[index]?.name ? 'border-red-500' : 'border-neutral-400/50'}`} />
                                {errors.passengers?.[index]?.name && <p className="text-red-500 text-sm">{errors.passengers[index].name}</p>}
                            </div>
                            <div className="w-full space-y-2">
                                <label className="text-sm text-neutral-500 font-medium">Age *</label>
                                <input type="number" name="age" value={passenger.age} onChange={(e) => handlePassengerChange(index, e)} min="1" max="120" placeholder='e.g. 25' className={`w-full h-14 px-4 bg-neutral-100/40 border rounded-xl ${errors.passengers?.[index]?.age ? 'border-red-500' : 'border-neutral-400/50'}`} />
                                {errors.passengers?.[index]?.age && <p className="text-red-500 text-sm">{errors.passengers[index].age}</p>}
                            </div>
                            <div className="w-full space-y-2">
                                <label className="text-sm text-neutral-500 font-medium">Gender *</label>
                                <select name="gender" value={passenger.gender} onChange={(e) => handlePassengerChange(index, e)} className="w-full h-14 px-4 bg-neutral-100/40 border border-neutral-400/50 rounded-xl">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Pickup & Drop Point Section */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="w-full space-y-2">
                        <label className="text-sm text-neutral-500 font-medium">Pickup Point</label>
                        <select name="pickupPoint" value={bookingDetails.pickupPoint} onChange={handleBookingDetailsChange} className="w-full h-14 px-4 bg-neutral-100/40 border border-neutral-400/50 rounded-xl">
                            <option value="">Choose a pickup point</option>
                            {trip?.pickupPoints?.map(point => <option key={point} value={point}>{point}</option>)}
                        </select>
                    </div>
                    <div className="w-full space-y-2">
                        <label className="text-sm text-neutral-500 font-medium">Drop Point</label>
                        <select name="dropPoint" value={bookingDetails.dropPoint} onChange={handleBookingDetailsChange} className="w-full h-14 px-4 bg-neutral-100/40 border border-neutral-400/50 rounded-xl">
                            <option value="">Choose a drop point</option>
                            {trip?.dropPoints?.map(point => <option key={point} value={point}>{point}</option>)}
                        </select>
                    </div>
                </div>

                {/* --- THIS IS THE KEY --- */}
                {/* Pass all the necessary data and functions down to the smart PaymentMethod component */}
                <PaymentMethod 
                  trip={trip}
                  passengers={passengers}
                  contactDetails={contactDetails}
                  bookingDetails={bookingDetails}
                  onBookingDetailsChange={onBookingDetailsChange}
                  validateForm={validateForm} 
                />
            </div>
        </div>
    );
};

export default PassengerData;