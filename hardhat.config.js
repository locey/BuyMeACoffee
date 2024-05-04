require("@nomicfoundation/hardhat-toolbox");
const { vars } = require("hardhat/config");
require("dotenv").config()

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

//const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");
//const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");

const GOERLI_URL = process.env.GOERLI_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      //url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      url: GOERLI_URL,
      //accounts: [SEPOLIA_PRIVATE_KEY]
      accounts: [PRIVATE_KEY]
    }
  }
};