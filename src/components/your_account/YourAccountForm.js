import React, { Component } from "react";
import styles from "./YourAccountComponentStyle";
import TextField from "material-ui/TextField";

class YourAccountForm extends Component {
    _viewETHOnEtherScan = () =>{
        const { accounts } = this.props.accounts;
        return (
            <a
                href={"https://ropsten.etherscan.io/address/" + accounts.address}
                title="View ETH Address On EtherScan"
                target="_blank" >
                {accounts.address + " "}
                <i className="fa fa-external-link"></i>
            </a>
        );
    }
    _viewProfileOnEtherScan = () =>{
        const { userProfileAddress } = this.props;
        return (
            <a
                href={"https://ropsten.etherscan.io/address/" + userProfileAddress}
                title="View Profile Address On EtherScan"
                target="_blank" >
                {userProfileAddress + " "}
                <i className="fa fa-external-link"></i>
            </a>
        );
    }
    render() {
        return (
            <div>
                <h4 style={styles.title}>
                    Network: {this.props.global.nodeName}
                </h4>
                <form style={styles.form}>
                    <div className="form-group row">
                        <label className="col-sm-3" style={styles.labelText}>ETH Address:</label>
                        <div className="col-sm-9">
                            <p style={styles.address}>{this._viewETHOnEtherScan()}</p>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3" style={styles.labelText}>User Profile Address:</label>
                        <div className="col-sm-9">
                            <p style={styles.address}>{this._viewProfileOnEtherScan()}</p>
                        </div>
                    </div>
                </form>
                
                <TextField
                    floatingLabelText="Email"
                    fullWidth
                    value={this.props.userInfo.email}
                    onChange={(e) => this.props.handleChangeState({email: e.target.value})}
                    onKeyPress={(e) => this.props.handleKeyPress(e)}
                />
                
                <div className="row">
                    <div className="col-sm-6">
                        <TextField
                            floatingLabelText="First Name"
                            fullWidth
                            value={this.props.userInfo.firstname}
                            onChange={(e) => this.props.handleChangeState({firstname: e.target.value})}
                            onKeyPress={(e) => this.props.handleKeyPress(e)}
                        />
                    </div>
                    <div className="col-sm-6">
                        <TextField
                            floatingLabelText="Last Name"
                            fullWidth
                            value={this.props.userInfo.lastname}
                            onChange={(e) => this.props.handleChangeState({lastname: e.target.value})}
                            onKeyPress={(e) => this.props.handleKeyPress(e)}
                        />
                    </div>
                </div>

                <div className="text-left">
                    <button style={styles.button} onClick={this.props.saveInformation}>update</button>
                </div>
            </div>
        );
    }
}

export default YourAccountForm;
