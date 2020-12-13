# Axentro Miner

This is a Javascript Nodejs package that provides a cross platform miner.

## Install

You must first install a tool called [https://nodejs.org/en/](https://nodejs.org/en/) which will give you the command line tool `npm`. You then use the `npm` tool to install the miner by using the following cli command:

```
npm install axentro-miner -g
``` 

This website has helpful information on how to install Nodejs on the Windows operating system: (Installing Nodejs on Windows)[https://www.guru99.com/download-install-node-js.html]

## Usage

Once you have installed the `axentro-miner` tool using `npm` you find the `axentro-miner` tool has been installed in your cli and you can execute it using this cli command:

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

Currently if you set the --process to a value above 3 or 4 after a while of running it may throw an exception and stop. It will have to be manually restarted in this case. We are working on updates and improvements. This is the first pass of the miner.
