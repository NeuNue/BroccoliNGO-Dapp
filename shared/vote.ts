export const getVoteSignatureMessage = (tokenId: string, result: boolean) => {
  return `Please sign this message to vote on the task with ID ${tokenId} and result ${result}.`;
}