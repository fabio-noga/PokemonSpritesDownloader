const request = require('request-promise')
const fs = require('fs')
const {
  join
} = require('path')
const pokemon = require('./pokedex.json')
const types=require('./types.json');
//var rimraf = require("rimraf");

const baseURL = 'https://play.pokemonshowdown.com/sprites/'

const versions = [
  { version: 'gen5ani-back', type:"normal", folder:"GifBack", format: 'gif', nameTransform: simpleCase },
  { version: 'gen5ani', type:"normal", folder:"GifFront", format: 'gif', nameTransform: simpleCase },
  { version: 'gen5ani-back-shiny', type:"shiny", folder:"GifBack", format: 'gif', nameTransform: simpleCase },
  { version: 'gen5ani-shiny', type:"shiny", folder:"GifFront", format: 'gif', nameTransform: simpleCase },
  { version: 'bwicons', type:"", folder:"PokeIcons", format: 'png', nameTransform: simpleCase },
  { version: 'types', type:"", folder:"Types", format: 'png', nameTransform: null }
]

//DeleteFolder();
init(5);

function init(type){
  if(type==5){
    DownloadOther("Types",versions[5]);
  }else DownloadPokemons(versions[type]);
}

/*function DeleteFolder(){
  try {
    deleteFolderRecursive("sprites/");
    console.log("Folder Deleted");
    fs.mkdirSync('sprites');
  } catch (err) {}
}*/

async function DownloadPokemons(config) {

    for(const entry of pokemon) {
      let name = entry.name.english;
      let number = entry.id;
      if (number < 650) {
        try {
          fs.mkdirSync('sprites/' + config.folder);
          if(config.version=='bwicons')
            downloadIcons(number,config.folder,config.version);
          else await download({name, number, config, nameTransform })
        } catch (err) {
          console.log("ERROR: " + err);
        }
      }
      // nidoran has a male and female version but the same number...
    }
}

function DownloadOther(type,config){
  switch(type){
    case "Types":
      for(const entry of types){
        requestTypes(entry,config)
      }
      break;
  }
}

function requestTypes(name,config){
  const { version, folder, format} = config
  var path = join(
    __dirname,
    `sprites/${folder}/${name}.${format}`
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

function download({name,number,config}) {
  const { version, type, folder, format, nameTransform } = config
  var path = join(
    __dirname,
    `sprites/${folder}/${simpleFilename(name,number)}.${type}.${format}`
  )
  request(`${baseURL}/${version}/${nameTransform(name)}.${format}`)
    .on('error', console.log)
    .pipe(fs.createWriteStream(path))
}

function simpleCase(name) {
  // this is the format that our baseUrl happens to use.
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

function simpleFilename(name, number) {
  var _number = Array.from(String(number))
  while (_number.length < 3) _number.unshift(0)

  _number = _number.join('')

  const _name = name
    .toLowerCase()
    .replace(' ', '-')
    .replace("'", '-')
    .replace("’", '_')
    .replace(".", '')
    .replace("♂", '_M')
    .replace("♀", '_F')
    .replace(":", '')

  return `${_number}.${_name}`
}


function deleteFolderRecursive(path) {
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
};