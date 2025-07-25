const crypto = require('crypto');
const bcrypt = require('bcrypt');

module.exports = {
    generateToken() {
        const tokenId = crypto.randomBytes(10).toString('hex');
        const plainText = crypto.randomBytes(40).toString('hex');
        return `${tokenId}|${plainText}`;
    },

    async hashToken(token) {
        const [, plainPart] = token.split('|');
        return bcrypt.hash(plainPart, 10);
    },

    async verifyToken(token, hash) {
        const [, plainPart] = token.split('|');
        return bcrypt.compare(plainPart, hash);
    }
};