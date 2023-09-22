import { useState, useEffect } from "react";
import axios from "axios";

const useGetWithdrawals = (
  withdrawalId = "285cc8e893fade168d0d5f445d2fe0c3c944eefa39b8f6b0a2e9bf5fcdfccae0"
) => {
  const [withdrawalData, setWithdrawalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWithdrawalData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://vega-mainnet-data.commodum.io/api/v2/withdrawal/${withdrawalId}`
        );
        setWithdrawalData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchWithdrawalData();
  }, [withdrawalId]); // Include withdrawalId as a dependency to re-fetch when it changes

  return { withdrawalData, loading, error };
};

export default useGetWithdrawals;
