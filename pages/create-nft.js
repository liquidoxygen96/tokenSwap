/**
 * Page for creating and listing NFTs
 * main functions of this page:
 * 1.upload and save files to IPFS
 * 2.mint the uploaded file as an NFT and list it for sale
 * 3. set asking price and add metadata to describe the NFT
 * After creating and listing an item for sale: re-route user to main page
 */

import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";

//create server for IPFS upload on infura.io
const client = ipfsHttpClient("https://ipfs.infura.io:5001");

import { marketplaceAddress } from "../config";

import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

export default function createItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  async function onChange(e) {
    // upload image to IPFS
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log("received: ${prog}"),
      });
      const url = "https://ipfs.infura.io/ipfs/${added.path}";
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  async function uploadToIPFS() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    //upload metadata to IPFS first
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = "https://ipfs.infura.io/ipfs/${added.path}";
      //return url after metadata has been uploaded to IPFS
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    //create NFT
    const price = ethers.utils.parseUnits(formInput.price, "ether");
    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    let transaction = await contract.createToken(url, price, {
      value: listingPrice,
    });
    await transaction.wait();

    router.push("/");
  }
}
