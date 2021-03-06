/**
 * Created by loic on 25/02/15.
 */
$(document).ready(OnReady);

var filelist = {};

function OnReady(){

    function disablerefresh(e) {
        if (((e.which || e.keyCode) == 116) || (e.keyCode == 82 && e.ctrlKey) || (e.keyCode == 82 && e.metaKey) ){
            e.preventDefault();
        }

    };

    $(document).on("keydown", disablerefresh);



    $('#content').hide()
        .fadeIn('slow');


    $('#acceuil').click(function(){
        window.location.replace('/');
    })



    $('#signup').submit(function(data) {
        var donnees = $(this).serialize();

        $.ajax({
            type: $(this).attr("method"),
            url: $(this).attr("action"),
            success: function(data) {
                window.location.replace('/');
            },
            data: donnees
        });
        return false;
    })

    $('#signin').submit(function(data) {
        var donnees = $(this).serialize();
        donnees = donnees + '&mobile=false';
        $.ajax({
            type: $(this).attr("method"),
            url: $(this).attr("action"),
            success: function(data) {
                window.location.replace('/');
            },
            data: donnees
        });
        return false;
    })

    filelist.newDir = function(path){

        return $('<div />')
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
                                        .attr('action','/file/create')
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
                                                    .attr('id','creat')
                                                    .attr('class','btn btn-default')
                                                    .text('Soumettre'),
                                                $('<div />')
                                                    .attr('id','infos_dir')
                                                    .addClass('panel panel-warning')
                                                    .append(
                                                    $('<div />')
                                                        .addClass('panel-body')
                                                        .text('Les noms de fichier ne doivent comporter des /')

                                                ).hide()
                                        ).submit(function(e) {
                                            e.preventDefault();
                                            var name = $('#name').val();

                                            var path = $(location).attr('pathname')
                                            path = path.slice(path.indexOf('/') + 1).split('/');
                                            console.log(path);
                                            path.shift();
                                            path.shift();
                                            console.log(path);
                                            var opt = path.join('/');
                                             $.ajax({
                                                 type: $(this).attr("method"),
                                                 url: $(this).attr("action"),
                                                 data: {
                                                     path: opt,
                                                     name: name
                                                     },
                                                 success: function() {
                                                     $.get('/user/folder/'+opt+'/', function(e){
                                                         filelist.listing(e);
                                                     })
                                                 }
                                             });
                                            return false;
                                        })
                                )
                            .hide()

                    )
                )

    }

    $(document).on("keydown",'#name',function(e){
        console.log(e.keyCode);
        if(e.keyCode == 58){
            $('body #creat').fadeOut('fast');
            $('body #infos_dir').fadeIn('fast');
        }
        else if(e.keyCode != 58 && $(this).val().indexOf('/') == -1){
            if($('body #creat').css('display') == "none"){
                $('body #creat').fadeIn('fast');
                $('body #infos_dir').fadeOut('fast');
            }
        }
    })
    filelist.dragArea = function(size){
        console.log(size);
        return $('<div />')
                    .attr('id','drag')
                    .attr('class','panel panel-default col-lg-4')
                    .append(
                            $('<div />')
                                .attr('class','panel-body')
                    )
                    .text(' Panel content')

                    .height(size).empty();
    }

    filelist.arianne = function(){
        var url = $(location).attr('pathname');
        url = url.slice(url.indexOf('/') + 1).split('/');
        url.shift();
        url.shift();


        var a = $('<ol />')
                    .attr('class','breadcrumb');
        var b = $('<li />');



        var home = $('<a />').attr('href','/user/files/'+ url[0]).click(function(){
            var data = $(this).attr("href");
            console.log(data);
            $.ajax({
                type: 'GET',
                url: data,
                data: { path: data},
                success : function(data2){
                    window.history.pushState('','',data);
                    filelist.listing(data2);
                }
            });
            return false;
        }).text('Home')

        home.appendTo(b);
        b.appendTo(a);

        var id = url[0];
        url.shift();

        var iter  = 0;
        var url2 = id.toString();

        $.each(url, function (key,value) {
            url2 = url2 +'/'+ (url[iter]).toString();
            var tmp = $('<li />').append(
                            $('<a />').attr('href','/user/folder/'+url2).click(function(){
                                        var data = $(this).attr("href");
                                        console.log(data);
                                        $.ajax({
                                            type: 'GET',
                                            url: data,
                                            data: { path: data},
                                            success : function(data2){
                                                window.history.pushState('','',data);
                                                filelist.listing(data2);
                                            }
                                        });
                                        return false;
                                    }).text(value)
                )
            tmp.appendTo(a);
            iter = iter + 1;
        })



        return a;

    }


    filelist.createConfirm = function(){
        var url = $(location).attr('pathname');

        return $('<div />')
            .attr('id','mymodal')
            .addClass('modal fade')
            .append(
            $('<div />')
                .addClass('modal-dialog')
                .append(
                $('<div />')
                    .addClass('modal-content')
                    .append(
                    $('<div />')
                        .addClass('modal-header')
                        .append(
                        $('<button />')
                            .attr('type','button')
                            .addClass('close')
                            .attr('data-dismiss','modal')
                            .attr('aria-label','Close')
                            .append(
                            $('<span />')
                                .attr('aria-hidden','true')

                        ),
                        $('<h4 />').text('Confimer')
                    ),
                    $('<div />')
                        .addClass('modal-body')
                        .text('Veuiller confirmer votre choix'),
                    $('<div />')
                        .addClass('modal-footer')
                        .append(
                        $('<button />')
                            .attr('type','button')
                            .addClass('btn btn-default')
                            .attr('data-dismiss','modal')
                            .text('Quitter'),
                        $('<button />')
                            .attr('type','button')
                            .addClass('btn btn-primary')
                            .text('Confirmer')
                            .click(function(){
                                var url = $(location).attr('pathname');
                                url = url.slice(url.indexOf('/') + 1).split('/');
                                url.shift();
                                url.shift();
                                url = url.join('/');

                                var urlC = $(location).attr('pathname');

                                var test = $(location).attr('hash');
                                test = test.slice(1);
                                $.ajax({
                                    type: 'GET',
                                    url: '/delete/file/'+url+'/'+test,
                                   success: function(data) {
                                       //console.log(data);
                                        $.get('/user/folder/'+url+'/', function(e){
                                            window.history.pushState('','',urlC);
                                            filelist.listing(e);
                                        })
                                    }
                                })
                                return false;
                            })
                    )
                )
            )
        )
    }


     filelist.listing = function(data){
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

        var f = filelist.newDir('');



        f.appendTo(a);


        var b =  $('<ul />')
                        .attr('id','file_li')
                        .attr('class','list-group col-lg-8');

        var ariane = filelist.arianne();

        ariane.appendTo(a);

        b.appendTo(a);
        $.when($.each(data,function(key,value) {
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
                        .attr('id', '#'+key)
                        .click(function(){
                            var data = $(this).attr("href");
                            console.log(data);
                            $.ajax({
                                type: 'GET',
                                url: data,
                                data: { path: data},
                                success : function(data2){
                                    window.history.pushState('','',data);
                                    filelist.listing(data2);
                                }
                            });
                            return false;
                        })
                        .append(

                        $('<i />')
                            .attr('class', 'fa fa-arrow-right pull-right')
                    );


                } else {
                    var e = $('<a />')
                        .attr('href', '/download/files/' + url + '/' + key)
                        .attr('download', key)
                        .append(
                        $('<i />')
                            .attr('class', 'fa fa-download pull-right')
                    );


                }

                var close = $('<a />')
                                    .attr('href','#'+key)
                                    .append(
                                    $('<i />')
                                        .addClass('fa fa-times pull-right')
                                        .click(function(){
                                            $("#mymodal").modal('show')
                                        })
                            )

                close.appendTo(c);
                e.appendTo(c);

            }
        })).done(function(){
                var modal = filelist.createConfirm();
                modal.appendTo(a);
                var g = filelist.dragArea(b.height());
                g.dropfile();
                g.appendTo(a)
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
               filelist.listing(data);
            }
        })
        return false;
    });

    $('#file').click(function() {
        var addressValue = $(this).attr("href");
        var hashes = addressValue.slice(addressValue.indexOf('/') + 1).split('/');
        console.log(hashes);
        var id = hashes[hashes.length - 2];
        var files = hashes[hashes.length - 1];
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


    $('body').append(
        $('<div />')
            .attr('id','footer')
            .append(
            $('<div />')

                .css('text-align','center')

                .text('Propulsé par ')
                .append(
                $('<a />')
                    .attr('href','#')
                    .text('SFramework')
            )
        )

    )



}

