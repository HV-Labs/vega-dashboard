"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const useListWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]); // Change variable name to 'withdrawals'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      // Change function name to 'fetchWithdrawals'
      setLoading(true);
      try {
        const response = await axios.get(
          "https://vega-mainnet-data.commodum.io/api/v2/withdrawals"
        );
        setWithdrawals(response.data); // Update state with the fetched withdrawals
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchWithdrawals();
  }, []);

  return { withdrawals, loading, error }; // Return 'withdrawals' instead of 'deposits'
};

export default useListWithdrawals;
