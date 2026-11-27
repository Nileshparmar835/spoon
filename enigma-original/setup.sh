#!/usr/bin/env bash
set -eu
cd "$(dirname "$0")"
for tool in python3.12 node npm ffmpeg ffprobe; do
  command -v "$tool" >/dev/null || { echo "Install $tool and run setup again."; exit 1; }
done
python3.12 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
npm install --no-audit --no-fund
