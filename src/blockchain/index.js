import Block from './block';
import { cryptoHash } from '../util';
import isEqual from 'lodash/isEqual';

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock = ({data}) => {
        const block = Block.mineBlock({
            data, 
            lastBlock: this.chain[this.chain.length - 1]
        });
        this.chain.push(block);
    }

    replaceChain = (newChain) => {
        if (this.chain.length >= newChain.length) return;

        if (Blockchain.isValidChain(newChain)) {
            this.chain = newChain;
        }
    }

    static isValidChain = (chain) => {
        if (!isEqual(chain[0], Block.genesis())) return false;

        for (let i = 1, max = chain.length; i < max; i++) {
            const block = chain[i];
            const actualLastHash = chain[i - 1].hash;
            const lastDifficulty = chain[i - 1].difficulty;

            const {timestamp, lastHash, hash, data, difficulty, nonce} = block;
            if (lastHash !== actualLastHash) return false;
            if (Math.abs(lastDifficulty - difficulty) > 1) return false;
            if (hash !== cryptoHash(timestamp, lastHash, data, difficulty, nonce)) return false;
        }
        return true;
    }
}

export default Blockchain;
