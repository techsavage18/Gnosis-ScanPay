import { useState } from "react";
import { Fab, TextareaAutosize, Grid } from "@mui/material";
import { QrReader } from "react-qr-reader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GetApp } from "@mui/icons-material";
import QRcode from "qrcode.react";

function ReceiveCode() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    console.log(searchParams);
    const qr = `${searchParams}`;

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

    const handleResult = (result: any, error: any) => {
        if (result) {
            setQrscan(result);
            const targetUrl = `/receiveConfirmation?${result}&${qr}`;
            console.log("targetUrl:", targetUrl);
            navigate(targetUrl);
        }
        if (error) {
            console.error(error);
        }
    };


    const [qrscan, setQrscan] = useState("No result");

    return (
        <div>
            <span>QR Request Code</span>

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
            <span>Reading Payment Code</span>
            <center>
                <div style={{ marginTop: 30 }}>
                    <QrReader
                        scanDelay={300}
                        onResult={handleResult}
                        constraints={{
                            height: 320,
                            width: 320,
                        }}
                    />
                </div>
            </center>

            <TextareaAutosize
                style={{
                    fontSize: 18,
                    width: 320,
                    height: 100,
                    marginTop: 100,
                }}
                defaultValue={qrscan}
                value={qrscan}
            />
        </div>
    );
}

export default ReceiveCode;
