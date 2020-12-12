# Axentro Miner

This is a Javascript Nodejs package that provides a cross platform miner.

## Install

```
npm install axentro-miner -g
``` 

## Usage

```
axentro-miner -a your-address -n http://mainnet.axentro.io -p 2
```

you can also see the help:

```
axentro-miner --help

Usage: axentro-miner [options]

Options:
  -V, --version            output the version number
  -a, --address <address>  Your wallet address
  -n, --node <node>        Node url to mine against (default:
                           "http://mainnet.axentro.io")
  -p, --process <process>  Number of processes to use (default: 1)
  -h, --help               display help for command
```

## Caveats

Currently if you set the --process to a value above 3 or 4 after a while of running it may throw an exception and stop. It will have to be manally restarted in this case. We are working on updates and improvements. This is the first pass of the miner.
