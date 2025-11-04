// src/pages/ticket/checkout/passengerdata/payment/PaymentMethod.jsx (Full Code)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentCard from '../../../../../components/payment/PaymentCard';
import CreditCardImg from "/images/creditcard.png";
import MasterCardImg from "/images/mastercard.png";
import { FaPlus } from 'react-icons/fa';
import { useBooking } from '../../../../../contexts/BookingContext';

const PaymentMethod = ({ trip, passengers, contactDetails, bookingDetails, onBookingDetailsChange, validateForm }) => {
  console.log("PaymentMethod received trip prop:", trip);
  
  const navigate = useNavigate();
  const { createBooking, isLoading } = useBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    onBookingDetailsChange(prev => ({
      ...prev,
      paymentMethod: e.target.value
    }));
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    if (!validateForm()) {
      return; 
    }
    setIsSubmitting(true);

    // --- FINAL PAYLOAD FIX ---
    
    // 1. Extract the NUMERICAL IDs from the full seat objects passed in the trip prop.
    const primaryPassenger = passengers[0] || {}; 

    // 2. Construct the payload with valid data from the complete trip object
    const bookingPayload = {
        tripId: trip.tripId, // Now valid
        passengerName: primaryPassenger.name || '',
        passengerEmail: contactDetails.email || '',
        passengerPhone: contactDetails.phone || '',
        passengerAge: parseInt(primaryPassenger.age, 10) || 0,
        passengerGender: primaryPassenger.gender || 'male',
        seatNumbers: trip.selectedSeats, // Now an array of numbers like [7, 8], not strings
        travelDate: trip.departureTime, // Now valid
        pickupPoint: bookingDetails.pickupPoint,
        dropPoint: bookingDetails.dropPoint,
        paymentMethod: bookingDetails.paymentMethod,
        totalAmount: trip.totalPrice,
    };

    console.log("Submitting Final Corrected Booking Payload:", bookingPayload);

    try {
        const result = await createBooking(bookingPayload);
        if (result.success) {
            navigate('/bus-tickets/payment', { 
                state: { booking: result.data.booking, trip: trip } 
            });
        } else {
            setSubmitError(result.error.message);
        }
    } catch (err) {
        setSubmitError("An unexpected client-side error occurred.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className='w-full space-y-6'>
        <h6 className="text-sm text-neutral-500 font-medium">
            Select Payment Method
        </h6>

        <div className="w-full grid grid-cols-2 gap-10">
            <PaymentCard 
                selectedPayment={bookingDetails.paymentMethod}
                value={"credit_card"}
                onChange={handleChange}
                cardholderName={'Credit Card'}
                cardNumber={"****"}
                cardImage={CreditCardImg}
            />
            <PaymentCard 
                selectedPayment={bookingDetails.paymentMethod}
                value={"debit_card"}
                onChange={handleChange}
                cardholderName={'Debit Card'}
                cardNumber={"****"}
                cardImage={MasterCardImg}
            />
        </div>
        <div className="w-full grid grid-cols-2 gap-10">
            <PaymentCard 
                selectedPayment={bookingDetails.paymentMethod}
                value={"upi"}
                onChange={handleChange}
                cardholderName={'UPI'}
                cardNumber={"UPI"}
                cardImage={CreditCardImg}
            />
            <PaymentCard 
                selectedPayment={bookingDetails.paymentMethod}
                value={"net_banking"}
                onChange={handleChange}
                cardholderName={'Net Banking'}
                cardNumber={"Net Banking"}
                cardImage={MasterCardImg}
            />
        </div>

        <div className="w-full flex justify-end">
            <div className="w-fit flex items-center justify-center gap-x-2 cursor-pointer text-base font-normal text-primary">
                <FaPlus />
                <p className="capitalize"> Add new card</p>
            </div>
        </div>

        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
            {submitError}
          </div>
        )}

        <button 
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || isLoading}
          className="w-full h-14 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || isLoading ? 'Processing...' : 'Proceed to Payment'}
        </button>
    </div>
  );
};

export default PaymentMethod;

// import React, { useState } from 'react'
// import PaymentCard from '../../../../../components/payment/PaymentCard';
// import MasterCardImg from "/images/mastercard.png"
// import CreditCardImg from "/images/creditcard.png"
// import { FaPlus } from 'react-icons/fa'

// const PaymentMethod = ({ formData, setFormData, trip }) => {

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       paymentMethod: e.target.value
//     }));
//   }

//   return (
//     <div className='w-full space-y-3'>
//         <h6 className="text-sm text-neutral-500 font-medium">
//             Select Payment Method
//         </h6>

//         <div className="w-full grid grid-cols-2 gap-10">
//             <PaymentCard 
//                 selectedPayment={formData.paymentMethod}
//                 value={"credit_card"}
//                 onChange={handleChange}
//                 cardholderName={'Credit Card'}
//                 cardNumber={"****"}
//                 cardImage={CreditCardImg}
//             />

//             <PaymentCard 
//                 selectedPayment={formData.paymentMethod}
//                 value={"debit_card"}
//                 onChange={handleChange}
//                 cardholderName={'Debit Card'}
//                 cardNumber={"****"}
//                 cardImage={MasterCardImg}
//             />
//         </div>

//         <div className="w-full grid grid-cols-2 gap-10">
//             <PaymentCard 
//                 selectedPayment={formData.paymentMethod}
//                 value={"upi"}
//                 onChange={handleChange}
//                 cardholderName={'UPI'}
//                 cardNumber={"UPI"}
//                 cardImage={CreditCardImg}
//             />

//             <PaymentCard 
//                 selectedPayment={formData.paymentMethod}
//                 value={"net_banking"}
//                 onChange={handleChange}
//                 cardholderName={'Net Banking'}
//                 cardNumber={"Net Banking"}
//                 cardImage={MasterCardImg}
//             />
//         </div>

//         <div className="w-full flex justify-end">
//             <div className="w-fit flex items-center justify-center gap-x-2 cursor-pointer text-base font-normal text-primary">
//                 <FaPlus />
//                 <p className="capitalize"> Add new card</p>
//             </div>
//         </div>

//     </div>
//   )
// }

// export default PaymentMethod