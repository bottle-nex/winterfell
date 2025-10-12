User: "Create staking contract"
↓
┌─────────────────────────────────────┐
│ LLM generates Rust code │
│ Save: contract.code = lib.rs │
└──────────────┬──────────────────────┘
↓
User clicks "Build"
↓
┌─────────────────────────────────────┐
│ Send code → Build Server │
│ Build Server: │
│ 1. anchor build (30–120s) │
│ 2. Extract IDL automatically ✨ │
│ 3. Extract binary (program.so) │
└──────────────┬──────────────────────┘
↓
┌─────────────────────────────────────┐
│ Save IDL + binary to DB │
│ contract.idl = {...} │
│ contract.binary = "<program.so>" │
└──────────────┬──────────────────────┘
↓
┌─────────────────────────────────────┐
│ zk-Proof Module (off-chain prover) │
│ Inputs: │
│ • canonicalized source lib.rs │
│ • compiled binary (program.so) │
│ Produces: │
│ • contract_source_hash (Hs) │
│ • contract_binary_hash (Hb) │
│ • zkp: proof.json │
│ • public_inputs.json │
└──────────────┬──────────────────────┘
↓
┌─────────────────────────────────────┐
│ Save proof + public inputs to DB / │
│ upload to IPFS / object store │
│ contract.zk = { proofUrl, Hs, Hb } │
└──────────────┬──────────────────────┘
↓
User clicks "Generate Client"
↓
┌─────────────────────────────────────┐
│ Option A: Anchor IDL generator │
│ Option B: Ask LLM with IDL (source) │
└──────────────┬──────────────────────┘
↓
┌─────────────────────────────────────┐
│ Save client code │
│ contract.clientSdk = "..." │
└──────────────┬──────────────────────┘
↓
User clicks "Test Client"
↓
┌─────────────────────────────────────┐
│ If deployed: │
│ Run tests against devnet │
│ Additionally: call zkVerifier │
│ verify_proof(proofUrl, Hb, Hs) │
│ If not deployed: │
│ Syntax checks, local mocks │
└──────────────┬──────────────────────┘
↓
Show test results:
✅ 5 tests passed
❌ 1 test failed: "Missing signer"

this one is for the build request --------------->

[User] → Build Request → [Backend API] → Queue → [Build Worker (VM)]
↓
┌───────────────────────────┐
│ VM / EC2 / Fly Machine │
│ - Docker Engine │
├───────────────────────────┤
│ Container #1: anchor build│
│ Container #2: anchor build│
│ Container #3: anchor build│
│ ... (parallel builds) │
└───────────────────────────┘
