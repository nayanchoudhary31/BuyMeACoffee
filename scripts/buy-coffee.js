const { ethers } = require("hardhat");

// Return the Balance of an Address
const getBalance = async (address) => {
  const balance = await ethers.provider.getBalance(address);
  return ethers.utils.formatEther(balance);
};

// Function to Print Balance of Address List
const getBalanceList = async (addressList) => {
  let idx = 0;
  for (const addr of addressList) {
    console.log(`Address ${idx} balance :`, await getBalance(addr));
    idx++;
  }
};

// Function to Print Memos
const printMemo = async (memos) => {
  for(const memo of memos){
    const time = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${time}, ${tipper}, (${tipperAddress}), said: "${message}"`);
  }
  
};

async function main() {
  const [owner, tipper, tipper2, tipper3] = await ethers.getSigners();

  const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
  const buymecoffee = await BuyMeACoffee.deploy();

  await buymecoffee.deployed();

  console.log(`BuyMeACoffee Deployed to: ${buymecoffee.address}`);

  const address = [owner.address, tipper.address, buymecoffee.address];
  console.log("==== Balance Before Coffee Buy ====");
  await getBalanceList(address);

  const tip = { value: await ethers.utils.parseEther("1") };
  await buymecoffee.connect(tipper).buyCoffee("Nayan", "Is a Good Guy.", tip);
  await buymecoffee.connect(tipper2).buyCoffee("Vitalik", "ETH2.0 will be Awesome", tip);
  await buymecoffee.connect(tipper3).buyCoffee("Patrick", "Oracle means Chainlink", tip);

  console.log("==== Balance After Coffee Buy ====")
  await getBalanceList(address);

  await buymecoffee.connect(owner).withdrawTips();


  console.log("=== Memo ===")
  const memo = await buymecoffee.getMemos();
  await printMemo(memo)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });