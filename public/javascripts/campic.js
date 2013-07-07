/*jslint browser: true*/
/*global jQuery: true, $: true*/
$(document).ready(function () {
    "use strict";

    var uploadsRoot = window.campic.vars.imagepath,
        refreshing = false,
        socket;

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
        };
        img.onerror = function () {
            cont.removeClass('loading');
            cb();
        };
        img.src = src;
    }

    function setActiveInList(file) {
        $('#AvailableImages')
            .find('a').removeClass('active')
                .filter('[data-img="' + file + '"]').addClass('active');
    }

    function setNewImage(file) {
        var src = uploadsRoot + file;
        downloadImage(src, function () {
            $('#CamPic').attr('src', src);
            setActiveInList(file);
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

    function refresh() {

        if (refreshing) {
            return;
        }

        refreshing = true;

        getLastImage(function (file) {
            listImages();
            setNewImage(file);
            refreshing = false;
        });
    }

    $('#Refresh').on('click', refresh);

    $('#AvailableImages').on('click', 'a', function (e) {
        e.preventDefault();
        var target = $(e.target);

        setNewImage(target.data('img'));
    });

    socket = window.io.connect('http://' + window.location.host);
    socket.on('imagechange', function (data) {
        refresh();
    });
    refresh();

    function getActiveLink() {
        return $('#AvailableImages').find('.active');
    }

    function getNextLink() {
        var current = getActiveLink();
        return current.parent().next().find('a');
    }

    function getPrevioiusLink() {
        var current = getActiveLink();
        return current.parent().prev().find('a');
    }

    function switchToNextImage() {
        getNextLink().click();
    }
    function switchToPreviousImage() {
        getPrevioiusLink().click();
    }

    $(document).keydown(function (event) {
        var action = null;

        if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }

        switch (event.which) {
        case 74: // j
            action = 'next';
            break;
        case 75: // k
            action = 'previous';
            break;
        }

        if (action) {
            event.preventDefault();

            if (action === 'next') {
                switchToNextImage();
            } else if (action === 'previous') {
                switchToPreviousImage();
            }
        }
    });
});
