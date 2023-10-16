/* eslint-disable no-console */
import React from "react";
import PropTypes from 'prop-types';
import Message from "@mapstore/components/I18N/Message";
import { RTGE_PANEL_WIDTH } from "../constants/rtge-constants.js";
import { tabTypes } from "../actions/rtge-action.js";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";
// import {setControlProperties, setControlProperty, toggleControl} from "@mapstore/actions/controls";
import { Glyphicon } from 'react-bootstrap';
// import { totalCountSelector } from "@mapstore/selectors/contextmanager";
export class RTGEComponent extends React.Component {

    static propTypes= {
        active: PropTypes.bool,
        value: PropTypes.number,
        element: PropTypes.string,
        dockStyle: PropTypes.object,
        panelClassName: PropTypes.string,
        width: PropTypes.number,
        activeTab: PropTypes.string,
        onIncrease: PropTypes.func,
        changeZoomLevel: PropTypes.func,
        toggleControl: PropTypes.func,
        changeTab: PropTypes.func,
        selectedTiles: PropTypes.object,
        prenom: PropTypes.string,
        nom: PropTypes.string,
        collectivite: PropTypes.string,
        service: PropTypes.string,
        courriel: PropTypes.string,
        telephone: PropTypes.string,
        motivation: PropTypes.string,
        dataSurf: PropTypes.bool,
        dataUnderSurf: PropTypes.bool
    }

    static defaultProps= {
        active: false,
        value: 0,
        element: 'RTGE:WELCOME',
        dockStyle: {zIndex: 100},
        panelClassName: 'rtge-panel',
        width: RTGE_PANEL_WIDTH,
        activeTab: tabTypes.HOME,
        selectedTiles: {id: 'toto', lastUpdate: 'yesterday', objectSurf: '75', objectUnderSurf: '52'},
        prenom: 'Benoit',
        nom: 'DAVID',
        collectivite: 'Rennes Metropole',
        service: 'Service Information Géographique',
        courriel: 'b.david@rennesmetropole.fr',
        telephone: '12345',
        motivation: '',
        dataSurf: true,
        dataUnderSurf: false,
        onIncrease: ()=>{},
        changeZoomLevel: ()=>{},
        toggleControl: ()=>{},
        changeTab: ()=>{}
    }

    constructor(props) {
        super(props);
    }

    // TODO
    // ajouter componentDidMount() pour ajouter tout les éléments à mettre ne place une fois le composant monté
    // pareil pour le componentDidUpdate(prevProp,prevState) mais pour mettre à jour la vue une fois déjà montée

    onClose() {
        // TODO FINIR CETTE FONCTION QUI MARCHE PO
        return this.props.toggleControl();
        // return setControlProperty('rtge', 'enabled', false, 'true' );
    }

    getHomeTab() {
        return (
            <div id="SAMPLE_EXTENSION" >
                <div className="paragraphs">
                    <p className="title mainTitle">Outil d'extraction de dalles du Référentiel Métropolitain Topographique et Réseaux.</p>

                    <p className="title">Limites et conditions d'utilisation</p>
                    <p>Les données du RMTR consultables ici le sont à titre informatif uniquement. Il n'est pas possible de garantir sur cet outil des mesures de précision topographique sur les données. Il faut se reporter sur les outils spécialisés pour ce genre d'exploitation (AutoCAD, TopStation).</p>

                    <p>Les données concernant les réseaux sont en accès restreint. La possibilité de consulter ces données ne vous dispense pas de faire toutes les démarches nécessaires à un projet, notamment les demandes de DT/DICT. Contacter le service Information Géographique si vous avez besoin de consulter les données de réseaux du sous-sol.</p>

                    <p className="title">Principe d'utilisation</p>
                    <p>Les données du RMTR sont découpées en dalle de 140x200m qui couvre Rennes Métropole.<br />
                        Une demande d'extraction se formule donc sous la forme d'une liste de dalles.<br />
                        La demande sera traitée par le service Information Géographique qui vous renverra 1 fichier DXF.<br />
                        La limite du nombre de dalles maximum par demande est de 50.</p>

                    <p className="title">Mode d'emploi</p>
                    <p>1. Utiliser 1 des 3 outils de sélection pour sélectionner les dalles dont vous avez besoin. Affiner votre sélection si nécessaire (ajouter / supprimer).<br />
                        2. Cliquer sur le bouton 'Envoi'<br />
                        3. Remplir les champs et motiver votre demande en indiquant le projet d'aménagement ou le besoin.<br />
                        4. Préciser si cela concerne les données de surface et/ou de sous-sol<br />
                        5. Valider la demande</p>
                </div>
            </div>
        );
    }

    getSelectionTab() {
        return (
            <div id="SAMPLE_EXTENSION" >
                <div className="row text-center">
                    <button className="selectorButton"><Glyphicon glyph="map-marker"/></button>
                    <button className="selectorButton"><Glyphicon glyph="polyline"/></button>
                    <button className="selectorButton"><Glyphicon glyph="polygon"/></button>
                </div>
                <div className="row">
                    <div className="row tableOffset">
                        <div className="col-sm-3 text-center selectTitle">Identifiant</div>
                        <div className="col-sm-3 text-center selectTitle">Date mise à jour</div>
                        <div className="col-sm-3 text-center selectTitle">Nb objets surface</div>
                        <div className="col-sm-3 text-center selectTitle">nb objets sous sol</div>
                    </div>
                    <div className="row tableOffset">
                        <div className="col-sm-3 text-center">{this.props.selectedTiles.id}</div>
                        <div className="col-sm-3 text-center">{this.props.selectedTiles.lastUpdate}</div>
                        <div className="col-sm-3 text-center">{this.props.selectedTiles.objectSurf}</div>
                        <div className="col-sm-3 text-center">{this.props.selectedTiles.objectUnderSurf}</div>
                    </div>
                </div>
            </div>
        );
    }

    getSendTab() {
        return (
            <div className="formGlobal">
                <div className="formUnit">
                    <label htmlFor="prenom">Prenom :</label>
                    <input
                        type="text"
                        value={this.props.prenom}
                        onChange={this.setPrenom}
                        id="prenom"
                    />
                </div>
                <div className="formUnit">
                    <label htmlFor="nom">Nom : </label>
                    <input
                        type="text"
                        value={this.props.nom}
                        onChange={this.setNom}
                        id="nom"
                    />
                </div>
                <div className="formUnit">
                    <label htmlFor="collectivite">Collectivité : </label>
                    <input
                        type="text"
                        value={this.props.collectivite}
                        onChange={this.setCollectivite}
                        id="collectivite"
                    />
                </div>
                <div className="formUnit">
                    <label htmlFor="service">Service : </label>
                    <input
                        type="text"
                        value={this.props.service}
                        onChange={this.setService}
                        id="service"
                    />
                </div>
                <div className="formUnit">
                    <label htmlFor="courriel">Courriel : </label>
                    <input
                        type="text"
                        value={this.props.courriel}
                        onChange={this.setCourriel}
                        id="courriel"
                    />
                </div>
                <div className="formUnit">
                    <label htmlFor="courriel">Téléphone : </label>
                    <input
                        type="text"
                        value={this.props.telephone}
                        onChange={this.setTelephone}
                        id="courriel"
                    />
                </div>
                <div className="formUnit">
                    <label htmlFor="mp">Motivation - Projet : </label>
                    <textarea
                        type="text"
                        value={this.props.motivation}
                        onChange={this.setMotivation}
                        rows="4"
                        cols="50"
                        id="mp"
                    />
                </div>
                <div className="formUnit">
                    <label htmlFor="isSurface">Données de surface : </label>
                    <input
                        type="checkbox"
                        value={this.props.dataSurf}
                        onChange={this.setDataSurf}
                        id="isSurface"
                    />
                </div>
                <div className="formUnit">
                    <label htmlFor="isSousSol">Données de sous-sol : </label>
                    <input
                        type="checkbox"
                        value={this.props.dataUnderSurf}
                        onChange={this.setDataUnderSurf}
                        id="isSousSol"
                    />
                </div>
                <button className="buttonForm" onClick={this.getForm}>Envoyer</button>
            </div>
        );
    }

    getForm(form) {
        console.log(form);
    }

    renderTabMenu() {
        return (
            <div className="row rowTabs">
                <div className="col-sm-4 text-center">
                    <button className="homeButton active" onClick={() => this.props.changeTab(tabTypes.HOME)}>
                        Accueil
                    </button>
                </div>
                <div className="col-sm-4 text-center">
                    <button className="selectButton" onClick={() => this.props.changeTab(tabTypes.SELECT)}>
                        Selection
                    </button>
                </div>
                <div className="col-sm-4 text-center">
                    <button className="sendButton" onClick={() => this.props.changeTab(tabTypes.SEND)}>
                        Envoi
                    </button>
                </div>
            </div>
        );
    }

    renderContent() {
        var content;
        switch (this.props.activeTab) {
        case tabTypes.HOME:
            content = this.getHomeTab();
            break;
        case tabTypes.SELECT:
            content = this.getSelectionTab();
            break;
        case tabTypes.SEND:
            content = this.getSendTab();
            break;
        default:
            break;
        }
        return content;
    }

    render() {
        if (this.props.active) {
            return (
                <ResponsivePanel
                    containerStyle={this.props.dockStyle}
                    style={this.props.dockStyle}
                    containerId="ms-rtge-panel"
                    containerClassName="rtge-dock-container"
                    className={this.props.panelClassName}
                    open={this.props.active}
                    position="right"
                    size={this.props.width}
                    bsStyle="primary"
                    title={<Message msgId="RTGE.title"/>}
                    glyph="map-marker"
                    onClose={() => this.props.toggleControl('rtge', null)}>
                    {this.renderTabMenu()}
                    {this.renderContent()}
                </ResponsivePanel>
            );
        // eslint-disable-next-line no-else-return
        } else {
            return null;
        }
    }

    setPrenom(e) {
        console.log(this);
        this.props.prenom = e.target.value;
        this.setState(this.state);
    }

    setNom(e) {
        this.props.nom = e.target.value;
        this.setState(this.state);
    }

    setCollectivite(e) {
        this.props.collectivite = e.target.value;
        this.setState(this.state);
    }

    setService(e) {
        this.props.service = e.target.value;
        this.setState(this.state);
    }

    setCourriel(e) {
        this.props.courriel = e.target.value;
        this.setState(this.state);
    }

    setTelephone(e) {
        this.props.telephone = e.target.value;
        this.setState(this.state);
    }

    setMotivation(e) {
        this.props.motivation = e.target.value;
        this.setState(this.state);
    }

    setDataSurf(e) {
        this.props.dataSurf = e.target.value;
        this.setState(this.state);
    }

    setDataUnderSurf(e) {
        this.props.dataUnderSurf = e.target.value;
        this.setState(this.state);
    }

}
