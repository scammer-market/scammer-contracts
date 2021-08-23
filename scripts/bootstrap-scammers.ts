const ScammerController = artifacts.require("ScammerController");
const Scammer = artifacts.require("Scammer");

module.exports = async function (callback) {
	try {
		const accounts = await web3.eth.getAccounts();

		let controller = await ScammerController.deployed()
		let token = await Scammer.deployed()
		console.log("ScammerController found: " + controller.address)

		// mints 500 collection (tokenIds 1000001 to 1000500) as paused
		await controller.addCollection(555, web3.utils.toWei("0.36", "ether"), true)
		console.log("Minted new collection.")

		// unpauses collection
		await controller.setVoucherOnlyMode(1);
		console.log("Enable voucher only mode.")


		// mint vault vouchers
		await controller.updateNumVouchers(accounts[0], 56);
		console.log("Added 50 vouchers to: " + accounts[0])

		var tokenIds = [];
		while(tokenIds.length < 56){
		    var r = Math.floor(Math.random() * 555) + 1000000;
		    const tokenExists = await token.exists(r);
		    if(tokenIds.indexOf(r) === -1 && !tokenExists ) tokenIds.push(r);
		}

		let i = 0;
		let size = tokenIds.length;
		for (const tokenId of tokenIds) {

			
			console.log("Redeemed Token #" + tokenId + `(${i} of ${size})`)

			// // redeem vault vouchers (MAINNET ADDRESS)
			await controller.redeem("0xCD4A05Ea925af76fe31Ce955bFEFDe3B634FF1dD", tokenId)
			i = i+1;
		}
	} catch (error) {
		return callback(error)
	}
	return callback()
}
