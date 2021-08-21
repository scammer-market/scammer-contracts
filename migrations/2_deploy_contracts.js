var Metadata = artifacts.require("./Metadata.sol");
var Scammer = artifacts.require("./Scammer.sol");
var ScammerController = artifacts.require("./ScammerController.sol");
var voucherAddrs = require("./vouchers")

let _ = "        ";

// // rinkeby addrs
// const artistaddr = "0x7742DbD51E98D1809A9Cd749ab71Af61e899C442"
// const adminaddr = "0x8f6dE19720B64800382124c41556EC4580Ff4234"

// rinkeby addrs
const artistAddr = "0x7645eb8cf60d54b0460b0d8e931d99c63c2de78e"
const adminAddr = "0x3c1a329586e28b960c01e3edae037c05316a2413"

module.exports = (deployer, helper, accounts) => {
  deployer.then(async () => {
    try {

      // Deploy Metadata.sol
      await deployer.deploy(Metadata, process.env.APP_URL);
      let metadata = await Metadata.deployed();
      console.log(_ + `Metadata deployed with baseUrl (${process.env.APP_URL}) at: ` + metadata.address);

      // Deploy Scammer.sol
      await deployer.deploy(Scammer, "SCAMMER", "SCAM", metadata.address);
      let scammer = await Scammer.deployed();
      console.log(_ + "Scammer deployed at: " + scammer.address);

      // Add admin to Scammer
      await scammer.addAdmin(adminAddr);
      console.log(_ + `Admin ${adminAddr} added to Scammer`);

      // Deploy ScammerController.sol
      await deployer.deploy(
        ScammerController,
        scammer.address,
        adminAddr,
        artistAddr,
        voucherAddrs
      );
      let scammerController = await ScammerController.deployed();
      console.log(
        _ + "ScammerController deployed at: " + scammerController.address
      );

      await scammer.updateController(scammerController.address);
      console.log(
        _ + "ScammerController updated to " + scammerController.address
      );

    } catch (error) {
      console.log(error);
    }
  });
};
