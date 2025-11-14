// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // 示例提案名称
  const proposalNames = [
    "提案 1: 区块链技术发展计划",
    "提案 2: 数字货币监管政策",
    "提案 3: 去中心化身份认证系统",
    "提案 4: 智能合约安全标准"
  ];

  // 获取合约工厂
  const Voting = await hre.ethers.getContractFactory("Voting");
  
  // 部署合约
  console.log("正在部署投票合约...");
  const voting = await Voting.deploy(proposalNames);
  
  // 等待部署完成
  await voting.deployed();
  
  console.log("投票合约已部署到:", voting.address);
  
  // 验证部署
  const chairperson = await voting.chairperson();
  console.log("主席地址:", chairperson);
  
  const proposalsCount = await voting.proposalsCount();
  console.log("提案数量:", proposalsCount.toString());
  
  // 显示提案信息
  for (let i = 0; i < proposalNames.length; i++) {
    const proposal = await voting.proposals(i);
    console.log(`提案 ${i}: ${proposal.name} (得票: ${proposal.voteCount.toString()})`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });