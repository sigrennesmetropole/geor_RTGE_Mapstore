import React from 'react';
import {connect} from "react-redux";
import { name } from '../../../config';

import {createPlugin} from "@mapstore/utils/PluginsUtils";
import { toggleControl } from '@mapstore/actions/controls';
import ExtensionComponent from "../components/Component";
import { Glyphicon } from 'react-bootstrap';

import { changeZoomLevel } from "@mapstore/actions/map";
import { onIncrease } from "./rtge-action";
import rtgeReducer from "./rtge-reducer";
import * as epics from "./rtge-epics";
import {
    isOpen
} from "./rtge-selectors";

import '../assets/style.css';

export default createPlugin(name, {
    component: connect(state => ({
        active: !!isOpen(state),
        value: state.rtge && state.rtge.value
    }), {
        onIncrease: onIncrease,
        changeZoomLevel: changeZoomLevel
    })(ExtensionComponent),
    reducers: {
        rtge: rtgeReducer
    },
    epics: epics,
    containers: {
        // défini les endroits ou le plugin s'affiche, par exemple ici le bouton INC s'affiche dans la toolBar
        SidebarMenu: {
            name: "RTGE",
            position: 10,
            icon: <Glyphicon glyph="map-marker"/>,
            doNotHide: true,
            tooltip: "RTGE.title",
            toggle: true,
            action: toggleControl.bind(null, 'rtge', 'enabled')
        }
    }
});
