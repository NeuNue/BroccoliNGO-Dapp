"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BackgroundForm,
  ContactForm,
  HelpRequest,
  NFTMetaData,
  RequestForm,
  RescueRequest,
  RescueTask,
} from "@/shared/types/rescue";
import {
  formatToRescueNFTMetadata,
  nftMetaDataToHelpRequest,
} from "@/shared/task";
import {
  createTask,
  createTaskV1,
  fetchProfile,
  fetchXGenerateLink,
  uploadJson,
} from "@/shared/api";
import { toaster } from "@/components/ui/toaster";
import { Profile } from "@/shared/types/profile";
import { isMobileDevice } from "@/shared/utils";

interface RescueRequestContextType {
  profile: Profile | null;
  xAuthLink: string;
  currentTask: RescueTask | null;
  completedTasks: RescueTask[];
  refreshProfile: () => Promise<void>;
  contactForm: ContactForm;
  setContactForm: Dispatch<SetStateAction<ContactForm>>;
  backgroundForm: BackgroundForm;
  setBackgroundForm: Dispatch<SetStateAction<BackgroundForm>>;
  requestForm: RequestForm;
  setRequestForm: Dispatch<SetStateAction<RequestForm>>;
  isSubmitting: boolean;
  handleRescueSubmit: () => Promise<boolean>;
}

const RescueRequestContext = createContext<
  RescueRequestContextType | undefined
>(undefined);

export const RescueRequestProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [contactForm, setContactForm] = useState<ContactForm>({
    organization: "",
    email: "",
    country: "",
    city: "",
    twitter: "",
    address: "",
  });

  const [backgroundForm, setBackgroundForm] = useState<BackgroundForm>({
    context: "",
    attachment: "",
  });

  const [requestForm, setRequestForm] = useState<RequestForm>({
    suppliesRequest: "",
    additionalInfo: "",
    canProvideInvoices: true,
    canProvidePublicAcknowledgments: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentTask, setCurrentTask] = useState<RescueTask | null>(null);
  const [completedTasks, setCompletedTasks] = useState<RescueTask[]>([]);
  const [xAuthLink, setXAuthLink] = useState("");

  const isMobile = isMobileDevice();

  const handleRescueSubmit = async () => {
    setIsSubmitting(true);
    const request: RescueRequest = {
      v: "1.0",
      contact: contactForm,
      background: backgroundForm,
      request: requestForm,
    };

    try {
      const NFTMetaData = formatToRescueNFTMetadata(request);

      const ipfsRes = await uploadJson(NFTMetaData);

      console.log("request", request, "NFTMetaData", NFTMetaData);

      const ipfsLink = ipfsRes?.data?.url;

      if (!ipfsLink) {
        toaster.create({
          title: "Failed to submit request",
          description: "Please try again later.",
          type: "error",
        });
        return false;
      }

      const createRes = await createTaskV1(ipfsLink);

      if (createRes.code !== 0) {
        toaster.create({
          title: "Failed to submit request",
          description: createRes?.message || "Please try again later.",
          type: "error",
        });
        return false;
      }
      // toaster.create({
      //   title: "Success to submit request.",
      //   description: "Waiting for the callback.",
      //   type: "success",
      // });
      // router.push(`/task/${createRes.data.nftId}`);
      return true;
    } catch (e) {
    } finally {
      setIsSubmitting(false);
    }
    return false;
  };

  const refreshProfile = async () => {
    const res = await fetchProfile();
    if (res.code === 0) {
      setProfile(res.data);
      if (res.data.task) {
        setCurrentTask({
          ...res.data.task,
          metadata: nftMetaDataToHelpRequest(res.data.task.metadata),
        });
      }

      setCompletedTasks(
        res.data.completedTasks.map((task: any) => ({
          ...task,
          metadata: nftMetaDataToHelpRequest(task.metadata),
        }))
      );
      return;
    }
    const oauthRes = await fetchXGenerateLink("/?mode=rescue");
    if (oauthRes.code === 0) {
      setXAuthLink(oauthRes.data.url);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <RescueRequestContext.Provider
      value={{
        profile,
        xAuthLink,
        currentTask,
        completedTasks,
        refreshProfile,
        contactForm,
        setContactForm,
        backgroundForm,
        setBackgroundForm,
        requestForm,
        setRequestForm,
        isSubmitting,
        handleRescueSubmit,
      }}
    >
      {children}
    </RescueRequestContext.Provider>
  );
};

export const useRescueRequestCtx = () => {
  const context = useContext(RescueRequestContext);
  if (context === undefined) {
    throw new Error(
      "useRescueRequestCtx must be used within a RescueRequestContext"
    );
  }
  return context;
};
