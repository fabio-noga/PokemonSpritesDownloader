//import { DownloadPokemons } from './util/downloaders'

const request = require('request-promise');
const fs = require('fs');
const { join } = require('path');
const config = require('./config/config.json');
const spriteType = require('./config/spriteType.json');
const pokemon = require('./config/pokedex.json')
const types=require('./config/types.json');
//const { DownloadPokemons } = require('./util/downloaders');

const baseURL = config.BASE_URL
const pokemonCount=config.POKEMON_COUNT; //Max 649
const decimalCases=config.DECIMAL_CASES;

let collection= [
  { orientation: 'front', animation: 'png', color: 'normal' },
  { orientation: 'front', animation: 'png', color: 'shiny' },
  { orientation: 'front', animation: 'gif', color: 'normal' },
  { orientation: 'front', animation: 'gif', color: 'shiny' },
  { orientation: 'back', animation: 'png', color: 'normal' },
  { orientation: 'back', animation: 'png', color: 'shiny' },
  { orientation: 'back', animation: 'gif', color: 'normal' },
  { orientation: 'back', animation: 'gif', color: 'shiny' }];

 

/**
 * Initializes the program
 * @param {*} argv All the command line's arguments
 */
init(process.argv);
async function init(argv){
  switch(argv[2]){
    case'gif':
      createFolder('sprites/front_gif');
      createFolder('sprites/back_gif');
      DownloadPokemons(collection[2], function(){
        DownloadPokemons(collection[3], function(){
          DownloadPokemons(collection[6], function(){
            DownloadPokemons(collection[7], function(){
              console.log("Done!");
            });
          });
        });
      });
      break;
    case'png':
      createFolder('sprites/front_png');
      createFolder('sprites/back_png');
      DownloadPokemons(collection[0], function(){
        DownloadPokemons(collection[1], function(){
          DownloadPokemons(collection[4], function(){
            DownloadPokemons(collection[5], function(){
              console.log("Done!");
            });
          });
        });
      });
      break;
    case'sprites':
      createFolder('sprites/front_png');
      createFolder('sprites/back_png');
      createFolder('sprites/front_gif');
      createFolder('sprites/back_gif');
      DownloadPokemons(collection[0], function(){
        DownloadPokemons(collection[1], function(){
          DownloadPokemons(collection[2], function(){
            DownloadPokemons(collection[3], function(){
              DownloadPokemons(collection[4], function(){
                DownloadPokemons(collection[5], function(){
                  DownloadPokemons(collection[6], function(){
                    DownloadPokemons(collection[7], function(){
                      console.log("Done!");
                    });
                  });
                });
              });
            });
          });
        });
      });
      
      break;
    case "icons":case "types":
      createFolder('sprites/'+spriteType[argv[2]].folder);
      let type=argv[2];
      switch(type){
        case "types":
          for(const entry of types){
            downloadTypes(entry)
          }
          break;
        case "icons":
          for(const entry of pokemon) {
            let number = entry.id;
            if(number<=pokemonCount){
              downloadIcons(number)
            }else break;
          }
      }

      break;
    case "front": case "back":
      if((argv[3]=="png" || argv[3]=="gif") &&
          argv[4]=="normal" || argv[4]=="shiny"){
        createFolder('sprites/'+argv[2]+"_"+argv[3]);
        DownloadPokemons({"orientation":argv[2], "animation":argv[3], "color":argv[4]});
      }
      break;
    default:
      console.log("Wrong syntax, please try again.");
  }
}

function DownloadPokemons({orientation, animation, color}, _callback) {
  //console.log({orientation, animation, color});
  var promises=[];
  for(const entry of pokemon) {
      let name = entry.name.english;
      let number = entry.id;
      if(number<=pokemonCount){
      try{
          //download({name, number, orientation, animation, color});
          const version=spriteType["battle"][orientation][animation][color];
          const folder=orientation+"_"+animation;
          var path = join(
          __dirname,
          `sprites/${folder}/${simpleFilename(name,number)}.${color}.${animation}`
          )
          try{
          prom=request(`${baseURL}/${version}/${simpleCase(name)}.${animation}`);
          prom.pipe(fs.createWriteStream(path));
          promises.push(prom);
          }catch{console.log("Erro: "+simpleFilename(name,number))};
          
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
function downloadTypes(name){
  const version = spriteType["types"]["version"];
  const format = spriteType["types"]["format"];
  var path = join(
  __dirname,
  `sprites/types/${name}.${format}`
  )
  request(`${baseURL}/${version}/${name}.${format}`)
  .on('error', console.log)
  .pipe(fs.createWriteStream(path))
}
function downloadIcons(number) {
  let _number=formatNumber(number);
  const version=spriteType.icons.version;
  const folder=spriteType.icons.folder;
  var path = join(
  __dirname,
  `sprites/${folder}/${_number}.png`
  )
  request(`${baseURL}/${version}/${number}.png`)
  .on('error', console.log)
  .pipe(fs.createWriteStream(path))
}

function simpleFilename(name, number) {
  number=formatNumber(number);
  const _name = simpleCase(name);
  return `${number}.${_name}`;
}

function simpleCase(name) {
  return name
    .toLowerCase()
    .replace("é", 'e')
    .replace(/[',’\-:]/, '')
    .replace(' ','')
    .replace('.','')
    .replace("♂", 'm')
    .replace("♀", 'f')
    .replace(/female$/, 'f')
    .replace(/male$/, 'm');
}

function createFolder(folderPath){
  try {
  fs.mkdirSync(folderPath);
  console.log("Folder '"+folderPath+"' created.");
  }catch(e){
  console.log("'"+folderPath+"' folder already created, continuing...");
  }
}

function formatNumber(number){
  var _number = Array.from(String(number))
  while (_number.length < decimalCases) _number.unshift(0);
  return _number.join('');
}


