# 去中心化投票系统 DApp

一个基于以太坊区块链的去中心化投票系统，具有透明、安全、不可篡改的特性。

## 功能特点

- 基于以太坊智能合约的去中心化投票
- 美观现代的响应式用户界面
- 支持多种网络部署（本地、测试网、主网）
- 完整的管理员功能（注册投票者、结束投票等）
- 实时投票结果显示

## 技术栈

- Solidity (智能合约)
- JavaScript/HTML/CSS (前端界面)
- Ethers.js (区块链交互)
- Hardhat (开发工具)
- Vite (前端构建工具)

## 安装和设置

### 1. 克隆项目

```bash
git clone <repository-url>
cd voting-dapp
```

### 2. 安装依赖

```bash
npm install
```

### 3. 编译智能合约

```bash
npx hardhat compile
```

### 4. 本地测试网络部署

启动本地测试网络：
```bash
npx hardhat node
```

在新终端窗口中部署合约：
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 5. 更新前端配置

将部署脚本输出的合约地址更新到 [src/app.js](file:///c%3A/Users/Administrator/Desktop/team/voting-dapp/src/app.js) 文件中的 `CONTRACT_ADDRESS` 变量。

### 6. 启动开发服务器

```bash
npm run dev
```

## 使用说明

1. 打开浏览器访问 `http://localhost:3000`
2. 连接 MetaMask 钱包
3. 如果你是合约部署者，你将自动成为主席并可以访问管理员功能
4. 主席可以注册其他投票者地址
5. 所有注册的投票者都可以参与投票
6. 主席可以结束投票并查看最终结果

## 智能合约功能

### 角色
- **主席**: 部署合约的地址，可以注册投票者和结束投票
- **投票者**: 经过注册的地址，可以参与投票

### 主要方法
- `registerVoter(address voter)`: 主席注册新的投票者
- `vote(uint proposalId)`: 投票者对指定提案投票
- `endVoting()`: 主席结束投票并计算获胜提案
- `getWinningProposal()`: 获取获胜提案信息

## 测试网部署

要部署到以太坊测试网：

1. 复制 [.env.example](file:///c%3A/Users/Administrator/Desktop/team/voting-dapp/.env.example) 到 `.env` 并填写相关信息
2. 运行部署命令：
```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

支持的网络包括: ropsten, rinkeby, kovan, goerli

## 许可证

MIT License