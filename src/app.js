// 应用状态管理
let appState = {
    provider: null,
    signer: null,
    contract: null,
    account: null,
    chairperson: null,
    proposals: [],
    selectedProposal: null,
    votingEnded: false
};

// 合约ABI
const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "string[]",
                "name": "proposalNames",
                "type": "string[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "voter",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "proposalId",
                "type": "uint256"
            }
        ],
        "name": "VoteCast",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "voter",
                "type": "address"
            }
        ],
        "name": "VoterRegistered",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "chairperson",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "proposalId",
                "type": "uint256"
            }
        ],
        "name": "getProposal",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "voteCount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Voting.Proposal",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllProposals",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "voteCount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Voting.Proposal[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getWinningProposal",
        "outputs": [
            {
                "internalType": "string",
                "name": "winnerName",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "votes",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "voter",
                "type": "address"
            }
        ],
        "name": "registerVoter",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "proposalId",
                "type": "uint256"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "voters",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "endVoting",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "votingEnded",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "winningProposalId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// 合约地址（部署后需要更新）
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";

// DOM元素引用
const elements = {
    connectWallet: document.getElementById('connectWallet'),
    currentAccount: document.getElementById('currentAccount'),
    votingStatus: document.getElementById('votingStatus'),
    userRole: document.getElementById('userRole'),
    adminPanel: document.getElementById('adminPanel'),
    voterAddress: document.getElementById('voterAddress'),
    registerVoter: document.getElementById('registerVoter'),
    proposalsContainer: document.getElementById('proposalsContainer'),
    castVote: document.getElementById('castVote'),
    endVoting: document.getElementById('endVoting'),
    resultsCard: document.getElementById('resultsCard'),
    winnerName: document.getElementById('winnerName'),
    winnerVotes: document.getElementById('winnerVotes'),
    notification: document.getElementById('notification')
};

// 显示通知
function showNotification(message, isSuccess = true) {
    elements.notification.textContent = message;
    elements.notification.className = `notification ${isSuccess ? 'success' : 'error'} show`;
    
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}

// 检查MetaMask是否已安装
async function checkMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        return true;
    } else {
        showNotification('请安装MetaMask钱包扩展', false);
        return false;
    }
}

// 连接钱包
async function connectWallet() {
    if (!await checkMetaMask()) return;

    try {
        // 请求账户访问权限
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        appState.account = accounts[0];
        
        // 更新UI
        elements.currentAccount.textContent = `${appState.account.substring(0, 6)}...${appState.account.substring(38)}`;
        elements.connectWallet.innerHTML = '<i class="fas fa-check"></i> 已连接';
        elements.connectWallet.disabled = true;
        
        // 初始化提供者和签名者
        appState.provider = new ethers.providers.Web3Provider(window.ethereum);
        appState.signer = appState.provider.getSigner();
        
        // 初始化合约
        appState.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, appState.signer);
        
        // 加载应用数据
        await loadAppData();
        
        showNotification('钱包连接成功！');
    } catch (error) {
        console.error('连接钱包失败:', error);
        showNotification('连接钱包失败: ' + error.message, false);
    }
}

// 加载应用数据
async function loadAppData() {
    try {
        // 获取主席信息
        appState.chairperson = await appState.contract.chairperson();
        
        // 检查用户角色
        const isChairperson = appState.account.toLowerCase() === appState.chairperson.toLowerCase();
        elements.userRole.textContent = isChairperson ? '主席' : '普通用户';
        
        // 显示管理员面板（如果是主席）
        if (isChairperson) {
            elements.adminPanel.style.display = 'block';
        }
        
        // 检查投票是否结束
        appState.votingEnded = await appState.contract.votingEnded();
        elements.votingStatus.textContent = appState.votingEnded ? '已结束' : '进行中';
        
        // 如果投票已结束，显示结果
        if (appState.votingEnded) {
            await showResults();
        } else {
            // 否则加载提案
            await loadProposals();
        }
    } catch (error) {
        console.error('加载数据失败:', error);
        showNotification('加载数据失败: ' + error.message, false);
    }
}

// 加载提案
async function loadProposals() {
    try {
        const proposals = await appState.contract.getAllProposals();
        appState.proposals = proposals;
        
        renderProposals(proposals);
    } catch (error) {
        console.error('加载提案失败:', error);
        showNotification('加载提案失败: ' + error.message, false);
    }
}

// 渲染提案
function renderProposals(proposals) {
    if (proposals.length === 0) {
        elements.proposalsContainer.innerHTML = '<p style="text-align: center; color: #666;">暂无提案</p>';
        return;
    }
    
    let html = '<div class="proposals-grid">';
    
    proposals.forEach((proposal, index) => {
        const isSelected = appState.selectedProposal === index;
        html += `
            <div class="proposal-card ${isSelected ? 'selected' : ''}" data-id="${index}">
                <div class="proposal-name">${proposal.name}</div>
                <div class="vote-count">
                    <span>得票数</span>
                    <span class="votes">${proposal.voteCount.toString()}</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    elements.proposalsContainer.innerHTML = html;
    
    // 添加点击事件监听器
    document.querySelectorAll('.proposal-card').forEach(card => {
        card.addEventListener('click', () => {
            const proposalId = parseInt(card.getAttribute('data-id'));
            selectProposal(proposalId);
        });
    });
}

// 选择提案
function selectProposal(proposalId) {
    appState.selectedProposal = proposalId;
    
    // 更新UI选中状态
    document.querySelectorAll('.proposal-card').forEach(card => {
        const id = parseInt(card.getAttribute('data-id'));
        if (id === proposalId) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    
    // 启用投票按钮
    elements.castVote.disabled = false;
}

// 投票
async function castVote() {
    if (appState.selectedProposal === null) {
        showNotification('请选择一个提案进行投票', false);
        return;
    }
    
    if (appState.votingEnded) {
        showNotification('投票已结束', false);
        return;
    }
    
    try {
        const tx = await appState.contract.vote(appState.selectedProposal);
        showNotification('正在处理投票交易...');
        
        await tx.wait();
        showNotification('投票成功！');
        
        // 重新加载提案数据
        await loadProposals();
    } catch (error) {
        console.error('投票失败:', error);
        showNotification('投票失败: ' + error.message, false);
    }
}

// 注册投票者
async function registerVoter() {
    const voterAddress = elements.voterAddress.value.trim();
    
    if (!voterAddress) {
        showNotification('请输入投票者地址', false);
        return;
    }
    
    try {
        const tx = await appState.contract.registerVoter(voterAddress);
        showNotification('正在注册投票者...');
        
        await tx.wait();
        showNotification('投票者注册成功！');
        
        // 清空输入框
        elements.voterAddress.value = '';
    } catch (error) {
        console.error('注册投票者失败:', error);
        showNotification('注册投票者失败: ' + error.message, false);
    }
}

// 结束投票
async function endVoting() {
    try {
        const tx = await appState.contract.endVoting();
        showNotification('正在结束投票...');
        
        await tx.wait();
        showNotification('投票已成功结束！');
        
        // 更新状态
        appState.votingEnded = true;
        elements.votingStatus.textContent = '已结束';
        
        // 显示结果
        await showResults();
    } catch (error) {
        console.error('结束投票失败:', error);
        showNotification('结束投票失败: ' + error.message, false);
    }
}

// 显示投票结果
async function showResults() {
    try {
        const [winnerName, votes] = await appState.contract.getWinningProposal();
        
        elements.winnerName.textContent = winnerName;
        elements.winnerVotes.textContent = `获得 ${votes.toString()} 票`;
        elements.resultsCard.style.display = 'block';
        
        // 隐藏投票区域
        document.querySelector('.card:nth-child(3)').style.display = 'none';
    } catch (error) {
        console.error('获取投票结果失败:', error);
        showNotification('获取投票结果失败: ' + error.message, false);
    }
}

// 监听账户变化
if (window.ethereum) {
    window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
            appState.account = accounts[0];
            elements.currentAccount.textContent = `${appState.account.substring(0, 6)}...${appState.account.substring(38)}`;
            
            // 重新加载数据
            if (appState.contract) {
                await loadAppData();
            }
        } else {
            // 用户断开连接
            location.reload();
        }
    });
}

// 初始化事件监听器
function initEventListeners() {
    elements.connectWallet.addEventListener('click', connectWallet);
    elements.registerVoter.addEventListener('click', registerVoter);
    elements.castVote.addEventListener('click', castVote);
    elements.endVoting.addEventListener('click', endVoting);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
});