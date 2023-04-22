import { Fab, TextareaAutosize, Grid } from "@mui/material";
import { useSearchParams } from 'react-router-dom';
import { GetApp } from "@mui/icons-material";
import QRcode from "qrcode.react";

function ReceiveCode() {
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
        </div>
    );
}

export default ReceiveCode;
