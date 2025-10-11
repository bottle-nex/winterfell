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
│ 1. anchor build (30-120 sec) │
│ 2. Extract IDL automatically ✨ │
│ 3. Extract binary │
└──────────────┬──────────────────────┘
↓
┌─────────────────────────────────────┐
│ Save IDL to database │
│ contract.idl = {...} │
└──────────────┬──────────────────────┘
↓
User clicks "Generate Client"
↓
┌─────────────────────────────────────┐
│ Option A: Use Anchor's generator │
│ Option B: Ask LLM with IDL │
│ (IDL = source of truth) │
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
│ If not deployed: │
│ Validate syntax only │
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
