import React, { useState } from "react";
import styled from "@emotion/styled";
import RightIcon from "@/components/icons/right";

const SelectionContainer = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const SelectButton = styled.button<{ isSelected: boolean }>`
  flex: 1;
  display: flex;
  height: 50px;
  padding: 16px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid
    ${(props) => (props.isSelected ? "#322F2C" : "rgba(50, 47, 44, 0.1)")};
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;

  color: ${(props) => (props.isSelected ? "#322F2C" : "#322F2C")};
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;

  svg {
    display: ${(props) => (props.isSelected ? "block" : "none")};
    width: 16px;
    height: 16px;
    color: #322f2c;
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
}

const YesNoSelection: React.FC<YesNoSelectionProps> = ({
  value = null,
  onChange,
  yesLabel = "Yes",
  noLabel = "No",
  name = "yesno",
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
      >
        <RightIcon />
        <OptionLabel>{noLabel}</OptionLabel>
      </SelectButton>
    </SelectionContainer>
  );
};

export default YesNoSelection;
