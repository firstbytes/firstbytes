# Description

For front end javascript that interacts with the DOM.

# Strategic

 - Keep front end simple
 - Avoid using large frameworks, projects (e.g. Ember, Angular)

# Tactical

  - [Knockout](http://knockoutjs.com/documentation/introduction.html) is used for data - DOM binding where practical
  - jQuery/zepto used for:
   - Ajaxing
   - DOM stuff that Knockout doesn't control
  - [EasyModal](http://flaviusmatis.github.io/easyModal.js/) is used for modals
   - Follows the "keep it simple" theme here
  - User facing strings (e.g. error messages), ideally should be sluggified into variables or a `L` object to separate content and perhaps make future l10n easier.
