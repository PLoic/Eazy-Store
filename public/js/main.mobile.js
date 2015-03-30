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
            upload(files,$(this),0);
        });


    }
})