function generateWinterfellReadme() {
    return `
# Winterfell – AI-Powered Anchor Contract Workspace

Welcome to your **Winterfell project**, an AI-assisted environment for building, editing, deploying, and interacting with **Rust-based Solana smart contracts using Anchor**.

Winterfell generates your entire contract workspace—programs, clients, SDKs, and frontend examples—and lets you iterate using natural language.

---

## 🚀 Project Overview

This repository was generated and deployed using **Winterfell**, your AI-powered companion for Solana development.

Your workspace may include:

- Anchor program (Rust)
- IDL generation
- Client SDK bindings (TypeScript)
- Deployment scripts
- Optional frontend templates
- Workspace configuration

---

## ✏️ How to Edit This Code

Winterfell gives you two ways to work on your contract:

---

### **1. Edit in Winterfell (recommended)**

Visit your project inside Winterfell and continue prompting to:

- Modify contract logic
- Add instructions or accounts
- Generate tests
- Produce SDKs
- Update your frontend
- Re-deploy to devnet/mainnet-beta

Changes you make in Winterfell are automatically committed to this repo.

---

### **2. Edit locally in your IDE**

If you prefer working locally, simply clone this repo:

\`\`\`sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Enter the project
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies (if applicable)
npm install
# or
yarn

# Step 4: Start your local environment or dev server
npm run dev
\`\`\`
`.trim();
}
