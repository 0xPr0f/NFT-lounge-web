import React from "react";

const Externals = () => {
  return (
    <div className=" overflow-hidden">
      <div>
        <p className="font-serif text-3xl flex justify-center m-3.5 align-middle font-bold">
          <u> Welcome to NFT lounge </u>
        </p>
        <p className="font-serif text-2xl flex justify-center m-3.5 align-middle font-bold">
          If you have a Notion account feel free to checkout our
          <a
            className=" hover:text-red-500"
            onClick={() => {
              window.open(
                `https://www.notion.so/nftslounge/NFT-lounge-2cce65d3cfa6437393c24cbd2417e676`,
                "_blank"
              );
            }}
            href=""
          >
            <u className="font-serif"> &nbsp;page on Notion </u>{" "}
          </a>
        </p>
        <br />
        <p className="font-serif w-50% text-3xl flex justify-center m-3.5 align-middle font-bold">
          This contains the basic things required to play
        </p>
        <p className="font-serif w-50% text-3xl flex justify-center m-3.5 align-middle font-bold">
          experiment, learn, understand and join the web3 NFT space.
        </p>
      </div>
      <br />
      <br />
      <br />
      <div className="font-serif text-2xl m-1  relative left-40">
        <u>Deployments on other Platforms</u>
      </div>

      <div
        onClick={() => {
          window.open(
            `https://testnets.opensea.io/collection/metx-nft-v3`,
            "_blank"
          );
        }}
        style={{ backgroundColor: "#3f50b5", cursor: "pointer" }}
        className="transform transition  hover:scale-120 rounded w-56 h-24 relative left-40"
      >
        <p className=" font-serif mr-6 m-8 relative top-6 flex justify-center">
          {" "}
          Collection on Opeansea.{" "}
        </p>
      </div>

      <div
        onClick={() => {
          window.open(
            `https://mumbai.polygonscan.com/address/0x407D0E3BB4A87CCf78aAcDb5F1bb80214D147722`,
            "_blank"
          );
        }}
        style={{ backgroundColor: "#3f50b5", cursor: "pointer" }}
        className="transform transition  hover:scale-120 rounded w-56 h-24 relative left-40"
      >
        <p className="font-serif mr-6 m-8 relative top-4 flex justify-center">
          {" "}
          Deployment of the NFT address on polygon.
        </p>
      </div>

      <div
        onClick={() => {
          window.open(
            `https://mumbai.polygonscan.com/address/0x035BaC1ca0BF6f6C8f4B6c090B0023D487E05d7c`,
            "_blank"
          );
        }}
        style={{ backgroundColor: "#3f50b5", cursor: "pointer" }}
        className="transform transition hover:scale-150  rounded w-56 h-24  relative left-40"
      >
        <p className="font-serif mr-6 m-8 relative top-3 flex justify-center">
          Deployment of the NFT MarketPlace address on polygon.
        </p>
      </div>

      <div
        onClick={() => {
          window.open(``, "_blank");
        }}
        style={{ backgroundColor: "#3f50b5", cursor: "pointer" }}
        className=" transform transition hover:scale-120 rounded w-56 h-24 relative left-40"
      >
        <p className="font-serif mr-6 m-8 relative top-6 flex justify-center">
          Source code to the build of the DApp.
        </p>
      </div>
      <br />
      <br />
    </div>
  );
};

export default Externals;
