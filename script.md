# Project Manual

### Flush the evoting database:

```
DROP DATABASE evoting;
CREATE DATABASE evoting;

```

### Recreate the evoting schema with sample data:

```
create table registration(first_name varchar(40),last_name varchar(40),email_address varchar(40) UNIQUE NOT NULL, gender varchar(10),password TEXT NOT NULL);

create table pnr_info(pnrno varchar(20) NOT NULL UNIQUE, Is_registered varchar(10), Dob date, email varchar(40) NOT NULL UNIQUE)

create table admin_registration(email_address varchar(40) NOT NULL UNIQUE,password TEXT);

create table registered_users(accaddress varchar(100) NOT NULL,email varchar(40) DEFAULT NULL);

```

Fill in some data:


```
insert into pnr_info values(100,"NO","2002-03-26","team-mate-mail1@gmail.com");
insert into pnr_info values(101,"NO","2003-03-26","team-mate-mail2@gmail.com");
insert into pnr_info values(102,"NO","2004-03-26","team-mate-mail3@gmail.com");
insert into pnr_info values(103,"NO","2005-03-26","team-mate-mail4@gmail.com");


insert into admin_registration values("belwalkarvarad@gmail.com","password");


```





### Apply this solidity in Remix IDE, Compile and get : ContractAddr
Here, the ABI is hardcoded, as this is not going to change, in case any change, make sure to update the ABI as well.


```
// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract Contest{
	
	struct Contestant{
		uint id;
		string name;
		uint voteCount;
		string party;
		uint age;
		string qualification;
	}

	struct Voter{
		bool hasVoted;
		uint vote;
		bool isRegistered;
	}

	address admin;
	mapping(uint => Contestant) public contestants; 
   // mapping(address => bool) public voters;
    mapping(address => Voter) public voters;
	uint public contestantsCount;
	// uint public counter;
	enum PHASE{reg, voting , done}
	PHASE public state;

	modifier onlyAdmin(){
		require(msg.sender==admin);
		_;
	}
	
	modifier validState(PHASE x){
	    require(state==x);
	    _;
	}

	constructor() public{
		admin=msg.sender;
        state=PHASE.reg;
		// counter = 0;

	}

    function changeState(PHASE x) onlyAdmin public{
		require(x > state);
        state = x;
    }

	function addContestant(string memory _name , string memory _party , uint _age , string memory _qualification) public onlyAdmin validState(PHASE.reg){
		contestantsCount++;
		contestants[contestantsCount]=Contestant(contestantsCount,_name,0,_party,_age,_qualification);
	}

	function voterRegisteration(address user) public onlyAdmin validState(PHASE.reg){
		voters[user].isRegistered=true;
	}

	function vote(uint _contestantId) public validState(PHASE.voting){
        
		require(voters[msg.sender].isRegistered);
		require(!voters[msg.sender].hasVoted);
        require(_contestantId > 0 && _contestantId<=contestantsCount);
		contestants[_contestantId].voteCount++;
		voters[msg.sender].hasVoted=true;
		voters[msg.sender].vote=_contestantId;
	}
}
```

After updating contractaddr, make sure to update the transaction A/C address

### Understand the workflow:

When logged in as Admin, you are capable of,
- Defining new candidate for voting
- registering voters through smart contract API call, by giving A/C address only
- Change the voting phase (register, voting, done)


Now, anyone can create normal user account through signup.

When user signs up, its info is stored in **registration** table.

here, this user doesn't really matter.


The voter-registration functionality in the normal user mode, is taking two params,
- College PNR
- A/C

Here, to verify the holder of original PNR is associating the A/C, we send the OTP to that email for verifying.

After verification, this info about PNR and A/C is stored in **registered_users**, where the **A/C** is associated with **email**.


This means, the user with that **PNR** is now able to cast vote.


But wait, this user is not authorised on blockchain yet!



### Voter Registration on Blockchain


After all voters register themselves after authentication, Admin has to take all the A/C from registered_users and login into his admin account, and register each A/C individually unless automation established.


### How to demonstrate?

After you follow all the above steps, run your project (`npm run dev`)

Register with some account, it really doesn't matter what you create here.
This registration info gets stored in `registration` table.


After this, go to voter registration part, register 2-3 voters, who already has info in `pnr_info` with their A/C.

This will cause an OTP to their email, once authorized, this info will be stored in `registered_users` table.


After this, you registered the voters in the backend, but to actually register them on blockchain, register as admin,

and then register each A/C from `registered_users` in the voter registration part.

This will officially register the voter on blockchain.

So, after this, the voter with any temporary account, can vote, provided that he has access to his metamask account, which serves as security implication.

So when user tries to cast a vote, he will be using his metamask account, and only after authenticating against it on blockchain, his vote will be considered.


After this, add dummy candidates, and let voters vote for them.


After voting, change the phase, see wether phase is really changed, and then, see the result.



















