import React, { Component } from "react";
import styles from "./CustomCss";

import {
    MODAL_CREATE_ACCOUNT,
    MODAL_EXISTING,
} from "../constants";
class OwnerLogin extends Component {
    render() {
        return (
            <div className="mh250 pd10">
                <div className="intro-popup-top">
                    <h4 className="text-center">Ehereum network: <b>{this.props.global.nodeName}</b></h4>
                    <h4 className="text-center">You need an ethereum accounts to use the application</h4>
                </div>

                <div className="flexible-evenly">
                    <button
                        onClick={() => this.props.setType(MODAL_CREATE_ACCOUNT)}
                        style={styles.buttonBack}
                    >
                        NEW ACCOUNT
                    </button>
                    <button
                        onClick={() => this.props.setType(MODAL_EXISTING)}
                        style={styles.buttonBack}
                    >
                        EXISTING ACCOUNT
                    </button>
                </div>
            </div>
        );
    }
}
export default OwnerLogin;
