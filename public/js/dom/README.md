# Description

For front end javascript that interacts with the DOM.

# Strategic

 - Keep front end simple
 - Keep things modular and organized
 - Avoid using large frameworks (e.g. avoid Ember, Angular)
 - Favor "microframeworks" with straightforward apis

# Tactical

  - [Knockout](http://knockoutjs.com/documentation/introduction.html) is used for data - DOM binding where practical
  - jQuery/zepto used for:
   - Ajaxing
   - DOM stuff that Knockout doesn't control - but try to avoid using jQuery when Knockout bindings are possible
  - User facing strings (e.g. error messages), ideally should be stored as variables and not referenced as string literals to separate content and perhaps make future l10n easier
    - A common pattern used is to include a `L` object that contains all the phrases for a given area

# Todo

 - Get require.js in here to clean up dependancy management and minify/concat files for production
 - Break up the appvm knockout file a bit, in particular the "action" functions seeing as these functions don't need to live within the ModelView
 - Get some front end test coverage