/* eslint-disable no-console */
export const actions = {
    INCREASE_COUNTER: 'RTGE:INCREASE_COUNTER',
    OPEN_PANEL: 'RTGE:OPEN_PANEL',
    CLOSE_PANEL: 'RTGE:CLOSE_PANEL',
    CHANGE_TAB: 'RTGE:CHANGE_TAB',
    START_DRAW: 'RTGE:START_DRAW',
    DRAW_POLYLINE: 'RTGE:DRAW_POLYLINE',
    DRAW_POLYGON: 'RTGE:DRAW_POLYGON',
    SHOW_GRID: 'RTGE:SHOW_GRID',
    INIT_DRAWING_MOD: 'RTGE:INIT_DRAWING_MOD',
    GET_FEATURES: 'RTGE:GET_FEATURES',
    INIT_PROJECTIONS: 'RTGE:INIT_PROJECTIONS',
    ADD_FEATURES: 'RTGE:ADD_FEATURES'
};

export const tabTypes = {
    HOME: 'RTGE:HOME',
    SELECT: 'RTGE:SELECT',
    SEND: 'RTGE:SEND'
};

// ici on met les fonctions utilisées dans le plugin ainsi que celles de mapstore (ces dernières ont simplement à être mentionnées)
export function onIncrease() {
    return {
        type: actions.INCREASE_COUNTER
    };
}

export function changeTab(tab) {

    switch (tab) {
    case tabTypes.HOME:
        document.getElementsByClassName('homeButton')[0].classList.add('active');
        document.getElementsByClassName('selectButton')[0].classList.remove('active');
        document.getElementsByClassName('sendButton')[0].classList.remove('active');
        break;

    case tabTypes.SELECT:
        document.getElementsByClassName('homeButton')[0].classList.remove('active');
        document.getElementsByClassName('selectButton')[0].classList.add('active');
        document.getElementsByClassName('sendButton')[0].classList.remove('active');
        break;

    case tabTypes.SEND:
        document.getElementsByClassName('homeButton')[0].classList.remove('active');
        document.getElementsByClassName('selectButton')[0].classList.remove('active');
        document.getElementsByClassName('sendButton')[0].classList.add('active');
        break;

    default:
        document.getElementsByClassName('homeButton')[0].classList.add('active');
        document.getElementsByClassName('selectButton')[0].classList.remove('active');
        document.getElementsByClassName('sendButton')[0].classList.remove('active');
        break;
    }

    return {
        type: actions.CHANGE_TAB,
        tab
    };
}

export function startDraw(geometryType) {
    return {
        type: actions.START_DRAW,
        geometryType
    };
}

export function showGrid() {
    return {
        type: actions.SHOW_GRID
    };
}

export function initDrawingMod() {
    return {
        type: actions.INIT_DRAWING_MOD
    };
}

export function getFeatures(geometry) {
    return {
        type: actions.GET_FEATURES,
        geometry
    };
}

export function initProjections() {
    return {
        type: actions.INIT_PROJECTIONS
    };
}

export function addFeatures(features) {
    return {
        type: actions.ADD_FEATURES,
        features
    };
}
