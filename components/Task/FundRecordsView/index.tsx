import { addFundRecord, fetchFundRecords, uploadJson } from "@/shared/api";
import { Clipboard, Textarea } from "@chakra-ui/react";
import Link from "next/link";
import { FC, useEffect, useMemo, useState } from "react";
import { usePublicClient } from "wagmi";
import {
  CardContainer,
  CardTitle,
  CardTitleTip,
  SubmitButton,
} from "@/components/Task/Layout";
import styled from "@emotion/styled";
import CopyIcon from "@/components/icons/copy";
import { toaster } from "@/components/ui/toaster";
import { useTaskDetailsCtx } from "@/hooks/useTaskDetails";
import { checkIsVoteOnchainMetadata, VoteOnchainMetadata } from "@/shared/task";

interface Props {
  tokenId: string;
  admin?: boolean;
}
export const FundRecordsView: FC<Props> = ({ tokenId, admin }) => {
  const { profile, uploadedFundRecords, parsedFundRecords } =
    useTaskDetailsCtx();
  const publicClient = usePublicClient();

  const [isFundRecordsUploading, setIsFundRecordsUploading] = useState(false);
  const [isFundRecordsSubmitting, setIsFundRecordsSubmitting] = useState(false);
  const [fundRecords, setFundRecords] = useState<string>("");

  const isFundRecordsDisabled =
    isFundRecordsUploading || isFundRecordsSubmitting;

  const handleUploadFundRecords = async () => {
    if (isFundRecordsDisabled) return;
    setIsFundRecordsSubmitting(true);

    try {
      const txs = fundRecords.split("\n");
      setIsFundRecordsUploading(true);
      const ipfsRes = await uploadJson(txs);
      setIsFundRecordsUploading(false);

      const ipfsLink = ipfsRes?.data?.url;

      if (!ipfsLink) {
        toaster.create({
          title: "Failed to upload FundRecord",
          description: "Please try again later.",
          type: "error",
        });
        return;
      }

      const res = await addFundRecord(tokenId, ipfsLink);

      if (res.code !== 0) {
        toaster.create({
          title: "Failed to upload FundRecord",
          description: "Please try again later.",
          type: "error",
        });
        return;
      }
      toaster.create({
        title: "Fund Records uploaded",
        description: "Fund records has been uploaded successfully.",
        type: "success",
      });
    } catch (e) {
    } finally {
      setIsFundRecordsSubmitting(false);
      setIsFundRecordsUploading(false);
    }
  };

  const uploadedFundRecordsDataList = useMemo(() => {
    if (!parsedFundRecords.length) return [];
    return parsedFundRecords.map((record, idx) => {
      return {
        label: `Fund Record ${idx + 1}:`,
        key: "fund_record" + idx,
        value: record,
      };
    });
  }, [parsedFundRecords]);

  return (
    <CardContainer>
      <CardTitle>Fund Records</CardTitle>
      <StyledDataList>
        {uploadedFundRecordsDataList.map((item, idx) => {
          return (
            <StyledDataListItem key={idx}>
              <StyledDataListText>
                <Link href={item.value} target="_blank">
                  {item.value}
                </Link>
              </StyledDataListText>
              <StyledDataListItemDivider />
              <Clipboard.Root
                value={item.value}
                // onStatusChange={() => {
                //   console.log("copied", item.value);
                // }}
              >
                <Clipboard.Trigger asChild>
                  {/* <CopyIcon className="copy-icon" /> */}
                  <Clipboard.Indicator className="copy-icon" />
                </Clipboard.Trigger>
              </Clipboard.Root>
            </StyledDataListItem>
          );
        })}
      </StyledDataList>
      {admin && profile?.admin ? (
        <>
          <Textarea
            mt="4"
            placeholder="Enter fund records, one record per line."
            value={fundRecords}
            autoresize
            onChange={(e) => {
              setFundRecords(e.target.value);
            }}
          />
          <SubmitButton
            mt="4"
            variant="solid"
            colorPalette="orange"
            onClick={handleUploadFundRecords}
            loading={isFundRecordsUploading || isFundRecordsSubmitting}
            disabled={isFundRecordsDisabled}
          >
            Upload Records
          </SubmitButton>
        </>
      ) : null}
    </CardContainer>
  );
};

const StyledDataList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const StyledDataListItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px 0;
  overflow: hidden;
  color: #322f2c;
  text-overflow: ellipsis;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 22.4px */
  letter-spacing: 0.14px;

  .copy-icon {
    width: 16px;
    height: 16px;
    color: #322f2c4d;
    cursor: pointer;
    &:hover {
      color: #322f2c;
    }
  }
`;

const StyledDataListText = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledDataListItemDivider = styled.div`
  width: 1px;
  height: 12px;
  background: rgba(50, 47, 44, 0.1);
`;
