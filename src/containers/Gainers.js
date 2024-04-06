
import '../style/StockData.css'; // Import CSS file for styling
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockData = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filters, setFilters] = useState({
        date: '',
        open: '',
        high: '',
        low: '',
        close: '',
        volume: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://financialmodelingprep.com/api/v3/technical_indicator/1min/AAPL?type=sma&period=10&apikey=311f90063290e392d9dda6d1de9969de');
                setData(response.data);
                setFilteredData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    useEffect(() => {
        const filterData = () => {
            let filtered = [...data];
            Object.keys(filters).forEach((key) => {
                if (filters[key]) {
                    filtered = filtered.filter((item) => item[key].toString().toLowerCase().includes(filters[key].toLowerCase()));
                }
            });
            setFilteredData(filtered);
        };
        filterData();
    }, [filters, data]);

    return (
        <div className="stock-data-container">
            <h2>Stock Data</h2>
            <div className="filters">
                <input type="text" name="date" placeholder="Filter Date" value={filters.date} onChange={handleFilterChange} />
                <input type="text" name="open" placeholder="Filter Open" value={filters.open} onChange={handleFilterChange} />
                <input type="text" name="high" placeholder="Filter High" value={filters.high} onChange={handleFilterChange} />
                <input type="text" name="low" placeholder="Filter Low" value={filters.low} onChange={handleFilterChange} />
                <input type="text" name="close" placeholder="Filter Close" value={filters.close} onChange={handleFilterChange} />
                <input type="text" name="volume" placeholder="Filter Volume" value={filters.volume} onChange={handleFilterChange} />
            </div>
            <table className="stock-data">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Open</th>
                    <th>High</th>
                    <th>Low</th>
                    <th>Close</th>
                    <th>Volume</th>
                    <th>SMA</th>
                </tr>
                </thead>
                <tbody>
                {filteredData.map((item, index) => (
                    <tr key={index}>
                        <td>{item.date}</td>
                        <td>{item.open}</td>
                        <td>{item.high}</td>
                        <td>{item.low}</td>
                        <td>{item.close}</td>
                        <td>{item.volume}</td>
                        <td>{item.sma}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockData;
