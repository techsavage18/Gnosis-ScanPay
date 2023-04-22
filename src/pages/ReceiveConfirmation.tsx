import { useSearchParams } from "react-router-dom";
import { TextField } from "@mui/material";

function PayConfirmation() {
    const [searchParams] = useSearchParams();
    console.log(searchParams);
    const sender = searchParams.get("sender");
    const amount = searchParams.get("amount");
    const deadline = searchParams.get("deadline");

    return (
        <div>
            <span>Payment Received</span>

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
                    value={deadline}
                    label="Deadline"
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
