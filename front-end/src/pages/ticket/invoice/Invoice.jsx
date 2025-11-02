import React, {useRef} from 'react'
import PassengerInvoice from './passengerinvoice/PassengerInvoice';
import CompanyInvoice from './companyinvoice/CompanyInvoice';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import RootLayout from '../../../layout/RootLayout';
import TopLayout from '../../../layout/toppage/TopLayout';

const Invoice = () => {

    const invoiceRef = useRef(null);

    const handleDownload = async () => {
        if (invoiceRef.current === null) return;
        try {
            // convert the invoice card to an image
            const dataUrl = await toPng(invoiceRef.current);
            download(dataUrl, "bus-ticket.png");
            //npm install html-to-image downloadjs
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
                <div className="w-full flex items-center justify-center">

                    {/* invoice card */}
                    <div
                        ref={invoiceRef}
                        className="w-[90%] grid grid-cols-5 bg-white rounded-3xl border border-neutral-200 shadow-sm relative"
                    >
                        
                        {/* Left side (for passenger) */}
                        <PassengerInvoice />

                        {/* Right side (for company) */}
                        <CompanyInvoice />
                        
                        {/* Cut circle */}
                        <div className="absolute -top-3 right-[18.8%] h-6 w-6 rounded-full bg-neutral-50 border border-neutral-50" />
                        <div className="absolute -bottom-3 right-[18.8%] h-6 w-6 rounded-full bg-neutral-50 border border-neutral-50" />

                    </div>

                </div>

            {/* Download invoice card button */}
            <div className="w-full flex justify-center items-center">
                <button onClick={handleDownload} className="w-fit px-8 h-14 bg-primary text-neutral-50 font-bold text-lg rounded-lg">
                    Download Invoice
                </button> 
            </div>

               

            </RootLayout>


        </div>
    )
}

export default Invoice