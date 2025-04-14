"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  fetchProfile,
} from "@/shared/api";
import { Profile } from "@/shared/types/profile";
import { isMobileDevice } from "@/shared/utils";
import { useLogout, usePrivy } from "@privy-io/react-auth";

interface GlobalContextType {
  isMobile: boolean;
  profile: Profile | null;
  refreshProfile: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const { ready, authenticated, user, getAccessToken } = usePrivy();
  const { logout } = useLogout()
  const [profile, setProfile] = useState<Profile | null>(null);

  const isMobile = isMobileDevice();

  const refreshProfile = async () => {
    const res = await fetchProfile();
    if (res.code === 0) {
      setProfile(res.data);
    } else {
      if (authenticated) {
        logout();
      }
    }
  };

  useEffect(() => {
    if (!authenticated) {
      setProfile(null);
      return;
    }
    refreshProfile();
  }, [authenticated]);

  return (
    <GlobalContext.Provider
      value={{
        isMobile,
        profile,
        refreshProfile,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalCtx = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalCtx must be used within a GlobalContext");
  }
  return context;
};
