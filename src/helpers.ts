import { ethers } from "ethers";

export async function getPermitSignature(
    signer: ethers.Wallet,
    tokenAddress: string,
    spender: string,
    value: ethers.BigNumberish,
    relativeDeadline: number
) {
    console.log("Getting permit signature", {
        tokenAddress,
        spender,
        value,
        relativeDeadline,
    });
    const deadline = await signer.provider
        ?.getBlock("latest")
        .then((block) => block.timestamp + relativeDeadline);
    const token = new ethers.Contract(
        tokenAddress,
        [
            "function nonces(address) view returns (uint256)",
            "function name() view returns (string)",
        ],
        signer
    );
    const owner = await signer.getAddress();
    const [nonce, name, version, chainId] = await Promise.all([
        token.nonces(owner),
        token.name(),
        "1",
        signer.getChainId(),
    ]);

    console.log("signTypedData", {
        owner,
        spender,
        value,
        nonce,
        deadline,
    });
    const typedSignature = await signer._signTypedData(
        {
            name,
            version,
            chainId,
            verifyingContract: token.address,
        },
        {
            Permit: [
                {
                    name: "owner",
                    type: "address",
                },
                {
                    name: "spender",
                    type: "address",
                },
                {
                    name: "value",
                    type: "uint256",
                },
                {
                    name: "nonce",
                    type: "uint256",
                },
                {
                    name: "deadline",
                    type: "uint256",
                },
            ],
        },
        {
            owner,
            spender,
            value,
            nonce,
            deadline,
        }
    );
    console.log("splitSignature");

    const signature = ethers.utils.splitSignature(typedSignature);
    return {
        v: signature.v,
        r: signature.r,
        s: signature.s,
        deadline,
        sender: owner,
    };
}
