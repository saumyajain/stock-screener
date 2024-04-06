import React, { useEffect, useState } from 'react';
import '../style/StockData.css';

const generateMockData = () => {
    const companyNames = [
        'Microsoft', 'Apple', 'Amazon', 'Alphabet', 'Facebook', 'Tesla', 'Nvidia', 'Adobe', 'Netflix', 'PayPal',
        'Salesforce', 'Cisco', 'Intel', 'Oracle', 'IBM', 'Qualcomm', 'AMD', 'Zoom', 'Twitter', 'Snapchat',
        'Walmart', 'Target', 'Home Depot', 'Costco', 'McDonald\'s', 'Starbucks', 'Coca-Cola', 'PepsiCo', 'Nike', 'Disney',
    ];

    const sectors = [
        'Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer Goods', 'Services',
        // Add more sectors as needed
    ];

    const companies = {};

    for (let i = 0; i < 100; i++) {
        const companyName = companyNames[Math.floor(Math.random() * companyNames.length)];
        companies[`company${i + 1}`] = {
            name: companyName,
            sector: sectors[Math.floor(Math.random() * sectors.length)],
            volume: getRandomVolume(),
            market_cap: getRandomMarketCap(),
            fifty_two_week_low: getRandomNumber(50, 500),
            fifty_two_week_high: getRandomNumber(500, 1000),
            dividend_yeild: getRandomNumber(0.5, 5) + '%',
            EPS: `https://www.${companyName.toLowerCase().replace(/\s+/g, '-')}.com`,
            P_B_ratio: getRandomNumber(1, 10).toFixed(1),
            P_E_ratio: getRandomNumber(10, 50),
        };
    }

    return companies;
};

const getRandomVolume = () => {
    const volumes = ['Low', 'Medium', 'High'];
    return volumes[Math.floor(Math.random() * volumes.length)];
};

const getRandomMarketCap = () => {
    const marketCaps = ['Small', 'Medium', 'Large', 'Huge'];
    return marketCaps[Math.floor(Math.random() * marketCaps.length)];
};

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const mockResponse = generateMockData();

const filterOptions = {
    name: ['All', 'Microsoft', 'Salesforce', 'Apple'],
    sector: ['All', 'Technology', 'Finance', 'Healthcare'],
    volume: ['All', 'High', 'Medium', 'Low'],
    market_cap: ['All', 'Huge', 'Large', 'Medium'],
    fifty_two_week_low: ['All', '100', '150', '200', '300'],
    fifty_two_week_high: ['All', '200', '300', '400', '600'],
    dividend_yeild: ['All', '1%', '1.5%', '2%'],
    EPS: ['All', 'https://www.microsoft.com', 'https://www.salesforce.com', 'https://www.apple.com'],
    P_B_ratio: ['All', '3.5', '4.2', '5'],
    P_E_ratio: ['All', '25', '30', '35'],
};

const columnNames = {
    name: 'Company Name',
    sector: 'Sector',
    volume: 'Volume',
    market_cap: 'Market Cap',
    fifty_two_week_low: '52 Week Low',
    fifty_two_week_high: '52 Week High',
    dividend_yeild: 'Dividend Yield',
    EPS: 'EPS URL',
    P_B_ratio: 'P/B Ratio',
    P_E_ratio: 'P/E Ratio',
};

const StockData = () => {
    const [filters, setFilters] = useState({
        name: 'All',
        sector: 'All',
        volume: 'All',
        market_cap: 'All',
        fifty_two_week_low: 'All',
        fifty_two_week_high: 'All',
        dividend_yeild: 'All',
        EPS: 'All',
        P_B_ratio: 'All',
        P_E_ratio: 'All',
    });

    const [filteredResponses, setFilteredResponses] = useState([]);

    useEffect(() => {
        // Filter data based on selected filters
        const filteredData = Object.entries(mockResponse).filter(([key, value]) => {
            return Object.entries(filters).every(([filterKey, filterValue]) => {
                if (filterValue === 'All') {
                    return true; // Include all data if filter is set to 'All'
                } else if (filterKey === 'EPS') {
                    // Check if the value matches the selected URL
                    return value[filterKey] === filterValue;
                } else {
                    return value[filterKey] === filterValue;
                }
            });
        });
        setFilteredResponses(filteredData);
    }, [filters]);

    const handleFilterChange = (filterType, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: value,
        }));
    };

    return (
        <div className="stock-data-container">
            {/* Filter section */}
            <div className="filter-section">
                {/* Search input */}
                <div className="search-container">
                    <input
                        type="text"
                        id="company-search"
                        value={filters.name}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
                        placeholder="Search Company"
                    />
                </div>
                {/* Dropdown filters */}
                <div className="filter-container">
                    {Object.keys(filterOptions).map((filterType, index) => (
                        <div className="filter" key={index}>
                            <label htmlFor={filterType}>{columnNames[filterType]}</label>
                            <select
                                id={filterType}
                                value={filters[filterType]}
                                onChange={(e) => handleFilterChange(filterType, e.target.value)}
                            >
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
            {/* Table section */}
            <div className="table-container">
                <table className="stock-table">
                    <thead>
                    <tr>
                        {Object.keys(filterOptions).map((filterType, index) => (
                            <th key={index}>{columnNames[filterType]}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {filteredResponses.map(([key, value]) => (
                        <tr className="data-row" key={key}>
                            {Object.keys(filterOptions).map((filterType, index) => (
                                <td key={index}>{value[filterType]}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* Display filtered rows for P/E ratio or P/B ratio */}
            {filters.P_E_ratio !== 'All' || filters.P_B_ratio !== 'All' ? (
                <div className="filtered-data-container">
                    {filteredResponses.map(([key, value]) => (
                        <div key={key}>
                            {filters.P_E_ratio !== 'All' && (
                                <p>P/E Ratio: {value.P_E_ratio}</p>
                            )}
                            {filters.P_B_ratio !== 'All' && (
                                <p>P/B Ratio: {value.P_B_ratio}</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default StockData;