import { Button, ButtonGroup, Steps } from "@chakra-ui/react";
import FormContact from "./Contact";
import FormBackground from "./Background";
import FormRequest from "./Request";
import RescueCompleted from "./Completed";
import { FC, useState } from "react";
import styled from "@emotion/styled";

interface Props {
  onPrev?: () => void;
  onSubmitted?: () => void;
}
const FormMain: FC<Props> = ({ onPrev }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const steps = [
    {
      title: "Contact Info",
      description: "Step 1 description",
      Component: FormContact,
    },
    {
      title: "Background Info",
      description: "Step 2 description",
      Component: FormBackground,
    },
    {
      title: "Runds Request",
      description: "Step 3 description",
      Component: FormRequest,
    },
  ];

  const handlePrev = () => {
    if (stepIdx > 0) {
      setStepIdx(stepIdx - 1);
    } else {
      onPrev?.();
    }
  };

  const handleNext = () => {
    if (stepIdx < steps.length) {
      setStepIdx(stepIdx + 1);
    }
  };

  console.log("- stepIdx", stepIdx);
  return (
    <Container>
      <StyledStepRoot
        defaultStep={stepIdx}
        count={steps.length}
        step={stepIdx}
        onStepChange={(e) => {
          console.log('- onStepChange', e.step)
          setStepIdx(e.step);
        }}
      >
        <StyledStepList>
          {steps.map((step, index) => (
            <StyledStepItem key={index} index={index} title={step.title}>
              <StyledStepTitle
                active={stepIdx === index}
                finished={stepIdx > index}
              >
                <StyledStepIndicator
                  active={(stepIdx === index).toString()}
                  finished={(stepIdx > index).toString()}
                />
                {step.title}
              </StyledStepTitle>
            </StyledStepItem>
          ))}
        </StyledStepList>

        {steps.map((step, index) => (
          <StyledStepContent key={index} index={index}>
            <step.Component onPrev={handlePrev} onNext={handleNext} />
          </StyledStepContent>
        ))}
        <Steps.CompletedContent>
          <RescueCompleted tokenId="3" />
        </Steps.CompletedContent>
      </StyledStepRoot>
    </Container>
  );
};

export default FormMain;

const Container = styled.div`
  padding-top: 80px;
  padding-bottom: 80px;
  width: 100%;
  max-width: 800px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledStepRoot = styled(Steps.Root)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 20px;
  background: #fff;
  overflow: hidden;
  gap: 0;
`;

const StyledStepList = styled(Steps.List)`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
`;

const StyledStepItem = styled(Steps.Item)`
  display: flex;
  padding: 16px 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex: 1 0 0;
  align-self: stretch;
  background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.2) 100%
    ),
    #322f2c;
`;

const StyledStepTitle = styled(Steps.Title)<{
  active?: boolean;
  finished?: boolean;
}>`
  color: ${(props) =>
    props.finished ? "#22B670" : props.active ? "#feb602" : "#fff"};
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  display: flex;
  align-items: center;
  gap: 10px;
`;

const StyledStepIndicator = styled(Steps.Indicator)<{
  active?: string;
  finished?: string;
}>`
  display: flex;
  width: 24px;
  height: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  aspect-ratio: 1/1;

  border-radius: 100px;
  border: none;

  color: #fff;

  background-color: ${(props) =>
    props.finished === 'true'
      ? "#22B670"
      : props.active === 'true'
      ? "#feb602"
      : "rgba(255, 255, 255, 0.1)"};
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  > svg {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    stroke-width: 4;
  }
`;

const StyledStepContent = styled(Steps.Content)`
  width: 100%;
`;
