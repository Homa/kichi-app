import Block from './block';
import { GENESIS_DATA } from './config';
import cryptoHash from './crypto-hash';

describe('Block', () => {
    const timestamp = '1234567';
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
        const block = Block.mineBlock({lastBlock, data});

        it('returns a Block instance', () => {
            expect(block instanceof Block).toEqual(true);     
        });

        it('set the `lastHash` to the `hash` of last block', () => {
            expect(block.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the `data`', () => {
            expect(block.data).toEqual(data);
        });

        it('sets the `timestamp`', () => {
            expect(block.timestamp).not.toEqual(undefined);
        });

        it('creates a SHA-256 `hash` based on inputs', () => {
            expect(block.hash).toEqual(cryptoHash(data, block.timestamp, lastBlock.hash, block.difficulty, block.nonce));
        });

        it('sets a hash that maches the difficulty criteria', () => {
            expect(block.hash.substring(0, block.difficulty)).toEqual("0".repeat(block.difficulty));
        });
    })
});
