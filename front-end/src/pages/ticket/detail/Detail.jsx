import React from 'react'
import { Link } from 'react-router-dom'
import TopLayout from '../../../layout/toppage/TopLayout'
import RootLayout from '../../../layout/RootLayout'
import WarningAlert from '../../../components/alertmessage/WarningAlert'
import BusSeat from './seat/busseat/BusSeat'
import ToggleBtn from '../../../components/togglebtn/ToggleBtn'
import Amenities from './amenities/Amenities'
import ReservationPolicy from './reservationpolicy/ReservationPolicy'

const Detail = () => {

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
                  <BusSeat />


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