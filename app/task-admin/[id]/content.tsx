"use client";

import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import React from "react";
import { FundRecordsView } from "@/components/Task/FundRecordsView";
import { ProofView } from "@/components/Task/ProofView";
import { DatasView } from "@/components/Task/DatasView";
import { ApprovalView } from "@/components/Task/ApprovalView";
import XIcon from "@/components/icons/x";
import { useTaskDetailsCtx } from "@/hooks/useTaskDetails";
import { VotesView } from "@/components/Task/VotesView";
import { Spinner } from "@chakra-ui/react";

export default function TaskDetailPage({ id }: { id: string }) {
  const { task, profile, xAuthLink, taskStatus, loading, error, isApproved } =
    useTaskDetailsCtx();
  const router = useRouter();

  if (loading) {
    return (
      <Container className="flex flex-col items-center justify-center min-h-screen">
        <Spinner />
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">{error || "Task not found"}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-500 hover:underline"
        >
          Go Back
        </button>
      </Container>
    );
  }

  return (
    <Container>
      <DatasView />

      <XAccountInputContainer>
        {profile ? (
          <ProfileButton>
            <a href={`https://x.com/${profile.handle}`} target="_blank">
              <XIcon />
              <span>@{profile.handle}</span>
            </a>
          </ProfileButton>
        ) : (
          <ConnectXButton>
            <a href={xAuthLink}>
              <span>login: 𝕏</span>
            </a>
          </ConnectXButton>
        )}
      </XAccountInputContainer>

      <ApprovalView tokenId={id} />

      {task?.isVoteEnabled && <VotesView admin tokenId={id} />}

      {taskStatus === "Approved" && <FundRecordsView admin tokenId={id} />}

      {taskStatus === "Approved" && <ProofView tokenId={id} />}
    </Container>
  );
}

const Container = styled.div`
  padding-top: 100px;
  padding-bottom: 60px;
  max-width: 720px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  gap: 20px;
  @media screen and (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const XAccountInputContainer = styled.div`
  width: 100%;
  height: 50px;
`;

const ConnectXButton = styled.button`
  width: 100%;
  height: 100%;

  border-radius: 12px;
  border: 1px solid;

  border-color: #fbbc05;
  background-color: #fff;

  position: relative;
  color: #fbbc05;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.32px;

  > a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    align-self: stretch;
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: inherit;
  }

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    border-color: #fbbc05;
  }
`;

const ProfileButton = styled.button`
  width: 100%;
  height: 100%;

  border-radius: 8px;

  border-radius: 12px;
  border: 1px solid;

  border-color: #ccc;
  background-color: #fff;

  position: relative;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.32px;
  svg {
    width: 14px;
    height: 14px;
    color: #ccc;
  }
  > a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    align-self: stretch;
    width: 100%;
    height: 100%;
    text-decoration: none;
  }
  &:hover {
    border-color: #fbbc05;
    svg {
      color: #fbbc05;
    }
  }
`;
