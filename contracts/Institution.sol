// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Institution is ERC721URIStorage {
    error NotOwner();

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(address => string) public allowedWallets;

    constructor(
        string memory name,
        string memory symbol,
        address rector,
        address secretaria
    ) ERC721(name, symbol) {
        allowedWallets[rector] = "Rector";
        allowedWallets[secretaria] = "Secretaria";
    }

    function awardItem(
        address recipient,
        string memory metadataURI
    ) public onlyAllowedWallets returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, metadataURI);

        return newItemId;
    }

    modifier onlyAllowedWallets() {
        string memory role = allowedWallets[msg.sender];
        if (
            keccak256(abi.encodePacked(role)) != keccak256(abi.encodePacked("Rector")) &&
            keccak256(abi.encodePacked(role)) != keccak256(abi.encodePacked("Secretaria"))
        ) {
            revert NotOwner();
        }
        _;
    }
}