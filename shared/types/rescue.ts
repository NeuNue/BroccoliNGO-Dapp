export type RescueTask = OriginRescueTask & {
  metadata: NFTMetaData;
  _parsedMetadata: HelpRequest;
};

export type OriginRescueTask = {
  URI: string;
  address: string | null;
  approved: number;
  creatEventId: {
    hash: string;
  };
  hash: string;
  id: number;
  helpPics: string;
  nftId: number;
  status: number;
  xHandle: string;
}
interface Contact {
  email: string;
  twitter: string;
}

interface CostBreakdownItem {
  item: string;
  amount: number;
}

interface CostEstimate {
  totalAmount: number;
  budgetPlan: string;
  breakdown: CostBreakdownItem[];
}

export interface Request {
  helpPostLink: string;
  assistanceRequired: string;
  location: string;
  costEstimate: CostEstimate;
  canProvideInvoice: boolean;
  canProvidePublicThankYouLetter: boolean;
  impactAfterAssistance: string;
}

export interface Organization {
  name: string;
  contact: Contact;
}

export interface HelpRequest {
  v: string;
  organization: Organization;
  request: Request;
}

export interface NFTMetaData {
  name: string;
  image: string;
  description: string;
  attributes: [
    {
      trait_type: "version";
      value: string;
    },
    {
      trait_type: "organization";
      value: string;
    },
    {
      trait_type: "email";
      value: string;
    },
    {
      trait_type: "twitter";
      value: string;
    },
    {
      trait_type: "link";
      value: string;
    },
    {
      trait_type: "location";
      value: string;
    },
    {
      trait_type: "costAmount";
      value: string | number;
    },
    {
      trait_type: "budgetPlan";
      value: string;
    },
    {
      trait_type: "costBreakdown";
      value: CostBreakdownItem[];
    },
    {
      trait_type: "impactAfterAssistance";
      value: string;
    },
    {
      trait_type: "canProvideInvoice";
      value: boolean;
    },
    {
      trait_type: "canProvidePublicThankYouLetter";
      value: boolean;
    }
  ];
}

// v2

export interface ContactForm {
  organization: string;
  email: string;
  country: string;
  city: string;
  address?: string;
}

export interface BackgroundForm {
  context: string;
  attachment: string;
}

export interface RequestForm {
  suppliesRequest: string;
  additionalInfo: string;
  canProvideInvoices: boolean;
  canProvidePublicAcknowledgments: boolean;
}

export interface OrganizationV2 {
  name: string;
  contact: ContactForm;
}

export interface RescueRequest {
  v: string;
  contact: ContactForm;
  background: BackgroundForm;
  request: RequestForm;
}

export interface RescueNFTMetaData {
  name: string;
  image: string;
  description: string; // This is the context of the request
  attributes: [
    {
      trait_type: "version";
      value: string;
    },
    {
      trait_type: "organization";
      value: string;
    },
    {
      trait_type: "email";
      value: string;
    },
    {
      trait_type: "location";
      value: string;
    },
    {
      trait_type: "attachment"; // All attachments are saved to an IPFS URL
      value: string;
    },
    {
      trait_type: "suppliesRequest";
      value: string;
    },
    {
      trait_type: "additionalInfo";
      value: string;
    },
    {
      trait_type: "canProvideInvoices";
      value: boolean;
    },
    {
      trait_type: "canProvidePublicAcknowledgments";
      value: boolean;
    }
  ];
}

export type RescueTaskV1 = OriginRescueTask & {
  metadata: RescueNFTMetaData;
  _parsedMetadata: RescueRequest;
}
