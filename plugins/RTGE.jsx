import React from 'react';
import {connect} from "react-redux";
import { name } from '../../../config';

import {createPlugin} from "@mapstore/utils/PluginsUtils";
import { toggleControl } from '@mapstore/actions/controls';
import { RTGEComponent } from "../components/Component";
// import { Glyphicon } from 'react-bootstrap';
import pluginIcon from "../assets/images/registration.svg";

import { changeZoomLevel } from "@mapstore/actions/map";
import {
    changeTab,
    switchDraw,
    removeSelectedTiles,
    clickTable,
    sendMail,
    initConfigs,
    removeAllTiles,
    stopDraw
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
    getUserDetails,
    getRequestStarted,
    isUndergroundDataRequired
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
        selectedRow: getSelectedRow(state),
        requestStarted: getRequestStarted(state),
        undergroundDataIsRequired: isUndergroundDataRequired(state),
        pluginIcon
    }), {
        changeZoomLevel: changeZoomLevel,
        toggleControl: toggleControl,
        changeTab: changeTab,
        switchDraw: switchDraw,
        removeSelectedTiles: removeSelectedTiles,
        removeAllTiles: removeAllTiles,
        clickTable,
        sendMail,
        initConfigs,
        stopDraw: stopDraw
    })(RTGEComponent),
    reducers: {
        rtge: rtgeReducer
    },
    epics: epics,
    containers: {
        SidebarMenu: {
            name: "rtge",
            position: 10,
            icon: <img src={pluginIcon} className="iconSize" />,
            doNotHide: true,
            tooltip: "RTGE.title",
            toggle: true,
            action: toggleControl.bind(null, 'rtge', 'enabled'),
            priority: 1
        }
    }
});
