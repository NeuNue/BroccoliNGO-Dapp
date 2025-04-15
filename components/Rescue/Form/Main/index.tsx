import { Button, ButtonGroup, Steps } from "@chakra-ui/react";
import FormContact from "./Contact";
import FormBackground from "./Background";
import FormRequest from "./Request";
import RescueCompleted from "./Completed";
import { FC, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { useGlobalCtx } from "@/hooks/useGlobal";
import { useRescueRequestCtx } from "@/hooks/useRescue";
import { useI18n } from "@/components/ui/I18nProvider";

interface Props {
  onPrev?: () => void;
  onSubmitted?: () => void;
}
const FormMain: FC<Props> = ({ onPrev }) => {
  const { getString } = useI18n();
  const { currentTask } = useRescueRequestCtx();
  const { isMobile } = useGlobalCtx();
  const [stepIdx, setStepIdx] = useState(0);
  const steps = useMemo(() => {
    return [
      {
        title: getString(isMobile ? _TL_('Contact') : _TL_("Contact Info")),
        description: getString(_TL_("Step 1 description")),
        Component: FormContact,
      },
      {
        title: getString(isMobile ? _TL_('Background') : _TL_("Background Info")),
        description: getString(_TL_("Step 2 description")),
        Component: FormBackground,
      },
      {
        title: getString(isMobile ? _TL_('Funds') : _TL_("Funds Request")),
        description: getString(_TL_("Step 3 description")),
        Component: FormRequest,
      },
    ];
  }, [isMobile]);

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

  return (
    <Container>
      <StyledStepRoot
        defaultStep={stepIdx}
        count={steps.length}
        step={stepIdx}
        onStepChange={(e) => {
          setStepIdx(e.step);
        }}
      >
        <StyledStepList>
          {steps.map((step, index) => (
            <StyledStepItem
              active={(stepIdx === index).toString()}
              key={index}
              index={index}
              title={step.title as string}
            >
              <StyledStepTitle
                active={stepIdx === index}
                finished={stepIdx > index}
              >
                <StyledStepIndicator
                  active={(stepIdx === index).toString()}
                  finished={(stepIdx > index).toString()}
                />
                <StyledStepItemLabel active={stepIdx === index}>
                  {step.title}
                </StyledStepItemLabel>
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
          <RescueCompleted tokenId={currentTask?.task.nftId!} />
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

const StyledStepItem = styled(Steps.Item)<{ active?: string }>`
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
  @media screen and (max-width: 768px) {
    padding: 12px;
  }
`;

const StyledStepItemLabel = styled.span<{ active?: boolean }>`
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  @media screen and (max-width: 768px) {
    font-size: 12px;
  }
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
    props.finished === "true"
      ? "#22B670"
      : props.active === "true"
      ? "#feb602"
      : "rgba(255, 255, 255, 0.1)"};
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  @media screen and (max-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }

  > svg {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    stroke-width: 4;
    @media screen and (max-width: 768px) {
      width: 10px;
      height: 10px;
      stroke-width: 3;
    }
  }
`;

const StyledStepContent = styled(Steps.Content)`
  width: 100%;
`;
