/* eslint-disable no-console */
// pour l'extension "sampleExtension" on déclare les variables nécessaires ainsi qu'ne variable action
// la variable action sert à définir l'action qui est déclenchée
// les autres variables sont les variables de fonctionnement pour le plugin

import { actions, tabTypes } from "../actions/rtge-action";
import assign from 'object-assign';

const initialState = {
    value: 1,
    activeTab: tabTypes.HOME,
    selectedTiles: [],
    selectedRow: []
};

/**
 * rtge reducer
 * @memberof rtge.reducer
 * @param state - the plugins state
 * @param action - the current action triggered
 * @returns - returns the current actions to be made from the current action
 */
export default (state = initialState, action) => {
    // console.log(action);
    // console.log(state);
    switch (action.type) {
    case actions.INCREASE_COUNTER:
        return assign({}, state, { value: state.value + 1 });
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
    default:
        return state;
    }

};
