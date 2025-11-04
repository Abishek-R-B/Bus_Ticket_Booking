import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GiSteeringWheel } from 'react-icons/gi';
import { MdOutlineChair } from 'react-icons/md';
import { RiMoneyRupeeCircleLine } from 'react-icons/ri';
import ErrorMessage from '../../../../../components/alertmessage/errormsg/ErrorMessage';
// import { Link } from 'react-router-dom';
import { tripAPI, bookingAPI } from '../../../../../services/api.js';

const BusSeat = ({ trip = null, loading = false }) => {
    // Track seat selection
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();
    // Use a Map for efficient seat data lookup
    const [seatData, setSeatData] = useState([]);
    const [isLoadingSeats, setIsLoadingSeats] = useState(true);

const seatMap = useMemo(() => new Map(seatData.map(seat => [String(seat.seat_number), seat])), [seatData]);
    // NEW: Declarative layout matching the image provided
    const seatLayout = [
        ['A1', 'A3', 'A5', 'A7', 'A9', 'A11', 'A13', 'A15', 'A17'],
        ['A2', 'A4', 'A6', 'A8', 'A10', 'A12', 'A14', 'A16', 'A18'],
        [null, null, null, null, null, null, null, null, 'A19'],
        ['B1', 'B3', 'B5', 'B7', 'B9', 'B11', 'B13', 'B15', 'B17'],
        ['B2', 'B4', 'B6', 'B8', 'B10', 'B12', 'B14', 'B16', 'B18'],
    ];

    // FETCH seats from the API when the trip ID is available
    useEffect(() => {
        let mounted = true;
        if (trip?.id) {
            setIsLoadingSeats(true);
            tripAPI.getTripSeatDetails(trip.id)
                .then(apiResp => {
                    // tripAPI may return different shapes depending on backend route:
                    // 1) { success: true, data: [ { seat_number, status, price }, ... ] }
                    // 2) { success: true, data: { tripId, basePrice, bookedSeats: [] } }
                    // 3) directly an array
                    const payload = apiResp?.data ?? apiResp;
                    
                    console.log(payload);
                    

                    if (Array.isArray(payload)) {
                        if (mounted) {
                            setSeatData(payload);
                            setIsLoadingSeats(false);
                        }
                        return;
                    }

                    // If payload contains bookedSeats + basePrice, build seats list
                    if (payload && payload.bookedSeats) {
                        const bookedSeats = payload.bookedSeats || [];
                        const basePrice = Number(payload.basePrice || 0);
                        const seatNumbers = [];
                        for (let i = 1; i <= 19; i++) seatNumbers.push(`A${i}`);
                        for (let i = 1; i <= 18; i++) seatNumbers.push(`B${i}`);

                        const allSeats = payload.bookedSeats.map(sn => ({
                            seat_number: sn.seatNumber,
                            status: sn.status,
                            price: basePrice,
                        }));

                        if (mounted) {
                            setSeatData(allSeats);
                            setIsLoadingSeats(false);
                        }
                        return;
                    }

                    // Fallback: try to coerce payload to array or empty
                    if (mounted) {
                        setSeatData(Array.isArray(payload) ? payload : []);
                        setIsLoadingSeats(false);
                    }
                })
                .catch(err => {
                    console.error('Failed to load seats', err);
                    if (mounted) setIsLoadingSeats(false);
                });
        }

        return () => { mounted = false };
    }, [trip]);

    // Toggle seat selection logic 
    const handleSeatClick = (seatId) => {
        const seat = seatMap.get(seatId);
        console.log("handleSeatClick running...", seatId);
        if (selectedSeats.length > 5) {
            console.log("handleSeatClick selectedSeats is greater than 6...", selectedSeats.length);
            setShowError(true);
            return;
        }

        if (!seat || seat.status === 'booked' || seat.status === 'locked') {
            return;
        }

        const selectedSeat = seatMap.get(String(seatId));


        setSelectedSeats((prev) => {
            if (prev.includes(seatId)) {
                return prev.filter((seat) => seat !== seatId);
            } else {
                console.log("handleSeatClick inside setSelectedSeats...", prev.length);
                if (prev.length > 5) {
                    setShowError(true);
                    return prev;
                } else {
                    return [...prev, seatId];
                }
            }
        });

    };


    // Hide error message logic (no changes needed)
    // useEffect(() => {
    //     if (showError) {
    //         const timer = setTimeout(() => setShowError(false), 5000);
    //         return () => clearTimeout(timer);
    //     }
    // }, [showError]);

    // Determine seat style based on its status (no changes needed)
    const getSeatClassName = (seatId) => {
        // console.log("getSeatClassName ..." +seatId);
        
        const seat = seatMap.get(seatId);
        // console.log("getSeatClassName ...",seat);
        if (!seat) return 'text-neutral-300 cursor-not-allowed'; // A seat in layout but not in API data? Disable.

        if (seat.status === 'booked') {
            return 'text-red-500 cursor-not-allowed';
        }
        if (selectedSeats.includes(seat.seat_number)) {
            return 'text-yellow-600 cursor-pointer';
        }
        return 'text-neutral-500 cursor-pointer';
    };

    // 1. Calculate the total price using useMemo for efficiency
    const totalPrice = useMemo(() => {
        return selectedSeats.reduce((total, seatId) => {
            const seat = seatMap.get(String(seatId));
            return total + (seat ? seat.price : 0);
        }, 0);
    }, [selectedSeats, seatMap]);

    // 2. Prepare the trip data object to pass to the checkout page
    // Use values from `trip` when available, otherwise fall back to sensible defaults.
    const tripDetails = {
        from: trip?.fromCity ?? 'Choose Source',
        to: trip?.toCity ?? 'Choose Destination',
        departureTime: trip?.departureTime ?? 'Choose Departure',
        arrivalTime: trip?.arrivalTime ?? 'Choose Arrival',
        tripId: trip?.id ?? null,
        pricePerSeat: trip?.basePrice ?? null,
        selectedSeats: selectedSeats,
        totalPrice: totalPrice,
    };

    // Create booking and navigate
    const handleBooking = async () => {
        if (!tripDetails.tripId || selectedSeats.length === 0) {
            alert("Please select at least one seat before booking.");
            return;
        }

        try {
            const bookingPayload = {
                tripId: tripDetails.tripId,
                seats: selectedSeats,
                totalPrice: tripDetails.totalPrice,
                fromCity: tripDetails.from,
                toCity: tripDetails.to,
                departureTime: tripDetails.departureTime,
                arrivalTime: tripDetails.arrivalTime,
            };

            console.log("Booking payload:", bookingPayload);

            const response = await bookingAPI.createBooking(bookingPayload);

            if (response?.success) {
                console.log("✅ Booking successful:", response);
                navigate("/bus-tickets/checkout", { state: { booking: response.data } });
            } else {
                console.error("❌ Booking failed:", response?.message || "Unknown error");
                alert("Booking failed. Please try again.");
            }
        } catch (error) {
            console.error("Error creating booking:", error);
            alert("Something went wrong while booking seats.");
        }
    };

    const navigateToCheckout = () => {
        navigate("/bus-tickets/checkout", { state: { trip: tripDetails } });
    };

    return (
        <div className='w-full grid grid-cols-5 gap-10'>
            {/* Seat layout */}
            <div className="col-span-3 w-full flex items-center justify-center shadow-sm rounded-xl p-4 border border-neutral-200">
                <div className="w-full space-y-7">
                    <p className="text-base text-neutral-600 font-medium text-center">
                        Click on available seats to reserve your seat.
                    </p>

                    <div className="w-full flex items-center justify-center gap-x-1.5">
                        <div className="w-10 h-fit">
                            <GiSteeringWheel className="text-3xl mt-7 text-red-500 -rotate-90" />
                        </div>

                        {/* REFACTORED SEAT GRID for perfect alignment */}
                        <div className="flex-1 border-l-2 border-dashed border-neutral-300 pl-7">
                            {/* UPDATED: Using grid-cols-9 to match the new layout */}
                            <div className="grid grid-cols-9 gap-y-3 gap-x-2 justify-items-center">
                                {seatLayout.flat().map((seatId, index) => {
                                    if (seatId === null) {
                                        // Empty div to create spacing in the grid
                                        return <div key={`empty-${index}`} />;
                                    }
                                    const seat = seatMap.get(seatId);
                                    if (!seat) return <div key={`ghost-${index}`} />; // Safety net

                                    return (
                                        <div
                                            key={seatId}
                                            className='flex items-center justify-center cursor-pointer'
                                            onClick={() => handleSeatClick(seatId)}
                                        >
                                            {/* Adjusted font size for consistent spacing */}
                                            <h6 className="text-xs text-neutral-600 font-bold pr-0.5">{seat.seat_number}</h6>
                                            <MdOutlineChair className={`text-3xl -rotate-90 ${getSeatClassName(seatId)}`} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="w-full flex items-center justify-center flex-wrap gap-4 md:gap-6 border-t border-neutral-200 pt-5">
                        <div className="flex items-center gap-x-2">
                            <MdOutlineChair className="text-xl text-neutral-500 -rotate-90" />
                            <p className="text-sm text-neutral-500 font-medium">Available</p>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <MdOutlineChair className="text-xl text-red-500 -rotate-90" />
                            <p className="text-sm text-red-500 font-medium">Booked</p>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <MdOutlineChair className="text-xl text-yellow-600 -rotate-90" />
                            <p className="text-sm text-yellow-600 font-medium">Selected</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fare Details Panel (No changes needed here) */}
            <div className="col-span-2 w-full space-y-5 bg-neutral-50 rounded-xl py-4 px-6 border border-neutral-200 shadow-sm">
                <div className="w-full space-y-2">
                    <div className="w-full flex items-center justify-between">
                        <h1 className="text-lg text-neutral-600 font-medium">
                            Your Destination
                        </h1>
                        <Link to={"/bus-tickets"} className='text-sm text-primary font-normal'>
                            Change route
                        </Link>
                    </div>

                    <div className="space-y-0.5 w-full ">
                        <div className="w-full flex items-center justify-between gap-x-5">
                            <p className="text-sm text-neutral-400 font-normal">
                                From <span className="text-xs">({tripDetails.from})</span>
                            </p>
                            <p className="text-sm text-neutral-400 font-normal">
                                To <span className="text-xs">({tripDetails.to})</span>
                            </p>
                        </div>

                        <div className="w-full flex items-center justify-between gap-x-4">
                            <h1 className="text-sm text-neutral-600 font-normal">
                                {tripDetails.from} <span className="font-medium">({tripDetails.departureTime})</span>
                            </h1>

                            <div className="flex-1 border-dashed border border-neutral-300" />

                            <h1 className="text-sm text-neutral-600 font-normal">
                                {tripDetails.to} <span className="font-medium">({tripDetails.arrivalTime})</span>
                            </h1>
                        </div>

                    </div>
                </div>

                <div className="w-full space-y-2">
                    <div className="w-full flex items-center justify-between">
                        <h1 className="text-lg text-neutral-600 font-medium">
                            Selected Seats
                        </h1>
                        <div className="bg-primary/20 rounder-lg py-0.5 px-1.5 text-xs text-neutral-600 font-normal uppercase">
                            Non Refundable
                        </div>

                    </div>

                    {
                        selectedSeats.length > 0
                            ?
                            <div className='w-full flex items-center gap-x-3'>
                                {selectedSeats.map((seatId) => {
                                    return (
                                        <div key={seatId} className='w-9 h-9 bg-neutral-200/80 rounded-lg flex items-center justify-center text-base text-neutral-700 font-semibold'>
                                            {seatId}
                                        </div>
                                    )
                                })

                                }
                            </div>
                            :
                            <div className='w-full flex items-center gap-x-3'>
                                <p className="text-sm text-neutral-500 font-normal">
                                    No seat selected
                                </p>
                            </div>
                    }

                </div>

                <div className="w-full space-y-2">
                    <h1 className="text-lg text-neutral-600 font-medium">
                        Fair Details
                    </h1>
                    <div className="w-full flex items-center justify-between border-dashed border-l-[1.5px] border-neutral-400 pl-2 ">
                        <h3 className="text-sm text-neutral-500 font-medium">
                            Basic Fare :
                        </h3>
                        <p className="text-sm text-neutral-600 font-medium">
                            Rs. {tripDetails.pricePerSeat} x {selectedSeats.length} seat(s)
                        </p>
                    </div>
                    <div className="flex items-center justify-between gap-x-4">
                        <div className="flex gap-y-0.5 flex-col">
                            <h3 className="text-base text-neutral-500 font-medium">
                                Total Price:
                            </h3>
                            <span className="text-xs text-neutral-500 font-normal"> (Including all taxes)</span>
                        </div>

                        {/* Calculating total price*/}
                        <p className="text-base text-neutral-600 font-semibold">
                            Rs {" "}
                            {selectedSeats.length !== 0 ? (Number(tripDetails.pricePerSeat || 0) * selectedSeats.length) : 0}
                            {/* {selectedSeats.reduce((total, seatId) => {
                                    const seat = busSeatData.find(busSeat => busSeat.id === seatId);
                                    return total + (seat ? seat.price : 0);
                                }, 0)} */}
                        </p>
                    </div>
                </div>

                <div className="w-full flex items-center justify-center">
                    {selectedSeats.length > 0 ? (
                        <button
                            onClick={() => navigateToCheckout()}
                            className='w-full bg-primary hover:bg-primary/90 text-sm text-neutral-50 font-normal py-2.5 flex items-center justify-center uppercase rounded-lg transition'
                        >
                            Proceed to Checkout
                        </button>
                    ) : (
                        <div className='w-full space-y-0.5'>
                            <button disabled className='w-full bg-primary/60 text-sm text-neutral-50 font-normal py-2.5 flex items-center justify-center uppercase rounded-lg transition cursor-not-allowed'>
                                Proceed to Checkout
                            </button>
                            <small className="text-xs text-neutral-600 font-normal px-1">
                                Please select at least one seat to proceed to checkout page.
                            </small>
                        </div>
                    )}
                </div>




            </div>

            {/*Show the errormessage if more than 6 seat are selected */}

            {showError && <ErrorMessage message="You can't select more than 6 seats." />}


        </div>
    )
}

export default BusSeat


