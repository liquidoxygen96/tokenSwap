//SPDX-Licence-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    //listing price in native token: unit is ether since EVM compatible 
    // chains have similar 18 decimal currency. 

    //fee on harmony can be programmed to be 0.05 $ONE
    uint256 listingPrice = 0.05 ether;
    address payable owner;

    //Fetch each MarketItem using the tokenId
    mapping(uint256 => MarketItem) private idToMarketItem;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }
    // event: create a market item - listening tool from front-end applications(graph or moralis)
    event MarketItemCreated (
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    constructor () ERC721("RUMZVERSE", "RUMZ"){
        owner = payable(msg.sender);
    }

    // Updating the listing price for the contract. ONLY OWNER
    function updateListingPrice(uint _listingPrice) public payable{
        require(owner == msg.sender, "Only marketplace owner can update the listing price!");
        listingPrice = _listingPrice;
    }

    //retrieve listing price for the marketplace; in $one
    function getListingPrice() public view returns(uint256) {
        return listingPrice;
    }


// mint token, returns newtokenID and lists in the 721tokenSwap
    function createToken(string memory tokenURI, uint256 price) public payable returns (uint){
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createMarketItem(newTokenId, price);
        return newTokenId;
    }

    //Create Market Item
    function createMarketItem(
        uint256 tokenId,
        uint256 price
    ) private {
        require(price > 0, "price must be at least 1 Wei");
        require(msg.value == listingPrice, "price must be equal to listing price");

        idToMarketItem[tokenId] = MarketItem(
            tokenId
            ,payable(msg.sender)
            ,payable(address(this))
            ,price
            ,false
        );

        _transfer(msg.sender, address(this), tokenId);
        //emit creation
        emit MarketItemCreated(
            tokenId
            ,msg.sender
            ,address(this)
            ,price
            ,false
        );
    }

    // Resell function on MarketPlace

    // Sale: Transfer Ownership of the 721token along with the funds

    // Show unsold items

    // Show the users purchased NFTs

    // Show the users LISTED NFTs and return items 
}