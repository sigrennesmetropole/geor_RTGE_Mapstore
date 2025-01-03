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
    MAIL_SENT: "RTGE:MAIL_SENT",
    MAIL_NOT_SENT: "RTGE:MAIL_NOT_SENT"
};

export const tabTypes = {
    HOME: 'RTGE:HOME',
    SELECT: 'RTGE:SELECT',
    SEND: 'RTGE:SEND'
};

/**
 * rtgeChangeTab start action to change tab
 * @memberof rtge.actions
 * @param tab - the tab string we should use
 * @returns - action change tab
 */
export function rtgeChangeTab(tab) {
    return {
        type: actions.CHANGE_TAB,
        tab
    };
}

/**
 * rtgeStartDraw start action to draw
 * @memberof rtge.actions
 * @param geometryType - the geometry type we want to use
 * @returns - action start draw
 */
export function rtgeStartDraw(geometryType) {
    return {
        type: actions.START_DRAW,
        geometryType
    };
}

/**
 * rtgeStopDraw start action to stop drawing
 * @memberof rtge.actions
 * @returns - action stop draw
 */
export function rtgeStopDraw() {
    return {
        type: actions.STOP_DRAW
    };
}

/**
 * rtgeShowGrid start action to show tiles grid on map
 * @memberof rtge.actions
 * @returns - action show grid
 */
export function rtgeShowGrid() {
    return {
        type: actions.SHOW_GRID
    };
}

/**
 * rtgeInitDrawingMod start action to init drawing
 * @memberof rtge.actions
 * @returns - action init drawing
 */
export function rtgeInitDrawingMod() {
    return {
        type: actions.INIT_DRAWING_MOD
    };
}

/**
 * rtgeGetFeatures start action get features from the draw
 * @memberof rtge.actions
 * @param geometry - the geometry we made on the map
 * @returns - action get features and the geometry itself
 */
export function rtgeGetFeatures(geometry) {
    return {
        type: actions.GET_FEATURES,
        geometry
    };
}

/**
 * rtgeInitProjections start action project projections
 * @memberof rtge.actions
 * @returns - action init projections
 */
export function rtgeInitProjections() {
    return {
        type: actions.INIT_PROJECTIONS
    };
}

/**
 * rtgeAddFeatures start action to add new features
 * @memberof rtge.actions
 * @param features - list of features to save in the table
 * @returns - action add features and the list of features
 */
export function rtgeAddFeatures(features) {
    return {
        type: actions.ADD_FEATURES,
        features
    };
}

/**
 * rtgeSwitchDraw switch the drawing tool
 * @memberof rtge.actions
 * @param geometryType - the new geometry we want to use as drawing method
 * @returns - action switch draw and the geometryType
 */
export function rtgeSwitchDraw(geometryType) {
    return {
        type: actions.SWITCH_DRAW,
        geometryType
    };
}

/**
 * rtgeRemoveSelectedTiles actions to remove the tiles
 * @memberof rtge.actions
 * @returns - action remove selected tiles
 */
export function rtgeRemoveSelectedTiles() {
    return {
        type: actions.REMOVE_SELECTED_TILES
    };
}

/**
 * rtgeClickTable actions when table is clicked
 * @memberof rtge.actions
 * @param row - row id of the clicked row
 * @returns - action click table
 */
export function rtgeClickTable(feature, control, shift) {
    return {
        type: actions.CLICK_TABLE,
        feature,
        control,
        shift
    };
}

/**
 * rtgeSendMail actions form button to populate mail is pressed
 * @memberof rtge.actions
 * @param form - form content
 * @returns - action send mail and corresponding data
 */
export function rtgeSendMail(form) {
    return {
        type: actions.SEND_MAIL,
        form
    };
}

/**
 * rtgeUpdateUser actions to call when user data is available
 * @memberof rtge.actions
 * @param newUserDetails - list of user data to store in state
 * @returns - action update user
 */
export function rtgeUpdateUser(newUserDetails) {
    return {
        type: actions.UPDATE_USER,
        newUserDetails
    };
}

/**
 * rtgeGetUserDetails action triggered when we look to get user data
 * @memberof rtge.actions
 * @returns - action get user details
 */
export function rtgeGetUserDetails() {
    return {
        type: actions.GET_USER_DETAILS
    };
}

/**
 * rtgeInitConfigs action triggered to initialize or reinitialize plugin basic configs
 * @memberof rtge.actions
 * @param configs - configs object
 * @returns - action init configs with those configs
 */
export function rtgeInitConfigs(configs) {
    return {
        type: actions.INIT_CONFIGS,
        configs
    };
}

/**
 * rtgeCloseRtge action to close configs
 * @memberof rtge.actions
 * @returns - action close rtge plugin
 */
export function rtgeCloseRtge() {
    return {
        type: actions.CLOSE_RTGE
    };
}

/**
 * rtgeGetUserRoles action to get roles of users
 * @memberof rtge.actions
 * @returns - action get user roles
 */
export function rtgeGetUserRoles() {
    return {
        type: actions.GET_USER_ROLES
    };
}

/**
 * rtgeSetUndergroundDataJustificationRequired action throw when you egt the underground role for justification to obtain data
 * @memberof rtge.actions
 * @returns - action underground data justification required
 */
export function rtgeSetUndergroundDataJustificationRequired(undergroundDataIsRequired) {
    return {
        type: actions.UNDERGROUND_DATA_JUSTIFICATION_REQUIRED,
        undergroundDataIsRequired
    };
}

/**
 * rtgeRemoveAllTiles actions to remove all tiles
 * @memberof rtge.actions
 * @returns - action remove all tiles
 */
export function rtgeRemoveAllTiles() {
    return {
        type: actions.REMOVE_ALL_TILES
    };
}

/**
 * rtgeMailSent actions to tell mail has been sent, stop the spinner
 * @memberof rtge.actions
 * @returns - action mail sent
 */
export function rtgeMailSent() {
    return {
        type: actions.MAIL_SENT
    };
}

/**
 * rtgeMailNotSent actions to tell mail has been sent, stop the spinner
 * @memberof rtge.actions
 * @returns - action mail sent
 */
export function rtgeMailNotSent() {
    return {
        type: actions.MAIL_NOT_SENT
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
