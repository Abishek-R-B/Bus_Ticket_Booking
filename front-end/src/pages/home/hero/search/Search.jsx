import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa'
import { TbArrowsExchange } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { useTrip } from '../../../../contexts/TripContext'

const getTodayDateString = () => {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().split('T')[0];
};

const Search = () => {
  const [searchData, setSearchData] = useState({
    fromCity: '',
    toCity: '',
    departureDate: getTodayDateString(),
  });

  const { searchTrips, updateSearchParams, isLoading } = useTrip();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwapCities = () => {
    setSearchData(prev => ({
      ...prev,
      fromCity: prev.toCity,
      toCity: prev.fromCity
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchData.fromCity || !searchData.toCity || !searchData.departureDate) {
      alert('Please fill in the origin, destination, and date.');
      return;
    }
    updateSearchParams(searchData);
    const result = await searchTrips(searchData);
    if (result.success) {
      navigate('/bus-tickets');
    } else {
      toast.error(result.error?.message || 'Sorry, no buses were found for this route.');
    }
  };

  return (
     <motion.div
                 initial={{opacity: 0, y:-800}}
                 animate={{opacity: 1, y:0}}
                 exit={{opacity: 0, y:-800}}
                 transition={{duration:1.5,ease:"easeOut"}}
                 className="w-full bg-neutral-50/20 border-2 border-neutral-300 shadow-lg rounded-xl p-5"
     >
            <form onSubmit={handleSearch} className="w-full flex items-center gap-5 justify-between">

                {/*From and to input section */}

                <div className="w-[60%] flex items-center gap-5 relative">

                    <div className="w-1/2 h-14 border border-neutral-300 bg-white/70 text-base text-neutral-700 font-medium px-5 flex items-center gap-x-1 rounded-lg">
                        <input 
                          type="text" 
                          name="fromCity"
                          placeholder="From..." 
                          value={searchData.fromCity}
                          onChange={handleInputChange}
                          className="flex-1 h-full border-none bg-transparent focus:outline-none" 
                          required
                        />
                        <div className="w-5 h-5 text-neutral-400">
                            <FaMapMarkerAlt className='w-full h-full' />
                        </div>
                    </div>

                    <div className="w-1/2 h-14 border border-neutral-300 bg-white/70 text-base text-neutral-700 font-medium px-5 flex items-center gap-x-1 rounded-lg">
                        <input 
                          type="text" 
                          name="toCity"
                          placeholder="To..." 
                          value={searchData.toCity}
                          onChange={handleInputChange}
                          className="flex-1 h-full border-none bg-transparent focus:outline-none" 
                          required
                        />
                        <div className="w-5 h-5 text-neutral-400">
                            <FaMapMarkerAlt className='w-full h-full' />
                        </div>
                    </div>

                    {/*Exchange button */}

                    <button 
                      type="button"
                      onClick={handleSwapCities}
                      className="absolute w-11 h-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center bg-primary hover:bg-primary/80 transition-colors"
                    >
                        <TbArrowsExchange className='w-6 h-6 text-neutral-50'/>
                    </button>    

                </div>
                {/*Date and button section*/}
                <div className="flex-1 h-14 flex items-center gap-5">
                    {/*Date */}
                    <div className="flex-1 h-full border border-neutral-300 bg-white/70 text-base text-neutral-700 font-medium px-5 flex items-center gap-x-1 rounded-lg">
                        <input 
                          type="date" 
                          name="departureDate"
                          value={searchData.departureDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="flex-1 h-full border-none bg-transparent focus:outline-none" 
                        />
                    </div>

                    {/*Search button */}
                     <button 
                       type="submit"
                       disabled={isLoading}
                       className="w-fit px-5 h-full bg-primary hover:bg-transparent border-2 border-primary hover:border-primary rounded-xl text-base font-medium text-neutral-50 flex items-center justify-center gap-x-2 hover:text-primary ease-in-out duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        <FaSearch />
                        {isLoading ? 'Searching...' : 'Search'}
                     </button>

                </div>

            </form>
     </motion.div>
  )
}

export default Search