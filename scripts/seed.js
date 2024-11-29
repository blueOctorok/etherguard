const { ethers } = require('hardhat')

async function main(javabeanAddress, analyzerAddress) {
  console.log('Starting to seed test data...')

  // Get contract instances at their deployed addresses
  const javabean = await ethers.getContractAt('JavaBean', javabeanAddress)
  const analyzer = await ethers.getContractAt(
    'JavaBeanAnalyzer',
    analyzerAddress
  )

  // Get test accounts
  const [owner, user1, user2, user3] = await ethers.getSigners()

  console.log('Creating diverse transaction patterns...')

  // Create a series of transactions with different patterns
  // Space these out to show different timing patterns
  await javabean.transfer(user1.address, ethers.parseUnits('50000', 18))
  console.log('Large transfer to user1 completed')

  // Wait a bit to demonstrate cooldown
  await new Promise((resolve) => setTimeout(resolve, 2000))

  await javabean
    .connect(user1)
    .transfer(user2.address, ethers.parseUnits('20000', 18))
  console.log('Medium transfer from user1 to user2 completed')

  // Create some failed transaction attempts for analysis
  try {
    // Try to transfer too much
    await javabean
      .connect(user1)
      .transfer(user3.address, ethers.parseUnits('1000000', 18))
  } catch (error) {
    console.log('Expected Failure: Transfer amount too high!')
  }

  console.log('Seeding Complete! Summar of data created:')
  console.log('- Multiple successful transfers')
  console.log('- Failed transfer attempts')
  console.log('- Various gas usage patterns')
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
} else {
  module.exports = main
}
