/**
 * Created by loic on 25/02/15.
 */
$(document).ready(OnReady);

function OnReady(){
    $('#content').hide()
        .fadeIn('slow');

    var tmp = $('body').height();
    $('#drag').height(tmp).empty();

    $('#dirForm').hide();
    $('#newDir').bind("click",function(){
        $('#dirForm').fadeIn('slow');
    })

    $('#signup').submit(function(data){
        var donnees = $(this).serialize();

        $.ajax({
            type: $(this).attr("method"),
            url: $(this).attr("action"),
            success : function(data){
                window.location.replace('/');
            },
            data: donnees
        });
        return false;
    })

    $('#dirCr').submit(function(data){
        var donnees = $(this).serialize();

        $.ajax({
            type: $(this).attr("method"),
            url: $(this).attr("action"),

            data: donnees
        });
        return false;
    })

    $('#file').click(function () {
        var addressValue = $(this).attr("href");
        var hashes = addressValue.slice(addressValue.indexOf('/') + 1).split('/');
        console.log(hashes);
        var id = hashes[hashes.length-2];
        var files =  hashes[hashes.length-1];
        var a = {
            id: id,
            file: files
        }

        $.ajax({
            type: 'GET',
            url: addressValue,

            data: a
        });
        return false;

    });


}

jQuery(function($){
    $('#drag').dropfile();
});