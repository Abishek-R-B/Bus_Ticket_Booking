import React from 'react'
import RootLayout from '../../layout/RootLayout'
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import MasterCardImg from "/images/mastercard.png"
import CreditCardImg from "/images/creditcard.png"
import PaypalImg from "/images/paypal.png"
import { Link } from 'react-router-dom'


const Footer = () => {
  return (
    <div className='w-full h-auto bg-neutral-950 py-12'>

        <RootLayout className="space-y-10">
            {/*Footer content */}
            <div className="w-full grid grid-cols-5 gap-8">
                <div className="col-span-2 space-y-8 md:pr-10 pr-0">
                    <div className="space-y-3">
                    {/*Logo */}
                     <Link to = "/" className='text-6xl text-red-500 font-bold'>
                            Bus
                     </Link>

                      {/*Some description */}

                    <p className="text-sm text-neutral-500 font-normal">
                        Bus is all about booking ticket
                    </p>
                    </div>
                    
                    {/*Social links */}
                    <div className="w-full flex items-center gap-x-5">
                        <div className="w-11 h-11 rounded-xl bg-neutral-800/40 hover:bg-primary flex items-center justify-center cursor-pointer ease-in-out duration-500">
                            <FaInstagram className='w-5 h-5 text-neutral-50'/>
                        </div>

                        <div className="w-11 h-11 rounded-xl bg-neutral-800/40 hover:bg-primary flex items-center justify-center cursor-pointer ease-in-out duration-500">
                            <FaFacebook className='w-5 h-5 text-neutral-50'/>
                        </div>

                        <div className="w-11 h-11 rounded-xl bg-neutral-800/40 hover:bg-primary flex items-center justify-center cursor-pointer ease-in-out duration-500">
                            <FaYoutube className='w-5 h-5 text-neutral-50'/>
                        </div>

                        <div className="w-11 h-11 rounded-xl bg-neutral-800/40 hover:bg-primary flex items-center justify-center cursor-pointer ease-in-out duration-500">
                            <FaXTwitter className='w-5 h-5 text-neutral-50'/>
                        </div>
                    </div>
                </div>
                <div className="col-span-1 space-y-5">
                    <h1 className="text-lg text-neutral-100 font-semibold">
                        Quick Links
                    </h1>
                    <div className="space-y-2">
                        <Link to="/" className='block text-base text-neutral-500 hover:text-neutral-300 font-normal ease-in-out duration-300'>
                            About us
                        </Link>

                        <Link to="/" className='block text-base text-neutral-500 hover:text-neutral-300 font-normal ease-in-out duration-300'>
                            My Account
                        </Link>
                        
                        <Link to="/" className='block text-base text-neutral-500 hover:text-neutral-300 font-normal ease-in-out duration-300'>
                            Reserve your ticket
                        </Link>
                        
                        <Link to="/" className='block text-base text-neutral-500 hover:text-neutral-300 font-normal ease-in-out duration-300'>
                            Create your account
                        </Link>
                    
                    </div>
                </div>

                <div className="col-span-1 space-y-5">

                    <h1 className="text-lg text-neutral-100 font-semibold">
                        top reserved Routes
                    </h1>
                    <div className="space-y-2">
                        <Link to="/" className='block text-base text-neutral-500 hover:text-neutral-300 font-normal ease-in-out duration-300'>
                            Chennai - bengaluru
                        </Link>

                        <Link to="/" className='block text-base text-neutral-500 hover:text-neutral-300 font-normal ease-in-out duration-300'>
                            Madurai - Chennai
                        </Link>
                        
                        <Link to="/" className='block text-base text-neutral-500 hover:text-neutral-300 font-normal ease-in-out duration-300'>
                            Coimbatore - Goa
                        </Link>
                        
                        <Link to="/" className='block text-base text-neutral-500 hover:text-neutral-300 font-normal ease-in-out duration-300'>
                            Kaniyakumari - Pondichery
                        </Link>

                </div>
                
                <div className="col-span-1 space-y-5"></div>
            
                </div>

                <div className="col-span-1 space-y-5">

                    <h1 className="text-lg text-neutral-100 font-semibold">
                        Support Links
                    </h1>
                    <div className="space-y-2">
                        <Link to="/" className='block text-base text-neutral-500 hover:text-neutral-300 font-normal ease-in-out duration-300'>
                            Privacy policy
                        </Link>

                        <Link to="/" className='block text-base text-neutral-500 hover:text-neutral-300 font-normal ease-in-out duration-300'>
                            Terms and Conditions
                        </Link>
                        
                        <Link to="/" className='block text-base text-neutral-500 hover:text-neutral-300 font-normal ease-in-out duration-300'>
                            Help & Support Center
                        </Link>
                        
                        <Link to="/" className='block text-base text-neutral-500 hover:text-neutral-300 font-normal ease-in-out duration-300'>
                            FAQs
                        </Link>
                    </div>
                </div>

                {/*Seperator */}
                <div className="w-full h-px bg-neutral-800/50">

                </div>

                {/*Copyright */}
                <div className="w-full flex items-center justify-between">
                    <p className="text-sm text-neutral-600 font-normal">
                        Copyright &copy; 2025. All rights reserved.
                    </p>

                    <div className="flex items-center gap-x-2">
                        <img src={MasterCardImg} alt="" className="w-fit h-9 object-contain object-center"/>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <img src={CreditCardImg} alt="" className="w-fit h-9 object-contain object-center"/>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <img src={PaypalImg} alt="" className="w-fit h-9 object-contain object-center"/>
                    </div>
                </div>    

            </div>
        </RootLayout>

    </div>
  )
}

export default Footer