import { START_BALANCE } from '../constants';
import { cryptoHash, ec } from '../util';
import Transaction from './transaction';

class Wallet {
    constructor () {
        this.balance = START_BALANCE;
        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data) {
        return this.keyPair.sign(cryptoHash(data));
    }

    createTransction({amount, recipient}) {
        if (amount > this.balance) {
            throw new Error('amount exceeds balance');
        }

        return new Transaction({senderWallet: this, recipient, amount});
    }
}

export default Wallet;
