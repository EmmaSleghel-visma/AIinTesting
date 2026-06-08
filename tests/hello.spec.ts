import { expect } from 'chai';

describe('Application Tests', () => {
    it('should return true for a valid condition', () => {
        expect(true).to.equal(true);
    });

    it('should return the correct sum', () => {
        const sum = (a, b) => a + b;
        expect(sum(1, 2)).to.equal(3);
    });
});