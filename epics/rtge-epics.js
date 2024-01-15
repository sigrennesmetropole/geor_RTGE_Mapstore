/* eslint-disable no-console */
import Rx from "rxjs";
import {
    actions,
    showGrid,
    initDrawingMod,
    getFeatures,
    startDraw,
    initProjections,
    addFeatures,
    stopDraw,
    updateUser,
    getUserDetails,
    closeRtge,
    getUserRoles,
    setUndergroundDataJustificationRequired,
    changeTab,
    tabTypes,
    clickTable,
    switchDraw,
    mailSent,
    rtgeUpdateMapLayout
} from "../actions/rtge-action";
import {
    toggleControl,
    TOGGLE_CONTROL
} from "@mapstore/actions/controls";
import {
    RTGE_PANEL_WIDTH,
    RIGHT_SIDEBAR_MARGIN_LEFT,
    selectedTilesLayerId
} from "../constants/rtge-constants";
import {
    updateDockPanelsList,
    UPDATE_MAP_LAYOUT,
    FORCE_UPDATE_MAP_LAYOUT
} from "@mapstore/actions/maplayout";

import {
    isOpen,
    getSelectedTiles,
    getSelectedTilesLayer,
    getSelectionGeometryType
} from "../selectors/rtge-selectors";
import { head } from "lodash";
import {
    addLayer,
    refreshLayerVersion,
    selectNode,
    changeLayerProperties
} from "@mapstore/actions/layers";
import { changeMapInfoState } from "@mapstore/actions/mapInfo";
import {
    changeDrawingStatus,
    GEOMETRY_CHANGED,
    endDrawing
} from "@mapstore/actions/draw";
import { getLayerJSONFeature } from "@mapstore/observables/wfs";
import Proj4js from 'proj4';
import { updateAdditionalLayer } from "@mapstore/actions/additionallayers";
import { show } from "@mapstore/actions/notifications";
import {
    CLICK_ON_MAP,
    resizeMap
} from "@mapstore/actions/map";
import Xtemplate from 'xtemplate';
import axios from 'axios';

var gridLayerIdRTGE;
var backendURLPrefixRTGE;
var gridLayerNameRTGE;
var RTGE_GRID_LAYER_TITLE;
var RTGEGridLayerProjection;
var rtgeGridLayerGeometryAttribute;
var rtgeEmailUrl;
var rtgeUserDetailsUrl;
var rtgeUserRolesUrl;
var rtgeMailTemplate;
var rtgeMailRecipients;
var rtgeMailSubject;
var rtgeMaxTiles;
var rtgeTileIdAttribute;
var rtgeUndergroundDataRoles;
var currentLayout;
var lastSelectedTile;
const GeometryType = {
    POINT: "Point",
    LINE: "LineString",
    POLYGON: "Polygon"
};
const styles = {
    "selected": {
        fillColor: "#18BEF7",
        opacity: 1,
        fillOpacity: 0,
        color: "#18BEF7",
        weight: 4
    },
    "default": {
        fillColor: "#222111",
        opacity: 0.6,
        fillOpacity: 0,
        color: "#f5c42c",
        weight: 2
    }
};
var gridLayer = {};

/**
 * TODO
 * openRTGEPanelEpic opens the panel of this RTGE plugin
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (trigger the projection, the dock panel, the grid, the drawing tools and the map layout update actions)
 */
export const initProjectionsEpic = (actions$) => actions$.ofType(actions.INIT_PROJECTIONS).switchMap(() => {
    if (!Proj4js.defs("EPSG:3948")) {
        Proj4js.defs("EPSG:3948", "+proj=lcc +lat_0=48 +lon_0=3 +lat_1=47.25 +lat_2=48.75 +x_0=1700000 +y_0=7200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
    }
    if (!Proj4js.defs("EPSG:4326")) {
        Proj4js.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs +type=crs");
    }
    return Rx.Observable.empty();
});

/**
 * openRTGEPanelEpic opens the panel of this RTGE plugin
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (trigger the projection, the dock panel, the grid, the drawing tools and the map layout update actions)
 */
export const openRTGEPanelEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL)
    .filter(action => action.control === 'rtge' && !!store.getState() && !!isOpen(store.getState()))
    .switchMap(() => {
        let layout = store.getState().maplayout;
        layout = {
            transform: layout.layout.transform,
            height: layout.layout.height,
            rightPanel: true,
            leftPanel: false,
            ...layout.boundingMapRect,
            right: RTGE_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT,
            boundingMapRect: {
                ...layout.boundingMapRect,
                right: RTGE_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT
            },
            boundingSidebarRect: layout.boundingSidebarRect
        };
        currentLayout = layout;
        return Rx.Observable.from([
            initProjections(),
            updateDockPanelsList('rtge', 'add', 'right'),
            showGrid(),
            initDrawingMod(),
            rtgeUpdateMapLayout(layout),
            clickTable("", false),
            getUserDetails(),
            getUserRoles()]);
    });

/**
 * closeRTGEPanelEpic close the panel of this RTGE plugin
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (the dock panel and the map layout update actions)
 */
export const closeRTGEPanelEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL, actions.CLOSE_RTGE)
    .filter(action => action.control === 'rtge'
    && !!store.getState()
    && !isOpen(store.getState()) || action.type === actions.CLOSE_RTGE )
    .switchMap((action) => {
        let layout = store.getState().maplayout;
        layout = {
            transform: layout.layout.transform,
            height: layout.layout.height,
            rightPanel: true,
            leftPanel: false,
            ...layout.boundingMapRect,
            right: layout.boundingSidebarRect.right,
            boundingMapRect: {
                ...layout.boundingMapRect,
                right: layout.boundingSidebarRect.right
            },
            boundingSidebarRect: layout.boundingSidebarRect
        };
        currentLayout = layout;
        let observableAction = [
            updateDockPanelsList('rtge', 'remove', 'right'),
            rtgeUpdateMapLayout(currentLayout),
            stopDraw()
        ];
        if (action.type === actions.CLOSE_RTGE) {
            observableAction = [toggleControl('rtge', 'enabled')].concat(observableAction);
        }
        return Rx.Observable.from(observableAction);
    });

/**
 * displayRTGEGridEpic displays the grid on the map
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (trigger the refresh layer, select node actions and add a new layer)
 */
export const displayRTGEGridEpic = (action$, store) =>
    action$.ofType(actions.SHOW_GRID)
        .switchMap(() => {
            const mapstoreGridLayer = head(store.getState().layers.flat.filter(l => l.title === RTGE_GRID_LAYER_TITLE ));
            gridLayer = {
                handleClickOnLayer: true,
                hideLoading: true,
                id: gridLayerIdRTGE,
                name: gridLayerNameRTGE,
                title: RTGE_GRID_LAYER_TITLE,
                tiled: false,
                type: "wms",
                search: {
                    type: "wfs",
                    url: backendURLPrefixRTGE + "/geoserver/ref_topo/ows"
                },
                params: {
                    exceptions: 'application/vnd.ogc.se_xml'
                },
                allowedSRS: RTGEGridLayerProjection,
                format: "image/png",
                singleTile: false,
                url: backendURLPrefixRTGE + "/geoserver/ref_topo/wms",
                visibility: true,
                featureInfo: {
                    format: "PROPERTIES"
                }
            };
            let vectorLayerOption = {
                id: selectedTilesLayerId,
                features: [],
                type: "vector",
                name: "RTGESelectedTiles",
                visibility: true
            };
            return Rx.Observable.from(
                mapstoreGridLayer
                    ? [refreshLayerVersion(mapstoreGridLayer?.id || gridLayerIdRTGE),
                        changeLayerProperties(mapstoreGridLayer?.id || gridLayerIdRTGE, {
                            visibility: true
                        }),
                        updateAdditionalLayer(
                            selectedTilesLayerId,
                            "RTGE",
                            'overlay',
                            vectorLayerOption
                        )
                    ]
                    : [addLayer(gridLayer),
                        selectNode(gridLayerIdRTGE, "layer", false),
                        updateAdditionalLayer(
                            selectedTilesLayerId,
                            "RTGE",
                            'overlay',
                            vectorLayerOption
                        )
                    ]
            );
        });

/**
 * initDrawingModEpic init the drawing of shapes on the map
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable with the list of actions to do after completing the function (trigger the change map info state action)
 */
export const initDrawingModRTGEEpic = (action$) => action$.ofType(actions.INIT_DRAWING_MOD).switchMap(() => {
    return Rx.Observable.from([changeMapInfoState(false)]);
});

/**
 * stopDrawingModEpic stop the drawing of shapes on the map
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable with the list of actions to do after completing the function (trigger the change drawing status action)
 */
export const stopDrawingRTGEEpic = (action$) => action$.ofType(actions.STOP_DRAW).switchMap(() => {
    return Rx.Observable.from([switchDraw(''), changeDrawingStatus("clean", "", 'rtge', [], {})]);
});

/**
 * startDrawingModEpic start the drawing of shapes on the map
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable with the list of actions to do after completing the function (trigger the change map drawing status action)
 */
export const startDrawingRTGEEpic = (action$) => action$.ofType(actions.START_DRAW).switchMap((action) => {
    const feature = {
        geometry: {
            type: GeometryType.POINT,
            coordinates: []
        },
        newFeature: true,
        type: "Feature"
    };

    const options = {
        drawEnabled: true,
        editEnabled: false,
        featureProjection: RTGEGridLayerProjection,
        selectEnabled: false,
        stopAfterDrawing: false,
        transformToFeatureCollection: false,
        translateEnabled: false,
        useSelectedStyle: false
    };
    return Rx.Observable.from([changeDrawingStatus('drawOrEdit', action.geometryType, 'rtge', [feature], options)]);
});

/**
 * geometryChangeEpic selects the geometry we wish to use
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (trigger the start draw and/or get feature action)
 */
export const geometryChangeRTGEEpic = (action$, store) =>
    action$.ofType(GEOMETRY_CHANGED)
        .switchMap( (action) => {
            let geometrySelection = {};
            if (action.features && action.features.length > 0) {
                const geometry = action.features[0].geometry;
                if (GeometryType.POINT === geometry.type) {
                    // eslint-disable-next-line new-cap
                    geometry.coordinates = Proj4js('EPSG:4326', RTGEGridLayerProjection, geometry.coordinates);
                }
                if (GeometryType.LINE === geometry.type) {
                    // eslint-disable-next-line new-cap
                    geometry.coordinates = geometry.coordinates.map((coord) => Proj4js('EPSG:4326', RTGEGridLayerProjection, coord));
                }
                if (GeometryType.POLYGON === geometry.type) {
                    // eslint-disable-next-line new-cap
                    geometry.coordinates = [geometry.coordinates[0].map((coord) => Proj4js('EPSG:4326', RTGEGridLayerProjection, coord))];
                }
                geometrySelection = {
                    ...geometry,
                    projection: RTGEGridLayerProjection
                };
                return Rx.Observable.from([
                    startDraw(geometrySelection.type),
                    getFeatures(geometrySelection)
                ]);
            }
            return Rx.Observable.from([
                startDraw(getSelectionGeometryType(store.getState()))
            ]);
        });

/**
 * getLayerFeatures show pop up if max feature is reached or starts to recover the list of selected tiles
 * @memberof rtge.epics
 * @param layer - current layer where we want the data of
 * @param filter - contains datas to filter the results (e.g no more than 50)
 * @returns - empty observable or starts the function to recover datas from geoserver
 */
const getLayerFeatures = (layer, filter) => {
    if (filter.pagination.maxFeatures < 1) {
        show({ title: "RTGE.alertMaxFeatures.title", message: "RTGE.alertMaxFeatures.message" }, "warning");
        return Rx.Observable.from([endDrawing(filter.spatialField.geometry.type, 'rtge')]);
    }
    return getLayerJSONFeature(layer, filter);
};

/**
 * getFeaturesEpic get feature tiles data
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which starts add feature and start draw and add a new layer
 */
export const getFeaturesRTGEEpic = (action$, store) =>
    action$.ofType(actions.GET_FEATURES)
        .switchMap( (action) => {
            const maxFeatures = rtgeMaxTiles - getSelectedTiles(store.getState()).length;
            const filter = {
                filterType: "OGC",
                featureTypeName: gridLayer?.search?.name || gridLayer?.name,
                typeName: gridLayer?.search?.name || gridLayer?.name,
                ogcVersion: '1.1.0',
                spatialField: {
                    attribute: rtgeGridLayerGeometryAttribute,
                    geometry: action.geometry,
                    operation: "INTERSECTS"
                },
                pagination: {
                    startIndex: 0,
                    maxFeatures: maxFeatures + 1
                    // le +1 est nécessaire pour le calcul du retour de cases, si 51 alors trop de cases sont sélectionnées
                }
            };
            return getLayerFeatures(gridLayer, filter)
                .map( ({features = [], ...rest} = {}) => {
                    return {
                        ...rest,
                        features: features
                    };
                })
                .switchMap(({features = []} = {}) => {
                    var tilesSelected = getSelectedTiles(store.getState());
                    var finalElements = features.filter((feat) => !tilesSelected.find((selected) => selected.properties[rtgeTileIdAttribute] === feat.properties[rtgeTileIdAttribute] ));
                    if (features.length > maxFeatures) {
                        return Rx.Observable.from([
                            show({ title: "RTGE.alertMaxFeatures.title", message: "RTGE.alertMaxFeatures.message" }, "warning"),
                            startDraw(getSelectionGeometryType(store.getState()))]);
                    }
                    const vectorLayer = getSelectedTilesLayer(store.getState());
                    finalElements = [...vectorLayer.options.features, ...finalElements];
                    finalElements = finalElements.map(
                        (feature) => {
                            return {...feature, style: styles.default, properties: {...feature.properties, selected: false}};
                        }
                    );
                    return Rx.Observable.from([
                        addFeatures(finalElements),
                        updateAdditionalLayer(
                            selectedTilesLayerId,
                            "RTGE",
                            "overlay",
                            {
                                ...vectorLayer.options,
                                features: finalElements
                            }
                        ),
                        startDraw(getSelectionGeometryType(store.getState()))
                    ]);
                });
        });

/**
 * switchDrawingEpic allows to switch between drawings
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which send start draw action
 */
export const switchDrawingRTGEEpic = (action$, store) => action$.ofType(actions.SWITCH_DRAW).switchMap((action) => {
    const activeSelectionGeometryType = getSelectionGeometryType(store.getState());
    if (action.geometryType === activeSelectionGeometryType) {
        return Rx.Observable.from([switchDraw(""), stopDraw()]);
    }
    return Rx.Observable.from([startDraw(action.geometryType)]);
});

/**
 * featureSelection tells us if the selected feature is already selected and gives styles according this state
 * @memberof rtge.epics
 * @param currentFeatures - current features
 * @param control - is the user pressing control key
 * @param intersectedFeature - all features clicked
 * @returns - return one or more feature with their style updated... or not
 */
function featureSelection(currentFeatures, control, shift, intersectedFeature) {
    var currentSelectedTile = 0;
    var selectedRow = [];
    var currentFeatureList = currentFeatures.map((feature) => {
        if (intersectedFeature?.properties?.id_case === feature.properties.id_case) {
            feature.properties.selected = !feature.properties.selected;
            if (!shift) {
                if (!control) {
                    selectedRow = [];
                }
                if (feature.properties.selected) {
                    selectedRow.push(intersectedFeature);
                }
            } else {
                if (lastSelectedTile > currentSelectedTile) {
                    let temp = lastSelectedTile;
                    lastSelectedTile = currentSelectedTile;
                    currentSelectedTile = temp;
                }
                currentFeatures.slice(lastSelectedTile, currentSelectedTile).forEach(minimalizedCurrentFeature => {
                    selectedRow.push(minimalizedCurrentFeature);
                });
                selectedRow.forEach(row => {
                    row.properties.selected = true;
                });
            }
            lastSelectedTile = currentSelectedTile;
        } else if (!control && !shift) {
            feature.properties.selected = false;
        }
        if (feature.properties.selected) {
            feature.style = styles.selected;
        } else {
            feature.style = styles.default;
        }
        currentSelectedTile++;
        return {
            ...feature
        };
    });

    currentFeatureList.forEach(row => {
        if (row.properties.selected) {
            row.style = styles.selected;
        } else {
            row.style = styles.default;
        }
    });

    return currentFeatureList;

}

/**
 * clickOnMapEpic set things up for when a click is done on the map
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with tiles selected inside and their new styles
 */
export const clickOnMapRTGEEpic = (action$, store) => action$.ofType(CLICK_ON_MAP).switchMap((action) => {
    console.log('CLICK_ON_MAP');
    console.log(action);
    const layer = action.point.intersectedFeatures?.find(l => l.id === selectedTilesLayerId);
    const intersectedFeature = layer?.features[0];
    const currentFeatures = getSelectedTiles(store.getState());
    const vectorLayer = getSelectedTilesLayer(store.getState());
    const features = featureSelection(currentFeatures, action.point.modifiers.ctrl, false, intersectedFeature);
    return Rx.Observable.from([updateAdditionalLayer(
        selectedTilesLayerId,
        "RTGE",
        "overlay",
        {
            ...vectorLayer.options,
            features
        }
    ),
    // ce resizemap est présent parceque sinon les 2 premières sélections de cases plantent
    resizeMap(),
    addFeatures(features)]);
});

/**
 * clickTableEpic on table click, selects the row selected and highlight it on the map
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer
 */
export const clickTableRTGEEpic = (action$, store) => action$.ofType(actions.CLICK_TABLE).switchMap((action) => {
    const currentFeatures = getSelectedTiles(store.getState());
    const features = featureSelection(currentFeatures, action.control, action.shift, action.feature);
    const vectorLayer = getSelectedTilesLayer(store.getState());
    return Rx.Observable.from([updateAdditionalLayer(
        selectedTilesLayerId,
        "RTGE",
        "overlay",
        {
            ...vectorLayer.options,
            features
        }
    ),
    // ce resizemap est présent parceque sinon les 2 premières sélections de cases plantent
    resizeMap(),
    addFeatures(features)]);
});

/**
 * removeSelectedFeaturesEpic removes the selected feature from table and map
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer and who update the feature list
 */
export const removeSelectedFeaturesRTGEEpic = (action$, store) => action$.ofType(actions.REMOVE_SELECTED_TILES).switchMap(() => {
    let currentFeatures = getSelectedTiles(store.getState());
    const vectorLayer = getSelectedTilesLayer(store.getState());
    let emptiedFeatures = currentFeatures.filter(l => l.properties.selected === false);
    return Rx.Observable.from([
        updateAdditionalLayer(
            selectedTilesLayerId,
            "RTGE",
            "overlay",
            {
                ...vectorLayer.options,
                features: emptiedFeatures
            }
        ),
        addFeatures(emptiedFeatures)]);
});

/**
 * getFormattedTiles format tiles id list send into the mail
 * @memberof rtge.epics
 * @param state - list of actions triggered in mapstore context
 * @returns - formated tile id list for mail
 */
function getFormattedTiles(state) {
    var selectedTiles = getSelectedTiles(state);
    var formattedTiles = '';
    for (let index = 0; index < selectedTiles.length; index = index + 2) {
        formattedTiles += selectedTiles[index]?.properties?.cases_200;
        if (selectedTiles[index + 1]) {
            formattedTiles += ", " + selectedTiles[index + 1]?.properties?.cases_200;
            if (index + 1 < selectedTiles.length - 1) {
                formattedTiles += ",\n";
            }
        }
    }
    return formattedTiles;
}

/**
 * dropPopUp drop popup according to level
 * @memberof rtge.epics
 * @param level - popup level e.g: success | error
 * @returns - observable containing popup or empty observable
 */
const dropPopUp = (level) => {
    switch (level) {
    case "success":
        return Rx.Observable.from([
            show({ title: "RTGE.sendMailSuccess.title", message: "RTGE.sendMailSuccess.message" }, level),
            closeRtge()]);
    case "error":
        return Rx.Observable.from([
            mailSent(),
            show({ title: "RTGE.sendMailFailure.title", message: "RTGE.sendMailFailure.message" }, level)]);
    default:
        break;
    }
    return Rx.Observable.empty();
};

/**
 * sendMailEpic send email to selected adresse in mailContent.to
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - empty observable
 */
export const sendMailRTGEEpic = (action$, store) => action$.ofType(actions.SEND_MAIL).switchMap((action) => {
    let mailContent = {
        "subject": rtgeMailSubject,
        "to": rtgeMailRecipients,
        "cc": [],
        "bcc": []
    };
    let template = rtgeMailTemplate;
    let formatedTiles = getFormattedTiles(store.getState());
    template = new Xtemplate(template).render({
        first_name: action.form.prenom,
        last_name: action.form.nom,
        email: action.form.courriel,
        tel: action.form.telephone,
        service: action.form.service,
        company: action.form.collectivite,
        underground: action.form.dataUnderSurf,
        aboveground: action.form.dataSurf,
        schematicalnetwork: action.form.schematicalNetwork,
        comments: action.form.motivation,
        tiles: formatedTiles
    });
    let subjectTemplate = new Xtemplate(mailContent.subject).render({
        count: getSelectedTiles(store.getState()).length
    });
    mailContent.body = template;
    mailContent.subject = subjectTemplate;
    const params = {
        timeout: 30000,
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
    };
    return Rx.Observable.defer(() => axios.post(rtgeEmailUrl, mailContent, params))
        .switchMap(() => {
            return Rx.Observable.from([
                switchDraw(""),
                addFeatures([]),
                show({ title: "RTGE.sendMailSuccess.title", message: "RTGE.sendMailSuccess.message" }, 'success'),
                closeRtge(),
                stopDraw(),
                changeTab(tabTypes.HOME),
                clickTable("", false),
                mailSent()]);
        })
        .catch((e) => {
            console.log(e);
            return dropPopUp("error");
        });
});

/**
 * getUserDetailsEpic get user details when called
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable which update the user object
 */
export const getUserDetailsRTGEEpic = (action$) => action$.ofType(actions.GET_USER_DETAILS).switchMap(() => {
    return Rx.Observable.defer(() => axios.get(rtgeUserDetailsUrl))
        .switchMap((response) => {
            let text = response.data;
            let parser = new DOMParser();
            let html = parser.parseFromString(text, "text/html");

            let newUserDetails = {
                prenom: html.getElementById("firstName").value,
                nom: html.getElementById("surname").value,
                collectivite: html.getElementsByClassName("form-group")[5].children[1].firstElementChild.innerHTML.trim(),
                courriel: html.getElementsByClassName("form-group")[2].children[1].firstElementChild.innerHTML.trim(),
                telephone: html.getElementById("phone").value
            };
            return Rx.Observable.from([updateUser(newUserDetails)]);
        })
        .catch((e) => {
            console.log(e);
            return Rx.Observable.empty();
        });
});

/**
 * TODO
 * getUserDetailsEpic get user details when called
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable which update the user object
 */
export const getUserRolesRTGEEpic = (action$) => action$.ofType(actions.GET_USER_ROLES).switchMap(() => {
    return Rx.Observable.defer(() => axios.get(rtgeUserRolesUrl, {responseType: "json"}))
        .switchMap((rolesResponse) => {
            let includedRole = rolesResponse.data.User.groups.group.find(
                (role) => rtgeUndergroundDataRoles.includes(role.groupName)
            );
            if (includedRole) {
                return Rx.Observable.from([setUndergroundDataJustificationRequired(false)]);
            }
            return Rx.Observable.empty();
        })
        .catch((e) => {
            console.log(e);
            return Rx.Observable.empty();
        });
});

/**
 * getConfigsRTGEEpic get RTGE Configs and init them
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const getConfigsRTGEEpic = (action$) => action$.ofType(actions.INIT_CONFIGS).switchMap((action) => {
    gridLayerIdRTGE = action.configs.rtgeGridLayerId;
    backendURLPrefixRTGE = action.configs.rtgeBackendURLPrefix;
    gridLayerNameRTGE = action.configs.rtgeGridLayerName;
    RTGE_GRID_LAYER_TITLE = action.configs.rtgeGridLayerTitle;
    RTGEGridLayerProjection = action.configs.rtgeGridLayerProjection;
    rtgeGridLayerGeometryAttribute = action.configs.rtgeGridLayerGeometryAttribute;
    rtgeEmailUrl = action.configs.rtgeEmailUrl;
    rtgeUserDetailsUrl = action.configs.rtgeUserDetailsUrl;
    rtgeMailTemplate = action.configs.rtgeMailTemplate;
    rtgeMailRecipients = action.configs.rtgeMailRecipients;
    rtgeMailSubject = action.configs.rtgeMailSubject;
    rtgeMaxTiles = action.configs.rtgeMaxTiles;
    rtgeTileIdAttribute = action.configs.rtgeTileIdAttribute;
    rtgeUndergroundDataRoles = action.configs.rtgeUndergroundDataRoles;
    rtgeUserRolesUrl = action.configs.rtgeUserRolesUrl;
    return Rx.Observable.empty();
});

/**
 * onUpdatingLayoutWhenRTGEPanelOpenedEpic fix mapstore search bar issue on rtge panel opening
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable which update map layout
 */
export function onUpdatingLayoutWhenRTGEPanelOpenedEpic(action$, store) {
    return action$.ofType(UPDATE_MAP_LAYOUT, FORCE_UPDATE_MAP_LAYOUT)
        .filter((action) => (action.source === "rtge" || action.source === undefined)
        && store
        && store.getState()
        && !!isOpen(store.getState())
        && currentLayout?.right !== action?.layout?.right)
        .switchMap(() => {
            let layout = store.getState().maplayout;
            layout = {
                transform: layout.layout.transform,
                height: layout.layout.height,
                rightPanel: true,
                leftPanel: layout.layout.leftPanel,
                ...layout.boundingMapRect,
                right: RTGE_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT,
                boundingMapRect: {
                    ...layout.boundingMapRect,
                    right: RTGE_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT
                },
                boundingSidebarRect: layout.boundingSidebarRect};
            currentLayout = layout;
            return Rx.Observable.of(rtgeUpdateMapLayout(layout));
        });
}

/**
 * TODO
 * removeAllFeaturesRTGEEpic removes the selected feature from table and map
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable which update the layer and who update the feature list
 */
export const removeAllFeaturesRTGEEpic = (action$, store) => action$.ofType(actions.REMOVE_ALL_TILES).switchMap(() => {
    const vectorLayer = getSelectedTilesLayer(store.getState());
    let emptiedFeatures = [];
    return Rx.Observable.from([updateAdditionalLayer(
        selectedTilesLayerId,
        "RTGE",
        "overlay",
        {
            ...vectorLayer.options,
            features: emptiedFeatures
        }
    ),
    addFeatures(emptiedFeatures)]);
});
