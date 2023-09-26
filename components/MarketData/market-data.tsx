import React, { useState, useEffect } from 'react';

interface MarketData {
  // Define the structure of your market data here
  marketName: string;
  lastPrice: number;
  // Add more fields as needed
}

interface MarketDataTableProps {
  marketData: MarketData[];
}

const MarketDataTable: React.FC<MarketDataTableProps> = ({ marketData }) => {
  return (
    <div>
      <h2>Market Data</h2>
      <table>
        <thead>
          <tr>
            <th>Market Name</th>
            <th>Last Price</th>
            {/* Add more table headers for additional data fields */}
          </tr>
        </thead>
        <tbody>
          {marketData.map((data, index) => (
            <tr key={index}>
              <td>{data.marketName}</td>
              <td>{data.lastPrice}</td>
              {/* Add more table cells for additional data fields */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarketDataTable;
