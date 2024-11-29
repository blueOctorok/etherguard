const { ethers, network } = require('hardhat')

async function main() {
  console.log('Beginning Deployment...')

  // Deploy  JavaBean
  const JavaBean = await ethers.getContractFactory('JavaBean')
  const javabean = await JavaBean.deploy()
  await javabean.waitForDeployment()
  const javabeanAddress = await javabean.getAddress()
  console.log('JavaBean deployed to:', javabeanAddress)

  // Deploy Analyzer
  const JavaBeanAnalyzer = await ethers.getContractFactory('JavaBeanAnalyzer')
  const analyzer = await JavaBeanAnalyzer.deploy()
  await analyzer.waitForDeployment()
  const analyzerAddress = await analyzer.getAddress()
  console.log('Analyzer deployed to:', analyzerAddress)

  // Connect contracts
  await javabean.setAnalyzer(analyzerAddress)
  console.log('Contracts connected successfully')

  // If we are on a local network, run the seeding
  if (network.name === 'localhost' || network.name === 'hardhat') {
    console.log('Local network detected - running seed script...')
    // Pass the address to the seed script
    const seedFunction = require('./seed.js')
    await seedFunction(javabeanAddress, analyzerAddress)
  }

  console.log('Deployment Complete!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
