import {GetSetMixin, Store} from 'mesosphere-shared-reactjs';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../events/AppDispatcher';
import getActionMixin from '../mixins/getActionMixin';
import EventTypes from '../constants/EventTypes';
import ProcessStageUtil from '../utils/ProcessStageUtil';

let requestInterval = null;

function startPolling() {
  stopPolling();
  PreFlightStore.fetchStageStatus();
  requestInterval = setInterval(PreFlightStore.fetchStageStatus, 4000);
}

function stopPolling() {
  clearInterval(requestInterval);
  requestInterval = null;
}

let PreFlightStore = Store.createStore({
  storeID: 'preFlight',

  mixins: [GetSetMixin, getActionMixin('preflight')],

  init: function () {
    let initialState = this.getInitialState();
    this.set(initialState);
    this.emit(EventTypes.PREFLIGHT_STATE_CHANGE, initialState);

    startPolling();
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  handleOngoingLogsRequest: function () {
    // We could do something here if we wanted.
  },

  handleOngoingUpdateRequest: function () {
    // We could do something here if we wanted.
  },

  handleOngoingBeginRequest: function () {
    // We could do something here if we wanted.
  },

  processUpdateError: function () {
    this.emit(EventTypes.PREFLIGHT_STATE_ERROR);
  },

  processUpdateSuccess: function (data) {
    var processedState = ProcessStageUtil.processState(data);

    this.set(processedState);
    this.emit(EventTypes.PREFLIGHT_STATE_CHANGE, processedState);

    if (this.isCompleted()) {
      stopPolling();
      this.emit(EventTypes.PREFLIGHT_STATE_FINISH, processedState);
      return;
    }
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let {action} = payload;

    switch (action.type) {
      case ActionTypes.PREFLIGHT_LOGS_ONGOING:
        PreFlightStore.handleOngoingLogsRequest();
        break;
      case ActionTypes.PREFLIGHT_UPDATE_ERROR:
        PreFlightStore.processUpdateError(action.data);
        break;
      case ActionTypes.PREFLIGHT_UPDATE_SUCCESS:
        PreFlightStore.processUpdateSuccess(action.data);
        break;
      case ActionTypes.PREFLIGHT_UPDATE_ONGOING:
        PreFlightStore.handleOngoingUpdateRequest();
        break;
      case ActionTypes.PREFLIGHT_BEGIN_SUCCESS:
        PreFlightStore.emit(EventTypes.PREFLIGHT_BEGIN_SUCCESS);
        break;
      case ActionTypes.PREFLIGHT_BEGIN_ERROR:
        PreFlightStore.emit(EventTypes.PREFLIGHT_BEGIN_ERROR, action.data);
        break;
      case ActionTypes.PREFLIGHT_BEGIN_ONGOING:
        PreFlightStore.handleOngoingBeginRequest();
        break;
    }

    return true;
  })

});

module.exports = PreFlightStore;
