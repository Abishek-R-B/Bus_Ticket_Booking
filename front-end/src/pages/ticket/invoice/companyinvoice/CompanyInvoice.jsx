import React from 'react'
import { FaPhone } from 'react-icons/fa'

const CompanyInvoice = ({
    bookingId,
    bookingDate,
    passengerName,
    fromCity,
    toCity,
    pickupPoint,
    dropPoint,
    departureTime,
    arrivalTime,
    seatNumber,
    contactPhone,
}) => {
    return (
        <div className='w-full col-span-1 border-dashed border-l-2 border-neutral-400 relative'>
            <div className="w-full bg-primary px-4 py-5 rounded-tr-3xl">
                <h1 className="text-2xl text-neutral-50 font-bold text-center">
                    Bus Ticket
                </h1>
            </div>
            {/* --- FIX: Use props instead of hardcoded values --- */}
            <div className="w-full px-4 py-7 space-y-1">
                <p className="text-sm text-neutral-600 font-normal">
                    Bill No.: {bookingId}
                </p>
                <p className="text-sm text-neutral-600 font-normal">
                    Date: {bookingDate ? new Date(bookingDate).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-sm text-neutral-600 font-normal">
                    Name: {passengerName}
                </p>
                <p className="text-sm text-neutral-600 font-normal">
                    From: {fromCity}
                    <span className="text-xs"> ({pickupPoint})</span>
                </p>
                <p className="text-sm text-neutral-600 font-normal">
                    To: {toCity}
                    <span className="text-xs"> ({dropPoint})</span>
                </p>
                <p className="text-sm text-neutral-600 font-normal">
                    Dept. Time: {departureTime}
                </p>
                <p className="text-sm text-neutral-600 font-normal">
                    Arvl. Time: {arrivalTime}
                </p>
                <p className="text-sm text-neutral-600 font-normal">
                    Seat No.: {seatNumber}
                </p>
            </div>

            <div className="w-full bg-primary absolute bottom-0 right-0 rounded-br-3xl flex items-center justify-center px-5 py-1.5">
                <div className="flex items-center gap-x-2">
                    <FaPhone className='w-3 h-3 text-neutral-100' />
                    <p className="text-sm text-neutral-100 font-light">
                        {contactPhone || '+91 9876543210'} 
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CompanyInvoice;