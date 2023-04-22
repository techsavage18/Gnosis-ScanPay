import { useSearchParams } from 'react-router-dom';
import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";

function PayConfirmation() {

    const [searchParams] = useSearchParams();
    const address = searchParams.get("address");
    const amount = searchParams.get("amount");

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

            <Link to={`/paymentCode?address=${address}&amount=${amount}`}>
                <Button variant="contained" size="large" color="primary">
                    Confirm and generate QR Code
                </Button>
            </Link>

            

      </div>
    );
  }
  
  export default PayConfirmation;
  

