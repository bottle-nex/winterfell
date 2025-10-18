# Multi-stage build for optimized Anchor environment
# Stage 1: Build stage with full toolchain
FROM rust:1.83-slim AS rust-builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    libudev-dev \
    build-essential \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Solana CLI (LTS version)
ENV SOLANA_VERSION=1.18.22
RUN sh -c "$(curl -sSfL https://release.solana.com/v${SOLANA_VERSION}/install)" && \
    export PATH="/root/.local/share/solana/install/active_release/bin:$PATH" && \
    solana --version

# Install Anchor CLI directly (bypassing avm to avoid version conflicts)
ENV ANCHOR_VERSION=0.30.1
RUN cargo install --git https://github.com/coral-xyz/anchor --tag v${ANCHOR_VERSION} anchor-cli --locked --force && \
    /root/.cargo/bin/anchor --version

# Stage 2: Final lightweight runtime image
FROM rust:1.83-slim

# Install only runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    libudev1 \
    curl \
    jq \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy Solana CLI from builder
COPY --from=rust-builder /root/.local/share/solana /root/.local/share/solana

# Copy Anchor binary from builder
COPY --from=rust-builder /root/.cargo/bin/anchor /usr/local/bin/anchor

# Copy cargo (needed for anchor build)
COPY --from=rust-builder /root/.cargo/bin/cargo /usr/local/bin/cargo
COPY --from=rust-builder /root/.cargo/bin/rustc /usr/local/bin/rustc

# Set up environment paths
ENV PATH="/root/.local/share/solana/install/active_release/bin:/usr/local/bin:$PATH"
ENV ANCHOR_WALLET="/root/.config/solana/id.json"

# Create workspace directory
WORKDIR /workspace

# Copy the FileNode to workspace converter script
COPY scripts/mount-code.sh /usr/local/bin/mount-code
RUN chmod +x /usr/local/bin/mount-code

# Create Solana config directory and generate a keypair
RUN mkdir -p /root/.config/solana && \
    solana-keygen new --no-bip39-passphrase -o /root/.config/solana/id.json -s && \
    solana config set --url localhost

# Verify installations
RUN solana --version && \
    anchor --version && \
    rustc --version

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD anchor --version || exit 1

# Default command
CMD ["/bin/bash"]