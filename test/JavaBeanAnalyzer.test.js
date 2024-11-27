const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('JavaBeanAnalyzer', () => {
  let analyzer, owner, user1

  beforeEach(async () => {
    // Get test accounts
    ;[owner, user1] = await ethers.getSigners()

    // Deploy analyzer
    const JavaBeanAnalyzer = await ethers.getContractFactory('JavaBeanAnalyzer')
    analyzer = await JavaBeanAnalyzer.deploy()
    await analyzer.waitForDeployment()
  })

  describe('Basic Functionality', () => {
    it('should record gas usage correctly', async () => {
      // Record some gas usage
      await analyzer.recordGasUsage('transfer', 21000)

      // Get the recorded info
      const [totalGas, calls, avgGas, minGas, maxGas] =
        await analyzer.getGasInfo('transfer')

      // Verify the statistics
      // Using BigInt for numeric comparisons
      expect(calls).to.equal(1n)
      expect(totalGas).to.equal(21000n)
      expect(avgGas).to.equal(21000n)
      expect(minGas).to.equal(21000n)
      expect(maxGas).to.equal(21000n)
    })
  })
})
