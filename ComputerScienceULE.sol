// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Credentia is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public institution = "Universidad de Leon";
    string public titleName = "Ingenieria Informatica";

    struct Metadata {
        string studentName;
        string startDate;
        string endDate;
        string description;
        string image;
        uint256 grade;
    }

    mapping(uint256 => Metadata) private _tokenMetadata;
    mapping(string => string) allowedWallets;

    constructor() ERC721(titleName + "-" + institution, "TIT") {
        allowedWallets[
            "0xe4f1638f1E34dF36D0B3523b4402A89F1478f0B1"
        ] = "Universidad de Leon";
    }

    function awardItem(
        address recipient,
        string memory studentName,
        string memory startDate,
        string memory endDate,
        string memory description,
        string memory image,
        uint256 grade
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(recipient, newItemId);

        // Guardamos los datos dentro del contrato
        _tokenMetadata[newItemId] = Metadata(
            studentName,
            startDate,
            endDate,
            description,
            image,
            grade
        );

        return newItemId;
    }

    function getMetadata(
        uint256 tokenId
    ) public view returns (Metadata memory) {
        require(
            tokenId > 0 && tokenId <= _tokenIds.current(),
            "Token does not exist"
        );
        return _tokenMetadata[tokenId];
    }
}
