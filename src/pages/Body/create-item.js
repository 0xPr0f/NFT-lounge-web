import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import ReactPlayer from "react-player";
import { ethers } from "ethers";
import { AiOutlineCopy } from "react-icons/ai";
import React, { useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
//import ShakaPlayer from "shaka-player-react";

import CeramicClient from "@ceramicnetwork/http-client";
//import ShakaPlayer from "shaka-player-react";

import { Blob } from "nft.storage";
import { NFTStorage } from "nft.storage";
import Head from "next/head";
import Livepeer from "livepeer-nodejs";

//import "../../styles/CIoverlay.css";
import Modal from "./modal/modal";

import { Button, TextareaAutosize } from "@material-ui/core";

import { create as ipfsHttpClient } from "ipfs-http-client";
import Web3Modal from "web3modal";
import web3 from "web3";
import { useRouter } from "next/router";

import { nftaddress, nftmarketaddress } from "../../components/Address/config";

import NFT from "./artifacts/contracts/NFT.sol/NFT.json";
import Market from "./artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { GlobalStyle } from "../../styles/globalStyles";
import { Stream } from "stream";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default function Home() {
  const router = useRouter();
  const [size, setSize] = useState(0);
  var lol = 1124999;
  // modal overlay
  const [showModal, setShowModal] = useState(false);

  // Tab component
  const [value, setValue] = React.useState(0);

  // modal openings contexts
  const [txHash, setTxHash] = useState(null);

  // The minting and saving part of the code
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  // open modal
  const openModal = () => {
    setTxHash(null);
    setShowModal((prev) => !prev);
  };

  // Calling smart contract functions
  async function createSale(url) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();
    setTxHash(`https://mumbai.polygonscan.com/tx/${tx.transactionHash}`);
    console.log(txHash);
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    const price = web3.utils.toWei(formInput.price, "ether");

    const listingPrice = web3.utils.toWei("0.01", "ether");

    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });

    await transaction.wait();
    openModal();
    // eslint-disable-next-line no-restricted-globals
    // router.push("./Marketplace");
  }

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => {
          setSize(prog);
          console.log(`received: ${prog}`);
        },
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  async function createMarket() {
    openModal();
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;

    console.log(name + " was created");
    // first, upload to IPFS
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      // Uploading to ipfs
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      createSale(url);
    } catch (err) {
      console.log("Error uploading file: ", err.message);
    }
  }
  const Livepeer_apiKey = "b2172553-2098-4b0c-b679-3dffba1409c8";
  var livekey;
  // const ShakaPlayer = dynamic(() => import("shaka-player-react"), {
  //   ssr: false,
  // });
  const livepeerObject = new Livepeer("b2172553-2098-4b0c-b679-3dffba1409c8");
  const [data, setData] = useState(null);
  const [stream, setStream] = useState(null);
  const [show, setShow] = useState(false);
  const [streamlog, setStreamLog] = useState();
  const [nftName, setNftName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  const [nftUrl, setNftUrl] = useState("");

  const [covData, setCovData] = useState(null);

  const [ceramicStream, setCeramicStream] = useState(null);

  const content = {
    name: "test_stream",
    profiles: [
      {
        name: "720p",
        bitrate: 2000000,
        fps: 30,
        width: 1280,
        height: 720,
      },
      {
        name: "480p",
        bitrate: 1000000,
        fps: 30,
        width: 854,
        height: 480,
      },
      {
        name: "360p",
        bitrate: 500000,
        fps: 30,
        width: 640,
        height: 360,
      },
    ],
    record: true,
  };
  const startStream = () => {
    livepeerObject.Stream.create(content).then((res) => {
      console.log("stream started");
      setData(res);
      setShow(true);
    });
  };

  const getStreamUrl = async () => {
    const url = `https://livepeer.com/api/session?limit=20&parentId=${data.id}`;
    console.log(data.id);

    const streamLists = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${Livepeer_apiKey}`,
      },
    });
    setTimeout(function () {
      setStreamLog(data.playbackId);
      console.log(data.playbackId);
    }, 5000);
    if (streamLists.data.length === 0) {
      alert("No stream detected");
      return;
    }

    setStream(streamLists.data[0].mp4Url);

    // setStreamLog(streamLists.data[0].playbackId);
    setStreamLog(streamLists.data[0]);
    if (stream === "") alert("stream is currently processing to be streamed");
  };

  const mintStream = async (e) => {
    e.preventDefault();
    if (stream === "") {
      alert("Stream is currently trying ");
      return;
    }
    if (stream === null) {
      alert("No stream detected");
      return;
    }

    alert("Stream is currently being minted ");

    const PortApiKey = "af6d4865-bd49-453f-8f44-5d3d49448b93";
    const mintUrl = "https://api.nftport.xyz/v0/mints/easy/urls";
    const body = {
      chain: "rinkeby",
      name: nftName,
      description: description,
      file_url: stream,
      mint_to_address: address,
    };
    const auth = {
      headers: {
        Authorization: PortApiKey,
      },
    };

    const res = await axios.post(mintUrl, body, auth);
    console.log(stream);

    if (res.status === 200) {
      alert("Successfully minted stream, yeeaah you have an NFT");

      // setNftName("");
      //  setDescription("");
      //  setAddress("");
      setNftUrl(res.data.transaction_external_url);
      console.log(client);

      const client = new NFTStorage({
        token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY,
      });

      await client.storeBlob(
        new Blob([
          {
            chain: res.data.chain,
            contract_address: res.data.contract_address,
            transaction_hash: res.data.transaction_hash,
            description: res.data.description,
            address: res.data.mint_to_address,
          },
        ])
      );

      const covalent =
        "https://api.covalenthq.com/v1/1/address/" +
        address +
        "/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=false&key=" +
        process.env.NEXT_PUBLIC_COVALENT_API;
      const covalentRes = await axios.get(covalent);
      setCovData(covalentRes.data.data);
    } else {
      alert("Error with minting of the stream");
    }
  };
  const copyData = () => {
    navigator.clipboard.writeText(JSON.stringify(covData));
  };
  const Ceramic = async () => {
    const API_URL = "https://gateway-clay.ceramic.network";
    const ceramic = new CeramicClient(API_URL);
    const stream = await ceramic.loadStream(ceramicStream);
  };

  return (
    <>
      <div>
        <Tabs
          style={{
            backgroundColor: "#3e3e3e",
          }}
          value={value}
          centered
          textColor="primary"
          indicatorColor="primary"
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          variant="fullWidth"
        >
          <Tab
            label={
              <span className=" text-xl font-serif font-bold">Create NFT</span>
            }
          />

          <Tab
            className=""
            wrapped
            label={
              <span className=" overflow-hidden text-xl font-serif font-bold">
                Create Stream NFT
              </span>
            }
          />
        </Tabs>

        <div
          style={{
            backgroundColor: "#3e3e3e",
          }}
          className=" flex justify-center m-3.5 align-middle font-bold"
        >
          {value === 0 ? (
            <>
              <div className="flex flex-row mt-6">
                <div
                  className="mx-10 my-5"
                  style={{ height: "450px", width: "450px" }}
                >
                  {fileUrl && (
                    <img
                      alt=""
                      className="rounded mt-4 float-left"
                      width="500"
                      src={fileUrl}
                    />
                  )}
                </div>

                <br />
                <div className="w-full justify-center">
                  <div className="w-full flex flex-col pb-4">
                    <input
                      required
                      type="text"
                      placeholder="NFT Name"
                      className="mt-8 border rounded p-4 w-48"
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          name: e.target.value,
                        })
                      }
                    />
                    <TextareaAutosize
                      required
                      placeholder="NFT Description"
                      className="mt-2 border rounded p-4"
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          description: e.target.value,
                        })
                      }
                    />
                    <div className="flex flex-row">
                      <input
                        required
                        type="number"
                        placeholder="NFT Price in Matic"
                        className="mt-2 border rounded p-4 w-48"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            price: e.target.value,
                          })
                        }
                      />

                      <img
                        alt=""
                        height="50px"
                        width="50px"
                        src="https://www.cryptologos.cc/logos/polygon-matic-logo.svg?v=014"
                      />
                    </div>
                    <input
                      required
                      type="file"
                      name="NFT"
                      className="my-4 w-64"
                      onChange={onChange}
                    />

                    <br />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={createMarket}
                      className="mt-4 bg-blue-500 text-white rounded p-4 shadow-lg"
                    >
                      Create NFT
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {value === 1 ? (
            <>
              <>
                <div className="">
                  <div className="flex flex-row m-3 text-2xl">
                    Stream url:{" "}
                    {stream !== "" && stream !== null ? (
                      <b>
                        {stream}
                        <AiOutlineCopy
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            navigator.clipboard.writeText(stream);
                          }}
                        />
                      </b>
                    ) : stream === "" ? (
                      <b className=" text-2xl">stream currently processing</b>
                    ) : (
                      <b className=" text-2xl">No streams created</b>
                    )}
                  </div>

                  {/*https://www.youtube.com/watch?v=ECKyIeiSBT4     test url */}
                  <button
                    className="rounded  bg-blue-500 py-2 px-8 text-white m-13"
                    onClick={startStream}
                  >
                    Stream Video
                  </button>
                  {data ? (
                    <div className="m-3">
                      <p className="flex flex-row text-2xl">
                        stream key: {data.streamKey} &nbsp;
                        <AiOutlineCopy
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            navigator.clipboard.writeText(data.streamKey);
                          }}
                        />
                      </p>
                      <p className="flex flex-row text-2xl">
                        server: rtmp://rtmp.livepeer.com/live &nbsp;
                        <AiOutlineCopy
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            navigator.clipboard.writeText(
                              "rtmp://rtmp.livepeer.com/live"
                            );
                          }}
                        />
                      </p>{" "}
                      <p className=" text-2xl">
                        ☝️ Input the above in a streaming software like OBS
                      </p>
                      <p className="text-xl">
                        - If you are finding things difficult check the docs{" "}
                        <a
                          href="https://www.techadvisor.com/how-to/game/use-obs-to-live-stream-3676910/"
                          target="_blank"
                        >
                          here
                        </a>
                      </p>
                      <p className="flex flex-row text-2xl mb-2 mt-2">
                        <p>lounge METAVERSE key: &nbsp;</p>{" "}
                        https://cdn.livepeer.com/hls/
                        {data.playbackId}/index.m3u8
                        <>&nbsp;</>
                        <AiOutlineCopy
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `https://cdn.livepeer.com/hls/${data.playbackId}/index.m3u8`
                            );
                          }}
                        />
                      </p>
                      <p className="text-xl">
                        {" "}
                        - Put The above in the lounge METAVERSE to stream 👆{" "}
                      </p>
                    </div>
                  ) : null}
                  {show ? (
                    <>
                      <button
                        className="rounded bg-blue-500 py-2 px-8 text-white m-13"
                        onClick={getStreamUrl}
                      >
                        Play Stream
                      </button>
                      <br />
                    </>
                  ) : null}

                  <div className="m-3 video-container">
                    {stream !== "" && stream != null ? (
                      <>
                        <br />

                        <ReactPlayer controls url={stream} playing={true} />
                        <br />
                        <a
                          href={stream}
                          className="rounded bg-blue-500 py-2 px-8 text-white m-13"
                          target="_blank"
                        >
                          {" "}
                          Download Stream
                        </a>
                        <br />
                      </>
                    ) : (
                      <h3 className="text-2xl">video will appear here </h3>
                    )}
                  </div>

                  {nftUrl !== "" ? (
                    <>
                      <br />
                      <a
                        href={nftUrl}
                        className="rounded m-3 bg-blue-500 py-2 px-8 text-white m-13"
                        target="_blank"
                      >
                        View NFT
                      </a>
                    </>
                  ) : null}

                  <br />
                  <br />
                  <form>
                    <input
                      className="mt-1 border rounded p-3"
                      value={nftName}
                      type="text"
                      placeholder="Name of NFT"
                      onChange={(e) => setNftName(e.target.value)}
                      name="nftName"
                      required
                    />
                    <input
                      className="mt-1 border rounded p-3"
                      value={description}
                      type="text"
                      placeholder="Description of NFT"
                      onChange={(e) => setDescription(e.target.value)}
                      name="description"
                      required
                    />
                    <input
                      className="mt-1 border rounded p-3"
                      value={address}
                      type="text"
                      placeholder="Wallet Address"
                      onChange={(e) => setAddress(e.target.value)}
                      name="address"
                      required
                    />
                    <button
                      className="rounded bg-blue-600 py-2 px-12 text-white m-16"
                      onClick={mintStream}
                    >
                      Mint Video
                    </button>
                  </form>
                  {covData !== null ? (
                    <h1 className=" text-2xl">Data 👇</h1>
                  ) : null}

                  <h1 className=" mt-1 mb-7">
                    {" "}
                    {covData !== null ? <p>{JSON.stringify(covData)}</p> : null}
                  </h1>
                  {covData !== null ? (
                    <button
                      className="rounded bg-blue-500 py-2 px-8 text-white m-13"
                      onClick={() => copyData()}
                    >
                      Copy Data
                    </button>
                  ) : null}
                  {/*   <div>{streamLists.data}</div> */}
                </div>
              </>
            </>
          ) : null}
        </div>
      </div>

      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        fileUrl={fileUrl}
        txHash={txHash}
        setTxHash={setTxHash}
      />
      <GlobalStyle />
    </>
  );
}
