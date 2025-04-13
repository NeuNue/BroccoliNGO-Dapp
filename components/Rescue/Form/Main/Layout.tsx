import { Button as _Button } from "@chakra-ui/react";
import styled from "@emotion/styled";

export const FormContainer = styled.form``;

export const Main = styled.div`
  display: flex;
  padding: 40px;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  align-self: stretch;
  background: #fff;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Title = styled.h1`
  color: #322f2c;
  font-size: 24px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  text-transform: capitalize;
  margin: 0;
`;

export const Description = styled.p`
  color: #322f2c;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-self: stretch;
`;

export const RedAsterisk = styled.span`
  color: #f44336;
`;

export const FormInputLabel = styled.label`
  color: #322f2c;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const FormInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  > input {
    flex: 1;
  }
`;

export const FormInput = styled.input<{ disabled?: boolean }>`
  display: flex;
  width: 100%;
  height: 50px;
  padding: 16px;
  align-items: center;
  gap: 16px;

  color: rgba(50, 47, 44, 1);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
  border-radius: 8px;
  border: 1px solid rgba(50, 47, 44, 0.1);
  background: ${(props) => (props.disabled ? "rgba(50, 47, 44, 0.1)" : "#fff")};
  opacity: ${(props) => (props.disabled ? 0.8 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "text")};

  &::placeholder {
    color: rgba(50, 47, 44, 0.2);
  }

  &:focus {
    outline: none;
    border: 1px solid rgba(50, 47, 44, 0.5);
  }
`;

export const FormTextarea = styled.textarea<{ disabled?: boolean }>`
  display: flex;
  width: 100%;
  min-height: 132px;
  padding: 16px;
  align-items: center;
  gap: 16px;
  background: ${(props) => (props.disabled ? "rgba(50, 47, 44, 0.1)" : "#fff")};
  opacity: ${(props) => (props.disabled ? 0.8 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "text")};

  color: rgba(50, 47, 44, 1);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
  border-radius: 8px;
  border: 1px solid rgba(50, 47, 44, 0.1);
  resize: none;

  &::placeholder {
    color: rgba(50, 47, 44, 0.2);
  }

  &:focus {
    outline: none;
    border: 1px solid rgba(50, 47, 44, 0.5);
  }
`;

export const MediaList = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 12px;
  pointer-events: none;
  @media screen and (max-width: 768px) {
    width: 100%;
    grid-gap: 12px;
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const MediaItem = styled.div<{ disabled?: boolean }>`
  position: relative;
  margin: 0;
  will-change: transform;
  pointer-events: auto;
  display: ${(props) => (props.disabled ? "none" : "block")};
  border-radius: 8px;
`;

export const MediaItemImg = styled.img`
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  cursor: pointer;
  border-radius: 8px;
`;

export const MediaItemDelete = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 100px;
  background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.2) 100%
    ),
    url(<path-to-image>) lightgray 50% / cover no-repeat;
  > svg {
    width: 24px;
    height: 24px;
    color: #fff;
  }
`;

export const UploadBox = styled.label<{ disabled?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 8px;
  border: 1px solid rgba(50, 47, 44, 0.1);
  transition: all 0.2s;
  cursor: pointer;
  width: 100%;
  aspect-ratio: 1/1;
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
  color: rgba(50, 47, 44, 0.2);
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 22.4px */

  > svg {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }

  &:hover {
    border: 1px solid rgba(50, 47, 44, 0.5);
  }

  input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
`;

export const Footer = styled.div`
  display: flex;
  padding: 24px 40px 40px 40px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-top: 1px solid rgba(50, 47, 44, 0.1);
`;

export const Button = styled(_Button)<{ disabled?: boolean }>`
  display: flex;
  width: 100px;
  height: 50px;
  padding: 0px 16px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 1px solid rgba(50, 47, 44, 0.1);
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  background: #fff;

  color: #322f2c;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%; /* 14px */
  letter-spacing: 0.14px;
`;

export const SubmitButton = styled(_Button)<{ disabled?: boolean }>`
  display: flex;
  width: 100px;
  height: 50px;
  padding: 0px 16px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: #fbbc05;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  color: #fff;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%; /* 14px */
  letter-spacing: 0.14px;
`;

export const CheckBoxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  cursor: pointer;
  > checkbox {
    width: 24px;
    height: 24px;
  }
`;

export const CheckBoxButton = styled.button`
  flex: 1;
  display: flex;
  height: 50px;
  padding: 16px;
  align-items: center;
  gap: 16px;
  flex: 1 0 0;
  border-radius: 8px;
  border: 1px solid #322f2c;
  background: #fff;

  overflow: hidden;
  color: #322f2c;
  text-align: center;
  text-overflow: ellipsis;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 19.6px */
`;
