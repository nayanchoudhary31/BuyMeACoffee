require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{ version: "0.8.7" }, { version: "0.8.4" }],
  },

  networks: {
    goerli: {
      url: process.env.GOERLI_ALCHEMEY_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
