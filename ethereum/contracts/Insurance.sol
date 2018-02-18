pragma solidity ^0.4.20;

contract InsuranceFactory {
    address[] private deployedInsurances;
    
    function createInsurance(uint contractDuration) public payable {
        deployedInsurances.push(new Insurance(contractDuration, msg.sender));
    }
    
    function getDeployedInsurances() public view returns (address[]) {
        return deployedInsurances;
    }
}

contract Insurance {
    struct RequestLock {
        string description;
        bool requested;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    address private ADMIN_ADDRESS = 0x5A9F75d0899787dD6787E5F697236256a4F2B783;
    
    address private insured; // people who hold this contract
    uint private premium; // amount of moeny that insured should pay
    // -1: unKnown, 0: claimable for contributors, 1: claimable for insured
    int private status = -1;
    bool private isLocked = false; // whether this contract is locked
    address[] private contributorList;
    mapping(address => uint) private contributors;
    mapping(address => bool) private claimers;
    address[] private claimerList;
    RequestLock private requestLock; // insured's request to lock the contract
    uint private contractDuration; // how long this contract will keep open
    uint private contractStartTime; // the time when this contract created
    
    modifier onGoingOnly() {
        require(!checkLockByDuration());
        require(status == -1);
        require(!isLocked);
        _;
    }
    
    modifier completedOnly() {
        require(status != -1);
        require(isLocked);
        _;
    }
    
    modifier validPay() {
        // should have enough balance to contribute
        require(msg.sender.balance >= msg.value);
        // avoid contribute overflow
        require(this.balance <= premium * 2);
        _;
    }
    
    function Insurance(uint duration, address creator) public {
        require(duration > 0);
        
        contractDuration = duration;
        contractStartTime = block.timestamp;
        insured = creator;
        claimers[creator] = true;
    }
    
    function premiumCharge() public payable {
        require(msg.sender == insured);
        require(msg.value > 0);
        
        premium = msg.value;
    }
    
    // let contributor try to match (partial)the premium
    function contribute() public onGoingOnly validPay payable {
        require(msg.value > 0);
        // should not be insured
        require(msg.sender != insured);
        // only public when insured initial contibution
        require(premium > 0);
        
        // lock if matched all premium
        isLocked = this.balance >= premium * 2;
        
        // only allow single contribution for single contributor
        contributors[msg.sender] = msg.value;
        claimers[msg.sender] = true;
        contributorList.push(msg.sender);
    }
    
    // when contract result is known, claim process is started
    function claim() public completedOnly {
        // only claimable after contract completed
        require(status != -1);
        require(isLocked);
        // should have been contributed
        require(msg.sender == insured || contributors[msg.sender] > 0);
        
        if(status == 1 && msg.sender == insured) {
            insured.transfer(this.balance);
        } else if(status == 0 && msg.sender != insured) {
            msg.sender.transfer(contributors[msg.sender] * 2);
        }
        
        claimers[msg.sender] = false;
        claimerList.push(msg.sender);
    }
    
    // insured can request to lock contract if he want to lock contract
    // before all the premium get matched
    function createRequestLock(string description) public onGoingOnly {
        require(msg.sender == insured);
        require(!requestLock.requested);
        
        requestLock = RequestLock({
            description: description,
            requested: true,
            complete: false,
            approvalCount: 0
        });
    }
    
    // contributors can approve insured's request to lock contract eariler
    function approveRequest() public onGoingOnly {
        require(requestLock.requested);
        require(!requestLock.complete);
        
        require(contributors[msg.sender] > 0);
        require(!requestLock.approvals[msg.sender]);
        
        requestLock.approvals[msg.sender] = true;
        requestLock.approvalCount++;
        
        // if over half people agree, lock it
        if(requestLock.approvalCount > contributorList.length / 2) {
            isLocked = true;
            // if requestLock is on going, force it complete
            requestLock.complete = true;
        }
    }
    
    function setStatus(int s) public {
        require(msg.sender == ADMIN_ADDRESS);
        require(status == -1);
        require(checkLockByDuration());
        
        status = s;
    }
    
    // insured want to cancel the contract
    function cancelContract() public payable {
        require(msg.sender == insured);
        
        // only able to cancelInsurance if no any contributors yet
        if(contributorList.length == 0 || this.balance > 0) {
            insured.transfer(this.balance);
        }
        
        _finalizeState();
    }
    
    // check contract duration to determind whether to lock the contract
    // it will be called by the timer in the server side
    function checkLockByDuration() public returns(bool) {
        if(block.timestamp - contractStartTime >= contractDuration) {
            _finalizeState();
        }
        return isLocked;
    }
    
    function _finalizeState() private {
        isLocked = true;
            
        if(requestLock.requested && !requestLock.complete) {
            requestLock.complete = true;
        }
    }
    
    function isClaimable(address caller) public view returns(bool) {
        return isLocked && status != -1 && claimers[caller] && 
        ((caller!= insured && status == 0) || (caller == insured && status == 1));
    }
    
    function getSummary() public view returns (
        address, uint, uint, int, bool, address[], address[], uint, uint
    ) {
        return (
            insured,
            premium,
            this.balance,
            status,
            isLocked,
            contributorList,
            claimerList,
            contractStartTime,
            contractDuration
        );
    }
}