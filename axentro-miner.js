#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const mining = require("./index");
const {
    program
} = require('commander');
program.version('0.0.3');

program
    .requiredOption('-a, --address <address>', 'Your wallet address')
    .option('-n, --node <node>', 'Node url to mine against', 'http://mainnet.axentro.io')
    .option('-p, --process <process>', 'Number of processes to use', 1);

program.parse(process.argv);

clear();

console.log(
    chalk.green(
        figlet.textSync('Axentro', {
            horizontalLayout: 'full'
        })
    ));


console.log(chalk.green('Node: ') + chalk.cyan(program.node));
console.log(chalk.green('Process count: ') + chalk.cyan(program.process));
console.log(chalk.green('Address: ') + chalk.cyan(program.address));
console.log('');

mining(program.node, program.address, program.process);