# Installator

- [Installator](#Installator)
  - [Installation](#installation)
  - [Usage](#usage)
    - [As node script](#as-node-script)
    - [Import in a js file](#import-in-a-js-file)
  - [Current Status](#current-status)
    - [How it works](#how-it-works)
    - [Output](#output)
    - [Limitations](#limitations)
  - [Features to come](#features-to-come)
  - [Contributions](#contributions)
  - [License](#license)
  - [Support](#support)

## Installation

```bash
npm install installator
```

## Usage

You can use either a npm script or import the default function and run it.

### As node script

```bash
"scripts": {
    "installator": "node 'node_modules/installator' -i -r <dirname> -d 2"
}

Options:
  -i, --install
  Required. Boolean param, no value needed just the `-i` part

  -r, --root
  The root directory that contains your package.json

  -d, --depth
  The depth of the dependencies and sub dep/cies that you need installed.
  Default value is 1 (same result as npm i from root)

```

### Import in a js file

Same parameters

Let's say that you create a script.js file on root and add
```js
const installator = require('installator');

installator(__dirname, 2);
```
Then from your terminal
```bash
  node script
```
## Current Status
Installator is an experimental package that installs all dependencies and sub-dependencies in a user defined `root directory` at a user defined `depth level`

### How it works
Currently the whole operation is happening in `1 node process`. That means that if you set a depth level above 1 (which is the default val and gives the same result as npm i), you can take you dog for a walk or go for a weekend excursion (above level 3) and you can check the results when you get back. However your machine will not crush and you can do other stuff on parallel.

The order of installs goes as follows. we start from the `root level` and run `npm i`. Then we take the 1st dependecy and run `npm i`. We keep going down from the first dependency till we reach the defined `depth`. When we reach it then we go to the second dependency. When the base of our pyramid is complete we go to the next floor untill we reach the `root` (dependencies pyramid top). And then we exit the process.

### Output
When you run the script you will see whatever `npm i` outputs as a process. Also an array with all the `dirnames` that run install successfully.

### Limitations
There are packages out there that have as dependency an older version of themselves. To solve the issue of (almost) infinite looped dependencies I implemented a simple solution that checks if we have already run `npm i` in a package with the same name. If yes i skip it. `Meaning that if 2 of our dependencies use e.g. lodash it will be installed only once.`

Also delete the node_modules of your specified `root dir` before and after usage

## Features to come
* User specified amount of parallel threads
* Pre-install and Post-install callbacks
* Richer output

## Contributions
I would very much appreciate any [code](https://github.com/Falenos/installator) contributions. Either to solve our limitations or create more features.

## License

[ISC](https://en.wikipedia.org/wiki/ISC_license)

## Support
Installator is supported on Node 8 and above.