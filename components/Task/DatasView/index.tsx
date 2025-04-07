import { Container, DataList, Spinner } from "@chakra-ui/react";
import { FC, useEffect, useMemo, useState } from "react";
import { usePublicClient } from "wagmi";
import { flattenObject } from "@/shared/utils";
import { CardContainer, CardTitle } from "@/components/Task/Layout";
import { useTaskDetailsCtx } from "@/hooks/useTaskDetails";
import styled from "@emotion/styled";
import PendingIcon from "@/components/icons/pending";
import ApprovedIcon from "@/components/icons/approved";
import RejectedIcon from "@/components/icons/rejected";

interface DatasViewProps {}

export const DatasView: FC<DatasViewProps> = ({}) => {
  const {
    task,
    loading,
    taskMetaData,
    isApproved,
    error,
    voteResult,
    isVoteEnded,
    voteFinalResult,
    taskStatus,
  } = useTaskDetailsCtx();
  const publicClient = usePublicClient();

  const datalist = useMemo(() => {
    if (!taskMetaData) return [];
    return flattenObject(taskMetaData);
  }, [taskMetaData]);

  const TaskStatusIcon = useMemo(() => {
    if (taskStatus === "Pending") return <PendingIcon />;
    if (taskStatus === "Approved") return <ApprovedIcon />;
    if (taskStatus === "Rejected") return <RejectedIcon />;
    return null;
  }, [taskStatus]);

  return loading ? (
    <CardContainer>
      <Spinner />
    </CardContainer>
  ) : (
    <CardContainer head>
      <CardTitle>Task Details</CardTitle>
      <StyledTaskStatus>{TaskStatusIcon}</StyledTaskStatus>
      <StyledDataList>
        {datalist.map((item) => (
          <StyledDataListItem key={item.key}>
            <StyledDataListItemLabel>{item.label}</StyledDataListItemLabel>
            <StyledDataListItemValue>{item.value}</StyledDataListItemValue>
          </StyledDataListItem>
        ))}
      </StyledDataList>
    </CardContainer>
  );
};

const StyledTaskStatus = styled.div`
  position: absolute;
  top: 18px;
  right: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;
  > svg {
    height: 130px;
    @media screen and (max-width: 768px) {
      height: 100px;
    }
  }
`;

const StyledDataList = styled.dl`
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 1;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const StyledDataListItem = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(50, 47, 44, 0.05);
  &:last-child {
    border-bottom: none;
  }
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;
const StyledDataListItemLabel = styled.dt`
  width: 240px;
  padding: 12px 40px 12px 0;

  color: #322f2c;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 22.4px */
  letter-spacing: 0.14px;
  @media screen and (max-width: 768px) {
    width: 100%;
    font-size: 14px;
    font-weight: 700;
  }
`;
const StyledDataListItemValue = styled.dd`
  flex: 1;
  padding: 12px 0;

  color: #322f2c;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 22.4px */
  letter-spacing: 0.14px;
`;
