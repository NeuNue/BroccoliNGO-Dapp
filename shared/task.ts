import { HelpRequest2, NFTMetaData2 } from "./types/help";
import { HelpRequest, NFTMetaData } from "./types/rescue";

export const requestToNFTMetadata = (request: HelpRequest) => {
  return {
    name: `Broccoli Act for ${request.organization.name}`,
    description: request.request.assistanceRequired,
    image: "https://arweave.net/YFTeWRwYu0Ax1Fm354VJIjBU2heP0l5cEXTf7zyoGyA",
    attributes: [
      {
        trait_type: "version",
        value: request.v,
      },
      {
        trait_type: "organization",
        value: request.organization.name,
      },
      {
        trait_type: "email",
        value: request.organization.contact.email,
      },
      {
        trait_type: "twitter",
        value: request.organization.contact.twitter,
      },
      {
        trait_type: "link",
        value: request.request.helpPostLink,
      },
      {
        trait_type: "location",
        value: request.request.location,
      },
      {
        trait_type: "costAmount",
        value: request.request.costEstimate.totalAmount,
      },
      {
        trait_type: "budgetPlan",
        value: request.request.costEstimate.budgetPlan,
      },
      {
        trait_type: "costBreakdown",
        value: request.request.costEstimate.breakdown,
      },
      {
        trait_type: "impactAfterAssistance",
        value: request.request.impactAfterAssistance,
      },
      {
        trait_type: "canProvideInvoice",
        value: request.request.canProvideInvoice,
      },
      {
        trait_type: "canProvidePublicThankYouLetter",
        value: request.request.canProvidePublicThankYouLetter,
      },
    ],
  } as NFTMetaData;
};

export const nftMetaDataToHelpRequest = (nftMetaData: NFTMetaData) => {
  return {
    v: nftMetaData.attributes.find((attr) => attr.trait_type === "version")
      ?.value,
    organization: {
      name: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "organization"
      )?.value,
      contact: {
        email: nftMetaData.attributes.find(
          (attr) => attr.trait_type === "email"
        )?.value,
        twitter: nftMetaData.attributes.find(
          (attr) => attr.trait_type === "twitter"
        )?.value,
      },
    },
    request: {
      helpPostLink: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "link"
      )?.value,
      assistanceRequired: nftMetaData.description,
      location: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "location"
      )?.value,
      costEstimate: {
        totalAmount: nftMetaData.attributes.find(
          (attr) => attr.trait_type === "costAmount"
        )?.value,
        budgetPlan: nftMetaData.attributes.find(
          (attr) => attr.trait_type === "budgetPlan"
        )?.value,
        breakdown: nftMetaData.attributes.find(
          (attr) => attr.trait_type === "costBreakdown"
        )?.value,
      },
      impactAfterAssistance: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "impactAfterAssistance"
      )?.value,
      canProvideInvoice: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "canProvideInvoice"
      )?.value,
      canProvidePublicThankYouLetter: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "canProvidePublicThankYouLetter"
      )?.value,
    },
  } as HelpRequest;
};

export const requestToNFTMetadata2 = (request: HelpRequest2) => {
  return {
    name: `Broccoli Act for Human`,
    // description: request.request.assistanceRequired,
    description: `Broccoli Act for ${request.request.address}`,
    image: "https://arweave.net/YFTeWRwYu0Ax1Fm354VJIjBU2heP0l5cEXTf7zyoGyA",
    attributes: [
      {
        trait_type: "version",
        value: request.v,
      },
      {
        trait_type: "address",
        value: request.request.address,
      },
      {
        trait_type: "email",
        value: request.organization.contact.email,
      },
      {
        trait_type: "twitter",
        value: request.organization.contact.twitter,
      },
      // {
      //   trait_type: "link",
      //   value: request.request.helpPostLink,
      // },
      {
        trait_type: "location",
        value: request.request.location,
      },
      // {
      //   trait_type: "costAmount",
      //   value: request.request.costEstimate.totalAmount,
      // },
      {
        trait_type: "budgetPlan",
        value: request.request.costEstimate.budgetPlan,
      },
      // {
      //   trait_type: "costBreakdown",
      //   value: request.request.costEstimate.breakdown,
      // },
      // {
      //   trait_type: "impactAfterAssistance",
      //   value: request.request.impactAfterAssistance,
      // },
      {
        trait_type: "canProvideInvoice",
        value: request.request.canProvideInvoice,
      },
      {
        trait_type: "canProvidePublicThankYouLetter",
        value: request.request.canProvidePublicThankYouLetter,
      },
    ],
  } as NFTMetaData2;
};

export const nftMetaDataToHelpRequest2 = (nftMetaData: NFTMetaData2) => {
  return {
    v: nftMetaData.attributes.find((attr) => attr.trait_type === "version")
      ?.value,
    organization: {
      // name: nftMetaData.attributes.find((attr) => attr.trait_type === "organization")?.value,
      contact: {
        email: nftMetaData.attributes.find(
          (attr) => attr.trait_type === "email"
        )?.value,
        twitter: nftMetaData.attributes.find(
          (attr) => attr.trait_type === "twitter"
        )?.value,
      },
    },
    request: {
      address: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "address"
      )?.value,
      // helpPostLink: nftMetaData.attributes.find((attr) => attr.trait_type === "link")?.value,
      // assistanceRequired: nftMetaData.description,
      location: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "location"
      )?.value,
      costEstimate: {
        // totalAmount: nftMetaData.attributes.find((attr) => attr.trait_type === "costAmount")?.value,
        budgetPlan: nftMetaData.attributes.find(
          (attr) => attr.trait_type === "budgetPlan"
        )?.value,
        // breakdown: nftMetaData.attributes.find((attr) => attr.trait_type === "costBreakdown")?.value,
      },
      // impactAfterAssistance: nftMetaData.attributes.find((attr) => attr.trait_type === "impactAfterAssistance")?.value,
      canProvideInvoice: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "canProvideInvoice"
      )?.value,
      canProvidePublicThankYouLetter: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "canProvidePublicThankYouLetter"
      )?.value,
    },
  } as HelpRequest2;
};

export type VoteOnchainMetadata = {
  v: string;
  type: "vote";
  metadata: {
    tokenId: string;
    yes: number;
    no: number;
    list: {
      address: string;
      signature: string;
      result: number;
      tickets: number;
      time: string;
    }[];
  };
};

export const checkIsVoteOnchainMetadata = (data: any) => {
  if (data.type === "vote") {
    return true;
  }
  return false;
};

type VoteOnchainMetadataParams = {
  yes: number;
  no: number;
  tokenId: string;
  startDate: string;
  endDate: string;
  votes: {
    address: string;
    signature: string;
    result: number;
    tickets: number;
    time: string;
  }[];
};
export const formatToVoteOnchainMetadata = (
  params: VoteOnchainMetadataParams
) => {
  const { yes, no, startDate, endDate, tokenId, votes } = params;
  return {
    v: "1",
    type: "vote",
    metadata: {
      yes,
      no,
      tokenId,
      startDate,
      endDate,
      list: votes,
    },
  } as VoteOnchainMetadata;
};
