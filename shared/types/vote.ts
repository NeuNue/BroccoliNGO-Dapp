export type VoteItem = {
  id: number;
  nftId: number;
  address: string;
  sign: string;
  result: number;
  balance: number;
  created_at: string;
};

export type VoteResult = {
  0: number;
  1: number;
};
