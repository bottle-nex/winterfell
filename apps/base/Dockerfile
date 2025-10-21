# Multi-stage build for optimized Anchor development environment
# Final image size: ~1.8-2.2 GB (vs 3-4 GB with Ubuntu)

# Stage 1: Build stage with all tools
FROM rust:1.75-slim-bookworm AS builder

# Install build dependencies (including ca-certificates first!)
RUN apt-get update && apt-get install -y \
    ca-certificates \
    build-essential \
    pkg-config \
    libssl-dev \
    libudev-dev \
    curl \
    wget \
    git \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*


# Install Solana CLI with retry logic and better error handling
ENV SOLANA_VERSION=1.18.18
RUN set -e && \
    for i in 1 2 3; do \
    echo "Attempt $i to download Solana CLI..." && \
    curl -sSfL "https://release.solana.com/v${SOLANA_VERSION}/install" -o /tmp/solana-install.sh && \
    sh /tmp/solana-install.sh && \
    if [ -f /root/.local/share/solana/install/active_release/bin/solana ]; then \
    echo "Solana CLI installed successfully!" && \
    /root/.local/share/solana/install/active_release/bin/solana --version && \
    break; \
    fi; \
    echo "Download failed, retrying in 5 seconds..." && \
    sleep 5; \
    done && \
    if [ ! -f /root/.local/share/solana/install/active_release/bin/solana ]; then \
    echo "Failed to install Solana CLI after 3 attempts" && \
    exit 1; \
    fi

# Add Solana to PATH for this stage
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Install Anchor version manager and Anchor
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked --force && \
    /root/.cargo/bin/avm install 0.30.1 && \
    /root/.cargo/bin/avm use 0.30.1

# Stage 2: Runtime stage (slim)
FROM rust:1.75-slim-bookworm

# Install runtime dependencies (including jq for mount-code script)
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    libudev1 \
    curl \
    git \
    procps \
    jq \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*


# Install Node.js 18 LTS (required for Anchor tests and client SDK)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g yarn && \
    npm cache clean --force

# Copy Solana from builder
COPY --from=builder /root/.local/share/solana /root/.local/share/solana
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Copy Cargo binaries (Anchor, AVM)
COPY --from=builder /root/.cargo/bin/anchor /root/.cargo/bin/anchor
COPY --from=builder /root/.cargo/bin/avm /root/.cargo/bin/avm

# Copy Anchor version manager data
COPY --from=builder /root/.avm /root/.avm
ENV PATH="/root/.avm/bin:${PATH}"

# Set environment variables
ENV RUST_BACKTRACE=1
ENV ANCHOR_WALLET=/root/.config/solana/id.json

# Create workspace directory
WORKDIR /workspace

# Pre-create Solana config directory and generate default keypair
RUN mkdir -p /root/.config/solana && \
    solana-keygen new --no-bip39-passphrase --silent -o /root/.config/solana/id.json

# Configure Solana for localhost by default
RUN solana config set --url localhost

# Pre-install common test dependencies globally to speed up first test run
RUN npm install -g @coral-xyz/anchor @solana/web3.js @solana/spl-token && \
    npm cache clean --force

# Copy mount-code script from scripts/ directory
COPY scripts/mount-code.sh /usr/local/bin/mount-code
RUN chmod +x /usr/local/bin/mount-code

# Create healthcheck script
RUN echo '#!/bin/bash\n\
    anchor --version && \
    solana --version && \
    node --version && \
    jq --version' > /usr/local/bin/healthcheck && \
    chmod +x /usr/local/bin/healthcheck

# Create a script for running builds with proper error handling
RUN echo '#!/bin/bash\n\
    set -e\n\
    \n\
    echo "Starting Anchor build..."\n\
    \n\
    # Check if Anchor.toml exists\n\
    if [ ! -f "Anchor.toml" ]; then\n\
    echo "Error: Anchor.toml not found. Are you in an Anchor project directory?"\n\
    exit 1\n\
    fi\n\
    \n\
    # Run anchor build\n\
    anchor build "$@"\n\
    \n\
    echo "Build completed successfully!"\n' > /usr/local/bin/anchor-build && \
    chmod +x /usr/local/bin/anchor-build

# Create a script for running tests with local validator
RUN echo '#!/bin/bash\n\
    set -e\n\
    \n\
    echo "Starting Solana test validator..."\n\
    solana-test-validator --reset --quiet &\n\
    VALIDATOR_PID=$!\n\
    \n\
    # Wait for validator to start\n\
    echo "Waiting for validator to be ready..."\n\
    for i in {1..30}; do\n\
    if solana cluster-version &>/dev/null; then\n\
    echo "Validator is ready!"\n\
    break\n\
    fi\n\
    if [ $i -eq 30 ]; then\n\
    echo "Timeout waiting for validator"\n\
    kill $VALIDATOR_PID 2>/dev/null || true\n\
    exit 1\n\
    fi\n\
    sleep 1\n\
    done\n\
    \n\
    # Run tests\n\
    echo "Running Anchor tests..."\n\
    anchor test --skip-local-validator "$@"\n\
    TEST_EXIT_CODE=$?\n\
    \n\
    # Cleanup\n\
    echo "Stopping validator..."\n\
    kill $VALIDATOR_PID 2>/dev/null || true\n\
    \n\
    exit $TEST_EXIT_CODE' > /usr/local/bin/anchor-test && \
    chmod +x /usr/local/bin/anchor-test

# Verify all tools are working
RUN healthcheck

# Default command
CMD ["/bin/bash"]

# Labels for metadata
LABEL maintainer="Lovable for Anchor"
LABEL description="Optimized Anchor development environment for building and testing Solana smart contracts"
LABEL version="1.0"
LABEL org.opencontainers.image.source="https://github.com/yourorg/anchor-base"
