const { ethers } = require('hardhat')

async function main() {
  console.log('Starting to seed test data...')

  // Fetch contract addresses from environment variables
  const javabeanAddress = javabeanAddressParam || process.env.JAVABEAN_ADDRESS
  const analyzerAddress = analyzerAddressParam || process.env.ANALYZER_ADDRESS

  // Validate input
  if (!javabeanAddress || !analyzerAddress) {
    console.error('❌ ERROR: Contract addresses not provided!')
    console.error('Set the environment variables before running the script.')
    console.error(
      'Example: JAVABEAN_ADDRESS=0x... ANALYZER_ADDRESS=0x... npx hardhat run scripts/seed.js --network localhost'
    )
    process.exit(1)
  }

  // Get contract instances at their deployed addresses
  const javabean = await ethers.getContractAt('JavaBean', javabeanAddress)
  const analyzer = await ethers.getContractAt(
    'JavaBeanAnalyzer',
    analyzerAddress
  )

  // Get test accounts
  const [owner, user1, user2, user3] = await ethers.getSigners()

  console.log('Creating diverse transaction patterns...')

  // Create a series of transactions
  await javabean.transfer(user1.address, ethers.parseUnits('50000', 18))
  console.log('✅ Large transfer to user1 completed')

  // Wait to demonstrate cooldown
  await new Promise((resolve) => setTimeout(resolve, 2000))

  await javabean
    .connect(user1)
    .transfer(user2.address, ethers.parseUnits('20000', 18))
  console.log('✅ Medium transfer from user1 to user2 completed')

  try {
    await javabean
      .connect(user1)
      .transfer(user3.address, ethers.parseUnits('1000000', 18))
  } catch (error) {
    console.log('✅ Expected Failure: Transfer amount too high!')
  }

  console.log('✅ Seeding Complete! Summary of data created:')
  console.log('- Multiple successful transfers')
  console.log('- Failed transfer attempts')
  console.log('- Various gas usage patterns')
}

// Ensure script runs properly in Hardhat
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
