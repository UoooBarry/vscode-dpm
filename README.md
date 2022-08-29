# README

[![Code Style](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
![auto-test](https://github.com/UoooBarry/vscode-dpm/actions/workflows/node.js.yml/badge.svg)

Integrate [DPM](https://github.com/songhuangcn/dpm) to VsCode. Easily start any docker images without complicated configurations.

Published on [VsCode Marketplace](https://marketplace.visualstudio.com/items?itemName=UoooBarry.dpm-vscode).

## Supported Packages

You can check current supported packages list on [DPM](https://github.com/songhuangcn/dpm/tree/main/packages) repository.

## Prerequisites

This extension relies on [DPM](https://github.com/songhuangcn/dpm) project. Install DPM first is necessary.

### Docker

Ensure [Docker](https://www.docker.com/products/docker-desktop/) is running.

### Ruby

Check if ruby exists in your system.

```bash
ruby -v
```

If you do not have ruby, you can install it either using [Rbenv](https://github.com/rbenv/rbenv), [RVM](https://rvm.io/)

Or Just using brew:

```bash
brew install ruby
```

### DPM

```bash
gem install dpmrb
```

## Usage

<center>

Add a supported package.

![new-start-package](./docs/assets/gifs/save-start.gif)

Add an unsupported package using raw mode.

![raw-start-package](./docs/assets/gifs/raw-packages.gif)

</center>
