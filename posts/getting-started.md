----
title: index
display: icoDoc
icon: home
date: 0
----
A theme for the [Cabin](https://github.com/colinwren/cabin) static site generator.

This theme is used to build project documentation sites. It is great for use on GitHub or for internal projects within a company.

# Usage

## Setup

Before using icoDoc, make sure you have Cabin installed:
```bash
npm install -g cabin
```

Then run the following command to scaffold out a site generator using this theme:
```bash
cabin new docs ChrisWren/icoDoc
```

After scaffolding a site generator, you can run it by entering the following command in the `docs` folder:
```bash
grunt server
```

# What's included

## IcoMoon
This theme uses [IcoMoon's icon fonts](http://icomoon.io/) when creating icon menu links. To use different icons in your project, select icons in the [IcoMoon app](http://icomoon.io/app/), then click fonts and download the fonts and css into the `src/styles` folder.

## Post API

Here are the following post properties used by this theme:

### Required:

#### title
Type: `String`

This is the title of the post which is used in the url, document title, and the header of the generated documentation page.

### Optional:

#### display
Type: `String`

This property optionally overrides the `title` so that the document title and header are different from the url. This is useful in overriding the root post which has the title `index` as you will likely want to display something like `Home` instead. 

#### icon
Type: `String`

This is the class suffix of the icon to use in the navigation. For example, if I specified `icon: home`, the navigation would use the IcoMoon class `icon-home` when rendering the icon-font navigation link to the post.  
