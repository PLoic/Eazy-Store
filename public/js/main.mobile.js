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

    $('#m_files').click(function(){

        var url = $(location).attr('pathname');
        url = url.slice(url.indexOf('/') + 1).split('/');
        url.shift();

        var id = url[0];

        $.ajax({
            type: 'GET',
            url: '/user/files/'+id,
            success: function(data){
                window.history.pushState('','','/mobile/files/'+id);
                filelistm.listing(data);
                $.mobile.changePage('#my_files');
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
        var b = $('<div />').addClass('ui-field-contain');

        b.appendTo(content);

        $.each(data,function(key,value) {
            if(!(key.toString().indexOf('.') == 0)){
                var c = $('<select />')
                    .attr('name','select-custom-21')
                    .attr('id','select-custom-21')
                    .attr('data-native-menu','false');

                c.appendTo(b);

                var d = $('<option />')
                    .attr('value',key)
                    .attr('data-placeholder','true')
                    .text(key);
                d.appendTo(c);
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
                        }).append(

                        $('<option />')
                            .attr('class', 'fa fa-arrow-right pull-right')
                    );
                }
            }

        })




    }
})