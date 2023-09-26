"use client";

import useListAccounts from "@/hooks/accounts/useListAccounts";

export default function Home() {

  const {accounts} = useListAccounts();
  const data = JSON.stringify(accounts);
  return (
    <>
      <div>{data}</div>
    </>
  );
}
