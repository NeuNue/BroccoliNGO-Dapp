import styled from "@emotion/styled";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Avatar from "boring-avatars";
import DisconnectIcon from "@/components/icons/disconnect";
import { sliceAddress } from "@/shared/utils";

export const TaskNavbar = () => {
  return (
    <NavbarBox>
      <NavbarContainer>
        <NavbarAvatar src="/rescue-logo.png" alt="Logo" />
        <NavbarText>Broccoli.bnb</NavbarText>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === "authenticated");

            return (() => {
              if (!connected) {
                return (
                  <NavbarLoginButton onClick={openConnectModal}>
                    <span>Wallet Connect</span>
                  </NavbarLoginButton>
                );
              }

              if (chain.unsupported) {
                return (
                  <NavbarLoginButton onClick={openChainModal}>
                    <span>Wrong network</span>
                  </NavbarLoginButton>
                );
              }

              return (
                <NavbarProfileButton onClick={openAccountModal}>
                  <Avatar
                    className="wallet-avatar"
                    name={account.address}
                    variant="beam"
                  />
                  <WalletAddress>{sliceAddress(account.address)}</WalletAddress>
                  <DisconnectIcon />
                </NavbarProfileButton>
              );
            })();
          }}
        </ConnectButton.Custom>
      </NavbarContainer>
    </NavbarBox>
  );
};

const NavbarBox = styled.div`
  position: fixed;
  top: 20px;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  @media screen and (max-width: 768px) {
    padding: 0 20px;
  }
`;
const NavbarContainer = styled.div`
  pointer-events: auto;
  display: flex;
  width: 100%;
  max-width: 460px;
  height: 60px;
  padding: 0 10px;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  border-radius: 100px;
  border: 1px solid #322f2c;
  background: #4b4946;
  backdrop-filter: blur(7px);

  @media screen and (max-width: 768px) {
    max-width: 100%;
    height: 50px;
    padding: 0 6px;
  }
`;

const NavbarAvatar = styled.img`
  display: flex;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  object-fit: cover;
`;

const NavbarText = styled.b`
  margin-left: 8px;
  flex: 1;
  color: #fff;
  font-family: var(--font-darumadrop-one);
  font-size: 32px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 32px */
  letter-spacing: -0.64px;
  text-transform: uppercase;
  transform: translateY(-5px);

  @media screen and (max-width: 768px) {
    font-size: 24px;
  }
`;

const NavbarLoginButton = styled.button`
  display: flex;
  height: 40px;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  border-radius: 20px;
  background: #fbbc05;

  color: #fff;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  text-transform: capitalize;
  cursor: pointer;

  @media screen and (max-width: 768px) {
    width: auto;
    padding: 8px 12px;
    height: 32px;
    font-size: 12px;
  }
`;

const NavbarProfileButton = styled.button`
  display: flex;
  width: 137px;
  height: 40px;
  padding: 8px 12px 8px 8px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  border-radius: 20px;
  background: #322f2c;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;

  @media screen and (max-width: 768px) {
    width: auto;
    padding: 4px 8px 4px 8px;
    height: 32px;
  }

  .wallet-avatar {
    width: 20px;
    height: 20px;
    @media screen and (max-width: 768px) {
      width: 20px;
      height: 20px;
    }
  }

  > svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    @media screen and (max-width: 768px) {
      width: 14px;
      height: 14px;
    }
  }
`;

const WalletAddress = styled.span`
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  @media screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
