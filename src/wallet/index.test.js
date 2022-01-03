import Wallet from './index';
import { verifySignature } from '../util/ec';
 
describe('Wallet', () => {
    let wallet;
    
    beforeEach(() => {
        wallet = new Wallet();
    });

    it('has a `balance`', () => {
        expect(wallet).toHaveProperty('balance');
    });

    it('has a `publicKey`', () => {
        expect(wallet).toHaveProperty('publicKey');
    });

    describe('signing data', () => {
        const data = 'some-data';
        it('verifies a signatue', () => {
            expect(verifySignature({
                publicKey: wallet.publicKey,
                data,
                signature: wallet.sign(data)
            })).toBe(true);
        });
        it('does not verify an invalid signatire', () => {
            // sign with another wallet data
            expect(verifySignature({
                publicKey: wallet.publicKey,
                data,
                signature: new Wallet().sign(data)
            })).toBe(false);
        });
    });
});
