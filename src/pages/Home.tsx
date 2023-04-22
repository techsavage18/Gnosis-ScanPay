import { Grid, Button, Typography } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <Typography style={{ margin: 30 }} variant="h2">
                ScanPay
            </Typography>

            <Grid container spacing={6}>
                <Grid item xs={6}>
                    <Link to="/pay">
                        <Button
                            variant="contained"
                            size="large"
                            color="primary"
                        >
                            <PaymentIcon />
                        </Button>
                    </Link>
                </Grid>
                <Grid item xs={6}>
                    <Link to="/receive">
                        <Button
                            variant="contained"
                            size="large"
                            color="primary"
                        >
                            <PointOfSaleIcon />
                        </Button>
                    </Link>
                </Grid>
            </Grid>
        </div>
    );
}

export default Home;
