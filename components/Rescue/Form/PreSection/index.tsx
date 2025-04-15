import { Profile } from "@/shared/types/profile";
import styled from "@emotion/styled";
import { FC } from "react";
import FormConnect from "@/components/Rescue/Form/Connect";
import { useRescueRequestCtx } from "@/hooks/useRescue";
import TaskCard from "../TaskCard";
import TaskCardV0_1 from "../TaskCard/v0.1";
import { RescueTask, RescueTaskV1 } from "@/shared/types/rescue";
import { usePrivy } from "@privy-io/react-auth";
import { Spinner } from "@chakra-ui/react";
import { useGlobalCtx } from "@/hooks/useGlobal";
import { useI18n } from "@/components/ui/I18nProvider";

interface Props {
  onNext: () => void;
}

const FormPreSection: FC<Props> = ({ onNext }) => {
  const { getString } = useI18n()
  const { ready, authenticated } = usePrivy();
  const { profile } = useGlobalCtx()
  const { currentTask, completedTasks } = useRescueRequestCtx();
  return (
    <Container>
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
            {/* <p>
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
            </p> */}
            <p>
             {getString(_TL_("Broccoli's vision is to harness the power of blockchain to illuminate the path of charity and pet rescue with transparency, fostering trust and weaving more love and beauty into the fabric of our world."))}
            </p>

            <p>
              {getString(_TL_("If you're involved in pet rescue work, we warmly invite you to complete this form to apply for financial support."))}
            </p>
          </Description>
        </HeaderContainer>
      </HeaderSection>
      <Footer>
        {!ready ? (
          <Spinner />
        ) : !profile ? (
          <FormConnect />
        ) : (
          <StartButton onClick={onNext}>
            {currentTask
              ? getString(_TL_("View Your Application #{{id}}"), { id: currentTask.task.nftId })
              : getString(_TL_("Start Application"))}
          </StartButton>
        )}
      </Footer>
      {currentTask || !!completedTasks.length ? (
        <>
          <TaskCardsBox>
            {currentTask && (
              <TaskCardContainer>
                {currentTask.version === "1.0" ? (
                  <TaskCard task={currentTask.task as RescueTaskV1} />
                ) : (
                  <TaskCardV0_1 task={currentTask.task as RescueTask} />
                )}
              </TaskCardContainer>
            )}
            {!!completedTasks.length &&
              completedTasks.map((task, idx) => (
                <TaskCardContainer key={idx}>
                  {task.version === "1.0" ? (
                    <TaskCard task={task.task as RescueTaskV1} />
                  ) : (
                    <TaskCardV0_1 task={task.task as RescueTask} />
                  )}
                </TaskCardContainer>
              ))}
          </TaskCardsBox>
        </>
      ) : null}
    </Container>
  );
};

export default FormPreSection;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 60px;
  @media screen and (max-width: 768px) {
    gap: 40px;
  }
`;

const HeaderSection = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  // &::before {
  //   content: "";
  //   position: absolute;
  //   bottom: -1px;
  //   left: 0;
  //   width: 100%;
  //   height: 20px;
  //   background-image: url(/rescue-bg-bottom.png);
  //   background-size: cover;
  //   background-position: bottom;
  //   background-repeat: no-repeat;
  // }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;
  width: 100%;
  @media screen and (max-width: 768px) {
    padding-top: 100px;
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

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const StartButton = styled.button`
  display: flex;
  width: 100%;
  max-width: 600px;
  height: 50px;
  padding: 12.333px;
  align-items: center;
  justify-content: center;
  gap: 12.333px;
  flex-shrink: 0;
  border-radius: 100px;
  background: #fff;

  color: #feb602;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%; /* 16px */
  letter-spacing: 0.16px;

  > svg {
    width: 20px;
    height: 20px;
  }

  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
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
