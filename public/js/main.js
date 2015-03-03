/**
 * Created by loic on 25/02/15.
 */
$(document).ready(OnReady);

function OnReady(){
    $('#content').hide()
        .fadeIn('slow');

    var tmp = $('body').height();
    $('#drag').height(tmp).empty();


}

jQuery(function($){
    $('#drag').dropfile();
});