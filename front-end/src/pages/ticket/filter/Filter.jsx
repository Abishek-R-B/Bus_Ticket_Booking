import React, { useEffect, useState, useRef } from 'react';
import PriceRangeSlider from '../../../components/topsearch/pricerange/PriceRangeSlider';
import { useTrip } from '../../../contexts/TripContext';

const Filter = ({className, onFilterChange}) => {

    const { filterOptions, isLoading } = useTrip();

     const [filters, setFilters] = useState({
        price: { min: 0, max: 0 },
        busTypes: [],
        companies: [],
        amenities: [],
    });

    const isInitialized = useRef(false);

    useEffect(() => {
        const minPrice = filterOptions.priceRange.minPrice || 0;
        const maxPrice = filterOptions.priceRange.maxPrice || 5000;
         if (maxPrice > 0 && !isInitialized.current) {
            setFilters({
                price: { min: minPrice, max: maxPrice },
                busTypes: [],
                companies: [],
                amenities: [],
            });
            isInitialized.current = true;
        }
    }, [filterOptions]);

    useEffect(() => {
         if (!isInitialized.current) {
            return;
        }
        const handler = setTimeout(() => {
            onFilterChange(filters);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [filters, onFilterChange]);


    // EVENT HANDLERS 
    const handlePriceChange = (values) => {
        setFilters(prev => ({ ...prev, price: { min: values[0], max: values[1] } }));
    };

    const handleCheckboxChange = (group, value) => {
        setFilters(prev => {
            const list = prev[group];
            const newList = list.includes(value)
                ? list.filter(v => v !== value) // Uncheck: remove from list
                : [...list, value];              // Check: add to list
            return { ...prev, [group]: newList };
        });
    };

        return (
        <div className={`w-full ${className} space-y-4`}>
            <h1 className="text-xl text-neutral-700 font-semibold">
                Apply Filters
            </h1>

            {/* Price Filter - Now dynamic */}
            <div className="w-full border border-neutral-300 rounded-xl p-4 space-y-1">
                <h1 className="text-lg text-neutral-600 font-medium">Price Range</h1>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <PriceRangeSlider
                        min={filterOptions.priceRange.minPrice || 0}
                        max={filterOptions.priceRange.maxPrice || 5000}
                        values={[filters.price.min, filters.price.max]}
                        onChange={handlePriceChange}
                    />
                )}
            </div>

            {/* Bus Types filter - Now dynamic */}
            <div className="w-full border border-neutral-300 rounded-xl p-4 space-y-3">
                <h1 className="text-lg text-neutral-600 font-medium">Bus Types</h1>
                <div className="space-y-2.5">
                     {filterOptions.busTypes.length > 0 ? (
                        filterOptions.busTypes.map((type) => (
                        <div key={type} className="w-full flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`type-${type}`}
                                checked={filters.busTypes.includes(type)}
                                onChange={() => handleCheckboxChange('busTypes', type)}
                                className="h-3.5 w-3.5 cursor-pointer"
                            />
                            <label htmlFor={`type-${type}`} className="text-sm text-neutral-600 font-normal cursor-pointer">
                                {type}
                            </label>
                        </div>
                    ))
                ):(
                    <p className="text-sm text-neutral-500">No types available for this route.</p>
                )}
                </div>
            </div>

            {/* Bus Companies - Now dynamic */}
            <div className="w-full border border-neutral-300 rounded-xl p-4 space-y-3">
                <h1 className="text-lg text-neutral-600 font-medium">Bus Companies</h1>
                <div className="space-y-2.5">
                    {filterOptions.companies.length > 0 ? (
                        filterOptions.companies.map((company) => (
                        <div key={company} className="w-full flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`company-${company}`}
                                checked={filters.companies.includes(company)}
                                onChange={() => handleCheckboxChange('companies', company)}
                                className="h-3.5 w-3.5 cursor-pointer"
                            />
                            <label htmlFor={`company-${company}`} className="text-sm text-neutral-600 font-normal cursor-pointer">
                                {company}
                            </label>
                        </div>
                    ))
                ):(
                    <p className="text-sm text-neutral-500">No companies available for this route.</p>
                )}
                </div>
            </div>
            
            {/* Amenities - Now dynamic */}
            <div className="w-full border border-neutral-300 rounded-xl p-4 space-y-3">
                <h1 className="text-lg text-neutral-600 font-medium">Amenities</h1>
                <div className="space-y-2.5">
                     {filterOptions.amenities.length > 0 ? (
                        filterOptions.amenities.map((amenity) => (
                        <div key={amenity} className="w-full flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`amenity-${amenity}`}
                                checked={filters.amenities.includes(amenity)}
                                onChange={() => handleCheckboxChange('amenities', amenity)}
                                className="h-3.5 w-3.5 cursor-pointer"
                            />
                            <label htmlFor={`amenity-${amenity}`} className="text-sm text-neutral-600 font-normal cursor-pointer">
                                {amenity}
                            </label>
                        </div>
                    ))
                ):(
                    <p className="text-sm text-neutral-500">No amenities available for this route.</p>
                )}
                </div>
            </div>
        </div>
    );
};

export default Filter;