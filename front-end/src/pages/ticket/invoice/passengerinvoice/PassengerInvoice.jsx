import React from 'react'
import BusImg from "/images/bus.png"
import QrImg from "/images/qrcode.jpg"
import { FaCircleCheck } from 'react-icons/fa6'
import { IoCloseCircle } from 'react-icons/io5'
import { FaPhone } from 'react-icons/fa'

const PassengerInvoice = ({ bookingData, currentSeatIndex }) => {
    if (!bookingData) return null;

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    return (
        <div className='w-full col-span-4 rounded-3xl relative'>

            {/* Top bus details */}
            <div className="w-full flex gap-8 items-center justify-between bg-primary px-5 py-6 rounded-tl-3xl">
                <div className="flex items-center gap-x-3">
                    <img src={BusImg} alt="Bus" className="w-auto h-12 object-cover object-center" />
                    <h1 className="text-xl text-neutral-50 font-bold uppercase tracking-wider pt-1">
                        {bookingData?.busName}
                    </h1>
                </div>

                <div className="flex items-center gap-x-2">
                    <p className="text-xl text-neutral-50 font-bold">
                        <span className="text-lg">(Bus no.)</span>
                        {bookingData?.busNumber}
                    </p>
                </div>
            </div>

            <div className="w-full grid grid-cols-5 gap-8 items-start px-5 py-6 mb-1">
                <div className="col-span-4 space-y-4">

                    {/*Billno, per seat and date */}
                    <div className="w-full flex items-center justify-between border-dashed border-b-2 border-neutral-200 pb-3">
                        <p className="text-base text-neutral-600 font-medium flex gap-x-2">
                            <span>Bill No.:</span>
                            <span className="font-normal">{bookingData.bookingId}</span>
                        </p>
                        <p className="text-base text-neutral-600 font-medium flex gap-x-2">
                            <span>Price:</span>
                            <span className="font-normal">Rs {bookingData.pricePerSeat}/seat</span>
                        </p>
                        <p className="text-base text-neutral-600 font-medium flex gap-x-2">
                            <span>Date:</span>
                            <span className="font-normal">{formatDate(bookingData.bookingDate)}</span>
                        </p>
                    </div>

                    {/* Passenger detail */}
                    <div className="w-full flex items-start justify-between">
                        <div className="space-y-2.5">
                            <p className="text-base text-neutral-600 flex gap-x-2">
                                <span className="font-medium min-w-[140px]">Name of Passenger:</span>
                                <span>{bookingData.passengerName}</span>
                            </p>
                            <p className="text-base text-neutral-600 flex gap-x-2">
                                <span className="font-medium min-w-[140px]">Seat Number:</span>
                                <span>{(bookingData?.seats?.length > 0) ? bookingData.seats.join() : 0}</span>
                            </p>
                            <p className="text-base text-neutral-600 flex gap-x-2">
                                <span className="font-medium min-w-[140px]">Total Seats:</span>
                                <span>{bookingData.seats.length}</span>
                            </p>
                            <p className="text-base text-neutral-600 flex gap-x-2">
                                <span className="font-medium min-w-[140px]">Pickup Point:</span>
                                <span>{bookingData.pickupPoint}</span>
                            </p>
                        </div>
                        <div className="space-y-4 flex flex-col items-end">
                            <div className="text-right space-y-1">
                                <p className="text-base text-neutral-600 font-medium">
                                    Total Price:
                                </p>
                                <h1 className="text-2xl text-neutral-800 font-bold">
                                    Rs {bookingData.totalAmount}
                                </h1>
                            </div>
                            <div className="w-fit px-3 py-1.5 rounded-full bg-green-500/5 border border-green-600 text-green-600 text-sm font-medium flex items-center gap-x-2">
                                <FaCircleCheck size={14} />
                                <span>Payment Complete</span>
                            </div>
                        </div>
                    </div>

                    {/* Route detail */}
                    <div className="w-full flex items-center justify-between border-dashed border-t-2 border-neutral-200 pt-3">
                        <div className="flex items-center gap-x-3">
                            <p className="text-base text-neutral-600 font-medium">{bookingData.fromCity}</p>
                            <span className="text-neutral-400">→</span>
                            <p className="text-base text-neutral-600 font-medium">{bookingData.toCity}</p>
                        </div>
                        <div className="flex items-center gap-x-4">
                            <p className="text-base text-neutral-600 flex gap-x-2">
                                <span className="font-medium">Departure:</span>
                                <span>{formatTime(bookingData.departureTime)}</span>
                            </p>
                            <p className="text-base text-neutral-600 flex gap-x-2">
                                <span className="font-medium">Arrival:</span>
                                <span>{formatTime(bookingData.arrivalTime)}</span>
                            </p>
                        </div>
                    </div>

                </div>

                <div className="col-span-1 border border-neutral-200 rounded-xl shadow-sm p-2">
                    <div className="aspect-square relative rounded-lg overflow-hidden">
                        <img 
                            src={QrImg} 
                            alt={`QR Code for booking ${bookingData.bookingId}`} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-end justify-center pb-2">
                            <p className="text-[10px] text-neutral-600 bg-white/90 px-2 py-0.5 rounded">
                                Scan to verify
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer section */}
            <div className="w-full bg-primary py-3 px-6 rounded-bl-3xl flex items-center justify-between">
                <p className="text-sm text-neutral-50 font-normal">
                    Note: 40% cancellation charge within 24 hours of travel
                </p>
                <div className="flex items-center gap-x-2">
                    <FaPhone className='w-3.5 h-3.5 text-neutral-50' />
                    <p className="text-sm text-neutral-50 font-normal">
                        {bookingData.contactPhone || '+91 98765432100'}
                    </p>
                </div>
            </div>

        </div>
    )
}

export default PassengerInvoice