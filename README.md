# Mock CARD Token

This is a token that behaves like the [CARD token](https://etherscan.io/token/0x954b890704693af242613edef1b603825afcd708)

It is a standard ERC20 the following changes:

1. When calling `approve` with a non-zero amount, the contract will revert if an existing approval is set, to prevent transaction-ordering attacks
2. It has the increaseApproval and decreaseApproval methods to change an existing approval.