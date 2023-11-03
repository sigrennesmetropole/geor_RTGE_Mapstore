/* eslint-disable no-console */
import Rx from "rxjs";
import {
    actions,
    showGrid,
    initDrawingMod,
    getFeatures,
    startDraw,
    initProjections,
    addFeatures
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
    getSelectedTilesLayer
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

export const initProjectionsEpic = (actions$) => actions$.ofType(actions.INIT_PROJECTIONS).switchMap(() => {
    console.log(' PAS POMME DE TERRE');
    console.log(Proj4js.defs("EPSG:3948"));
    if (!Proj4js.defs("EPSG:3948")) {
        console.log('POMME DE TERRE');
        Proj4js.defs("EPSG:3948", "+proj=lcc +lat_0=48 +lon_0=3 +lat_1=47.25 +lat_2=48.75 +x_0=1700000 +y_0=7200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
    }
    if (!Proj4js.defs("EPSG:4326")) {
        console.log('PATATE');
        Proj4js.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs +type=crs");
    }
});

// let currentLayout;
// ici c'est pour le logging, les informations utiles pour les utilisateurs
export const logCounterValue = (action$, store) => action$.ofType(actions.INCREASE_COUNTER).switchMap(() => {
    /* eslint-disable */
    console.log('CURRENT VALUE: ' + store.getState().rtge.value);
    /* eslint-enable */
    return Rx.Observable.empty();
});

export const openRTGEPanelEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL)
    .filter(action => action.control === 'rtge' && !!store.getState() && !!isOpen(store.getState()))
    .switchMap(() => {
        let layout = store.getState().maplayout;
        layout = {transform: layout.layout.transform, height: layout.layout.height, rightPanel: true, leftPanel: false, ...layout.boundingMapRect, right: RTGE_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT, boundingMapRect: {...layout.boundingMapRect, right: RTGE_PANEL_WIDTH + RIGHT_SIDEBAR_MARGIN_LEFT}, boundingSidebarRect: layout.boundingSidebarRect};
        // currentLayout = layout;
        return Rx.Observable.from([initProjections(), updateDockPanelsList('rtge', 'add', 'right'), updateMapLayout(layout), showGrid(), initDrawingMod()]);
    });

export const closeRTGEPanelEpic = (action$, store) => action$.ofType(TOGGLE_CONTROL)
    .filter(action => action.control === 'rtge' && !!store.getState() && !isOpen(store.getState()) )
    .switchMap(() => {
        let layout = store.getState().maplayout;
        layout = {transform: layout.layout.transform, height: layout.layout.height, rightPanel: true, leftPanel: false, ...layout.boundingMapRect, right: layout.boundingSidebarRect.right, boundingMapRect: {...layout.boundingMapRect, right: layout.boundingSidebarRect.right}, boundingSidebarRect: layout.boundingSidebarRect};
        // currentLayout = layout;
        return Rx.Observable.from([updateDockPanelsList('rtge', 'remove', 'right'), updateMapLayout(layout)]);
    });

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

export const initDrawingModEpic = (action$) => action$.ofType(actions.INIT_DRAWING_MOD).switchMap(() => {
    return Rx.Observable.from([changeMapInfoState(false)]);
});

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

export const geometryChangeEpic = (action$) =>
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
                startDraw()
            ]);
        });

export const getFeaturesEpic = (action$, store) =>
    action$.ofType(actions.GET_FEATURES)
        .switchMap( (action) => {
            const layer = head(store.getState().layers.flat.filter(l => l.id === gridLayerId ));
            const filter = {
                filterType: "OGC",
                featureTypeName: layer?.search?.name || layer?.name,
                typeName: layer?.search?.name || layer?.name,
                ogcVersion: '1.1.0',
                spatialField: {
                    attribute: "shape",
                    geometry: action.geometry,
                    operation: "INTERSECTS"
                }
            };
            return getLayerJSONFeature(layer, filter)
                .map( ({features = [], ...rest} = {}) => {
                    return {
                        ...rest,
                        features: features
                    };
                })
                .switchMap(({features = []} = {}) => {
                    var tilesSelected = getSelectedTiles(store.getState());
                    var finalElements = features.filter((feat) => !tilesSelected.find((selected) => selected.properties[tileId] === feat.properties[tileId] ));
                    const vectorLayer = getSelectedTilesLayer(store.getState());
                    console.log(vectorLayer);
                    return Rx.Observable.from([
                        addFeatures(finalElements),
                        updateAdditionalLayer(
                            selectedTilesLayerId,
                            "RTGE",
                            "overlay",
                            {
                                ...vectorLayer.options,
                                features: [...vectorLayer.options.features, ...finalElements]
                            }
                        )
                    ]);
                });
        });
