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

        console.log(url);

        var content = $('body #list_files');
        content.empty();


        var b = $('<div />')
            .attr('data-role','collapsibleset')
            .attr('data-theme','a')
            .attr('data-inset','false');
        b.appendTo(content);

        $.each(data,function(key,value) {
            if(!(key.toString().indexOf('.') == 0)){
                var c = $('<div />').attr({'data-role':'collapsible'});

                c.appendTo(b);

                var d = $('<h2 />')
                    .html(key);

                d.appendTo(c);

                var liste = $('<ul />').attr({'data-theme':'a'})
                liste.appendTo(c);

                if (value.toString().indexOf('folder') != -1) {
                    console.log('lol');
                    var e = $('<li />')
                            .append(
                            $('<a />')
                                .attr('href','#')
                                .html('Naviguer dans ce dossier')
                                .click(function(){
                                    console.log('test');
                                })
                            )
                    e.appendTo(liste);
                }else{
                    var e = $('<li />')
                        .append(
                        $('<a />')
                            .attr('href', '/files/' + url + '/' + key)
                            .attr('download', key)
                            .html('Telecharger')
                        )
                    e.appendTo(liste);

                }
                liste.listview();

            }

        })




    }
})