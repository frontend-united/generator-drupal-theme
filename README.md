# Drupal Theme Generator 

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] ![License MIT][license-image] [![Downloads][downloads-image]][npm-url]

> [Yeoman](http://yeoman.io) generator

```
=============================================================
||      _____                         _                    ||
||     |  __ \                       | |                   ||
||     | |  | |_ __ _   _ _ __   __ _| |                   ||
||     | |  | | '__| | | | '_ \ / _` | |                   ||
||     | |__| | |  | |_| | |_) | (_| | |                   ||
||     |_____/|_|   \__,_| .__/ \__,_|_|                   ||
||     |__   __| |       | |                               ||
||        | |  | |__   __|_| __ ___   ___                  ||
||        | |  | '_ \ / _ \ '_ ` _ \ / _ \                 ||
||        | |  | | | |  __/ | | | | |  __/                 ||
||       _|_|_ |_| |_|\___|_| |_| |_|\___|                 ||
||      / ____|                         | |                ||
||     | |  __  ___ _ __   ___ _ __ __ _| |_ ___  _ __     ||
||     | | |_ |/ _ \ '_ \ / _ \ '__/ _` | __/ _ \| '__|    ||
||     | |__| |  __/ | | |  __/ | | (_| | || (_) | |       ||
||      \_____|\___|_| |_|\___|_|  \__,_|\__\___/|_|       ||
=============================================================
```


## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```bash
$ npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-drupal-theme from npm, run:

```bash
$ npm install -g generator-drupal-theme
```

Finally, initiate the generator:

```bash
$ yo drupal-theme
```

### Creating a Sub Theme

This Yeoman generator allows you to create a sub-theme of any Drupal base theme. When you initiate the generator, it will ask you which Drupal base theme you would like to use. There are several packed with this, some of which will give you their own special code when you create a sub-theme. You can also specify any other base theme of your choice, by selecting "custom".

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


## License

MIT


[travis-url]: https://travis-ci.org/frontend-united/generator-drupal-theme
[travis-image]: http://img.shields.io/travis/frontend-united/generator-drupal-theme.svg

[downloads-image]: http://img.shields.io/npm/dm/generator-drupal-theme.svg
[npm-url]: https://npmjs.org/package/generator-drupal-theme
[npm-image]: http://img.shields.io/npm/v/generator-drupal-theme.svg

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg

