/*jslint browser: true*/
/*global jQuery: true, $: true*/
$(document).ready(function () {
    "use strict";

    var uploadsRoot = '/uploads/',
        lastImage = null;

    function getLastImage(cb) {
        $.ajax({
            url: '/lastPic.json',
            dataType: 'json',
            success: function (resp) {
                if (resp.file && resp.file !== lastImage) {
                    cb(resp.file);
                    lastImage = resp.file;
                }
            }
        });
    }

    function setNewImage(file) {
        $('#CamPic').attr('src', uploadsRoot + file);
    }

    $('#Refresh').on('click', function (e) {
        getLastImage(setNewImage);
    });
});
