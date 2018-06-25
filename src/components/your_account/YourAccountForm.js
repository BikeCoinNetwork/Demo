import React, { Component } from "react";
import styles from "./YourAccountComponentStyle";
import TextField from "material-ui/TextField";

class YourAccountForm extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.userProfile.data;
    }
    render() {
        return (
            <div>
                <h3 style={styles.title}>ETH Address: <span style={styles.ethAddress}>{this.props.accounts.accounts.address}</span></h3>
                <TextField
                    floatingLabelText="User Profile Address"
                    fullWidth
                    value="0x0000000000000000000000000000000000000000"
                />
                <TextField
                    floatingLabelText="Email"
                    fullWidth
                    value={this.state.email}
                    onChange={(e) => this.setState({email: e.target.value})}
                />
                <TextField
                    floatingLabelText="First Name"
                    fullWidth
                    value={this.state.firstname}
                    onChange={(e) => this.setState({firstname: e.target.value})}
                />
                <TextField
                    floatingLabelText="Last Name"
                    fullWidth
                    value={this.state.lastname}
                    onChange={(e) => this.setState({lastname: e.target.value})}
                />

                <div className="text-right">
                    <button style={styles.button}>update</button>
                </div>
            </div>
        );
    }
}

export default YourAccountForm;
