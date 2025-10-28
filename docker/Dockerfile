# run this command : docker build -t winterfellhub/winterfell-base:latest .

FROM rust:1.78-slim-bookworm

# ----------------------------
# Environment variables
# ----------------------------
ENV DEBIAN_FRONTEND=noninteractive
ENV SOLANA_VERSION=v1.18.22
ENV ANCHOR_CLI_TAG=v0.29.0
ENV ANCHOR_WALLET=/root/.config/solana/id.json
ENV PATH="/root/.local/share/solana/install/active_release/bin:/usr/local/solana/bin:${PATH}"

# ----------------------------
# 1. Install system dependencies
# ----------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates gnupg2 \
    build-essential pkg-config libssl-dev libudev-dev \
    clang llvm cmake lld \
    git jq tree bzip2 vim-tiny python3 python3-pip \
    && update-ca-certificates \
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
RUN sh -c "$(curl -sSfL https://release.anza.xyz/${SOLANA_VERSION}/install)" && \
    solana --version

# ----------------------------
# 4. Install Anchor CLI
# ----------------------------
RUN cargo install --git https://github.com/coral-xyz/anchor \
    --tag ${ANCHOR_CLI_TAG} anchor-cli --locked && \
    anchor --version

# ----------------------------
# 5. Preinstall BPF Tools
# ----------------------------
WORKDIR /tmp/bpf-init
RUN cargo init --name bpf_dummy --lib && \
    echo '[lib]' >> Cargo.toml && \
    echo 'crate-type = ["cdylib", "lib"]' >> Cargo.toml && \
    echo 'pub fn process_instruction() {}' > src/lib.rs && \
    cargo build-bpf --verbose && \
    cd / && rm -rf /tmp/bpf-init

# ----------------------------
# 6. Setup Solana wallet + config
# ----------------------------
WORKDIR /workspace
RUN mkdir -p /root/.config/solana && \
    solana-keygen new --no-bip39-passphrase -o /root/.config/solana/id.json && \
    solana config set --url localhost

# ----------------------------
# 7. Final verification
# ----------------------------
RUN solana --version && \
    anchor --version && \
    rustc --version && \
    node --version && \
    yarn --version && \
    echo "Architecture: $(uname -m)" && \
    echo "BPF toolchain check:" && \
    ls -la /root/.local/share/solana/install/active_release/bin/sdk/bpf/dependencies/ || true

CMD ["/bin/bash"]



