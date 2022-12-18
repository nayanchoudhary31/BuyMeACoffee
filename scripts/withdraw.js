const { ethers } = require("hardhat");
require("dotenv").config();
const {
  abi,
} = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

const getBalance = async (provider, address) => {
  const balance = await provider.getBalance(address);
  return ethers.utils.formatEther(balance);
};

async function main() {
  const contractAddress = "0x7af5738166E3334Fd4d146eC8764362CB57Fd84D"; // Deployed Contract Address
  const contractABI = abi; // ABI of BuyMe Coffee
  // Set Provider with Alchemy API Key
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.GORELI_KEY
  );

  //Get Signer By Private Key
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Instance of Buy Me A Coffee
  const buymecoffee = new ethers.Contract(contractAddress, contractABI, signer);

  console.log(
    "current balance of owner: ",
    await getBalance(provider, signer.address),
    "ETH"
  );
  const contractBalance = await getBalance(provider, buymecoffee.address);
  console.log(
    "current balance of contract: ",
    await getBalance(provider, buymecoffee.address),
    "ETH"
  );
  // Withdraw funds if there are funds to withdraw.
  if (contractBalance !== "0.0") {
    console.log("withdrawing funds..");
    const withdrawTxn = await buymecoffee.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log("no funds to withdraw!");
  }

  console.log(
    "current balance of owner: ",
    await getBalance(provider, signer.address),
    "ETH"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
