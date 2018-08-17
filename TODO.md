## TODO

### Frontend overview
  Frontend will have three tabs:
    - Profile Tab with Stickers by user, Token Balance, Reward Button, Unwrap Button
    - Market Tab with my item on sale, Items on sale filtered either by stn or user
    - Stats Tab with market Mintable tokens

### Stickers storage
- Stickers Storage Model (for upgradability):
    Store albums of users
    Each user has an album with all stickers
    Create permission system to allow only frontend contract to modify data
    Create emergency system

- Implement getters and setters:
    Get album Stickers
    Get stickers set from the user albums by specifying its stn
    Set stickers to a specific user album specifying a stn
    Remove stickers from a user album

### Stickers unwrap
- Create logic contract:
    Payable function that generate a set of stickers by a user
    Random number generation to create sId and derive stn from sId
    Function that evaluates rarity of a given sId. Use SafeMath.
    Mint tokens based on rarity

- Frontend:
    Create tab to visualize all the stickers in the album divided by stn
    Create button 'Purchase' to buy a stickers pack
    Create unwrap box to visualize the newly generated stickers
    Create box that shows the rarity of all stickers + earnable amount

### Stickers trading
- Create Market Storage Contract:
    Items to be sold, with sId, stn, price, user
    Function to add a item to the market
    Function to remove item from the market
    Getter to retrieve stickers
    Getter to retrieve stickers in market by stn
    Getter to retrieve stickers in market by user
    Create permission system to allow only frontend contract to modify data
    Create emergency system

- Add to Logic Contract:
    Function to create Market
    Function to settle the trade
    Function to revoke the trade
    Address resolver to get the market contract

- Frontend:
    Create specific market tab
    Visualize the list of item on sale
    Visualize your item on sale
    Filter by stn

### Token minting
- Create ERC20 Token Standard:
    Mintable
    Pausable (by owner)
    Burnable (by owner)
    Add transfer function by logic contract

- Add to Logic Contract:
    create minting function during stickers generation
    create burning function during reward receive
    Use token to trade stickers during trades

- Frontend
    Create Balance box in Profile Tab

### Reward withdrawal
- Add to Logic Contract:
    create function that burns token upon album completion verification apply a commission to owner and refund user.
    create selfdestruct for upgradability

- Frontend:
    Add logic button to redeem ETH reward

### -> Toward testnet
- Get a domain
- Migrate contract on rinkeby
- Deploy on IPFS for frontend files storage
- Start Termination Proxy (HAProxy) to run with HTTPS

### Project completion
- Write tests
- Write README.md
- Write user_stories.md
- Write design_pattern_decision.md
- Write avoiding_common_attacks.md
