import { ethers } from "ethers";

const tokenAddress = "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83";

function getTokenAbi() {
    return [
        "function nonces(address) view returns (uint256)",
        "function name() view returns (string)",
        "function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external",
        "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
    ];
}

function getProvider() {
    const rpcUrl = "https://rpc.gnosischain.com/";
    return new ethers.providers.JsonRpcProvider(rpcUrl);
}

function getTokenContract() {
    const provider = getProvider();
    return new ethers.Contract(tokenAddress, getTokenAbi(), provider);
}

export async function validatePermit(
    sender: string,
    recipient: string,
    value: string,
    deadline: string,
    r: string,
    s: string,
    v: string,
) {
    console.log("validatePermit", {
        sender,
        recipient,
        value,
        deadline,
        v,
        r,
        s,
    });
    const deadlineParsed = ethers.BigNumber.from(deadline).toNumber();
    const valueParsed = ethers.utils.parseEther(value);
    const vParsed = ethers.BigNumber.from(v).toNumber();
    const tokenContract = getTokenContract();
    await tokenContract.callStatic.permit(
        sender,
        recipient,
        valueParsed,
        deadlineParsed,
        vParsed,
        r,
        s
    );
    console.log("validatePermit success");
}

export async function getSignatureData(owner: string) {
    const provider = getProvider();
    const token = getTokenContract();
    console.log("getSignatureData Getting Nonce Data", { owner });
    const [nonce, name, version] = await Promise.all([
        token.nonces(owner),
        token.name(),
        "1",
    ]);
    console.log("getSignatureData Getting chainId");
    const { chainId } = await provider.getNetwork();
    console.log("getSignatureData Returning: ", {
        nonce,
        name,
        version,
        chainId,
    });
    return { nonce, name, version, chainId };
}

export async function getPermitSignature(
    signer: ethers.Wallet,
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

    const owner = await signer.getAddress();
    const { nonce, name, version, chainId } = await getSignatureData(
        owner,
        signer.provider!
    );

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
            verifyingContract: tokenAddress,
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
