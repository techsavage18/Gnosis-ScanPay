import {useState} from 'react'
import {TextareaAutosize} from '@mui/material'
import { QrReader } from 'react-qr-reader';
import { useNavigate } from "react-router-dom";

function Pay() {
    const navigate = useNavigate();

    const [qrscan, setQrscan] = useState('No result');

    const handleResult = (result, error) => {
        if (result) {
            setQrscan(result)
            const targetUrl = `/payConfirmation?${result}`;
            console.log("targetUrl:", targetUrl);
            navigate(targetUrl)
        }
        if (error) {
            console.error(error)
        }
    }

    return (
      <div>
            <span>QR Scanner</span>
            
            <center>
            <div style={{marginTop:30}}>
                <QrReader
                    scanDelay={300}
                    onResult={handleResult}
                    style={{ height: 240, width: 320 }}
                />
            </div>
            </center>

            <TextareaAutosize
                style={{fontSize:18, width:320, height:100, marginTop:100}}
                defaultValue={qrscan}
                value={qrscan}
            />

      </div>
    );
  }
  
  export default Pay;
  

