import { useState, useEffect } from "react";

import axios from "axios";

// Dummy markets data
const dummyMarkets = {
  markets: {
    edges: [
      {
        node: {
          id: "9f6160f248afc373b9458ad03b0e6faf5e5b4cde8e4b7e093b571bb4a2d5b08b2",
          tradableInstrument: {
            instrument: {
              code: "BTC/USD"
            }
          }
        }
      },
      {
        node: {
          id: "f3f6c9c98e7f4e1a4d4b7c3e8b9f6a5c4e3d2b1a7e9f8c6d5a4e3b2f1a9e8d7c",
          tradableInstrument: {
            instrument: {
              code: "ETH/USD"
            }
          }
        }
      },
      {
        node: {
          id: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d",
          tradableInstrument: {
            instrument: {
              code: "ADA/USD"
            }
          }
        }
      },
      {
        node: {
          id: "z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v",
          tradableInstrument: {
            instrument: {
              code: "SOL/USD"
            }
          }
        }
      },
      {
        node: {
          id: "1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d",
          tradableInstrument: {
            instrument: {
              code: "DOT/USD"
            }
          }
        }
      }
    ]
  }
};

const useListMarket = () => {
  const [markets, setMarkets] = useState(dummyMarkets); // Start with dummy data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://vega-mainnet-data.commodum.io/api/v2/markets?includeSettled=false"
        );
        if (response.data && response.data.markets && response.data.markets.edges && response.data.markets.edges.length > 0) {
          setMarkets(response.data);
        } // else keep dummy data
        setLoading(false);
      } catch (error) {
        // Keep dummy data on error
        setLoading(false);
      }
    };
    fetchMarkets();
  }, []);

  return { markets, loading, error };
};

export default useListMarket;
