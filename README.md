# postcss media queries packer on demand

[PostCSS] Plugin that group media queries on demand. 
This is another implementation of the [CSS MQPacker](https://github.com/hail2u/node-css-mqpacker). But the diference is that the original would pack all mediaqueries in a given code base where this one only pack what you specifically ask you to pack.

### The problem with the original CSS MQPacker

When adding CSS MQPacker existing code bases, it will change the order of all declarations, witch can cause CSS Cascading side effects.
We needed a way to disable and unable at will to not cause bugs on legacy code bases developped without MQPacker.

### Why packing média queries in the first place ?

The first argument is performances. Regroupping media queries result in a smaller compiled code.
But to be fair, GZIP is very good at minimizing this kind of repetitions, witch make this argument mostly irrelevant. 

To me the biggest benefice is about readability of code. It allow you to : 

- declare responsive variations of an element right after is declaration instaed of at the bottom of a long file

An example with SASS and BEM notation: 

```scss
.my-element {
  display: inline-block;

  @media screen and (min-width: 390px) {
    display: block;
    width: 100%;
  }
}

.my-element2 {
  width: blue;
}

.my-element3 {
  width: blue;
}
```

[PostCSS]: https://github.com/postcss/postcss

Postcss media queries packer on demand (MQPOD for short) will anaylise code in between the `/* mqp:start */` and `/* mqp:end */` comments and regroup the media queries. By default, it will regroug the MD by order of appearence in the source code and append them in place of the `/* mqp:end */` comment.

```css
/* mqp:start */
.foo {...}
@media (min-width: 320px) {
  .foo {...}
}
.bar {...}
@media (min-width: 680px) {
  .bar {...}
}
@media (min-width: 320px) {
  .bar {...}
}
@media (min-width: 1024px) {
  .bar {...}
}
/* mqp:end */
```

```css
.foo {...}
.bar {...}
@media (min-width: 320px) {
  .foo {...}
  .bar {...}
}
@media (min-width: 680px) {
  .bar {...}
}
@media (min-width: 1024px) {
  .bar {...}
}
```

## Usage

Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you already use PostCSS, add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-media-queries-packer-on-demand'),
    require('autoprefixer')
  ]
}
```

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

[official docs]: https://github.com/postcss/postcss#usage
