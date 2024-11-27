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

  describe('Owner functions', () => {
    let mockToken

    beforeEach(async () => {
      // Deploy a fresh mock token before each test
      const MockToken = await ethers.getContractFactory('JavaBean')
      mockToken = await MockToken.deploy()
      await mockToken.waitForDeployment()
    })

    it('allows owner to pause and unpause', async () => {
      // Pause
      await javabean.pause()
      expect(await javabean.paused()).to.equal(true)

      // Try transfer while paused
      await expect(javabean.transfer(user1.address, tokens('1000'))).to.be
        .reverted

      // Unpause
      await javabean.unpause()
      expect(await javabean.paused()).to.equal(false)

      // Transfer should now work
      await expect(javabean.transfer(user1.address, tokens('1000'))).to.not.be
        .reverted
    })

    it('allows recovery of accidentally sent tokens', async () => {
      const javaBeanAddress = await javabean.getAddress()
      const mockTokenAddress = await mockToken.getAddress()

      // First send some mock tokens to our JavaBean contract
      await mockToken.transfer(javaBeanAddress, tokens('1000'))

      // Get initial balance
      const initialBalance = await mockToken.balanceOf(owner.address)

      // Recover the tokens
      await javabean.recoverERC20(mockTokenAddress, tokens('1000'))

      // Check if tokens were recovered
      const finalBalance = await mockToken.balanceOf(owner.address)
      expect(finalBalance - initialBalance).to.equal(tokens('1000'))
    })
  })

  describe('Security Edge Cases', () => {
    it('prevents recovery of JavaBean tokens', async () => {
      const javaBeanAddress = await javabean.getAddress()
      await expect(
        javabean.recoverERC20(javaBeanAddress, tokens('1'))
      ).to.be.revertedWith('JavaBean: Cannot recover JavaBean tokens')
    })

    it('only owner can set max transaction amount', async () => {
      // Try as non-owner
      await expect(javabean.connect(user1).setMaxTransactionAmount(tokens('1')))
        .to.be.reverted

      // Owner can do it
      await expect(javabean.setMaxTransactionAmount(tokens('2000000'))).to.not
        .be.reverted

      // Verify the change
      const newMaxAmount = await javabean.maxTransactionAmount()
      expect(newMaxAmount).to.equal(tokens('2000000'))
    })
  })

  describe('Gas Analysis Integration', () => {
    let analyzer

    beforeEach(async () => {
      // Deploy analyzer first
      const JavaBeanAnalyzer =
        await ethers.getContractFactory('JavaBeanAnalyzer')
      analyzer = await JavaBeanAnalyzer.deploy()
      await analyzer.waitForDeployment()

      // Set analyzer in JavaBean
      await javabean.setAnalyzer(await analyzer.getAddress())
    })

    it('should record gas usage during transfers', async () => {
      // Do a transfer
      await javabean.transfer(user1.address, tokens('1000'))

      // Check if gas was recorded
      const [totalGas, calls] = await analyzer.getGasInfo('transfer')
      expect(calls).to.equal(1n)
      expect(totalGas).to.be.gt(0n) // Gas should be greater than 0
    })
  })
})
