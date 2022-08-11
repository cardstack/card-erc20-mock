import { ethers, network } from "hardhat";

async function main() {
  const MockCardToken = await ethers.getContractFactory("MockCardToken");
  let name = `Card Token ${network.name}`;
  let symbol = "CARD";
  console.log("Deploying card token", name, symbol);
  const token = await MockCardToken.deploy(name, symbol);

  await token.deployed();

  console.log("Deployed", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
