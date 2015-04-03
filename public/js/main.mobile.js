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

    var filelistm ={}

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
                window.history.replaceState({},'','/mobile/user/files/'+id+"#my_files");
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
        url.shift();
        url = url.join('/');

        console.log(url);

        var content = $('body #list_files');

        content.empty();

        var b = $('<div />')
            .attr('data-role','collapsibleset')
            .attr('data-theme','a')
            .attr('data-inset','false')
            .attr('id','lolap');
        b.appendTo(content);

        $.each(data,function(key,value) {
            if(!(key.toString().indexOf('.') == 0)){
                var c = $('<div />').attr({'data-role':'collapsible'});

                c.appendTo(b);

                var d = $('<h2 />')
                    .html(key);

                d.appendTo(c);

                var liste = $('<ul />').attr({'data-theme':'a','data-role':'listview','id':'mylist'})
                liste.appendTo(c);

                if (value.toString().indexOf('folder') != -1) {
                    console.log('lol');
                    var e = $('<li />')
                            .append(
                            $('<a />')
                                .attr('href', '/user/folder/' + url +'/'+key)
                                .attr('id', '#'+key)
                                .html('Naviguer dans ce dossier')
                                .click(function(){
                                    var data = $(this).attr("href");
                                    console.log(data);
                                    $.ajax({
                                        type: 'GET',
                                        url: data,
                                        data: { path: data},
                                        success : function(data2){
                                            $.mobile.navigate('#my_files');
                                            window.history.replaceState({},'','/mobile'+ data +"#my_files");
                                            filelistm.listing(data2);
                                        }
                                    });
                                    return false;
                                })
                            )
                    e.appendTo(liste);
                }else{
                    var e = $('<li />')
                        .append(
                        $('<a />')
                            .attr('href', '/download/files/' + url + '/' + key)
                            .attr('data-ajax', 'false')
                            .html('Telecharger')
                        )
                    e.appendTo(liste);

                }

                var del = $('<li />')
                    .append(
                       $('<a />')
                           .attr({'data-ajax':'false'})
                           .click(function(){
                               var urlC = $(location).attr('pathname');
                               $.ajax({
                                   type: 'GET',
                                   url: '/delete/file/'+url+'/'+key,
                                   success: function(data) {
                                       $.get('/user/folder/'+url+'/', function(e){
                                           window.history.pushState('','',urlC+'#my_files');
                                           filelistm.listing(e);
                                       })
                                   }
                               });
                               return false;
                           })
                           .html('Supprimer')
                    );

                del.appendTo(liste);

                $('body #mylist').listview();
                b.collapsibleset()
            }

        })

        $('#file-input').hide();

        $(document).on('click', '#upload', function() {
            $('#file-input').click();
        });

        $(document).on('change', '#file-input', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var files = e.target.files;

            upload(files,0);
        });

        var tmp;

        $('#new_f').click(function(){
            var path = $(location).attr('pathname')
            path = path.slice(path.indexOf('/') + 1).split('/');
            path.shift();
            path.shift();
            path.shift();
            tmp = path.join('/');
            console.log(tmp);
        })

        $('#send_folder').click(function(){
            var name = $('#name_d').val();
            $.ajax({
                type: 'POST',
                url: '/file/create',
                data: {
                    path: tmp,
                    name: name
                },
                success: function() {
                    $('#name_d').val("");
                    $('#form_doss').popup( "close" );
                    $.get('/user/folder/'+tmp+'/', function(e){
                        window.history.replaceState({},'','/mobile/user/files/'+tmp+"#my_files");
                        filelistm.listing(e);
                    })
                }
            });
            return false;
        });

        function upload(files,index){
            var hashes = window.location.pathname.slice(window.location.href.indexOf('/') + 1).split('/');
            hashes.shift();
            hashes.shift();
            hashes.shift();

            var url = window.location.pathname;
            var id = hashes.join('/');

            var file = files[index];
            var formData = new FormData();

            formData.append("fic",file);

            $.ajax({
                type: 'POST',
                url: '/upload/osef/'+id,
                data: formData,
                success: function() {
                    $.get('/user/folder/'+id+'/', function(e){
                        window.history.replaceState({},'',url+"#my_files");
                        filelistm.listing(e);
                    })
                },
                processData:false,
                contentType:false
            });
            return false;

        }

        $(function (){

            var url = window.location.pathname.slice(window.location.href.indexOf('/') + 1).split('/');
            url.shift();
            url.shift();
            url.shift();

            var bread = $('#breadcrumbs');
            bread.empty();
            bread.append(
                $('<li />').append(
                    $('<strong />').text('Vous etes dans :')
                )
            );
            var li = $('<li/>')

            var home = $('<a />').attr('href','/user/files/'+ url[0]).click(function(){
                var data = $(this).attr("href");
                console.log('funnr ====' + data);
                $.ajax({
                    type: 'GET',
                    url: data,
                    data: { path: data},
                    success : function(data2){
                        window.history.replaceState({},'','/mobile'+data+"#my_files");
                        filelistm.listing(data2);
                    }
                });
                return false;
            }).text('Home')

            home.appendTo(li);
            li.appendTo(bread);

            var id = url[0];
            console.log('iiiiiiiiiddddd = ' + id);
            url.shift();

            var iter  = 0;
            var url2 = id.toString();

            $.each(url, function (value) {
                url2 = url2 +'/'+ (url[iter]).toString();
                var tmp = $('<li />').append(
                    $('<a />').attr('href','/user/folder/'+url2).click(function(){
                        var data = $(this).attr("href");
                        var tmp = url2.split('/');
                        $.ajax({
                            type: 'GET',
                            url: data,
                            data: { path: data},
                            success : function(data2){
                                window.history.replaceState({},'','/mobile/user/folder/'+(tmp.splice(0,(tmp.length)-1)).join('/')+"#my_files");
                                filelistm.listing(data2);
                            }
                        });
                        return false;
                    }).text((url[iter]).toString())
                )
                tmp.appendTo(bread);
                iter = iter + 1;
            })


        });

        function test(){
            var browser = navigator.userAgent,
                browserVer = navigator.appVersion,
                items = $('li', '#breadcrumbs').eq(0).nextUntil('li.last');
            if (/msie/g.test(browser.toLowerCase()) && parseInt(browserVer) < 8) {
                items.each(function () {
                    var $item = $(this);
                    var sep = $('<span class="separator"/>');
                    sep.html('&gt;').insertAfter($item);
                });

            }
        }


    }
})