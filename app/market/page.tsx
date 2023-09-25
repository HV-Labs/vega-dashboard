"use client";

import useListMarket from "@/hooks/market/useListMarket";
export default function Market() {
  const { markets, loading, error } = useListMarket();

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div>ok</div>
      {/* {JSON.stringify(markets)} */}
      {markets?.markets?.edges.map((item: any, i) => (
        <li key={i}>{JSON.stringify(item)}</li>
      ))}
    </>
  );
}
