import React from "react";
import PropTypes from "prop-types";
import "../styles/modal.css";
import VS from "../assets/images/vs-versus.webp";
import { accountService } from "../hooks/account_service";
import StatsCardFriend from "./StatsCardFriend";
import StatsCard from "./StatsCard";

class Modal extends React.Component {
  render() {
    if (!this.props.show) {
      return null;
    }

    return (
      <div className="modal">
        <div className="modal-content">
          <div className="footer">
            <div className="modal-row">
              <div className="modal-column">
                <StatsCard />
                <h1>{accountService.userLogin()}</h1>
              </div>
              <div className="modal-column">
                <img className="modal-img" src={VS} alt="vs" />
              </div>
              <div className="modal-column">
                <p>{this.props.opponent}</p>
                <StatsCardFriend />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node,
  opponent: PropTypes.string,
};

export default Modal;
