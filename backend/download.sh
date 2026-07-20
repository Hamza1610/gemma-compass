#!/usr/bin/env bash
# Download your model weight files.
#
# Rules:
#   - Must be idempotent (safe to run multiple times).
#   - Must download without any credentials (public URL only).

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODEL_DIR="$HERE/models"
MODEL_FILE="$MODEL_DIR/gemma-4-E4B-it-Q4_K_M.gguf"
EMBED_FILE="$MODEL_DIR/nomic-embed-text-v1.5.Q4_K_M.gguf"

# ── Model URLs ───────────────────────────────────────────────────────────────
MODEL_URL="https://huggingface.co/unsloth/gemma-4-E4B-it-GGUF/resolve/main/gemma-4-E4B-it-Q4_K_M.gguf"
EMBED_URL="https://huggingface.co/nomic-ai/nomic-embed-text-v1.5-GGUF/resolve/main/nomic-embed-text-v1.5.Q4_K_M.gguf"
# ───────────────────────────────────────────────────────────────────────────────

mkdir -p "$MODEL_DIR"

# 1. Download Gemma 4 Chat Model
if [[ -f "$MODEL_FILE" ]]; then
  echo "Gemma 4 model already present at $MODEL_FILE — skipping download"
else
  echo "Downloading $MODEL_URL → $MODEL_FILE (~5.0 GB)…"
  if command -v curl > /dev/null 2>&1; then
    curl -L --fail --progress-bar -o "$MODEL_FILE.partial" "$MODEL_URL"
  elif command -v wget > /dev/null 2>&1; then
    wget --show-progress -O "$MODEL_FILE.partial" "$MODEL_URL"
  else
    echo "error: neither curl nor wget found" >&2
    exit 1
  fi
  mv "$MODEL_FILE.partial" "$MODEL_FILE"
  echo "done: $MODEL_FILE"
fi

# 2. Download Embedding Model
if [[ -f "$EMBED_FILE" ]]; then
  echo "Embedding model already present at $EMBED_FILE — skipping download"
else
  echo "Downloading $EMBED_URL → $EMBED_FILE (~140 MB)…"
  if command -v curl > /dev/null 2>&1; then
    curl -L --fail --progress-bar -o "$EMBED_FILE.partial" "$EMBED_URL"
  elif command -v wget > /dev/null 2>&1; then
    wget --show-progress -O "$EMBED_FILE.partial" "$EMBED_URL"
  else
    echo "error: neither curl nor wget found" >&2
    exit 1
  fi
  mv "$EMBED_FILE.partial" "$EMBED_FILE"
  echo "done: $EMBED_FILE"
fi
