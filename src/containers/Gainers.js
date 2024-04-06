import React, {useEffect, useState} from 'react';
import '../style/StockData.css';

const response = {
    mcrst: {
        company: 'Mcrst',
        address1: 'One Microsoft Way',
        city: 'Redmond',
        state: 'WA',
        zip: '98052-6399',
        country: 'United States',
        phone: '425 882 8080',
        website: 'https://www.microsoft.com',
        industry: 'Software - Infrastructure',
        industryKey: 'software-infrastructure',
        industryDisp: 'Software - Infrastructure',
        sector: 'Technology',
        sectorKey: 'technology',
        sectorDisp: 'Technology',
    },
    sail: {
        company: 'Sail',
        address1: 'One Microsoft Way',
        city: 'Redmond',
        state: 'WA',
        zip: '98052-6399',
        country: 'United States',
        phone: '425 882 8080',
        website: 'https://www.microsoft.com',
        industry: 'Software - Infrastructure',
        industryKey: 'software-infrastructure',
        industryDisp: 'Software - Infrastructure',
        sector: 'Technology',
        sectorKey: 'technology',
        sectorDisp: 'Technology',
    },
};

const filterOptions = {
    address1: ['All', 'Option 1', 'Option 2', 'Option 3'],
    city: ['All', 'Option A', 'Option B', 'Option C'],
    state: ['All', 'Option X', 'Option Y', 'Option Z'],
    zip: ['All', 'Option 111', 'Option 222', 'Option 333'],
    country: ['All', 'Option USA', 'Option UK', 'Option Canada'],
    phone: ['All', 'Option 123', 'Option 456', 'Option 789'],
    website: ['All', 'Option https://1', 'Option https://2', 'Option https://3'],
    industry: ['All', 'Option Software', 'Option Hardware', 'Option Services'],
    sector: ['All', 'Option Tech', 'Option Finance', 'Option Healthcare'],
};

const StockData = () => {

    const [filters, setFilters] = useState({
        company: '',
        address1: 'All',
        city: 'All',
        state: 'All',
        zip: 'All',
        country: 'All',
        phone: 'All',
        website: 'All',
        industry: 'All',
        sector: 'All',
    });

    const fetchResult = async () => {
        try {
            const response = await fetch('http://localhost:5000/filter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filters),
            });
            const filteredData = await response.json();
            setData(filteredData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchResult();
    }, [filters]);

    const handleFilterChange = (filterType, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: value,
        }));
    };

    const fetchData = async (filters) => {
        // Here, you would replace this with your actual fetch call
        // You would typically pass your filters as query parameters in the URL or in the request body
        // For demonstration purposes, we're just using the response object and filtering it here
        const filteredData = Object.entries(response).filter(([key, value]) => {
            return Object.entries(filters).every(([filterKey, filterValue]) => {
                if (filterKey === 'company') {
                    return (
                        filterValue === '' ||
                        value[filterKey].toLowerCase().includes(filterValue.toLowerCase())
                    );
                } else {
                    return (
                        filterValue === 'All' ||
                        (value[filterKey] &&
                            value[filterKey].toLowerCase().includes(filterValue.toLowerCase()))
                    );
                }
            });
        });
        setData(filteredData);
    };

    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData(filters);
    }, [filters]);

    const filteredResponse = Object.entries(response).filter(([key, value]) => {
        return Object.entries(filters).every(([filterKey, filterValue]) => {
            if (filterKey === 'company') {
                return (
                    filterValue === '' ||
                    value[filterKey].toLowerCase().includes(filterValue.toLowerCase())
                );
            } else {
                return (
                    filterValue === 'All' ||
                    (value[filterKey] &&
                        value[filterKey].toLowerCase().includes(filterValue.toLowerCase()))
                );
            }
        });
    });

    const handleSearchChange = (e) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            company: e.target.value,
        }));
    };

    return (
        <div className="stock-data-container">
            <div className="filter-section">
                <div className="search-container">
                    <input
                        type="text"
                        id="company-search"
                        value={filters.company}
                        onChange={handleSearchChange}
                        placeholder="Search Company"
                    />
                </div>
                <div className="filter-container">
                    {Object.keys(filterOptions).map((filterType, index) => (
                        <div className={'filter'} key={index}>
                            <select
                                value={filters[filterType]}
                                onChange={(e) => handleFilterChange(filterType, e.target.value)}
                            >
                                <option value="All">{filterType}</option>
                                {filterOptions[filterType].map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </div>
            <div className="table-container">
                <table className="stock-table">
                    <thead>
                    <tr>
                        <th>Company</th>
                        {Object.keys(filterOptions).map((filterType, index) => (
                            <th key={index}>{filterType}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {filteredResponse.map(([key, value]) => (
                        <tr className='data-row' key={key}>
                            <td>{value.company}</td>
                            {Object.keys(filterOptions).map((filterType, index) => (
                                <td key={index}>{value[filterType]}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockData;
