import React, { useState, useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import TopLayout from '../../../layout/toppage/TopLayout'
import RootLayout from '../../../layout/RootLayout'
import WarningAlert from '../../../components/alertmessage/WarningAlert'
import BusSeat from './seat/busseat/BusSeat'
import ToggleBtn from '../../../components/togglebtn/ToggleBtn'
import Amenities from './amenities/Amenities'
import ReservationPolicy from './reservationpolicy/ReservationPolicy'
import { tripAPI } from '../../../services/api'

const Detail = () => {

    // Try to consume the trip from location.state first (fast path),
    // otherwise fall back to fetching by id (reload-safe).
    const location = useLocation();
    const params = useParams();
    const initialTrip = location.state?.trip ?? null;
    console.log(initialTrip);
    console.log("params", params);
    
    
    const [trip, setTrip] = useState(initialTrip);
    const [loadingTrip, setLoadingTrip] = useState(!initialTrip && !!params.id);

    useEffect(() => {
        const id = params.id ?? location.state?.trip?.id;
        if (!trip && id) {
            setLoadingTrip(true);
            tripAPI
                .getTripById(id)
                .then((res) => {
                    // tripAPI returns response.data; adjust based on your API helper
                    const data = res?.data ?? res;
                    setTrip(data);
                })
                .catch((err) => {
                    console.error('Failed to load trip:', err);
                })
                .finally(() => setLoadingTrip(false));
        }
    }, [params.id, location.state, trip]);


  //Warning Message
  const message = (
    <>
    One person can only book 6 seats. If you want to book more than 6 seats,
    please <Link to={"/support-team"} className="text-yellow-700 font-medium" >
    Contact our support team.</Link>
    </>  
  );

  return (
    <div className='w-full space-y-12 pb-16'>
        {/*Top Layout */}
        <TopLayout
        bgImg={"/assets/busseats.jpg"}
        title={"Bus Details"}
        />

        <RootLayout className="space-y-12 w-full pb-16">

            {/*Seat layout and selection action detail */}
            <div className="w-full space-y-8">

                  {/*Warning Message */}
                  <WarningAlert message={message}/>

                  {/*Seat Layout */}
                  <BusSeat trip={trip} loading={loadingTrip} />


            </div>

            {/*Bus Detail */}
            <div className="w-full flex items-center justify-center flex-col gap-8 text-center">

                {/*Short Description about the bus */}
                <p className="tex-base text-neutral-500 font-normal text-justify">
                    Sample text
                    <span className="text-lg text-neutral-600 font-medium ml-2">
                        Want to see more about the bus?
                    </span>
                </p>

                {/*Button */}
                <div className="w-full flex items-center justify-center gap-6 flex-col">
                    <ToggleBtn
                        buttonText={"See Bus Details"}
                        buttonTextHidden={"Hide Bus Details"}
                    >
                        <div className="w-full space-y-10">
                            
                            {/*Reservation policy and amenities */}

                            <div className="w-full space-y-10">

                                {/* Amenities */}
                                <Amenities />

                                {/* reservation Policy */}
                                <ReservationPolicy />

                            </div>

                            {/*bus images */}

                        </div>

                    </ToggleBtn>
                </div>
            </div>

        </RootLayout>

    </div>
  )
}

export default Detail