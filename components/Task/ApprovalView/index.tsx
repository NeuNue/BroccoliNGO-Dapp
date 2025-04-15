import { approveTask, fetchFundRecords } from "@/shared/api";
import { FC, useEffect, useMemo, useState } from "react";
import { usePublicClient } from "wagmi";
import {
  CardContainer,
  CardTitle,
  CardTitleTip,
  SubmitButton,
} from "@/components/Task/Layout";
import styled from "@emotion/styled";
import { useTaskDetailsCtx } from "@/hooks/useTaskDetails";
import { toaster } from "@/components/ui/toaster";
import { formatDate, getISODateTimestamp } from "@/shared/utils";
import { useGlobalCtx } from "@/hooks/useGlobal";
import { useI18n } from "@/components/ui/I18nProvider";

const padToTwoDigits = (num: string | number): string => {
  return String(num).padStart(2, "0");
};

interface Props {
  tokenId: string;
}
export const ApprovalView: FC<Props> = ({ tokenId }) => {
  const { getString } = useI18n();
  const { profile } = useGlobalCtx();
  const {
    task,
    loading,
    taskMetaData,
    isApproved,
    error,
    voteResult,
    taskStatus,
    isVoteEnded,
    voteFinalResult,
  } = useTaskDetailsCtx();

  const publicClient = usePublicClient();
  const [isApprovedLoading, setIsApprovedLoading] = useState(false);

  const currentDate = useMemo(() => {
    const date = new Date();
    return {
      year: date.getFullYear().toString(),
      month: (date.getMonth() + 1).toString(),
      day: date.getDate().toString(),
      hour: date.getHours().toString(),
      minute: date.getMinutes().toString(),
    };
  }, []);

  const nextThreeDays = useMemo(() => {
    const date = new Date();
    const threeDaysLater = new Date(date);
    threeDaysLater.setDate(date.getDate() + 3);
    return {
      year: threeDaysLater.getFullYear().toString(),
      month: (threeDaysLater.getMonth() + 1).toString(),
      day: threeDaysLater.getDate().toString(),
      hour: threeDaysLater.getHours().toString(),
      minute: threeDaysLater.getMinutes().toString(),
    };
  }, []);

  const [startDate, setStartDate] = useState<{
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
  }>({
    year: currentDate.year,
    month: currentDate.month,
    day: currentDate.day,
    hour: "00",
    minute: "00",
  });
  const [endDate, setEndDate] = useState<{
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
  }>({
    year: nextThreeDays.year,
    month: nextThreeDays.month,
    day: nextThreeDays.day,
    hour: "00",
    minute: "00",
  });

  const handleApproveTask = async () => {
    setIsApprovedLoading(true);
    // Format date parts correctly with padding
    const formattedStartDate = `${startDate.year}-${padToTwoDigits(
      startDate.month
    )}-${padToTwoDigits(startDate.day)}T${padToTwoDigits(
      startDate.hour
    )}:${padToTwoDigits(startDate.minute)}:00Z`; // Add Z for UTC

    const formattedEndDate = `${endDate.year}-${padToTwoDigits(
      endDate.month
    )}-${padToTwoDigits(endDate.day)}T${padToTwoDigits(
      endDate.hour
    )}:${padToTwoDigits(endDate.minute)}:00Z`; // Add Z for UTC

    console.log("-- formattedStartDate", formattedStartDate);
    // Validate dates before proceeding
    const startDateObj = new Date(formattedStartDate);
    const endDateObj = new Date(formattedEndDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      throw new Error("Invalid date format");
    }

    if (endDateObj <= startDateObj) {
      toaster.create({
        title: getString(_TL_("Invalid date range")),
        description: getString(_TL_("End date must be after start date")),
        type: "error",
      });
      return;
    }

    const startDateTimestamp = startDateObj.getTime();
    const endDateTimestamp = endDateObj.getTime();

    console.log("--- startDateTimestamp", startDateTimestamp);
    console.log("--- endDateTimestamp", endDateTimestamp);
    const res = await approveTask(
      tokenId,
      startDateTimestamp,
      endDateTimestamp
    );
    if (res.code === 0) {
      toaster.create({
        title: getString(_TL_("Task approved")),
        description: getString(_TL_("Task has been approved successfully.")),
        type: "success",
      });
    } else {
      toaster.create({
        title: getString(_TL_("Failed to approve task")),
        description: getString(_TL_("Please try again later.")),
        type: "error",
      });
    }
    setIsApprovedLoading(false);
    location.reload();
  };

  return (
    <CardContainer>
      <CardTitle>{getString(_TL_("Approval"))}</CardTitle>
      <StyledApprovalBox>
        {taskStatus === "Pending" ? (
          <>
            <StyledApprovalDate>
              <StyledApprovalDateItem>
                <StyledApprovalDateLabel>
                  Start Date(UTC):
                </StyledApprovalDateLabel>
                <StyledApprovalDateValue>
                  <StyledApprovalInput
                    type="number"
                    value={startDate.year}
                    placeholder="YYYY"
                    onChange={(e) => {
                      setStartDate((prev) => ({
                        ...prev,
                        year: e.target.value,
                      }));
                    }}
                  />
                  <span>/</span>
                  <StyledApprovalInput
                    type="number"
                    value={startDate.month}
                    placeholder="MM"
                    onChange={(e) => {
                      setStartDate((prev) => ({
                        ...prev,
                        month: e.target.value,
                      }));
                    }}
                  />
                  <span>/</span>
                  <StyledApprovalInput
                    type="number"
                    value={startDate.day}
                    placeholder="DD"
                    onChange={(e) => {
                      setStartDate((prev) => ({
                        ...prev,
                        day: e.target.value,
                      }));
                    }}
                  />
                  <span>-</span>
                  <StyledApprovalInput
                    type="number"
                    value={startDate.hour}
                    placeholder="HH"
                    onChange={(e) => {
                      setStartDate((prev) => ({
                        ...prev,
                        hour: e.target.value,
                      }));
                    }}
                  />
                  <span>/</span>
                  <StyledApprovalInput
                    type="number"
                    value={startDate.minute}
                    placeholder="mm"
                    onChange={(e) => {
                      setStartDate((prev) => ({
                        ...prev,
                        minute: e.target.value,
                      }));
                    }}
                  />
                </StyledApprovalDateValue>
              </StyledApprovalDateItem>
              <StyledApprovalDateItem>
                <StyledApprovalDateLabel>
                  End Date(UTC):
                </StyledApprovalDateLabel>
                <StyledApprovalDateValue>
                  <StyledApprovalInput
                    type="number"
                    value={endDate.year}
                    placeholder="YYYY"
                    onChange={(e) => {
                      setEndDate((prev) => ({
                        ...prev,
                        year: e.target.value,
                      }));
                    }}
                  />
                  <span>/</span>
                  <StyledApprovalInput
                    type="number"
                    value={endDate.month}
                    placeholder="MM"
                    onChange={(e) => {
                      setEndDate((prev) => ({
                        ...prev,
                        month: e.target.value,
                      }));
                    }}
                  />
                  <span>/</span>
                  <StyledApprovalInput
                    type="number"
                    value={endDate.day}
                    placeholder="DD"
                    onChange={(e) => {
                      setEndDate((prev) => ({
                        ...prev,
                        day: e.target.value,
                      }));
                    }}
                  />
                  <span>-</span>
                  <StyledApprovalInput
                    type="number"
                    value={endDate.hour}
                    placeholder="HH"
                    onChange={(e) => {
                      setEndDate((prev) => ({
                        ...prev,
                        hour: e.target.value,
                      }));
                    }}
                  />
                  <span>/</span>
                  <StyledApprovalInput
                    type="number"
                    value={endDate.minute}
                    placeholder="mm"
                    onChange={(e) => {
                      setEndDate((prev) => ({
                        ...prev,
                        minute: e.target.value,
                      }));
                    }}
                  />
                </StyledApprovalDateValue>
              </StyledApprovalDateItem>
            </StyledApprovalDate>
            {!task?.isVoteEnabled && profile?.admin ? (
              <SubmitButton
                loading={isApprovedLoading}
                disabled={isApprovedLoading}
                onClick={handleApproveTask}
              >
                {getString(_TL_("Start Vote"))}
              </SubmitButton>
            ) : null}
          </>
        ) : (
          <StyledApprovalDate>
            <StyledApprovalDateItem>
              <StyledApprovalDateLabel>Start Date:</StyledApprovalDateLabel>
              <StyledApprovalDateValue>
                {formatDate(task?.vote_start_date)}
              </StyledApprovalDateValue>
            </StyledApprovalDateItem>
            <StyledApprovalDateItem>
              <StyledApprovalDateLabel>End Date:</StyledApprovalDateLabel>
              <StyledApprovalDateValue>
                {formatDate(task?.vote_end_date)}
              </StyledApprovalDateValue>
            </StyledApprovalDateItem>
          </StyledApprovalDate>
        )}
      </StyledApprovalBox>
    </CardContainer>
  );
};

const StyledApprovalBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 24px;
  width: 100%;
`;

const StyledApprovalDate = styled.div`
  width: 100%;
`;

const StyledApprovalDateItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StyledApprovalDateLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  width: 100px;
`;

const StyledApprovalDateValue = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const StyledApprovalInput = styled.input`
  width: 80px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
