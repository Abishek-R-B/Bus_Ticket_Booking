import React from 'react'
import RootLayout from '../../../layout/RootLayout'
import TopSearchCard from '../../../components/topsearch/TopSearchCard'

const TopSearch = () => {
  return (
    <RootLayout className="space-y-12"> 
          {/*Tag */}
           <div className="w-full flex items-center justify-center text-center">
                <h1 className="text-3xl ☐ text-neutral-800 font-bold">
                 Top Search<span className="text-primary">Routes</span>
                </h1>
            </div>
            {/*Top search tickets routes card */}
            <div className="w-full grid grid-col-3 gap-5">
                <TopSearchCard routeFrom={"Chennai"} routeTo={"Bangalore"} timeDuration={"6 Hrs"} price={"1500"}/>
                <TopSearchCard routeFrom={"Chennai"} routeTo={"Bangalore"} timeDuration={"6 Hrs"} price={"1500"}/>
                <TopSearchCard routeFrom={"Chennai"} routeTo={"Bangalore"} timeDuration={"6 Hrs"} price={"1500"}/>
                <TopSearchCard routeFrom={"Chennai"} routeTo={"Bangalore"} timeDuration={"6 Hrs"} price={"1500"}/>
                <TopSearchCard routeFrom={"Chennai"} routeTo={"Bangalore"} timeDuration={"6 Hrs"} price={"1500"}/>
                <TopSearchCard routeFrom={"Chennai"} routeTo={"Bangalore"} timeDuration={"6 Hrs"} price={"1500"}/>
            </div>

    </RootLayout>
  )
}

export default TopSearch