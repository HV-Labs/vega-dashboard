"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const useListDeposits = () => {
  const [deposits, setDeposits] = useState([]); // Change variable name to 'deposits'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeposits = async () => {
      // Change function name to 'fetchDeposits'
      setLoading(true);
      try {
        const response = await axios.get(
          "https://vega-mainnet-data.commodum.io/api/v2/deposits"
        );
        setDeposits(response.data); // Update state with the fetched deposits
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchDeposits();
  }, []);

  return { deposits, loading, error }; // Return 'deposits' instead of 'assets'
};

export default useListDeposits;
