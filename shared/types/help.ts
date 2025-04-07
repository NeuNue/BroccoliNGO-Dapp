interface Contact {
  email: string;
  twitter: string;
}

interface CostBreakdownItem {
  item: string;
  amount: number;
}

interface CostEstimate {
  // totalAmount: number;
  budgetPlan: string;
  // breakdown: CostBreakdownItem[];
}

export interface Request {
  // helpPostLink: string;
  // assistanceRequired: string;
  address: string;
  location: string;
  costEstimate: CostEstimate;
  canProvideInvoice: boolean;
  canProvidePublicThankYouLetter: boolean;
  // impactAfterAssistance: string;
}

export interface Organization {
  // name: string;
  contact: Contact;
}

export interface HelpRequest2 {
  v: string;
  organization: Organization;
  request: Request;
}

export interface NFTMetaData2 {
  name: string;
  image: string;
  description: string;
  attributes: [
    {
      trait_type: "version";
      value: string;
    },
    {
      trait_type: "address";
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
    // {
    //   trait_type: "link";
    //   value: string;
    // },
    {
      trait_type: "location";
      value: string;
    },
    // {
    //   trait_type: "costAmount";
    //   value: string | number;
    // },
    {
      trait_type: "budgetPlan";
      value: string;
    },
    // {
    //   trait_type: "costBreakdown";
    //   value: CostBreakdownItem[];
    // },
    // {
    //   trait_type: "impactAfterAssistance";
    //   value: string;
    // },
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