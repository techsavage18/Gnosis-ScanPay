import { useEffect, useState } from "react";
import { useSearchParams} from "react-router-dom";
import { TextField } from "@mui/material";
import { getSignatureData, validatePermit } from "../helpers";
import { ethers } from "ethers";

function PayConfirmation() {
    const [searchParams] = useSearchParams();
    const [nonce, setNonce] = useState(-1);
    console.log(searchParams);
    const sender = searchParams.get("sender");
    const recipient = searchParams.get("address");
    const amount = searchParams.get("amount");
    const deadline = searchParams.get("deadline");
    const deadlineFormatted = new Date(parseInt(deadline ?? "0") * 1000).toLocaleString();
    const r = searchParams.get("r");
    const s = searchParams.get("s");
    const v = searchParams.get("v");

    useEffect(() => {
        async function getNonce() {
            validatePermit(sender ?? "", recipient, amount ?? "", deadline ?? "", r ?? "", s ?? "", v ?? "");
            const signatureData = await getSignatureData(sender ?? "");
            return signatureData.nonce.toNumber();
        }
        if (sender) {
            getNonce().then(setNonce).catch(console.error);
        }
    }, [sender, amount, deadline]);

    return (
        <div>
            <span>Payment Successfull</span>

            <div style={{ marginTop: 30 }}>
                <TextField
                    style={{ width: 320 }}
                    value={amount}
                    label="Amount (USD)"
                    size="medium"
                    variant="outlined"
                    color="primary"
                    disabled
                />
            </div>

            <div style={{ marginTop: 30 }}>
                <TextField
                    style={{ width: 320 }}
                    value={sender}
                    label="Sender"
                    size="medium"
                    variant="outlined"
                    color="primary"
                    disabled
                />
            </div>

            <div style={{ marginTop: 30 }}>
                <TextField
                    style={{ width: 320 }}
                    value={deadlineFormatted}
                    label="Deadline"
                    size="medium"
                    variant="outlined"
                    color="primary"
                    disabled
                />
            </div>

            <div style={{ marginTop: 30 }}>
                <TextField
                    style={{ width: 320 }}
                    value={nonce}
                    label="Nonce"
                    size="medium"
                    variant="outlined"
                    color="primary"
                    disabled
                />
            </div>
        </div>
    );
}

export default PayConfirmation;
