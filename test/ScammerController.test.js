var Metadata = artifacts.require('./Metadata.sol')
var Scammer = artifacts.require('./Scammer.sol')
var ScammerController = artifacts.require('./ScammerController.sol')
var BigNumber = require('bignumber.js')
let gasPrice = 1000000000 // 1GWEI

let _ = '        '

const assertError = async (error_reason, promise) => {
  try {
    await promise;
  } catch (error) {
    assert(error.reason == error_reason, `Expected '${error_reason}' error, got: ` + error)
    return;
  }
  assert(false, `Expected throw (${error_reason}) not received`);
}

const assertNoError = async (msg, promise) => {
  try {
    await promise;
  } catch (error) {
    assert(false, `Expected ${msg}, found: ` + error);
  }
}

contract('ScammerController', async function(accounts) {
  let token, metadata, controller

  before(done => {
    ;(async () => {
      try {
        token = await Scammer.deployed()
        controller = await ScammerController.deployed()

        done()
      } catch (error) {
        console.error(error)
        done(false)
      }
    })()
  })
  describe('ScammerController.sol', function() {
    it('should allow for the creation of new collections, and purchasing of a scammer ', async function() {

      // mints 500 collection (tokenIds 1000001 to 1000500) as paused
      try {
        await controller.addCollection(500, web3.utils.toWei("0.1", "ether"), true)
      } catch (error) {
        console.log(error)
        assert(false, error)
      }

      // mints 100 collection (tokenIds 2000001 to 2000100) as paused
      try {
        await controller.addCollection(100, web3.utils.toWei("0.1", "ether"), true)
      } catch (error) {
        console.log(error)
        assert(false, error)
      }


      // unpauses collection
      try {
        await controller.updateCollectionPaused(1, false)
      } catch (error) {
        console.log(error)
        assert(false, error)
      }

    })

    it('should fail on buy calls with wrong price, and succeed with correct price', async function() {

      // buy with correct price
      await assertNoError("buying with correct amount should suceed",
        controller.buy(accounts[0], 1000001, {from: accounts[0], value: web3.utils.toWei("0.1", "ether")}))

      // buy with incorrect priice should fail
      await assertError("DID_NOT_SEND_PRICE", controller.buy(accounts[0], 1000002, {from: accounts[0], value: web3.utils.toWei("0.2", "ether")}))

      // buy with incorrect priice should fail
      await assertError("DID_NOT_SEND_PRICE", controller.buy(accounts[0], 1000002, {from: accounts[0], value: web3.utils.toWei("0.05", "ether")}))

    })

    it('should allow voucher holders to redeem for other accounts', async function() {
      await assertNoError("can mint new voucher",
        controller.mintVoucher(accounts[0]))

      // can redeem from an account with vouchers
      await assertNoError("can redeem voucher", controller.redeem(accounts[9], 1000399, {from: accounts[0]}))
    })

    it('should pause collection again, enable voucher mode, and allow voucher purchases', async function() {
      await assertNoError("can mint new voucher",
        controller.mintVoucher(accounts[8]))

      let numVouchers = await controller.numVouchers(accounts[8])
      assert(numVouchers == 1, "accounts[8] should have 1 voucher")

      // buy with correct price
      await assertNoError("can pause collection",
        controller.updateCollectionPaused(1, true))

      // cannot purchase from paused collection
      await assertError("BUY_NOT_ENABLED", controller.buy(accounts[0], 1000002, {from: accounts[0], value: web3.utils.toWei("0.1", "ether")}))

      // can enable voucher only mode
      await assertNoError("can enable voucher only mode",
        controller.setVoucherOnlyMode(1))

      // cannot redeem from an account with no vouchers
      await assertError("USER_HAS_NO_VOUCHERS", controller.redeem(accounts[0], 1000004, {from: accounts[0]}))

      // can redeem from an account with vouchers
      await assertNoError("can redeem voucher", controller.redeem(accounts[8], 1000004, {from: accounts[8]}))

      // cannot redeem more from an account after using their one voucher
      await assertError("USER_HAS_NO_VOUCHERS", controller.redeem(accounts[8], 1000008, {from: accounts[8]}))
    })

    it('should fully unpause collection, allowing both redeem and buy functionality', async function() {
      await assertNoError("can mint new voucher",
        controller.mintVoucher(accounts[9]))

      await assertNoError("can mint new voucher",
        controller.mintVoucher(accounts[9]))

      let numVouchers = await controller.numVouchers(accounts[9])
      assert(numVouchers == 2, "accounts[8] should have 2 voucher")

      await assertNoError("can unpause collection",
        controller.updateCollectionPaused(1, false))

      // can purchase from collection
      await assertNoError("can buy successfully", controller.buy(accounts[0], 1000006, {from: accounts[0], value: web3.utils.toWei("0.1", "ether")}))

      // can redeem from an account with vouchers
      await assertNoError("can redeem voucher", controller.redeem(accounts[9], 1000008, {from: accounts[9]}))

      await assertNoError("can pause collection",
        controller.updateCollectionPaused(1, true))

      // cannot purchase from paused collection
      await assertError("BUY_NOT_ENABLED", controller.buy(accounts[0], 1000002, {from: accounts[0], value: web3.utils.toWei("0.1", "ether")}))

      // cannot redeem voucher from paused collection
      await assertError("REDEEM_NOT_ENABLED", controller.redeem(accounts[8], 1000004, {from: accounts[9]}))

      await assertNoError("can unpause collection",
        controller.updateCollectionPaused(1, false))
    })


    it('should mint several vouchers, and track accordingly', async function() {

      await assertNoError("can setvouchers to 10",
        controller.updateNumVouchers(accounts[6], 10))

      await assertNoError("can mint new voucher",
        controller.mintVoucher(accounts[6]))

      let numVouchers = await controller.numVouchers(accounts[6])
      assert(numVouchers == 11, "accounts[6] should have 11 voucher")

      // can redeem from an account with vouchers
      await assertNoError("can redeem voucher", controller.redeem(accounts[6], 1000010, {from: accounts[6]}))

      // can redeem from an account with vouchers
      await assertNoError("can redeem voucher", controller.redeem(accounts[6], 1000011, {from: accounts[6]}))

      numVouchers = await controller.numVouchers(accounts[6])
      assert(numVouchers == 9, "accounts[6] should have 9 voucher")

      await assertNoError("can setvouchers to 0",
        controller.updateNumVouchers(accounts[6], 0))

      // cannot redeem voucher from paused collection
      await assertError("USER_HAS_NO_VOUCHERS", controller.redeem(accounts[6], 1000012, {from: accounts[6]}))
    })
  })
})