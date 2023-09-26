export const actions = {
    INCREASE_COUNTER: 'RTGE:INCREASE_COUNTER',
    OPEN_PANEL: 'RTGE:OPEN_PANEL',
    CLOSE_PANEL: 'RTGE:CLOSE_PANEL'
};

// ici on met les fonctions utilisées dans le plugin ainsi que celles de mapstore (ces dernières ont simplement à être mentionnées)
export function onIncrease() {
    return {
        type: actions.INCREASE_COUNTER
    };
}

export function openPanel() {
    return {
        type: actions.OPEN_PANEL
    };
}

export function closePanel() {
    return {
        type: actions.CLOSE_PANEL
    };
}
