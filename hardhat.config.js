require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.3",
  paths: {
    artifacts: "./src/pages/Body/artifacts",
  },
  networks: {
    mumbai: {
      url: `https://speedy-nodes-nyc.moralis.io/dc77b697f139e116154eed4e/polygon/mumbai`,
      accounts: [
        `0x622aece2401274a3201b64b0e34dc4426d5d051e68a531806f9cb792ea159c47`,
      ],
    },
  },
};
