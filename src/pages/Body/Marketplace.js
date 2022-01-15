/* eslint-disable jsx-a11y/alt-text */
import { ethers } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import ReactPlayer from "react-player";
import Head from "next/head";
import { Button } from "@material-ui/core";

import { nftmarketaddress, nftaddress } from "../../components/Address/config";

import NFT from "./artifacts/contracts/NFT.sol/NFT.json";
import Market from "./artifacts/contracts/NFTMarket.sol/NFTMarket.json";

import Modalmp from "./modal/modalmp";
const rpcEndpoint =
  "https://eth-rinkeby.alchemyapi.io/v2/avpSFE4CFF97rciebprxcggQd2cF18mJ";

export default function Marketplace() {
  const [nfts, setNfts] = useState([]);

  var lol = 1124908;
  let file_size;
  // showModal const
  const [showModal, setShowModal] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [Items, setItems] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);

  // modal openning
  const openModal = () => {
    setItems(null);
    setTxHash(null);
    console.log("modal openning");
    setShowModal((prev) => !prev);
  };
  async function loadNFTs() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          itemId: i.itemId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  async function buyNft(nft) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    openModal();
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.itemId,
      {
        value: price,
      }
    );
    setItems(nft.itemId);
    setTxHash(transaction.hash);
    await transaction.wait();
    loadNFTs();
    openModal();
  }

  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;
  return (
    <>
      <Head>
        <title>MarketPlace</title>
      </Head>

      <div className=" m-3 flex justify-center">
        <div className="px-4 max-h-80 " style={{ maxWidth: "1400" }}>
          <div className="">
            <div className="max-h-80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
              {nfts.map((nft, i) => (
                <div
                  key={i}
                  className="hover:-translate-y-4 transform transition max-h-full border shadow rounded-xl overflow-hidden"
                >
                  <img
                    src={nft.image}
                    style={{
                      cursor: "pointer",
                      height: "320px",
                      width: "350px",
                    }}
                  />
                  <div className="p-4 max-h-80">
                    <p
                      style={{ height: "40px" }}
                      className="text-2xl font-semibold"
                    >
                      {nft.name}
                    </p>
                    <div style={{ height: "40x", overflow: "hidden" }}>
                      <p className="text-gray-400  font-serif">
                        {nft.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row p-4 bg-black">
                    <p className="text-2xl  font-serif font-bold text-white">
                      Price - {nft.price}&nbsp;{" "}
                    </p>
                    <img
                      height="20px"
                      width="20px"
                      src="https://www.cryptologos.cc/logos/polygon-matic-logo.svg?v=014"
                    />
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    className="w-full bg-blue-500 text-white font-bold py-2 px-12 rounded"
                    onClick={() => {
                      buyNft(nft);
                    }}
                  >
                    Buy
                  </Button>
                </div>
              ))}
              <Modalmp
                showModal={showModal}
                setShowModal={setShowModal}
                txHash={txHash}
                setTxHash={setTxHash}
                Items={Items}
                setItems={setItems}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
