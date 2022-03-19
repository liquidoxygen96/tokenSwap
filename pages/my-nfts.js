/**
 * Page for viewing the NFTs purchased by the User
 * NFT is retrieved using the fetchMyNFTs function in the solidity contract
 *
 * Main function: retrieve NFT owned by the User and render them on the "my-nfts page"
 */

import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";

import { marketplaceAddress } from "../config";

import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

export default function MyAssets() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();
  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const markeplaceContract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    const data = await marketplaceContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether/one");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          tokenURI,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  function listNFT(nft) {
    router.push("/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}");
  }
  if (loadingState === "loaded" && !nfts.length)
    return (<h1 className="py-10 px-20 text-3x1">No NFTs owned yet</h1>)
    return (
        <div className='flex justify-center'>
            <div className='p-4'>
                <div className='grid grid-cols-1 sm:grid-cols02 lg:grid-cols-4 gap-4 pt-4'>
                    {
                        nfts.map((nft,i)) => (
                            <div key={i} className='border shadow rounded-x1 overflow-hidden'>
                                <img src={nft.image} className='rounded'/>
                                <div className='p-4 bg-black'>
                                    <p className='text-2x1 font-bold text-white'>Price -{nft.price} ETHER</p>
                                    <button className='mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded' onClick={() => listNFT(nft)}>List</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
