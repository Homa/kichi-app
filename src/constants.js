const INITIAL_DIFFICULTY = 3;

// each 1000s -> a block should be added 
const MINE_RATE = 1000;

const GENESIS_DATA = {
    timestamp: 1234567,
    lastHash: '-----',
    hash: 'hash-one',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
};

export { GENESIS_DATA, MINE_RATE };
