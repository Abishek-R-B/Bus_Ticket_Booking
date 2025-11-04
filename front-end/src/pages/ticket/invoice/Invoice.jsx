import React, { useRef, useEffect, useState } from 'react'
import PassengerInvoice from './passengerinvoice/PassengerInvoice';
import CompanyInvoice from './companyinvoice/CompanyInvoice';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import RootLayout from '../../../layout/RootLayout';
import TopLayout from '../../../layout/toppage/TopLayout';
import { useParams, useLocation } from 'react-router-dom';
import { bookingAPI, tripAPI } from '../../../services/api.js';

const Invoice = () => {
    const { bookingId } = useParams();
    const location = useLocation();
    const [bookingData, setBookingData] = useState(null);
    const [currentTicket, setCurrentTicket] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const invoiceRef = useRef(null);

    useEffect(() => {
        const fetchBookingData = async () => {
            try {
                setLoading(true); // Start loading
                let dataToSet = null;

                // Priority 1: Check if data was passed via router state
                const bookingFromState = location.state?.booking;
                if (bookingFromState) {
                    dataToSet = bookingFromState;
                }
                // Priority 2: If no state, fetch data using URL param
                else if (bookingId) {
                    dataToSet = await bookingAPI.getBookingByBookingId(bookingId);
                }
                // If neither is available, it's an error
                else {
                    setError("No booking information found.");
                    setLoading(false);
                    return;
                }

                 if (dataToSet) {
                    // --- STEP 1: Get the tripId ---
                    const tripIdToFetch = dataToSet.tripId;
                    
                    if (!tripIdToFetch) {
                        throw new Error("Trip ID is missing from the booking data.");
                    }

                    // --- STEP 2: Make the Second API Call for Trip Details ---
                    const tripResponse = await tripAPI.getTripById(tripIdToFetch);
                    const tripRawData = tripResponse.data?.trip; // Adjust based on your API structure
                    
                    if (!tripRawData) {
                        throw new Error("Could not fetch details for the associated trip.");
                    }

                    // Map the raw API data to a clean object that your components can use.
                    const formattedData = {
                        // Direct mappings
                        bookingId: dataToSet.bookingId,
                        bookingDate: dataToSet.bookingDate,
                        passengerName: dataToSet.passengerName,
                        totalAmount: dataToSet.totalAmount,

                        // Renamed mapping
                        contactPhone: dataToSet.passengerPhone,

                        // Handling the 'seats' array
                        seats: Array.isArray(dataToSet.seatNumbers) ? dataToSet.seatNumbers : [],
                        
                        pickupPoint: dataToSet.pickupPoint,
                        dropPoint: dataToSet.dropPoint,
                        // Fallback mappings (assuming these come from a nested 'trip' object,
                        // if they are at the top level, remove 'dataToSet.trip?.')
                        // From Trip API (dataToSet)
                        busName: tripRawData.busName,
                        busNumber: tripRawData.busNumber,
                        fromCity: tripRawData.fromCity,
                        toCity: tripRawData.toCity,
                        departureTime: tripRawData.departureTime,
                        arrivalTime: tripRawData.arrivalTime,
                        pricePerSeat: tripRawData.basePrice
                    };
                    setBookingData(formattedData);
                }   

                
                
                    
                
            } catch (err) {
                console.error("Error processing booking details:", err);
                setError(err.message || 'Failed to load booking details');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingData();
    }, [bookingId, location.state]);


    //             // Now that we have data, normalize it
    //             if (dataToSet) {
    //                 const normalizedData = {
    //                     ...dataToSet,
    //                     // Ensure 'seats' is always an array
    //                     seats: Array.isArray(dataToSet.seatNumbers)
    //                         ? dataToSet.seatNumbers
    //                         : Array.isArray(dataToSet.seats)
    //                             ? dataToSet.seats
    //                             : [],
    //                 };
    //                 setBookingData(normalizedData);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching/processing booking details:", error);
    //             setError(error.message || 'Failed to load booking details');
    //         } finally {
    //             setLoading(false); // Stop loading
    //         }
    //     };

    //     fetchBookingData();
    // }, [bookingId, location.state]);

    const handleDownload = async () => {
        if (!invoiceRef.current || !bookingData) return;

        try {
            // Generate and download a ticket for each seat
            for (let i = 0; i < bookingData.seats.length; i++) {
                setCurrentTicket(i);
                // Wait for the state update to reflect in the DOM
                await new Promise(resolve => setTimeout(resolve, 100));
                const dataUrl = await toPng(invoiceRef.current);
                download(dataUrl, `bus-ticket-${bookingData.seats[i]}.png`);
            }
        } catch (error) {
            console.error("Error while downloading the invoice", error);
        }
    }

    return (
        <div className="w-full space-y-12 pb-16">
            {/*Top Layout */}
            <TopLayout
                bgImg={"/assets/bus.png"}
                title={"Collect your Invoice"}
            />

            <RootLayout className="space-y-12 w-full pb-16">
                {error && (
                    <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                        Error loading booking details: {error}
                    </div>
                )}

                {loading ? (
                    <div className="w-full h-48 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        <div className="w-full flex items-center justify-center">
                            {bookingData && (
                                <div
                                    ref={invoiceRef}
                                    className="w-[90%] grid grid-cols-5 bg-white rounded-3xl border border-neutral-200 shadow-sm relative"
                                >
                                    {/* Left side (for passenger) */}
                                    <PassengerInvoice
                                        bookingData={bookingData}
                                        currentSeatIndex={currentTicket}
                                    />

                                    {/* Right side (for company) */}
                                    <CompanyInvoice
                                        bookingId={bookingData.bookingId}
                                        bookingDate={bookingData.bookingDate}
                                        passengerName={bookingData.passengerName}
                                        fromCity={bookingData.fromCity}
                                        toCity={bookingData.toCity}
                                        pickupPoint={bookingData.pickupPoint}
                                        dropPoint={bookingData.dropPoint}
                                        departureTime={bookingData.departureTime}
                                        arrivalTime={bookingData.arrivalTime}
                                        seatNumber={bookingData.seats[currentTicket]}
                                        contactPhone={bookingData.contactPhone}
                                    />

                                    {/* Cut circles */}
                                    <div className="absolute -top-3 right-[18.8%] h-6 w-6 rounded-full bg-neutral-50 border border-neutral-50" />
                                    <div className="absolute -bottom-3 right-[18.8%] h-6 w-6 rounded-full bg-neutral-50 border border-neutral-50" />
                                </div>
                            )}
                        </div>

                        {bookingData && (
                            <div className="w-full flex justify-center items-center">
                                <button
                                    onClick={handleDownload}
                                    disabled={!bookingData?.seats?.length}
                                    className="w-fit px-8 h-14 bg-primary text-neutral-50 font-bold text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                                >
                                    Download {bookingData.seats.length > 1 ? 'All Tickets' : 'Ticket'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </RootLayout>
        </div>
    )
}

export default Invoice