import React from 'react';
import {connect} from "react-redux";
import { name } from '../../../config';

import {createPlugin} from "@mapstore/utils/PluginsUtils";
import { toggleControl } from '@mapstore/actions/controls';
import { RTGEComponent } from "../components/Component";
import { Glyphicon } from 'react-bootstrap';

import { changeZoomLevel } from "@mapstore/actions/map";
import {
    changeTab,
    switchDraw,
    removeSelectedTiles,
    clickTable,
    sendMail,
    initConfigs
} from "../actions/rtge-action";
import rtgeReducer from "../reducers/rtge-reducer";
import * as epics from "../epics/rtge-epics";
import { mapLayoutValuesSelector } from '@mapstore/selectors/maplayout';
import {
    isOpen,
    getActiveTab,
    getSelectedTiles,
    getActiveSelection,
    getSelectedRow,
    getUserDetails
} from "../selectors/rtge-selectors";
import '../assets/style.css';

export default createPlugin(name, {
    component: connect(state => ({
        active: !!isOpen(state),
        value: state.rtge && state.rtge.value,
        element: 'RTGE:WELCOME',
        dockStyle: mapLayoutValuesSelector(state, {right: true, height: true}, true),
        activeTab: getActiveTab(state),
        selectedTiles: getSelectedTiles(state),
        user: getUserDetails(state),
        activeSelection: getActiveSelection(state),
        selectedRow: getSelectedRow(state)
    }), {
        changeZoomLevel: changeZoomLevel,
        toggleControl: toggleControl,
        changeTab: changeTab,
        switchDraw: switchDraw,
        removeSelectedTiles: removeSelectedTiles,
        clickTable,
        sendMail,
        initConfigs
    })(RTGEComponent),
    reducers: {
        rtge: rtgeReducer
    },
    epics: epics,
    containers: {
        SidebarMenu: {
            name: "rtge",
            position: 10,
            icon: <Glyphicon glyph="map-marker"/>,
            doNotHide: true,
            tooltip: "RTGE.title",
            toggle: true,
            action: toggleControl.bind(null, 'rtge', 'enabled'),
            priority: 1
        }
    }
});
