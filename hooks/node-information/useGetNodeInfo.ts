import { useState, useEffect } from "react";
import axios from "axios";

const useGetNodeInfo = () => {
  const [infoData, setInfoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInfoData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://vega-mainnet-data.commodum.io/api/v2/info"
        );
        setInfoData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchInfoData();
  }, []);

  return { infoData, loading, error };
};

export default useGetNodeInfo;
