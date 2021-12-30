import { GENESIS_DATA } from './config';
import cryptoHash from './crypto-hash';

class Block {
    constructor({timestamp, data, hash, lastHash}) {
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
        this.lastHash = lastHash;
    }

    static genesis = () => new this(GENESIS_DATA);

    static mineBlock = ({lastBlock, data}) => {
        const timestamp = Date.now();
        const lastHash =  lastBlock.hash;

        return new this({
            data: data,
            lastHash,
            timestamp,
            hash: cryptoHash(data, lastHash, timestamp)
        });
    } 
}

export default Block;
