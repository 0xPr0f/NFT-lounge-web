import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "degen";
import "degen/styles";
import { MoralisProvider } from "react-moralis";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";

import { useState } from "react";
import { Button, Tag } from "degen";

import { ethers } from "ethers";

import { Web3Provider } from "@ethersproject/providers";

import nonceAPI from "./api/auth/nonce";
import { truncateAddress } from "../utils/shortAddy";
//import Moralis from "moralis";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../connectors/index";
//import "dotenv"

function MyApp({ Component, pageProps }) {
  const [loginState, setLoginState] = useState(null);
  const [address, setAddress] = useState(null);
  const [signature, setSignature] = useState(null);
  const [provider, setProvider] = useState(null);
  const router = useRouter();
  //const {active, account, library, connector, activate, deactivate} = useWeb3React()

  const loginMetaMask = async () => {
    //check if use has wallet
    setLoginState("Connecting to wallet...");
    //check if eth wallet is in browser
    if (!window.ethereum) {
      setLoginState(
        "Bruh... You dont have Metamask -_- Please Install Metamask!"
      );
      //stop execution of login function
      return;
    }

    //request current loggedin user in Metamask with ethers
    //provider is just metamask configuration
    //(shows in window.ethereum object)

    //intialize provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    //request accounts of current user
    await provider.send("eth_requestAccounts", []);

    //get signer with provider
    const signer = provider.getSigner();

    //get wallet address with signer
    const walletAddr = await signer.getAddress();
    setAddress(walletAddr);

    //send signature to backend and check whether the user actually signed the right message
    //proof that this user is the real user
    //has to be random string so they dont use replay attack

    const signature = await signer.signMessage("What's goood?");
    console.log("sig: ", signature);
    setSignature(signature);
    if (signature) {
      setLoginState("Connected");
      console.log("Connected to Metamask");
    }
  };

  const disconnect = async () => {
    setAddress(null);
    setSignature(null);
    setLoginState(null);
    //await provider.send("disconnect", []);
    setProvider(null);
    console.log("Disconected from Metamask");
  };

  return (
    <>
      <MoralisProvider
        appId={process.env.NEXT_PUBLIC_MORALIS_APP_ID}
        serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_ID}
      >
        <div className=" m-3">
          <h1 className=" text-4xl">NFT LOUNGE</h1>
        </div>
        <Header
          loginState={loginState}
          setLoginState={setLoginState}
          address={address}
          setAddress={setAddress}
          signature={signature}
          setSignature={setSignature}
          provider={provider}
          setProvider={setProvider}
        />
        <ThemeProvider>
          <div
            className="App overflow-visible  top-0 w-full text-center border-b border-grey p-4"
            style={{
              height: "65px",
              display: "flex",
              background: "#3f50b5",
              color: "#3f50b5",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h2
                className={
                  router.asPath == "/Body/Marketplace"
                    ? "active text-2xl text-black "
                    : "text-red-700 text-2xl"
                }
              >
                <Link style={{ padding: "0rem 3rem" }} href="/Body/Marketplace">
                  <a className="font-serif">Market Place</a>
                </Link>
              </h2>
            </div>

            <h2
              className={
                router.asPath == "/Body/create-item"
                  ? "active text-2xl text-black"
                  : "text-red-700  text-2xl"
              }
            >
              <Link href="/Body/create-item" style={{ padding: "0rem 3rem" }}>
                <a className=" font-serif">Create Assets</a>
              </Link>
            </h2>

            <h2
              className={
                router.asPath == "/Body/my-nfts"
                  ? "active text-2xl   text-black"
                  : "text-red-700  text-2xl"
              }
            >
              <Link style={{ padding: "0rem 3rem" }} href="/Body/my-nfts">
                <a className=" font-serif">My NFTs</a>
              </Link>
            </h2>
            <h2
              className={
                router.asPath == "/Body/externals"
                  ? "active  text-2xl text-black"
                  : "text-red-700  font-serif text-2xl"
              }
            >
              <Link style={{ padding: "0rem 3rem" }} href="/Body/externals">
                <a className=" font-serif">Lobby</a>
              </Link>
            </h2>
          </div>
          {/* <ChakraProvider> */}
          <Component {...pageProps} />
          {/* </ChakraProvider> */}
        </ThemeProvider>
      </MoralisProvider>
    </>
  );
}

export default MyApp;
