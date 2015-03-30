/**
 * Created by loic on 21/03/15.
 */
$(document).ready(function(){
    $('#connect').submit(function(data) {
        var donnees = $(this).serialize();
        donnees = donnees + '&mobile=true';
        $.ajax({
            type: $(this).attr("method"),
            url: $(this).attr("action"),
            success: function(data) {

                window.location.replace('/mobile/'+data);
            },
            data: donnees
        });
        return false;
    })

    filelistm ={}

    $('#disconnect').click(function(){
        $.get("/user/disconnect",function(){
            window.location.replace('/mobile');
        })
    })

    $('body #m_files').click(function(){

        var url = $(location).attr('pathname');
        url = url.slice(url.indexOf('/') + 1).split('/');
        url.shift();

        var id = url[0];

        $.ajax({
            type: 'GET',
            url: '/user/files/'+id,
            success: function(data){
                $.mobile.navigate('#my_files');
                window.history.replaceState({},'','/mobile/files/'+id+"#my_files");
                filelistm.listing(data);
            }
        })
        return false;
    });

    filelistm.listing = function (data){

        var url = $(location).attr('pathname');
        url = url.slice(url.indexOf('/') + 1).split('/');
        url.shift();
        url.shift();
        url = url.join('/');


        var content = $('body #list_files');
        content.empty();


        var b = $('<div />').addClass('ui-field-contain');
        b.appendTo(content);

        $.each(data,function(key,value) {
            if(!(key.toString().indexOf('.') == 0)){
                var c = $('<select />').attr({'name':'select-custom-'+key
                    ,'id':key,'data-native-menu':'false'});

                c.appendTo(b);

                var d = $('<option />')
                    .html(key);

                d.appendTo(c);

                if (value.toString().indexOf('folder') != -1) {
                    console.log('lol');
                    var e = $('<option />')
                            .append(
                            $('<a />')
                                .addClass('ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-carat-r ui-btn-icon-right')
                                .attr('href','#')
                        )
                            .html('Naviguer dans ce dossier')
                    e.appendTo(c);
                }else{
                    var e = $('<option />')
                        .append(
                        $('<a />')
                            .addClass('ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-carat-r ui-btn-icon-right')
                            .attr('href', url + '/' + key)
                            .attr('download',key)
                    )
                        .html('Telecharger')
                    e.appendTo(c);

                }

                var f = $('<option />')
                    .append(
                    $('<a />')
                        .addClass('ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-carat-r ui-btn-icon-right')
                        .click(function(){
                            /*var url = $(location).attr('pathname');
                            url = url.slice(url.indexOf('/') + 1).split('/');
                            url.shift();
                            url.shift();
                            url = url.join('/');

                            var urlC = $(location).attr('pathname');
                               */

                            console.log('FUN');
                            /*$.ajax({
                             type: 'GET',
                             url: '/delete/file/'+url+'/'+test,
                             success: function(data) {
                             $.get('/user/folder/'+url+'/', function(e){
                             window.history.pushState('','',urlC);
                             filelist.listing(e);
                             })
                             }
                             })*/
                            return false;
                        })
                    )
                    .html('Supprimer')

                f.appendTo(c);
                c.selectmenu();

            }

        })




    }
})