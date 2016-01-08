/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import APIErrorModal from './APIErrorModal';

const METHODS_TO_BIND = ['handleErrorClose', 'handleErrorClick'];

class ErrorLabel extends React.Component {
  constructor() {
    super();

    this.state = {
      openErrorModal: false
    };

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  handleErrorClick() {
    this.setState({openErrorModal: true});
  }

  handleErrorClose() {
    console.log('happened');
    this.setState({openErrorModal: false});
  }

  getErrorLabel(errors) {
    if (errors.length === 0) {
      return <span>No Errors Found</span>;
    }

    return (
      <a onClick={this.handleErrorClick}>
        {`${errors.length} Errors Found`}
      </a>
    );
  }

  render() {
    let errors = []; // DeployStore.getErrors();

    return (
      <div>
        {this.getErrorLabel(errors)}
        <APIErrorModal
          errors={errors}
          onClose={this.handleErrorClose}
          open={this.state.openErrorModal} />
      </div>
    );
  }
}

ErrorLabel.propTypes = {
  step: React.PropTypes.string // preflight, deploy, postflight
};

module.exports = ErrorLabel;