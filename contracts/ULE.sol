// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Credentia is ERC721URIStorage {
    error NotOwner();

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(address => string) public allowedWallets;

    constructor() ERC721("Universidad de Leon", "ULE") {
        allowedWallets[
            0xe4f1638f1E34dF36D0B3523b4402A89F1478f0B1
        ] = "Rector";
        allowedWallets[
            0x3fD0842f6ccd38d57E5aDAbda61EeefBfB07e583
        ] = "Secretaria";
    }

    function awardItem(
        address recipient,
        string memory metadataURI
    ) public onlyAllowedWallets returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(recipient, newItemId);

        // Associate token with its metadata JSON
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
