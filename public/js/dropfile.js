(function($){

    var o = {
        message : "Drag and drop your file here",
        script :"upload.php"
    }
    $.fn.dropfile = function(oo){
        if(oo) $.extend(o,oo);
        this.each(function(){
            $('<span>').addClass('instructions').append(o.message).appendTo(this);
            $(this).bind({
                dragenter : function(e){
                    e.preventDefault();
                    console.log('dragenter');
                },
                dragover : function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).addClass('hover');
                    console.log('dragover');
                },
                dragleave : function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).removeClass('hover');
                    console.log('dragleave');
                },
                drop : function(e) {
                    if(e.originalEvent.dataTransfer){
                        e.preventDefault();
                        e.stopPropagation();
                        $(this).removeClass('hover');
                        var files = e.originalEvent.dataTransfer.files;
                        upload(files,$(this),0);
                    }
                    return false;
                }
            })

            function upload(files,area,index){

                var hashes = window.location.pathname.slice(window.location.href.indexOf('/') + 1).split('/');
                hashes.shift();
                var id = hashes.join('/');

                var file = files[index];

                if(file.size > 16777216){
                    var a = $('#content');
                    a.append(
                    $('<div />')
                        .attr('id','mymodal1')
                        .attr('role','dialog')
                        .attr('tabindex','-1')
                        .attr('aria-labelledby','myLargeModalLabel')
                        .attr('aria-hidden','true')
                        .addClass('modal fade')
                        .append(
                        $('<div />')
                            .addClass('modal-dialog modal-lg')
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
                                        $('<h4 />').text('Information')
                                    ),
                                    $('<div />')
                                        .addClass('modal-body')
                                        .text('Taille de fichier trop importante')
                                    )
                            )
                        ).modal('show')
                    )

                }else{
                    var formData = new FormData();

                    formData.append("fic",file);

                    $.ajax({
                        type: 'POST',
                        url: '/upload/osef/'+id,
                        data: formData,
                        success: function() {
                            $.get('/user/folder/'+id+'/', function(e){
                                filelist.listing(e);
                            })
                        },
                        processData:false,
                        contentType:false
                    });
                }

                return false;

            }

        })
    }

})(jQuery);
