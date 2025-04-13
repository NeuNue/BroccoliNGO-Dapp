"use client";

import { FC, useEffect, useState } from "react";
import DrawerFullpage from "@/components/Drawer/fullpage";
import styled from "@emotion/styled";
import { isMobileDevice } from "@/shared/utils";
// import RescueForm from "@/components/Rescue/OldForm";
import RescueForm from "@/components/Rescue/Form";
import { RescueRequestProvider } from "@/hooks/useRescue";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
const FundRequestForm: FC<Props> = ({ open, onClose, onSuccess }) => {
  // const router = useRouter();
  const isMobile = isMobileDevice();

  return (
    <RescueRequestProvider>
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

          {/* Form */}
          <ContentContainer>
            {
              open ? (
                <RescueForm />
              ) : null
            }
          </ContentContainer>
        </FormContainer>
      </DrawerFullpage>
    </RescueRequestProvider>
  );
};

export default FundRequestForm;

// Styled components

const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  background-color: #feb602;
  min-height: 100vh;
  background-image: url(/rescue-bg.png);
  background-size: 100% auto;
  background-position: center;
  background-repeat: no-repeat;
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
  z-index: 11;
  > img {
    width: 18px;
    height: 18px;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 800px;
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

// const HeaderSection = styled.div`
//   position: relative;
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   // &::before {
//   //   content: "";
//   //   position: absolute;
//   //   bottom: -1px;
//   //   left: 0;
//   //   width: 100%;
//   //   height: 20px;
//   //   background-image: url(/rescue-bg-bottom.png);
//   //   background-size: cover;
//   //   background-position: bottom;
//   //   background-repeat: no-repeat;
//   // }
// `;

// const HeaderContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding-top: 70px;
//   padding-bottom: 50px;
//   margin-bottom: 24px;
//   width: 100%;
//   max-width: 680px;
//   @media screen and (max-width: 768px) {
//     padding-left: 20px;
//     padding-right: 20px;
//   }
// `;

// const LogoContainer = styled.div`
//   position: relative;
//   width: 180px;
//   height: 180px;
//   border-radius: 50%;
//   @media screen and (max-width: 768px) {
//     width: 140px;
//     height: 140px;
//   }
//   > img {
//     width: 100%;
//     height: 100%;
//     object-fit: contain;
//   }
//   &::before {
//     content: "";
//     position: absolute;
//     right: -20px;
//     top: -40px;
//     width: 70px;
//     height: 70px;
//     background-image: url(/icons/crown.svg);
//     background-size: cover;
//     background-position: center;
//     background-repeat: no-repeat;
//     pointer-events: none;
//     @media screen and (max-width: 768px) {
//       width: 50px;
//       height: 50px;
//       right: -18px;
//       top: -28px;
//     }
//   }
// `;

// const Title = styled.h1`
//   position: relative;
//   margin: 0;
//   margin-top: 10px;
//   color: #fff;
//   text-align: center;
//   font-family: var(--font-darumadrop-one);
//   font-size: 56px;
//   font-style: normal;
//   font-weight: 400;
//   line-height: 130%;
//   letter-spacing: -1.12px;
//   text-transform: capitalize;
//   > span {
//     position: relative;
//     z-index: 1;
//   }
//   @media screen and (max-width: 768px) {
//     margin-top: 16px;
//     font-size: 32px;
//     line-height: 100%; /* 32px */
//     letter-spacing: -0.64px;
//   }
// `;

// const TitleStar = styled.img`
//   width: 95px;
//   height: 95px;
//   position: absolute;
//   left: -40px;
//   bottom: -5px;
//   z-index: 0;
//   pointer-events: none;
//   @media screen and (max-width: 768px) {
//     width: 60px;
//     height: 60px;
//     left: -30px;
//     bottom: -5px;
//   }
// `;

// const Description = styled.div`
//   margin-top: 12px;
//   color: #fff;
//   text-align: justify;
//   font-size: 15px;
//   font-style: normal;
//   font-weight: 400;
//   line-height: 140%; /* 21px */
//   letter-spacing: 0.15px;

//   display: flex;
//   flex-direction: column;
//   gap: 10px;

//   @media screen and (max-width: 768px) {
//     font-size: 13px;
//     line-height: 140%; /* 18.2px */
//     letter-spacing: 0.13px;
//   }

//   > b {
//     font-weight: 700;
//     text-decoration-line: underline;
//     text-decoration-style: solid;
//     text-decoration-skip-ink: auto;
//     text-decoration-thickness: auto;
//     text-underline-offset: auto;
//     text-underline-position: from-font;
//   }
// `;

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
