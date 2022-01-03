import { START_BALANCE } from '../constants';
import { ec } from '../util/ec';
import cryptoHash from '../util/crypto-hash';

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
