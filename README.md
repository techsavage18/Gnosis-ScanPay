# ScanPay- Gnosis

ScanPay is a payment solution that facilitates simple ERC20 token payments on Gnosis Chain through QR Code exchange.

## How it works

1. The Payee (Vendor) generates a QR Code requesting payment.
2. The Payer (Customer) scans the QR Code and generates a second QR Code containing an ERC-2612 permit signature. This signature allows the Vendor to draw the tokens.
3. The Vendor scans the QR Code and submits the signed message to the Gasless Relay service (Gelato).
4. The Relay service submits and executes the transaction to settle the payment.

## Advantages

- **Cost-effective:** Transactions are extremely affordable, costing a fraction of a cent per transaction.
- **No vendor-side wallet infrastructure/skills required:** Vendors only need to supply their receiving address, which can be a centralized exchange (CEX) account address like Coinbase.
- **No transaction submissions required:** Neither the Payer nor the Payee need to submit any transactions themselves, as the relay service handles it.
- **No native tokens required:** No native tokens are necessary for any party involved.
- **Immediate signature verification:** Signature validity is instantly verified when scanning the payment code provided by the Payer.
- **Extended range capability:** Works at longer distances than contactless payments, allowing transactions from inside a car, for example.
- **No internet connection required on the Payer's device:** The payment process can be completed without an internet connection on the Payer's device.

Gasless ERC20 transactions via QR Code

- [Demo deployment](https://scan-pay.vercel.app/)
- [[Demo Video]([https://www.youtube.com/watch?v=haZYHZtBIb8])](https://www.youtube.com/watch?v=haZYHZtBIb8)


THIS IS AN UNTESTED DEMO. IT IS PROVIDED AS IS WITHOUT ANY GUARANTEES. DO NOT USE THIS WITH SENSITIVE PRIVATE KEYS / WALLETS.

# Technologies used
- React Frontend
- [Gnosis chain contract](https://gnosisscan.io/address/0xe5759060F3a09ED499b3097014A16D60A4eD6040)
- [Gelato gasless relay](https://www.gelato.network/relay)

# Run local 
`yarn dev`



