const ScammerController = artifacts.require("ScammerController");

module.exports = async function (callback) {
	try {
		const accounts = await web3.eth.getAccounts();

		let controller = await ScammerController.deployed()
		console.log("ScammerController found: " + controller.address)

		// mints 500 collection (tokenIds 1000001 to 1000500) as paused
		await controller.addCollection(555, web3.utils.toWei("0.36", "ether"), true)
		console.log("Minted new collection.")

		// unpauses collection
		await controller.updateCollectionPaused(1, false);
		console.log("Unpaused collection.")


		// mint vault vouchers
		await controller.updateNumVouchers(accounts[0], 56);
		console.log("Added 50 vouchers to: " + accounts[0])

		var tokenIds = [];
		while(tokenIds.length < 56){
		    var r = Math.floor(Math.random() * 555) + 1000000;
		    if(tokenIds.indexOf(r) === -1) tokenIds.push(r);
		}

		for (const tokenId of tokenIds) {
			// // redeem vault vouchers (MAINNET ADDRESS)
			// controller.redeem("0xCD4A05Ea925af76fe31Ce955bFEFDe3B634FF1dD", tokenId)

			// redeem vault vouchers (RINKEBY ADDRESS)
			console.log("Redeemed Token #" + tokenId)
			await controller.redeem("0xA7E34d0d79f61AD5F18Ae105409fBF04194b76aC", tokenId)
		}
	} catch (error) {
		return callback(error)
	}
	return callback()
}