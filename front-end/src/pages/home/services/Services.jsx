import React from 'react'
import RootLayout from '../../../layout/RootLayout'
import ServiceCard from '../../../components/service/ServiceCard.jsx'
import { PiHeadsetFill } from 'react-icons/pi'
import { RiRefund2Line, RiSecurePaymentLine } from 'react-icons/ri'

const Services = () => {
return (
    <RootLayout className="space-y-12">"
        <div className="w-full flex items-center justify-center text-center">
            <h1 className="text-3xl ☐ text-neutral-800 font-bold">
                Our <span className="text-primary">Services</span>
            </h1>
        </div>

        <div>
            <div className="w-full grid grid-col-3 gap-10">
                <ServiceCard icon={RiSecurePaymentLine} title={"Secure Payment"} desc={"We make sure that your payment is safe and secure."} />
                <ServiceCard icon={RiRefund2Line} title={"Refund Policy"} desc={"We make sure that your payment is safe and secure."} />
                <ServiceCard icon={PiHeadsetFill} title={"24/7 Support"} desc={"We make sure that your payment is safe and secure."} />
            </div>
        </div>
    </RootLayout>
)}

export default Services