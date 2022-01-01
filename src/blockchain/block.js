import { GENESIS_DATA, MINE_RATE } from '../constants';
import cryptoHash from '../util/crypto-hash';
import hexToBinary from 'hex-to-binary';

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
        let hash, timestamp, difficulty = lastBlock.difficulty, nonce = 0;
        const { hash: lastHash } = lastBlock;

        do {
            nonce ++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp});
            hash = cryptoHash(data, lastHash, timestamp, difficulty, nonce);
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({
            data: data,
            lastHash,
            timestamp,
            hash,
            difficulty,
            nonce
        });
    }

    static adjustDifficulty = ({originalBlock, timestamp}) => {
        const { difficulty, timestamp: timestampPrevBlock } = originalBlock;
        return (timestamp - timestampPrevBlock > MINE_RATE) ? difficulty - 1 : difficulty + 1;
    }
}

export default Block;
