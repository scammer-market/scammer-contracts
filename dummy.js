
let c = await ScammerController.deployed()
c.redeem(accounts[0], 1000123)
c.buy(accounts[0], {from: accounts[0], value: web3.utils.toWei("0.36", "ether")})
