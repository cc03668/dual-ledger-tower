#!/bin/bash
set -e

# ZK Circuit Build Script for SavingsProof
# Prerequisites: circom, snarkjs (npm install -g snarkjs circomlib)
#
# This script:
# 1. Compiles the circom circuit to WASM + R1CS
# 2. Downloads powers of tau ceremony file
# 3. Generates proving/verification keys
# 4. Places artifacts in public/zk/ for browser use

CIRCUIT_NAME="savings_proof"
CIRCUIT_DIR="circuits"
BUILD_DIR="circuits/build"
OUTPUT_DIR="public/zk"
PTAU_FILE="circuits/powersOfTau28_hez_final_12.ptau"
PTAU_URL="https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau"

echo "=== ZK Circuit Build ==="

# Check for circom
if ! command -v circom &> /dev/null; then
    echo "Error: circom not found. Install from https://docs.circom.io/getting-started/installation/"
    exit 1
fi

# Check for snarkjs
if ! command -v snarkjs &> /dev/null; then
    echo "Error: snarkjs not found. Run: npm install -g snarkjs"
    exit 1
fi

# Install circomlib if not present
if [ ! -d "node_modules/circomlib" ]; then
    echo "Installing circomlib..."
    npm install circomlib
fi

# Create build directory
mkdir -p "$BUILD_DIR" "$OUTPUT_DIR"

# Step 1: Compile circuit
echo "Step 1: Compiling circuit..."
circom "$CIRCUIT_DIR/$CIRCUIT_NAME.circom" \
    --r1cs --wasm --sym \
    -l node_modules \
    -o "$BUILD_DIR"

echo "  R1CS: $BUILD_DIR/$CIRCUIT_NAME.r1cs"
echo "  WASM: $BUILD_DIR/${CIRCUIT_NAME}_js/$CIRCUIT_NAME.wasm"

# Step 2: Download powers of tau (if not cached)
if [ ! -f "$PTAU_FILE" ]; then
    echo "Step 2: Downloading powers of tau..."
    curl -L -o "$PTAU_FILE" "$PTAU_URL"
else
    echo "Step 2: Powers of tau already downloaded"
fi

# Step 3: Generate zkey (Groth16 setup)
echo "Step 3: Generating zkey (phase 2 setup)..."
snarkjs groth16 setup \
    "$BUILD_DIR/$CIRCUIT_NAME.r1cs" \
    "$PTAU_FILE" \
    "$BUILD_DIR/${CIRCUIT_NAME}_0000.zkey"

# Contribute to phase 2 ceremony (deterministic for reproducibility)
echo "Step 3b: Contributing to ceremony..."
snarkjs zkey contribute \
    "$BUILD_DIR/${CIRCUIT_NAME}_0000.zkey" \
    "$BUILD_DIR/${CIRCUIT_NAME}_final.zkey" \
    --name="DLT contribution" -v -e="piggy-bank-zk"

# Step 4: Export verification key
echo "Step 4: Exporting verification key..."
snarkjs zkey export verificationkey \
    "$BUILD_DIR/${CIRCUIT_NAME}_final.zkey" \
    "$BUILD_DIR/verification_key.json"

# Step 5: Copy artifacts to public/zk/
echo "Step 5: Copying artifacts to $OUTPUT_DIR..."
cp "$BUILD_DIR/${CIRCUIT_NAME}_js/$CIRCUIT_NAME.wasm" "$OUTPUT_DIR/"
cp "$BUILD_DIR/${CIRCUIT_NAME}_final.zkey" "$OUTPUT_DIR/"
cp "$BUILD_DIR/verification_key.json" "$OUTPUT_DIR/"

echo ""
echo "=== Build complete ==="
echo "Artifacts in $OUTPUT_DIR:"
ls -lh "$OUTPUT_DIR"
echo ""
echo "You can now use the ZK proof feature in the app."
