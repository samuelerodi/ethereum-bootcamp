# Design Pattern Decisions

## Emergency Stop
The contracts use the Pausable OpenZeppelin's contract implementation and use the whenNotPaused modifier on all the critical external functions to be used in case of emergency.

## Restricting access
The contracts have a few configuration functions that have restricted access to the owner only. Among these, we have emergency stop functions, upgrade, album generation, order book and tips management functions.

## Upgradability
The contract upgradability has been achieved using a Frontend-Backend contract design. In this case the backend storage contracts (which are the ERC20 coin contract and ERC721 asset contract) has been separated from the logic contract. The coin contract and asset contract are fully OpenZeppelin's token standard with minimal variations to make it capable of interacting with the logic contract. The storage contracts are Backend contracts that allow only a Frontend logic contract to call certain critical functions needed by the logic, precisely the minting and burning functions.
This allows to replace the logic without having to worry about any asset migration. Indeed in such a case it would be enough to substitute the logic contract and change the frontend of the two backend contract with the new contract address.
The only sensitive storage data that might currently be lost during a contract upgrade is the order book used for the stickers marketplace. It has been embedded into the logic contract for sake of simplicity as it is not deemed valuable, but it could also have been implemented using the same Frontend-Backend separation paradigm.

## Near-complete asset ownership
Upgradability patterns usually cause some trust issues when dealing with contracts storing valuable assets. In fact, having the power to replace a contract could also provide the power of modifying contract data, thus creating an artificial need of trust by the final users toward the contract creator.
In this case, the separation of the ERC20 and ERC721 storage contracts from logic allows for minimal need of trust. The storage contracts are considered immutable and irreplaceable once in production environment and the logic frontend contract will be the only one having the power to mint and burn tokens. These are also the only functions allowed to the frontend contract.
Also, owner transferhip features used for the marketplace, have been implemented using a specific approval schema which allows the logic contract to withdraw assets from a user account only upon user approval instead of making a direct transfer to the user account. This prevents any potential illicit transfer operation by a platform administrator or the logic contract itself without the asset owner approval. Thus it guarantees a near-complete asset ownership to the final users with minimal need of trust toward the platform admins.
