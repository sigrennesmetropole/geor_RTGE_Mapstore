import Rx from "rxjs";
import { actions } from "./rtge-action";

// ici c'est pour le logging, les informations utiles pour les utilisateurs
export const logCounterValue = (action$, store) => action$.ofType(actions.INCREASE_COUNTER).switchMap(() => {
    /* eslint-disable */
    console.log('CURRENT VALUE: ' + store.getState().rtge.value);
    /* eslint-enable */
    return Rx.Observable.empty();
});
