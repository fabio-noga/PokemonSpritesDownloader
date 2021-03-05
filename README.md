# Pokemon Sprite Downloader

Downloads all gif/png sprites (+shiny) + Icons + Type labels from a well known website

## Usage

```
$ npm install
$ node index.js [arguments]

Downloads all battle sprites:
$ node index.js all  

Downloads battle sprites by type of art:
$ node index.js [png|gif]  

Downloads battle sprites individually :
$ node index.js [front|back] [png|gif] [normal|shiny]  

Downloads Types labels:
$ node index.js types

Downloads Pokemon 32bit sprites:
$ node index.js icons
```

### TODO

```
~~Asynchronous full requests without timeout issues~~
Transform into a module type
```
