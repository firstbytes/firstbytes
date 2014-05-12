// todo require.js, etc.
var err = function(error) {
    // error.type, error.text, error.row, error.col
    var $dom = $("#error").html(error.text);
};