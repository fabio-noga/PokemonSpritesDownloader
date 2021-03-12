# Pokemon Sprite Downloader

Downloads all gif/png sprites (+shiny) + a lot of pokemon content from gen 5 labels from a pokemon showdown open source.

## Usage
You can initialize the program with (1) and use like (2)
```
$ npm install
$ node main.js [arguments]
```
### Arguments
```
Downloads all battle sprites:
$ node main.js sprites 

Downloads battle sprites by type of art:
$ node main.js [png|gif]  

Downloads battle sprites individually :
$ node main.js [front|back] [png|gif] [normal|shiny]  

Downloads Pokemon 32bit sprites:
$ node main.js icons
```
#### Downloads others:
```
Types labels:
$ node main.js types

Trainers:
$ node main.js trainers

Substitute:
$ node main.js other substitute
```

## TODO

- ~~Asynchronous full requests without timeout issues~~
- ~~Transform into a module type~~
- ~~Add option to download trainers and substitute~~

