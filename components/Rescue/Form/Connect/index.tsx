import { Profile } from "@/shared/types/profile";
import { FC } from "react";
import XIcon from "@/components/icons/x";
import styled from "@emotion/styled";

interface Props {
  profile: Profile | null;
  xAuthLink: string;
}

const FormConnect: FC<Props> = ({ profile, xAuthLink }) => {
  return (
    <Container>
      {xAuthLink ? (
        <ConnectLink href={xAuthLink} target="_blank">
          <Button>
            <XIcon />
            <span>Connect to start application</span>
          </Button>
        </ConnectLink>
      ) : (
        <ConnectLink href={`https://x.com/${profile?.handle}`} target="_blank">
          <ProfileButton>
            <img alt="x avatar" src={profile?.avatar} />
            <span>@{profile?.handle}</span>
          </ProfileButton>
        </ConnectLink>
      )}
    </Container>
  );
};

export default FormConnect;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const ConnectLink = styled.a`
  display: flex;
  width: 100%;
  text-decoration: none;
`;

const Button = styled.button`
  display: flex;
  width: 100%;
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
`;

const ProfileButton = styled.button`
  display: flex;
  width: 100%;
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
