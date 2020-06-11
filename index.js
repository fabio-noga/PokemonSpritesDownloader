const config = require('./config/default.json');
const request = require('request-promise');
const fs = require('fs');
const { join } = require('path');
const pokemon = require('./pokedex.json')
const types=require('./types.json');

const baseURL = 'https://play.pokemonshowdown.com/sprites/';
const pokemonCount=650;

const versions = /*require('./config/versions.json') =*/ [
  { version: 'gen5ani-back', type:"normal", folder:"GifBack", format: 'gif', nameTransform: simpleCase },
  { version: 'gen5ani', type:"normal", folder:"GifFront", format: 'gif', nameTransform: simpleCase },
  { version: 'gen5ani-back-shiny', type:"shiny", folder:"GifBack", format: 'gif', nameTransform: simpleCase },
  { version: 'gen5ani-shiny', type:"shiny", folder:"GifFront", format: 'gif', nameTransform: simpleCase },
  { version: 'bwicons', type:"", folder:"PokeIcons", format: 'png', nameTransform: simpleCase },
  { version: 'types', type:"", folder:"Types", format: 'png', nameTransform: simpleCase }
]

init(process.argv[2]);
console.log(process.argv);

function init(type){
  createFolder('sprites/' + versions[type].folder);
  if(type==5){
    DownloadOther(versions[5]);
  }else DownloadPokemons(versions[type]);
}

async function DownloadPokemons(versionChosen) {
  for(const entry of pokemon) {
    let name = entry.name.english;
    let number = entry.id;

    if (number < pokemonCount) {
      try{
        if(versionChosen.version=='bwicons')
          downloadIcons(number,versionChosen.folder,versionChosen.version);
        else {
          download({name, number, versionChosen });
        }
      } catch (err) {
        console.log("ERROR: " + err);
      }
    }
  }
}

function download({name,number,versionChosen}) {
  const { version, type, folder, format } = versionChosen
  var path = join(
    __dirname,
    `sprites/${folder}/${simpleFilename(name,number)}.${type}.${format}`
  )
  request(`${baseURL}/${version}/${simpleCase(name)}.${format}`)
    .on('error', console.log)
    .pipe(fs.createWriteStream(path))
}

function DownloadOther(version){
  switch(version.folder){
    case "Types":
      for(const entry of types){
        requestTypes(entry,version)
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

function simpleFilename(name, number) {
  var _number = Array.from(String(number))
  while (_number.length < 3) _number.unshift(0)

  _number = _number.join('')

  const _name = simpleCase(name);

  return `${_number}.${_name}`
}

function createFolder(folderPath){
  try {
    fs.mkdirSync(folderPath);
    console.log("Folder '"+folderPath+"' created.");
  }catch(e){
    console.log("'"+folderPath+"' folder already created, continuing...")
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