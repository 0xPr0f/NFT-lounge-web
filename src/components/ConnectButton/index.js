import React, { useState, useEffect } from "react";
import { Tag } from "degen";
import { MoralisProvider } from "react-moralis";
import { ethers } from "ethers";
import { truncateAddress } from "../../utils/shortAddy";
import { useMoralis } from "react-moralis";
import { AiOutlineCopy } from "react-icons/ai";
import { FaBeer } from "react-icons/fa";
import {
  Button,
  Badge,
  Stack,
  HStack,
  Grid,
  Flex,
  Spacer,
  Text,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";
import { DropButton, Menu } from "grommet";

export default function Header() {
  const {
    authenticate,
    isAuthenticated,
    logout,
    user,
    isWeb3Enabled,
    enableWeb3,
  } = useMoralis();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <HStack className=" relative left-36 bottom-11">
            <Menu
              style={{
                color: '"#3f50b5',
                position: "relative",
                right: "20px",
                color: "black",
              }}
              label={
                <>
                  {" "}
                  <span className="mt-4 bg-blue-600 text-black  rounded p-4 shadow-lg">
                    {truncateAddress(user.get("ethAddress"))}
                  </span>{" "}
                </>
              }
              items={[
                {
                  label: (
                    <Button
                      className="mt-4 bg-blue-600 text-black p-4 shadow-lg"
                      width={170}
                      border={false}
                      colorScheme="blue"
                      rounded={false}
                      onClick={() => {
                        navigator.clipboard.writeText(user.get("ethAddress"));
                      }}
                    >
                      {
                        <>
                          <span>{truncateAddress(user.get("ethAddress"))}</span>{" "}
                          <span>&nbsp;&nbsp;&nbsp;</span>
                        </>
                      }

                      <AiOutlineCopy />
                    </Button>
                  ),
                  onClick: () => {},
                },
                {
                  label: (
                    <Button
                      className="mt-4 bg-blue-600 text-black p-4 shadow-lg"
                      width={170}
                      border={false}
                      style={{ marginTop: "10px" }}
                      rounded={false}
                      onClick={() => {
                        window.open(
                          `https://mumbai.polygonscan.com/address/${user.get(
                            "ethAddress"
                          )}`,
                          "_blank"
                        );
                      }}
                    >
                      {" "}
                      View on Etherscan
                    </Button>
                  ),
                  onClick: () => {},
                },

                {
                  label: (
                    <>
                      <Button
                        className="mt-4 bg-blue-600 text-black  p-4 shadow-lg"
                        p="4"
                        style={{ position: "relative" }}
                        width={170}
                        border={false}
                        rounded={false}
                        colorScheme="blue"
                        onClick={logout}
                      >
                        {" "}
                        Logout{" "}
                      </Button>
                    </>
                  ),
                  onClick: () => {},
                },
              ]}
            />
            {/* <h2>Welcome {user.get("username")}</h2> */}
            {/* <h1>Logged in as:</h1> */}

            <Button
              className="mt-4 bg-blue-600 text-black  p-4 shadow-lg"
              colorScheme="blue"
              onClick={logout}
            >
              {" "}
              Logout{" "}
            </Button>
          </HStack>
        </>
      ) : (
        <Flex>
          <Spacer />

          <Box className=" relative left-72 bottom-6">
            <DropButton
              className="mt-4 bg-blue-600 text-black   p-4 shadow-lg"
              label={<span className="mt-4 text-black ">Login</span>}
              dropAlign={{ top: "bottom", right: "right" }}
              dropContent={
                <>
                  <Button
                    className="mt-4 bg-blue-600 text-black  p-4 shadow-lg"
                    p="4"
                    mt="2"
                    rounded={false}
                    colorScheme="blue"
                    onClick={() => {
                      authenticate({ provider: "metamask" });
                    }}
                  >
                    Sign in with MetaMask
                  </Button>
                  <Button
                    className="mt-4 bg-blue-600 text-black  p-4 shadow-lg"
                    p="4"
                    mt="2"
                    rounded={false}
                    colorScheme="blue"
                    onClick={() => {
                      authenticate({ provider: "walletconnect", chainId: 137 });
                    }}
                  >
                    Sign in with walletconnect
                  </Button>
                </>
              }
            />
          </Box>
        </Flex>
      )}
    </div>
  );
}
