const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}
class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    // we will be using SHA256 cryptographic
    return SHA256(
      this.timestamp +
        this.previousHash +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
  }

  mineNewBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
      //00000xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    }
    console.log('A new block was mined with hash ' + this.hash);
  }
}

class BlockChain {
  constructor() {
    // the first variable of the array will be the genesis block, created manaully
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 10;
  }

  createGenesisBlock() {
    return new Block('01/01/2018', 'This is the genesis block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineNewBlock(this.difficulty);
    console.log('Block mined successfully');

    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance = balance - trans.amount;
        }
        if (trans.toAddress === address) {
          balance = balance + trans.amount;
        }
      }
    }
    return balance;
  }

  checkBlockChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

let jdCoin = new BlockChain();

transaction1 = new Transaction('Tom', 'Jerry', 100);
jdCoin.createTransaction(transaction1);

transaction2 = new Transaction('Jerry', 'Tom', 30);
jdCoin.createTransaction(transaction2);

console.log('start mining by the miner');
jdCoin.minePendingTransactions('Donald');

console.log('balance for Tom is:' + jdCoin.getBalanceAddress('Tom'));
console.log('balance for Jerry is:' + jdCoin.getBalanceAddress('Jerry'));
console.log(
  'balance for miner Donald is:' + jdCoin.getBalanceAddress('Donald')
);

console.log('start mining by the miner');
jdCoin.minePendingTransactions('Donald');
console.log(
  'balance for miner Donald is:' + jdCoin.getBalanceAddress('Donald')
);

console.log('start mining by the miner');
jdCoin.minePendingTransactions('Donald');
console.log(
  'balance for miner Donald is:' + jdCoin.getBalanceAddress('Donald')
);
