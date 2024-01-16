/* eslint-disable no-console */
import {UPDATE_MAP_LAYOUT} from "@mapstore/actions/maplayout";

export const actions = {
    OPEN_PANEL: 'RTGE:OPEN_PANEL',
    CHANGE_TAB: 'RTGE:CHANGE_TAB',
    START_DRAW: 'RTGE:START_DRAW',
    STOP_DRAW: 'RTGE:STOP_DRAW',
    DRAW_POLYLINE: 'RTGE:DRAW_POLYLINE',
    DRAW_POLYGON: 'RTGE:DRAW_POLYGON',
    SHOW_GRID: 'RTGE:SHOW_GRID',
    INIT_DRAWING_MOD: 'RTGE:INIT_DRAWING_MOD',
    GET_FEATURES: 'RTGE:GET_FEATURES',
    INIT_PROJECTIONS: 'RTGE:INIT_PROJECTIONS',
    ADD_FEATURES: 'RTGE:ADD_FEATURES',
    SWITCH_DRAW: 'RTGE:SWITCH_DRAW',
    REMOVE_SELECTED_TILES: 'RTGE:REMOVE_SELECTED_TILES',
    SEND_MAIL: 'RTGE:SEND_MAIL',
    CLICK_TABLE: 'RTGE:CLICK_TABLE',
    UPDATE_USER: 'RTGE:UPDATE_USER',
    GET_USER_DETAILS: 'RTGE:GET_USER_DETAILS',
    INIT_CONFIGS: "RTGE:INIT_CONFIGS",
    CLOSE_RTGE: "RTGE:CLOSE_RTGE",
    GET_USER_ROLES: "RTGE:GET_USER_ROLES",
    UNDERGROUND_DATA_JUSTIFICATION_REQUIRED: "RTGE:UNDERGROUND_DATA_JUSTIFICATION_REQUIRED",
    REMOVE_ALL_TILES: "RTGE:REMOVE_ALL_TILES",
    MAIL_SENT: "RTGE:MAIL_SENT"
};

export const tabTypes = {
    HOME: 'RTGE:HOME',
    SELECT: 'RTGE:SELECT',
    SEND: 'RTGE:SEND'
};

/**
 * changeTab start action to change tab
 * @memberof rtge.actions
 * @param tab - the tab string we should use
 * @returns - action change tab
 */
export function changeTab(tab) {
    return {
        type: actions.CHANGE_TAB,
        tab
    };
}

/**
 * startDraw start action to draw
 * @memberof rtge.actions
 * @param geometryType - the geometry type we want to use
 * @returns - action start draw
 */
export function startDraw(geometryType) {
    return {
        type: actions.START_DRAW,
        geometryType
    };
}

/**
 * stopDraw start action to stop drawing
 * @memberof rtge.actions
 * @returns - action stop draw
 */
export function stopDraw() {
    return {
        type: actions.STOP_DRAW
    };
}

/**
 * showGrid start action to show tiles grid on map
 * @memberof rtge.actions
 * @returns - action show grid
 */
export function showGrid() {
    return {
        type: actions.SHOW_GRID
    };
}

/**
 * initDrawingMod start action to init drawing
 * @memberof rtge.actions
 * @returns - action init drawing
 */
export function initDrawingMod() {
    return {
        type: actions.INIT_DRAWING_MOD
    };
}

/**
 * getFeatures start action get features from the draw
 * @memberof rtge.actions
 * @param geometry - the geometry we made on the map
 * @returns - action get features and the geometry itself
 */
export function getFeatures(geometry) {
    return {
        type: actions.GET_FEATURES,
        geometry
    };
}

/**
 * initProjections start action project projections
 * @memberof rtge.actions
 * @returns - action init projections
 */
export function initProjections() {
    return {
        type: actions.INIT_PROJECTIONS
    };
}

/**
 * addFeatures start action to add new features
 * @memberof rtge.actions
 * @param features - list of features to save in the table
 * @returns - action add features and the list of features
 */
export function addFeatures(features) {
    return {
        type: actions.ADD_FEATURES,
        features
    };
}

/**
 * switchDraw switch the drawing tool
 * @memberof rtge.actions
 * @param geometryType - the new geometry we want to use as drawing method
 * @returns - action switch draw and the geometryType
 */
export function switchDraw(geometryType) {
    return {
        type: actions.SWITCH_DRAW,
        geometryType
    };
}

/**
 * removeSelectedTiles actions to remove the tiles
 * @memberof rtge.actions
 * @returns - action remove selected tiles
 */
export function removeSelectedTiles() {
    return {
        type: actions.REMOVE_SELECTED_TILES
    };
}

/**
 * clickTable actions when table is clicked
 * @memberof rtge.actions
 * @param row - row id of the clicked row
 * @returns - action click table
 */
export function clickTable(feature, control, shift) {
    return {
        type: actions.CLICK_TABLE,
        feature,
        control,
        shift
    };
}

/**
 * sendMail actions form button to populate mail is pressed
 * @memberof rtge.actions
 * @param form - form content
 * @returns - action send mail and corresponding data
 */
export function sendMail(form, undergroundDataIsRequired) {
    return {
        type: actions.SEND_MAIL,
        form,
        undergroundDataIsRequired
    };
}

/**
 * updateUser actions to call when user data is available
 * @memberof rtge.actions
 * @param newUserDetails - list of user data to store in state
 * @returns - action update user
 */
export function updateUser(newUserDetails) {
    return {
        type: actions.UPDATE_USER,
        newUserDetails
    };
}

/**
 * getUserDetails action triggered when we look to get user data
 * @memberof rtge.actions
 * @returns - action get user details
 */
export function getUserDetails() {
    return {
        type: actions.GET_USER_DETAILS
    };
}

/**
 * initConfigs action triggered to initialize or reinitialize plugin basic configs
 * @memberof rtge.actions
 * @param configs - configs object
 * @returns - action init configs with those configs
 */
export function initConfigs(configs) {
    return {
        type: actions.INIT_CONFIGS,
        configs
    };
}

/**
 * closeRtge action to close configs
 * @memberof rtge.actions
 * @returns - action close rtge plugin
 */
export function closeRtge() {
    return {
        type: actions.CLOSE_RTGE
    };
}

/**
 * getUserRoles action to get roles of users
 * @memberof rtge.actions
 * @returns - action get user roles
 */
export function getUserRoles() {
    return {
        type: actions.GET_USER_ROLES
    };
}

/**
 * setUndergroundDataJustificationRequired action throw when you egt the underground role for justification to obtain data
 * @memberof rtge.actions
 * @returns - action underground data justification required
 */
export function setUndergroundDataJustificationRequired(undergroundDataIsRequired) {
    return {
        type: actions.UNDERGROUND_DATA_JUSTIFICATION_REQUIRED,
        undergroundDataIsRequired
    };
}

/**
 * removeAllTiles actions to remove all tiles
 * @memberof rtge.actions
 * @returns - action remove all tiles
 */
export function removeAllTiles() {
    return {
        type: actions.REMOVE_ALL_TILES
    };
}

/**
 * mailSent actions to tell mail has been sent, stop the spinner
 * @memberof rtge.actions
 * @returns - action mail sent
 */
export function mailSent() {
    return {
        type: actions.MAIL_SENT
    };
}

/**
 * rtgeUpdateMapLayout action to update map layout at plugin start
 * @memberof rtge.actions
 * @returns - action starts plugin page with source set
 */
export function rtgeUpdateMapLayout(layout) {
    return {
        type: UPDATE_MAP_LAYOUT,
        layout,
        source: 'rtge'
    };
}
