import Block from './block';
import { GENESIS_DATA, MINE_RATE } from '../constants';
import { cryptoHash } from '../util';
import hexToBinary from 'hex-to-binary';

describe('Block', () => {
    const timestamp = 2000;
    const lastHash = 'foo-last-hash';
    const hash = 'foo-hash';
    const data = ['foo-data1', 'foo-data2'];
    const difficulty = 1;
    const nonce = 1; 

    const block = new Block({
        timestamp,
        lastHash,
        hash,
        data,
        difficulty,
        nonce
    });

    it('has a timestamp, hash, lasthash and data property', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.hash).toEqual(hash);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.data).toEqual(data);
        expect(block.difficulty).toEqual(difficulty);
        expect(block.nonce).toEqual(nonce);
    });
    
    describe('genesis', () => {
        const genesisBlock = Block.genesis();

        it('returns a block instance', () => {
            expect(genesisBlock instanceof Block).toEqual(true);
        });

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });

    describe('mineBlock', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({lastBlock, data});

        it('returns a Block instance', () => {
            expect(minedBlock instanceof Block).toEqual(true);
        });

        it('set the `lastHash` to the `hash` of last block', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the `data`', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it('sets the `timestamp`', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('creates a SHA-256 `hash` based on inputs', () => {
            expect(minedBlock.hash).toEqual(cryptoHash(data, lastBlock.hash, minedBlock.timestamp, minedBlock.difficulty, minedBlock.nonce));
        });

        it('sets a hash that maches the difficulty criteria', () => {
            expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual("0".repeat(minedBlock.difficulty));
        });

        it('adjusts difficulty', () => {
            const possibleResult = [lastBlock.difficulty - 1, lastBlock.difficulty + 1];
            expect(possibleResult.includes(minedBlock.difficulty)).toBe(true);
        });
    });

    describe('adjustDifficulty', () => {
        it('raises difficulty to mine quicker', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty + 1);
        });

        it('lowers difficulty to mine slower', () => {
            expect(Block.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(block.difficulty - 1);
        });
    });
});
