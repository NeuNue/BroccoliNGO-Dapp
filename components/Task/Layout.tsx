import { Button } from "@chakra-ui/react";
import styled from "@emotion/styled";

export const CardContainer = styled.div<{ head?: boolean }>`
  position: relative;
  width: 100%;
  max-width: 720px;
  padding: ${(props) => (props.head ? "50px 40px 30px 40px" : "30px 40px")};

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  border-radius: 20px;
  background: #fff;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
    background-image: url(/details/decration-top-bar.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    z-index: 1;
    display: ${(props) => (props.head ? "block" : "none")};
  }

  @media screen and (max-width: 768px) {
    padding: ${(props) => (props.head ? "30px 20px 20px 20px" : "20px 20px")};
  }
`;

export const CardTitle = styled.h2`
  color: #322f2c;
  font-size: 24px;
  font-style: normal;
  font-weight: 800;
  line-height: 160%; /* 38.4px */
  @media screen and (max-width: 768px) {
    font-size: 20px;
    display: flex;
    flex-direction: column;
  }
`;

export const CardTitleTip = styled.span<{
  color?: string;
}>`
  color: ${(props) => {
    return props.color || "#322f2c";
  }};
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;
  @media screen and (max-width: 768px) {
    font-size: 20px;
  }
`;

export const SubmitButton = styled(Button)<{ disabled?: boolean }>`
  display: flex;
  height: 50px;
  padding: 10px 15px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 12px;
  background: #322f2c;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  color: #fff;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%; /* 16px */
  letter-spacing: 0.16px;
  text-transform: capitalize;

  @media screen and (max-width: 768px) {
    height: 40px;
    font-size: 14px;
    padding: 8px 12px;
  }
`;