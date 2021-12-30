import { GENESIS_DATA } from './config';
import cryptoHash from './crypto-hash';

class Block {
    constructor({timestamp, data, hash, lastHash, difficulty, nonce}) {
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
        this.lastHash = lastHash;
        this.difficulty = difficulty;
        this.nonce = nonce
    }

    static genesis = () => new this(GENESIS_DATA);

    static mineBlock = ({lastBlock, data}) => {
        let hash, timestamp;

        const { difficulty, hash: lastHash } = lastBlock;
        let nonce = 0;
        const hashStartZeroStr = '0'.repeat(difficulty);

        do {
            nonce ++;
            timestamp = Date.now();
            hash = cryptoHash(data, lastHash, timestamp, difficulty, nonce);
        } while(hash.substring(0, difficulty) !== hashStartZeroStr);

        return new this({
            data: data,
            lastHash,
            timestamp,
            hash,
            difficulty,
            nonce
        });
    }
}

export default Block;
