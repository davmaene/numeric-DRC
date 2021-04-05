'use strict'
const dt = require('./libs/dt/poligon.data').statesData; // data magna
const features = dt.features; // tab features

let _onRetSuggestion = (key) => {
    key = key.toString();
    key = key.trim();
    const fnd = [];
    const idx = key.substring(0, 2)
    features.forEach(elem => {
        let itm = elem.properties.NOM.toLowerCase()
        itm = itm.toString();
        itm = itm.trim();
        let tmp = itm.substring(0, 2);

        if(tmp === idx){
            fnd.push(itm);
        }
    })
    // console.log(fnd)
    return fnd;
}
let _onSearching = (key) =>{
    const fnd = [];
    features.forEach(elem => {
        let itm = elem.properties.NOM.toLowerCase()
        if(itm.toString() === key.toString()){ 
            fnd.push(itm);
            return; 
        }
    })
    return fnd.length > 0 
        ? fnd 
        : _onRetSuggestion(key);
      
}
const provinces = function(name = String(), options){
    if(name && typeof name === 'string'){
        let andHisPoligonePoints = false;
        let andHisTerritories = false;
        if(options){
            if(typeof options === 'object'){
                if(options.hasOwnProperty('herTerritories') || options.hasOwnProperty('hisPolygonesPoints')){
                    andHisTerritories = options.herTerritories ? true : false;
                    andHisPoligonePoints = options.hisPolygonesPoints ? true : false;
                }else{
                    return {
                        "Error " : 400,
                        "Message " : `bad kies passed to options param : Expected key : 'herTerritories' OR 'hisPolygonesPoints'`
                    }
                }
            }else{
                return {
                    "Error " : 400,
                    "Message " : `Options Parameter must be an Object : Expected key : 'herTerritories' OR 'hisPolygonesPoints'`
                }
            }
        }
        let occurences = _onSearching(name);
        let found = [];
        let defaultName = name;
        name = name.toString();
        name = name.toLowerCase();

        features.forEach(elem => {
            // SCE_SEM | MODIF | OBJECTID
            let occurence = name.localeCompare(elem.properties.NOM);
            let tempName = elem.properties.NOM.toLowerCase();

            if(tempName === name){
                delete elem.properties['SCE_SEM'];
                delete elem.properties['MODIF'];
                elem.properties['OBJECTID'];
                // elem.properties['PROVINCE'] = name;
                const fnd = {
                    "item" : elem.properties.OBJECTID,
                    "Nom" : elem.properties.NOM,
                    "ChefLieu" : elem.properties.PRINCIPALTOWN,
                    "Surface" : elem.properties.AREA,
                    "Population" : elem.properties.POPULATION
                    // "Territoires" : elem.properties.DISTRICTS
                };

                andHisPoligonePoints ? fnd['Coords'] = elem.geometry.coordinates : false;
                andHisTerritories ? fnd['Territoires'] = elem.properties.DISTRICTS : false;
                found.push(fnd);
                return true;
            }
        });
        return found.length > 0 
            ? found[0] 
            : occurences.length > 0 
            ? {
                "Error " : 404,
                "Message " : `there is no record to key : '${defaultName}' `,
                "Suggestions " : occurences
            } 
            : {
                "Error " : 404,
                "Message " : `there is no record to key : '${defaultName}' `
            };
    }else{
        return onRetAllProvinces(options)
    }
}
const onRetAllProvinces = function(options){

    let andHisPoligonePoints = false;
    let andHisTerritories = false;
    if(options){
        if(typeof options === 'object'){
            if(options.hasOwnProperty('herTerritories') || options.hasOwnProperty('hisPolygonesPoints')){
                andHisTerritories = options.herTerritories ? true : false;
                andHisPoligonePoints = options.hisPolygonesPoints ? true : false;
            }
            // herTerritories,hisPolygonesPoints
        }
    }
    let occurences = [];
    let found = [];

    features.forEach(elem => {
        // SCE_SEM | MODIF | OBJECTID
        // let occurence = name.localeCompare(elem.properties.NOM);
        // let tempName = elem.properties.NOM.toLowerCase();

            delete elem.properties['SCE_SEM'];
            delete elem.properties['MODIF'];
            elem.properties['OBJECTID'];
            // elem.properties['PROVINCE'] = name;
            const fnd = {
                "item" : elem.properties.OBJECTID,
                "Nom" : elem.properties.NOM,
                "ChefLieu" : elem.properties.PRINCIPALTOWN,
                "Surface" : elem.properties.AREA,
                "Population" : elem.properties.POPULATION
                // "Territoires" : elem.properties.DISTRICTS
            };

            andHisPoligonePoints ? fnd['Coords'] = elem.geometry.coordinates : false;
            andHisTerritories ? fnd['Territoires'] = elem.properties.DISTRICTS : false;
            found.push(fnd);
            // return true;
    });
    return found.length > 0 
        ? found
        : occurences.length > 0 
        ? occurences : {
            "Error " : 404,
            "Message " : `there is no record `
        };
}
// const provinces = onRetProvinceByName();
// exports.getProvinceByName = onRetProvinceByName
exports.main = {
    provinces
}

