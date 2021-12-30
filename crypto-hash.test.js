import cryptoHash from './crypto-hash';

describe('cryptoHash', () => {
    it('generats correct hash fo `foo`', () => {
        expect(cryptoHash('foo')).toEqual('2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae');
    });

    it('generats correct hash fo `foo`', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('two', 'three', 'one'));
    });
});
