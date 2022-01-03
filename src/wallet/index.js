import { START_BALANCE } from '../constants';
import { cryptoHash, ec } from '../util';

class Wallet {
    constructor () {
        this.balance = START_BALANCE;
        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data) {
        return this.keyPair.sign(cryptoHash(data));
    }

}

export default Wallet;
