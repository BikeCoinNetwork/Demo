import React, { Component } from "react";
import TextField from "material-ui/TextField";
import styles from "./CustomCss";
class ConfirmTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountAddress: "",
            passphrase: "",
            gasLimit: 4712388,
            gasPrice: 50,
            disabled: false,
            submitted: false,
            labelButton: "Confirm",
            errors: {
                accountAddress: "",
                passpharse: "",
                gasLimit: "",
                gasPrice: ""
            }
        };
    }

    handleKeyPress = (target) => {
        if(target.charCode===13){
            this._onDeploy();
        }
    }

    _onDeploy = () => {
        const { data, handle } = this.props.externalData;
        data.passphrase = this.state.passphrase;
        this.props.dispatch(handle(data));
        this.props.closeModal();
    }

    render() {
        return (
            <div className="mh250 pd10 transaction">
                <div className="w100p">
                    <div className="form-modal">
                        <TextField
                            floatingLabelText="Passpharse"
                            fullWidth={true}
                            type="password"
                            disabled={this.state.disabled}
                            value={this.state.passphrase}
                            errorText={this.state.errors.passphrase}
                            onKeyPress={(e) => this.handleKeyPress(e)}
                            onChange={(e) => this.setState({ passphrase: e.target.value })}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            underlineFocusStyle={styles.underlineStyle}
                        />

                    </div>
                    <div className="action-form">
                        <button onClick={this._onDeploy} style={styles.buttonBack}>
                            {this.state.labelButton}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}


export default ConfirmTransaction;
