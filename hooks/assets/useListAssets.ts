"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const useListAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://vega-mainnet-data.commodum.io/api/v2/assets"
        );
        setAssets(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  return { assets, loading, error };
};

export default useListAssets;
