class Block {
    constructor(data, hash, lasthash) {
        this.data = data;
        this.hash = hash;
        this.lasthash = lasthash
    }
}

class Blockchain {
    constructor() {
        const genesis = new Block('gen-data', 'gen-hash', 'gen-last-hash')
        this.chain = [genesis];
    }

    addBlock(data) {
        const lasthash = this.chain[this.chain.length - 1].hash;
        const hash = hashFn(data + lasthash);
        const block = new Block(data, hash, lasthash);
        this.chain.push(block);
    }
}

const hashFn = (input) => '*' + input + '*';

const fooBlockchain = new Blockchain();
//const fooBlock = new Block('foo-data', 'foo-hash', 'foo-last-hash');
fooBlockchain.addBlock('foo-data')
console.log(fooBlockchain);
