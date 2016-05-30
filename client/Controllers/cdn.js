Meteor.startup(function() {
    Meteor.call('getCSSCDN', function(err, ret) {
        Session.set("CSS_CDN", ret);

    });

    Meteor.call('getJSCDN', function(err, ret) {

        Session.set("JS_CDN", ret);

    });
    Meteor.call('getIMGCDN', function(err, ret) {

        Session.set("IMG_CDN", ret);

    });
    /*
        Meteor.call('getIMGCDN',function(err,ret){
            console.log('retourn cdn= '+ret);
            Session.set("IMG_CDN",ret);
            console.log(err);
            console.log(ret);
        });
        */
});

Tracker.autorun(function() {
    var css = Session.get("CSS_CDN");
    var js = Session.get("JS_CDN");

    var allcss = ' <link rel="stylesheet" class="CSSCDN" href="' + css + '/css/bootstrap.min.css"  crossorigin="anonymous">    <link rel="stylesheet" class="CSSCDN" href="' + css + '/css/bootstrap-slider.min.css" type="text/css">    <link href="' + css + '/css/font-awesome.min.css" rel="stylesheet" class="CSSCDN">     <link href="' + css + '/css/custom_menu.css" rel="stylesheet" class="CSSCDN">   <link href="' + css + '/css/swiper.min.css" rel="stylesheet" class="CSSCDN">    <link href="' + css + '/css/megamenu.css" rel="stylesheet" class="CSSCDN">  <link href="' + css + '/css/responsive_bootstrap_carousel_mega_min.css" rel="stylesheet" class="CSSCDN">    <link href="' + css + '/css/webzine-chhay.css" media="all" rel="stylesheet" class="CSSCDN">     <link href="' + css + '/css/pisey.css" rel="stylesheet" class="CSSCDN"> <link href="' + css + '/css/pk_main.css" rel="stylesheet" class="CSSCDN">   <link href="' + css + '/css/pk_main_responsive.css" rel="stylesheet" class="CSSCDN">    <link href="' + css + '/css/nav_safir.css" rel="stylesheet" class="CSSCDN" type="text/css" >    <link href="' + css + '/css/style.css" rel="stylesheet" class="CSSCDN">    <link href="' + css + '/css/congratulation.css" rel="stylesheet" class="CSSCDN" type="text/css" />   <link href="' + css + '/css/product_listing.css" rel="stylesheet" class="CSSCDN">   <link href="/cs/popup-win.css" rel="stylesheet" class="CSSCDN"> <link href="' + css + '/css/quick_view_new.css" rel="stylesheet" type="text/css" /> <link href="' + css + '/css/details.css" rel="stylesheet" class="CSSCDN">   <link href="' + css + '/css/details.css" rel="stylesheet" class="CSSCDN">   <link href="' + css + '/css/sreyden.css" rel="stylesheet" class="CSSCDN">   <link href="' + css + '/css/custom.css" rel="stylesheet" class="CSSCDN">    <link href="' + css + '/css/suggestion.css" rel="stylesheet" class="CSSCDN">    <link href="' + css + '/css/social_media.css" rel="stylesheet" class="CSSCDN">  <link rel="stylesheet" class="CSSCDN" type="text/css" href="' + css + '/css/chien_style.css" /> <link rel="stylesheet" class="CSSCDN" type="text/css" href="/fonts/Nazanin.css" />  <link href="' + css + '/css/filter_views.css" rel="stylesheet" class="CSSCDN">      <link href="' + css + '/css/profile-page.css" rel="stylesheet" class="CSSCDN">    <link href="' + css + '/css/home-page.css" rel="stylesheet" class="CSSCDN">     <link href="' + css + '/css/top-category.css" rel="stylesheet">   <link href="' + css + '/css/forum.css" media="all" rel="stylesheet" class="CSSCDN"> <link href="' + css + '/css/forum3.css" media="all" rel="stylesheet" class="CSSCDN">    <link href="' + css + '/css/form.css" media="all" rel="stylesheet" class="CSSCDN">  <link href="' + css + '/css/quick_view.css" media="all" rel="stylesheet" class="CSSCDN">    <link href="' + css + '/css/all.min.css" media="all" rel="stylesheet" class="CSSCDN">   <link href="' + css + '/css/basic_page.css" rel="stylesheet" class="CSSCDN">    <link href="' + css + '/css/basic_chhay.css" rel="stylesheet" class="CSSCDN">   <link href="' + css + '/css/refine_menu.css" rel="stylesheet" class="CSSCDN">   <link href="' + css + '/css/cart-paron.css" rel="stylesheet" class="CSSCDN">    <link href="' + css + '/css/write_comment.css" rel="stylesheet" class="CSSCDN"> <link href="' + css + '/css/login.kimhieng.css" rel="stylesheet" class="CSSCDN">    <link href="' + css + '/css/black_men.css" rel="stylesheet" class="CSSCDN"> <link rel="stylesheet" class="CSSCDN" type="text/css" href="' + css + '/css/kimhieng_safir.css">    <link rel="stylesheet" class="CSSCDN" type="text/css" href="' + css + '/css/kimhieng.css">  <link rel="stylesheet" class="CSSCDN" type="text/css" href="' + css + '/css/comment_V1.css">    <link rel="stylesheet" class="CSSCDN" type="text/css" href="' + css + '/css/login.pokoet.css">  <link rel="stylesheet" class="CSSCDN" type="text/css" href="' + css + '/css/quiz-page.css"> <link rel="stylesheet" class="CSSCDN" type="text/css" href="' + css + '/css/jquery.bxslider.css">   <link rel="stylesheet" class="CSSCDN" type="text/css" href="' + css + '/css/listquizz.css"> <link rel="stylesheet" class="CSSCDN" type="text/css" href="' + css + '/css/lightslider.min.css">   <link rel="stylesheet" class="CSSCDN" type="text/css" href="' + css + '/css/screen_media.css" media="all">  <link rel="stylesheet" class="CSSCDN" type="text/css" href="' + css + '/css/layout.css" media="all">    <link rel="stylesheet" class="CSSCDN" type="text/css" href="' + css + '/css/c-slider.css" media="all">       <link href="' + css + '/css/checkout_ka.css" rel="stylesheet" class="CSSCDN">    <link href="' + css + '/css/popup.css" rel="stylesheet" class="CSSCDN">    <link href="' + css + '/css/ratingstar.css" rel="stylesheet" class="CSSCDN">    <link rel="stylesheet" class="CSSCDN" href="' + css + '/css/bootstrap.vertical-tabs.css">    <link rel="stylesheet" class="CSSCDN" type="text/css" href="' + css + '/css/layout_kim.css">    <link rel="stylesheet" class="CSSCDN" type="text/css" href="' + css + '/css/component_kim.css">    <link rel="stylesheet" class="CSSCDN" type="text/css" href="' + css + '/css/popup-daily.css">    <link rel="stylesheet" class="CSSCDN" type="text/css" href="/font-awesomecss/font-HelveticaNeue.css">    <link rel="stylesheet" class="CSSCDN" type="text/css" href="' + css + '/css/style-new.css">    <link rel="stylesheet" class="CSSCDN" href="' + css + '/css/fonts.css" type="text/css" charset="utf-8" />   ';
    var alljs = '<script class="JSCDN" src="' + js + '/js/jquery.min.js"></script>    <script class="JSCDN" src="' + js + '/js/bootstrap.min.js"></script>    <script class="JSCDN" src="' + js + '/js/lightslider.min.js"></script>    <script class="JSCDN" src="' + js + '/js/lightgallery-all.min.js"></script>     <script class="JSCDN" src="' + js + '/js/swiper.js"></script>    <script class="JSCDN" type="text/javascript" src="' + js + '/js/jquery.flexisel.js"></script>        <script class="JSCDN" type="text/javascript" src="' + js + '/js/megamenu.js"></script>        <script class="JSCDN" type="text/javascript" src="' + js + '/js/jquery.easing.min.js"></script>    <script class="JSCDN" src="' + js + '/js/jquery-octofilter.js"></script>       <script class="JSCDN" type="text/javascript" src="' + js + '/js/chien_jquery.contentcarousel.js"></script>    <script class="JSCDN" src="' + js + '/js/refine_menu.js"></script> <script class="JSCDN" src="' + js + '/jss/jquery.zoom.min.js" type="text/javascript"></script>    <script class="JSCDN" type="text/javascript" src="' + js + '/js/jquery.popupoverlay.js"></script>    <script class="JSCDN" type="text/javascript" src="/js/jquery.bxslider.js"></script>    <script class="JSCDN" type="text/javascript" src="' + js + '/js/jquery.bxslider.min.js"></script>';

    var allHTML = '';
    if (css != '' && css != null) {
        //$('head').append(allcss);
        allHTML += allcss + ' \n ';
    }

    if (js != '' && js != null) {
        //$('head').append(alljs);
        allHTML += alljs + ' \n ';

    }

    $('head').append(allHTML);




    /*
        var css=Session.get("CSS_CDN");
        console.log('change '+css);
        if(css!=''){
            $('link.CSSCDN').each(function( index ) {
                console.log("CDN:"+Session.get("CSS_CDN"));
                var val=$( this ).attr('href');
                if(val.indexOf(css)<0){
                    var newSrc=Session.get("CSS_CDN")+''+val;
                    console.log('changing '+val+' to '+newSrc);
                    $( this ).attr('href',newSrc);
                    
                    console.log('after:'+ $( this ).attr('href'));
                }
                
            });
        }

        var js=Session.get("JS_CDN");
        if(js!=''){
            $('script.JSCDN').each(function( index ) {

                    console.log("CDN:"+Session.get("JS_CDN"));
                    var val=$( this ).attr('src');
                    if(val.indexOf(js)<0){
                        var newSrc=Session.get("CSS_CDN")+''+val;
                        $( this ).attr('src',newSrc);
                        console.log('changing '+val+' to '+newSrc);
                    }
                    
                });
        }*/

});
