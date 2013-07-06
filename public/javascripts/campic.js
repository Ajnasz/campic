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

    function getImageList(cb) {
        $.ajax({
            url: '/allPics.json',
            dataType: 'json',
            success: function (resp) {
                if (resp.files) {
                    cb(resp.files);
                }
            }
        });
    }

    function setNewImage(file) {
        $('#CamPic').attr('src', uploadsRoot + file);
    }

    function listImages(images) {
        var o = '';

        images.forEach(function (f) {
            o += '<li><a href="' + uploadsRoot + f + '" data-img="' + f + '">' + f + '</a></li>';
        });

        return '<ul>' + o + '</ul>';
    }

    $('#Refresh').on('click', function (e) {
        getLastImage(setNewImage);
        getImageList();
    });

    $('#AvailableImages').on('click', 'a', function (e) {
        e.preventDefault();
        var target = $(e.target);

        setNewImage(target.data('img'));
    });

    getLastImage(setNewImage);
    getImageList(function (images) {
        $('#AvailableImages').html(listImages(images.reverse()));
    });
});
