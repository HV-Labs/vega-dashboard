import { useState, useEffect } from "react";
import axios from "axios";

const useListMarket = () => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://vega-mainnet-data.commodum.io/api/v2/markets"
        );
        setMarkets(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchMarkets();
  }, []);

  return { markets, loading, error };
};

export default useListMarket;
