const secret = require("./secret");
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
        provider: new HDWalletProvider(secret.mnemonic.ropsten, "https://ropsten.infura.io/" + secret.infura_apikey),
        network_id: 3,
        gasPrice: 3000000000,
        gas: 4500000
    },
    kovan: {
        provider: new HDWalletProvider(secret.mnemonic.kovan, "https://kovan.infura.io/" + secret.infura_apikey),
        network_id: 42,
        gasPrice: 3000000000,
        gas: 4500000

    },
    rinkeby: {
        provider: new HDWalletProvider(secret.mnemonic.rinkeby, "https://rinkeby.infura.io/" + secret.infura_apikey),
        network_id: 4,
        gasPrice: 3000000000,
        gas: 4500000
    },
    mainnet: {
        provider: new HDWalletProvider(secret.mnemonic.mainnet, "https://mainnet.infura.io/" + secret.infura_apikey),
        network_id: 1,
        gasPrice: 2000000000,
        gas: 6000000
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
};
