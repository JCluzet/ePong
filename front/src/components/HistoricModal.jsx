import React from 'react';
import PropTypes from 'prop-types';
import "../styles/modal.css"

class Modal extends React.Component {
  render() {
    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }

    

    return (
      <div className="modal">
        <div className="modal-content">
          {this.props.content}
          <div className="footer">
            <div style ={{color: "black"}}>
              {this.props.content}
            </div>
            <button onClick={this.props.onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

export default Modal;