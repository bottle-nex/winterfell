# Multi-stage build for optimized Anchor environment
FROM rust:1.78-slim AS rust-builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    libudev-dev \
    build-essential \
    git \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Solana CLI with error checking
ENV SOLANA_VERSION=1.18.22
RUN curl -sSfL https://release.solana.com/v${SOLANA_VERSION}/install | sh && \
    test -f /root/.local/share/solana/install/active_release/bin/solana || \
    (echo "Solana installation failed"; exit 1)

# Install Anchor CLI
ENV ANCHOR_VERSION=0.30.1
RUN cargo install --git https://github.com/coral-xyz/anchor --tag v${ANCHOR_VERSION} anchor-cli --locked --force

# Stage 2: Final lightweight runtime image
FROM rust:1.78-slim
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    libudev1 \
    curl \
    jq \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy Solana from builder - ensure the full directory structure
COPY --from=rust-builder /root/.local/share/solana /root/.local/share/solana

# Copy Anchor and Rust tools from builder
COPY --from=rust-builder /root/.cargo /root/.cargo

# Set up environment paths (explicitly in ENV so they persist)
ENV PATH="/root/.local/share/solana/install/active_release/bin:/root/.cargo/bin:$PATH"
ENV ANCHOR_WALLET="/root/.config/solana/id.json"

# Create workspace directory
WORKDIR /workspace

# Copy mount script
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