import { cookies } from "next/headers";
import { PRIVY_TOKEN_NAME } from "../constant";
import { verifyPrivyAccessToken } from "./privy";
import { supabaseClient } from "../supabase";

export const userAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(PRIVY_TOKEN_NAME)?.value;
  const privyUserId = await verifyPrivyAccessToken(token!);
  console.log("userId", privyUserId, "token", token);

  if (!privyUserId) {
    throw new Error("Unaothorized", {
      cause: { code: 401 },
    });
  }

  let user = (
    await supabaseClient
      .from("PrivyUser")
      .select("*")
      .eq("userId", privyUserId)
      .single()
  ).data;

  return {
    user,
    privyUserId,
  };
};
