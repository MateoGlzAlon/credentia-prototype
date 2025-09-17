// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Credentia is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public institution = "Universidad de Leon";
    string public titleName = "Ingenieria Informatica";

    mapping(address => string) public allowedWallets;

    constructor() ERC721("Academic Title", "TIT") {
        allowedWallets[
            0xe4f1638f1E34dF36D0B3523b4402A89F1478f0B1
        ] = "Universidad de Leon";
    }

    function awardItem(
        address recipient,
        string memory metadataURI
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(recipient, newItemId);

        // Associate token with its metadata JSON
        _setTokenURI(newItemId, metadataURI);

        return newItemId;
    }
}
