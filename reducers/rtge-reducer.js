/* eslint-disable no-console */
import { actions, tabTypes } from "../actions/rtge-action";
import assign from 'object-assign';

const initialState = {
    value: 1,
    activeTab: tabTypes.HOME,
    selectedTiles: [],
    selectedRows: [],
    mailRequestInProgress: false
};

/**
 * rtge reducer
 * @memberof rtge.reducer
 * @param state - the plugins state
 * @param action - the current action triggered
 * @returns - returns the current actions to be made from the current action
 */
export default (state = initialState, action) => {
    //console.log(action);
    //console.log(state);
    switch (action.type) {
    case actions.CHANGE_TAB:
        return assign({}, state, { activeTab: action.tab });
    case actions.ADD_FEATURES:
        return assign({}, state, { selectedTiles: action.features });
    case actions.START_DRAW:
        return assign({}, state, { selectionGeometryType: action.geometryType });
    case actions.STOP_DRAW:
        return assign({}, state, { selectionGeometryType: undefined });
    case actions.SWITCH_DRAW:
        return assign({}, state, { activeSelection: action.geometryType });
    case actions.UPDATE_USER:
        return assign({}, state, { user: action.newUserDetails });
    case actions.INIT_CONFIGS:
        return assign({}, state, { configs: action.configs });
    case actions.SEND_MAIL:
        return assign({}, state, { mailRequestInProgress: true });
    case actions.MAIL_SENT:
        return assign({}, state, { mailRequestInProgress: false });
    case actions.MAIL_NOT_SENT:
        return assign({}, state, { mailRequestInProgress: false });
    default:
        return state;
    }

};
