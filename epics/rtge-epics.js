import Rx from "rxjs";
import { actions } from "../actions/rtge-action";
import {toggleControl, TOGGLE_CONTROL} from "@mapstore/actions/controls";
import { RTGE_PANEL_WIDTH, RIGHT_SIDEBAR_MARGIN_LEFT } from "../constants/rtge-constants";
import {
    updateDockPanelsList,
    updateMapLayout
} from "@mapstore/actions/maplayout";
import { isOpen } from "../selectors/rtge-selectors";

let currentLayout;
// ici c'est pour le logging, les informations utiles pour les utilisateurs
export const logCounterValue = (action$, store) => action$.ofType(actions.INCREASE_COUNTER).switchMap(() => {
    /* eslint-disable */
    console.log('CURRENT VALUE: ' + store.getState().rtge.value);
    /* eslint-enable */
    return Rx.Observable.empty();
});

export const openRTGEPanelEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL)
    .filter(action => action.control === 'rtge' && !!store.getState() && !!isOpen(store.getState()))
    .switchMap(() => {
        let layout = store.getState().maplayout;
        layout = {transform: layout.layout.transform, height: layout.layout.height, rightPanel: true, leftPanel: false, ...layout.boundingMapRect, right: RTGE_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT, boundingMapRect: {...layout.boundingMapRect, right: RTGE_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT}, boundingSidebarRect: layout.boundingSidebarRect};
        currentLayout = layout;
        return Rx.Observable.from([updateDockPanelsList('rtge', 'add', 'right'), updateMapLayout(layout)]);
    });

export const closeRTGEPanelEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL)
    .filter(action => action.control === 'rtge' && !!store.getState() && !isOpen(store.getState()) )
    .switchMap(() => {
        let layout = store.getState().maplayout;
        layout = {transform: layout.layout.transform, height: layout.layout.height, rightPanel: true, leftPanel: false, ...layout.boundingMapRect, right: layout.boundingSidebarRect.right, boundingMapRect: {...layout.boundingMapRect, right: layout.boundingSidebarRect.right}, boundingSidebarRect: layout.boundingSidebarRect};
        currentLayout = layout;
        return Rx.Observable.from([updateDockPanelsList('rtge', 'remove', 'right'), updateMapLayout(layout)]);
    });
