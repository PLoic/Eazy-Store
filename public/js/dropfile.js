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
                var file = files[index];

                var formData = new FormData();

                formData.append("fic",file);

                $.ajax({
                    type: 'POST',
                    url: 'upload.php',
                    data: formData,
                    processData:false,
                    contentType:false
                });
            }

        })
    }

})(jQuery);
