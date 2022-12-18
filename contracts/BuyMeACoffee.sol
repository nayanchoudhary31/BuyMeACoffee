// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

contract BuyMeACoffee {
    // Memo Struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //Memo Event
    event NewMemo(
        address indexed from,
        uint256 time,
        string name,
        string message
    );

    // Address of the owner to withdraw funds
    address payable owner;

    //List of all the memos we recieve from coffee purchases
    Memo[] memos;

    constructor() {
        owner = payable(msg.sender);
    }

    /**
    @dev fetches all the memos
    */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    /**
    @dev buy coffee for owner (send ETH and give memos)
    @param _name of the coffee purchaser
    @param _message for the owner
     */

    function buyCoffee(string calldata _name, string calldata _message)
        external
        payable
    {
        // Must Pay More than 0 ETH For Coffee
        require(msg.value > 0, "Can't Buy Coffe for Free!");

        // Store Memo in Storage
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        //Emit New Memo Event with details
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }
}
