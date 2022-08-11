import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    kovan: {
      url: process.env.KOVAN_RPC_URL || "https://kovan.infura.io",
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
  },
  etherscan: {
    apiKey: {
      kovan: process.env.ETHERSCAN_API_KEY || "unknown",
    },
  },
};

export default config;
