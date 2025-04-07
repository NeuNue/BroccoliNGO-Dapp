"use client";

import { FC, useEffect, useState } from "react";
import DrawerFullpage from "@/components/Drawer/fullpage";
import styled from "@emotion/styled";
import { isMobileDevice } from "@/shared/utils";
import {
  nftMetaDataToHelpRequest,
  requestToNFTMetadata,
} from "@/shared/task";
import {
  createTask,
  fetchProfile,
  fetchXGenerateLink,
  uploadJson,
} from "@/shared/api";
import Image from "next/image";
import XIcon from "@/components/icons/x";
import { Tooltip } from "@/components/ui/tooltip";
import { Switch } from "@chakra-ui/react";
import { HelpRequest, NFTMetaData } from "@/shared/types/rescue";
import { toaster } from "@/components/ui/toaster";
import TaskCard from "./taskCard";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
const FundRequestForm: FC<Props> = ({ open, onClose, onSuccess }) => {
  // const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>({
    organization: "",
    email: "",
    location: "",
    rescueStoryURL: "",
    helpPost: "",
    appliedFundUSD: "",
    budgetPlan: "",
    notes: "",
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isDisabled) return;
    setIsSubmitting(true);

    const data: HelpRequest = {
      v: "0.1",
      organization: {
        name: formData.organization,
        contact: {
          email: formData.email,
          twitter: profile?.handle || "",
          // twitter: "Broccoli_NGO",
        },
      },
      request: {
        helpPostLink: formData.rescueStoryURL,
        assistanceRequired: formData.helpPost,
        location: formData.location,
        costEstimate: {
          totalAmount: parseFloat(formData.appliedFundUSD),
          budgetPlan: formData.budgetPlan,
          breakdown: [],
        },
        canProvideInvoice: formData.canProvideInvoice,
        canProvidePublicThankYouLetter: formData.canProvidePublicThankYouLetter,
        impactAfterAssistance: formData.notes,
      },
    };

    try {
      const NFTMetaData: NFTMetaData = requestToNFTMetadata(data);
      const revertData = nftMetaDataToHelpRequest(NFTMetaData);
      const ipfsRes = await uploadJson(requestToNFTMetadata(data));

      const ipfsLink = ipfsRes?.data?.url;

      if (!ipfsLink) {
        toaster.create({
          title: "Failed to submit request",
          description: "Please try again later.",
          type: "error",
        });
        return;
      }

      const createRes = await createTask(ipfsLink);

      if (createRes.code !== 0) {
        toaster.create({
          title: "Failed to submit request",
          description: createRes?.message || "Please try again later.",
          type: "error",
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

  useEffect(() => {
    if (!currentTask) return;
    const metadata = currentTask?.metadata;
    setFormData({
      organization: metadata?.organization.name || "",
      email: metadata?.organization.contact.email || "",
      location: metadata?.request.location || "",
      rescueStoryURL: metadata?.request.helpPostLink || "",
      helpPost: metadata?.request.assistanceRequired || "",
      appliedFundUSD: metadata?.request.costEstimate.totalAmount || "",
      budgetPlan: metadata?.request.costEstimate.budgetPlan || "",
      notes: metadata?.request.impactAfterAssistance || "",
      canProvideInvoice: Boolean(metadata?.request.canProvideInvoice) || false,
      canProvidePublicThankYouLetter:
        Boolean(metadata?.request.canProvidePublicThankYouLetter) || false,
    });
  }, [currentTask]);

  return (
    <DrawerFullpage
      isOpen={open}
      position={`${isMobile ? "bottom" : "right"}`}
      onOpenChange={onClose}
    >
      <FormContainer>
        {/* Close button */}
        <CloseButton onClick={onClose}>
          <img alt="close" src="/icons/close.svg" />
        </CloseButton>

        {/* Logo and title */}
        <HeaderSection>
          <HeaderContainer>
            <LogoContainer>
              <img alt="logo" src="/rescue-logo.png" />
            </LogoContainer>

            <Title>
              <span>Fund Request Form</span>
              <TitleStar alt="star" src="/decration/star-1.svg" />
            </Title>

            <Description>
              <p>
                Broccoli&apos;s vision is to harness the power of blockchain to
                illuminate the path of charity and pet rescue with transparency,
                fostering trust and weaving more love and beauty into the fabric
                of our world.
              </p>
              <p>
                If you are engaged in pet rescue efforts, we warmly welcome you
                to apply for the Rescue Fund.{" "}
              </p>
              <b>
                Please share your rescue story on 𝕏 , explaining the reasons you
                need financial assistance, and include the hashtag
                #BroccoliInAction.{" "}
              </b>
              <p>
                After submitting this form, our community volunteers will reach
                out to you.
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
                    <TaskCard task={currentTask} />
                  </TaskCardContainer>
                )}
                {!!completedTasks.length &&
                  completedTasks.map((task, idx) => (
                    <TaskCardContainer key={idx}>
                      <TaskCard task={task} />
                    </TaskCardContainer>
                  ))}
              </TaskCardsBox>
            </>
          ) : null}

          <FormSection onSubmit={handleSubmit}>
            <FormGroup>
              <Label>
                <RedAsterisk>*</RedAsterisk> 𝕏 Account:
              </Label>
              <XAccountInputContainer>
                {profile ? (
                  <ProfileButton
                    disabled={!!currentTask || isSubmitting || isSubmitted}
                  >
                    <a href={`https://x.com/${profile.handle}`} target="_blank">
                      <img alt="x avatar" src={profile.avatar} />
                      <span>@{profile.handle}</span>
                    </a>
                  </ProfileButton>
                ) : (
                  <ConnectXButton
                    disabled={!!currentTask || isSubmitting || isSubmitted}
                  >
                    <a href={xAuthLink}>
                      <span>Connect</span>
                      <XIcon />
                    </a>
                  </ConnectXButton>
                )}
              </XAccountInputContainer>
            </FormGroup>

            <FormGroup>
              <Label title="Name of the Dog Shelter/Rescue.">
                <RedAsterisk>*</RedAsterisk> Organization Name:
              </Label>
              <Input
                type="text"
                name="organization"
                placeholder="Name of the Dog Shelter/Rescue."
                value={formData.organization}
                onChange={handleInputChange}
                yellowBg
                required
                disabled={!!currentTask || isSubmitting || isSubmitted}
              />
            </FormGroup>

            <FormGroup>
              <Label title="Contact Email">
                <RedAsterisk>*</RedAsterisk> Contact Email :
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

            {/* <FormGroup>
              <Label>
                <RedAsterisk>*</RedAsterisk> Telegram Contact:
              </Label>
              <Input
                type="text"
                name="tgHandle"
                value={formData.tgHandle}
                onChange={handleInputChange}
                yellowBg
                required
              />
            </FormGroup> */}

            <FormGroup>
              {/* <Tooltip content="This is the tooltip content">
                
              </Tooltip> */}
              <Label title="Location: City, Country">
                <RedAsterisk>*</RedAsterisk>
                Location:
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
              {/* <Tooltip content="This is the tooltip content">
                
              </Tooltip> */}
              <Label title="Link to the X post sharing your rescue story.">
                <RedAsterisk>*</RedAsterisk>
                Rescue Story Link:
              </Label>
              <Input
                type="text"
                name="rescueStoryURL"
                placeholder="Link to the X post sharing your rescue story."
                value={formData.rescueStoryURL}
                onChange={handleInputChange}
                yellowBg
                required
                disabled={!!currentTask || isSubmitting || isSubmitted}
              />
            </FormGroup>

            <FormGroup>
              {/* <Tooltip content="This is the tooltip content">
                
              </Tooltip> */}
              <Label title="How can we help you?">
                <RedAsterisk>*</RedAsterisk>
                Assistance Needed:
              </Label>
              <Input
                type="text"
                name="helpPost"
                placeholder="How can we help you?"
                value={formData.helpPost}
                onChange={handleInputChange}
                yellowBg
                required
                disabled={!!currentTask || isSubmitting || isSubmitted}
              />
            </FormGroup>

            <FormGroup>
              <Label title="Funding amount needed for the Rescue Fund.">
                <RedAsterisk>*</RedAsterisk> Amount Requested (USD):
              </Label>
              <Input
                type="number"
                name="appliedFundUSD"
                placeholder="Funding amount needed for the Rescue Fund."
                value={formData.appliedFundUSD}
                onChange={handleInputChange}
                yellowBg
                required
                disabled={!!currentTask || isSubmitting || isSubmitted}
              />
            </FormGroup>

            <FormGroup>
              <Label title="Detailed breakdown of how the funds will be used.">
                <RedAsterisk>*</RedAsterisk> Planned Use of Funds:
              </Label>
              <TextArea
                name="budgetPlan"
                placeholder="Detailed breakdown of how the funds will be used."
                value={formData.budgetPlan}
                onChange={handleInputChange}
                required
                disabled={!!currentTask || isSubmitting || isSubmitted}
              />
            </FormGroup>

            <FormGroup>
              <Label title="Any other information you'd like to share">
                Additional Notes:
              </Label>
              <TextArea
                name="notes"
                placeholder="Any other information you'd like to share."
                value={formData.notes}
                onChange={handleInputChange}
                disabled={!!currentTask || isSubmitting || isSubmitted}
              />
            </FormGroup>

            <FormGroup>
              <Label title="Can Provide Invoice (YES/NO).">
                {" "}
                Can Provide Invoice: (
                {formData.canProvideInvoice ? "YES" : "NO"})
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
              <Label title="Can Provide Public Thank-You Letter (YES/NO).">
                Can Provide Public Thank-You Letter: (
                {formData.canProvidePublicThankYouLetter ? "YES" : "NO"})
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
                  "Request Successful!"
                ) : isSubmitting ? (
                  <>
                    <LoadingSpinner />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </SubmitButton>
            ) : null}
          </FormSection>
        </ContentContainer>
      </FormContainer>
    </DrawerFullpage>
  );
};

export default FundRequestForm;

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

const XAccountInputContainer = styled.div`
  width: 100%;
  height: 50px;
`;

const ConnectXButton = styled.div<{ disabled?: boolean }>`
  width: 100%;
  height: 100%;

  border-radius: 12px;
  border: 1px solid;

  border-color: #fbbc05;
  background-color: transparent;

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

interface SubmitButtonProps {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

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