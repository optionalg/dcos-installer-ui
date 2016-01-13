import mixin from 'reactjs-mixin';
import React from 'react/addons';
import {StoreMixin} from 'mesosphere-shared-reactjs';

import IconSpinner from './icons/IconSpinner';
import InstallerStore from '../stores/InstallerStore';

class EnforceStage extends mixin(StoreMixin) {
  constructor() {
    super();

    this.state = {
      currentStage: null
    };

    this.store_listeners = [
      {name: 'installer', events: ['currentStageChange']}
    ];
  }

  componentDidMount() {
    super.componentDidMount();

    InstallerStore.getCurrentStage();
  }

  // Uncomment this to force user to be on current stage.
  // shouldComponentUpdate(nextProps) {
  //   let nextStage = nextProps.routes[nextProps.routes.length - 1].path;
  //   let sameStage = nextStage === this.state.currentStage;

  //   if (!sameStage) {
  //     global.window.location.hash = this.state.currentStage;
  //   }

  //   return sameStage;
  // }

  onInstallerStoreCurrentStageChange(currentStage) {
    this.setState({currentStage});
  }

  getLoadingScreen() {
    return (
      <div className="spinner-wrapper flex-box flex-box-align-vertical-center
        flex-box-align-horizontal-center">
        <IconSpinner />
      </div>
    );
  }

  render() {
    // Uncomment this to force user to be on current stage.
    // if (this.state.currentStage == null) {
    //   return this.getLoadingScreen();
    // }

    return this.props.children;
  }
}

EnforceStage.propTypes = {
  children: React.PropTypes.node
};

module.exports = EnforceStage;