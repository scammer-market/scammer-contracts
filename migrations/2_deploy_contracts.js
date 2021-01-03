var Metadata = artifacts.require('./Metadata.sol')
var Folia = artifacts.require('./Folia.sol')

let _ = '        '

module.exports = (deployer, helper, accounts) => {

  deployer.then(async () => {
    try {
      // Deploy Metadata.sol
      await deployer.deploy(Metadata)
      let metadata = await Metadata.deployed()
      console.log(_ + 'Metadata deployed at: ' + metadata.address)

     // Deploy Folia.sol
      await deployer.deploy(Folia, 'Folia', 'FLA', metadata.address)
      let token = await Folia.deployed()
      console.log(_ + 'Folia deployed at: ' + token.address)

      // const adminAddress = '0xdogfooddogfooddogfooddogfooddogfooddogfood'
      // await token.addAdmin(adminAddress)

    } catch (error) {
      console.log(error)
    }
  })
}