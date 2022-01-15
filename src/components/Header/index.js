import "tailwindcss/tailwind.css";
import { Button } from "degen";
import { Input } from "degen";
import Image from "next/image";
import ConnectButton from "../ConnectButton";
import { ethers } from "ethers";
import { HStack, Box } from "@chakra-ui/react";

export default function Header({
  loginState,
  setLoginState,
  address,
  setAddress,
  signature,
  setSignature,
  provider,
  setProvider,
}) {
  return (
    <div className="m-5">
      {/* <div>
                <h1>ColorPixels</h1>
            </div> */}

      <HStack>
        {/*  <Box>{loginState === "Connected" ? <Button>Mint</Button> : null}</Box> */}
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "60%",
          }}
        >
          <Box>
            <ConnectButton
              loginState={loginState}
              setLoginState={setLoginState}
              address={address}
              setAddress={setAddress}
              signature={signature}
              setSignature={setSignature}
              provider={provider}
              setProvider={setProvider}
            />
          </Box>
        </div>
      </HStack>
    </div>
  );
}
