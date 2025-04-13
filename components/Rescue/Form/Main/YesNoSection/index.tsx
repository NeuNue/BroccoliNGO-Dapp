import React, { useState } from "react";
import styled from "@emotion/styled";
import RightIcon from "@/components/icons/right";

const SelectionContainer = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const SelectButton = styled.button<{ isSelected: boolean; disabled?: boolean }>`
  flex: 1;
  display: flex;
  height: 50px;
  padding: 16px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid;
  border-color: ${(props) =>
    props.isSelected
      ? props.disabled
        ? "rgba(50, 47, 44, 0.5)"
        : "#322F2C"
      : "rgba(50, 47, 44, 0.1)"};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;

  color: ${(props) => (props.isSelected ? "#322F2C" : "#322F2C")};
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  @media screen and (max-width: 768px) {
    height: 40px;
    padding: 12px;
    font-size: 12px;
  }

  svg {
    display: ${(props) => (props.isSelected ? "block" : "none")};
    width: 16px;
    height: 16px;
    color: #322f2c;
    @media screen and (max-width: 768px) {
      width: 14px;
      height: 14px;
    }
  }

  &:hover {
    border-color: ${(props) =>
      props.isSelected ? "#322F2C" : "rgba(50, 47, 44, 0.3)"};
  }
`;

const OptionLabel = styled.span``;

interface YesNoSelectionProps {
  value?: boolean | null;
  onChange?: (value: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
  name?: string;
  disabled?: boolean;
}

const YesNoSelection: React.FC<YesNoSelectionProps> = ({
  value = null,
  onChange,
  yesLabel = "Yes",
  noLabel = "No",
  name = "yesno",
  disabled = false,
}) => {
  const [selectedValue, setSelectedValue] = useState<boolean | null>(value);

  const handleSelection = (selected: boolean) => {
    setSelectedValue(selected);
    if (onChange) {
      onChange(selected);
    }
  };

  return (
    <SelectionContainer>
      <SelectButton
        type="button"
        isSelected={selectedValue === true}
        onClick={() => handleSelection(true)}
        aria-label={yesLabel}
        role="radio"
        aria-checked={selectedValue === true}
        name={name}
        disabled={disabled}
        aria-disabled={disabled}
      >
        <RightIcon />
        <OptionLabel>{yesLabel}</OptionLabel>
      </SelectButton>

      <SelectButton
        type="button"
        isSelected={selectedValue === false}
        onClick={() => handleSelection(false)}
        aria-label={noLabel}
        role="radio"
        aria-checked={selectedValue === false}
        name={name}
        disabled={disabled}
        aria-disabled={disabled}
      >
        <RightIcon />
        <OptionLabel>{noLabel}</OptionLabel>
      </SelectButton>
    </SelectionContainer>
  );
};

export default YesNoSelection;
