import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";

function Receive() {
    const [address, setAddress] = useState("0x");
    const handleChangeAddress = (event: any) => {
        setAddress(event.target.value);
    };

    const [amount, setAmount] = useState("0.0");
    const handleChangeAmount = (event: any) => {
        setAmount(event.target.value);
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
                    size="medium"
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
                    size="medium"
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
