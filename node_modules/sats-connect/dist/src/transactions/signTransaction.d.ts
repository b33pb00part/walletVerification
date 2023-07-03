import { BitcoinNetwork } from '../provider';
export interface InputToSign {
    address: string;
    signingIndexes: Array<number>;
    sigHash?: number;
}
export interface SignTransactionPayload {
    network: BitcoinNetwork;
    message: string;
    psbtBase64: string;
    broadcast?: boolean;
    inputsToSign: InputToSign[];
}
export interface SignTransactionOptions {
    payload: SignTransactionPayload;
    onFinish: (response: any) => void;
    onCancel: () => void;
}
export interface SignTransactionResponse {
    psbtBase64: string;
    txId?: string;
}
export declare const signTransaction: (options: SignTransactionOptions) => Promise<void>;
