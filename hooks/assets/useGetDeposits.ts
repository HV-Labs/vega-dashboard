import { useState, useEffect } from "react";
import axios from "axios";

const useGetDeposits = (
  depositId = "ef0be7b5c27c8ab55d9ee49b9012643a9ea11195962d0373cabe902ccfcb53c4"
) => {
  const [depositInfo, setDepositInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepositInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://vega-mainnet-data.commodum.io/api/v2/deposit/${depositId}`
        );
        setDepositInfo(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchDepositInfo();
  }, [depositId]); // Include depositId as a dependency to re-fetch when it changes

  return { depositInfo, loading, error };
};

export default useGetDeposits;
