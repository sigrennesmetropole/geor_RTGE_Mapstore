

import { createSelector } from 'reselect';
import { get, head } from "lodash";
import { additionalLayersSelector } from '@mapstore/selectors/layers';
import {
    selectedTilesLayerId
} from "../constants/rtge-constants";

/**
 * getRtge allows to switch between drawings
 * @memberof rtge.selectors
 * @param state - application state
 * @returns - content of application state
 */
export const getRtge = state => get(state, "rtge");

export const getRtgeState = createSelector(
    [ getRtge ],
    (selector) => selector
);

/**
 * isOpen checks if plugin tab is open or not
 * @memberof rtge.selectors
 * @param state - application state
 * @returns - returns the plugins panel state
 */
export const isOpen = (state) => get(state, 'controls.rtge.enabled');

/**
 * getActiveTab checks which tab is open
 * @memberof rtge.selectors
 * @param state - application state
 * @returns - returns the tabs state
 */
export const  getActiveTab = (state) => get(state, 'rtge.activeTab');

/**
 * getSelectedTiles give list of selected tile with geometry
 * @memberof rtge.selectors
 * @param state - application state
 * @returns - returns the tabs state
 */
export const getSelectedTiles = (state) => get(state, 'rtge.selectedTiles');

/**
 * getSelectedTilesLayer give the layer we need in this plugin
 * @memberof rtge.selectors
 * @param state - application state
 * @returns - returns the layer we need to get tiles data
 */
export const getSelectedTilesLayer = (state) => {
    const additionallayers = additionalLayersSelector(state) || [];
    return head(additionallayers.filter(({ id }) => id === selectedTilesLayerId));
};

/**
 * getSelectionGeometryType give the current geometry used
 * @memberof rtge.selectors
 * @param state - application state
 * @returns - returns the geometry type as string
 */
export const getSelectionGeometryType = (state) => get(state, "rtge.selectionGeometryType");

/**
 * getActiveSelection give the current geometry button clicked
 * @memberof rtge.selectors
 * @param state - application state
 * @returns - returns the current button selected as string
 */
export const getActiveSelection = (state) => get(state, 'rtge.activeSelection');

/**
 * getSelectedRow give the row tables selected
 * @memberof rtge.selectors
 * @param state - application state
 * @returns - returns the current table row selected
 */
export const getSelectedRow = (state) => get(state, 'rtge.selectedRow');

/**
 * TODO: revoir les comms'
 * getSelectedRow give the row tables selected
 * @memberof rtge.selectors
 * @param state - application state
 * @returns - returns the current table row selected
 */
export const getUserDetails = (state) => get(state, 'rtge.user');
