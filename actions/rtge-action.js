/* eslint-disable no-console */
export const actions = {
    INCREASE_COUNTER: 'RTGE:INCREASE_COUNTER',
    OPEN_PANEL: 'RTGE:OPEN_PANEL',
    CLOSE_PANEL: 'RTGE:CLOSE_PANEL',
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
    CLICK_TABLE: 'RTGE:CLICK_TABLE'
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
export function clickTable(feature, control) {
    return {
        type: actions.CLICK_TABLE,
        feature,
        control
    };
}

/**
 * TODO: gérer les commentaires proprement.
 * sendMail actions when table is clicked
 * @memberof rtge.actions
 * @param row - row id of the clicked row
 * @returns - action click table
 */
export function sendMail(form) {
    return {
        type: actions.SEND_MAIL,
        form
    };
}
