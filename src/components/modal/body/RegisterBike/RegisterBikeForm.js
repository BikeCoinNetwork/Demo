import React, { Component } from "react";
import {
    Step,
    Stepper,
    StepLabel,
} from "material-ui/Stepper";
import styles from "../CustomCss";
import RegisterBikeInformation from "./RegisterBikeInformation";
import RegisterBikeLocation from "./RegisterBikeLocation";
import RegisterBikeConfirm from "./RegisterBikeConfirm";
import RegisterBikeSuccess from "./RegisterBikeSuccess";
import { uploadNewBikeToIPFS } from "../../../../actions/bikeActions";
import { toast } from "react-toastify";
class RegisterBike extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stepIndex: 0,
            stepOne: {
                imageData: "",
                imageName: "",
                invoiceData: "",
                invoiceName: "",
                imagePreview: "",
                manufacturer: "Volata Cycles",
                owner: this.props.accounts.accounts.address || this.props.accounts.address,
                snNumber: ""
            },
            stepTwo: {
                location: {
                    name: null,
                    long: null,
                    lat: null,
                    country: {
                        name: null,
                        code: null,
                    }
                },
            },
            stepThree: {
                passphrase: ""
            }
        };
    }

    validate = () => {
        const {stepIndex, stepOne, stepTwo, stepThree} = this.state;
        if (stepIndex === 0) {
            if (stepOne.imageData === "" || stepOne.invoiceData === "" || stepOne.snNumber === "" || stepOne.manufacturer === "") {
                return false;
            }
        }
        if (stepIndex === 1) {
            if (stepTwo.location.name === null || stepTwo.location.long === null || stepTwo.location.lat === null) {
                return false;
            }
        }
        if (stepIndex === 2) {
            if (stepThree.passphrase === "") {
                return false;
            }
        }
        return true;
    }

    handleNext = async () => {
        const {stepIndex} = this.state;
        let isValidate = await this.validate();
        if (!isValidate) {
            toast.error("Invalid! Please fill out the form.");
            return;
        }
        if (stepIndex < 2) {
            this.setState({
                stepIndex: stepIndex + 1,
            });
            return;
        }
        if (stepIndex === 2) {
            this.registerBike();
            return;
        }
        this.props.closeModal();

    };

    registerBike = async () => {
        const { stepOne, stepTwo } = this.state;
        await this.props.dispatch(uploadNewBikeToIPFS({
            bikeInfo: stepOne,
            location: stepTwo.location
        }));
        this.setState({stepIndex: 3});
    }

    handleChangeState = (data) => {
        const {stepIndex, stepOne, stepTwo, stepThree} = this.state;
        let dataChanges;
        if (stepIndex === 0) {
            dataChanges = Object.assign(stepOne, data);
            this.setState({ stepOne: dataChanges });
            return;
        }
        if (stepIndex === 1) {
            dataChanges = Object.assign(stepTwo, data);
            this.setState({ stepTwo: dataChanges });
            return;
        }
        if (stepIndex === 2) {
            dataChanges = Object.assign(stepThree, data);
            this.setState({ stepThree: dataChanges });
            return;
        }
    }

    handlePrev = () => {
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    };

    getStepContent(stepIndex) {
        switch (stepIndex) {
        case 0:
            return (
                <RegisterBikeInformation {...this.props} handleChangeState={this.handleChangeState} info={this.state.stepOne} />
            );
        case 1:
            return (
                <RegisterBikeLocation {...this.props} handleChangeState={this.handleChangeState} info={this.state.stepTwo} />
            );
        case 2:
            return (
                <RegisterBikeConfirm {...this.props} handleChangeState={this.handleChangeState} info={this.state.stepThree} />
            );
        default:
            return (
                <RegisterBikeSuccess />
            );
        }
    }

    render() {
        const {stepIndex} = this.state;
        const contentStyle = {margin: "0 16px"};

        return (
            <div>
                <Stepper activeStep={stepIndex} style={styles.step}>
                    <Step>
                        <StepLabel style={styles.stepLabel} className="step-label" iconContainerStyle={{display: "block"}}>
                            <span className="text-step">Bike Information</span>
                        </StepLabel>
                    </Step>
                    <Step>
                        <StepLabel style={styles.stepLabel} className="step-label" iconContainerStyle={{display: "block"}}>
                            <span className="text-step">Location</span>
                        </StepLabel>
                    </Step>
                    <Step>
                        <StepLabel style={styles.stepLabel} className="step-label" iconContainerStyle={{display: "block"}}>
                            <span className="text-step">Confirm</span>
                        </StepLabel>
                    </Step>
                </Stepper>
                <div style={contentStyle}>
                    <div>{this.getStepContent(stepIndex)}</div>
                    <div className="row" style={{marginTop: 12}}>
                        <div className="col-sm-6">
                            <button
                                disabled={stepIndex === 0}
                                onClick={this.handlePrev}
                                style={styles.buttonBack}
                            >
                                Back
                            </button>
                        </div>
                        <div className="col-sm-6 text-right">
                            <button
                                onClick={this.handleNext}
                                style={styles.buttonBack}
                            >
                                {stepIndex > 2 ? "Finish" : "Next"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RegisterBike;