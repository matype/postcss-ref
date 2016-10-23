# postcss-ref [![Build Status](https://travis-ci.org/morishitter/postcss-ref.svg)](https://travis-ci.org/morishitter/postcss-ref)

PostCSS plugin to refer properties from another rule (@ref rule)

## Spec

### Abstract

This specification defines the @ref rule, which allows an author to refer properties in another style rule.

### Using @ref rule

```
@ref = @ref <selector-name>, <reffered-proper-name>( ,<new-property-name>)
```

#### Example

```css
.foo {
  font-size: 12px;
  color: #333;
}

.bar {
  @ref .foo, font-size;
  color: #444;
}
```

## Installation

```shell
$ npm install postcss-ref
```

## How to use postcss-ref

### in Node.js

```js
// dependencies
var fs = require("fs")
var postcss = require("postcss")
var ref = require("postcss-ref")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

// process css
var output = postcss()
  .use(ref())
  .process(css)
  .css
```

## Example

Input:

```css
.foo {
  font-size: 12px;
  color: #333;
}

.bar {
  @ref .foo, font-size;
  color: #444;
}
```

Output:

```css
.foo {
  font-size: 12px;
  color: #333;
}

.bar {
  font-size: 12px;
  color: #444;
}
```

### Works well with custom properties

Input:

```css
.foo {
  --font-m: 12px;
  color: #333;
}

.bar {
  @ref .foo, --font-m, font-size;
}

```

Output:

```css
.foo {
  --font-m: 12px;
  color: #333;
}

.bar {
  font-size: var(--font-m);
}

```

## License

The MIT License (MIT)

Copyright (c) 2016 Masaaki Morishita
