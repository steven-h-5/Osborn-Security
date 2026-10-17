#!/usr/bin/env bash
# Copies the shared source into extension/ so it can be loaded unpacked in Chrome.
set -e
cd "$(dirname "$0")/.."
rm -rf extension/src extension/assets
mkdir -p extension/assets
cp -r public/src extension/src
[ -d public/assets/images ] && cp -r public/assets/images extension/assets/images
echo "Built. In Chrome: chrome://extensions > Developer mode > Load unpacked > pick the extension/ folder"
