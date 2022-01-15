import TransactionPool from "./transaction-pool";
import Transaction from './transaction';
import Wallet from './index';

describe('TransactionPool', () => {
    let transaction, transactionPool;

    beforeEach(() => {
        transactionPool = new transactionPool();
        transaction = new Transaction({
            senderWallet: new Wallet(),
            recipient: 'a-recipient',
            amount: 50
        });
    });
});