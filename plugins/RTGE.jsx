import React from 'react';
import {connect} from "react-redux";
import { name } from '../../../config';

import {createPlugin} from "@mapstore/utils/PluginsUtils";
import { toggleControl } from '@mapstore/actions/controls';
import { RTGEComponent } from "../components/Component";
import pluginIcon from "../assets/images/registration.svg";

import { changeZoomLevel } from "@mapstore/actions/map";
import {
    rtgechangeTab,
    rtgeswitchDraw,
    rtgeremoveSelectedTiles,
    rtgeclickTable,
    rtgesendMail,
    rtgeinitConfigs,
    rtgeremoveAllTiles,
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
    rtgegetUserDetails,
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
        user: rtgegetUserDetails(state),
        activeSelection: getActiveSelection(state),
        selectedRows: getSelectedRow(state),
        requestStarted: getRequestStarted(state),
        undergroundDataIsRequired: isUndergroundDataRequired(state),
        pluginIcon,
        mailRequestInProgress: getMailRequestInProgress(state)
    }), {
        changeZoomLevel: changeZoomLevel,
        toggleControl: toggleControl,
        rtgechangeTab: rtgechangeTab,
        rtgeswitchDraw: rtgeswitchDraw,
        rtgeremoveSelectedTiles: rtgeremoveSelectedTiles,
        rtgeremoveAllTiles: rtgeremoveAllTiles,
        rtgeclickTable,
        rtgesendMail,
        rtgeinitConfigs,
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
