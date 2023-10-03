/* eslint-disable no-console */
// pour l'extension "sampleExtension" on déclare les variables nécessaires ainsi qu'ne variable action
// la variable action sert à définir l'action qui est déclenchée
// les autres variables sont les variables de fonctionnement pour le plugin

import { actions, tabTypes } from "../actions/rtge-action";
import assign from 'object-assign';

const initialState = {
    value: 1,
    activeTab: tabTypes.HOME
};

export default (state = initialState, action) => {
    // console.log(action);
    switch (action.type) {
    case actions.INCREASE_COUNTER:
        return assign({}, state, { value: state.value + 1 });
    case actions.CHANGE_TAB:
        return assign({}, state, { activeTab: action.tab });
    default:
        return state;
    }
};
