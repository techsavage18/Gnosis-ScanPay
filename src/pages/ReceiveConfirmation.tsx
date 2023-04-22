import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TextField } from "@mui/material";
import {
    getPermitCalldata,
    getSignatureData,
    gaslessPayment,
    validatePermit,
} from "../helpers";
import { ethers } from "ethers";

function PayConfirmation() {
    const [searchParams] = useSearchParams();
    const [nonce, setNonce] = useState(-1);
    const [state, setState] = useState("loading");
    console.log(searchParams);
    const sender = searchParams.get("sender");
    const recipient = searchParams.get("address");
    const amount = searchParams.get("amount");
    const deadline = searchParams.get("deadline");
    const deadlineFormatted = new Date(
        parseInt(deadline ?? "0") * 1000
    ).toLocaleString();
    const r = searchParams.get("r");
    const s = searchParams.get("s");
    const v = searchParams.get("v");

    useEffect(() => {
        async function getNonce() {
            const deadlineParsed = ethers.BigNumber.from(
                deadline ?? ""
            ).toNumber();
            const valueParsed = ethers.utils.parseUnits(amount ?? "", 6);
            const vParsed = ethers.BigNumber.from(v ?? "").toNumber();

            try {
                await validatePermit(
                    sender ?? "",
                    recipient ?? "",
                    valueParsed,
                    deadlineParsed,
                    r ?? "",
                    s ?? "",
                    vParsed
                );
            } catch (e) {
                console.log("validationError:", e);
                setState("validationError");
                return;
            }
            const signatureData = await getSignatureData(sender ?? "");
            setNonce(signatureData.nonce.toNumber());
            setState("verified");
            const signatureResult = {
                deadline: deadlineParsed,
                sender,
                v: vParsed,
                r,
                s,
            };

            const permitCallData = await getPermitCalldata(
                signatureResult,
                valueParsed
            );
            console.log("permitCallData:", permitCallData);
            const taskResult = await gaslessPayment(
                sender ?? "",
                valueParsed,
                recipient ?? "",
                permitCallData ?? ""
            );
            console.log("taskResult:", taskResult);
        }
        getNonce().catch(console.error);
    }, [sender]);
    function statusHeader() {
        if (state === "loading") {
            return <span>Verifying Payment</span>;
        }

        if (state === "validationError") {
            return <span>Payment Verification Failed</span>;
        } else {
            return <span>Payment Verified</span>;
        }
    }

    return (
        <div>
            {statusHeader()}

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
