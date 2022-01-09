import Wallet from './index';
import { verifySignature } from '../util';
import Transaction from './transaction';
 
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

    describe('createTransction', () => {
        describe('and the amount exceeds the wallet', () => {
            it('throws an error', () => {
                expect(() => wallet.createTransction({
                    amount: 99999999,
                    recipient: 'a-recipient'
                })).toThrow('amount exceeds balance');
            });
        });

        describe('and the amount is valid', () => {
            let transaction, amount, recipient;
    
            beforeEach(() => {
                amount = 50;
                recipient = 'foo-recipient';
                transaction = wallet.createTransction({amount, recipient});
            });

            it('creates an instance of `Transaction`', () => {
                expect(transaction instanceof Transaction).toBe(true);
            });

            it('matches the transaction input with wallet', () => {
                expect(transaction.input.address).toEqual(wallet.publicKey);
            });

            it('outputs the amount the recipient', () => {
                expect(transaction.outputMap[recipient]).toEqual(amount);
            });
        });
    });
});
