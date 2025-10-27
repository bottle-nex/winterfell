FROM rust:1.78-slim-bookworm

# ----------------------------
# Environment variables
# ----------------------------
ENV DEBIAN_FRONTEND=noninteractive
ENV SOLANA_RELEASE=v1.18.22
ENV ANCHOR_CLI_TAG=v0.29.0
ENV ANCHOR_WALLET=/root/.config/solana/id.json
ENV PATH="/root/.local/share/solana/install/active_release/bin:/usr/local/solana/bin:${PATH}"

# ----------------------------
# 1. Install dependencies
# ----------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates gnupg2 \
    build-essential pkg-config libssl-dev libudev-dev \
    clang llvm cmake lld \
    git jq tree bzip2 vim-tiny python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

# ----------------------------
# 2. Install Node.js + Yarn
# ----------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update && apt-get install -y --no-install-recommends nodejs && \
    npm install -g yarn@1.22.19 && \
    rm -rf /var/lib/apt/lists/*

# ----------------------------
# 3. Install Solana CLI
# ----------------------------
RUN mkdir -p /usr/local/solana && \
    curl -sSfL https://github.com/solana-labs/solana/releases/download/${SOLANA_RELEASE}/solana-release-x86_64-unknown-linux-gnu.tar.bz2 -o /tmp/solana.tar.bz2 && \
    tar -xjf /tmp/solana.tar.bz2 -C /tmp && \
    mv /tmp/solana-release/bin /usr/local/solana/ && \
    rm -rf /tmp/solana* && \
    ln -sf /usr/local/solana/bin/* /usr/local/bin/

# Verify Solana
RUN export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH" && \
    solana --version

# ----------------------------
# 4. Install Anchor CLI
# ----------------------------
RUN cargo install --git https://github.com/coral-xyz/anchor --tag ${ANCHOR_CLI_TAG} anchor-cli --locked

# ----------------------------
# 5. Preinstall SBF Tools to prevent missing SDK/lib errors
# ----------------------------
WORKDIR /tmp/sbf-ensure
RUN mkdir -p src && echo "fn main(){}" > src/main.rs && \
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH" && \
    cargo build-sbf --verbose --force-tools-install || true

# ----------------------------
# 6. Setup Solana wallet + config
# ----------------------------
WORKDIR /workspace
RUN mkdir -p /root/.config/solana && \
    solana-keygen new --no-bip39-passphrase -o /root/.config/solana/id.json -s && \
    solana config set --url localhost

# ----------------------------
# 7. Final verification
# ----------------------------
RUN solana --version && anchor --version && rustc --version && node --version && yarn --version

CMD ["/bin/bash"]
