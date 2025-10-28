import { Connection, Keypair, Transaction, VersionedTransaction } from "@solana/web3.js";
import axios from "axios";
import bs58 from 'bs58'

export default class Swap {
    private secretbs58 = "5oPz9w7qQLMFGp9gUE54vFSmCXafafKAiejfuV4R7EsmVSfGgdtimAFm5U6qX6tJ8avwhLeaxEwMCgoNyeXWV5vv"
    private secret = bs58.decode(this.secretbs58);
    private key_pair = Keypair.fromSecretKey(this.secret);
    private connection = new Connection('https://api.mainnet-beta.solana.com');
    private INPUT_TOKEN = "So11111111111111111111111111111111111111112";
    private OUTPUT_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

    constructor() {
        this.swap();
    }

    private async get_quote() {
        try {
            const { data } = await axios.get("https://lite-api.jup.ag/swap/v1/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000", {
                headers: {
                    Accept: "application/json",
                },
                maxBodyLength: Infinity,
            });

            return data;
        } catch (error) {
            console.error(error);
        }
    }

    private async get_swap_tsx(quoteData: any) {
        const body = {
            userPublicKey: this.key_pair.publicKey.toBase58(),
            quoteResponse: quoteData,
            "prioritizationFeeLamports": {
                "priorityLevelWithMaxLamports": {
                    "maxLamports": 10000000,
                    "priorityLevel": "veryHigh"
                }
            },
            "dynamicComputeUnitLimit": true
        }

        const { data } = await axios.post("https://lite-api.jup.ag/swap/v1/swap", body);
        return data.swapTransaction;
    }

    private async swap() {
        const quoteData = await this.get_quote();
        console.log("quote data is : ", quoteData);

        const swapTransaction = await this.get_swap_tsx(quoteData);

        const swapTxBuf = Buffer.from(swapTransaction, "base64");
        const tx = VersionedTransaction.deserialize(swapTxBuf);

        tx.sign([this.key_pair]);

        const txid = await this.connection.sendTransaction(tx);

        console.log("tsx id is : ", txid);
    }
}

new Swap();