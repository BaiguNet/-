// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // 投票事件
    event VoteCast(address indexed voter, uint indexed proposalId);
    event ProposalCreated(uint indexed proposalId, string name);
    event VoterRegistered(address indexed voter);

    // 提案结构
    struct Proposal {
        uint id;
        string name;
        uint voteCount;
    }

    // 状态变量
    address public chairperson;
    mapping(address => bool) public voters;
    mapping(uint => Proposal) public proposals;
    uint public proposalsCount;
    bool public votingEnded;
    uint public winningProposalId;

    // 修饰符
    modifier onlyChairperson() {
        require(msg.sender == chairperson, "Only chairperson can call this function");
        _;
    }

    modifier onlyVoter() {
        require(voters[msg.sender], "Only registered voters can call this function");
        _;
    }

    modifier votingNotEnded() {
        require(!votingEnded, "Voting has ended");
        _;
    }

    // 构造函数
    constructor(string[] memory proposalNames) {
        chairperson = msg.sender;
        voters[chairperson] = true;
        
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals[i] = Proposal({
                id: i,
                name: proposalNames[i],
                voteCount: 0
            });
            proposalsCount++;
        }
    }

    // 注册投票者
    function registerVoter(address voter) public onlyChairperson {
        voters[voter] = true;
        emit VoterRegistered(voter);
    }

    // 投票
    function vote(uint proposalId) public onlyVoter votingNotEnded {
        require(proposalId < proposalsCount, "Invalid proposal ID");

        proposals[proposalId].voteCount++;
        emit VoteCast(msg.sender, proposalId);
    }

    // 结束投票
    function endVoting() public onlyChairperson votingNotEnded {
        votingEnded = true;
        
        uint maxVotes = 0;
        for (uint i = 0; i < proposalsCount; i++) {
            if (proposals[i].voteCount > maxVotes) {
                maxVotes = proposals[i].voteCount;
                winningProposalId = i;
            }
        }
    }

    // 获取获胜提案
    function getWinningProposal() public view returns (string memory winnerName, uint votes) {
        require(votingEnded, "Voting not ended yet");
        Proposal memory winner = proposals[winningProposalId];
        return (winner.name, winner.voteCount);
    }

    // 获取所有提案
    function getAllProposals() public view returns (Proposal[] memory) {
        Proposal[] memory allProposals = new Proposal[](proposalsCount);
        for (uint i = 0; i < proposalsCount; i++) {
            allProposals[i] = proposals[i];
        }
        return allProposals;
    }

    // 获取特定提案
    function getProposal(uint proposalId) public view returns (Proposal memory) {
        require(proposalId < proposalsCount, "Invalid proposal ID");
        return proposals[proposalId];
    }
}