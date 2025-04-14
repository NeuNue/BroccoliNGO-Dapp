export interface Task {
  id: string;
  URI: string;
  txHash: string;
  nftId: string;
  title: string;
  desc: string;
  image: string;
  created_at: string;
  updatedAt: string;
  location?: string;
  socialLink?: string;
  helpPics?: string[];
  address?: string;
  status: number;
  isVoteEnabled: boolean;
  isVoteEnded: boolean;
  voteLeftTime: number;
  vote_start_date: number;
  vote_end_date: number;
  isAuthor: boolean;
  email: string;
}