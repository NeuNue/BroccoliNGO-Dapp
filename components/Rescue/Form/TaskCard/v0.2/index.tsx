import { HelpRequest } from "@/shared/types/rescue";
import { FC } from "react";
import ArweaveIcon from "@/components/icons/arweave";
import BscscanIcon from "@/components/icons/bscscan";
import NFTIcon from "@/components/icons/nft";
import { CONTRACT_ADDRESS } from "@/shared/constant";
import styled from "@emotion/styled";
import { formatDecimalNumber } from "@/shared/utils";
import Link from "next/link";

interface Props {
  task: {
    nftId: number;
    URI: string;
    approved: 0 | 1;
    metadata: HelpRequest;
    creatEventId: {
      hash: string;
    };
  };
}
const TaskCard: FC<Props> = ({ task }) => {
  const scanUrl = `https://bscscan.com/tx/${task.creatEventId.hash}`;
  const nftUrl = `https://bscscan.com/nft/${CONTRACT_ADDRESS}/${task.nftId}`;
  const xUrl = `https://x.com/${task.metadata.organization.contact.twitter}`;
  const emailUrl = `mailto:${task.metadata.organization.contact.email}`;
  const taskUrl = `/task/${task.nftId}`;

  const isHuman = task.metadata.v === "0.2";
  return (
    <TaskCardContainer>
      <TaskCardLeft>
        <NFTIcon />
      </TaskCardLeft>
      <TaskCardRight>
        <TaskCardRightTop>
          <Link href={taskUrl} target="_blank">
            <TokenId># {task.nftId}</TokenId>
          </Link>
          <Link href={taskUrl} target="_blank">
            <Name>{task.metadata.organization.name}</Name>
          </Link>
          <Contact>
            <a href={xUrl} target="_blank">
              <ContactItem>
                @{task.metadata.organization.contact.twitter}
              </ContactItem>
            </a>
            <a href={emailUrl} target="_blank">
              <ContactItem>
                {task.metadata.organization.contact.email}
              </ContactItem>
            </a>
          </Contact>
        </TaskCardRightTop>
        <TaskCardRightBottom>
          {isHuman ? null : (
            <FundAmount>
              $
              {formatDecimalNumber(
                task.metadata.request.costEstimate.totalAmount
              )}
            </FundAmount>
          )}
        </TaskCardRightBottom>
        <TaskCardLinks>
          <a
            key="arweave link"
            href={task.URI}
            target="_blank"
            onClick={(e) => {
              e.stopPropagation();
              // e.preventDefault();
            }}
          >
            <ArweaveIcon />
          </a>
          <a
            key="bscan link"
            href={scanUrl}
            target="_blank"
            onClick={(e) => {
              e.stopPropagation();
              // e.preventDefault();
            }}
          >
            <BscscanIcon />
          </a>
        </TaskCardLinks>
        <TaskStatus>
          {task.approved === 0 ? (
            <img alt="pending approval" src="/rescue-approval.png" />
          ) : (
            <img alt="approved" src="/rescue-approved.png" />
          )}
        </TaskStatus>
      </TaskCardRight>
    </TaskCardContainer>
  );
};

export default TaskCard;

const TaskCardContainer = styled.div`
  height: 228px;
  border-radius: 20px;
  border: 4px solid #feb602;
  display: flex;
  overflow: hidden;
  @media screen and (max-width: 768px) {
    height: 148px;
  }
`;

const TaskCardLeft = styled.div`
  background-color: #feb602;
  height: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 34px;
  svg {
    width: 100%;
    height: 100%;
  }
  @media screen and (max-width: 768px) {
    width: 100px;
    height: 100%;
    padding: 0 16px;
    aspect-ratio: none;
  }
`;

const TaskCardRight = styled.div`
  flex: 1;
  position: relative;
  padding: 26px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media screen and (max-width: 768px) {
    padding: 12px;
  }
`;

const TaskCardRightTop = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
`;

const TokenId = styled.h3`
  color: #322f2c;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const Name = styled.h2`
  margin-top: 4px;
  color: #322f2c;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-overflow: ellipsis;
  overflow: hidden;
  @media screen and (max-width: 768px) {
    font-size: 20px;
  }
`;

const Contact = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ContactItem = styled.span`
  display: flex;
  height: 24px;
  padding: 0px 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 4px;
  background: #f9edcf;

  color: #feb602;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  @media screen and (max-width: 768px) {
    height: 20px;
    padding: 0px 6px;
    font-size: 11px;
  }
`;

const TaskCardRightBottom = styled.div`
  // padding-bottom: 24px;
`;

const FundAmount = styled.b`
  color: #feb602;
  font-size: 38px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  letter-spacing: -0.76px;
  @media screen and (max-width: 768px) {
    font-size: 24px;
    letter-spacing: -0.48px;
  }
`;

const TaskCardLinks = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  gap: 16px;
  z-index: 9;
  @media screen and (max-width: 768px) {
    gap: 10px;
    top: 10px;
    right: 10px;
  }
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 24px;
      height: 24px;
      @media screen and (max-width: 768px) {
        width: 18px;
        height: 18px;
      }
    }
  }
`;

const TaskStatus = styled.div`
  position: absolute;
  bottom: -10px;
  right: 0;
  pointer-events: none;
  z-index: 2;
  @media screen and (max-width: 768px) {
    bottom: -10px;
    right: 0;
  }
  img {
    width: auto;
    height: 130px;
    @media screen and (max-width: 768px) {
      height: 80px;
    }
  }
`;
