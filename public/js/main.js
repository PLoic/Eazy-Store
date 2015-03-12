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
        var name = $('#name').val();

        var path = $(location).attr('pathname')
        path = path.slice(path.indexOf('/') + 1).split('/');
        console.log(path);
        path.shift();
        path.shift();
        console.log(path);
        var opt = path.join('/');
        console.log(opt);

        $.ajax({
            type: $(this).attr("method"),
            url: $(this).attr("action"),

            data: {
                path: opt, name: name
            }
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

    $('#folder').click(function(){
        var data = $(this).attr("href");
        console.log(data);
        $.ajax({
            type: 'POST',
            url: data,
            data: { path: data},
            success : function(data2){
                window.location.replace(data);
            }
        });
        return false;
    })

    $('#return').click(function(){
        var data = $(location).attr('pathname');
        var hashes = data.slice(data.indexOf('/') + 1).split('/');

       var options = hashes.slice(3,hashes.length);

        if(options.length == 1){
            hashes[1] = 'files'
            delete hashes[hashes.length-1];
            var url = hashes.join('/');
            url = '/'+url;
            console.log(url);
            $.ajax({
                type: 'GET',
                url: url,
                success : function(data){
                    window.location.replace(url);
                }
            });
            return false;
        }else{
        }



    })


}

jQuery(function($){
    $('#drag').dropfile();
});