

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopLayout from '../../../layout/toppage/TopLayout';
import RootLayout from '../../../layout/RootLayout';
import BookingStatus from './bookingstatus/BookingStatus';
import PassengerData from './passengerdata/PassengerData';
import { useAuth } from '../../../contexts/AuthContext';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [trip, setTrip] = useState(null);

  // State for booking details (pickup, drop, payment) is LIFTED UP to this parent component.
  const [bookingDetails, setBookingDetails] = useState({
    paymentMethod: 'credit_card',
    pickupPoint: '',
    dropPoint: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (location.state?.trip) {
      setTrip(location.state.trip);
    } else {
      // If no trip data, redirect to search page to avoid errors.
      navigate('/bus-tickets');
    }
  }, [isAuthenticated, location.state, navigate]);
  
  // A handler function to allow the child (PassengerData) to update this component's state.
  // Accept either an updater function (prev => new) or a direct object.
  const handleBookingDetailsChange = (detailsUpdater) => {
    if (typeof detailsUpdater === 'function') {
      setBookingDetails(prev => detailsUpdater(prev));
    } else {
      setBookingDetails(detailsUpdater);
    }
  };

  if (!trip) {
    return (
      <div className="w-full space-y-12 pb-16">
        <TopLayout 
          bgImg={"/assets/bus.png"}
          title={"Checkout"}
        />
        <RootLayout className="space-y-12 w-full pb-16">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            <span className="ml-3 text-lg text-gray-600">Loading...</span>
          </div>
        </RootLayout>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12 pb-16">
        <TopLayout 
            bgImg={"/assets/bus.png"}
            title={"Checkout"}
        />
        <RootLayout className="space-y-12 w-full pb-16">
            <div className="w-full grid grid-cols-7 items-start gap-44 relative">
                
                {/* Pass state and the handler down to PassengerData */}
                <PassengerData 
                  trip={trip}
                  bookingDetails={bookingDetails}
                  onBookingDetailsChange={handleBookingDetailsChange}
                />

                {/* Pass state down to BookingStatus for display */}
                <BookingStatus 
                  trip={trip} 
                  bookingDetails={bookingDetails} 
                />
                
            </div>
        </RootLayout>
    </div>
  )
}

export default Checkout;