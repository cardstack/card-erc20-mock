// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract MockCardToken is ERC20PresetMinterPauser {
  constructor(string memory name, string memory symbol)
    ERC20PresetMinterPauser(name, symbol)
  {} // solhint-disable-line no-empty-blocks

  function approve(address spender, uint256 amount)
    public
    virtual
    override
    returns (bool)
  {
    address owner = _msgSender();
    require(
      amount == 0 || allowance(owner, spender) == 0,
      "Allowance already set"
    );

    _approve(owner, spender, amount);
    return true;
  }

  function increaseApproval(address spender, uint256 addedValue)
    public
    virtual
    returns (bool)
  {
    address owner = _msgSender();
    _approve(owner, spender, allowance(owner, spender) + addedValue);
    return true;
  }

  function decreaseApproval(address spender, uint256 subtractedValue)
    public
    virtual
    returns (bool)
  {
    address owner = _msgSender();
    uint256 currentAllowance = allowance(owner, spender);
    require(
      currentAllowance >= subtractedValue,
      "ERC20: decreased allowance below zero"
    );
    unchecked {
      _approve(owner, spender, currentAllowance - subtractedValue);
    }

    return true;
  }

  // These are inherited from the OZ contract and are similar enough to the ones in the CARD token
  // to cause confusion - revert instead of confusingly working on testnet
  function increaseAllowance(address, uint256)
    public
    pure
    override
    returns (bool)
  {
    revert("Not supported");
  }

  function decreaseAllowance(address, uint256)
    public
    pure
    override
    returns (bool)
  {
    revert("Not supported");
  }
}
