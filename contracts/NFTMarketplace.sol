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

    //  Resell function: allows owners to resell their purchased NFT on MarketPlace
    function resellToken (uint256 tokenId, uint256 price) public payable {
        require(idToMarketItem[tokenId].owner == msg.sender, "Only Owner can resell this item");
        require(msg.value == listingPrice, "price must equal listing price");
        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));
        _itemsSold.decrement();

        
        _transfer(msg.sender, address(this), tokenId);
    }

    // Sale: Transfer Ownership of the 721token along with the funds
    function createMarketSale (
        uint256 tokenId
    ) public payable {
        uint price = idToMarketItem[tokenId].price;
        address seller = idToMarketItem[tokenId].seller;

        require(msg.value == price, "Please submit the asking price to complete the purchase");
        
        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));
        
        _itemsSold.increment();
        _transfer(address(this), msg.sender, tokenId);

        //transfer listing price to new owner
        payable(owner).transfer(listingPrice);
        payable(seller).transfer(msg.value);
    }

    
    // return: unsold items
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _tokenIds.current();
        uint unsoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint i =0; i < itemCount; i++) {
            if (idToMarketItem[i+1].owner == address(this)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }
        return items;
    }


    // Show the users purchased NFTs
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount =0;
        uint currentIndex =0;

        for(uint i=0; i < totalItemCount; i++){
            if (idToMarketItem[i+1].owner == msg.sender) {
                itemCount += 1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i=0; i < totalItemCount; i++) {
            if (idToMarketItem[i+1].owner ==msg.sender){
                uint currentId =i +i;
            MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    //show items each user has listed
    function fetchItemsListed() public view returns (MarketItem[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      
      return items;
    }
}
       