// scripts/withdraw.js

const { ethers } = require("hardhat")
const hre = require("hardhat")
const { expect } = require("chai");
const abi = require("../../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  //console.log("balanceBigInt is:",balanceBigInt);
  return ethers.utils.formatEther(balanceBigInt);;
}

async function main() {
  // Get the contract that has been deployed to Goerli.
  const contractAddress="0x311CBCF441fe0f9C9d7c37cdE7c173ad32b58d03";
  const contractABI = abi.abi;

  console.log("process.env.GOERLI_API_KEY is:",process.env.GOERLI_API_KEY);//GOERLI_URL
  // Get the node connection and wallet connection.
  const provider = new hre.ethers.providers.JsonRpcProvider(process.env.GOERLI_URL);

  // Ensure that signer is the SAME address as the original contract deployer,
  // or else this script will fail with an error.
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
  //console.log("signer is:",signer);
  // Instantiate connected contract.
  const buyMeACoffee = new hre.ethers.Contract(contractAddress, contractABI, signer);

  // Check starting balances.
  console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
  const contractBalance = await getBalance(provider, buyMeACoffee.address);
  console.log("current balance of contract: ", await getBalance(provider, buyMeACoffee.address), "ETH");

  // Withdraw funds if there are funds to withdraw.
  if (contractBalance !== "0.0") {
    console.log("withdrawing funds..")
    const withdrawTxn = await buyMeACoffee.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log("no funds to withdraw!");
  }

  // Check ending balance.
  console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });