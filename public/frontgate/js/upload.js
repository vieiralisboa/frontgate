//JavaScript

$('#body').html('<div id="main"><form method="post" enctype="multipart/form-data" action="upload.php"><input type="file" name="images" id="images" multiple /><button type="submit" id="btn">Upload Files!</button></form><div id="response"></div><ul id="image-list"></ul></div>');

(function () {
    var input = document.getElementById("images"), formdata = false;

    if (window.FormData) {
        formdata = new FormData();
        document.getElementById("btn").style.display = "none";
    }

    function showUploadedItem (source) {
        $('<li>').append($('<img>').attr({
            width:400,
            src: source})).prependTo('#image-list');
    }

    if (input.addEventListener) {

        input.addEventListener("change", function (evt) {
            var i = 0, len = this.files.length, img, reader, file;

            document.getElementById("response").innerHTML = "Uploading . . ."

            for ( ; i < len; i++ ) {
                file = this.files[i];

                if (!!file.type.match(/image.*/)) {
                     //--------------------------------------------------------
                     if ( window.FileReader ) {
                        reader = new FileReader();
                        reader.onloadend = function (e) {
                            showUploadedItem(e.target.result);
                        };
                        reader.readAsDataURL(file);
                    }

                    if (formdata) {
                        formdata.append("images[]", file);
                    }//--------------------------------------------------------
                }
            }

            //*----------------------------------------------------------------
            if (formdata) {
                $.ajax({
                    url: "upload/index.php",
                    type: "POST",
                    data: formdata,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        console.log(res);
                        //document.getElementById("response").innerHTML = res;
                    }
                });
            }
            //---------------------------------------------------------------*/

        }, false);
    }
})();
