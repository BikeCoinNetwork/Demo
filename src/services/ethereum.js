import Web3 from "web3";
import Wallet from "ethereumjs-wallet";
import constants from "./constants";

import { updateBlockFailed } from "../actions/globalActions";  //updateBlock ,updateRate
// import { updateAccount } from "../actions/accountActions"
import { updateTx } from "../actions/txActions";
// import SupportedTokens from "./supported_tokens"
import * as ethUtil from "ethereumjs-util";
import store from "../store";
import { sealTxByKeystore } from "../utils/sealer";
// import _ from "lodash";
// import ethereumUtil from "ethereumjs-util";
export default class EthereumService {
    constructor() {
        if (typeof Web3 !== "undefined") {
            this.rpc = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/faF0xSQUt0ezsDFYglOe"));
        } else {
            console.error("No Web3 detected"); // eslint-disable-line
        }
        this.erc20Contract = this.rpc.eth.contract(constants.ERC20);
        this.networkAddress = constants.NETWORK_ADDRESS;
        this.networkContract = this.rpc.eth.contract(constants.NEXTID_NETWORK).at(this.networkAddress);
        this.userProfileContract = this.rpc.eth.contract(constants.NEXTID_USER_PROFILE);
        this.facetContract = this.rpc.eth.contract(constants.NEXTID_FACET);
        this.intervalID = null;
    }

    version() {
        return this.rpc.version.api;
    }

    getLatestBlockPromise(ethereum) {
        return new Promise((resolve) => {
            ethereum.rpc.eth.getBlock("latest", false, (error, block) => {
                if (error != null) {
                    console.log(error);  // eslint-disable-line
                } else {
                    resolve(block.number);
                }
            });
        });
    }

    getLatestBlock(callback) {
        return this.rpc.eth.getBlock("latest", false, (error, block) => {
            if (error != null) {
                console.log(error);  // eslint-disable-line
            } else {
                callback(block.number);
            }
        });
    }

    getBalance(address, callback) {
        this.rpc.eth.getBalance(address, (error, balance) => {
            if (error != null) {
                console.log(error); // eslint-disable-line
            } else {
                let weiBalance = balance.toNumber();
                let ethBalance = this.rpc.fromWei(weiBalance);
                callback(ethBalance);
            }
        });
    }

    getNextIdCoinBalance(address, callback) {
        callback(0);
    }

    getNonce(address, callback) {
        this.rpc.eth.getTransactionCount(address, "pending", (error, nonce) => {
            if (error != null) {
                console.log(error); // eslint-disable-line
            } else {
                callback(nonce);
            }
        });
    }

    getTokenBalance(address, ownerAddr, callback) {
        var instance = this.erc20Contract.at(address);
        instance.balanceOf(ownerAddr, (error, result) => {
            if (error != null) {
                console.log(error); // eslint-disable-line
            } else {
                callback(result);
            }
        });
    }

    watch() {
        this.rpc.eth.filter("latest", this.actAndWatch.bind(this), (error) => { // eslint-disable-line
            // the node is not support for filtering
            this.fetchData();
            this.intervalID = setInterval(this.fetchData.bind(this), 10000);
        });
    }

    fetchTxsData = () => {
        console.log('fetch tx data'); // eslint-disable-line
        var state = store.getState();
        var tx;
        var txs = state.txs;
        var ethereum = state.connection.ethereum;
        Object.keys(txs).forEach((hash) => {
            tx = txs[hash];
            if (tx.status === "pending") {
                store.dispatch(updateTx(ethereum, tx));
            }
        });
    }

    fetchData() {
        this.fetchTxsData();
    }

    actAndWatch(error, result) { // eslint-disable-line
        if (error != null) {
            store.dispatch(updateBlockFailed(error));
        } else {
            this.fetchData();
        }
    }
    txMined(hash, callback) {
        this.rpc.eth.getTransactionReceipt(hash, (error, result) => {
            if (error != null) {
                console.log(error); // eslint-disable-line
            } else {
                result == null ? callback(false, undefined) : callback(true, result);
            }
        });
    }
    sendRawTransaction(tx, ethereum, txParams, isMetaMask = false) {
        if (isMetaMask === false) {
            return new Promise((resolve, rejected) => {
                ethereum.rpc.eth.sendRawTransaction(
                    ethUtil.bufferToHex(tx.serialize()), (error, hash) => {
                        if (error != null) {
                            rejected(error);
                        } else {
                            resolve(hash);
                        }
                    });
            });
        } else {
            return new Promise((resolve, rejected) => {
                console.log("meta", txParams); // eslint-disable-line
                txParams.gas = txParams.gasLimit;
                delete txParams.nonce;
                delete txParams.gasLimit;
                window.web3.eth.sendTransaction(
                    txParams, (error, hash) => {
                        if (error != null) {
                            rejected(error);
                        } else {
                            resolve(hash);
                        }
                    });
            });
        }
    }

    createNewAddress(passphrase) {
        var newAddress = Wallet.generate();
        return newAddress.toV3(passphrase, { kdf: "pbkdf2", c: 10240 });
    }

    syncTx(txHash, callBack) {
        let self = this;
        this.rpc.eth.getTransactionReceipt(txHash, (error, txData) => {
            if (txData != null) {
                callBack(true, txData);
            } else {
                setTimeout(() => {
                    self.syncTx(txHash, callBack);
                }, 1000);
            }
        });
    }

    deployTxByMetaMask(opts, data, callback) {
        console.log(opts); // eslint-disable-line
        opts.gas = opts.gasLimit;
        let self = this;
        window.web3.eth.sendTransaction({
            ...opts,
            data: data
        }, (error, result) => {
            if (typeof result !== "undefined") {
                self.syncTx(result, (isDone, txData) => {
                    console.log("Contract", txData.contractAddress); // eslint-disable-line
                    callback(txData);
                });
            }
        });
    }

    depployTxByDefault(opts, data, password, keyStore, callback) {
        let self = this;
        let currentNonce = this.rpc.eth.getTransactionCount(opts.from);
        let params = {
            ...opts,
            data: data,
            nonce: currentNonce
        };
        let tx = sealTxByKeystore(params, keyStore, password);
        let signedData = "0x" + tx.serialize().toString("hex");

        this.rpc.eth.sendRawTransaction(signedData, (err, hash) => {
            console.log(err, params); // eslint-disable-line
            if (hash !== null) {
                self.syncTx(hash, (isDone, txData) => {
                    console.log('Contract', txData.contractAddress); // eslint-disable-line
                    callback(txData);
                });
            }
        });
    }

    getCurrentNonce(accountAddress) {
        return this.rpc.eth.getTransactionCount(accountAddress);
    }
}