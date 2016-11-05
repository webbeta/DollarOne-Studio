# DollarOne-Studio [WIP]

Project for creating a collection of shapes and test them with $1 Unistroke Recognizer (http://depts.washington.edu/aimgroup/proj/dollar/index.html)

The goals of this project are:
* Have the possibility to generate an exportable database of shapes.
* Test all project shapes separately or all at the same time.
* Export all project shapes separately or all at the same time, to different $1 libraries (languages). (**only c++ implementation for now**)

**Advise:** that's an internal tool we use as a supporting feature for some of our projects, so the code was writen fast and it's not clean/optimized at all... so don't hold it against us :)

<img src="https://github.com/webetes/DollarOne-Studio/blob/master/art/screenshot.png?raw=true" width="800px" />

---

## Libraries

We've used following libraries to make this project:

* Everybody knows: [Gulp](http://gulpjs.com/), [Bower](https://bower.io/), [Express](http://expressjs.com/), [AngularJS](https://angularjs.org/), [UI Bootstrap](https://angular-ui.github.io/bootstrap/), [Bootstrap SASS](http://getbootstrap.com/css/#sass). 
* $1 Unistroke Recognizer: http://depts.washington.edu/aimgroup/proj/dollar/index.html
* ng-notify: https://github.com/matowens/ng-notify
* Paper.js: http://paperjs.org/
* slug: https://github.com/dodo/node-slug
* twig.js: https://github.com/twigjs/twig.js 
 
---

## Install

* Copy ```config.dist.json``` to ```config.json``` and customize it as you like.
* Then run the following:

```
npm install
gulp bower
gulp server
```

The ```gulp server``` command would prompt the url address to visit the web app.

---

## Authors

* Moisés Gramary ([mowcixo](https://github.com/mowcixo))

---

# [LICENSE](/LICENSE)

MIT License

Copyright (c) 2016 webBeta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.