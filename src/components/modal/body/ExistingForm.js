import React, { Component } from "react";
import {
    MODAL_METAMASK,
    MODAL_IMPORT_ACCOUNT
} from "../constants";

class Existing extends Component {
    render() {
        return (
            <div className="mh250 pd10">
                <div className="intro-popup-top">
                    <h4 className="text-center">Ethereum network: <b>{this.props.global.nodeName}</b></h4>
                    <h4 className="text-center">You have to login by an ethereum account</h4>
                </div>

                <div className="flexible-evenly">
                    <button
                        onClick={() => this.props.setType(MODAL_IMPORT_ACCOUNT)}
                        className="button-login"
                    >
                        IMPORT ACCOUNT
                    </button>

                    <button
                        onClick={() => this.props.setType(MODAL_METAMASK)}
                        className="button-login"
                    >
                        UNLOCK METAMASK
                    </button>
                </div>
            </div>
        );
    }
}
export default Existing;
