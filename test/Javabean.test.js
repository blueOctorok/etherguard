const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = (n) => ethers.parseUnits(n.toString().replace('_', ''), 18)

describe('JavaBean', () => {
  let javabean, owner, user1, user2
  const TOTAL_SUPPLY = '1000000000'

  beforeEach(async () => {
    // Get Accounts
    ;[owner, user1, user2] = await ethers.getSigners()
    const JavaBean = await ethers.getContractFactory('JavaBean')
    javabean = await JavaBean.deploy()
    await javabean.waitForDeployment()
  })

  describe('Deployment', () => {
    it('set correct initial state', async () => {
      expect(await javabean.name()).to.equal('JavaBean')
      expect(await javabean.symbol()).to.equal('JAVA')

      const totalSupply = await javabean.totalSupply()
      expect(totalSupply).to.equal(tokens(TOTAL_SUPPLY))

      // Calculate maxTransactionAmount
      const maxTxAmount = await javabean.maxTransactionAmount()
      const expectedMaxAmount = tokens(TOTAL_SUPPLY.toString()) / 100n
      expect(maxTxAmount).to.equal(expectedMaxAmount)
    })
  })

  describe('Transfers', () => {
    const transferAmount = '1000' // Try to transfer 1000 tokens

    beforeEach(async () => {
      // Owner sends some tokens to user1 for testing
      await javabean.transfer(user1.address, tokens('10000'))
    })

    it('enforces max transaction limit', async () => {
      const tooMuch = '20000000' // More than 1% of total supply
      await expect(
        javabean.transfer(user2.address, tokens(tooMuch))
      ).to.be.rejectedWith('JavaBean: Transfer amount exceeds maximum')
    })

    it('enforces cooldown period', async () => {
      // First transfer should work
      await javabean
        .connect(user1)
        .transfer(user2.address, tokens(transferAmount))

      // Second immediate transfer should fail
      await expect(
        javabean.connect(user1).transfer(user2.address, tokens(transferAmount))
      ).to.be.rejectedWith('JavaBean: Cooldown period active')
    })
  })
})
