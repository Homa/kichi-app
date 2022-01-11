import { cryptoHash } from './crypto-hash';

describe('cryptoHash', () => {
    it('generats correct hash for `foo`', () => {
        expect(cryptoHash('foo')).toEqual('b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b');
    });

    it('generats correct hash for multiple inputs', () => {
        expect(cryptoHash('one', 'two', 'three')).toEqual(cryptoHash('two', 'three', 'one'));
    });
});
