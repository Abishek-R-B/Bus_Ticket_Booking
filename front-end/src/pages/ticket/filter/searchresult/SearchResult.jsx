import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TicketCard from '../../../../components/ticket/TicketCard'
import { GrRefresh } from 'react-icons/gr'
import { FaBus } from 'react-icons/fa'
import { useTrip } from '../../../../contexts/TripContext'
import { BeatLoader } from 'react-spinners'

const SearchResult = () => {
  const { searchResults, searchParams, isLoading } = useTrip();
  const [displayedTrips, setDisplayedTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const hasSearched = searchParams.fromCity && searchParams.toCity;

  const handleTripSelect = (trip) => {
    // Navigate to a URL that includes the trip id so the page can be reloaded
    // while still passing the full trip object in location.state as a fast path.
    navigate(`/bus-tickets/detail/${trip.id}`, {
      state: { trip },
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (isLoading) {
    return (
      <div className='w-full flex flex-col items-center justify-center pt-20 space-y-4'>
        <BeatLoader color="#3B82F6" size={20} />
        <p className="text-lg text-gray-600">Finding the best buses for you...</p>
      </div>
    );
  }

  if (hasSearched && searchResults.length > 0) {
    return (
      <div className='w-full space-y-10 pt-11'>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800">
            Found {searchResults.length} buses from {searchParams.fromCity} to {searchParams.toCity}
          </h3>
        </div>

        <div className="space-y-6">
          {searchResults.map((trip) => (
            <div key={trip.id} onClick={() => handleTripSelect(trip)} className="cursor-pointer">
              {/* This is the corrected block that passes all the dynamic data */}
              <TicketCard 
                busName={trip.busName} 
                routeFrom={trip.fromCity} 
                routeTo={trip.toCity} 
                arrivalTime={formatTime(trip.arrivalTime)} 
                departureTime={formatTime(trip.departureTime)} 
                price={trip.basePrice} // Pass the raw number
                availableSeats={trip.availableSeats}
                // --- PASSING THE NEW DYNAMIC PROPS ---
                totalSeats={trip.totalSeats}
                busType={trip.busType}
                rating={trip.rating}
                amenities={trip.amenities}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12 pt-20">
      <FaBus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Find Your Bus</h3>
      <p className="text-gray-500">Please select your origin, destination, and date to find available buses.</p>
    </div>
  );
};

export default SearchResult;