

import React from 'react';

const BookingStatus = ({ trip, bookingDetails }) => {

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  const formatPrice = (price) => `₹${price || 0}`;

  return (
    <div className='w-full col-span-3 sticky top-20 space-y-7'>
      <div className="w-full bg-neutral-50 rounded-xl py-4 px-6 border border-neutral-200 shadow-sm space-y-5">
        <h1 className="text-lg text-neutral-700 font-bold text-center border-b border-neutral-200 pb-4">
          Your Ticket Report Status
        </h1>

        <div className="space-y-5">
          <div className="space-y-2 w-full">
            <h1 className="text-base text-neutral-700 font-medium">Your Destination</h1>
            <div className="space-y-0.5 w-full">
               {/* ... same destination JSX ... */}
            </div>
          </div>

          <div className="space-y-2 w-full">
            <h1 className="text-base text-neutral-700 font-medium">Your Seats</h1>
            <div className='w-full flex items-center gap-x-3 flex-wrap'>
              {trip?.selectedSeats?.length > 0 ? (
                trip.selectedSeats.map((seat, index) => (
                  <div key={index} className='w-9 h-9 bg-red-200 rounded-lg flex items-center justify-center text-base text-red-700 font-semibold'>
                    {seat}
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-500 italic">No seats selected</p>
              )}
            </div>
          </div>
          
          {/* This new section displays the live data from the parent state */}
          <div className="space-y-2 w-full">
            <h1 className="text-base text-neutral-700 font-medium">Boarding & Dropping</h1>
            <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                    <span className="text-neutral-500">Pickup Point:</span>
                    <span className="text-neutral-700 font-medium">
                        {bookingDetails?.pickupPoint || <span className="italic text-neutral-400">Not Selected</span>}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-neutral-500">Drop Point:</span>
                    <span className="text-neutral-700 font-medium">
                        {bookingDetails?.dropPoint || <span className="italic text-neutral-400">Not Selected</span>}
                    </span>
                </div>
            </div>
          </div>

          <div className="space-y-2 w-full">
            <h1 className="text-base text-neutral-700 font-medium">Total Fare Price</h1>
            <div className="flex items-center justify-between gap-x-4">
              <div className="flex gap-y-0.5 flex-col">
                <h3 className="text-base text-neutral-500 font-medium">Total Price:</h3>
                <span className="text-xs text-neutral-500 font-normal">(Including all taxes)</span>
              </div>
              <p className="text-base text-neutral-600 font-semibold">
                {formatPrice(trip?.totalPrice)}
              </p>
            </div>
          </div>

          <div className="space-y-2 w-full">
            <h1 className="text-base text-neutral-700 font-medium">Trip Details</h1>
            <div className="space-y-1">
               {/* ... same trip details JSX ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingStatus;