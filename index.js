const config = require('./config/default.json');
const spriteType = require('./config/spriteType.json');
const request = require('request-promise');
const fs = require('fs');
const { join } = require('path');
const pokemon = require('./pokedex.json')
const types=require('./types.json');

const baseURL = 'https://play.pokemonshowdown.com/sprites/';
const pokemonCount=650;

init(process.argv);

/**
 * Initializes the program
 * @param {*} argv All the command line's arguments
 */
function init(argv){
  switch(argv[2]){
    case "icons":case "types":
      createFolder('sprites/'+argv[2]);
      DownloadOther(argv[2]);
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

/**
 * Prepares to download the battle sprites for each pokemon
 * @param {*} param0 {front|back, png|gif, normal|shiny}
 */
async function DownloadPokemons({orientation, animation, color}) {
  for(const entry of pokemon) {
    let name = entry.name.english;
    let number = entry.id;
    if(number<pokemonCount){
      try{
        download({name, number, orientation, animation, color});
      } catch (err) {
        console.log("ERROR: " + err);
      }
    }
  }
}

/**
 * Downloads the battle sprites for each pokemon
 * @param {*} param0 {name, number, front|back, png|gif, normal|shiny}
 */
function download({name, number, orientation, animation, color}) {
  const version=spriteType["battle"][orientation][animation][color];
  const folder=orientation+"_"+animation;
  var path = join(
    __dirname,
    `sprites/${folder}/${simpleFilename(name,number)}.${color}.${animation}`
  )
  request(`${baseURL}/${version}/${simpleCase(name)}.${animation}`)
    .on('error', console.log)
    .pipe(fs.createWriteStream(path))
}

/**
 * Prepares to download any other type of sprite
 * @param {*} type of sprite
 */
function DownloadOther(type){
  switch(type.folder){
    case "types":
      for(const entry of types){
        downloadTypes(entry)
      }
      break;
    case "icons":
  }
}

/**
 * Downloads the pokemon's type's labels
 * @param {*} name of the label
 */
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

function downloadIcons(number,folder,version) {
  let i=0;
  for (i;i!=number;i++);

  var path = join(
    __dirname,
    `sprites/${folder}/${i}.png`
  )

  request(`${baseURL}/${version}/${i}.png`)
    .on('error', console.log)
    .pipe(fs.createWriteStream(path))
}

/**
 * Simplifies the pokemon name
 * @param {*} name of the pokemon
 */
function simpleCase(name) {
  return name
    .toLowerCase()
    .replace(' ', '')
    .replace("’", '')
    .replace("-", '')
    .replace("'", '')
    .replace(".", '')
    .replace("é", 'e')
    .replace("♂", 'm')
    .replace("♀", 'f')
    .replace(":", '')
    .replace(/female$/, 'f')
    .replace(/male$/, 'm')
}

/**
 * Returns number.name format
 * @param {*} name of the pokemon
 * @param {*} number of the pokemon
 */
function simpleFilename(name, number) {
  var _number = Array.from(String(number))
  while (_number.length < 3) _number.unshift(0);
  _number = _number.join('');
  const _name = simpleCase(name);
  return `${_number}.${_name}`;
}

/**
 * Creates folder from path
 * @param {*} folderPath 
 */
function createFolder(folderPath){
  try {
    fs.mkdirSync(folderPath);
    console.log("Folder '"+folderPath+"' created.");
  }catch(e){
    console.log("'"+folderPath+"' folder already created, continuing...");
  }
}

/*function DeleteFolder(){
  try {
    deleteFolderRecursive("sprites/");
    console.log("Folder Deleted");
    fs.mkdirSync('sprites');
  } catch (err) {}
}*/

/*function deleteFolderRecursive(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};*/