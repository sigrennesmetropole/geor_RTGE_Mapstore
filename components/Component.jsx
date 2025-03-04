/* eslint-disable no-console */
import React from "react";
import PropTypes from 'prop-types';
import Message from "@mapstore/components/I18N/Message";
import { RTGE_PANEL_WIDTH } from "../constants/rtge-constants.js";
import { tabTypes } from "../actions/rtge-action.js";
import { getHealth } from "../api/api";
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
/*import PhoneInput from 'react-phone-number-input';*/
import LoadingSpinner from '@mapstore/components/misc/LoadingSpinner';
import {getMessageById} from '@mapstore/utils/LocaleUtils';
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
        selectionGeometryType: PropTypes.string,
        user: PropTypes.object,
        finalUser: PropTypes.object,
        selectedRows: PropTypes.array,
        rtge_home_text: PropTypes.string,
        rtge_tiles_attributes: PropTypes.array,
        rtge_max_tiles: PropTypes.string,
        mailRequestInProgress: PropTypes.bool,
        pluginIcon: PropTypes.string,
        dataSurf: PropTypes.bool,
        dataUnderSurf: PropTypes.bool,
        schematicalNetwork: PropTypes.bool,
        changeZoomLevel: PropTypes.func,
        toggleControl: PropTypes.func,
        rtgeChangeTab: PropTypes.func,
        rtgeSwitchDraw: PropTypes.func,
        rtgeRemoveSelectedTiles: PropTypes.func,
        rtgeRemoveAllTiles: PropTypes.func,
        rtgeClickTable: PropTypes.func,
        rtgeSendMail: PropTypes.func,
        formValidationError: PropTypes.func,
        rtgeInitConfigs: PropTypes.func,
        rtgeStopDraw: PropTypes.func
    }
    
    static contextTypes = {
        messages: PropTypes.object
    };

    static defaultProps= {
        active: false,
        value: 0,
        element: 'RTGE:WELCOME',
        dockStyle: {zIndex: 100},
        panelClassName: 'rtge-panel',
        width: RTGE_PANEL_WIDTH,
        activeTab: tabTypes.HOME,
        selectedTiles: [],
        selectionGeometryType: undefined,
        user: {},
        finalUser: {},
        activeSelection: '',
        selectedRows: [],
        rtge_tiles_attributes: [],
        rtge_max_tiles: '',
        mailRequestInProgress: false,
        pluginIcon: '',
        dataSurf: true,
        dataUnderSurf: false,
        schematicalNetwork: false,
        changeZoomLevel: ()=>{},
        toggleControl: ()=>{},
        rtgeChangeTab: ()=>{},
        rtgeSwitchDraw: ()=>{},
        rtgeRemoveSelectedTiles: ()=>{},
        rtgeRemoveAllTiles: ()=>{},
        rtgeClickTable: ()=>{},
        rtgeSendMail: ()=>{},
        formValidationError: ()=>{},
        rtgeInitConfigs: ()=>{},
        rtgeStopDraw: ()=>{}
    }

    constructor(props) {
        super(props);
        this.state = {
            prenom: props.user.prenom || '',
            nom: props.user.nom || '',
            collectivite: props.user.collectivite || '',
            service: props.user.service || '',
            courriel: props.user.courriel || '',
            telephone: props.user.telephone || '',
            motivation: props.user.motivation || '',
            finalUse: props.finalUser.type || '',
            finalUser: props.finalUser.name || '',
            finalUserEMail: props.finalUser.email || '',
            finalUserAddress: props.finalUser.address || '',
            dataSurf: props.dataSurf,
            dataUnderSurf: props.dataUnderSurf,
            schematicalNetwork: props.schematicalNetwork,
            rtge_home_text: props.rtge_home_text,
            pluginIcon: props.pluginIcon,
            mailFormValidity: false
        };
        props.rtgeInitConfigs({
            rtge_grid_layer_id: props.rtge_grid_layer_id,
            rtge_backend_url_prefix: props.rtge_backend_url_prefix,
            rtge_grid_layer_name:props.rtge_grid_layer_name,
            rtge_grid_layer_title: props.rtge_grid_layer_title,
            rtge_grid_layer_projection: props.rtge_grid_layer_projection,
            rtge_grid_layer_geometry_attribute: props.rtge_grid_layer_geometry_attribute,
            rtge_user_details_url: props.rtge_user_details_url,
            rtge_max_tiles: props.rtge_max_tiles,
            rtge_tile_id_attribute: props.rtge_tile_id_attribute,
        });
    }

    componentDidUpdate(prevProps) {
        if (!Object.keys(prevProps.user).length
        && this.props.user !== prevProps.user) {
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
     * getSelectedRows allows to know if there are selected rows in table
     * @memberof rtge.component
     * @returns - the list of those rows
     */
    getSelectedRows() {
        return this.props.selectedTiles.filter(feature => feature.properties.selected);
    }

    /**
     * renderPrenomField Renders prenom field for the form
     * @memberof rtge.component
     * @returns - dom parts for the prenom field
     */
    renderPrenomField() {
        return (
            <div className="RTGE_formUnit">
                <FormGroup controlId="rtgeForm.prenom" className="RTGE_form-group">
                    <InputGroup className="RTGE_inputGroupStyles">
                        <div className="col-sm-4">
                            <Message msgId="RTGE.prenom" />
                        </div>
                        <div className="col-sm-8">
                            <FormControl
                                name="prenom"
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
            <div className="RTGE_formUnit">
                <FormGroup controlId="rtgeForm.nom" className="RTGE_form-group">
                    <InputGroup className="RTGE_inputGroupStyles">
                        <div className="col-sm-4">
                            <Message msgId="RTGE.nom" />
                        </div>
                        <div className="col-sm-8">
                            <FormControl
                                name="nom"
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
            <div className="RTGE_formUnit">
                <FormGroup controlId="rtgeForm.collectivite" className="RTGE_form-group">
                    <InputGroup className="RTGE_inputGroupStyles">
                        <div className="col-sm-4">
                            <Message msgId="RTGE.collectivite" />
                        </div>
                        <div className="col-sm-8">
                            <FormControl
                                name="collectivite"
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
            <div className="RTGE_formUnit">
                <FormGroup controlId="rtgeForm.service" className="RTGE_form-group">
                    <InputGroup className="RTGE_inputGroupStyles">
                        <div className="col-sm-4">
                            <Message msgId="RTGE.service" />
                        </div>
                        <div className="col-sm-8">
                            <FormControl
                                name="service"
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
            <div className="RTGE_formUnit">
                <FormGroup controlId="rtgeForm.courriel" className="RTGE_form-group">
                    <InputGroup className="RTGE_inputGroupStyles">
                        <div className="col-sm-4">
                            <Message msgId="RTGE.courriel" />
                        </div>
                        <div className="col-sm-8">
                            <FormControl
                                name="courriel"
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
            <div className="RTGE_formUnit">
                <FormGroup controlId="rtgeForm.telephone" className="RTGE_form-group">
                    <InputGroup className="RTGE_inputGroupStyles">
                        <div className="col-sm-4">
                            <Message msgId="RTGE.telephone" />
                        </div>
                        <div className="col-sm-8">
                            <FormControl
                                name="telephone"
                                type="text"
                                placeholder=""
                                value={this.state.telephone}
                                onChange={(e) => this.handleTextFieldChange(e, 'telephone')}
                            />
                        </div>
                    </InputGroup>
                </FormGroup>
            </div>
        );
    }

    /**
     * renderFinalUse Renders final use field for the form
     * @memberof rtge.component
     * @returns - dom parts for the final use field
     */
    renderFinalUse() {
        return (
            <div className="RTGE_formUnit">
                <FormGroup controlId="rtgeForm.finalUse" className="RTGE_form-group">
                    <InputGroup className="RTGE_inputGroupStyles">
                        <div className="col-sm-4">
                            <Message msgId="RTGE.finalUse" />
                        </div>
                        <div className="col-sm-8">
                            <FormControl componentClass="select"
                                className="RTGE_finalUseFormValues" 
                                name="finalUse"
                                placeholder=""
                                required
                                value={this.state.finalUse}
                                onChange={(e) => {this.handleTextFieldChange(e, 'finalUse');}} 
                                style={this.state.finalUse === '' ? {"borderColor": "red"} : {"borderColor": "inherit"}}>
                                    <option key='optDefault' className="RTGE_finalUseFormDropDown" value=''>{getMessageById(this.context.messages, 'RTGE.finalUseSelectValue')}</option>
                                    <option key='optInt' className="RTGE_finalUseFormDropDown" value='Interne'>{getMessageById(this.context.messages, 'RTGE.internalUsage')}</option>
                                    <option key='optExt' className="RTGE_finalUseFormDropDown" value='Externe'>{getMessageById(this.context.messages, 'RTGE.externalUsage')}</option>
                            </FormControl>
                        </div>
                    </InputGroup>
                </FormGroup>
            </div>
        );
    }
    /**
     * renderFinalUser Renders final user field for the form
     * @memberof rtge.component
     * @returns - dom parts for the final user field
     */
    renderFinalUser() {
        return (
            <>
            {this.state.finalUse === "Externe" && 
            <>
            <div className="col-sm-1"></div><div className="col-sm-11 RTGE_ExtUserInfoLabel">{getMessageById(this.context.messages, 'RTGE.finalUserInfoLabel')}</div>
            <div className="RTGE_formUnit">
                <FormGroup controlId="rtgeForm.finalUser" className="RTGE_form-group">
                    <InputGroup className="RTGE_inputGroupStyles">
                        <div className="col-sm-1"></div>
                        <div className="col-sm-4">
                            <Message msgId="RTGE.finalUser" />
                        </div>
                        <div className="col-sm-7">
                            <FormControl
                                name="finalUser"
                                type="text"
                                placeholder=""
                                value={this.state.finalUser}
                                required
                                onChange={(e) => this.handleTextFieldChange(e, 'finalUser')}
                            />
                        </div>
                    </InputGroup>
                </FormGroup>
            </div>
            </>}
            </>
        );
    }
    /**
     * renderFinalUserEMail Renders final user E-Mail field for the form
     * @memberof rtge.component
     * @returns - dom parts for the final user E-Mail field
     */
    renderFinalUserEMail() {
        return (
            <>
                {this.state.finalUse === 'Externe' &&
                <div className="RTGE_formUnit">
                    <FormGroup controlId="rtgeForm.finalUser" className="RTGE_form-group">
                        <InputGroup className="RTGE_inputGroupStyles">
                            <div className="col-sm-1"></div>
                            <div className="col-sm-4">
                                <Message msgId="RTGE.finalUserEMail" />
                            </div>
                            <div className="col-sm-7">
                                <FormControl
                                    name="finalUserEMail"
                                    type="text"
                                    placeholder=""
                                    value={this.state.finalUserEMail}
                                    required
                                    onChange={(e) => this.handleTextFieldChange(e, 'finalUserEMail')}
                                />
                            </div>
                        </InputGroup>
                    </FormGroup>
                </div>}
            </>
        );
    }
    /**
     * renderFinalUserAddress Renders final user Address field for the form
     * @memberof rtge.component
     * @returns - dom parts for the final user Address field
     */
    renderFinalUserAddress() {
        return (
            <>
                {this.state.finalUse === 'Externe' &&
                <div className="RTGE_formUnit">
                    <FormGroup controlId="rtgeForm.finalUser" className="RTGE_form-group">
                        <InputGroup className="RTGE_inputGroupStyles">
                            <div className="col-sm-1"></div>
                            <div className="col-sm-4">
                                <Message msgId="RTGE.finalUserAddress" />
                            </div>
                            <div className="col-sm-7">
                                <FormControl
                                    name="finalUserAddress"
                                    type="text"
                                    placeholder=""
                                    value={this.state.finalUserAddress}
                                    required
                                    onChange={(e) => this.handleTextFieldChange(e, 'finalUserAddress')}
                                />
                            </div>
                        </InputGroup>
                    </FormGroup>
                </div>}
            </>
        );
    }

    /**
     * renderMotivation Renders motivation field for the form
     * @memberof rtge.component
     * @returns - dom parts for the motivation field
     */
    renderMotivation() {
        return (
            <div className="RTGE_formUnit">
                <FormGroup controlId="rtgeForm.motivation" className="RTGE_form-group">
                    <InputGroup>
                        <div className="col-sm-12">
                            <Message msgId="RTGE.motivation" />
                        </div>
                        <div className="col-sm-12">
                            <FormControl
                                name="motivation"
                                componentClass="textarea"
                                placeholder=""
                                value={this.state.motivation}
                                required
                                onChange={(e) => this.handleTextFieldChange(e, 'motivation')}
                                rows={4}
                                cols={50}
                            />
                        </div>
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
            <div className="RTGE_formUnit">
                <FormGroup controlId="rtgeForm.dataSurf"  className="RTGE_form-group">
                    <div className="col-sm-4">
                        <Message msgId="RTGE.dataType" />
                    </div>
                    <div className="col-sm-8">
                        <div className="col-sm-3 RTGE_v-align">
                            <Checkbox
                                name="donneesSurface"
                                defaultChecked={this.state.dataSurf}
                                onChange={() => this.handleBooleanFieldChange('dataSurf')}
                                className="RTGE_checkbox"
                            />
                        </div>
                        <div className="col-sm-9 RTGE_notBold">
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
            <div className="RTGE_formUnit">
                <FormGroup controlId="rtgeForm.dataUnderSurf"  className="RTGE_form-group">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-8">
                        <div className="col-sm-3 RTGE_v-align">
                            <Checkbox
                                name="donneesSousSol"
                                defaultChecked={this.state.dataUnderSurf}
                                onChange={() => this.handleBooleanFieldChange('dataUnderSurf')}
                                className="RTGE_checkbox"
                            />
                        </div>
                        <div className="col-sm-9 RTGE_notBold">
                            <Message msgId="RTGE.dataUnderSurf"/>
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
    renderSchematicalNetwork() {
        return (
            <>
            {this.state.dataUnderSurf && 
            <>
            <div className="RTGE_formUnit">
                <FormGroup controlId="rtgeForm.schematicalNetwork"  className="RTGE_form-group">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-8">
                        <div className="col-sm-3 RTGE_v-align">
                            <Checkbox
                                name="ReseauxSchematiques"
                                defaultChecked={this.state.schematicalNetwork}
                                onChange={() => this.handleBooleanFieldChange('schematicalNetwork')}
                                className="RTGE_checkbox"
                                disabled={!this.state.dataUnderSurf}
                            />
                        </div>
                        <div className="col-sm-9 RTGE_notBold">
                            <Message msgId="RTGE.schematicalNetwork"/>
                            {this.state.schematicalNetwork
                                ? <div className="row RTGE_undergroundWarning text-center">
                                    <Message msgId="RTGE.schematicalNetworkWarning"/>
                                </div>
                                : ''
                            }
                        </div>
                    </div>
                </FormGroup>
            </div>
            </>}
            </>
        );
    }

    /**
     * checkFormValidity checks validity of the form
     * @memberof rtge.component
     */
    checkFormValidity() {
        this.state.mailFormValidity = this.state.prenom !== ''
        && this.state.nom !== ''
        && this.state.collectivite !== ''
        && this.state.service !== ''
        && this.state.courriel !== ''
        && (this.state.finalUse === 'Interne' || (this.state.finalUse === 'Externe' && this.state.finalUser && this.state.finalUserEMail && this.state.finalUserAddress))
        && this.state.motivation !== ''
        && (this.state.dataSurf !== false || this.state.dataUnderSurf !== false);
        this.setState(this.state);
        }

    /**
     * renderHomeTab home tab content
     * @memberof rtge.component
     * @returns - dom of the home tab content
     */
    renderHomeTab() {
        return (
            <div id="RTGE_EXTENSION RTGE_scrollBar">
                <div className="RTGE_paragraphs" dangerouslySetInnerHTML={{__html: this.props.rtge_home_text}}>
                </div>
            </div>
        );
    }

    /**
     * renderSendTab renders all the form elements in one place
     * @memberof rtge.component
     * @returns - organise the plugins form
     * onClick={(e) => {this.rtgeSendMail(e);}} disabled={!this.state.mailFormValidity}><Message msgId={'RTGE.sendTab.button'}
     */
    renderSendTab = () => {
        return (
            <div id="RTGE_EXTENSION RTGE_scrollBar">
                <Form>
                    {this.renderPrenomField()}
                    {this.renderNomField()}
                    {this.renderCollectiviteField()}
                    {this.renderService()}
                    {this.renderCourriel()}
                    {this.renderTelephone()}                    
                    {this.renderFinalUse()}
                    {this.renderFinalUser()}
                    {this.renderFinalUserEMail()}
                    {this.renderFinalUserAddress()}
                    {this.renderMotivation()}
                    {this.renderDataSurf()}
                    {this.renderDataUnderSurf()}
                    {this.renderSchematicalNetwork()}
                    {<button className="RTGE_buttonForm RTGE_label-default RTGE_buttonToRight btn btn-primary"
                       onClick={(e) => {this.rtgeSendMail(e);}}><Message msgId={'RTGE.sendTab.button'} />
                    </button>
                    }
                </Form>
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
                    <div className="col-sm-4 RTGE_left"><span>{this.props.selectedTiles.length} / {this.props.rtge_max_tiles} <Message msgId={'RTGE.selectionTab.tiles'}/></span></div>
                    <div className="col-sm-4 text-center">
                        <button className={this.props.activeSelection === 'Point'
                            ? "RTGE_selectorButton btn btn-success RTGE_tooltipMain"
                            : "RTGE_selectorButton btn btn-primary RTGE_tooltipMain"}
                        onClick={() => this.props.rtgeSwitchDraw('Point')}>
                            <Glyphicon glyph="map-marker"/>
                            <span className="RTGE_tooltipContent"><Message msgId={'RTGE.tooltips.tooltipSelectPoint'}/></span>
                        </button>
                        <button className={this.props.activeSelection === 'LineString'
                            ? "RTGE_selectorButton btn btn-success RTGE_tooltipMain"
                            : "RTGE_selectorButton btn btn-primary RTGE_tooltipMain"}
                        onClick={() => this.props.rtgeSwitchDraw('LineString')}>
                            <Glyphicon glyph="polyline"/>
                            <span className="RTGE_tooltipContent"><Message msgId={'RTGE.tooltips.tooltipSeclectLine'}/></span>
                        </button>
                        <button className={this.props.activeSelection === 'Polygon'
                            ? "RTGE_selectorButton btn btn-success RTGE_tooltipMain"
                            : "RTGE_selectorButton btn btn-primary RTGE_tooltipMain"}
                        onClick={() => this.props.rtgeSwitchDraw('Polygon')}>
                            <Glyphicon glyph="polygon"/>
                            <span className="RTGE_tooltipContent"><Message msgId={'RTGE.tooltips.tooltipSelectPolygon'}/></span>
                        </button>
                    </div>
                    <div className="col-sm-4 RTGE_right">
                        <button className={this.getSelectedRows().length === 0
                            ? "RTGE_selectorButton empty btn-active RTGE_tooltipMain"
                            : "RTGE_selectorButton btn-primary RTGE_tooltipMain"}
                        onClick={() => this.getSelectedRows().length === 0 ? '' : this.props.rtgeRemoveSelectedTiles()}>
                            <Glyphicon glyph="trash-square RTGE_trashSquare"/>
                            <span className="RTGE_tooltipContentLeft"><Message msgId={'RTGE.tooltips.tooltipTrashSquare'}/></span>
                        </button>
                        <button className={this.props.selectedTiles.length === 0
                            ? "RTGE_selectorButton empty btn-active RTGE_tooltipMain trash"
                            : "RTGE_selectorButton btn-primary RTGE_tooltipMain RTGE_trashSquare trash"}
                        onClick={() => this.props.rtgeRemoveAllTiles()}>
                            <Glyphicon glyph="trash"/>
                            <span className="RTGE_tooltipContentLeft"><Message msgId={'RTGE.tooltips.tooltipTrash'}/></span>
                        </button>
                    </div>
                </div>
                <div className="row RTGE_arrayOffset">
                    <div className="row RTGE_tableOffset RTGE_selectTitle text-center">
                        {
                            this.props.rtge_tiles_attributes.map((val) => {
                                return (
                                    <div className={val.colWidth + " RTGE_v-align RTGE_delimitor"}
                                        key={val.attribute}>
                                        <span>
                                            {val.title}
                                        </span>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div className="text-center RTGE_arrayContent">
                        {
                            this.props.selectedTiles.map((val, key) => {
                                return (
                                    <div className={val.properties.selected
                                        ? "row RTGE_arraySelected RTGE_tableOffset"
                                        : "row RTGE_tableOffset"}
                                    key={key}
                                    onClick={(e) => this.props.rtgeClickTable(val, e.ctrlKey, e.shiftKey)}>
                                        {
                                            this.props.rtge_tiles_attributes.map((attributeVal) => {
                                                return (
                                                    <div className={attributeVal.colWidth + " RTGE_RowsOffset RTGE_tooltipMain"}
                                                        key={attributeVal.attribute}>
                                                        {val.properties[attributeVal.attribute]}
                                                        <span className="RTGE_tooltipContentArray">
                                                            {val.properties[attributeVal.attribute]}
                                                        </span>
                                                    </div>
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
            <div className="row RTGE_rowTabs">
                <div className="col-sm-4 text-center">
                    <button className={this.props.activeTab === tabTypes.HOME
                        ? "RTGE_homeButton RTGE_active"
                        : "RTGE_homeButton"} onClick={() => {this.props.rtgeChangeTab(tabTypes.HOME); if(this.props.selectionGeometryType !== undefined){this.props.rtgeStopDraw()}}}>
                        <Message msgId={'RTGE.welcome'}/>
                    </button>
                </div>
                <div className="col-sm-4 text-center">
                    <button className={this.props.activeTab === tabTypes.SELECT
                        ? "RTGE_selectButton RTGE_active"
                        : "RTGE_selectButton"} onClick={() => this.props.rtgeChangeTab(tabTypes.SELECT)}>
                        <Message msgId={'RTGE.selection'}/>
                    </button>
                </div>
                <div className="col-sm-4 text-center">
                    {this.props.selectedTiles.length === 0 &&
                    <>
                        <button className="RTGE_sendButton RTGE_gray RTGE_tooltipMain">
                            <Message msgId={'RTGE.send'}/>
                            <span className="RTGE_tooltipContent"><Message msgId={'RTGE.sendBtnDisabled'}/></span>
                        </button>
                    </>
                    }
                    {this.props.selectedTiles.length > 0 &&
                        <button className={this.props.activeTab === tabTypes.SEND
                            ? "RTGE_sendButton RTGE_active"
                            : "RTGE_sendButton" } onClick={() => {this.props.rtgeChangeTab(tabTypes.SEND); if(this.props.selectionGeometryType !== undefined){this.props.rtgeStopDraw()}}}>
                            <Message msgId={'RTGE.send'}/>
                        </button>
                    }
                </div>
            </div>
        );
    }

    /**
     * renderSpinner places a spinner on waiting times
     * @memberof rtge.component
     * @returns - spinner dom content
     */
    renderSpinner(msgId) {
        return (
            <div className="RTGE_loadingContainer">
                <div className="RTGE_loading">
                    <LoadingSpinner />
                    <Message msgId={msgId} />
                </div>
            </div>
        );
    }

    /**
     * renderContent organise which tab is active
     * @memberof rtge.component
     * @returns - tab dom content
     */
    renderContent = () => {
        var content;
        switch (this.props.activeTab) {
        case tabTypes.HOME:
            content = this.renderHomeTab();
            break;
        case tabTypes.SELECT:
            content = this.renderSelectionTab();
            break;
        case tabTypes.SEND:
            if (this.props.mailRequestInProgress) {
                content = this.renderSpinner("RTGE.spinnerMsg");
            } else {
                content = this.renderSendTab();
            }
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
    render = () => {
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
                    glyph=""
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
        this.checkFormValidity();
        this.setState({
            ...this.state,
            [fieldName]: e.target.value
        })
    }

    /**
     * handleBooleanFieldChange when the booleans fields change, it updates their state
     * @memberof rtge.component
     * @param fieldName - name of the field which is to update
     * @returns - nothing
     */
    handleBooleanFieldChange(fieldName) {
        this.checkFormValidity();
        this.setState({
            ...this.state,
            [fieldName]: !this.state[fieldName]
        })
    }

    /**
     * rtgeSendMail sends the email action if all mandatory fields are not empty
     * @memberof rtge.component
     * @returns - send mail action when available or nothing
     */
    rtgeSendMail = (event) => {
        // Le preventDefault ci dessous permet de prévenir la double utilisation du bouton, ce qui recharge la page d'envoi de mail.
        event.preventDefault();
        if (this.state.prenom !== ''
        && this.state.nom !== ''
        && this.state.collectivite !== ''
        && this.state.service !== ''
        && this.state.courriel !== ''
        && (this.state.finalUse === 'Interne' || (this.state.finalUse === 'Externe' && this.state.finalUser && this.state.finalUserEMail && this.state.finalUserAddress))
        && this.state.motivation !== ''
        && (this.state.dataSurf !== false || this.state.dataUnderSurf !== false)) {
            this.props.rtgeSendMail(this.state);
        }
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
            finalUse: this.props.finalUser.type || '',
            finalUser: this.props.finalUser.name || '',
            finalUserEMail: this.props.finalUser.email || '',
            finalUserAddress: this.props.finalUser.address || '',
            motivation: this.props.user.motivation || '',
            dataSurf: !!this.props.dataSurf,
            dataUnderSurf: !!this.props.dataUnderSurf,
            schematicalNetwork: !!this.props.schematicalNetwork,
            pluginIcon: this.props.pluginIcon
        });
    }

}
