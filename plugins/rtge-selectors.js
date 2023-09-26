

import { createSelector } from 'reselect';
import { get } from "lodash";

export const getRtge = state => get(state, "rtge");

export const getRtgeState = createSelector(
    [ getRtge ],
    (selector) => selector
);

export const isOpen = (state) => get(state, 'controls.RTGE.enabled');
