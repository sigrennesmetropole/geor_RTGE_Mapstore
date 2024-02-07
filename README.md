[Version française](https://github.com/sigrennesmetropole/geor_RTGE_Mapstore/docs/readme-git_geor_RTGE_FR.pdf)

[[_TOC_]]

## I - General Information

![Presentation image of RTGE](docs/images/RTGE_Documentation_home.png "Welcome inside RTGE Plugin for MapStore")

This MapStore2 plugin enables you to request data extraction from a grid layer. This involves selecting the tiles that cover the geographical area, filling out a form and sending an email to the department responsible for extracting the data.
At Rennes Métropole, this plugin is used to manage extractions of RTGE (Référentiel Topographique très Grande Échelle) data in DXF format.


## II - Using this repository
**II.1 - Repository Organization**

This repository is meant to be used with the geor_MapstoreExtension repository:
- This repository (geor_RTGE_Mapstore) contains the JS code of the plugin
- The geor_MapstoreExtension repository contains the configurations files of the plugin (configs and translations)
The "Main" branch is used for the development of the plugin. For each release of the plugin, a new branch is created. The release note will specify the mapstore2-georchestra version for which the plugin version has been created.
The settings files for each plugin release are located in the RM/RTGE_v.NumVersion branch of the geor_MapstoreExtension repository.

**II.2 - Using the repository**
II.2.1 - Setting up the repository

To deploy this repository locally, the follow the steps below:
`git clone --recursive https://github.com/sigrennesmetropole/geor_pluginsRM_mapstore/ geor_MapstoreExtension`
Select the desired branch: 
`git checkout RM/RTGE_v.NumVersion`
Where VersionNum is the desired release number. 
Then install the dependencies:
NodeJS >= 12.16.1 is needed
```
-	npm i
-	cd MapStore2
-	npm i
-	cd ../mapstore2-georchestra
-	npm i
-	npm fe:start
```
The application runs at http://localhost:8081 afterwards.

II.2.2 - Settings

Proxies are managed in ./proxyConfig.js file.
Locales are managed in ./assets/translations/data.lang-LANG.json
Build configuration for local use is managed in ./configs/localConfig.json
Configuration for production build is managed in ./assets/index.json

**II.3 - Plugin deployment**

This project allows the creation of a zip file that can be added in your Mapstore2 for geOrchestra environment. This file can be generated using the CI/CD or manually:

II.3.1 - CI/CD

The project CI/CD uses the geor_MapstoreExtension CI/CD file which generates the steps of the continuous integration process. It is important to provide it with the correct project link in order to reach an instance of geor_MapstoreExtension with the correct branch (in our case RM/RTGE_v.NumVersion) in order to retrieve the correct submodule from the geor_MapstoreExtension directory. The submodule in js/extension corresponds to the corresponding plugin's version.
The steps of the process are automatic and described in the CI files. This process can be described as follows: the plugin calls geor_MapstoreExtension, which generates a build of the plugin and deploys it in a remote repository. This repository has to be set up in the .gitlab-ci.yml of geor_MapstoreExtension ("publish" section). These steps can be modified according to the architecture of your system.


II.3.2 - Manual deployment

To manually starts the build of the plugin, you need to run the following command from the root directory of the project:
`npm run ext:build`
A .zip file is created with the name of the extension in the 'dist' folder.

## III - Installing and configuring the plugin
**III.1 - Installing the plugin**

This plugin is a MapstoreExtension. To install it, simply go to the mapstore map context management interface and click on the "Add an extension to Mapstore" button in the plugin configuration interface to add the plugin using its .zip file.

**III.2 - Configuring the plugin**

![Plugin Installation Interface](docs/images/RTGE_Documentation_3_2.png "Plugin Installation Interface")

When the plugin is added to a MapStore context for geOrchestra, it needs to be configured to work correctly. These configuration parameters are:

| Parameter Name | Default Value | Description |
| ---      | ---      | ---      |
| rtgeBackendURLPrefix | "" | Link to the back-end used by the plugin. This plugin currently works without a backend. |
| rtgeGridLayerId | "ref_topo:rtge_carroyage" | ID, in the map context, of the grid layer used to select data extraction zones. |
| rtgeGridLayerName | "ref_topo:rtge_carroyage" | Name, in the map context, of the grid layer used to select data extraction zones. |
| rtgeGridLayerTitle | "RTGE : Carroyage au 1/200" | Title, in the map context, gaved to the grid layer used to select the data extraction zones. |
| rtgeGridLayerProjection | "EPSG:3948" | EPSG code of the native projection system used by the grid layer. |
| rtgeGridLayerGeometryAttribute | "shape" | Name of the attribute of the grid layer containing the tile geometry. |
| rtgeEmailUrl | "/console/emailProxy" | Link to the SMTP server to use. |
| rtgeUserDetailsUrl | /console/account/userdetails | Link to retrieve the logged-in user's information to pre-fill the form. |
| rtgeUserRolesUrl | /mapstore/rest/geostore/users/user/details?includeattributes=true | Link to retrieve the logged-in user's role information to check their rights to view restricted data. |
| rtgeHomeText | "" | Text (HTML) that is displayed on the home tab of the RTGE plugin. |
| rtgeMailRecipients | "" | List containing the email addresses of the recipients of the data extraction request in text format. These addresses must first be added to the emailProxyRecipientWhitelist whitelist in the geOrchestra console.properties file. |
| RtgeMailSubject | "" | Body text of the email to be sent. It will contain the variables replaced by the values in the form:<br>-{{first_name}}<br>-{{last_name}}<br>-{{email}}<br>-{{tel}}<br>-{{service}} <br>-{{company}}<br>-{{aboveground}}<br>-{{underground}}<br>-{{undergroundDataIsRequired}}<br>-{{schematicalnetwork}}<br>-{{comments}} |
| rtgeMailSubject | "" | Subject of the email sent. Can contain the number of tiles selected: {{count}} |
| rtgeMaxTiles | "50" | Maximum number of tiles that can be selected. |
| rtgeTileIdAttribute | "id_case" | Name of the attribute field containing the tiles Ids. These ids are sent as a text list in the extraction request email. |
| rtgeTilesAttributes | [{"attribute": "id","title":"Identifiant","colWidth": "col-sm-5"},{"attribute":"date ","title": "Date MAJ","colWidth":"col-sm-3"}] | List of attributes that will be displayed in the table of selected tiles. For each attribute :<br>-	Attribute : name of the attribute to display<br>-	Title : alias to be displayed in the column header<br>-	colWidth : column width value in the form "col-sm-X" where X is the desired width value.<br>It is recommended that the sum of the column width values does not exceed 12.|
| rtgeUndergroundDataRoles | "EL_APPLIS_RMTR_SSOL" | Name of the user role authorised to view restricted data. |

The plugin is optimised for use in a map context using the EPSG:3857 projection system, and has been tested in an environment using the EPSG:3948 projection system.
