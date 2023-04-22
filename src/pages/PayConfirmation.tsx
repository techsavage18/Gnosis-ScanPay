import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { getPermitSignature, validatePermit } from "../helpers";

function PayConfirmation() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const address = searchParams.get("address");
    const amount = searchParams.get("amount");

    const [privateKey, setPrivateKey] = useState("");

    const handleChangePrivateKey = (event: any) => {
        setPrivateKey(event.target.value);
    };

    async function generateSignature() {
        const address = searchParams.get("address") ?? "";
        const amount = searchParams.get("amount") ?? "";
        const value = ethers.utils.parseUnits(amount, 6);
        const rpcUrl = "https://rpc.gnosischain.com/";
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        const blockNumber = await provider.getBlockNumber();

        console.log("blockNumber:", blockNumber);

        const wallet = new ethers.Wallet(privateKey, provider);
        const signer = wallet.connect(provider);
        const result = await getPermitSignature(signer, address, value, 300);
        console.log("result:", result);
        try {
            await validatePermit(
                result.sender,
                address,
                value,
                result.deadline ?? 0,
                result.r,
                result.s,
                result.v
            );
            let qr = `deadline=${result.deadline}&r=${result.r}&s=${result.s}&v=${result.v}&sender=${result.sender}`;
            navigate(`/paymentCode?${qr}`);
        } catch (e) {
            console.log("validationError:", e);
            return;
        }
    }

    return (
        <div>
            <span>Confirm Payment</span>

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
                    value={address}
                    label="Receiver"
                    size="medium"
                    variant="outlined"
                    color="primary"
                    disabled
                />
            </div>

            <div style={{ marginTop: 30 }}>
                <TextField
                    style={{ width: 320 }}
                    onChange={handleChangePrivateKey}
                    value={privateKey}
                    label="Private Key"
                    size="medium"
                    variant="outlined"
                    color="primary"
                    type="password"
                />
            </div>

            <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={generateSignature}
            >
                Confirm and generate QR Code
            </Button>
        </div>
    );
}

export default PayConfirmation;
