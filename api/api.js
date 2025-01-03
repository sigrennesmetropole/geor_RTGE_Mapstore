import axios from '@mapstore/libs/ajax';

var rtgeAPIURL;

export const setAPIURL = (backendURL) => {
    rtgeAPIURL = backendURL;
};

export function getHealth(){
    var slug = `${rtgeAPIURL}` + "/healthCheck";
    return axios.get(slug).then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error;
    });
}

export function postNewRequest(datas){
    var slug = `${rtgeAPIURL}`+ "/new-request";

    //formattage du data en texte brut
    var rawData = '';
    if (datas[0]) {
        var tiles = datas[0].split(',');
        tiles.forEach(tile => { 
            rawData = rawData + "&cases=" + tile; 
        }); 
    }
    if (datas[1]) {
        rawData = rawData + "&prenom=" + datas[1];
    }
    if (datas[2]) {
        rawData = rawData + "&nom=" + datas[2];
    }
    if (datas[3]) {
        rawData = rawData + "&collectivite=" + datas[3];
    }
    if (datas[4]) {
        rawData = rawData + "&service=" + datas[4];
    }
    if (datas[5]) {
        rawData = rawData + "&courriel=" + datas[5];
    }
    if (datas[6]) {
        rawData = rawData + "&telephone=" + datas[6];
    }
    if (datas[7]) {
        rawData = rawData + "&motivation=" + datas[7];
    }
    if (datas[8]) {
        rawData = rawData + "&donnees_surface=" + datas[8];
    }
    if (datas[9]) {
        rawData = rawData + "&donnees_sous_sol=" + datas[9];
    }
    if (datas[10]) {
        rawData = rawData + "&donnees_schematique=" + datas[10];
    }
    if (datas[11]) {
        rawData = rawData + "&utilisation_finale=" + datas[11];
    }
    if (datas[12]) {
        rawData = rawData + "&utilisateur_final=" + datas[12];
    }
    if (datas[13]) {
        rawData = rawData + "&utilisateur_courriel_final=" + datas[13];
    }
    if (datas[14]) {
        rawData = rawData + "&utilisateur_postal_final=" + datas[14];
    }

    return axios.post(slug, rawData).then(function (response) {
        return response;
    })
    .catch(function (error) {
        return error;
    });
}