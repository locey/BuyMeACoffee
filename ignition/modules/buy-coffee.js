// scripts/deploy.js

const { ethers } = require("hardhat")
const hre = require("hardhat")
const { expect } = require("chai");

// Returns the Ether balance of a given address.
// 修改 getBalance 函数
async function getBalance(address) {
  const balanceBigInt = await ethers.provider.getBalance(address);
  //console.log("balance is:",balanceBigInt);
  return hre.ethers.formatEther(balanceBigInt);
}
// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx ++;
  }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

async function main() {
  // We get the contract to deploy.
  //const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  //const buyMeACoffee = await BuyMeACoffee.deploy();

  //await buyMeACoffee.deployed();
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();
  const buyMeACoffee = await hre.ethers.deployContract("BuyMeACoffee");

  //console.log("owner is:",owner.address," tipper is:",tipper.address," tipper2 is:",tipper2.address," tipper3 is:",tipper3.address);
  console.log("BuyMeACoffee deployed to:", buyMeACoffee.target);

  // Check balances before the coffee purchase.
  const addresses = [owner.address, tipper.address, buyMeACoffee.target];
  console.log("== start ==");
  await printBalances(addresses);

  // Buy the owner a few coffees.
  const tip = {value: hre.ethers.parseEther("1")};
  await buyMeACoffee.connect(tipper).buyCoffee("Carolina", "You're the best!", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Vitto", "Amazing teacher", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Kay", "I love my Proof of Knowledge", tip);


  // Check balances after the coffee purchase.
  console.log("== bought coffee ==");
  await printBalances(addresses);

  // Withdraw.
  await buyMeACoffee.connect(owner).withdrawTips();

  // Check balances after withdrawal.
  console.log("== withdrawTips ==");
  await printBalances(addresses);

  // Check out the memos.
  console.log("== memos ==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });