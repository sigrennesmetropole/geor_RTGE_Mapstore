import React from 'react';
import {connect} from "react-redux";
import { name } from '../../../config';

import {createPlugin} from "@mapstore/utils/PluginsUtils";
import { toggleControl } from '@mapstore/actions/controls';
import { RTGEComponent } from "../components/Component";
import pluginIcon from "../assets/images/icoPluginRTGE.svg";

import { changeZoomLevel } from "@mapstore/actions/map";
import {
    rtgeChangeTab,
    rtgeSwitchDraw,
    rtgeRemoveSelectedTiles,
    rtgeClickTable,
    rtgeSendMail,
    rtgeInitConfigs,
    rtgeRemoveAllTiles,
    rtgeStopDraw
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
    rtgeGetUserDetails,
    getRequestStarted,
    isUndergroundDataRequired,
    getMailRequestInProgress
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
        user: rtgeGetUserDetails(state),
        activeSelection: getActiveSelection(state),
        selectedRows: getSelectedRow(state),
        requestStarted: getRequestStarted(state),
        undergroundDataIsRequired: isUndergroundDataRequired(state),
        pluginIcon,
        mailRequestInProgress: getMailRequestInProgress(state)
    }), {
        changeZoomLevel: changeZoomLevel,
        toggleControl: toggleControl,
        rtgeChangeTab: rtgeChangeTab,
        rtgeSwitchDraw: rtgeSwitchDraw,
        rtgeRemoveSelectedTiles: rtgeRemoveSelectedTiles,
        rtgeRemoveAllTiles: rtgeRemoveAllTiles,
        rtgeClickTable,
        rtgeSendMail,
        rtgeInitConfigs,
        rtgeStopDraw: rtgeStopDraw
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
