import { BigNumberish, ethers, Signer } from "ethers";
import { GelatoRelay, CallWithSyncFeeRequest } from "@gelatonetwork/relay-sdk";

const usdcAddress = "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83";
const scanPayAddress = "0xe5759060F3a09ED499b3097014A16D60A4eD6040";

export async function validatePermit(
    sender: string,
    value: BigNumberish,
    deadline: BigNumberish,
    r: string,
    s: string,
    v: BigNumberish
) {
    const recipient = scanPayAddress;
    console.log("validatePermit", {
        sender,
        recipient,
        value,
        deadline,
        v,
        r,
        s,
    });
    const tokenContract = getTokenContract();
    await tokenContract.callStatic.permit(
        sender,
        recipient,
        value,
        deadline,
        v,
        r,
        s
    );
    console.log("validatePermit success");
}

function getTokenAbi() {
    return [
        "function nonces(address) view returns (uint256)",
        "function name() view returns (string)",
        "function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external",
        "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
    ];
}

export async function getPermitCalldata(
    permitSignatureResult: any,
    amountToTransfer: BigNumberish
) {
    console.log("permitSignatureResult", permitSignatureResult);
    const usdcContract = getTokenContract();
    const { data: permitCalldata } =
        await usdcContract.populateTransaction.permit(
            permitSignatureResult.sender,
            scanPayAddress,
            amountToTransfer,
            permitSignatureResult.deadline ?? ethers.constants.MaxUint256,
            permitSignatureResult.v,
            permitSignatureResult.r,
            permitSignatureResult.s
        );
    console.log("Permit Calldata", permitCalldata);
    return permitCalldata;
}

export async function awaitTask(taskId: string) {
    const relay = new GelatoRelay();
    const taskFulfilledPromise = new Promise((resolve, reject) => {
        const maxRetry = 100;
        let retryNum = 0;
        const interval = setInterval(async () => {
            retryNum++;
            if (retryNum > maxRetry) {
                clearInterval(interval);
                reject("Max retry reached");
            }
            const taskStatus = await relay.getTaskStatus(taskId);
            console.log("Task Status", taskStatus);
            if (taskStatus?.taskState == "ExecSuccess") {
                clearInterval(interval);
                resolve(taskStatus);
            }
        }, 500);
    });
    return await taskFulfilledPromise;
}
export async function sendTask(
    owner: string,
    amountToTransfer: BigNumberish,
    receiver: string,
    permitCalldata: string
) {
    const provider = getProvider();
    const scanPayContract = new ethers.Contract(
        scanPayAddress,
        [
            "function settlePayment(address _token, address _owner, address _receiver, uint256 _amount, bytes calldata _permitCalldata) external",
        ],
        provider
    );
    const { data: scanPayCalldata } =
        await scanPayContract.populateTransaction.settlePayment(
            usdcAddress,
            owner,
            receiver,
            amountToTransfer,
            permitCalldata ?? "0x"
        );

    console.log("ScanPay Calldata", scanPayCalldata);

    const { chainId } = (await provider.getNetwork()) ?? {
        chainId: -1,
    };
    console.log("ChainId", chainId);

    const relay = new GelatoRelay();

    // populate the relay SDK request body
    const request: CallWithSyncFeeRequest = {
        chainId,
        target: scanPayAddress,
        data: scanPayCalldata ?? "0x",
        feeToken: usdcAddress,
        isRelayContext: true,
    };

    console.log("Relay Request", request);

    // send relayRequest to Gelato Relay API
    const relayResponse = await relay.callWithSyncFee(request);
    console.log("Relay Response", relayResponse);
    const taskId = relayResponse.taskId;
    return taskId;
}

function getTokenContract() {
    const provider = getProvider();
    const usdcContract = new ethers.Contract(
        usdcAddress,
        getTokenAbi(),
        provider
    );
    return usdcContract;
}

export async function getSignatureData(owner: string) {
    const token = getTokenContract();
    console.log("getSignatureData Getting Nonce Data", { owner });
    const [nonce, name, version] = await Promise.all([
        token.nonces(owner),
        token.name(),
        "1",
    ]);
    console.log("getSignatureData Getting chainId");
    const { chainId } = (await token.provider.getNetwork()) ?? { chainId: -1 };
    console.log("getSignatureData Returning: ", {
        nonce,
        name,
        version,
        chainId,
    });
    return { nonce, name, version, chainId };
}

export async function getPermitSignature(
    signer: Signer,
    value: BigNumberish,
    relativeDeadline: number
) {
    const spender = scanPayAddress;
    console.log("Getting permit signature", {
        usdcAddress,
        spender,
        value,
        relativeDeadline,
    });
    const deadline = await signer.provider
        ?.getBlock("latest")
        .then((block) => block.timestamp + relativeDeadline);

    const owner = await signer.getAddress();
    const { nonce, name, version, chainId } = await getSignatureData(owner);

    console.log("signTypedData", {
        owner,
        spender,
        value,
        nonce,
        deadline,
    });
    // @ts-ignore
    const typedSignature = await signer._signTypedData(
        {
            name,
            version,
            chainId,
            verifyingContract: usdcAddress,
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

export function getProvider() {
    const rpcUrl = "https://rpc.gnosischain.com/";
    return new ethers.providers.JsonRpcProvider(rpcUrl);
}
