import React from 'react';
import { FaBus, FaStar } from 'react-icons/fa';
import { MdOutlineChair } from 'react-icons/md';
import { RiVipFill } from 'react-icons/ri';
import { TbAirConditioning } from 'react-icons/tb';

// Step 1: Accept all the new props here.
// Provide a default empty array for amenities to prevent errors.
const TicketCard = ({
  busName,
  routeFrom,
  routeTo,
  arrivalTime,
  departureTime,
  price,
  availableSeats,
  rating,
}) => {

const numericRating = parseFloat(rating);
const hasValidRating = !isNaN(numericRating) && numericRating > 0;

  return (
    <div className='w-full rounded-xl p-5 border-2 border-neutral-300 space-y-5 hover:border-primary transition-colors duration-300'>

      {/* bus info, routes */}
      <div className="space-y-4 w-full border-b border-neutral-300/60 pb-4">
        <div className="space-y-5">

          {/* Bus Info Section - Now fully dynamic */}
          <div className="w-full flex items-center justify-between flex-wrap gap-y-2">
            <div className="flex items-center gap-x-2">
              <FaBus className='h-5 w-5 text-primary' />
              <p className="text-lg text-neutral-700 font-semibold">
                {busName}
              </p>
            </div>

            {/* A container for all the dynamic tags */}
            <div className="flex items-center gap-x-2">

              {/* Step 2: Use conditional rendering for each tag */}
            

              {/* Conditionally render the Rating tag if a rating exists */}
              {hasValidRating && (
                <div className="flex items-center gap-x-1 bg-neutral-200/65 w-fit rounded-full px-1.5 py-0.5">
                  <FaStar className='w-4 h-4 text-yellow-600' />
                  <p className="text-xs text-yellow-600 font-normal pt-0.5">{Number(rating).toFixed(1)}</p>
                </div>
              )}
              
            </div>
          </div>

          {/* Route (This section was mostly correct, just swapped arrival/departure for clarity) */}
          <div className="space-y-0.5">
            <div className="w-full flex items-center justify-between gap-x-2.5">
              <h1 className="text-2xl text-neutral-600 font-semibold">{departureTime}</h1>
              <div className="flex-1 border-dashed border border-neutral-300 relative">
                <div className="absolute w-14 h-14 p-0.5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-dashed border border-neutral-400 rounded-full flex items-center justify-center">
                  <FaBus className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl text-neutral-600 font-semibold">{arrivalTime}</h1>
            </div>
            <div className="w-full flex items-center justify-between gap-x-5">
              <p className="text-base text-neutral-500 font-normal">{routeFrom}</p>
              <p className="text-base text-neutral-500 font-normal">{routeTo}</p>
            </div>
          </div>

        </div>
      </div>

      {/* price, available seats and reserve button */}
      <div className="w-full flex items-center justify-between">
        <h1 className="text-xl text-neutral-700 font-semibold">
          ₹{price}
          <span className="text-sm text-neutral-500 font-normal">
            /per seat
          </span>
        </h1>

        <h1 className="text-sm text-neutral-600 font-normal flex items-center justify-center gap-x-1.5">
          <span className="text-lg text-green-700 font-bold"> {/* Fixed typo: font-bols -> font-bold */}
            {availableSeats}
          </span> seats available
        </h1>

        {/* Changed to a button as the parent div is already clickable */}
        <button className="w-fit px-8 py-1.5 bg-primary hover:bg-transparent border-2 border-primary hover:border-primary rounded-xl text-sm font-normal text-neutral-50 flex items-center justify-center gap-x-2 hover:text-primary ease-in-out duration-300">
          View Seats
        </button>
      </div>
    </div>
  );
};

export default TicketCard;