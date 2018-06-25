import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import Modal from "../components/modal";
import RootContainer from "../containers/RootContainer";
import {connect} from "react-redux";
import EthereumService from "../services/ethereum";
import ServerService from "../services/server";
import { MODAL_OWNER_LOGIN } from "../components/modal/constants";
import _ from "lodash";
import YourBikesComponent from "../components/your_bikes/YourBikeComponent";
import HiringRequestComponent from "../components/hiring_request/HiringRequestComponent";
import YourAccountComponent from "../components/your_account/YourAccountComponent";

class root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type:MODAL_OWNER_LOGIN,
            isOpen: false,
            metamask: false,
            externalData: null
        };
    }
    closeModal = () => {
        this.setState({
            isOpen: false
        });
    }
    setType = (type, externalData = null) => {
        this.setState({
            type: type,
            isOpen: true,
            externalData: externalData
        });
        return true;
    }
    _renderHomePage = () => {
        if (_.isEmpty(this.props.userProfile.data)) {
            return (<div></div>);
        }
        return (
            <Switch>
                <Route exact path="/your_bikes" render={() => <YourBikesComponent {...this.props} setType={this.setType} />} />
                <Route exact path="/hiring_request" render={() => <HiringRequestComponent {...this.props} setType={this.setType} />} />
                <Route exact path="/your_account" render={() => <YourAccountComponent {...this.props} setType={this.setType} />} />
            </Switch>
        );
    }
    componentWillReceiveProps(nextProps) {
        const { accounts } = nextProps;
        if (accounts.isLogout) {
            this.setType(MODAL_OWNER_LOGIN);
        }
    }
    render() {
        return (
            <RootContainer {...this.props} setType={this.setType}>
                {this._renderHomePage()}
                <Modal
                    type={this.state.type}
                    isOpen={this.state.isOpen}
                    closeModal={this.closeModal}
                    setType={this.setType}
                    metamask={this.state.metamask}
                    accounts={this.props.accounts}
                    userProfile={this.props.userProfile}
                    AppReducer={this.props.AppReducer}
                    global={this.props.global}
                    contacts={this.props.contacts}
                    bikes={this.props.bikes}
                    api={this.props.api}
                    ethereum={this.props.ethereum}
                    dispatch={this.props.dispatch}
                    keystore={this.props.keystore}
                    externalData={this.state.externalData}

                />
            </RootContainer>
        );
    }
}
const mapStateToProps = state => ({
    accounts: state.accounts,
    userProfile: state.userProfile,
    AppReducer: state.AppReducer,
    global: state.global,
    contacts: state.contacts,
    keystore: state.importKeystore,
    bikes: state.bikes,
    api: new ServerService(),
    ethereum: new EthereumService(state),
});
export default withRouter(connect(mapStateToProps)(root));
