import React from 'react'
import { FaPhone } from 'react-icons/fa'

const CompanyInvoice = () => {
    return (
        <div className='w-full col-span-1 border-dashed border-l-2 border-neutral-400 relative'>
            <div className="w-full bg-primary px-4 py-5 rounded-tr-3xl">
                <h1 className="text-2xl text-neutral-50 font-bold text-center">
                    Bus Ticket
                </h1>
            </div> 
            <div className="w-full px-4 py-7 space-y-1">
                <p className="text-sm text-neutral-600 font-normal">
                    Bill No.:465
                </p>
                <p className="text-sm text-neutral-600 font-normal">
                    Date: 2025-10-25
                </p>
                <p className="text-sm text-neutral-600 font-normal">
                    Name: Abishek
                </p>
                <p className="text-sm text-neutral-600 font-normal">
                    From: Chennai
                     <span className="text-xs">(Tambaram)</span>
                </p>
                <p className="text-sm text-neutral-600 font-normal">
                    To: Coimbatore
                    <span className="text-xs">(Gandi Stop)</span>
                </p>
                <p className="text-sm text-neutral-600 font-normal">
                    Dept. Time: 11:00 PM
                </p>        
                <p className="text-sm text-neutral-600 font-normal">
                    Arvl. Time: 05:00 AM 
                </p>  
                <p className="text-sm text-neutral-600 font-normal">
                    Seat No.: A2
                </p>                          
            </div>

            {/* right Bottom Section */}
            <div className="w-full bg-primary absolute bottom-0 right-0 rounded-br-3xl flex items-center justify-center px-5 py-1.5">
                <div className="flex items-center gap-x-2">
                    <FaPhone className='w-3 h-3 text-neutral-100' />
                    <p className="text-sm text-neutral-100 font-light">
                        +91 98765432109
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CompanyInvoice