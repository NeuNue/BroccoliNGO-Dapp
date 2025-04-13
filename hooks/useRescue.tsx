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
  OriginRescueTask,
  RequestForm,
  RescueNFTMetaData,
  RescueRequest,
  RescueTask,
  RescueTaskV1,
} from "@/shared/types/rescue";
import {
  formatNFTMetadataToTaskRequest,
  formatToRescueNFTMetadata,
  nftMetaDataToHelpRequest,
  nftMetaDataToHelpRequest2,
  NFTMetaDataToRescueRequestForms,
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
import { NFTMetaData2 } from "@/shared/types/help";

interface RescueRequestContextType {
  isMobile: boolean;
  isPreviewMode: boolean;
  profile: Profile | null;
  xAuthLink: string;
  currentTask: {
    version: string;
    task: RescueTask | RescueTaskV1;
  } | null;
  completedTasks: {
    version: string;
    task: RescueTask | RescueTaskV1;
  }[];
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
  const [currentTask, setCurrentTask] = useState<{
    version: string;
    task: RescueTask | RescueTaskV1;
  } | null>(null);
  const [completedTasks, setCompletedTasks] = useState<
    {
      version: string;
      task: RescueTask | RescueTaskV1;
    }[]
  >([]);
  const [xAuthLink, setXAuthLink] = useState("");

  const isPreviewMode = !!currentTask;

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

  async function loadTaskMetaData(tokenUri: string) {
    if (!tokenUri) return null;
    const parsed = await formatNFTMetadataToTaskRequest({
      tokenUri,
    });
    if (!parsed) return null;
    return parsed;
  }

  const refreshProfile = async () => {
    const res = await fetchProfile();
    if (res.code === 0) {
      setProfile(res.data);
      if (res.data.task) {
        const formated = await loadTaskMetaData(res.data.task.URI);
        if (!formated) return;
        const { v, NFTMetaData, formatedData } = formated;
        setCurrentTask({
          version: v,
          task: {
            ...res.data.task,
            metadata: NFTMetaData,
            _parsedMetadata: formatedData,
          },
        });
      }

      const _completedTasks = await Promise.all(
        res.data.completedTasks.map((task: OriginRescueTask) => {
          return loadTaskMetaData(task.URI).then((formated) => {
            if (!formated) return null;
            const { v, NFTMetaData, formatedData } = formated;
            return {
              version: v,
              task: {
                ...task,
                metadata: NFTMetaData,
                _parsedMetadata: formatedData,
              },
            };
          });
        })
      );

      setCompletedTasks(_completedTasks);
      return;
    }
    const oauthRes = await fetchXGenerateLink("/?mode=rescue");
    if (oauthRes.code === 0) {
      setXAuthLink(oauthRes.data.url);
    }
  };

  useEffect(() => {
    if (currentTask) {
      const { task, version } = currentTask;
      const { metadata, _parsedMetadata } = task;
      if (version === "1.0") {
        const { contactForm, backgroundForm, requestForm } =
          NFTMetaDataToRescueRequestForms(metadata as RescueNFTMetaData);
        setContactForm(contactForm);
        setBackgroundForm(backgroundForm);
        setRequestForm(requestForm);
      } else {
        // const { contactForm, backgroundForm, requestForm } =
        //   nftMetaDataToHelpRequest2(metadata as NFTMetaData2);
        // setContactForm(contactForm);
        // setBackgroundForm(backgroundForm);
        // setRequestForm(requestForm);
      }
    }
  }, [currentTask]);

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <RescueRequestContext.Provider
      value={{
        isMobile,
        isPreviewMode,
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
