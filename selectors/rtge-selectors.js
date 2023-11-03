

import { createSelector } from 'reselect';
import { get, head } from "lodash";
import { additionalLayersSelector } from '@mapstore/selectors/layers';
import {
    selectedTilesLayerId
} from "../constants/rtge-constants";

export const getRtge = state => get(state, "rtge");

export const getRtgeState = createSelector(
    [ getRtge ],
    (selector) => selector
);

export const isOpen = (state) => get(state, 'controls.rtge.enabled');

export const  getActiveTab = (state) => get(state, 'rtge.activeTab');

export const getSelectedTiles = (state) => get(state, 'rtge.selectedTiles');

export const getSelectedTilesLayer = (state) => {
    const additionallayers = additionalLayersSelector(state) || [];
    return head(additionallayers.filter(({ id }) => id === selectedTilesLayerId));
};
