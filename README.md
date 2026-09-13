# MedProof — CooL SDK Reverse Hackathon Prototype

MedProof is a privacy-preserving evidence layer for AI-assisted clinical workflows.

## Demo
The UI demonstrates the full product journey:
1. Enter synthetic clinical AI event data.
2. Create a cryptographic evidence receipt.
3. Inspect model/version, record ID and commitments.
4. Verify the receipt.
5. Simulate tampering and show verification failure.

## Live CooL integration
The Node server contains the real CooL SDK integration using `cool-nwc`:
`new CooL({ applicationId: 'medproof-clinical-ai' })` and `cool.record(...)`.

Run with Node 20+:

```bash
npm install
npm start
```
Then open http://localhost:3000.

If `cool-nwc` cannot be installed, the browser fallback remains functional as a cryptographic demo. Do not describe the fallback as CooL SDK execution.

Use synthetic/demo patient data only.
