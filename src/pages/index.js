import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { Button, Tag } from "degen";
import { ThemeProvider } from "degen";
import Marketplace from "./Body/Marketplace";
import { ethers } from "ethers";

import { Web3Provider } from "@ethersproject/providers";
import Link from "next/link";
import nonceAPI from "./api/auth/nonce";
import { truncateAddress } from "../utils/shortAddy";
//import Moralis from "moralis";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../connectors/index";
//import "dotenv"

import Externals from "./Body/externals";

export default function Home() {
  const [loginState, setLoginState] = useState(null);
  const [address, setAddress] = useState(null);
  const [signature, setSignature] = useState(null);
  const [provider, setProvider] = useState(null);

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
    <div>
      <Head>
        <title>NFT lounge</title>
      </Head>

      <Externals />

      {/* <main className={styles.main}>
        
        {
          loginState == "Connecting to wallet..." ? <Tag>{loginState}</Tag> : <Tag tone="green">{loginState}</Tag>
        }

        { 
          signature 
          ? 
          <Tag tone="blue"> {address ? truncateAddress(address): ""} </Tag>
          : 
          ""
        } 


        { 
        loginState == null ? (

        <Button onClick={loginMetaMask}>Connect to Metamask</Button>

         ) : (

        <Button onClick={disconnect}>Disconnect</Button>
         
         )
         }
      </main> */}

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <img src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  );
}
