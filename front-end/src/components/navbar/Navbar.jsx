
import React, { useState, useEffect } from 'react'
import { FaBars, FaX, FaUser, FaRightFromBracket } from 'react-icons/fa6'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = () => {

  const[scrollPosition, setScrollPosition] = React.useState(0);
  const[isVisible,setIsVisible] = useState(true);
  const[open,setOpen] = useState(false);
  const[showUserMenu, setShowUserMenu] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

    {/*Navbar Items */}
  const navItems = [
    {label: "Home", link: "/"},
    {label: "Services",link: "/services"},
    {label: "Tickets",link: "/bus-tickets"},
    {label: "About",link: "/about"},
  ]

    {/*Handle Clicks */}
  const handleOpen = () => {
    setOpen(!open)
  }

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  }


  useEffect(() => {
    const handleScroll = () => {
        const currentScrollState = window.scrollY;
        if (currentScrollState > scrollPosition && currentScrollState >50){
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setScrollPosition(currentScrollState);
        };
        window.addEventListener('scroll',handleScroll);
        return () => window.removeEventListener('scroll',handleScroll);
  },[scrollPosition]);


  return (
    <div 
       className={`w-full h-[8ch] fixed top-0 left-0 lg:px-24 md:px-16 sm:px-7 px-4 backdrop-blur-lg transition-transform duration-300 z-50
       ${isVisible ? "translate-y-0" : "-translate-y-full"}
       ${scrollPosition > 50 ? "bg-red-300" : "bg-neutral-100/10"}`}
    >
      <div className="w-fill h-full flex items-center justify-between">
        {/*Logo */}
        <Link to = "/" className='text-4xl text-red-500 font-bold'>
            Let's Go
        </Link>

        {/*Menu */}
        <div className="w-fit md:hidden flex items-center justify-center cursor-pointer flex-col gap-1 text-neutral-700" onClick={handleOpen}>
            { open ? <FaX  className='w-5 h-5'/> : <FaBars className='w-5 h-5' />} 
        </div>

        {/*Nav links */}
        <div className={`${open ? "flex absolute top-20 left-0 w-full h-auto md:relative":"hidden"} flex-1 md:flex flex-col md:flex-row md:gap-14 gap-8 md:items-center items-start md:p-0 sm:p-4 justify-end md:bg-transparent bg-neutral-50 border md:border-transparent border-neutral-200 md:shadow-none sm.shadow-md shadow-md rounded-xl`}>
          <ul className="list-none flex md:items-center items-start flex-wrap md:flex-row flex-col md:gap-8 gap-4 text-lg text-neutral-500 font-normal">
              {navItems.map((item, ind) => (
                  <li key={ind}>
                    <Link to = {item.link} className='hover:text-red-500 ease-in-out duration-300'>
                         {item.label}
                    </Link>
                  </li>
              ))}
          </ul>

        {/*Button */}
          <div className="flex items-center justify-center relative">
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 md:px-4 px-6 md:py-2 py-3 bg-red-500 hover:bg-red-600 border border-red-500 md:rounded-full rounded-xl text-base font-normal text-neutral-50 ease-in-out duration-300"
                >
                  <FaUser className="w-4 h-4" />
                  <span className="hidden md:block">{user?.firstName || 'User'}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/my-bookings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FaRightFromBracket className="w-3 h-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="md:w-fit w-full md:px-4 px-6 md:py-1 py-2 bg-red-500 hover:bg-transparent border border-red-500 hover:border-red-500 md:rounded-full rounded-xl text-base font-normal text-neutral-50 hover:text-red-500 ease-in-out duration-300">
                  Sign In
                </button>
              </Link>
            )}
          </div> 
        </div>

      </div>
    </div>
  );
}

export default Navbar;