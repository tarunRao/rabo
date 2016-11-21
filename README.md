# Rabobank Customer Statement Processor
http://rabobank.netlify.com/

##Information
- Built responsively to support all devices. [Bootstrap 3]
- Package manager used to handle libraries. [bower.json, package.json]
- Automation process included to compile less file [Grunt]
- Technology used - Angularjs, HTML5, CSS3

##Folder Structure
```sh
- src
  - app/
    - common/         //All common/reusable directives. Ex: header, sidebar, menu
    - component/      //Main components based on features
    - helper/         //Helper functions. Ex: services, filters
    - app.module.js
  - assets/           //All assets - images, less
  - index.html
  - bower.json
  - package.json
  - Gruntfile.js
```

##Grunt
Grunt task is added to compile all less files into css. A directory will be created in /src/assets/css.
```sh
grunt less
```
