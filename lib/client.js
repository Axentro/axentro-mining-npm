const cluster = require('cluster');
const path = require('path');
const protocol = require('./protocol');
const webSocketClient = require('websocket').client;
const client = new webSocketClient();
const {
    v1: uuid
} = require('uuid');

let __connection = null;
let __nprocesses = 0;
let __address = null;

const killMiners = function() {
    for (const id in cluster.workers) {
        console.log(`kill id: ${id}, pid: ${cluster.workers[id].process.pid}`);
        cluster.workers[id].kill();
    }
}

const launchMiners = function() {
    for (let i = 0; i < __nprocesses; i++) {
        const process = cluster.fork();
    }
}

const setup = function(address, mid) {

    const foundNonce = function(message) {
        console.log(`found new nonce! ${message.nonce}`);

        if (__connection) {
            __connection.send(protocol.foundNonce(message.nonce, address, mid));
        }
    }

    for (const id in cluster.workers) {
        cluster.workers[id].on('message', foundNonce);
    }
}

client.on('connectFailed', (error) => {
    console.error(error.toString());
    process.exit(0);
});

client.on('connect', (connection) => {
    try {
        __connection = connection;
        __connection.send(protocol.handshake(__address, __mid));

        connection.on('error', (error) => {
            console.error(error.toString());

            killMiners();
            process.exit(0);
        });

        connection.on('close', () => {
            console.log('connection closed');
            killMiners();
            process.exit(0);
        });

        connection.on('message', (message) => {
            const messageJson = JSON.parse(message.utf8Data);
            const type = messageJson.type;
            const content = messageJson.content;

            switch (parseInt(type)) {
                case 0x002:
                    const accepted = protocol.accepted(content);
                    console.log('Working on block: ' + accepted.block.index);
                    for (const id in cluster.workers) {
                        cluster.workers[id].send({
                            block: accepted.block,
                            difficulty: accepted.difficulty
                        });
                    }

                    break;
                case 0x003:
                    console.error('handshake rejected');
                    console.error(`reason: ${protocol.reason(content)}`);

                    killMiners();
                    process.exit(-1);
                    break;
                case 0x005:
                    const updated = protocol.blockUpdated(content);

                    console.log('kill miners');
                    killMiners();

                    console.log('launch miners');
                    launchMiners();

                    console.log('setup');
                    setup(__address, __mid);

                    console.log('start cluster');
                    for (const id in cluster.workers) {
                        cluster.workers[id].send({
                            block: updated.block,
                            difficulty: updated.difficulty
                        });
                    }

                    break;
                default:
                    console.log(`unknown protocol. message type ${messageJson.type}`);
                    break;
            }
        });
    } catch (err) {
        console.log('error occured ' + err);
    }
});

const connect = function(url, address, nprocesses) {
    try {
        __address = address;
        __nprocesses = nprocesses;
        __mid = uuid().split('-').join('');

        launchMiners();

        setup(__address, __mid);
        client.connect(url + '/peer');
    } catch (err) {
        console.log('error during connect ' + err);
    }
}

exports.connect = connect;