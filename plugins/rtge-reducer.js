// pour l'extension "sampleExtension" on déclare les variables nécessaires ainsi qu'ne variable action
// la variable action sert à définir l'action qui est déclenchée
// les autres variables sont les variables de fonctionnement pour le plugin

import { actions } from "./rtge-action";
import assign from 'object-assign';

const initialState = {
    value: 1
};

export default (state = initialState, action) => {
    switch (action.type) {
    case actions.INCREASE_COUNTER:
        return assign({}, state, { value: state.value + 1 });
    default:
        return state;
    }
};
