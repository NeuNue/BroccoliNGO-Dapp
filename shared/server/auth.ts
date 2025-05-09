import { cookies } from "next/headers";
import { PRIVY_TOKEN_NAME } from "../constant";
import { verifyPrivyAccessToken } from "./privy";
import { supabaseClient } from "../supabase";

export const userAuth = async (strict = true) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(PRIVY_TOKEN_NAME)?.value;
  const privyUserId = await verifyPrivyAccessToken(token!);

  if (!privyUserId) {
    if (!strict) {
      return {
        user: null,
        privyUserId: null,
      };
    }
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

  console.log('--- user', user)

  return {
    user,
    privyUserId,
  };
};
