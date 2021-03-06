const config = require('./config/config.json');
const spriteType = require('./config/spriteType.json');
const pokemon = require('./config/pokedex.json');
const types=require('./config/types.json');
const pokemonDowloader = require('./util/downloaders');
const fs = require('fs');

const pokemonCount=config.POKEMON_COUNT; //Max 649


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
  createFolder('sprites');
  switch(argv[2]){
    case'png':
      createFolder('sprites/front_png');
      createFolder('sprites/back_png');
      pokemonDowloader.sprites(collection[0], function(){
        pokemonDowloader.sprites(collection[1], function(){
          pokemonDowloader.sprites(collection[4], function(){
            pokemonDowloader.sprites(collection[5], function(){
              console.log("Done!");
            });
          });
        });
      });
      break;
    case'gif':
      createFolder('sprites/front_gif');
      createFolder('sprites/back_gif');
      pokemonDowloader.sprites(collection[2], function(){
        pokemonDowloader.sprites(collection[3], function(){
          pokemonDowloader.sprites(collection[6], function(){
            pokemonDowloader.sprites(collection[7], function(){
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
      pokemonDowloader.sprites(collection[0], function(){
        pokemonDowloader.sprites(collection[1], function(){
          pokemonDowloader.sprites(collection[2], function(){
            pokemonDowloader.sprites(collection[3], function(){
              pokemonDowloader.sprites(collection[4], function(){
                pokemonDowloader.sprites(collection[5], function(){
                  pokemonDowloader.sprites(collection[6], function(){
                    pokemonDowloader.sprites(collection[7], function(){
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
            pokemonDowloader.types(entry)
          }
          break;
        case "icons":
          for(const entry of pokemon) {
            let number = entry.id;
            if(number<=pokemonCount){
              pokemonDowloader.icons(number)
            }else break;
          }
      }

      break;
    case "front": case "back":
      if((argv[3]=="png" || argv[3]=="gif") &&
          argv[4]=="normal" || argv[4]=="shiny"){
        createFolder('sprites/'+argv[2]+"_"+argv[3]);
        pokemonDowloader.sprites({"orientation":argv[2], "animation":argv[3], "color":argv[4]});
      }
      break;
    default:
      console.log("Wrong syntax, please try again.");
  }
}


function createFolder(folderPath){
  try {
  fs.mkdirSync(folderPath);
  console.log("Folder '"+folderPath+"' created.");
  }catch(e){
  console.log("'"+folderPath+"' folder already created, continuing...");
  }
}




