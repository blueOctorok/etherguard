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

  describe('Transfer', () => {
    const transferAmount = '1000'
  })
})
