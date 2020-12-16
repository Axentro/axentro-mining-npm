const argon2 = require('argon2');
const crypto = require('crypto');

process.on('message', async function(message) {
    console.log(`Start mining latest difficulty: ${message.difficulty}`);

    while (true) {
        let nonce = await mining(message.block, message.difficulty)
        process.send({
            nonce
        });
    }
});

process.on('error', function(error) {
    console.error(error.toString())
});
process.on('exit', function() {
    /* do nothing */ });

async function validate(block_hash, block_nonce, difficulty) {
    nonce = bnToHex(block_nonce);
    const salt = Buffer.from(nonce);

    const hash = await argon2.hash(block_hash, {
        type: argon2.argon2id,
        hashLength: 512,
        timeCost: 1,
        memoryCost: 65536,
        parallelism: 1,
        raw: true,
        salt
    });

    const bits = Array.from(hash).map(toBits).flat();
    const leading_bits = bits.slice(0, difficulty).join("");
    const result = leading_bits.split("1")[0].length

    return result === difficulty;
}

async function mining(block, difficulty) {
    let nonce = Math.floor(Math.random() * 1000000000000);
    let latestNonce = nonce;
    let latestTime = new Date();

    while (true) {

        const sha256 = crypto.createHash('sha256');

        delete block.timestamp;
        delete block.kind;
        block.nonce = nonce.toString();

        sha256.update(JSON.stringify(block));

        const latestHash = sha256.digest('hex');

        let v = await validate(latestHash, nonce, difficulty);
        if (v) {
            break
        }

        nonce++;

        if ((nonce - latestNonce) % 100 == 0) {
            const nowTime = new Date();
            const nonceDiff = nonce - latestNonce;
            const timeDiff = (nowTime.getTime() - latestTime.getTime()) / 1000.0;

            console.log(`${Math.floor(nonceDiff/timeDiff)} [works/s]`);

            latestNonce = nonce;
            latestTime = nowTime;
        }
    }

    return nonce;
};

function bnToHex(bn) {
    bn = BigInt(bn);

    var pos = true;
    if (bn < 0) {
        pos = false;
        bn = bitnot(bn);
    }

    var hex = bn.toString(16);
    if (hex.length % 2) {
        hex = '0' + hex;
    }

    // if (pos && (0x80 & parseInt(hex.slice(0, 2), 16))) {
    //   hex = '00' + hex;
    // }

    return hex;
}


function toBits(byte) {
    var bits = [];
    for (var x = 7; x >= 0; x--) {
        bits.push((byte & Math.pow(2, x)) >> x);
    }
    return bits;
}


exports.validate = validate;