export enum ABI {
  TRANSFER_EVENT = 'event Transfer(address indexed from, address indexed to, uint256 amount)',
  APPROVAL_EVENT = 'event Approval(address indexed from, address indexed to, uint256 amount)',
  APPROVAL_FOR_ALL_EVENT = 'event ApprovalForAll(address indexed from, address indexed to, bool isApproval)',
  PUNK_OFFERED_EVENT = 'event PunkOffered(uint256, uint256, address)',
  PUNK_TRANSFER_EVENT = 'event PunkTransfer(address, address, uint256)',
}
