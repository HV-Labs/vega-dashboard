import { useState, useEffect } from "react";
import axios from "axios";

const useGetAssets = (
  assetId = "d1984e3d365faa05bcafbe41f50f90e3663ee7c0da22bb1e24b164e9532691b2"
) => {
  const [assetInfo, setAssetInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssetInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://vega-mainnet-data.commodum.io/api/v2/asset/${assetId}`
        );
        setAssetInfo(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchAssetInfo();
  }, [assetId]); // Include assetId as a dependency to re-fetch when it changes

  return { assetInfo, loading, error };
};

export default useGetAssets;
