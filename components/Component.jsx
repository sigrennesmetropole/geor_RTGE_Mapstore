/* eslint-disable no-console */
import React from "react";
import PropTypes from 'prop-types';
import Message from "@mapstore/components/I18N/Message";
import src from "../assets/markers_default.png";
import { RTGE_PANEL_WIDTH } from "../constants/rtge-constants.js";
import { tabTypes } from "../actions/rtge-action.js";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";
import {setControlProperties, setControlProperty, toggleControl} from "@mapstore/actions/controls";
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
        changeTab: PropTypes.func
    }

    static defaultProps= {
        active: false,
        value: 0,
        element: 'RTGE:WELCOME',
        dockStyle: {zIndex: 100},
        panelClassName: 'rtge-panel',
        width: RTGE_PANEL_WIDTH,
        activeTab: tabTypes.HOME,
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

    renderTabMenu() {
        return (
            <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-2">
                    <button onClick={() => this.props.changeTab(tabTypes.HOME)}>
                        Accueil
                    </button>
                </div>
                <div className="col-sm-2">
                    <button onClick={() => this.props.changeTab(tabTypes.SELECT)}>
                        Selection
                    </button>
                </div>
                <div className="col-sm-2">
                    <button onClick={() => this.props.changeTab(tabTypes.SEND)}>
                        Envoi
                    </button>
                </div>
                <div className="col-sm-3"></div>
            </div>
        );
    }

    renderContent() {
        var content;
        switch (this.props.activeTab) {
        case tabTypes.HOME:
            content = (
                <p>accueil</p>
            );
            break;
        case tabTypes.SELECT:
            content = (
                <p>selection</p>
            );
            break;
        case tabTypes.SEND:
            content = (
                <p>envoi</p>
            );
            break;
        default:
            break;
        }
        return content;
    }

    render() {
        var content;
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
        } else {
            return null;
        }
    }

}

// export default Extension;

// switch (this.props.element) {
// case 'RTGE:WELCOME':
//     content = (
//         <div id="SAMPLE_EXTENSION" >
//             <div className="paragraphs">
//                 <p className="title">Outil d'extraction de dalles du Référentiel Métropolitain Topographique et Réseaux.</p>

//                 <p className="title">Limites et conditions d'utilisation</p>
//                 <p>Les données du RMTR consultables ici le sont à titre informatif uniquement. Il n'est pas possible de garantir sur cet outil des mesures de précision topographique sur les données. Il faut se reporter sur les outils spécialisés pour ce genre d'exploitation (AutoCAD, TopStation).</p>

//                 <p>Les données concernant les réseaux sont en accès restreint. La possibilité de consulter ces données ne vous dispense pas de faire toutes les démarches nécessaires à un projet, notamment les demandes de DT/DICT. Contacter le service Information Géographique si vous avez besoin de consulter les données de réseaux du sous-sol.</p>

//                 <p className="title">Principe d'utilisation</p>
//                 <p>Les données du RMTR sont découpées en dalle de 140x200m qui couvre Rennes Métropole.<br />
//             Une demande d'extraction se formule donc sous la forme d'une liste de dalles.<br />
//             La demande sera traitée par le service Information Géographique qui vous renverra 1 fichier DXF.<br />
//             La limite du nombre de dalles maximum par demande est de 50.</p>

//                 <p className="title">Mode d'emploi</p>
//                 <p>1. Utiliser 1 des 3 outils de sélection pour sélectionner les dalles dont vous avez besoin. Affiner votre sélection si nécessaire (ajouter / supprimer).<br />
//             2. Cliquer sur le bouton 'Envoi'<br />
//             3. Remplir les champs et motiver votre demande en indiquant le projet d'aménagement ou le besoin.<br />
//             4. Préciser si cela concerne les données de surface et/ou de sous-sol<br />
//             5. Valider la demande</p>
//             </div>
//         </div>
//     );
//     break;
// case 'RTGE:SELECT':
//     content = (
//         <div id="SAMPLE_EXTENSION" >
//             <h2>Extension Sample</h2>
//             <div>This is a sample extension plugin. The following tools demonstrate the correct binding inside MapStore</div>
//             <h3>State and epics</h3>
//             <div>A button like this should be visualized also in the toolbar: <br /><button onClick={this.props.onIncrease} className="btn-primary square-button btn">INC</button><br /> </div>
//             <div>Clicking on that button (or on the button above) should increase this counter value: <b>{this.props.value}</b>. <br />The counter value updates should be logged in console by an epic</div>
//             <i>note: the button in the toolbar can be hidden, in this case click on the "..." button</i>
//             <h3>Localization</h3>
//         The following text should be localized: <b><Message msgId="extension.message" /></b><br /> (you should see something like "Message!" if your language is set to en-US)
//             <h3>Core action</h3>
//         This button should change the zoom level to "1"
//             <button onClick={() => { this.props.changeZoomLevel(1); }}>zoom to level 1</button>
//         Here a sample image with several markers:
//             <img src={src}/>
//         </div>
//     );
//     break;
// case 'RTGE:SEND':
//     content = (
//         <div className="formGlobal">
//             <div className="formUnit">
//                 <label htmlFor="prenom">Prenom :</label>
//                 <input
//                     type="text"
//                     value="prenom"
//                     // onChange={(e) => setPrenom(e.target.value)}
//                     id="prenom"
//                 />
//             </div>
//             <div className="formUnit">
//                 <label htmlFor="nom">Nom : </label>
//                 <input
//                     type="text"
//                     value="nom"
//                     // onChange={(e) => setNom(e.target.value)}
//                     id="nom"
//                 />
//             </div>
//             <div className="formUnit">
//                 <label htmlFor="collectivite">Collectivité : </label>
//                 <input
//                     type="text"
//                     value="collectivite"
//                     // onChange={(e) => setCollectivite(e.target.value)}
//                     id="collectivite"
//                 />
//             </div>
//             <div className="formUnit">
//                 <label htmlFor="service">Service : </label>
//                 <input
//                     type="text"
//                     value="service"
//                     // onChange={(e) => setService(e.target.value)}
//                     id="service"
//                 />
//             </div>
//             <div className="formUnit">
//                 <label htmlFor="courriel">Courriel : </label>
//                 <input
//                     type="text"
//                     value="courriel"
//                     // onChange={(e) => setCourriel(e.target.value)}
//                     id="courriel"
//                 />
//             </div>
//             <div className="formUnit">
//                 <label htmlFor="courriel">Téléphone : </label>
//                 <input
//                     type="text"
//                     value="telephone"
//                     // onChange={(e) => setTelephone(e.target.value)}
//                     id="courriel"
//                 />
//             </div>
//             <div className="formUnit">
//                 <label htmlFor="mp">Motivation - Projet : </label>
//                 <textarea
//                     type="text"
//                     value="mp"
//                     // onChange={(e) => setMP(e.target.value)}
//                     rows="4"
//                     cols="50"
//                     id="mp"
//                 />
//             </div>
//             <div className="formUnit">
//                 <label htmlFor="isSurface">Données de surface : </label>
//                 <input
//                     type="checkbox"
//                     value="isSurface"
//                     // onChange={(e) => {setSurface(e.target.checked)}}
//                     id="isSurface"
//                 />
//             </div>
//             <div className="formUnit">
//                 <label htmlFor="isSousSol">Données de sous-sol : </label>
//                 <input
//                     type="checkbox"
//                     value="isSousSol"
//                     // onChange={(e) => setSousSol(e.target.checked)}
//                     id="isSousSol"
//                 />
//             </div>
//             <button className="buttonForm" /* onClick={getForm}*/>Envoyer</button>
//         </div>
//     );
//     break;
// default:
//     return null;
// }
