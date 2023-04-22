import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import {
    getPermitCalldata,
    getSignatureData,
    validatePermit,
    sendTask,
    awaitTask
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

    async function submitTransaction() {
        const deadlineParsed = ethers.BigNumber.from(deadline ?? "").toNumber();
        const valueParsed = ethers.utils.parseUnits(amount ?? "", 6);
        const vParsed = ethers.BigNumber.from(v ?? "").toNumber();

        try {
            await validatePermit(
                sender ?? "",
                valueParsed,
                deadlineParsed,
                r ?? "",
                s ?? "",
                vParsed
            );
        } catch (e) {
            setState("validationError");
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

        const taskId = await sendTask(
            sender ?? "",
            valueParsed,
            recipient ?? "",
            permitCallData ?? ""
        );
        console.log("taskId:", taskId);

        const task = await awaitTask(taskId);
        console.log("taskResult:", task);
    }

    function stateHeader() {
        if (state === "loading") {
            return (
                <div>
                    <span>Pending Submission</span>
                </div>
            );
        }

        if (state === "validationError") {
            return (
                <div>
                    <span>Payment Verification Failed</span>
                </div>
            );
        }
        return (
            <div>
                <span>Payment processed</span>
            </div>
        );
    }

    return (
        <div>
            {stateHeader()}

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
            <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={submitTransaction}
            >
                Submit transaction and claim payment
            </Button>
        </div>
    );
}

export default PayConfirmation;
