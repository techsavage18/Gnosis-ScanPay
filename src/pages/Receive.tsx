import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";

function Receive() {
    const [address, setAddress] = useState("0x");
    const handleChangeAddress = (event) => {
        setAddress(event.target.value);
    };

    const [amount, setAmount] = useState("0.0");
    const handleChangeAmount = (event) => {
        setAmount(event.target.value);
    };

    const qr = `${address}/${amount}`;

    const downloadQR = () => {
        const canvas = document.getElementById("myqr");
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
            <span>QR Generator</span>

            <div style={{ marginTop: 30 }}>
                <TextField
                    onChange={handleChangeAddress}
                    style={{ width: 320 }}
                    value={address}
                    label="Receiving Address"
                    size="large"
                    variant="outlined"
                    color="primary"
                />
            </div>

            <div style={{ marginTop: 30 }}>
                <TextField
                    onChange={handleChangeAmount}
                    style={{ width: 320 }}
                    value={amount}
                    label="Amount (USD)"
                    size="large"
                    variant="outlined"
                    color="primary"
                />
            </div>

            <Link to={`/receiveCode?address=${address}&amount=${amount}`}>
                <Button variant="contained" size="large" color="primary">
                    Generate Code
                </Button>
            </Link>
        </div>
    );
}

export default Receive;
