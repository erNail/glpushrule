#!/bin/bash
pip install -r requirements.txt
yarn global add semantic-release@21.0.5
yarn install
echo "export PATH=$PATH:$(yarn global bin)" >>~/.bashrc
