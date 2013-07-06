/*jslint browser: true*/
/*global jQuery: true, $: true*/
$(document).ready(function () {
    "use strict";

    var uploadsRoot = window.campic.vars.imagepath;

    function getLastImage(cb) {
        $.ajax({
            url: '/lastPic.json',
            dataType: 'json',
            success: function (resp) {
                if (resp.file) {
                    cb(resp.file);
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

    function downloadImage(src, cb) {
        var img = new Image(),
            cont = $('#CamPic');
        cont.addClass('loading');
        img.onload = function () {
            cont.removeClass('loading');
            cb();
        }
        img.onerror = function () {
            cont.removeClass('loading');
            cb();
        }
        img.src = src;
    }

    function setNewImage(file) {
        var src = uploadsRoot + file;
        downloadImage(src, function () {
            $('#CamPic').attr('src', src);
        });
    }

    function getImageListHTML(images) {
        var o = '';

        images.forEach(function (f) {
            o += '<li><a href="' + uploadsRoot + f + '" data-img="' + f + '">' + f + '</a></li>';
        });

        return '<ul>' + o + '</ul>';
    }

    function listImages() {
        getImageList(function (images) {
            $('#AvailableImages').html(getImageListHTML(images.reverse()));
        });
    }
    

    $('#Refresh').on('click', function (e) {
        getLastImage(setNewImage);
        listImages();
    });

    $('#AvailableImages').on('click', 'a', function (e) {
        e.preventDefault();
        var target = $(e.target);

        setNewImage(target.data('img'));
    });

    getLastImage(setNewImage);
    listImages();
});
