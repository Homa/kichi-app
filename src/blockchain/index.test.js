import Block from './block';
import Blockchain from './index';
import cryptoHash from '../util/crypto-hash';

describe('Blockchain', () => {
    let blockchain, newChain, originalChain;

    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        originalChain = blockchain.chain;
    });

    it('has array of chains', () => {
        expect(blockchain.chain instanceof Array).toBeTruthy();
    });

    it('starts with genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('add a new block to chain', () => {
        const newData = 'new data';
        blockchain.addBlock({data: newData});
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });

    describe('isValidChain', () => {
        // Rule 1: block chain should start with genesis block
        describe('when chain does not start with genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = {data: 'fake'};
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('when starts with genesis block and has multiple blocks', () => {
            beforeEach(() => {
                blockchain.addBlock({data: 'one'});
                blockchain.addBlock({data: 'two'});
                blockchain.addBlock({data: 'three'});
            });

            describe('and a lastHash reference has changed', () => {
                it('returns false', () => {
                    blockchain.chain[2].lastHash = 'fake-last-hash';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain contains a block with an invalid field', () => {
                it('returns false', () => {
                    blockchain.chain[2].data = 'fake-data';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and chain deos not contain a block with an invalid block', () => {
                it('returns true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });

            describe('and the chain contains a block with a jumped difficulty', () => {
                it('returns false', () => {
                    const lastBlock = blockchain.chain[blockchain.chain.length - 1];
                    const lastHash = lastBlock.hash;
                    const timestamp = Date.now();
                    const nonce = 0;
                    const data = [];
                    const difficulty = lastBlock.difficulty - 3;
                    const hash = cryptoHash(data, timestamp, lastHash, difficulty, nonce);
                    
                    const badBlock = new Block({data, hash, timestamp, lastHash, difficulty, nonce});
                    blockchain.chain.push(badBlock); 
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
        });
    });

    describe('replaceChain()', () => {
        
        describe('when the new chain is not longer', () => {
            it('does not replace the new chain', () => {
                // change genesis block to 
                newChain[0] = {new: 'chain'};
                blockchain.replaceChain(newChain.chain);
                expect(blockchain.chain).toEqual(originalChain);
            });
        });

        describe('when the new chain is longer', () => {
            beforeEach(() => {
                newChain.addBlock({data: 'new one'});
                newChain.addBlock({data: 'new two'});
                newChain.addBlock({data: 'new three'});
            });

            describe('and chain is valid', () => {
                it('replaces the chain', () => {
                    blockchain.replaceChain(newChain.chain);
                    expect(blockchain.chain).toEqual(newChain.chain);
                });
            });

            describe('and chain is invalid', () => {
                it('does not replace the new chain', () => {
                    newChain.chain[2].hash = 'a-hash';
                    blockchain.replaceChain(newChain.chain);
                    expect(blockchain.chain).toEqual(originalChain);
                });
            });
        });
    });
});
