$(document).ready(function(){
    /**
    *   Global variables.
    */
    var pageHeight = $(window).height();
    var pageWidth = $(window).width();
    var navigationHeight = $("#navigation").outerHeight();

    /**
    *   ON RESIZE, check again
    */
    $(window).resize(function () {
        pageWidth = $(window).width();
        pageHeight = $(window).height();
    });


    /**
    *   ON LOAD
    */

    /* Initialize scroll so if user droped to other part of page then home page. */
    $(window).trigger('scroll');

    /* Fix navigation. */
    $('#navigation').fixedonlater({
        speedDown: 250,
        speedUp: 100
    });

    /* Centralize elements on page. */
    $('.centralized').centralized({
        delay: 1500,
        fadeSpeed: 500
    });

    /* Make embeded videos responsive. */
    $.fn.responsivevideos();

    /* Carousel "Quote slider" initialization. */
    $('#quote-slider').each(function(){
        if($('.item', this).length) {
            $(this).carousel({
                interval: 20000
            });
        }
    });

    /* Scroll spy and scroll filter */
    $('#main-menu').onePageNav({
        currentClass: "active",
        changeHash: false,
        scrollOffset: navigationHeight - 10,
        scrollThreshold: 0.5,
        scrollSpeed: 750,
        filter: "",
        easing: "swing"
     });

    /*
    *  Paralax initialization.
    *  Exclude for mobile.
    */
    if(pageWidth > 10080){
        /* Dont user paralax for tablet and mobile devices. */
        $('#page-welcome').parallax("0%", 0.2);
        $('#page-features').parallax("0%", 0.07);
        $('#page-twitter').parallax("0%", 0.1);
    }

    /* Emulate touch on table/mobile touchstart. */
    if(typeof(window.ontouchstart) != 'undefined') {
        var touchElements = [".social-icons a", ".portfolio-items li", ".about-items .item"];

        $.each(touchElements, function (i, val) {
            $(val).each(function(i, obj) {
                $(obj).bind('click', function(e){

                    if($(this).hasClass('clickInNext')){
                        $(this).removeClass('clickInNext');
                    } else {
                        e.preventDefault();
                        e.stopPropagation();

                        $(this).mouseover();
                        $(this).addClass('clickInNext');
                    }
                });
            });
        });
    }

    /**
    *   BLOCK | Navigation
    *
    *   Smooth scroll
    *   Main menu links
    *   Logo click on Welcome page
    */
    $('#page-welcome .logo a').click(function(){
        $('html, body').animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top - navigationHeight + 4
        }, 800);

        /* Fix jumping of navigation. */
        setTimeout(function() {
            $(window).trigger('scroll');
        }, 900);

        return false;
    });

    /**
    *   PAGE | Welcome
    *
    *   Initialize slider for welcome page H1 message.
    */
   $('#welcome-messages ul').bxSlider({
        mode: 'vertical',
        auto: true,
        minSlides: 1,
        responsive: true,
        touchEnabled: true,
        pager: false,
        controls: false,
        useCSS: false,
        pause: 10000
    });

    /**
    *   PAGE | WORK
    *
    *   .plugin-filter - Defines action links.
    *   .plugin-filter-elements - Defines items with li.
    */
    $('.plugin-filter').click(function(){
        return false;
    });
    $('.plugin-filter-elements').mixitup({
        targetSelector: '.mix',
        filterSelector: '.plugin-filter',
        sortSelector: '.sort',
        buttonEvent: 'click',
        effects: ['fade','rotateY'],
        listEffects: null,
        easing: 'smooth',
        layoutMode: 'grid',
        targetDisplayGrid: 'inline-block',
        targetDisplayList: 'block',
        gridClass: '',
        listClass: '',
        transitionSpeed: 600,
        showOnLoad: 'all',
        sortOnLoad: false,
        multiFilter: false,
        filterLogic: 'or',
        resizeContainer: true,
        minHeight: 0,
        failClass: 'fail',
        perspectiveDistance: '3000',
        perspectiveOrigin: '50% 50%',
        animateGridList: true,
        onMixLoad: null,
        onMixStart: null,
        onMixEnd: null
    });

    /**
    *   PAGE | Twitter
    *
    *   Pull latest tweets from user.
    */
    // Helper function to replace shortened URL with the display URL.
    var replaceWithDisplayUrl = function(text, url, displayUrl, expandedUrl) {
        return text.replace(url, '<a href="' + expandedUrl + '">' + displayUrl + '</a>');
    };

    // Once access token is received, we can use it to retrieve tweets from the account.
    var getTweets = function(accessToken) {

        if (accessToken) {
            $.ajax({
                type: 'get',
                async: true,
                url: 'plugins/twitter?access_token=' + accessToken,
                success: function(data, status, jqxhr) {
                    var jsonData = JSON.parse(data);

                    // List with tweet_list class is expected by JQuery tweetCarousel plugin.
                    var list = $('<ul class="tweet_list">');
                    list.empty();

                    for (var i = 0; i < jsonData.length; i++) {
                        var text = jsonData[i].text;

                        for (var j = 0; j < jsonData[i].entities.urls.length; j++) {
                            var entityUrl = jsonData[i].entities.urls[j];
                            text = replaceWithDisplayUrl(text, entityUrl.url, entityUrl.display_url, entityUrl.expanded_url);
                        }

                        list.append('<li>' + text + '</li>');
                    }

                    $('#twitterfeed-slider').append(list);

                    $('#twitterfeed-slider').tweetCarousel({
                        interval: 7000,
                        pause: "hover"
                    });
                }
            });
        }
    };

    // Send request to get access token.
    // @todo If the access token is already saved in a cookie or local storage, skip this initial step.
    $.ajax({
        type: 'get',
        async: true,
        url: 'plugins/twitter',
        success: function(data, status, jqxhr) {
            var jsonData = JSON.parse(data);
            if (jsonData && jsonData.token_type === "bearer" && jsonData.access_token) {
                getTweets(jsonData.access_token);
            }
        }
    });
 });


/**
*   Ajax request.
*   Start loading.
*   Append loading notification.
*/
$( document ).ajaxSend( function() {
    /* Show loader. */
    if($(".loading").length == 0) {
        $("body").append('<div class="loading"><div class="progress progress-striped active"><div class="bar"></div></div></div>');
        $(".loading").slideDown();
        $(".loading .progress .bar").delay(300).css("width", "100%");
    }
});

/**
*   Reinitialize Scrollspy after ajax request is completed.
*   Refreshing will recalculate positions of each page in document.
*   Time delay is added to allow ajax loaded content to expand and change height of page.
*/
$( document ).ajaxComplete(function() {
    /* Remove loading section. */
    $(".loading").delay(1000).slideUp(500, function(){
        $(this).remove();
    });

    /* Portfolio details - close. */
    $(".close-portfolio span").click(function(e) {
        $(".portfolio-item-details").delay(500).slideUp(500, function(){
            $(this).remove();
        });

        window.location.hash= "!";
        return false;
    });
});

