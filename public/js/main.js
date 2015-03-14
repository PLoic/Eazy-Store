/**
 * Created by loic on 25/02/15.
 */
$(document).ready(OnReady);

function OnReady(){
    $('#content').hide()
        .fadeIn('slow');


    $('#acceuil').click(function(){
        window.location.replace('/');
    })

    var tmp = $('#file_li').height();
    $('#drag').height(tmp).empty();


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

    function listing(data){
        /**
         * Traitement de l'URL
         * @type {*|jQuery}
         */
        var url = $(location).attr('pathname');
        url = url.slice(url.indexOf('/') + 1).split('/');
        url.shift();
        url.shift();
        url = url.join('/');

        /**
         * Création de la liste de fichier
         */
        $('#content').empty();
        var a = $('#content');

        var f = $('<div />')
                        .attr('class','panel panel-default')
                        .append(
                                $('<div />')
                                    .attr('class','panel-body')
                                    .attr('id','filesM')
                                    .text('Vos fichier :')
                                    .append(
                                                $('<button />')
                                                        .attr('type','button')
                                                        .attr('class','btn btn-default pull-right')
                                                        .attr('id','newDir')
                                                        .text('Nouveau dossier')
                                                        .click(function(){
                                                            $('#dirForm').slideToggle('slow');
                                                        }),
                                                $('<div />')
                                                    .attr('id','dirForm')
                                                    .append(
                                                                $('<form />')
                                                                    .attr('role',"form")
                                                                    .attr('method',"post")
                                                                    .attr('action','/')
                                                                    .attr('class','col-lg-offset-4 col-lg-4')
                                                                    .attr('id','dirCr')
                                                                    .append(
                                                                            $('<div />')
                                                                                .attr('class','form-group')
                                                                                .append(
                                                                                $('<label />').attr('role','name').text('Nom du dossier:'),
                                                                                $('<input />')
                                                                                    .attr('id','name')
                                                                                    .attr('name','name')
                                                                                    .attr('class','form-control')
                                                                                    .attr('type','text')

                                                                                ),
                                                                            $('<button />')
                                                                                .attr('type','submit')
                                                                                .attr('class','btn btn-default')
                                                                                .text('Soumettre')
                                                                    )
                                                        )
                                                    .hide()

                                            )
                        )


        f.appendTo(a);
        var b =  $('<ul />')
                        .attr('id','my_list')
                        .attr('class','list-group col-lg-8');

        b.appendTo(a);
        $.each(data,function(key,value) {
            if (!(key.toString().indexOf('.') == 0)) {
                var c = $('<li />').attr('class', 'list-group-item')
                var d = $('<i />').attr('class', 'fa ' + value + '  fa-fw');
                d.appendTo(c);
                c.append(key);
                c.appendTo(b);

                var f = $('<a />').attr('href', '/delete/' + url);
                if (value.toString().indexOf('folder') != -1) {
                    var e = $('<a />')
                        .attr('href', '/user/folder/' + url +'/'+key)
                        .attr('id', 'folder')
                        .append(
                        $('<i />')
                            .attr('class', 'fa fa-arrow-right pull-right')
                    );
                    e.appendTo(c);
                } else {
                    var e = $('<a />')
                        .attr('href', url + '/' + key)
                        .attr('download', key)
                        .append(
                        $('<i />')
                            .attr('class', 'fa fa-download pull-right')
                    );
                    e.appendTo(c);
                }

            }
        })
    }

    /**
     * Appel AJAX lors de l'affichage des fichier perso
     */
    $('#my_files').click(function(){
        var id = $(this).attr('href');

        $.ajax({
            type: 'GET',
            url: '/user/files/'+id,
            success: function(data){
               window.history.pushState('','','/user/files/'+id);
               listing(data);
            }
        })
        return false;
    });

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
            },

            success:function(){
                location.reload();
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
            type: 'GET',
            url: data,
            data: { path: data},
            success : function(data2){
                window.history.pushState('','',data);
                $('body').empty()
                            .html(data2);
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