import { BitcoinNetwork } from '../provider';
export interface CallWalletPayload {
    method: string;
    network: BitcoinNetwork;
    params?: Array<any>;
}
export interface CallWalletOptions {
    onFinish: (response: Record<string, any>) => void;
    onCancel: () => void;
    payload: CallWalletPayload;
}
export declare enum CallMethod {
    SIGN_TRANSACTION = "signTransaction",
    GET_ADDRESS = "getAddress"
}
export declare const callWalletPopup: (options: CallWalletOptions) => Promise<void>;
