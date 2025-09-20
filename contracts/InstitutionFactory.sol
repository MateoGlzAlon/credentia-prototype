// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Institution.sol";

contract InstitutionFactory {
    address[] public allInstitutions;

    event InstitutionCreated(
        address indexed institutionAddress,
        string name,
        string symbol,
        address rector,
        address secretaria
    );

    function createInstitution(
        string memory name,
        string memory symbol,
        address rector,
        address secretaria
    ) external returns (address) {
        Institution institution = new Institution(
            name,
            symbol,
            rector,
            secretaria
        );
        allInstitutions.push(address(institution));

        emit InstitutionCreated(
            address(institution),
            name,
            symbol,
            rector,
            secretaria
        );

        return address(institution);
    }

    function getInstitutions() external view returns (address[] memory) {
        return allInstitutions;
    }
}
