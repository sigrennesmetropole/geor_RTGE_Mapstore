/* eslint-disable no-console */
import React from "react";
import PropTypes from 'prop-types';
import Message from "@mapstore/components/I18N/Message";
import { RTGE_PANEL_WIDTH } from "../constants/rtge-constants.js";
import { tabTypes } from "../actions/rtge-action.js";
import ResponsivePanel from "@mapstore/components/misc/panels/ResponsivePanel";

import {
    Form,
    FormControl,
    FormGroup,
    Glyphicon,
    InputGroup,
    Checkbox
} from 'react-bootstrap';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
export class RTGEComponent extends React.Component {

    static propTypes= {
        active: PropTypes.bool,
        value: PropTypes.number,
        element: PropTypes.string,
        dockStyle: PropTypes.object,
        panelClassName: PropTypes.string,
        width: PropTypes.number,
        activeTab: PropTypes.string,
        activeSelection: PropTypes.string,
        selectedTiles: PropTypes.array,
        user: PropTypes.object,
        selectedRow: PropTypes.array,
        rtgeHomeText: PropTypes.string,
        rtgeTilesAttributes: PropTypes.array,
        changeZoomLevel: PropTypes.func,
        toggleControl: PropTypes.func,
        changeTab: PropTypes.func,
        switchDraw: PropTypes.func,
        removeSelectedTiles: PropTypes.func,
        clickTable: PropTypes.func,
        sendMail: PropTypes.func,
        formValidationError: PropTypes.func,
        initConfigs: PropTypes.func
    }

    static defaultProps= {
        active: false,
        value: 0,
        element: 'RTGE:WELCOME',
        dockStyle: {zIndex: 100},
        panelClassName: 'rtge-panel',
        width: RTGE_PANEL_WIDTH,
        activeTab: tabTypes.HOME,
        selectedTiles: [],
        user: {},
        activeSelection: '',
        selectedRow: [],
        rtgeTilesAttributes: [],
        changeZoomLevel: ()=>{},
        toggleControl: ()=>{},
        changeTab: ()=>{},
        switchDraw: ()=>{},
        removeSelectedTiles: ()=>{},
        clickTable: ()=>{},
        sendMail: ()=>{},
        formValidationError: ()=>{},
        initConfigs: ()=>{}
    }

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            prenom: props.user.prenom || '',
            nom: props.user.nom || '',
            collectivite: props.user.collectivite || '',
            service: props.user.service || '',
            courriel: props.user.courriel || '',
            telephone: props.user.telephone || '',
            motivation: props.user.motivation || '',
            dataSurf: props.user.dataSurf || true,
            dataUnderSurf: props.user.dataUnderSurf || false,
            rtgeHomeText: props.rtgeHomeText
        };
        props.initConfigs({
            rtgeBackendURLPrefix: props.rtgeBackendURLPrefix,
            rtgeEmailUrl: props.rtgeEmailUrl,
            rtgeGridLayerId: props.rtgeGridLayerId,
            rtgeGridLayerName: props.rtgeGridLayerName,
            rtgeGridLayerProjection: props.rtgeGridLayerProjection,
            rtgeGridLayerTitle: props.rtgeGridLayerTitle,
            rtgeUserDetailsUrl: props.rtgeUserDetailsUrl,
            rtgeHomeText: props.rtgeHomeText,
            rtgeMailTemplate: props.rtgeMailTemplate,
            rtgeMailRecipients: props.rtgeMailRecipients,
            rtgeMailSubject: props.rtgeMailSubject,
            rtgeMaxTiles: props.rtgeMaxTiles,
            rtgeTileIdAttribute: props.rtgeTileIdAttribute,
            rtgeTilesAttributes: props.rtgeTilesAttributes
        });
    }

    componentDidUpdate(prevProps) {
        if (!Object.keys(prevProps.user).length && this.props.user !== prevProps.user) {
            this.setLocalState();
        }
    }

    /**
     * onClose closes the plugins Panel
     * @memberof rtge.component
     * @returns - toggleControl action
     */
    onClose() {
        return this.props.toggleControl();
    }

    /**
     * renderPrenomField Renders prenom field for the form
     * @memberof rtge.component
     * @returns - dom parts for the prenom field
     */
    renderPrenomField() {
        return (
            <div className="formUnit">
                <FormGroup controlId="rtgeForm.prenom">
                    <InputGroup className="inputGroupStyles">
                        <div className="col-sm-3">
                            <Message msgId="RTGE.prenom" />
                        </div>
                        <div className="col-sm-9">
                            <FormControl
                                type="text"
                                placeholder=""
                                value={this.state.prenom}
                                required
                                onChange={(e) => this.handleTextFieldChange(e, 'prenom')}
                            />
                        </div>
                    </InputGroup>
                </FormGroup>
            </div>
        );
    }

    /**
     * renderNomField Renders nom field for the form
     * @memberof rtge.component
     * @returns - dom parts for the nom field
     */
    renderNomField() {
        return (
            <div className="formUnit">
                <FormGroup controlId="rtgeForm.nom">
                    <InputGroup className="inputGroupStyles">
                        <div className="col-sm-3">
                            <Message msgId="RTGE.nom" />
                        </div>
                        <div className="col-sm-9">
                            <FormControl
                                type="text"
                                placeholder=""
                                value={this.state.nom}
                                required
                                onChange={(e) => this.handleTextFieldChange(e, 'nom')}
                            />
                        </div>
                    </InputGroup>
                </FormGroup>
            </div>
        );
    }

    /**
     * renderCollectiviteField Renders collectivite field for the form
     * @memberof rtge.component
     * @returns - dom parts for the collectivite field
     */
    renderCollectiviteField() {
        return (
            <div className="formUnit">
                <FormGroup controlId="rtgeForm.collectivite">
                    <InputGroup className="inputGroupStyles">
                        <div className="col-sm-3">
                            <Message msgId="RTGE.collectivite" />
                        </div>
                        <div className="col-sm-9">
                            <FormControl
                                type="text"
                                placeholder=""
                                value={this.state.collectivite}
                                required
                                onChange={(e) => this.handleTextFieldChange(e, 'collectivite')}
                            />
                        </div>
                    </InputGroup>
                </FormGroup>
            </div>
        );
    }

    /**
     * renderService Renders service field for the form
     * @memberof rtge.component
     * @returns - dom parts for the service field
     */
    renderService() {
        return (
            <div className="formUnit">
                <FormGroup controlId="rtgeForm.service">
                    <InputGroup className="inputGroupStyles">
                        <div className="col-sm-3">
                            <Message msgId="RTGE.service" />
                        </div>
                        <div className="col-sm-9">
                            <FormControl
                                type="text"
                                placeholder=""
                                value={this.state.service}
                                required
                                onChange={(e) => this.handleTextFieldChange(e, 'service')}
                            />
                        </div>
                    </InputGroup>
                </FormGroup>
            </div>
        );
    }

    /**
     * renderCourriel Renders courriel field for the form
     * @memberof rtge.component
     * @returns - dom parts for the courriel field
     */
    renderCourriel() {
        return (
            <div className="formUnit">
                <FormGroup controlId="rtgeForm.courriel">
                    <InputGroup className="inputGroupStyles">
                        <div className="col-sm-3">
                            <Message msgId="RTGE.courriel" />
                        </div>
                        <div className="col-sm-9">
                            <FormControl
                                type="text"
                                placeholder=""
                                value={this.state.courriel}
                                required
                                onChange={(e) => this.handleTextFieldChange(e, 'courriel')}
                            />
                        </div>
                    </InputGroup>
                </FormGroup>
            </div>
        );
    }

    /**
     * renderTelephone Renders phone field for the form
     * @memberof rtge.component
     * @returns - dom parts for the phone field
     */
    renderTelephone() {
        return (
            <div className="formUnit">
                <FormGroup controlId="rtgeForm.telephone">
                    <InputGroup className="inputGroupStyles">
                        <div className="col-sm-3">
                            <Message msgId="RTGE.telephone" />
                        </div>
                        <div className="col-sm-9">
                            <PhoneInput
                                defaultCountry="FR"
                                placeholder="Entrez un numéro de téléphone"
                                value={this.state.telephone}
                                onChange={(e) => this.handlePhoneFieldChange(e, 'telephone')}/>
                        </div>
                    </InputGroup>
                </FormGroup>
            </div>
        );
    }

    /**
     * renderMotivation Renders motivation field for the form
     * @memberof rtge.component
     * @returns - dom parts for the motivation field
     */
    renderMotivation() {
        return (
            <div className="formUnit">
                <FormGroup controlId="rtgeForm.motivation">
                    <InputGroup className="specialInputGroupStyles">
                        <Message msgId="RTGE.motivation" />
                        <FormControl
                            componentClass="textarea"
                            placeholder=""
                            value={this.state.motivation}
                            required
                            onChange={(e) => this.handleTextFieldChange(e, 'motivation')}
                            rows={4}
                            cols={50}
                        />
                    </InputGroup>
                </FormGroup>
            </div>
        );
    }

    /**
     * renderDataSurf Renders data surface checkbox field for the form
     * @memberof rtge.component
     * @returns - dom parts for the data surface checkbox field
     */
    renderDataSurf() {
        return (
            <div className="formUnit">
                <FormGroup controlId="rtgeForm.dataSurf"  className="specialInputGroupStyles">
                    <div className="col-sm-4">
                        <Message msgId="RTGE.dataType" />
                    </div>
                    <div className="col-sm-8">
                        <div className="col-sm-3 v-align">
                            <Checkbox
                                defaultChecked={this.state.dataSurf}
                                onChange={() => this.handleBooleanFieldChange('dataSurf')}
                                className="checkbox"
                            />
                        </div>
                        <div className="col-sm-9 notBold">
                            <Message msgId="RTGE.dataSurf"/>
                        </div>
                    </div>
                </FormGroup>
            </div>
        );
    }

    /**
     * renderDataUnderSurf Renders data under surface checkbox field for the form
     * @memberof rtge.component
     * @returns - dom parts for the data under surface checkbox field
     */
    renderDataUnderSurf() {
        return (
            <div className="formUnit">
                <FormGroup controlId="rtgeForm.dataUnderSurf"  className="specialInputGroupStyles">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-8">
                        <div className="col-sm-3 v-align">
                            <Checkbox
                                defaultChecked={this.state.dataUnderSurf}
                                onChange={() => this.handleBooleanFieldChange('dataUnderSurf')}
                                className="checkbox"
                            />
                        </div>
                        <div className="col-sm-9 notBold">
                            <Message msgId="RTGE.dataUnderSurf"/>
                            {this.state.dataUnderSurf
                                ? <div className="row undergroundWarning text-center">
                                    <Message msgId="RTGE.dataUnderSurfWarning"/>
                                </div>
                                : ''
                            }
                        </div>
                    </div>
                </FormGroup>
            </div>
        );
    }

    /**
     * renderHomeTab home tab content
     * @memberof rtge.component
     * @returns - dom of the home tab content
     */
    renderHomeTab() {
        return (
            <div id="SAMPLE_EXTENSION">
                <div className="paragraphs" dangerouslySetInnerHTML={{__html: this.props.rtgeHomeText}}>
                </div>
            </div>
        );
    }

    /**
     * renderSendTab renders all the form elements in one place
     * @memberof rtge.component
     * @returns - organise the plugins form
     */
    renderSendTab() {
        return (
            <div id="SAMPLE_EXTENSION">
                <div className="formGlobal">
                    <Form>
                        {this.renderPrenomField()}
                        {this.renderNomField()}
                        {this.renderCollectiviteField()}
                        {this.renderService()}
                        {this.renderCourriel()}
                        {this.renderTelephone()}
                        {this.renderMotivation()}
                        {this.renderDataSurf()}
                        {this.renderDataUnderSurf()}
                        {this.state.prenom !== '' && this.state.nom !== '' && this.state.collectivite !== '' && this.state.service !== '' && this.state.courriel !== '' && this.state.motivation !== '' && (this.state.dataSurf !== false || this.state.dataUnderSurf !== false)
                            ? <button className="buttonForm label-default buttonToRight btn btn-primary" onClick={() => this.sendMail()}><Message msgId={'RTGE.sendTab.button'}/></button>
                            : <button className="buttonForm gray buttonToRight btn btn-default"><Message msgId={'RTGE.sendTab.button'}/></button>
                        }
                    </Form>
                </div>
            </div>
        );
    }

    /**
     * renderSelectionTab renders the selection tab
     * @memberof rtge.component
     * @returns - selection tab dom content
     */
    renderSelectionTab() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-4 left"><span>{this.props.selectedTiles.length} <Message msgId={'RTGE.selectionTab.tiles'}/></span></div>
                    <div className="col-sm-4 text-center">
                        <button className={this.props.activeSelection === 'Point' ? "selectorButton btn btn-active tooltipMain" : "selectorButton btn btn-primary tooltipMain"} onClick={() => this.props.switchDraw('Point')}>
                            <Glyphicon glyph="map-marker"/>
                            <span className="tooltipContent"><Message msgId={'RTGE.tooltips.tooltipSelectPoint'}/></span>
                        </button>
                        <button className={this.props.activeSelection === 'LineString' ? "selectorButton btn btn-active tooltipMain" : "selectorButton btn btn-primary tooltipMain"} onClick={() => this.props.switchDraw('LineString')}>
                            <Glyphicon glyph="polyline"/>
                            <span className="tooltipContent"><Message msgId={'RTGE.tooltips.tooltipSeclectLine'}/></span>
                        </button>
                        <button className={this.props.activeSelection === 'Polygon' ? "selectorButton btn btn-active tooltipMain" : "selectorButton btn btn-primary tooltipMain"} onClick={() => this.props.switchDraw('Polygon')}>
                            <Glyphicon glyph="polygon"/>
                            <span className="tooltipContent"><Message msgId={'RTGE.tooltips.tooltipSelectPolygon'}/></span>
                        </button>
                    </div>
                    <div className="col-sm-4 right">
                        <button className={this.props.selectedRow.length === 0 ? "selectorButton empty btn btn-active tooltipMain" : "selectorButton btn-primary tooltipMain"} onClick={() => this.props.selectedRow.length === 0 ? '' : this.props.removeSelectedTiles()}>
                            <Glyphicon glyph="trash"/>
                            <span className="tooltipContentLeft"><Message msgId={'RTGE.tooltips.tooltipTrash'}/></span>
                        </button>
                    </div>
                </div>
                <div className="row arrayOffset">
                    <div className="row tableOffset selectTitle text-center">
                        {
                            this.props.rtgeTilesAttributes.map((val) => {
                                return (
                                    <div className={val.colWidth + " v-align delimitor"}><span>{val.title}</span></div>
                                );
                            })
                        }
                    </div>
                    <div className="scrollBar text-center">
                        {
                            this.props.selectedTiles.map((val, key) => {
                                return (
                                    <div className={val.properties.selected ? "row arraySelected" : "row"} key={key} onClick={(e) => this.props.clickTable(val, e.ctrlKey)}>
                                        {
                                            this.props.rtgeTilesAttributes.map((attributeVal) => {
                                                return (
                                                    <div className={attributeVal.colWidth}>{val.properties[attributeVal.attribute]}</div>
                                                );
                                            })
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }

    /**
     * renderTabMenu renders the selection tabs to get all plkugins sub parts
     * @memberof rtge.component
     * @returns - navbar like for the plugin
     */
    renderTabMenu() {
        return (
            <div className="row rowTabs">
                <div className="col-sm-4 text-center">
                    <button className={this.props.activeTab === "RTGE:HOME" ? "homeButton active" : "homeButton"} onClick={() => this.props.changeTab(tabTypes.HOME)}>
                        <Message msgId={'RTGE.welcome'}/>
                    </button>
                </div>
                <div className="col-sm-4 text-center">
                    <button className={this.props.activeTab === "RTGE:SELECT" ? "selectButton active" : "selectButton"} onClick={() => this.props.changeTab(tabTypes.SELECT)}>
                        <Message msgId={'RTGE.selection'}/>
                    </button>
                </div>
                <div className="col-sm-4 text-center">
                    {this.props.selectedTiles.length === 0 &&
                    <>
                        <button className="sendButton gray tooltipMain">
                            <Message msgId={'RTGE.send'}/>
                            <span className="tooltipContent"><Message msgId={'RTGE.sendBtnDisabled'}/></span>
                        </button>
                    </>
                    }
                    {this.props.selectedTiles.length > 0 &&
                        <button className={this.props.activeTab === "RTGE:SEND" ? "sendButton active" : "sendButton" } onClick={() => this.props.changeTab(tabTypes.SEND)}>
                            <Message msgId={'RTGE.send'}/>
                        </button>
                    }
                </div>
            </div>
        );
    }

    /**
     * renderContent organise which tab is active
     * @memberof rtge.component
     * @returns - tab dom content
     */
    renderContent() {
        var content;
        switch (this.props.activeTab) {
        case tabTypes.HOME:
            content = this.renderHomeTab();
            break;
        case tabTypes.SELECT:
            content = this.renderSelectionTab();
            break;
        case tabTypes.SEND:
            content = this.renderSendTab();
            break;
        default:
            break;
        }
        return content;
    }

    /**
     * render component
     * @memberof rtge.component
     * @returns - Mapstore ResponsivePanel with our data inside
     */
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
        }
        return null;
    }

    /**
     * handleTextFieldChange when a text field change, it updates the state
     * @memberof rtge.component
     * @param e - javascript event object
     * @param fieldName - name of the field which is to update
     * @returns - nothing
     */
    handleTextFieldChange(e, fieldName) {
        this.state[fieldName] = e.target.value;
        this.setState(this.state);
    }

    /**
     * handlePhoneFieldChange when the phone field change, it updates the state
     * @memberof rtge.component
     * @param e - javascript event object
     * @param fieldName - name of the field which is to update
     * @returns - nothing
     */
    handlePhoneFieldChange(e, fieldName) {
        this.state[fieldName] = e;
        this.setState(this.state);
    }

    /**
     * handleBooleanFieldChange when the booleans fields change, it updates their state
     * @memberof rtge.component
     * @param fieldName - name of the field which is to update
     * @returns - nothing
     */
    handleBooleanFieldChange(fieldName) {
        this.state[fieldName] = !this.state[fieldName];
        this.setState(this.state);
    }

    /**
     * sendMail sends the email action if all mandatory fields are not empty
     * @memberof rtge.component
     * @returns - send mail action when available or nothing
     */
    sendMail() {
        if (this.state.prenom !== '' && this.state.nom !== '' && this.state.collectivite !== '' && this.state.service !== '' && this.state.courriel !== '' && this.state.motivation !== '') {
            return this.props.sendMail(this.state);
        }
        return null;
    }

    /**
     * setLocalState Initializes the object for user data and is used to populate it
     * @memberof rtge.component
     * @returns - latest user data in state
     */
    setLocalState() {
        this.setState({
            prenom: this.props.user.prenom || '',
            nom: this.props.user.nom || '',
            collectivite: this.props.user.collectivite || '',
            service: this.props.user.service || '',
            courriel: this.props.user.courriel || '',
            telephone: this.props.user.telephone || '',
            motivation: this.props.user.motivation || '',
            dataSurf: this.props.user.dataSurf || true,
            dataUnderSurf: this.props.user.dataUnderSurf || false
        });
    }
}


