const crypto = require('crypto');

const CORE_VERSION = 1;

const handshake = function(address) {
    const type = 0x001;
    const content = JSON.stringify({
        "version": CORE_VERSION, 
        "mid": "535061bddb0549f691c8b9c012a55ee2", 
        "address": address
        });
   
    return JSON.stringify({ type, content });
};

const accepted = function(content) {
    const json = JSON.parse(content);
    const block = json.block;
    const sha256 = crypto.createHash('sha256');

    sha256.update(JSON.stringify(block));

    const latestHash = sha256.digest('hex');
    const difficulty = json.difficulty;

    return { latestHash, difficulty };
};

const rejected = function(content) {
    const reason = JSON.prase(content).reason;
    return reason;
}

const blockUpdated = function(content) {
    const json = JSON.parse(content);
    const block = json.block;
    const sha256 = crypto.createHash('sha256');

    sha256.update(JSON.stringify(block));

    const latestHash = sha256.digest('hex');
    const difficulty = json.difficulty;

    return { latestHash, difficulty };
};

const foundNonce = function(nonce) {
    const type = 0x0004;
    const content = JSON.stringify({
        "nonce": {
            "mid": "0",
            "value": nonce.toString(),
            "timestamp": new Date().getTime(),
            "address": "VDAwZTdkZGNjYjg1NDA1ZjdhYzk1M2ExMDAzNmY5MjUyYjI0MmMwNGJjZWY4NjA3",
            "node_id": "0"
        }
    })

    return JSON.stringify({ type, content });
}

exports.handshake = handshake;
exports.accepted = accepted;
exports.rejected = rejected;
exports.blockUpdated = blockUpdated;
exports.foundNonce = foundNonce;
