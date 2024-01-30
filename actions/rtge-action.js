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
 * rtgechangeTab start action to change tab
 * @memberof rtge.actions
 * @param tab - the tab string we should use
 * @returns - action change tab
 */
export function rtgechangeTab(tab) {
    return {
        type: actions.CHANGE_TAB,
        tab
    };
}

/**
 * rtgestartDraw start action to draw
 * @memberof rtge.actions
 * @param geometryType - the geometry type we want to use
 * @returns - action start draw
 */
export function rtgestartDraw(geometryType) {
    return {
        type: actions.START_DRAW,
        geometryType
    };
}

/**
 * rtgestopDraw start action to stop drawing
 * @memberof rtge.actions
 * @returns - action stop draw
 */
export function rtgeStopDraw() {
    return {
        type: actions.STOP_DRAW
    };
}

/**
 * rtgeshowGrid start action to show tiles grid on map
 * @memberof rtge.actions
 * @returns - action show grid
 */
export function rtgeshowGrid() {
    return {
        type: actions.SHOW_GRID
    };
}

/**
 * rtgeinitDrawingMod start action to init drawing
 * @memberof rtge.actions
 * @returns - action init drawing
 */
export function rtgeinitDrawingMod() {
    return {
        type: actions.INIT_DRAWING_MOD
    };
}

/**
 * rtgegetFeatures start action get features from the draw
 * @memberof rtge.actions
 * @param geometry - the geometry we made on the map
 * @returns - action get features and the geometry itself
 */
export function rtgegetFeatures(geometry) {
    return {
        type: actions.GET_FEATURES,
        geometry
    };
}

/**
 * rtgeinitProjections start action project projections
 * @memberof rtge.actions
 * @returns - action init projections
 */
export function rtgeinitProjections() {
    return {
        type: actions.INIT_PROJECTIONS
    };
}

/**
 * rtgeaddFeatures start action to add new features
 * @memberof rtge.actions
 * @param features - list of features to save in the table
 * @returns - action add features and the list of features
 */
export function rtgeaddFeatures(features) {
    return {
        type: actions.ADD_FEATURES,
        features
    };
}

/**
 * rtgeswitchDraw switch the drawing tool
 * @memberof rtge.actions
 * @param geometryType - the new geometry we want to use as drawing method
 * @returns - action switch draw and the geometryType
 */
export function rtgeswitchDraw(geometryType) {
    return {
        type: actions.SWITCH_DRAW,
        geometryType
    };
}

/**
 * rtgeremoveSelectedTiles actions to remove the tiles
 * @memberof rtge.actions
 * @returns - action remove selected tiles
 */
export function rtgeremoveSelectedTiles() {
    return {
        type: actions.REMOVE_SELECTED_TILES
    };
}

/**
 * rtgeclickTable actions when table is clicked
 * @memberof rtge.actions
 * @param row - row id of the clicked row
 * @returns - action click table
 */
export function rtgeclickTable(feature, control, shift) {
    return {
        type: actions.CLICK_TABLE,
        feature,
        control,
        shift
    };
}

/**
 * rtgesendMail actions form button to populate mail is pressed
 * @memberof rtge.actions
 * @param form - form content
 * @returns - action send mail and corresponding data
 */
export function rtgesendMail(form, undergroundDataIsRequired) {
    return {
        type: actions.SEND_MAIL,
        form,
        undergroundDataIsRequired
    };
}

/**
 * rtgeupdateUser actions to call when user data is available
 * @memberof rtge.actions
 * @param newUserDetails - list of user data to store in state
 * @returns - action update user
 */
export function rtgeupdateUser(newUserDetails) {
    return {
        type: actions.UPDATE_USER,
        newUserDetails
    };
}

/**
 * rtgegetUserDetails action triggered when we look to get user data
 * @memberof rtge.actions
 * @returns - action get user details
 */
export function rtgegetUserDetails() {
    return {
        type: actions.GET_USER_DETAILS
    };
}

/**
 * rtgeinitConfigs action triggered to initialize or reinitialize plugin basic configs
 * @memberof rtge.actions
 * @param configs - configs object
 * @returns - action init configs with those configs
 */
export function rtgeinitConfigs(configs) {
    return {
        type: actions.INIT_CONFIGS,
        configs
    };
}

/**
 * rtgecloseRtge action to close configs
 * @memberof rtge.actions
 * @returns - action close rtge plugin
 */
export function rtgecloseRtge() {
    return {
        type: actions.CLOSE_RTGE
    };
}

/**
 * rtgegetUserRoles action to get roles of users
 * @memberof rtge.actions
 * @returns - action get user roles
 */
export function rtgegetUserRoles() {
    return {
        type: actions.GET_USER_ROLES
    };
}

/**
 * rtgesetUndergroundDataJustificationRequired action throw when you egt the underground role for justification to obtain data
 * @memberof rtge.actions
 * @returns - action underground data justification required
 */
export function rtgesetUndergroundDataJustificationRequired(undergroundDataIsRequired) {
    return {
        type: actions.UNDERGROUND_DATA_JUSTIFICATION_REQUIRED,
        undergroundDataIsRequired
    };
}

/**
 * rtgeremoveAllTiles actions to remove all tiles
 * @memberof rtge.actions
 * @returns - action remove all tiles
 */
export function rtgeremoveAllTiles() {
    return {
        type: actions.REMOVE_ALL_TILES
    };
}

/**
 * rtgemailSent actions to tell mail has been sent, stop the spinner
 * @memberof rtge.actions
 * @returns - action mail sent
 */
export function rtgemailSent() {
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
