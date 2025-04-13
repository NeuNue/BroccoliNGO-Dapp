import styled from "@emotion/styled";
import Link from "next/link";

import { Footer } from "@/components/Rescue/Form/Main/Layout";
import RightIcon from "@/components/icons/right";

interface Props {
  tokenId: string;
}

const Completed: React.FC<Props> = ({ tokenId }) => {
  return (
    <Container>
      <Main>
        <SuccessSymbol>
          <RightIcon />
        </SuccessSymbol>
        <Content>
          <Title>Request submitted</Title>
          <Description>
            <p>Thank you for your passion for animal rescue efforts.</p>
            <p>
              Broccoli is committed to leveraging blockchain technology and the
              cultural power of the meme community to bring more care and
              compassion to the world.
            </p>
            <p>
              Your application has been recorded at{" "}
              <Link href={`/task/${tokenId}`} target="_blank">
                broccoli.ngo/task/
                {tokenId}
              </Link>{" "}
              and will be reviewed by the community.
            </p>
            <p>
              You may visit this link at any time to check your progress.
              Broccoli team will keep you updated via E-mail. Please check your
              inbox (and spam folder) for our confirmation email.
            </p>
          </Description>
        </Content>
      </Main>
      <Footer>
        <CheckButtonLink href={`/task/${tokenId}`} target="_blank">
          <CheckButton>Check your Application</CheckButton>
        </CheckButtonLink>
      </Footer>
    </Container>
  );
};

export default Completed;

const Container = styled.div``;

const Main = styled.div`
  display: flex;
  padding: 80px 40px;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  align-self: stretch;
`;

const SuccessSymbol = styled.div`
  display: flex;
  height: 120px;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
  border-radius: 500px;
  background: #22b670;
  > svg {
    width: 60px;
    height: 60px;
    color: #fff;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  align-self: stretch;
`;

const Title = styled.h3`
  color: #322f2c;
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  text-transform: capitalize;
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #322f2c;
  text-align: justify;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 19.6px */
  a {
    color: #322f2c;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%;
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-skip-ink: none;
    text-decoration-thickness: auto;
    text-underline-offset: auto;
    text-underline-position: from-font;
  }
`;

const CheckButtonLink = styled(Link)`
  display: flex;
  width: 100%;
`;

const CheckButton = styled.button`
  display: flex;
  width: 100%;
  height: 50px;
  padding: 0px 16px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: #fbbc05;

  color: #fff;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%; /* 14px */
  letter-spacing: 0.14px;
`;
