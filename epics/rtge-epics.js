/* eslint-disable no-console */
import Rx from "rxjs";
import {
    actions,
    rtgeShowGrid,
    rtgeInitDrawingMod,
    rtgeGetFeatures,
    rtgeStartDraw,
    rtgeInitProjections,
    rtgeAddFeatures,
    rtgeStopDraw,
    rtgeUpdateUser,
    rtgeGetUserDetails,
    rtgeCloseRtge,
    rtgeChangeTab,
    tabTypes,
    rtgeClickTable,
    rtgeSwitchDraw,
    rtgeMailSent,
    rtgeMailNotSent,
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
    OPEN_FEATURE_GRID
} from "@mapstore/actions/featuregrid";
import {
    isOpen,
    getSelectedTiles,
    getSelectedTilesLayer,
    getSelectionGeometryType
} from "../selectors/rtge-selectors";
import { head } from "lodash";
import {
    setAPIURL,
    postNewRequest
} from '../api/api';
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
import {
    drawSupportActiveSelector
} from "@mapstore/selectors/draw";
import { getLayerJSONFeature } from "@mapstore/observables/wfs";
import Proj4js from 'proj4';
import { updateAdditionalLayer } from "@mapstore/actions/additionallayers";
import { show } from "@mapstore/actions/notifications";
import {
    CLICK_ON_MAP,
    resizeMap
} from "@mapstore/actions/map";
import axios from 'axios';

var gridLayerIdRTGE;
var backendURLPrefixRTGE;
var gridLayerNameRTGE;
var rtgeGridLayerTitle;
var rtgeGridLayerProjection;
var rtgeGridLayerGeometryAttribute;
var rtgeUserDetailsUrl;
var rtgeMaxTiles;
var rtgeTileIdAttribute;
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
        fillOpacity: 0.3,
        opacity: 1,
        color: "#18BEF7",
        weight: 4
    },
    "default": {
        fillColor: "#f5c42c",
        fillOpacity: 0.2,
        opacity: 0.6,
        color: "#f5c42c",
        weight: 2
    },
    "hidden": {
        fillColor: "#222111",
        opacity: 0,
        fillOpacity: 0,
        color: "#000000",
        weight: 0
    }
};
var gridLayer = {};

/**
 * TODO: revue de code ici avec https://github.com/sigrennesmetropole/geor_urbanisme_mapstore/blob/229b0325d6255cc85254a44010d95ad33471072a/js/extension/epics/urbanisme.js#L123-L126
 * initProjectionsEpic init plugin projection
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
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
        let observables = [
            rtgeInitProjections(),
            updateDockPanelsList('rtge', 'add', 'right'),
            rtgeShowGrid(),
            rtgeInitDrawingMod(),
            rtgeUpdateMapLayout(layout),
            rtgeClickTable("", false),
            rtgeGetUserDetails()
        ];
        return Rx.Observable.from(observables);
    });

/**
 * closeRTGEPanelEpic close the panel of this RTGE plugin
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (the dock panel and the map layout update actions)
 */
export const closeRTGEPanelEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL, OPEN_FEATURE_GRID, actions.CLOSE_RTGE)
    .filter(action => !!store.getState()
    && !isOpen(store.getState()) || action.type === actions.CLOSE_RTGE )
    .switchMap((action) => {
        let observableAction = [
            updateDockPanelsList('rtge', 'remove', 'right'),
            changeMapInfoState(true)
        ];
        if (action.control === 'rtge') {
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
            observableAction.push(rtgeUpdateMapLayout(currentLayout));
        }
        let selectedTiles = getSelectedTiles(store.getState());
        selectedTiles.forEach(tile => {
            tile.style = styles.hidden;
        });
        // ce resizemap est présent parceque sinon les 2 premières sélections de cases plantent
        observableAction.push(resizeMap());
        observableAction.push(rtgeAddFeatures(selectedTiles));
        if (drawSupportActiveSelector(store.getState())) {
            observableAction.push(rtgeStopDraw());
        }
        if (action.type === actions.CLOSE_RTGE) {
            observableAction = [toggleControl('rtge', 'enabled')].concat(observableAction);
        }
        return Rx.Observable.from(observableAction);
    });

/**
 * TODO : remplacer les url par les valeurs de la config
 * displayRTGEGridEpic displays the grid on the map
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (trigger the refresh layer, select node actions and add a new layer)
 */
export const displayRTGEGridEpic = (action$, store) =>
    action$.ofType(actions.SHOW_GRID)
        .switchMap(() => {
            const mapstoreGridLayer = head(store.getState().layers.flat.filter(l => l.title === rtgeGridLayerTitle ));
            const geoserverWorkspace = gridLayerIdRTGE.split(':')[0];
            gridLayer = {
                handleClickOnLayer: true,
                hideLoading: true,
                id: gridLayerIdRTGE,
                name: gridLayerNameRTGE,
                title: rtgeGridLayerTitle,
                tiled: false,
                type: "wms",
                search: {
                    type: "wfs",
                    url: "/geoserver/"+geoserverWorkspace+"/ows"
                },
                params: {
                    exceptions: 'application/vnd.ogc.se_xml'
                },
                allowedSRS: rtgeGridLayerProjection,
                format: "image/png",
                singleTile: false,
                url: "/geoserver/"+geoserverWorkspace+"/wms",
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
    return Rx.Observable.from([rtgeSwitchDraw(''), changeDrawingStatus("clean", "", 'rtge', [], {})]);
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
        featureProjection: rtgeGridLayerProjection,
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
    .filter((action) => 
        !!store.getState()
        && !!isOpen(store.getState())
    )
        .switchMap( (action) => {
            let geometrySelection = {};
            if (action.features && action.features.length > 0) {
                const geometry = action.features[0].geometry;
                if (GeometryType.POINT === geometry.type) {
                    // eslint-disable-next-line new-cap
                    geometry.coordinates = Proj4js('EPSG:4326', rtgeGridLayerProjection, geometry.coordinates);
                }
                if (GeometryType.LINE === geometry.type) {
                    // eslint-disable-next-line new-cap
                    geometry.coordinates = geometry.coordinates.map((coord) => Proj4js('EPSG:4326', rtgeGridLayerProjection, coord));
                }
                if (GeometryType.POLYGON === geometry.type) {
                    // eslint-disable-next-line new-cap
                    geometry.coordinates = [geometry.coordinates[0].map((coord) => Proj4js('EPSG:4326', rtgeGridLayerProjection, coord))];
                }
                geometrySelection = {
                    ...geometry,
                    projection: rtgeGridLayerProjection
                };
                return Rx.Observable.from([
                    rtgeStartDraw(geometrySelection.type),
                    rtgeGetFeatures(geometrySelection)
                ]);
            }
            return Rx.Observable.from([
                rtgeStartDraw(getSelectionGeometryType(store.getState()))
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
 * getFeaturesRTGEEpic get feature tiles data
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
                            rtgeStartDraw(getSelectionGeometryType(store.getState()))]);
                    }
                    const vectorLayer = getSelectedTilesLayer(store.getState());
                    finalElements = [...vectorLayer.options.features, ...finalElements];
                    finalElements = finalElements.map(
                        (feature) => {
                            return {...feature, style: styles.default, properties: {...feature.properties, selected: false}};
                        }
                    );
                    return Rx.Observable.from([
                        rtgeAddFeatures(finalElements),
                        updateAdditionalLayer(
                            selectedTilesLayerId,
                            "RTGE",
                            "overlay",
                            {
                                ...vectorLayer.options,
                                features: finalElements
                            }
                        ),
                        rtgeStartDraw(getSelectionGeometryType(store.getState()))
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
        return Rx.Observable.from([rtgeStopDraw()]);
    }
    return Rx.Observable.from([rtgeStartDraw(action.geometryType)]);
});

/**
 * featureSelectionRTGE tells us if the selected feature is already selected and gives styles according this state
 * @memberof rtge.epics
 * @param currentFeatures - current features
 * @param control - is the user pressing control key
 * @param intersectedFeature - all features clicked
 * @returns - return one or more feature with their style updated... or not
 */
function featureSelectionRTGE(currentFeatures, control, shift, intersectedFeature) {
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
export const clickOnMapRTGEEpic = (action$, store) => action$.ofType(CLICK_ON_MAP)
.filter((action) => 
    !!store.getState()
    && !!isOpen(store.getState())
    )
.switchMap((action) => {
    //ajouter un filtre à l'ouverture pour s'assurer que c'est bien rtge qui ouvre
    const layer = action.point.intersectedFeatures?.find(l => l.id === selectedTilesLayerId);
    const intersectedFeature = layer?.features[0];
    const currentFeatures = getSelectedTiles(store.getState());
    const vectorLayer = getSelectedTilesLayer(store.getState());
    const features = featureSelectionRTGE(currentFeatures, action.point.modifiers.ctrl, false, intersectedFeature);
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
    rtgeAddFeatures(features)]);
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
    const features = featureSelectionRTGE(currentFeatures, action.control, action.shift, action.feature);
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
    rtgeAddFeatures(features)]);
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
        rtgeAddFeatures(emptiedFeatures)]);
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
    for (let index = 0; index < selectedTiles.length; index ++) {
        formattedTiles += selectedTiles[index]?.properties?.cases_200;
        if (index < selectedTiles.length - 1) {
            formattedTiles += ",";
        }
    }
    return formattedTiles;
}

/**
 * sendMailRTGEEpic send email to selected adresse in mailContent.to
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - empty observable
 */
export const sendMailRTGEEpic = (action$, store) => action$.ofType(actions.SEND_MAIL).switchMap((action) => {
    //gestion des datas
    let datas = [];
    let formatedTiles = getFormattedTiles(store.getState());
    datas.push(
        formatedTiles,
        action.form.prenom,
        action.form.nom,
        action.form.collectivite,
        action.form.service,
        action.form.courriel,
        action.form.telephone,
        action.form.motivation,
        action.form.dataSurf,
        action.form.dataUnderSurf
    );
    // - gestion donnees schematiques (obligatoirement false si donnees sous-sol non cochees)
    let schematical = (action.form.dataUnderSurf) ? action.form.schematicalNetwork : false;
    datas.push(schematical);
    // - gestion infos utilisateur externe
    datas.push(action.form.finalUse)
    if (action.form.finalUse === 'Externe'){
        datas.push(
            action.form.finalUser,
            action.form.finalUserEMail,
            action.form.finalUserAddress
        )
    }

    //send request
    return Rx.Observable.forkJoin(
        postNewRequest(datas)
    ).switchMap((response) => {
        response = response[0];
        console.log(response);
        if (response.status === 200){
            return Rx.Observable.from([
                rtgeAddFeatures([]),
                rtgeChangeTab(tabTypes.HOME),
                rtgeClickTable("", false),
                rtgeMailSent(),
                show({ title: "RTGE.sendMailSuccess.title", message: "RTGE.sendMailSuccess.message" }, "success"),
                rtgeCloseRtge()
            ]);
        }
        else {
            var popUpMessage = 'Error '+response.status.toString()+': '+response.statusText;
            return Rx.Observable.from([
                rtgeMailNotSent(),
                show({ title: "RTGE.sendMailFailure.title", message: popUpMessage }, "error")
            ]);
        }
    });
});

/**
 * TODO : change when route available on backend
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
            return Rx.Observable.from([rtgeUpdateUser(newUserDetails)]);
        })
        .catch((e) => {
            console.log(e);
            return Rx.Observable.empty();
        });
});

/**
 * TODO: revue de code - voir avec Raoul
 * getConfigsRTGEEpic get RTGE Configs and init them
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - empty observable
 */
export const getConfigsRTGEEpic = (action$) => action$.ofType(actions.INIT_CONFIGS).switchMap((action) => {
    gridLayerIdRTGE = action.configs.rtgegridlayerid;
    backendURLPrefixRTGE = action.configs.rtgebackendurlprefix;
    gridLayerNameRTGE = action.configs.rtgegridlayername;
    rtgeGridLayerTitle = action.configs.rtgegridlayertitle;
    rtgeGridLayerProjection = action.configs.rtgegridlayerprojection;
    rtgeGridLayerGeometryAttribute = action.configs.rtgegridlayergeometryattribute;
    rtgeUserDetailsUrl = action.configs.rtgeuserdetailsurl;
    rtgeMaxTiles = action.configs.rtgemaxtiles;
    rtgeTileIdAttribute = action.configs.rtgetileidattribute;
    /*update v2.0 : setting url for backend is now required*/ 
    if (backendURLPrefixRTGE != ""){
        setAPIURL(backendURLPrefixRTGE);
    }
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
    rtgeAddFeatures(emptiedFeatures)]);
});
