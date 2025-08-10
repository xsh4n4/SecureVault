// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TimeLockedWallet is Ownable {
    mapping(address => bool) public whitelistedAddresses;
    uint256 public unlockTimestamp;

    event FundsDeposited(address indexed sender, uint256 amount, uint256 timestamp);
    event FundsWithdrawn(address indexed recipient, uint256 amount, uint256 timestamp);
    event UnlockTimeExtended(uint256 oldTimestamp, uint256 newTimestamp);
    event AddressWhitelisted(address indexed account);

    constructor(uint256 _unlockTimestamp) {
        require(_unlockTimestamp > block.timestamp, "Unlock timestamp must be in the future");
        unlockTimestamp = _unlockTimestamp;
        whitelistedAddresses[msg.sender] = true; // Owner is whitelisted by default
    }

    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value, block.timestamp);
    }

    function withdraw() public {
        require(block.timestamp >= unlockTimestamp, "Funds are still locked");
        require(owner() == msg.sender || whitelistedAddresses[msg.sender], "Only owner or whitelisted addresses can withdraw");

        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "Withdrawal failed");

        emit FundsWithdrawn(msg.sender, balance, block.timestamp);
    }

    function extendUnlockTime(uint256 _newUnlockTimestamp) public onlyOwner {
        require(_newUnlockTimestamp > unlockTimestamp, "New unlock timestamp must be in the future and greater than current");
        emit UnlockTimeExtended(unlockTimestamp, _newUnlockTimestamp);
        unlockTimestamp = _newUnlockTimestamp;
    }

    function addToWhitelist(address _account) public onlyOwner {
        require(_account != address(0), "Cannot whitelist zero address");
        require(!whitelistedAddresses[_account], "Address is already whitelisted");
        whitelistedAddresses[_account] = true;
        emit AddressWhitelisted(_account);
    } 
}


