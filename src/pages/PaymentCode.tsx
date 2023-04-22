import { useEffect, useState } from "react";
import { Fab, TextareaAutosize, Grid } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { GetApp } from "@mui/icons-material";
import { ethers } from "ethers";
import { getPermitSignature } from "../helpers";
import QRcode from "qrcode.react";

function PaymentCode() {
    const [searchParams] = useSearchParams();
    const [qr, setQr] = useState("None");

    useEffect(() => {
        async function getQr() {
        const address = searchParams.get("address") ?? "";
        const amount = searchParams.get("amount") ?? "";
        const value = ethers.utils.parseEther(amount);
        const rpcUrl = "https://rpc.gnosischain.com/";
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        const blockNumber = await provider.getBlockNumber();

        console.log("blockNumber:", blockNumber);

        const wallet = ethers.Wallet.createRandom();
        const signer = wallet.connect(provider);
        const result = await getPermitSignature(
            signer,
            address,
            value,
            300
        );
        console.log("result:", result);
        let qr = `deadline=${result.deadline}&r=${result.r}&s=${result.s}&v=${result.v}`;
            return qr
        };
        getQr().then(setQr).catch(console.error);
    }, [searchParams]);

    const downloadQR = () => {
        const canvas = document.getElementById("myqr") as any;
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "myqr.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <div>
            <span>QR Payment Code</span>

            <div>
                {qr ? (
                    <QRcode
                        id="myqr"
                        value={qr}
                        size={320}
                        includeMargin={true}
                    />
                ) : (
                    <p>No QR code preview</p>
                )}
            </div>
            <div>
                {qr ? (
                    <Grid container>
                        <Grid item xs={10}>
                            <TextareaAutosize
                                style={{
                                    fontSize: 18,
                                    width: 250,
                                    height: 100,
                                }}
                                defaultValue={qr}
                                value={qr}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Fab
                                onClick={downloadQR}
                                style={{ marginLeft: 10 }}
                                color="primary"
                            >
                                <GetApp />
                            </Fab>
                        </Grid>
                    </Grid>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
}

export default PaymentCode;
