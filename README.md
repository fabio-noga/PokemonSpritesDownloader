# Pokemon Sprite Downloader

Downloads all gif/png sprites (+shiny) + Icons + Type labels from a well known website

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

Downloads Types labels:
$ node main.js types

Downloads Pokemon 32bit sprites:
$ node main.js icons

Downloads others:
Substitute:
$ node main.js other substitute
```

## TODO

- ~~Asynchronous full requests without timeout issues~~
- ~~Transform into a module type~~
- Clean config files to a monolithic one
- Add option to download trainers, items and substitute

