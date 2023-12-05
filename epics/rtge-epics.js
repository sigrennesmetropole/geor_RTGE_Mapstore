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
    getUserDetails
} from "../actions/rtge-action";
import {
    TOGGLE_CONTROL,
    toggleControl
} from "@mapstore/actions/controls";
import {
    RTGE_PANEL_WIDTH,
    RIGHT_SIDEBAR_MARGIN_LEFT,
    selectedTilesLayerId
} from "../constants/rtge-constants";
import {
    updateDockPanelsList,
    updateMapLayout
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
    selectNode
} from "@mapstore/actions/layers";
import { changeMapInfoState } from "@mapstore/actions/mapInfo";
import {
    changeDrawingStatus,
    GEOMETRY_CHANGED
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

const gridLayerId = "ref_topo:rmtr_carroyage";
const backendURLPrefix = "";
const gridLayerName = "rmtr_carroyage";
const RTGE_GRID_LAYER_TITLE = "RTGE : Carroyage au 1/200";
const RTGEGridLayerProjection = "EPSG:3948";
const GeometryType = {
    POINT: "Point",
    LINE: "LineString",
    POLYGON: "Polygon"
};
const tileId = 'id_case';
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
const featuresLimit = 50;
var gridLayer = {};
const emailUrl = "/console/emailProxy";
const userDetailsUrl = "/console/account/userdetails";

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
        layout = {transform: layout.layout.transform, height: layout.layout.height, rightPanel: true, leftPanel: false, ...layout.boundingMapRect, right: RTGE_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT, boundingMapRect: {...layout.boundingMapRect, right: RTGE_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT}, boundingSidebarRect: layout.boundingSidebarRect};
        return Rx.Observable.from([initProjections(), updateDockPanelsList('rtge', 'add', 'right'), showGrid(), initDrawingMod(), updateMapLayout(layout), getUserDetails()]);
    });

/**
 * closeRTGEPanelEpic close the panel of this RTGE plugin
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (the dock panel and the map layout update actions)
 */
export const closeRTGEPanelEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL)
    .filter(action => action.control === 'rtge' && !!store.getState() && !isOpen(store.getState()) )
    .switchMap(() => {
        let layout = store.getState().maplayout;
        layout = {transform: layout.layout.transform, height: layout.layout.height, rightPanel: true, leftPanel: false, ...layout.boundingMapRect, right: layout.boundingSidebarRect.right, boundingMapRect: {...layout.boundingMapRect, right: layout.boundingSidebarRect.right}, boundingSidebarRect: layout.boundingSidebarRect};
        return Rx.Observable.from([updateDockPanelsList('rtge', 'remove', 'right'), updateMapLayout(layout)]);
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
            const mapstoreGridLayer = head(store.getState().layers.flat.filter(l => l.id === gridLayerId ));
            gridLayer = {
                handleClickOnLayer: true,
                hideLoading: true,
                id: gridLayerId,
                name: gridLayerName,
                title: RTGE_GRID_LAYER_TITLE,
                tiled: false,
                type: "wms",
                search: {
                    type: "wfs",
                    url: backendURLPrefix + "/geoserver/ref_topo/ows"
                },
                params: {
                    exceptions: 'application/vnd.ogc.se_xml'
                },
                allowedSRS: RTGEGridLayerProjection,
                format: "image/png",
                singleTile: false,
                url: backendURLPrefix + "/geoserver/ref_topo/wms",
                visibility: true,
                featureInfo: {
                    format: "PROPERTIES"
                }
            };
            return Rx.Observable.from(
                mapstoreGridLayer
                    ? [refreshLayerVersion(gridLayerId)]
                    : [addLayer(gridLayer),
                        selectNode(gridLayerId, "layer", false),
                        updateAdditionalLayer(
                            selectedTilesLayerId,
                            "RTGE",
                            'overlay',
                            {
                                id: selectedTilesLayerId,
                                features: [],
                                type: "vector",
                                name: "RTGESelectedTiles",
                                visibility: true
                            }
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
    return Rx.Observable.from([changeDrawingStatus("clean", "", 'rtge', [], {})]);
});

/**
 * startDrawingModEpic start the drawing of shapes on the map
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable with the list of actions to do after completing the function (trigger the change map drawing status action)
 */
export const startDrawingRTGEEpic = (action$) => action$.ofType(actions.START_DRAW).switchMap((action) => {
    console.log('in start draw');
    console.log(action);
    const feature = {
        geometry: {
            type: GeometryType.POINT,
            coordinates: []
        },
        newFeature: true,
        type: "Feature"
    };
    console.log(feature);

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
    console.log(options);
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
    if (filter.pagination.maxFeatures <= 1) {
        show({ title: "RTGE.alertMaxFeatures.title", message: "RTGE.alertMaxFeatures.message" }, "warning");
        return Rx.Observable.empty();
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
            const maxFeatures = featuresLimit - getSelectedTiles(store.getState()).length;
            const filter = {
                filterType: "OGC",
                featureTypeName: gridLayer?.search?.name || gridLayer?.name,
                typeName: gridLayer?.search?.name || gridLayer?.name,
                ogcVersion: '1.1.0',
                spatialField: {
                    attribute: "shape",
                    geometry: action.geometry,
                    operation: "INTERSECTS"
                },
                pagination: {
                    startIndex: 0,
                    maxFeatures: maxFeatures + 1 // le +1 est nécessaire pour le calcul du retour de cases, si 51 alors trop de cases sont sélectionnées
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
                    var finalElements = features.filter((feat) => !tilesSelected.find((selected) => selected.properties[tileId] === feat.properties[tileId] ));
                    if (features.length > maxFeatures) {
                        return Rx.Observable.from([show({ title: "RTGE.alertMaxFeatures.title", message: "RTGE.alertMaxFeatures.message" }, "warning"), startDraw(getSelectionGeometryType(store.getState()))]);
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
    console.log('in switch');
    console.log(action);
    const activeSelectionGeometryType = getSelectionGeometryType(store.getState());
    console.log(activeSelectionGeometryType);
    if (action.geometryType === activeSelectionGeometryType) {
        store.getState().rtge.activeSelection = "";
        return Rx.Observable.from([stopDraw()]);
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
function featureSelection(currentFeatures, control, intersectedFeature, state) {
    return currentFeatures.map((feature) => {
        if (intersectedFeature?.properties?.id_case === feature.properties.id_case) {
            feature.properties.selected = !feature.properties.selected;
            if (!control) {
                state.rtge.selectedRow = [];
            }
            if (feature.properties.selected) {
                state.rtge.selectedRow.push(intersectedFeature);
            }
        } else if (!control) {
            feature.properties.selected = false;
        }
        if (feature.properties.selected) {
            feature.style = styles.selected;
        } else {
            feature.style = styles.default;
        }
        return {
            ...feature
        };
    });
}

/**
 * clickOnMapEpic set things up for when a click is done on the map
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with tiles selected inside and their new styles
 */
export const clickOnMapRTGEEpic = (action$, store) => action$.ofType(CLICK_ON_MAP).switchMap((action) => {
    const layer = action.point.intersectedFeatures?.find(l => l.id === selectedTilesLayerId);
    const intersectedFeature = layer?.features[0];
    const currentFeatures = getSelectedTiles(store.getState());
    const vectorLayer = getSelectedTilesLayer(store.getState());
    const features = featureSelection(currentFeatures, action.point.modifiers.ctrl, intersectedFeature, store.getState());
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
    resizeMap()]);
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
    const features = featureSelection(currentFeatures, action.control, action.feature, store.getState());
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
    resizeMap()]);
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
    store.getState().rtge.selectedRow = [];
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
        return Rx.Observable.from([show({ title: "RTGE.sendMailSuccess.title", message: "RTGE.sendMailSuccess.message" }, level), toggleControl('rtge', 'enabled')]);
    case "error":
        return Rx.Observable.from([show({ title: "RTGE.sendMailFailure.title", message: "RTGE.sendMailFailure.message" }, level)]);
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
        "subject": "[RTGE] nouvelle demande concernant {{count}} dalles",
        "to": ["sigsupport@rennesmetropole.fr"],
        "cc": [],
        "bcc": []
    };
    let template = "Bonjour,\n\n{{first_name}} {{last_name}} ({{email}} - {{tel}} - {{service}} - {{company}}) a effectué une demande d'extraction de données.\nSous-sol: {{underground}}\nSurface: {{aboveground}}\n\nMotivations: {{comments}}\n\nLes dalles concernées sont les suivantes:\n\n{{tiles}}";
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
    return Rx.Observable.defer(() => axios.post(emailUrl, mailContent, params))
        .switchMap((/* response */) => {
            // console.log(response);
            return dropPopUp("success");
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
    return Rx.Observable.defer(() => axios.get(userDetailsUrl))
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
