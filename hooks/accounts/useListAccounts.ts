"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const useListAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://vega-mainnet-data.commodum.io/api/v2/accounts"
        );
        setAccounts(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  return { accounts, loading, error };
};

export default useListAccounts;
