import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { authConfig } from "../config/server-config";

import HomePage from "./HomePage";

export default async function Home() {
  const tokens = await getTokens(cookies(), authConfig);

  if (!tokens) {
    notFound();
  }

  return <HomePage email={tokens?.decodedToken.email} />;
}
