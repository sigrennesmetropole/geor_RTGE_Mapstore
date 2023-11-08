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
    stopDraw
} from "../actions/rtge-action";
import { TOGGLE_CONTROL} from "@mapstore/actions/controls";
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
// import { CLICK_ON_MAP } from "@mapstore/actions/map";

const gridLayerId = "ref_topo:rmtr_carroyage";
const backendURLPrefix = ""; // "https://portail-test.sig.rennesmetropole.fr/";
const gridLayerName = "rmtr_carroyage";
const RTGE_GRID_LAYER_TITLE = "RMTR : Carroyage au 1/200";
const RTGEGridLayerProjection = "EPSG:3948";
const GeometryType = {
    POINT: "Point",
    LINE: "LineString",
    POLYGON: "Polygon"
};
const tileId = 'id_case';
const styles = {
    selected: {
        fillColor: "#18BEF7",
        opacity: 0.6,
        fillOpacity: 0,
        color: "#111111",
        weight: 4
    },
    "default": {
        fillColor: "#222111",
        opacity: 0.6,
        fillOpacity: 0,
        color: "#18BEF7",
        weight: 4
    }
};
const featuresLimit = 50;

export const initProjectionsEpic = (actions$) => actions$.ofType(actions.INIT_PROJECTIONS).switchMap(() => {
    // console.log(' PAS POMME DE TERRE');
    // console.log(Proj4js.defs("EPSG:3948"));
    if (!Proj4js.defs("EPSG:3948")) {
        // console.log('POMME DE TERRE');
        Proj4js.defs("EPSG:3948", "+proj=lcc +lat_0=48 +lon_0=3 +lat_1=47.25 +lat_2=48.75 +x_0=1700000 +y_0=7200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
    }
    if (!Proj4js.defs("EPSG:4326")) {
        // console.log('PATATE');
        Proj4js.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs +type=crs");
    }
    return Rx.Observable.empty();
});

// let currentLayout;
// ici c'est pour le logging, les informations utiles pour les utilisateurs
// export const logCounterValue = (action$, store) => action$.ofType(actions.INCREASE_COUNTER).switchMap(() => {
//     /* eslint-disable */
//     console.log('CURRENT VALUE: ' + store.getState().rtge.value);
//     /* eslint-enable */
//     return Rx.Observable.empty();
// });

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
        // currentLayout = layout;
        return Rx.Observable.from([initProjections(), updateDockPanelsList('rtge', 'add', 'right'), showGrid(), initDrawingMod(), updateMapLayout(layout)]);
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
        // currentLayout = layout;
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
            const gridLayer = head(store.getState().layers.flat.filter(l => l.id === gridLayerId ));
            return Rx.Observable.from(
                gridLayer
                    ? [refreshLayerVersion(gridLayerId)]
                    : [addLayer({
                        handleClickOnLayer: true,
                        hideLoading: true,
                        id: gridLayerId,
                        name: gridLayerName,
                        title: RTGE_GRID_LAYER_TITLE,
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
                    }),
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
export const initDrawingModEpic = (action$) => action$.ofType(actions.INIT_DRAWING_MOD).switchMap(() => {
    return Rx.Observable.from([changeMapInfoState(false)]);
});

/**
 * stopDrawingModEpic stop the drawing of shapes on the map
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable with the list of actions to do after completing the function (trigger the change drawing status action)
 */
export const stopDrawingEpic = (action$) => action$.ofType(actions.STOP_DRAW).switchMap(() => {
    return Rx.Observable.from([changeDrawingStatus("clean", "", 'rtge', [], {})]);
});

/**
 * startDrawingModEpic start the drawing of shapes on the map
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @returns - observable with the list of actions to do after completing the function (trigger the change map drawing status action)
 */
export const startDrawingEpic = (action$) => action$.ofType(actions.START_DRAW).switchMap((action) => {
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

    // return Rx.Observable.from([
    // changeDrawingStatus('drawOrEdit', action.geometryType, 'rtge', [feature], options)
    // const startDrawingAction = changeDrawingStatus('drawOrEdit', action.geometryType, 'rtge', [feature], options);
    return Rx.Observable.from([changeDrawingStatus('drawOrEdit', action.geometryType, 'rtge', [feature], options)]);
    // ]);
});

/**
 * geometryChangeEpic selects the geometry we wish to use
 * @memberof rtge.epics
 * @param action$ - list of actions triggered in mapstore context
 * @param store - list the content of variables inputted with the actions
 * @returns - observable with the list of actions to do after completing the function (trigger the start draw and/or get feature action)
 */
export const geometryChangeEpic = (action$, store) =>
    action$.ofType(GEOMETRY_CHANGED)
        .switchMap( (action) => {
            let geometrySelection = {};
            if (action.features && action.features.length > 0) {
                // console.log(action);
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
                // console.log(localisation);
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
export const getFeaturesEpic = (action$, store) =>
    action$.ofType(actions.GET_FEATURES)
        .switchMap( (action) => {
            const layer = head(store.getState().layers.flat.filter(l => l.id === gridLayerId ));
            const maxFeatures = featuresLimit - getSelectedTiles(store.getState()).length;
            // console.log(maxFeatures);
            const filter = {
                filterType: "OGC",
                featureTypeName: layer?.search?.name || layer?.name,
                typeName: layer?.search?.name || layer?.name,
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
            return getLayerFeatures(layer, filter)
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
                    // console.log(vectorLayer);
                    finalElements = [...vectorLayer.options.features, ...finalElements];
                    finalElements = finalElements.map(
                        (feature) => {
                            return {...feature, style: styles.default};
                        }
                    );
                    // console.log(finalElements.length);
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
export const switchDrawingEpic = (action$, store) => action$.ofType(actions.SWITCH_DRAW).switchMap((action) => {
    // console.log(action);
    const activeSelectionGeometryType = getSelectionGeometryType(store.getState());
    if (action.geometryType === activeSelectionGeometryType || action.geometryType === 'Table') {
        store.getState().rtge.activeSelection = "";
        return Rx.Observable.from([stopDraw()]);
    }
    return Rx.Observable.from([startDraw(action.geometryType)]);
});

// export const clickOnMapEpic = (action$, store) => action$.ofType(CLICK_ON_MAP).switchMap((action) => {
//     const layer = head(action.point.intersectedFeatures.find(l => l.id === selectedTilesLayerId));
//     const features = getSelectedTiles(store.getState());
//     const intersectedFeature = layer.features[0];
//     const vectorLayer = getSelectedTilesLayer(store.getState());
//     features.forEach((feature) => {
//         if (intersectedFeature.properties.id_case === feature.properties.id_case) {
//             feature.properties.selected = !feature.properties.selected;
//         } else if (!action.point.modifiers.ctrl) {
//             feature.properties.selected = false;
//         }
//         if (feature.properties.selected) {
//             feature.style = styles.selected;
//         } else {
//             feature.style = styles.default;
//         }
//     });
//     return Rx.Observable.from([updateAdditionalLayer(
//         selectedTilesLayerId,
//         "RTGE",
//         "overlay",
//         {
//             ...vectorLayer.options,
//             features
//         }
//     )]);
// });
