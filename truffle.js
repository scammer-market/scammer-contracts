require('dotenv').config()
const { createProvider } = require('@rarible/trezor-provider')

const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  },
  solc: {
    settings: {
      optimizer: {
        enabled: true,
        runs: 1500
      }
    }
  },
  networks: {
    develop: {
      provider() {
        return new HDWalletProvider(
          process.env.TRUFFLE_MNEMONIC,
          'http://localhost:9545/'
        )
      },
      host: 'localhost',
      port: 7545,
      network_id: 5777
    },
    ganache: {
      provider() {
        return new HDWalletProvider(
          process.env.GANACHE_MNEMONIC,
          'http://localhost:7545'
        )
      },
      host: 'localhost',
      port: 7545,
      network_id: 1337,
      // gas: 10000000,
      // gasPrice: 1000000000
    },
    mainnet: {
      networkCheckTimeout: 999999,
      skipDryRun: true,
      provider() {
        return new HDWalletProvider(
          process.env.MAINNET_MNEMONIC,
          'https://mainnet.infura.io/v3/' + process.env.INFURA_API_KEY,
          // using wallet at index 0 ----------------------------------------------------------------------------------------v
          2,
          10
        )
      },
      network_id: 1,
      gasPrice: 60000000000, // 25 GWEI
      gas: 500000
    },
    kovan: {
      provider() {
        return new HDWalletProvider(
          process.env.TESTNET_MNEMONIC,
          'https://kovan.infura.io/v3/' + process.env.INFURA_API_KEY,
          // using wallet at index 0 ----------------------------------------------------------------------------------------v
          0,
          10
        )
      },
      network_id: 42
      // gas: 5561260
    },
    rinkeby: {
      skipDryRun: true,
      provider() {
        //return createProvider({
        //  url: 'https://rinkeby.infura.io/v3/' + process.env.INFURA_API_KEY,
        //  path: "m/44'/60'/0'/0/1",
        //  chainId: 4,
        //})
        return new HDWalletProvider(
         process.env.TESTNET_MNEMONIC,
         'https://rinkeby.infura.io/v3/' + process.env.INFURA_API_KEY,
         2,
         10
        )
      },
      network_id: 4,
      // gas: 4700000,
      gasPrice: 25000000000 // 25 GWEI
    },
    ropsten: {
      provider() {
        return new HDWalletProvider(
          process.env.TESTNET_MNEMONIC,
          'https://ropsten.infura.io/v3/' + process.env.INFURA_API_KEY
        )
      },
      network_id: 2
      // gas: 4700000
    },
    sokol: {
      provider() {
        return new HDWalletProvider(
          process.env.TESTNET_MNEMONIC,
          'https://sokol.poa.network'
        )
      },
      gasPrice: 1000000000,
      network_id: 77
    },
    poa: {
      provider() {
        return new HDWalletProvider(
          process.env.TESTNET_MNEMONIC,
          'https://core.poa.network'
        )
      },
      gasPrice: 1000000000,
      network_id: 99
    }
  }
}
