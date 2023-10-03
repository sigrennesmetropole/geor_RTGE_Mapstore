export const actions = {
    INCREASE_COUNTER: 'RTGE:INCREASE_COUNTER',
    OPEN_PANEL: 'RTGE:OPEN_PANEL',
    CLOSE_PANEL: 'RTGE:CLOSE_PANEL',
    CHANGE_TAB: 'RTGE:CHANGE_TAB'
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

// export function openPanel() {
//     return {
//         type: actions.OPEN_PANEL
//     };
// }

// export function closePanel() {
//     return {
//         type: actions.CLOSE_PANEL
//     };
// }

export function changeTab(tab) {
    return {
        type: actions.CHANGE_TAB,
        tab
    };
}
