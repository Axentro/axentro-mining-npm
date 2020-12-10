const mining = require("./index");

const url = 'http://localhost:3000/peer';
const address = 'VDAwZTdkZGNjYjg1NDA1ZjdhYzk1M2ExMDAzNmY5MjUyYjI0MmMwNGJjZWY4NjA3';
const nprocesses = 1;

mining(url, address, nprocesses);
