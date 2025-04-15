"use client";

import { FC, useEffect, useState } from "react";
import DrawerFullpage from "@/components/Drawer/fullpage";
import styled from "@emotion/styled";
import { Icon, Spinner, Stack } from "@chakra-ui/react";
import { Button, Card, Image, Text } from "@chakra-ui/react";
import { FiPlus, FiVideo } from "react-icons/fi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { isMobileDevice } from "@/shared/utils";
import {
  nftMetaDataToHelpRequest2,
  requestToNFTMetadata2,
} from "@/shared/task";
import {
  createHumanTask,
  createTask,
  fetchProfile,
  fetchXGenerateLink,
  uploadJson,
} from "@/shared/api";
import XIcon from "@/components/icons/x";
import { Switch } from "@chakra-ui/react";
import { HelpRequest, NFTMetaData } from "@/shared/types/rescue";
import { uploadImage, uploadVideo } from "@/shared/upload";
import { toaster } from "@/components/ui/toaster";
import TaskCardV0_2 from "@/components/Rescue/Form/TaskCard/v0.2";
import { MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from "@/shared/constant";
import { fetchProofs } from "@/shared/api";
import { useAccount, useDisconnect, useReadContract } from "wagmi";
import SBTABI from "@/shared/abi/SBT";
import { HelpRequest2, NFTMetaData2 } from "@/shared/types/help";
import { useI18n } from "../ui/I18nProvider";

interface RescueDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

const createBlobUrl = (file: File | Blob): string => {
  const blobUrl = URL.createObjectURL(file);

  return blobUrl;
};

function maskMiddle(str: string, visibleLength: number = 10): string {
  if (str.length <= 2 * visibleLength) {
    return str; // 如果字符串长度小于等于 20，则无需隐藏
  }
  return `${str.slice(0, visibleLength)}...${str.slice(-visibleLength)}`;
}

// Styled components
const FormContainer = styled.div`
  background-color: #f9f5f0;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
`;

const ConfettiPiece = styled.div`
  position: absolute;
  background-color: #f5be1d;
  border-radius: 999px;
  opacity: 0.3;
  width: ${(props) => Math.random() * 40 + 10}px;
  height: ${(props) => Math.random() * 20 + 5}px;
  transform: rotate(${(props) => Math.random() * 360}deg);
  left: ${(props) => Math.random() * 100}%;
  top: ${(props) => Math.random() * 100}%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  font-weight: bold;
  font-size: 18px;
  color: #444;
  cursor: pointer;
  z-index: 10;
  > img {
    width: 18px;
    height: 18px;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 680px;
  z-index: 10;
  @media screen and (max-width: 768px) {
    padding: 0 20px;
  }
`;

const TaskCardsBox = styled.div`
  width: 100%;
  margin-top: 50px;
  margin-bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  @media screen and (max-width: 768px) {
    margin-top: 20px;
    margin-bottom: 40px;
    gap: 16px;
  }
`;

const TaskCardContainer = styled.div`
  width: 100%;
`;

const HeaderSection = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(/rescue-bg.png);
  background-size: cover;
  background-position: bottom;
  background-repeat: no-repeat;

  &::before {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 20px;
    background-image: url(/rescue-bg-bottom.png);
    background-size: cover;
    background-position: bottom;
    background-repeat: no-repeat;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 70px;
  padding-bottom: 50px;
  margin-bottom: 24px;
  width: 100%;
  max-width: 680px;
  @media screen and (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const LogoContainer = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  @media screen and (max-width: 768px) {
    width: 140px;
    height: 140px;
  }
  > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  &::before {
    content: "";
    position: absolute;
    right: -20px;
    top: -40px;
    width: 70px;
    height: 70px;
    background-image: url(/icons/crown.svg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    pointer-events: none;
    @media screen and (max-width: 768px) {
      width: 50px;
      height: 50px;
      right: -18px;
      top: -28px;
    }
  }
`;

const Title = styled.h1`
  position: relative;
  margin: 0;
  margin-top: 10px;
  color: #fff;
  text-align: center;
  font-family: var(--font-darumadrop-one);
  font-size: 56px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  letter-spacing: -1.12px;
  text-transform: capitalize;
  > span {
    position: relative;
    z-index: 1;
  }
  @media screen and (max-width: 768px) {
    margin-top: 16px;
    font-size: 32px;
    line-height: 100%; /* 32px */
    letter-spacing: -0.64px;
  }
`;

const TitleStar = styled.img`
  width: 95px;
  height: 95px;
  position: absolute;
  left: -40px;
  bottom: -5px;
  z-index: 0;
  pointer-events: none;
  @media screen and (max-width: 768px) {
    width: 60px;
    height: 60px;
    left: -30px;
    bottom: -5px;
  }
`;

const Description = styled.div`
  margin-top: 12px;
  color: #fff;
  text-align: justify;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 21px */
  letter-spacing: 0.15px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  @media screen and (max-width: 768px) {
    font-size: 13px;
    line-height: 140%; /* 18.2px */
    letter-spacing: 0.13px;
  }

  > b {
    font-weight: 700;
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-skip-ink: auto;
    text-decoration-thickness: auto;
    text-underline-offset: auto;
    text-underline-position: from-font;
  }
`;

const FormSection = styled.form`
  margin-top: 50px;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #322f2c;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
  letter-spacing: 0.12px;
`;

const RedAsterisk = styled.span`
  color: #f44336;
`;

const Input = styled.input<{ yellowBg?: boolean; disabled?: boolean }>`
  outline: none;
  width: 100%;

  display: flex;
  height: 50px;
  padding: 16px;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  border-radius: 12px;
  border: 1px solid;

  color: #322f2c;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.28px;

  border-color: ${(props) =>
    props.disabled ? "transparent" : "rgba(251, 188, 5, 0.2)"};
  background-color: #f9edcf;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const TextArea = styled.textarea<{ disabled?: boolean }>`
  width: 100%;

  display: flex;
  height: 50px;
  padding: 16px;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  border-radius: 12px;
  border: 1px solid;
  outline: none;

  color: #322f2c;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.28px;

  background-color: #f9edcf;
  min-height: 96px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  border-color: ${(props) =>
    props.disabled ? "transparent" : "rgba(251, 188, 5, 0.2)"};
`;

const WalletProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 60px;
  padding: 16px 30px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 12px;
  border: 1px solid #fbbc05;
`;

const WalletProfileAddress = styled.div`
  color: #322f2c;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 22.4px */
  > b {
    color: #fbbc05;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
  }
`;

const WalletProfileBabt = styled.div`
  color: #322f2c;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
`;

const WalletProfileDisconnect = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 0 24px;
  width: 100%;
  color: rgba(50, 47, 44, 0.8);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 22.4px */
  letter-spacing: 0.14px;
  > b {
    color: #f15669;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 160%;
    letter-spacing: 0.14px;
    text-decoration-style: solid;
    text-decoration-skip-ink: auto;
    text-decoration-thickness: auto;
    text-underline-offset: auto;
    text-underline-position: from-font;
    cursor: pointer;
    &:hover {
      text-decoration-line: underline;
    }
  }
`;

const BABTInfo = styled.div`
  margin-top: 36px;
  display: flex;
  padding: 20px 20px 40px 20px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  align-self: stretch;
  border-radius: 12px;
  background: #f9edcf;

  color: #322f2c;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 22.4px */
  letter-spacing: 0.14px;
  // text-align: justify;
  > h2 {
    margin-bottom: 6px;
    color: #322f2c;
    text-align: center;
    font-size: 24px;
    font-style: normal;
    font-weight: 800;
    line-height: 160%; /* 38.4px */
    letter-spacing: 0.24px;
  }
`;

const BABTMintBtn = styled.div`
  margin-top: 40px;
  display: flex;
  width: 240px;
  height: 50px;
  padding: 12.333px;
  align-items: center;
  justify-content: center;
  gap: 12.333px;
  border-radius: 100px;
  background: #fbbc05;

  color: #fff;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%; /* 16px */
  letter-spacing: 0.16px;
`;

const BABTGifImg = styled.img`
  width: 280px;
  height: 280px;
`;

const XAccountInputContainer = styled.div`
  width: 100%;
  height: 50px;
`;

const ConnectWalletButton = styled.div<{ disabled?: boolean }>`
  display: flex;
  height: 60px;
  padding: 16px 30px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 12px;
  border: 1px solid #fbbc05;
  cursor: pointer;

  > b {
    color: #fbbc05;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%; /* 22.4px */
  }
  > p {
    color: #fbbc05;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }

  > a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    align-self: stretch;
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: inherit;
  }

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    border-color: #fbbc05;
  }
`;

const ConnectXButton = styled.div<{ disabled?: boolean }>`
  width: 100%;
  height: 100%;

  border-radius: 12px;
  border: 1px solid;
  cursor: pointer;
  border-color: #fbbc05;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  color: #fbbc05;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.32px;
  overflow: hidden;

  > a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    align-self: stretch;
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: inherit;
  }

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    border-color: #fbbc05;
  }
`;

const ProfileButton = styled.div<{ disabled?: boolean }>`
  width: 100%;
  height: 100%;

  border-radius: 12px;
  border: 1px solid rgba(251, 188, 5, 0.2);
  border-color: ${(props) =>
    props.disabled ? "transparent" : "rgba(251, 188, 5, 0.2)"};
  background: #f9edcf;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  position: relative;
  text-align: center;
  color: #322f2c;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.28px;
  overflow: hidden;
  // svg {
  //   width: 14px;
  //   height: 14px;
  //   color: #ccc;
  // }
  img {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    object-fit: cover;
  }
  > a {
    padding: 0 16px;
    display: flex;
    align-items: center;
    // justify-content: center;
    gap: 4px;
    align-self: stretch;
    width: 100%;
    height: 100%;
    text-decoration: none;
  }
  // &:hover {
  //   border-color: #fbbc05;
  //   svg {
  //     color: #fbbc05;
  //   }
  // }
`;

const UploadBox = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 2px dashed #ccc;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
  width: 200px;
  height: 200px;

  &:hover {
    border-color: #718096;
  }

  input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
`;

interface SubmitButtonProps {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const LoadingSpinner = styled.span`
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
`;

const SubmitButton = styled.button<SubmitButtonProps>`
  width: 100%;
  background-color: #f9c22e;
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};

  color: #f9f5f0;
  text-align: center;
  font-family: var(--font-darumadrop-one);
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 90%; /* 18px */
  letter-spacing: -0.4px;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#f9c22e" : "#e6b129")};
  }
`;

const SwitchTip = styled.span`
  margin-left: 0.4rem;
  font-size: 0.8rem;
  opacity: 0.5;
`;

// const SubmitButton = styled.button`
//   width: 100%;
//   background-color: #f9c22e;
//   color: white;
//   font-weight: bold;
//   padding: 12px;
//   border-radius: 8px;
//   border: none;
//   cursor: pointer;
//   transition: background-color 0.2s;

//   &:hover {
//     background-color: #e6b129;
//   }
// `;

interface Props {
  onSuccess: () => void;
}
const FundRequestForm: FC<Props> = ({ onSuccess }) => {
  const { getString } = useI18n();
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const [proofImagesLoading, setProofImagesLoading] = useState(false);
  const [proofImagesBlobUrls, setProofImagesBlobUrls] = useState<string[]>([]);
  const [proofImages, setProofImages] = useState<string[]>([]);
  const [uploadedProofs, setUploadedProofs] = useState<string[]>([]);
  const [parsedProofs, setParsedProofs] = useState<string[]>([]);
  const [proofLoading, setProofLoading] = useState(true);
  // const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>({
    email: "",
    location: "",
    // helpPost: "",
    // appliedFundUSD: "",
    budgetPlan: "",
    // notes: "",
    canProvideInvoice: true,
    canProvidePublicThankYouLetter: true,
  });
  const [profile, setProfile] = useState<{
    name: string;
    avatar: string;
    handle: string;
    created_at: string;
  } | null>(null);
  const [currentTask, setCurrentTask] = useState<{
    nftId: number;
    URI: string;
    approved: 0 | 1;
    metadata: HelpRequest;
    creatEventId: {
      hash: string;
    };
    passports: string[];
  } | null>(null);
  const [completedTasks, setCompletedTasks] = useState<
    {
      nftId: number;
      URI: string;
      approved: 0 | 1;
      metadata: HelpRequest;
      creatEventId: {
        hash: string;
      };
    }[]
  >([]);
  const [xAuthLink, setXAuthLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const disabledFields = [
    "notes",
    "canProvideInvoice",
    "canProvidePublicThankYouLetter",
  ];

  const isDisabled =
    isSubmitting ||
    isSubmitted ||
    Object.keys(formData)
      .filter((v) => !disabledFields.includes(v))
      .some((v) => !formData[v]);

  const isMobile = isMobileDevice();

  // const getUploadedProofs = async (tokenId: string) => {
  //   const res = await fetchProofs(tokenId);
  //   if (res.code === 0) {
  //     setUploadedProofs((prev) => [
  //       ...prev,
  //       ...(res.data.map(({ URI }: any) => URI) || ""),
  //     ]);
  //   }
  //   setProofLoading(false);
  // };

  const handleInputChange = (e: any) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      if (value === "") {
        setFormData({
          ...formData,
          [name]: "",
        });
        return;
      }

      // Price format regex: Allow numbers with up to 2 decimal places
      const priceRegex = /^\d*\.?\d{0,2}$/;

      // Remove any non-numeric characters except decimal
      const sanitizedValue = value.replace(/[^\d.]/g, "");

      // Check against regex and max value
      if (!priceRegex.test(sanitizedValue)) {
        return;
      }

      setFormData({
        ...formData,
        [name]: sanitizedValue,
      });
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProofFileSelect = async (e: any) => {
    const files = e.target.files;
    setProofImagesLoading(true);
    for (let i = 0; i < files.length; i++) {
      const isVideo = files[i].type === "video/mp4";
      const isImage = files[i].type.startsWith("image/");
      const isValid = isVideo || isImage;
      if (!isValid) {
        continue;
      }
      // if (isVideo) {
      //   setProofVideoBlobUrls((prev) => [...prev, createBlobUrl(files[i])]);
      //   const res = await uploadVideo({ file: files[i] }, MAX_VIDEO_SIZE);
      //   if (res) {
      //     onProofUploaded?.(res.data.url);
      //     setProofVideos((prev) => [...prev, res.data.url]);
      //   }
      //   continue;
      // }
      if (isImage) {
        setProofImagesBlobUrls((prev) => [...prev, createBlobUrl(files[i])]);
        const res = await uploadImage({ file: files[i] }, MAX_IMAGE_SIZE);
        if (res) {
          setProofImages((prev) => [...prev, res.data?.url]);
        }
        continue;
      }
    }
    setProofImagesLoading(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isDisabled) return;
    setIsSubmitting(true);

    const data: HelpRequest2 = {
      v: "0.2",
      organization: {
        contact: {
          email: formData.email,
          twitter: profile?.handle || "",
          // twitter: "Broccoli_NGO",
        },
      },
      request: {
        address: String(address),
        location: formData.location,
        costEstimate: {
          budgetPlan: formData.budgetPlan,
        },
        canProvideInvoice: formData.canProvideInvoice,
        canProvidePublicThankYouLetter: formData.canProvidePublicThankYouLetter,
      },
    };

    try {
      const NFTMetaData: NFTMetaData2 = requestToNFTMetadata2(data);
      const revertData = nftMetaDataToHelpRequest2(NFTMetaData);
      const ipfsRes = await uploadJson(requestToNFTMetadata2(data));

      console.log("-- NFTMetaData", NFTMetaData);
      console.log("-- ipfsRes", ipfsRes);

      const ipfsLink = ipfsRes?.data?.url;

      if (!ipfsLink) {
        toaster.create({
          title: getString(_TL_("Failed to submit request")),
          description: getString(_TL_("Please try again later.")),
          type: 'error',
        });
        return;
      }

      const createRes = await createHumanTask(ipfsLink, proofImages);

      if (createRes.code !== 0) {
        toaster.create({
          title: getString(_TL_("Failed to submit request")),
          description: createRes?.message || getString(_TL_("Please try again later.")),
          type: 'error',
        });
        return;
      }
      // toaster.create({
      //   title: "Success to submit request.",
      //   description: "Waiting for the callback.",
      //   type: "success",
      // });
      setIsSubmitted(true);
      onSuccess();
      setProofImages([]);
      setProofImagesBlobUrls([]);
      await refreshProfile();
      // router.push(`/task/${createRes.data.nftId}`);
    } catch (e) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshProfile = async () => {
    const res = await fetchProfile();
    if (res.code === 0) {
      setProfile(res.data);
      if (res.data.task) {
        setCurrentTask({
          ...res.data.task,
          metadata: nftMetaDataToHelpRequest2(res.data.task.metadata),
          passports: JSON.parse(res.data.task.helpPics),
        });
      }

      setCompletedTasks(
        res.data.completedTasks.map((task: any) => ({
          ...task,
          metadata: nftMetaDataToHelpRequest2(task.metadata),
        }))
      );
      return;
    }
    const oauthRes = await fetchXGenerateLink("/help");
    if (oauthRes.code === 0) {
      setXAuthLink(oauthRes.data.url);
    }
  };

  const { data: babTokenId } = useReadContract({
    address: "0x2B09d47D550061f995A3b5C6F0Fd58005215D7c8",
    abi: SBTABI,
    ...(address
      ? {
          functionName: "tokenIdOf",
          args: [address],
        }
      : {}),
  });

  // useEffect(() => {
  //   if (!uploadedProofs.length) return;
  //   async function loadFundRecords() {
  //     const parsedProofs = (
  //       await Promise.all(
  //         uploadedProofs.map(async (proof) => {
  //           return await fetch(proof).then((res) => res.json());
  //         })
  //       )
  //     ).flat();
  //     setParsedProofs(parsedProofs);
  //   }
  //   loadFundRecords();
  // }, [uploadedProofs]);

  useEffect(() => {
    refreshProfile();
  }, []);

  useEffect(() => {
    if (!currentTask) return;
    const metadata = currentTask?.metadata;
    setFormData({
      // organization: metadata?.organization.name || "",
      email: metadata?.organization.contact.email || "",
      location: metadata?.request.location || "",
      // rescueStoryURL: metadata?.request.helpPostLink || "",
      // helpPost: metadata?.request.assistanceRequired || "",
      // appliedFundUSD: metadata?.request.costEstimate.totalAmount || "",
      budgetPlan: metadata?.request.costEstimate.budgetPlan || "",
      // notes: metadata?.request.impactAfterAssistance || "",
      canProvideInvoice: Boolean(metadata?.request.canProvideInvoice) || false,
      canProvidePublicThankYouLetter:
        Boolean(metadata?.request.canProvidePublicThankYouLetter) || false,
    });

    setParsedProofs(currentTask.passports || []);
  }, [currentTask]);

  return (
    <DrawerFullpage
      isOpen={true}
      position={`${isMobile ? "bottom" : "right"}`}
      onOpenChange={() => {}}
    >
      <FormContainer>
        {/* Logo and title */}
        <HeaderSection>
          <HeaderContainer>
            <LogoContainer>
              <img alt="logo" src="/rescue-logo.png" />
            </LogoContainer>

            <Title>
              <span>{getString(_TL_('Fund Request Form'))}</span>
              <TitleStar alt="star" src="/decration/star-1.svg" />
            </Title>

            <Description>
              <p>
                {getString(_TL_("Broccoli's vision is to harness the power of blockchain to illuminate the path of charity with transparency, fostering trust and weaving more love and beauty into the fabric of our world."))}
              </p>
              <p>
                {getString(_TL_("This is a support channel set up for the March 28, 2025 earthquake in Myanmar. At this time, we can only support local people affected by this event. Thank you for your understanding."))}
              </p>
            </Description>
          </HeaderContainer>
        </HeaderSection>

        {/* Form */}
        <ContentContainer>
          {currentTask || !!completedTasks.length ? (
            <>
              <TaskCardsBox>
                {currentTask && (
                  <TaskCardContainer>
                    <TaskCardV0_2 task={currentTask} />
                  </TaskCardContainer>
                )}
                {!!completedTasks.length &&
                  completedTasks.map((task, idx) => (
                    <TaskCardContainer key={idx}>
                      <TaskCardV0_2 task={task} />
                    </TaskCardContainer>
                  ))}
              </TaskCardsBox>
            </>
          ) : null}

          <FormSection onSubmit={handleSubmit}>
            <FormGroup>
              {isConnected ? (
                <>
                  <WalletProfileContainer>
                    <WalletProfileAddress>
                      <span>Wallet: </span>
                      <b>{maskMiddle(address || "")}</b>
                    </WalletProfileAddress>
                    <WalletProfileBabt>
                      (BABT ID: {babTokenId || "none"})
                    </WalletProfileBabt>
                    {/* <ConnectXButton>
                      <span>{maskMiddle(address || "")}</span>
                    </ConnectXButton> */}
                  </WalletProfileContainer>
                </>
              ) : (
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                  }) => {
                    // Note: If your app doesn't use authentication, you
                    // can remove all 'authenticationStatus' checks
                    const ready = mounted && authenticationStatus !== "loading";
                    const connected =
                      ready &&
                      account &&
                      chain &&
                      (!authenticationStatus ||
                        authenticationStatus === "authenticated");

                    return (
                      <XAccountInputContainer>
                        {(() => {
                          if (!connected) {
                            return (
                              <ConnectWalletButton onClick={openConnectModal}>
                                <b>{getString(_TL_('Connect your wallet holding BABT'))}</b>
                                <p>{getString(_TL_('(Binance Account Bound Token)'))}</p>
                              </ConnectWalletButton>
                            );
                          }

                          if (chain.unsupported) {
                            return (
                              <button
                                onClick={openChainModal}
                                type="button"
                                className="donate-btn"
                              >
                                <span>{getString(_TL_('Wrong network'))}</span>
                              </button>
                            );
                          }

                          return (
                            <div>
                              <button
                                onClick={openAccountModal}
                                type="button"
                                className="donate-btn"
                              >
                                <span>
                                  {getString(_TL_('Connect your wallet holding BABT(Binance Account Bound Token)'))}
                                </span>
                              </button>
                            </div>
                          );
                        })()}
                      </XAccountInputContainer>
                    );
                  }}
                </ConnectButton.Custom>
              )}
            </FormGroup>

            {isConnected && babTokenId ? (
              <>
                <FormGroup>
                  <Label>
                    <RedAsterisk>*</RedAsterisk> 𝕏 {getString(_TL_('Account'))}:
                  </Label>
                  <XAccountInputContainer>
                    {profile ? (
                      <ProfileButton
                        disabled={!!currentTask || isSubmitting || isSubmitted}
                      >
                        <a
                          href={`https://x.com/${profile.handle}`}
                          target="_blank"
                        >
                          <img alt="x avatar" src={profile.avatar} />
                          <span>@{profile.handle}</span>
                        </a>
                      </ProfileButton>
                    ) : (
                      <ConnectXButton
                        disabled={!!currentTask || isSubmitting || isSubmitted}
                      >
                        <a href={xAuthLink}>
                          <span>{getString(_TL_('Connect'))}</span>
                          <XIcon />
                        </a>
                      </ConnectXButton>
                    )}
                  </XAccountInputContainer>
                </FormGroup>

                <FormGroup>
                  <Label title={getString(_TL_('Contact Email:')) as string}>
                    <RedAsterisk>*</RedAsterisk> {getString(_TL_('Contact Email:'))}
                  </Label>
                  <Input
                    type="text"
                    name="email"
                    placeholder="yourcontact@mail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    yellowBg
                    required
                    disabled={!!currentTask || isSubmitting || isSubmitted}
                  />
                </FormGroup>

                <FormGroup>
                  <Label title={getString(_TL_("Location: City, Country")) as string}>
                    <RedAsterisk>*</RedAsterisk> {getString(_TL_('Location:'))}
                  </Label>
                  <Input
                    type="text"
                    name="location"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={handleInputChange}
                    yellowBg
                    required
                    disabled={!!currentTask || isSubmitting || isSubmitted}
                  />
                </FormGroup>

                <FormGroup>
                  <Label title={getString(_TL_("Detailed breakdown of how the funds will be used.")) as string}>
                    <RedAsterisk>*</RedAsterisk> {getString(_TL_('Planned Use of Funds:'))}
                  </Label>
                  <TextArea
                    name="budgetPlan"
                    placeholder={getString(_TL_("Detailed breakdown of how the funds will be used.")) as string}
                    value={formData.budgetPlan}
                    onChange={handleInputChange}
                    required
                    disabled={!!currentTask || isSubmitting || isSubmitted}
                  />
                </FormGroup>

                <FormGroup>
                  <Label title={getString(_TL_("Any other information you'd like to share")) as string}>
                    <RedAsterisk>*</RedAsterisk> {getString(_TL_('Passport/ID Card:'))}
                  </Label>
                  <Stack direction="row" flexWrap="wrap" gap="4">
                    {parsedProofs.map((img, idx) => {
                      return (
                        <a key={idx} href={img} target="_blank">
                          <Image
                            border="solid"
                            borderColor="#ccc"
                            rounded="md"
                            h="200px"
                            w="200px"
                            fit="contain"
                            src={img}
                          />
                        </a>
                      );
                    })}
                    {proofImagesBlobUrls.map((img, idx) => {
                      return (
                        <a key={idx} href={img} target="_blank">
                          <Image
                            border="solid"
                            borderColor="#ccc"
                            rounded="md"
                            h="200px"
                            w="200px"
                            fit="contain"
                            src={img}
                          />
                        </a>
                      );
                    })}
                    <UploadBox
                      htmlFor="upload-record"
                      onClick={() => {
                        console.log("upload record");
                      }}
                    >
                      {proofImagesLoading ? (
                        <Spinner />
                      ) : (
                        <Icon as={FiPlus} fontSize="3xl" />
                      )}

                      <input
                        id="upload-record"
                        type="file"
                        // accept="image/*,video/mp4"
                        accept="image/*"
                        multiple
                        maxLength={20}
                        onChange={handleProofFileSelect}
                        disabled={proofImagesLoading}
                      />
                    </UploadBox>
                  </Stack>
                </FormGroup>

                <FormGroup>
                  <Label title={getString(_TL_("Can Provide Invoice (YES/NO).")) as string}>
                    {" "}
                    Can Provide Invoice: (
                    {formData.canProvideInvoice ? getString(_TL_("YES")) : getString(_TL_("NO"))})
                  </Label>
                  <Switch.Root
                    // defaultChecked={formData.canProvideInvoice}
                    checked={formData.canProvideInvoice}
                    value={formData.canProvideInvoice}
                    disabled={!!currentTask || isSubmitting || isSubmitted}
                    onCheckedChange={(e) => {
                      setFormData({
                        ...formData,
                        canProvideInvoice: e.checked,
                      });
                    }}
                    colorPalette="green"
                  >
                    <Switch.HiddenInput />
                    <Switch.Control />
                  </Switch.Root>
                  {/* <SwitchTip>YES</SwitchTip> */}
                </FormGroup>

                <FormGroup>
                  <Label title={getString(_TL_("Can Provide Public Thank-You Letter (YES/NO).")) as string}>
                    Can Provide Public Thank-You Letter: (
                    {formData.canProvidePublicThankYouLetter ? getString(_TL_("YES")) : getString(_TL_("NO"))})
                  </Label>
                  <Switch.Root
                    // defaultChecked={formData.canProvidePublicThankYouLetter}
                    checked={formData.canProvidePublicThankYouLetter}
                    value={formData.canProvidePublicThankYouLetter}
                    disabled={!!currentTask || isSubmitting || isSubmitted}
                    onCheckedChange={(e) => {
                      setFormData({
                        ...formData,
                        canProvidePublicThankYouLetter: e.checked,
                      });
                    }}
                    colorPalette="green"
                  >
                    <Switch.HiddenInput />
                    <Switch.Control />
                  </Switch.Root>
                </FormGroup>

                {!currentTask && !isSubmitted ? (
                  <SubmitButton
                    // loading={isSubmitting}
                    disabled={isSubmitting || isDisabled}
                  >
                    {isSubmitted ? (
                      getString(_TL_("Request Successful!"))
                    ) : isSubmitting ? (
                      <>
                        <LoadingSpinner />
                        {getString(_TL_('Submitting...'))}
                      </>
                    ) : (
                      getString(_TL_("Submit Request"))
                    )}
                  </SubmitButton>
                ) : null}
              </>
            ) : (
              <>
                {!babTokenId && address && (
                  <>
                    <WalletProfileDisconnect>
                      <p>
                        {getString(_TL_('The current address does not hold BABT, please mint BABT or change the wallet holding BABT.'))}
                      </p>
                      <b onClick={() => disconnect()}>{getString(_TL_('Disconnect Wallet'))}</b>
                    </WalletProfileDisconnect>
                  </>
                )}
                <BABTInfo>
                  <BABTGifImg src="/bab-token.gif" />
                  <h2>{getString(_TL_('About BABT'))}</h2>
                  <div>
                    <p>
                      {getString(_TL_('Binance Account Bound Token is an official token from Binance that proves a user has completed KYC verification. Each user can only have one BABT, and it is non-transferable. It helps verify if a wallet is controlled by a real user, preventing bots or malicious activity.'))}
                    </p>
                    <p>
                      {getString(_TL_('You can search for "BABT" in your BINANCE wallet to quickly register an on-chain KYC credential.'))}
                    </p>
                  </div>
                  <a href="https://www.binance.com/en/BABT" target="_blank">
                    <BABTMintBtn>{getString(_TL_('Mint BABT'))}</BABTMintBtn>
                  </a>
                </BABTInfo>
              </>
            )}
          </FormSection>
        </ContentContainer>
      </FormContainer>
    </DrawerFullpage>
  );
};

export default FundRequestForm;
