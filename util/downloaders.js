const config = require('../config/config.json');
const request = require('request-promise');
const fs = require('fs');
const { join } = require('path');
const spriteType = require('../config/spriteType.json');
const pokemonNumber = require('../config/pokedex.json');
const stringUtil = require('./stringUtil');

const pokemonCount=config.POKEMON_COUNT; //Max 649
const baseURL = config.BASE_URL;
const substituteURL = config.SUBSTITUTE_URL;

const sprites = ({orientation, animation, color}, _callback) => {
    //console.log({orientation, animation, color});
    var promises=[];
    for(const entry of pokemonNumber) {
        let name = entry.name.english;
        let number = entry.id;
        if(number<=pokemonCount){
        try{
            //download({name, number, orientation, animation, color});
            const version=spriteType["battle"][orientation][animation][color];
            const folder=orientation+"_"+animation;
            var path = join(
            __dirname,
            `../sprites/${folder}/${stringUtil.simpleFileName(name,number)}.${color}.${animation}`
            )
            prom=request(`${baseURL}/${version}/${stringUtil.simpleCase(name)}.${animation}`);
            prom.on('error',console.log("Erro: "+stringUtil.simpleFileName(name,number)+" - "+err));
            prom.pipe(fs.createWriteStream(path));
            promises.push(prom);
            
        } catch (err) {
            console.log("ERROR: " + err);
        }
        }else break;
    }
    Promise.all(promises).then(function(data) {
        console.log("Done "+`${orientation} - ${animation} - ${color}`);
        try{_callback()}catch{};
    }).catch((reason) => {
        if(reason === -999) {
        console.error("Had previously handled error");
        }else {
        console.error(`Something went wrong, please try again (${reason})`);
        }
    });
}
  
const types = (name) => {
    const version = spriteType["types"]["version"];
    const format = spriteType["types"]["format"];
    var path = join(
    __dirname,
    `../sprites/types/${name}.${format}`
    )
    request(`${baseURL}/${version}/${name}.${format}`)
    .on('error', console.log)
    .pipe(fs.createWriteStream(path))
  }
  
const icons = (number) => {
    let _number=stringUtil.formatNumber(number);
    const version=spriteType.icons.version;
    const folder=spriteType.icons.folder;
    var path = join(
    __dirname,
    `../sprites/${folder}/${_number}.png`
    )
    request(`${baseURL}/${version}/${number}.png`)
    .on('error', console.log)
    .pipe(fs.createWriteStream(path))
}

const other = (thing) => {
    switch(thing){
        case "substitute":
            var path = join(
                __dirname,`../sprites/substitute.png`);
            request(`${substituteURL}/substitute.png`)
            .on('error', console.log)
            .pipe(fs.createWriteStream(path))
            break;
    }
    /*const version=spriteType.icons.version;
    const folder=spriteType.icons.folder;
    var path = join(
    __dirname,
    `../sprites/${folder}/${_number}.png`
    )
    request(`${baseURL}/${version}/${number}.png`)
    .on('error', console.log)
    .pipe(fs.createWriteStream(path))*/
}

module.exports={
    sprites,
    types,
    icons,
    other
}