const crypto = require('crypto');

const CORE_VERSION = 1;

const handshake = function(address, mid) {
    const type = 0x001;
    const content = JSON.stringify({
        "version": CORE_VERSION, 
        "mid": mid, 
        "address": address
        });
   
    return JSON.stringify({ type, content });
};

const accepted = function(content) {
    const json = JSON.parse(content);
    const block = json.block;
    
    const difficulty = json.difficulty;

    return { block, difficulty };
};

const rejected = function(content) {
    const reason = JSON.prase(content).reason;
    return reason;
}

const blockUpdated = function(content) {
    const json = JSON.parse(content);
    const block = json.block;

    const difficulty = json.difficulty;

    return { block, difficulty };
};

const foundNonce = function(nonce, address, mid) {
    const type = 0x0004;
    const content = JSON.stringify({
        "nonce": {
            "mid": mid,
            "value": nonce.toString(),
            "timestamp": new Date().getTime(),
            "address": address,
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
