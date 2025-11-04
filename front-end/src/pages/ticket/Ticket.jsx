import React, { useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import TopLayout from '../../layout/toppage/TopLayout'
import RootLayout from '../../layout/RootLayout'
import { motion } from 'framer-motion'
import Search from '../home/hero/search/Search'
// import Filter from './filter/Filter'
import SearchResult from './filter/searchresult/SearchResult'
import { useTrip } from '../../contexts/TripContext'

const Ticket = () => {
  const location = useLocation();
  const { searchTrips, searchParams, updateSearchParams, getRouteFilters } = useTrip();

  // Check if we have search results from navigation state
  useEffect(() => {
    const paramsToSearch = location.state?.searchParams || searchParams;

    if (paramsToSearch.fromCity && paramsToSearch.toCity) {

      if (location.state?.searchParams) {
        updateSearchParams(location.state.searchParams);
      }
      searchTrips(paramsToSearch);
      getRouteFilters(paramsToSearch.fromCity, paramsToSearch.toCity);
    }
  }, []); 
 

  const handleFilterChange = useCallback((newFilters) => {
    const updatedParams = {
      ...searchParams,
      minPrice: newFilters.price.min,
      maxPrice: newFilters.price.max,
      busTypes: newFilters.busTypes.join(','),   
      companies: newFilters.companies.join(','), 
      amenities: newFilters.amenities.join(','), 
    };


    if (updatedParams.fromCity && updatedParams.toCity) {
      searchTrips(updatedParams);
    }
  }, [searchParams, searchTrips]);

  return (
    <div className='w-full space-y-12 pb-16'>
        {/*Top Layout */}
        <TopLayout
        bgImg={"/assets/busseats.jpg"}
        title={"Reserve your ticket"}
        />

        <RootLayout className="space-y-12 relative">

          {/*fixing search section to stick */}
          <div className="space-y-5 w-full bg-neutral-50 flex py-4 items-center justify-center flex-col sticky top-0 z-30">
              <motion.h1
                     initial={{opacity: 0, y:-800}}
                     animate={{opacity: 1, y:0}}
                     exit={{opacity: 0, y:-800}}
                     transition={{duration:1.35,ease:"easeOut"}}
                     className="text-3xl text-neutral-700 font-bold "
                 >
                     Want to change the Route?
                </motion.h1>

                  {/*search */}
                  <Search/>
          </div>

          <div className="w-full rounded-none p-5 border-2 border-neutral-300 space-y-5 hover:border-primary transition-colors duration-300">
          {/*Filter Section */}
          {/* <div className="col-span-1">
            
            //<Filter className="space-y-4 sticky top-52 z-20" onFilterChange={handleFilterChange} />
          </div> */}

          {/*Search Tickets */}
          <div className="col-span-3">
            <SearchResult />
          </div>
        </div>
      </RootLayout>
    </div>
  );
};

export default Ticket;