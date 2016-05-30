Router.configure({
    layoutTemplate: 'mainLayout',
    loadingTemplate: 'loading',
    onAfterAction: function() {
         if( Meteor.isClient){
            window.scrollTo(0, 0);
            $(".modal-backdrop").remove();

        }
    },
    onStop: function() {
        $(".close").click();
    }

});

Router.route('/sendmail',{
    name:'sendmail'
});

Router.route('/shopping-guide', {
    name: 'shoppingguide',
    waitOn: function() {
        var getuser=Meteor.userId();
        if(getuser){
            userid=getuser;
        }
        else{
            userid=Session.get("userId");
        }
        return [Meteor.subscribe("getFavorite",userid)];
    },
    onAfterAction: function() {
        if (!Meteor.isClient) {
            return;
        }
        SEO.set({
            title: "راهنمای خرید از سایت | Safir Iran",
            meta: {
                'description': "فهرست ویژه فرآیند ما خرید راهنماهای خرید این برنامه شامل یک انتخاب بی نظیر از آرایش، مراقبت از پوست، عطر ..."
            },
            og: {
                'title': "راهنمای خرید از سایت | Safir Iran",
                'description': "فهرست ویژه فرآیند ما خرید راهنماهای خرید این برنامه شامل یک انتخاب بی نظیر از آرایش، مراقبت از پوست، عطر ..."
            }
        });
    }
});

Router.route('/basket',{
    name:'basket'
});

Router.route('/1', {
    name: 'edits'
});
Router.route('/2', {
    name: 'editform'
});

Router.route('/3', {
    name: 'ordernew'
});

Router.route('/sokhy', {
    name: 'sokhy'
});

Router.route('/djiby', {
    name: 'djiby'
});

Router.route('/newmenu', {
    name: 'newmenu'
});

Router.route('/dailyPopup', {

    name: 'dailyPopup'
});

Router.route('/profilenew', {
    name: 'profilenew'
});

Router.route('/testview', {
    name: 'testview'
});

Router.route('/hometesting',{
    name:"hometesting"
});


Router.route("/saman", function() {
    var reponse = {
        state: this.request.body.State,
        resNum: this.request.body.ResNum,
        mid: this.request.body.MID,
        refnum: this.request.body.RefNum,
        trace: this.request.body.TRACENO
    };
    Meteor.call('verifyBank', reponse);
    this.response.statusCode = 200;
    this.response.setHeader('access-control-allow-origin', '*');
    // var html='<div class="congratulation"> <h1 class="text-center h1">Congratulations</h1> <img class="center-block" height="100" src="images/safir_logo-01.svg"> <p class="text-center text_cong" id="returnHTML">Your payment has been validated, <br> you will receive the receipt on your mailbox. </p><div class="col-md-3 col-md-offset-5"><a href="/"><button type="button" class="btn-cong">Continue on safir</button></a></div></div>';
    var html = '<div class="congratulation"> <h1 class="text-center h1">Congratulations</h1> <img class="center-block" height="100" src="http://safirperfumery.com/images/safir_logo-01.svg"> <p class="text-center text_cong" id="returnHTML">Your payment has been validated, <br> you will receive the receipt on your mailbox. </p><div class="col-md-3 col-md-offset-5"><a href="http://safirperfumery.com"><button type="button" class="btn-cong">Continue on safir</button></a></div></div>';
    //EarnPoint('shopOnline', 70, 140, 280);
    Meteor.call('updateUserPoint', userid='LvqRLP9ACYWxBy8vi', point=10, addpoint=20);

    // var html1= '<section><div class="container"><div class="text-right"><div style="overflow: hidden;"><span class="pull-left"><img class="center-block" height="100" src="images/safir_logo-01.svg"></span><span><h3 class="h-safir" style="margin-top: 40px;">Safirperfumery.com</h3><hr class="hr-safir" style="margin-top: 5px;margin-bottom: 20px;border: 0;border-top: 1px solid #333;" /></span> </div><h2 class="h-title" style="color: red;">Test</h2><h3>Test</h3> <p style="color: #ccc;">test</p><div class="row"><div class="conts" style="height: 250px;background: url("http://54.169.87.6/images/successbackcomment.png") no-repeat;background-size: 100% 250px;"><div class="col-md-6" style="border-right: 3px solid #000; height: 240px"><h3 style="margin: 15px;">test</h3></div><div class="col-md-6" style="height: 240px;"><h3 style="margin: 15px;">test</h3></div></div></div><h3 class="h-title" style="color: red;">test</h3><hr class="lineboldup" style="margin-top: 10px;margin-bottom: 20px;border: 0;border-top: 3px solid #333;" /><div class="row"><div class="col-md-3"><h3>test</h3><p style="color: #ccc;">test</p></div><div class="col-md-6"><h3>test</h3><p style="color: #ccc;">test</p><p style="color: #ccc;">test</p> </div><div class="col-md-3 text-center"><img src="/img/img.png" style="width:30%; height: 20%;"></div></div> <hr/><div class="row"><div class="col-md-3"><h3>test</h3><p style="color: #ccc;">test</p></div> <div class="col-md-6"><h3>test</h3><p style="color: #ccc;">test</p></div><div class="col-md-3 text-center"><img src="/img/img.png" style="width:30%; height: 20%;"></div> </div><hr class="linebold" style="margin-top: 20px;margin-bottom: 20px;border: 0;border-top: 3px solid #333;" /><h3 class="text-left">test</h3></div></div></section>';
    // Meteor.call("mail",html1);

this.response.end(html);
     
}, { where: "server" });

Router.route('/', {
    name: 'home',
    waitOn: function() { 
        var getuser=Meteor.userId();
        if(getuser){
            userid=getuser;
        }else{
            userid=Session.get("userId");
        }       
        return [TAPi18n.subscribe("productsHome", -1), Meteor.subscribe("getFavorite",userid), Meteor.subscribe('attrhome'), Meteor.subscribe("banner"),Meteor.subscribe('locations'), ];
       // return [TAPi18n.subscribe("productsHome", -1), Meteor.subscribe('attrhome'),TAPi18n.subscribe("list_product"), Meteor.subscribe("banner"),Meteor.subscribe('locations')];

    },
    data: function() {
        if (this.ready()) {
            item1 = 0;
            counter1 = 0;
            item2 = 0;
            counter2 = 0;
            if(Session.get('forgot') == true){
                Router.go('/email');
                Session.set('forgot',false);
            }
        }
    },
    onBeforeAction : function(){
        item1 = 0,counter1 = 0,item2 = 0,counter2 = 0;
        item1 = 0,item2 = 0;
        var one = IRLibLoader.load('/js/jssor.slider.mini.js');
        if(one.ready()){
            /*(function(d) {
                var f = d.getElementsByTagName('SCRIPT')[0],
                    p = d.createElement('SCRIPT');
                p.type = 'text/javascript';
                p.async = true;
                p.src = '//assets.pinterest.com/js/pinit.js';
                f.parentNode.insertBefore(p, f);

            }(document));
            */
            //<script async defer src="//assets.pinterest.com/js/pinit.js"></script>
            two = IRLibLoader.load('//assets.pinterest.com/js/pinit.js');
            if(one.ready())
                this.next();
                
        }
    }
});
// Meteor.Router.add({
//   '/': function() {
//     GAnalytics.pageview();
//     return 'home';}
// });
Router.route('/login', {
    name: 'login',
    waitOn:function(){
        return[Meteor.subscribe('imedation')];
    },
    onAfterAction: function() {
        if (!Meteor.isClient) {
            return;
        }
        SEO.set({
            title: "ورود | Safir Iran",
            meta: {
                'description': "ورود به مشخصات خود را ویرایش و دریافت سود بیشتر در Safir"
            },
            og: {
                'title': "ورود | Safir Iran",
                'description': "ورود به مشخصات خود را ویرایش و دریافت سود بیشتر در Safir"
            }
        });
    }
});

Router.route('/adminpanel', {
    name: 'adminpanel'
});

Router.route('/banking', {
    name: "banking",
    // template:"payment",
    data: function() {
        if (this.ready()) {
            //console.log('request:' + JSON.stringify(this.request.body));
            //if (typeof this.request.body.State === 'undefined' || this.request.body.State === null) {
            //    console.log('No parameter from this payment!');
            // } else {
            //console.log('...');
            /*var reponse = {
                state: this.request.body.State,
                resNum: this.request.body.ResNum,
                mid: this.request.body.MID,
                refnum: this.request.body.RefNum,
                trace: this.request.body.TRACENO
            };*/
            var reponse = {
                state: 'OK',
                resNum: 'OK',
                mid: 'OK',
                refnum: 'OK',
                trace: 'OK'
            };
            Meteor.call('verifyBank', reponse, function(err, ret) {
                // $("#returnHTML").html(ret);
                // console.log(ret);
                // console.log(err);
                if (ret) {
                    //=========start makara=======
                    if (ret.indexOf("success")) {
                        var oldpoint = Meteor.users.findOne({ _id: Meteor.userId() }).profile.shipcard.point;
                        var resultmembership = membership.find();
                        var arrmem = [];
                        resultmembership.forEach(function(value) {
                            if (value.minpoint <= oldpoint && oldpoint <= value.maxpoint) {
                                arrmem.push(value);
                            }
                        });
                        if (arrmem[0].name == 'black') {
                            var point = 70;
                        }
                        if (arrmem[0].name == 'silver') {
                            var point = 140;
                        }
                        if (arrmem[0].name == 'gold') {
                            var point = 280;
                        }
                        var upoint = point + oldpoint;
                        Meteor.call("earnPoint", Meteor.userId(), upoint, function(err) {
                            if (!err) {
                                if (TAPi18n.getLanguage() == 'fa') {
                                    Bert.alert('شما باید کسب  امتیاز بیشتر!', 'success', 'growl-bottom-right');
                                } else {
                                    Bert.alert('You have earn  point more!', 'success', 'growl-bottom-right');
                                }
                            }
                        });
                        var html = '<div class="congratulation"> <h1 class="text-center h1">Congratulations</h1> <img class="center-block" height="100" src="images/safir_logo-01.svg"> <p class="text-center text_cong" id="returnHTML">Your payment has been validated, <br> you will receive the receipt on your mailbox. </p><div class="col-md-3 col-md-offset-5"><a href="/"><button type="button" class="btn-cong">Continue on safir</button></a></div></div>'
                        $("#returnHTML").html(html);
                        Meteor.call('sendMail', function(err) {
                            if (err) {
                                console.log("Error send mial");
                            } else {
                                console.log('success seding email');
                            }
                        })
                    }
                    //=========end makara=========

                }
            });

            //}
            return;

        }
    }

});

Router.route('/rest', {
    name: 'rest',
    action: function() {
        //console.log('START LISTEN REST API');
        var reponse = {
            state: this.request.body.State,
            resNum: this.request.body.ResNum,
            mid: this.request.body.MID,
            refnum: this.request.body.RefNum,
            trace: this.request.body.TRACENO
        };
        //console.log('GET ALL PARAMAS OK');
        this.response.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });
        this.response.setHeader('access-control-allow-origin', '*');

        var html = '<div class="alert alert-success"><strong>Validated!</strong> Payment success!</div><a href="/checkout">Back to safir</a>';
        //console.log('SENDING');
        this.response.end(JSON.stringify(html));
    }
});

// Router.route('/productlisting', {
//     name: 'productlisting'
// });

Router.route('/member', {
    name: 'member',
    waitOn: function() {
        var getuser=Meteor.userId();
        if(getuser)
            userid=getuser;
        else
            userid=Session.get("userId");
        return [Meteor.subscribe('currentUserLoggedInImage', getuser), Meteor.subscribe("contents_type"),Meteor.subscribe("getFavorite",userid)];
    }
});
Router.route('/addquestion', {
    name: 'addquestion'
});

Router.route('/registerSuccess', {
    name: 'registerSuccess'
});

//admin
Router.route('/addproduct', {
    name: 'addproduct',
    waitOn: function() {
        return [TAPi18n.subscribe("parent_tags"), TAPi18n.subscribe("tags"), TAPi18n.subscribe("categories"), Meteor.subscribe("attribute_value"), TAPi18n.subscribe("products", -1)];

    }

});

// admin Products
Router.route('/manageproduct', {
    name: 'manageproduct',
    waitOn: function() {
        return [TAPi18n.subscribe("categories"), TAPi18n.subscribe("products", -1), Meteor.subscribe("attribute", -1), TAPi18n.subscribe("parent_tags")];
    }

});


Router.route('/updateproduct/:_id', {
    name: 'updateproduct',
    template: 'addproduct',
    waitOn: function() {
        return [TAPi18n.subscribe("products", -1), TAPi18n.subscribe("parentattr"), Meteor.subscribe("attribute", -1), TAPi18n.subscribe("tags"), TAPi18n.subscribe("parent_tags"), TAPi18n.subscribe("categories"), Meteor.subscribe("attribute_value")];
    },
    data: function() {
        if (this.ready()) {
            var id = this.params._id;
            var da = products.findOne({ _id: id });
            return da;
        }
    }
});


Router.route('/linkselling', {
    name: 'linkselling',
    waitOn: function() {
        return [Meteor.subscribe("question"), Meteor.subscribe("linkselling")];
    },
});

Router.route('/category/:id', {
    name: 'listing',
    template: 'listproducts',
    waitOn: function() {
        var name = this.params.id;
        name = name.replace(/-/g, " ");
        var getuser=Meteor.userId();
        if(getuser){
            userid=getuser;
        }else{
            userid=Session.get("userId");
        }
        Session.set('advanced_product', 0);
        //var limitproduct = Session.get('limitmanagequery');
        //return [TAPi18n.subscribe('productsCategory',-1,name) ,Meteor.subscribe('banner'),/*Meteor.subscribe('productsInlocations'),*/TAPi18n.subscribe('categories'), TAPi18n.subscribe('categoryParent_tags', name), TAPi18n.subscribe('categoryTags', name), Meteor.subscribe('attrlistproduct', name,16),Meteor.subscribe("getFavorite",userid)];
       // return [TAPi18n.subscribe("productsCategory", -1, name), TAPi18n.subscribe('categories'), TAPi18n.subscribe('categoryParent_tags', name), TAPi18n.subscribe('categoryTags', name), Meteor.subscribe('attrlistproduct', name)];
           // return [TAPi18n.subscribe("productsCategory", -1, name)]
        return [Meteor.subscribe('products',1), /*Meteor.subscribe('productsInPages', name),*/ Meteor.subscribe('banner'), /*Meteor.subscribe('productsInlocations'),*/ TAPi18n.subscribe('categories'), TAPi18n.subscribe('categoryParent_tags', name), TAPi18n.subscribe('categoryTags', name), /*Meteor.subscribe('attrlistproduct', name,16),*/Meteor.subscribe("getFavorite",userid),Meteor.subscribe("locations")];
    },
    data: function() {
        if (this.ready()) {

            //console.log('I HAVE '+products.find().count());
            var name = this.params.id;
            name = name.replace(/-/g, " ");
            
            //getListCategoryByName was call from server/product.js
            var l = getListCategoryByName( name );
            console.log('single cat:', l);
            var categoriesID = l;
            var parent = l._id;
            Session.set('idBanner', parent);

            Session.set('advancedlimit', '');
            if (Session.get('oldUrlId') !== parent) {
                Session.set('querylimit', 16);

                Session.set('advanced_brand', '');
                Session.set('advanced_tags', '');
                Session.set('advanced_price_max', 100000000);
                Session.set('parentTagId', '');
            }
            Session.set('oldUrlId', parent);
            Session.set('refineCateId', parent);

            //getListCategoryByParent was call from server/product.js
            var finalList = getListCategoryByParent( categoriesID );
            //console.log('List cat:', finalList);
            //console.log('FINALLIST'+finalList);
            Session.set('subcategories', finalList);
            var limit = Session.get('querylimit');
            Session.set('currentCategory', categoriesID);
            Session.get('curCategory', parent);
        }
    },
    onAfterAction: function() {
        var name = this.params.id;
        name = name.replace(/-/g, " ");
        var l = categories.findOne({ "title": name });
        if (l == null) {
            var title = name;
            title = title.replace(/\-/g, " ");
            title = title.replace(/\(percentag\)/g, "%");
            title = title.replace(/\(plush\)/g, "+");
            title = title.replace(/\(ocir\)/g, "ô");
            title = title.replace(/\(minus\)/g, "-");
            title = title.replace(/\(copyright\)/g, "®");
            title = title.replace(/\(number\)/g, "°");
            title = title.replace(/\(bigocir\)/g, "Ô");
            title = title.replace(/\(square\)/g, "²");
            title = title.replace(/\(accentaigu\)/g, "`");
            title = title.replace(/\(eaccentaigu\)/g, "é");
            title = title.replace(/\(bigeaccentaigu\)/g, "É");
            title = title.replace(/\(and\)/g, "&");
            title = title.replace(/\(slash\)/g, "/");
            title = title.replace(/\(apostrophe\)/g, "’");
            title = title.replace(/\(quote\)/g, "'");
            title = title.replace(/\(warning\)/g, "!");
            title = title.replace(/\(question\)/g, "?");
            title = title.replace(/\(dolla\)/g, "$");
            title = title.replace(/\(eaccentgrave\)/g, "è");
            title = title.replace(/\(hyphen\)/g, "–");
            var l = categories.findOne({ "i18n.en.title": title });
        }
        if (!Meteor.isClient) {
            return;
        }
        SEO.set({
            title: l.title + " | Safir Iran",
            meta: {
                'description': l.description
            },
            og: {
                'title': l.title + " | Safir Iran",
                'description': l.description
            }
        });

    },
    onBeforeAction : function(){
        item1 = 0,counter1 = 0,item2 = 0,counter2 = 0;
        item1 = 0,item2 = 0;
        var one = IRLibLoader.load('/js/bootstrap-slider.min.js', {
            success: function(){ console.log('SUCCESS CALLBACK');},
            error: function(){ console.log('ERROR CALLBACK'); }
        });
        if(one.ready()){
          this.next();
        }

    }
    ,
    onStop: function() {
        Session.set('currentAnswer', '');
        Session.set('parentAnswer', '');
        Session.set('finishQuizz', '');
        Session.set('list_tag', '');
        Session.set('DJIB_LIM',16);
    }
});

Router.route('/details/:id', {
    name: 'details',
    waitOn: function() {
        var title = this.params.id;
        title = title.replace(/\-/g, " ");
        title = title.replace(/\(percentag\)/g, "%");
        title = title.replace(/\(plush\)/g, "+");
        title = title.replace(/\(ocir\)/g, "ô");
        title = title.replace(/\(minus\)/g, "-");
        title = title.replace(/\(copyright\)/g, "®");
        title = title.replace(/\(number\)/g, "°");
        title = title.replace(/\(bigocir\)/g, "Ô");
        title = title.replace(/\(square\)/g, "²");
        title = title.replace(/\(accentaigu\)/g, "`");
        title = title.replace(/\(eaccentaigu\)/g, "é");
        title = title.replace(/\(bigeaccentaigu\)/g, "É");
        title = title.replace(/\(and\)/g, "&");
        title = title.replace(/\(slash\)/g, "/");
        title = title.replace(/\(apostrophe\)/g, "’");
        title = title.replace(/\(quote\)/g, "'");
        title = title.replace(/\(warning\)/g, "!");
        title = title.replace(/\(question\)/g, "?");
        title = title.replace(/\(dolla\)/g, "$");
        title = title.replace(/\(eaccentgrave\)/g, "è");
        title = title.replace(/\(hyphen\)/g, "–");
        //console.log("title title title "+title);
        var getuser=Meteor.userId();
        if(getuser)
            userid=getuser;
        else
            userid=Session.get("userId");
        //return [Meteor.subscribe("rendomProduct", title), Meteor.subscribe("attrdetail", title), TAPi18n.subscribe("detailsParent_tags", title), TAPi18n.subscribe("detailsTags", title), TAPi18n.subscribe("parentattrProDetails"), Meteor.subscribe('membership'),Meteor.subscribe("getFavorite",userid)];
        //return [Meteor.subscribe("rendomProduct", title), TAPi18n.subscribe("parentattrProDetails"), Meteor.subscribe('membership'),Meteor.subscribe("getFavorite",userid)];
        return [Meteor.subscribe('attributeProDetails',-1,title),Meteor.subscribe('randomRelatedProduct',title), TAPi18n.subscribe("parentattrProDetails"), Meteor.subscribe('membership'),Meteor.subscribe("getFavorite",userid)];
    },
    data: function() {
        if (this.ready()) {
            $('.close').click(); //close modal when go to detail
            Session.set('miniature', 0);
            var title = this.params.id;
            title = title.replace(/\-/g, " ");
            title = title.replace(/\(percentag\)/g, "%");
            title = title.replace(/\(plush\)/g, "+");
            title = title.replace(/\(ocir\)/g, "ô");
            title = title.replace(/\(minus\)/g, "-");
            title = title.replace(/\(copyright\)/g, "®");
            title = title.replace(/\(number\)/g, "°");
            title = title.replace(/\(bigocir\)/g, "Ô");
            title = title.replace(/\(square\)/g, "²");
            title = title.replace(/\(accentaigu\)/g, "`");
            title = title.replace(/\(eaccentaigu\)/g, "é");
            title = title.replace(/\(bigeaccentaigu\)/g, "É");
            title = title.replace(/\(and\)/g, "&");
            title = title.replace(/\(slash\)/g, "/");
            title = title.replace(/\(apostrophe\)/g, "’");
            title = title.replace(/\(quote\)/g, "'");
            title = title.replace(/\(warning\)/g, "!");
            title = title.replace(/\(question\)/g, "?");
            title = title.replace(/\(dolla\)/g, "$");
            title = title.replace(/\(eaccentgrave\)/g, "è");
            title = title.replace(/\(hyphen\)/g, "–");

            var prod = products.findOne({ "title": title });
            if (typeof prod != "undefined" && typeof prod.review != "undefined") {
                var list_users = [];
                for (var i = 0; i < prod.review.length; i++) {
                    list_users.push(prod.review[i].user);
                    //console.log(prod.review[i].user);
                }
                Session.set('users_to_subsribe', list_users);
            }
            if (prod != null) {
                var attr = attribute.findOne({ "product": prod.oldId });
                if (attr != null) {
                    Session.set('selected_price', attr.price);
                    Session.set('selected_point', attr.point);
                }
                Session.set('currentCategory', prod.category);
                return prod;
            }
        }
    },
    onAfterAction: function() {
        $('.zoomContainer').remove();
         
        var title = this.params.id;
        title = title.replace(/\-/g, " ");
        title = title.replace(/\(percentag\)/g, "%");
        title = title.replace(/\(plush\)/g, "+");
        title = title.replace(/\(ocir\)/g, "ô");
        title = title.replace(/\(minus\)/g, "-");
        title = title.replace(/\(copyright\)/g, "®");
        title = title.replace(/\(number\)/g, "°");
        title = title.replace(/\(bigocir\)/g, "Ô");
        title = title.replace(/\(square\)/g, "²");
        title = title.replace(/\(accentaigu\)/g, "`");
        title = title.replace(/\(eaccentaigu\)/g, "é");
        title = title.replace(/\(bigeaccentaigu\)/g, "É");
        title = title.replace(/\(and\)/g, "&");
        title = title.replace(/\(slash\)/g, "/");
        title = title.replace(/\(apostrophe\)/g, "’");
        title = title.replace(/\(quote\)/g, "'");
        title = title.replace(/\(warning\)/g, "!");
        title = title.replace(/\(question\)/g, "?");
        title = title.replace(/\(dolla\)/g, "$");
        title = title.replace(/\(eaccentgrave\)/g, "è");
        title = title.replace(/\(hyphen\)/g, "–");

        var prod = products.findOne({ "title": title });
        if (!Meteor.isClient) {
            return;
        }
        var dataDescription = (typeof prod !='undefined')? prod.description.replace(/(\<[^\>]*\>)|(\&nbsp\;)|(\\n)/g, ""):'';
        if (dataDescription.length > 160) {
            dataDescription = dataDescription.trim().substring(0, 160).split(" ").slice(0, -1).join(" ") + "…";
        } else {
            dataDescription = dataDescription.trim().substring(0, dataDescription.length);
        }
        var title = (typeof prod!='undefined')? prod.title:'';
        SEO.set({
            title:  title +" | Safir Iran",
            meta: {
                'description': dataDescription
            },
            og: {
                'title': title + " | Safir Iran",
                'description': dataDescription
            }
        });
    },
    onBeforeAction: function(){
        
        var one = IRLibLoader.load('/elevatezoom/jquery-1.8.3.min.js', {
            success: function(){ console.log('SUCCESS CALLBACK'); this.next();},
            error: function(){ console.log('ERROR CALLBACK'); }
        });
      if(one.ready()){
        //console.log('ready irl1');
        var two = IRLibLoader.load('/elevatezoom/jquery.elevatezoom.js');
        //console.log('ready irl2');
        if(two.ready()){
            
            //console.log('ready irl4');
          this.next();
        }
      }
    }
    /*,onBeforeAction: function(){
        IRLibLoader.load('/elevatezoom/jquery-1.8.3.min.js', {
            success: function(){ 
                console.log('SUCCESS CALLBACK');
                IRLibLoader.load('/elevatezoom/jquery.elevatezoom.js');

            },
            error: function(){ 
                console.log('ERROR CALLBACK'); 
            }
        });
        this.next();
    }*/,
    onStop: function(){
       $(document).ready( function(){
            $('.zoomContainer').remove();
        });


    }
});

Router.route('/detail/:name', {
    name: 'detail',
    template: 'details',
    waitOn: function() {
        return [TAPi18n.subscribe("products", -1), Meteor.subscribe('favorite')];
    },
    data: function() {
        if (this.ready()) {
            Session.set('miniature', 0);
            var title = this.params.name;
            title = title.replace(/\(o-cir\)/g, "ô");
            title = title.replace(/\(plus\)/g, "+");
            title = title.replace(/-/g, " ");
            var prod = products.findOne({ "title": { $regex: new RegExp(title, "i") } });


            if (prod != null) {
                var attr = attribute.findOne({ "product": prod.oldId });
                if (attr != null) {
                    Session.set('selected_price', attr.price);
                    Session.set('selected_point', attr.point);
                }
                Session.set('currentCategory', prod.category);
                return { productde: prod, relateproduct: result };
            }

        }
    }


});

Router.route('/translateproduct/:id', {
    name: 'translateproduct',
    template: 'translateproduct',
    data: function() {
        if (this.ready()) {
            var prod = products.findOne({ "_id": this.params.id });
            if (prod != null) {
                Session.set('currentCategory', prod.category);
                return prod;
            }
        }
    }
});
Router.route('/producttranslate/:id', {
    name: 'producttranslate',
    template: 'producttranslate',
    data: function() {
        if (this.ready()) {
            var prod = products.findOne({ "_id": this.params.id });
            if (prod != null) {
                Session.set('currentCategory', prod.category);
                return prod;
            }
        }

    }
});
Router.route('/translate_category/:id', {
    name: 'translate_category',
    template: 'translate_category',
    data: function() {
        if (this.ready()) {
            var prod = categories.findOne({ "_id": this.params.id });
            if (prod != null) {
                Session.set('currentCategory', prod.category);
                return prod;
            }
        }

    }
});
Router.route('/translateparentTag/:id', {
    name: 'translateparentTag',
    template: 'translateparentTag',
    data: function() {
        if (this.ready()) {
            var prod = parent_tags.findOne({ "_id": this.params.id });
            if (prod != null) {
                Session.set('currentCategory', prod.category);
                return prod;
            }
        }

    }
});
Router.route('/translatTags/:id', {
    name: 'translatTags',
    template: 'translatTags',
    data: function() {
        if (this.ready()) {
            var prod = tags.findOne({ "_id": this.params.id });
            if (prod != null) {
                Session.set('currentCategory', prod.category);
                return prod;
            }
        }

    }
});
Router.route('/translatParent_attr/:id', {
    name: 'translatParent_attr',
    template: 'translatParent_attr',
    data: function() {
        if (this.ready()) {
            var prod = parentattr.findOne({ "_id": this.params.id });
            if (prod != null) {
                Session.set('currentCategory', prod.category);
                return prod;
            }
        }

    }
});

Router.route('/transleattribute_value/:id', {
    name: 'transleattribute_value',
    template: 'transleattribute_value',
    data: function() {
        if (this.ready()) {
            var prod = attribute_value.findOne({ "_id": this.params.id });
            if (prod != null) {
                Session.set('currentCategory', prod.category);
                return prod;
            }
        }

    },
    waitOn: function() {
        return [Meteor.subscribe("attribute", -1), Meteor.subscribe("attribute_value")];
    }
});
Router.route('/transleshops/:id', {
    name: 'transleshops',
    template: 'transleshops',
    data: function() {
        if (this.ready()) {
            var prod = shops.findOne({ "_id": this.params.id });
            if (prod != null) {
                Session.set('currentCategory', prod.category);
                return prod;
            }
        }

    }
});

Router.route('/profile', {
    name: 'profile',
    waitOn: function() {
        var getuser=Meteor.userId();
        if(getuser)
            userid=getuser;
        else
            userid=Session.get("userId");

        return [Meteor.subscribe('currentUserLoggedInImage', getuser), Meteor.subscribe('address'), Meteor.subscribe("question"), Meteor.subscribe("contents_type"), Meteor.subscribe('reachpoint', Meteor.userId()),Meteor.subscribe("getFavorite",userid)];
    },
    onAfterAction: function() {
       
        if (!Meteor.isClient) {
            return;
        }
        SEO.set({
            title: "مشخصات | Safir Iran",
            meta: {
                'description': "سفیر - ویرایش حساب مشخصات خود را، اضافه کردن اطلاعات اضافی شخصی خود را پس از آن شما محصولات زیبایی توصیه که شما مناسب است."
            },
            og: {
                'title': "مشخصات | Safir Iran",
                'description': "سفیر - ویرایش حساب مشخصات خود را، اضافه کردن اطلاعات اضافی شخصی خود را پس از آن شما محصولات زیبایی توصیه که شما مناسب است."
            }
        });
    }
});
Router.route('/editprofile', {
    name: 'editprofile',
    waitOn: function() {
        var getuser=Meteor.userId();
        if(getuser)
            userid=getuser;
        else
            userid=Session.get("userId");
        return [Meteor.subscribe('address'),Meteor.subscribe("getFavorite",userid)];
    }
});

Router.route('/reward', {
    name: 'reward',
    waitOn: function() {
        var getuser=Meteor.userId();
        if(getuser)
            userid=getuser;
        else
            userid=Session.get("userId");
        //return [Meteor.subscribe('currentUserLoggedInImage', getuser), Meteor.subscribe('favorite'), Meteor.subscribe('users', this.userId), Meteor.subscribe("contents_type"), Meteor.subscribe('productsrewards'), Meteor.subscribe('membership'),Meteor.subscribe("getFavorite",userid)];
        return [Meteor.subscribe("categoryTester", userid), Meteor.subscribe('currentUserLoggedInImage', getuser), Meteor.subscribe('users', this.userId), Meteor.subscribe("contents_type"), Meteor.subscribe('membership'),Meteor.subscribe("getFavorite",userid)];

    },
    onAfterAction: function() {
        if (!Meteor.isClient) {
            return;
        }
        SEO.set({
            title: "پاداش و دستیابی | Safir Iran",
            meta: {
                'description': "صرفه جویی در امتیاز خود را در وب سایت سفیر به دستاورد کوپن تخفیف از پاداش از فرم های مختلف از درآمد است. دیگران سود می برند ارائه خواهد شد."
            },
            og: {
                'title': "پاداش و دستیابی | Safir Iran",
                'description': "صرفه جویی در امتیاز خود را در وب سایت سفیر به دستاورد کوپن تخفیف از پاداش از فرم های مختلف از درآمد است. دیگران سود می برند ارائه خواهد شد."
            }
        });
    }
});

// admin categories
Router.route('/managecategory', {
    name: 'managecategory',
    waitOn: function() {
        return [TAPi18n.subscribe('categories')];
    }

});

Router.route('/addcategory', {
    name: 'addcategory'

});

Router.route('/updatecategory/:_id', {
    name: 'updatecategory',
    data: function() {
        if (this.ready()) {
            var id = this.params._id;
            var da = categories.findOne({ _id: id });
            Session.set('multiUploadCategory', '');
            return da;
        }

    }
});

// shop
Router.route('/manageshop', {

    name: 'manageshop'

});

Router.route('/shopdetail/:id', {
    name: 'shopdetail',
    data: function() {
        if (this.ready()) {
            var id = this.params.id;
            var da = shops.findOne({ _id: id });
            return da;
        }
    }
});

Router.route('/updateshop/:_id', {
    name: 'updateshop',
    data: function() {
        if (this.ready()) {
            var id = this.params._id;
            var da = shops.findOne({ _id: id });
            return da;
        }
    }
});


Router.route('/manageparenttag', {
    name: 'manageparenttag',
    waitOn: function() {
        return [TAPi18n.subscribe('parent_tags')];
    }

});

Router.route('/updateparenttag/:_id', {
    name: 'updateparenttag',

    data: function() {
        if (this.ready()) {
            var id = this.params._id;
            var result = parent_tags.findOne({ _id: id });
            return result;
        }
    },
    waitOn: function() {
        return [TAPi18n.subscribe('parent_tags')];
    }

});


Router.route('/managetag', {

    name: 'managetag',
    waitOn: function() {
        return [TAPi18n.subscribe('parent_tags'), TAPi18n.subscribe("tags")];
    }

});
Router.route('/edittag/:_id', {
    name: 'edittag',
    data: function() {
        if (this.ready()) {
            return tags.findOne({ _id: this.params._id });
        }
    },
    waitOn: function() {
        return [TAPi18n.subscribe('parent_tags'), TAPi18n.subscribe("tags")];
    }

});

Router.route('/listproducts/:brand', {
    name: 'listproducts',
    waitOn: function() {
        return [TAPi18n.subscribe('products', -1)];
    },
    data: function() {
        if (this.ready()) {
            Session.set('limit', -1);
            Session.set('querylimit', 16);
            var brand = this.params.brand;
            var result = products.find({ "Brand": brand }, { limit: Session.get('querylimit') });
            Session.set('nbproducts', result.fetch().length);
            return result;
        }

    }
});
Router.route('/advanced', {
    name: 'advanced',
    template: 'listproducts',
    waitOn: function() {
        //=========
        var list_categories = [];
        if (Session.get('currentCategory') && Session.get('currentCategory') != 'undefined') {
           
            list_categories.push(Session.get('currentCategory'));
       
            Session.set('advanced_product', 1);
            var brands = Session.get('advanced_brand');
            var mytags = Session.get('advanced_tags');
            var cats = Session.get('currentCategory');
            var maxPrice = Session.get('advanced_price_max');
            var max_price = maxPrice.toString();
            //console.log('Advance:', cats);
            var name = cats.title;
            // console.log('Cat Name:', name);
            // console.log('Max Price:', max_price);
            //var numclick = Session.get("clickbrand");
            //if( numclick <= 0)
                return [TAPi18n.subscribe('advanceSearch', -1, cats, brands, mytags, max_price), TAPi18n.subscribe('categories'), TAPi18n.subscribe('categoryParent_tags', name), TAPi18n.subscribe('categoryTags', name), Meteor.subscribe('attrlistproduct', name,16)];//*, TAPi18n.subscribe('parent_tags_advance',list_categories), TAPi18n.subscribe('tags')];Meteor.subscribe('attradvace', list_categories)];
        }
    },
    data: function() {
        if (this.ready()) {
            if (Session.get('currentCategory') && Session.get('currentCategory') != 'undefined') {
                var strbrands = Session.get('advanced_brand');
                var strtags = Session.get('advanced_tags');
                var cats = Session.get('currentCategory');
                var maxPrice = Session.get('advanced_price_max');
                var max_price = maxPrice.toString();
                if( typeof cats !='undefined' && cats != ''){
                   
                    var list_categories = [];
                    var lvl1 = categories.find({ "parent": cats._id}).fetch();
                    for (var i = 0; i < lvl1.length; i++) {
                        var cur1 = lvl1[i]._id;
                        list_categories.push(cur1);
                        var lvl2 = categories.find({ "parent": cur1 }).fetch();
                        for (var j = 0; j < lvl2.length; j++) {
                            var cur2 = lvl2[j]._id;
                            list_categories.push(cur2);
                            var lvl3 = categories.find({ "parent": cur2 }).fetch();
                            for (var k = 0; k < lvl3.length; k++) {
                                var cur3 = lvl3[k]._id;
                                list_categories.push(cur3);
                                var lvl4 = categories.find({ "parent": cur3 }).fetch();
                                for (var l = 0; l < lvl4.length; l++) {
                                    var cur4 = lvl4[l]._id;
                                    list_categories.push(cur4);
                                }
                            }
                        }
                    }
                }else{
                    var allCat = categories.find({}).fetch();
                    for (var i = 0; i < allCat.length; i++) {
                        list_categories.push(allCat[i]._id);
                    }
                }

                brands = strbrands.split(";");
                mytags = strtags.split(";");
                brands = brands.filter(function(n){ return n != "" }); 
                mytags = mytags.filter(function(n){ return n != "" }); 
                // console.log('Brands:', brands);
                // console.log('Tags:', mytags);
                // console.log('Cats:', list_categories);
                if( brands.length >0 && mytags.length <= 0){
                    var numall = products.find({ category: { $in:  list_categories }, Brand:{ $in:brands}, price:{$lte:max_price} }).fetch();
                }
                else if( brands.length <= 0 && mytags.length >0 ){
                    var numall = products.find({ category: { $in:  list_categories }, "tags.value": { $in: mytags }, price:{$lte:max_price}  }).fetch();
                }
                else if( brands.length >0  && mytags.length > 0 ){
                    var numall = products.find({ category: { $in:  list_categories }, Brand:{ $in:brands}, "tags.value": { $in: mytags }, price:{$lte:max_price} }).fetch();
                }else if( brands.length <= 0 && mytags.length <= 0){
                    var numall = products.find({ category: { $in: list_categories }, price:{$lte:max_price} }).fetch();
                }

                var len = numall.length;
                var rest = len % 16;
                
                var page = len / 16;
                page = parseInt(page, 10)
               

                
                /*if( Session.get('OLDBRANDS') != strbrands){
                    Session.set('itemsLimit', 16);
                }
                Session.set('OLDBRANDS', strbrands)
                if( Session.get('OLDTAGS') != strtags){
                    Session.set('itemsLimit', 16);
                }
                Session.set('OLDTAGS', strtags)
                if( Session.get('OLDCATS') && Session.get('OLDCATS').length != list_categories.length){
                    Session.set('itemsLimit', 16);
                }
                Session.set('OLDCATS', list_categories.length)
                */
                var querylimit = Session.get('itemsLimit');
                if( querylimit <= len )
                    querylimit = querylimit;
                else
                    querylimit = (page * 16) + rest;

                if( brands.length >0 && mytags.length <= 0){
                    var result = products.find({ category: { $in:  list_categories }, Brand:{ $in:brands}, price:{$lte:max_price} }, {limit:querylimit})
                }
                else if( brands.length <= 0 && mytags.length >0 ){
                    var result = products.find({ category: { $in:  list_categories }, "tags.value": { $in: mytags }, price:{$lte:max_price}  }, {limit:querylimit})
                }
                else if( brands.length >0  && mytags.length > 0 ){
                    var result = products.find({ category: { $in:  list_categories }, Brand:{ $in:brands}, "tags.value": { $in: mytags }, price:{$lte:max_price} },{limit:querylimit})
                }else if( brands.length <= 0 && mytags.length <= 0){
                    var result = products.find({ category: { $in: list_categories }, price:{$lte:max_price} }, {limit:querylimit});
                }
                Session.set('nbproducts', querylimit );
                Session.set('allproducts', len);
                //console.log(' RESULT', result.count())
                return { products: result, category: cats };
            }else {
                return
            }
        }
            /*console.log('Cate:', list_categories);
            console.log('Brands:', list_brand);
            console.log('Tags:', list_tags);
            if( list_brand.length >0  && tags.length <= 0){
                console.log('Brand Value:');
            //var result = products.find({ $and: [{ category: { $in: list_categories } }, { Brand: { $in: [brands] } }] });
                var result = products.find({ category: { $in:  list_categories }, Brand:{ $in:list_brand} },{ limit: querylimit })
            //var result = products.find({ category: { $in:  [ 'eSQn6gJnXNrd4W9WW', 'gZRuiAjyXTfcHYZ9t', 'vxvyWfDBSpcTdJyfE' ] }, Brand:{ $in:["Axis"]} });
            }
            else if( list_brand.length <= 0 && tags.length > 0 ){
                //find by tags list
                console.log('Tag Value:');
                var result = products.find({ category: { $in:  list_categories }, "tags.value": { $in: list_tags }  }, { limit: querylimit })
            }
            else if( list_brand.length > 0 && tags.length > 0 ){
                console.log('Tag & Brand:');
                var result = products.find({ category: { $in:  list_categories }, Brand:{ $in:list_brand}, "tags.value": { $in: list_tags } }, { limit: querylimit })
            }else if( list_brand.length <= 0 && tags.length <= 0){
                console.log('No Value & No Brand:');
                var result = products.find({ category: { $in: list_categories } });
            }
            console.log('RESULT:', result.fetch().length);
            */
    },
    onBeforeAction : function(){
        item1 = 0,counter1 = 0,item2 = 0,counter2 = 0;
        item1 = 0,item2 = 0;
        var one = IRLibLoader.load('/js/bootstrap-slider.min.js', {
            success: function(){ console.log('SUCCESS CALLBACK');},
            error: function(){ console.log('ERROR CALLBACK'); }
        });
        if(one.ready()){
          this.next();
        }

    }
});


Router.route('/advanced2', {
    name: 'advanced2',
    template: 'listproducts2',
    waitOn: function() {
        var list_categories = [];
            if (Session.get('currentCategory') == '' || Session.get('currentCategory') == 'undefined') {
                var allCat = categories.find({}).fetch();
                for (var i = 0; i < allCat.length; i++) {

                    list_categories.push(allCat[i]._id);
                    //console.log('list_categories ARRAY'+JallCat[i]._id);

                }

            } else {
                list_categories.push(Session.get('currentCategory'));

                var lvl1 = categories.find({ "parent": Session.get('currentCategory') }).fetch();
                for (var i = 0; i < lvl1.length; i++) {
                    var cur1 = lvl1[i]._id;
                    list_categories.push(cur1);
                    var lvl2 = categories.find({ "parent": cur1 }).fetch();
                    for (var j = 0; j < lvl2.length; j++) {
                        var cur2 = lvl2[j]._id;
                        list_categories.push(cur2);
                        var lvl3 = categories.find({ "parent": cur2 }).fetch();
                        for (var k = 0; k < lvl3.length; k++) {
                            var cur3 = lvl3[k]._id;
                            list_categories.push(cur3);
                            var lvl4 = categories.find({ "parent": cur3 }).fetch();
                            for (var l = 0; l < lvl4.length; l++) {
                                var cur4 = lvl4[l]._id;
                                list_categories.push(cur4);
                            }
                        }
                    }
                }
            }

            var list_brand = [];
            var list_tags = [];

            if (Session.get('advanced_brand') != '')
                list_brand = Session.get('advanced_brand').split(';');
            if (Session.get('advanced_tags') != '')
                list_tags = Session.get('advanced_tags').split(';');
            if (list_brand.length == 0) {

                var allProducts = products.find().fetch();
                for (var i = 0; i < allProducts.length; i++) {
                    if (list_brand.indexOf(allProducts[i].Brand) < 0)
                        list_brand.push(allProducts[i].Brand);
                }

            }
        // console.log('list_categories up'+JSON.stringify(list_categories));
        // console.log('list_tags up up'+list_tags);
        // console.log('list_brand up'+list_brand);
        return [Meteor.subscribe('productsAdvance',list_tags.length,list_categories,list_brand), TAPi18n.subscribe('categories'), TAPi18n.subscribe('parent_tags_advance',list_categories), TAPi18n.subscribe('tagsAdvance',list_categories), Meteor.subscribe('attradvace', list_tags.length,list_categories,list_brand)];
        // var list_categories = [];
        // if (Session.get('currentCategory') == '' || Session.get('currentCategory') == 'undefined') {
        //     var allCat = categories.find({}).fetch();
        //     for (var i = 0; i < allCat.length; i++) {

        //         list_categories.push(allCat[i]._id);
        //     }

        // } else {
        //     list_categories.push(Session.get('currentCategory'));
        // }
        // return [TAPi18n.subscribe('products', -1), TAPi18n.subscribe('categories'), TAPi18n.subscribe('parent_tags_advance',list_categories), TAPi18n.subscribe('tags'), Meteor.subscribe('attradvace', list_categories)];
    },
    data: function() {
        if (this.ready()) {
            var list_categories = [];
            if (Session.get('currentCategory') == '' || Session.get('currentCategory') == 'undefined') {
                var allCat = categories.find({}).fetch();
                for (var i = 0; i < allCat.length; i++) {

                    list_categories.push(allCat[i]._id);
                }

            } else {
                list_categories.push(Session.get('currentCategory'));

                var lvl1 = categories.find({ "parent": Session.get('currentCategory') }).fetch();
                for (var i = 0; i < lvl1.length; i++) {
                    var cur1 = lvl1[i]._id;
                    list_categories.push(cur1);
                    var lvl2 = categories.find({ "parent": cur1 }).fetch();
                    for (var j = 0; j < lvl2.length; j++) {
                        var cur2 = lvl2[j]._id;
                        list_categories.push(cur2);
                        var lvl3 = categories.find({ "parent": cur2 }).fetch();
                        for (var k = 0; k < lvl3.length; k++) {
                            var cur3 = lvl3[k]._id;
                            list_categories.push(cur3);
                            var lvl4 = categories.find({ "parent": cur3 }).fetch();
                            for (var l = 0; l < lvl4.length; l++) {
                                var cur4 = lvl4[l]._id;
                                list_categories.push(cur4);
                            }
                        }
                    }
                }
            }

            Session.set('limit', -1);
            Session.set('oldUrlId', '')
            if (Session.get('advancedlimit') !== 'advanced') {
                Session.set('querylimit', 16);
                Session.set('advancedlimit', 'advanced');
            }
            var list_brand = [];
            var list_tags = [];
            var review_part = {};

            if (Session.get('advanced_brand') != '')
                list_brand = Session.get('advanced_brand').split(';');
            if (Session.get('advanced_tags') != '')
                list_tags = Session.get('advanced_tags').split(';');

            var priceMin = 0;
            if (Session.get('advanced_price_min') != "")
                priceMin = Number(Session.get('advanced_price_min'));

            var priceMax = Number.MAX_VALUE;
            if (Session.get('advanced_price_max') != "")
                priceMax = Session.get('advanced_price_max');
            priceMax = Number(priceMax);

            var has_comment = Session.get('advanced_has_comment');
            var is_favorite = Session.get('advanced_is_favorite');

            if (list_brand.length == 0) {

                var allProducts = products.find().fetch();
                for (var i = 0; i < allProducts.length; i++) {
                    if (list_brand.indexOf(allProducts[i].Brand) < 0)
                        list_brand.push(allProducts[i].Brand);
                }

            }
            //alert('list_brand='+list_brand);
            //console.log('list_brand='+list_brand);

            /*
            if(list_tags.length==0){
                var allProducts=products.find();
                for(var i=0;i<allProducts.length;i++){
                    if(list_tags.indexOf(allProducts[i].Brand)==-1)
                        list_brand.push(allProducts[i].Brand);
                }
            }{review : {$exists:true}, {$where:'this.review.length>0'}}
            */

            //alert('PriceMin= '+priceMin);
            //alert('PriceMax= '+priceMax);
            // console.log('list_categories='+list_categories);
            //console.log('list_brand='+list_brand);
            //console.log('queryLimit:'+Session.get('querylimit'));
            var arrayobj = [];
            /*if(has_comment==0){DfwSwoSezQetwuGYy
                var result = products.find({$and:[{category:{$in:list_categories}},{Brand:{$in:list_brand}}]});
                result.forEach(function(value){
                    if(value.price>=priceMin && value.price<priceMax){
                        //alert('hello');
                        arrayobj.push(value);
                    }
                });
            }
            else{*/
            //console.log('list_categories under'+list_categories);

            if (list_tags.length > 0) {
                var result = products.find({ $and: [{ category: { $in: list_categories } }, { Brand: { $in: list_brand } }, { "tags.value": { $in: list_tags } }] }, { limit: Session.get('querylimit') });
            } else {
                var result = products.find({ $and: [{ category: { $in: list_categories } }, { Brand: { $in: list_brand } }] }, { limit: Session.get('querylimit') });
            }
            result.forEach(function(value) {
                if (typeof value.price === "undefined") {
                    arrayobj.push(value);
                } else {
                    if (value.price >= priceMin && value.price < priceMax) {
                        arrayobj.push(value);
                    }
                }

            });

            Session.set('nbproducts', arrayobj.length);
            var Tosort = Session.get("GETName");
            if (Tosort == 'name') {
                var Arrobj = arrayobj.sort(function(a, b) {
                    if (a.title < b.title)
                        return -1;
                    else if (a.title > b.title)
                        return 1;
                    else
                        return 0;
                });
                return { products: Arrobj };
            } else if (Tosort == 'price') {
                var Arrobj = arrayobj.sort(function(a, b) {
                    var acon = Number(a.price);
                    var bcon = Number(b.price);
                    if (acon < bcon)
                        return 1;
                    else if (acon > bcon)
                        return -1;
                    else
                        return 0;
                });
                return { products: Arrobj };
            } else if (Tosort == 'sell') {
                var Arrobj = arrayobj.sort(function(a, b) {
                    if (a.ratio < b.ratio)
                        return 1;
                    else if (a.ratio > b.ratio)
                        return 1;
                    else
                        return 0;
                });
                return { products: Arrobj };
            } else {
                return { products: arrayobj };
            }
        }
    }
});


Router.route('/favorite', {
    name: 'fav',
    // template: 'listproducts',
    waitOn: function() {
        Session.set("limitFavorite", 16);
        var getuser=Meteor.userId();
        if(getuser){
            userid=getuser;
        }else{
            userid=Session.get("userId");
        }
        return [TAPi18n.subscribe("productFavorite"),Meteor.subscribe("getAttrFavorite",userid),Meteor.subscribe("getFavorite",userid), Meteor.subscribe('attribute',Meteor.userId())];
    },
    data: function() {
        if (this.ready()) {
            /*var userId = getFavUserId();
        var data = favorite.find({ userId: userId }, { limit: 20 });
        var obj = {};
        var object = [];
        console.log('Count:'+ data.count() );
        if( data.count() > 0){
            data.forEach(function(entry, index) {
                var proid = entry.proId;
                obj = products.findOne({ _id: proid });
                object.push(obj);
            });
        }
       
         return { products: object };
        */
            //Session.set('nbproducts', object.length);
            //return { products: object };

            Session.set('limit', -1);
            var userId = getFavUserId();
            var numall = favorite.find({ userId: userId }).fetch();
            var len = numall.length;
            var rest = len % 16;
            
            var page = len / 16;
            page = parseInt(page, 10)
        
            var querylimit = Session.get('limitFavorite');
            //console.log('QUERY:',querylimit)
            if( querylimit <= len )
                limitshow = querylimit;
            else
                limitshow = (page * 16) + rest;
            // console.log('length:', len);
            // console.log('rest:', rest);
            // console.log('page:', page);
            // console.log('querylimit:', querylimit);
            // console.log('limitshow:', limitshow);

            var parent = this.params.id;
            if (Session.get('oldUrlId') !== parent) {
                Session.set('itemsLimit', 16);
            }
            Session.set('oldUrlId', parent);
            var object = [];
            var ses = false;
           
            var data = favorite.find({ userId: userId }, { limit: limitshow });
            var obj = {};
            data.forEach(function(entry) {
                var proid = entry.proId;
                var like = "#like" + entry.proId;
                var unlike = "#unlike" + entry.proId;
                $(like).removeClass('nonelike');
                $(unlike).addClass('nonelike');
                obj = products.findOne({ _id: proid });
                object.push(obj);

            });
            Session.set('nbproducts', object.length);
            return { products: object };

        }
    },
    onAfterAction: function() {

    },
    onBeforeAction: function(){
        (function(d) {
            var f = d.getElementsByTagName('SCRIPT')[0],
                p = d.createElement('SCRIPT');
            p.type = 'text/javascript';
            p.async = true;
            p.src = '//assets.pinterest.com/js/pinit.js';
            f.parentNode.insertBefore(p, f);

        }(document));
         this.next();
    }

});

Router.route('/searchproduct/:slug', {
    template: 'searchproduct',
    waitOn: function() {
        var getuser=Meteor.userId();
        if(getuser)
            userid=getuser;
        else
            userid=Session.get("userId");
        var keyword = Session.get('keyword');
        keyword=cleanTitle(keyword);
        var dataGroup = Session.get('groupsearch');
        //console.log('Keyword:', keyword);
        //console.log('dataGroup:', dataGroup);
        if( keyword!= '')
            return [Meteor.subscribe("searchProductKeyword",keyword,dataGroup), TAPi18n.subscribe('categories'), Meteor.subscribe("contents"), Meteor.subscribe("contents_type"),Meteor.subscribe("getFavorite",userid)];
    },
    data: function() {
        if (this.ready()) {

            var productsearch = Session.get('keyword');
            productsearch=cleanTitle(productsearch);
            //var productsearch = this.params.slug;
            // alert("ok" + productsearch);
            // var keyword = Session.get('keyword');
            // console.log('parameter:'+keyword);
            /*var keyword = Session.get('keyword');
            console.log('parameter:'+keyword);
            if(keyword==""){
                Session.set('nbproducts',0);
                return null;
            }
                
            var result = "";
            result = products.find({title: {$regex: new RegExp(keyword, "i")}},{limit:Session.get('querylimit')});
            Session.set('nbproducts',result.fetch().length);
            console.log("pro:"+result.count());
            return result;
            */

            var numall = products.find().fetch();
            var len = numall.length;
            var rest = len % 16;
            
            var page = len / 16;
            page = parseInt(page, 10)
        
            var querylimit = Session.get('itemsLimit');
            //console.log('QUERY:',querylimit)
            if( querylimit <= len )
                querylimit = querylimit;
            else
                querylimit = (page * 16) + rest;

            var keyword = this.params.slug;
            if (Session.get('oldKey') !== keyword) {
                Session.set('itemsLimit', 16);
            }
            
            //console.log('itemsLimit:', querylimit)
            Session.set('oldKey', keyword);
            var groupid = parseInt(Session.get('groupsearch'));
            if (keyword != "") {
            
                var result = [];
                var result1 = [];
                if (groupid == 1) {
                   // console.log('search products');
                    result = products.find(
                {$and : [
                    { $or : [
                        { title: { $regex: new RegExp(productsearch, "i") } }, 
                        { Brand: { $regex: new RegExp(productsearch, "i") } },
                        { tag_quizz: { $regex: new RegExp(productsearch, "i") } },
                        //{ tags.value: { $regex: new RegExp(name, "i") } },
                        { description: { $regex: new RegExp(productsearch, "i") } }]
                    },
                    { category: { $ne: 'tester' } }
                    ]}
                ).fetch();
                    var dataCount = result.length;
                    Session.set("searchall", "");
                } else if (groupid == 4) {
                    //console.log('search webzine');
                    var webzine = contents_type.findOne({ type: "Webzine" });
                    result1 = contents.find({ $or: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }, { content: { $regex: new RegExp(keyword, "i") } }], typeid: webzine._id }, { limit: querylimit }).fetch();
                    Session.set("searchall", "");
                } else if (groupid == 5) {
                    //console.log('search tuto');
                    var tuto = contents_type.findOne({ type: "Tuto" });
                    result1 = contents.find({ $or: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }, { content: { $regex: new RegExp(keyword, "i") } }], typeid: tuto._id }, { limit: querylimit }).fetch();
                    Session.set("searchall", "");

                } else {
                    //console.log('search all on all');
                    result = products.find(
                {$and : [
                    { $or : [
                        { title: { $regex: new RegExp(productsearch, "i") } }, 
                        { Brand: { $regex: new RegExp(productsearch, "i") } },
                        { tag_quizz: { $regex: new RegExp(productsearch, "i") } },
                        //{ tags.value: { $regex: new RegExp(name, "i") } },
                        { description: { $regex: new RegExp(productsearch, "i") } }]
                    },
                    { category: { $ne: 'tester' } }
                    ]}
                ).fetch();
                    var dataCount = result.length;
                    result1 = contents.find({ $or: [{ title: { $regex: new RegExp(keyword, "i") } }, { tag_quizz: { $regex: new RegExp(keyword, "i") } }, { "tags.value": { $regex: new RegExp(keyword, "i") } }, { content: { $regex: new RegExp(keyword, "i") } }] }, { limit: querylimit }).fetch();
                    Session.set("searchall", 1);

                }
                // console.log('itemsLimitLastShow:', querylimit)
                // console.log('Count Product:', result.length);
                Session.set('nbproducts', result.length);
                Session.set('nbcontents', result1.length);
                return { product: result, content: result1, dataCount: dataCount };

            } else {
                Session.set('nbproducts', 0);
                Session.set('nbcontents', 0);
                return;
            }
        }
    }
});

Router.route('/brand/:slug', {
    template: 'searchproduct',
    waitOn: function() {
        var getuser=Meteor.userId();
        if(getuser)
            userid=getuser;
        else
            userid=Session.get("userId");
        var keyword = Session.get('keyword');
        keyword=cleanTitle(keyword);
        var dataGroup = Session.get('groupsearch');
        //console.log('Keyword:', keyword);
        //console.log('dataGroup:', dataGroup);
        var brandname  = this.params.slug; 
        return [Meteor.subscribe("searchProductBrand",brandname), TAPi18n.subscribe('categories'), Meteor.subscribe("contents"), Meteor.subscribe("contents_type"),Meteor.subscribe("getFavorite",userid)];
    },
    data: function() {
        if (this.ready()) {
            //var keyword=Session.get('keyword');
            //var productsearch = Session.get('keyword');
            //productsearch=cleanTitle(productsearch);
            var keyword  = this.params.slug; 

            //console.log('itemsLimit:', querylimit)
            
            if (keyword != "") {
            
                var result = [];
                var result1 = [];
            
                    //console.log('search all on all');
                    result = products.find({Brand:keyword}).fetch();
                    var dataCount = result.length;
                    
                    Session.set("searchall", 1);

                
                // console.log('itemsLimitLastShow:', querylimit)
                // console.log('Count Product:', result.length);
                Session.set('nbproducts', result.length);
                Session.set('nbcontents', 0);
                return { product: result, content: null, dataCount: result.length };

            
        }
    }
}
});

Router.route('/checkout', {
    name: 'checkout',
    waitOn: function() {
        // var userId = getCurrentUserId();
        // return [Meteor.subscribe("rendomProductCheckout",Session.get("userId") ),TAPi18n.subscribe('parentattr'), Meteor.subscribe("cart", Session.get('userId')),Meteor.subscribe("getFavorite",Meteor.userId())];

        var userId = Session.get("userId");
        //console.log("userid= "+userId);
        if(userId!=null || userId!= "undefined")
            //return [Meteor.subscribe("publishProductCheckout", userId ),TAPi18n.subscribe('parentattr'), Meteor.subscribe("cart", Session.get('userId')),Meteor.subscribe("favorite",Meteor.userId())];
            return [TAPi18n.subscribe('parentattr'),Meteor.subscribe("favorite",Meteor.userId())];
        else
            return [];
    }
});

Router.route('/news', {
    name: 'webzinelisting',
    waitOn: function() {
        var getuser=Meteor.userId();
        if(getuser){
            userid=getuser;
        }else{
            userid=Session.get("userId");
        }
        return [Meteor.subscribe('contents'), Meteor.subscribe('banner'), Meteor.subscribe("contents_type"),Meteor.subscribe("getFavorite",userid)];
    },
    data: function(){
        if( this.ready() ){
            Session.set('WEBZINELISTING', 1)
        }
    },
    onBeforeAction:function(){
        var one = IRLibLoader.load('/js/js-image-slider.js');
        if(one.ready()){
            this.next();
        }
    },
    onAfterAction: function() {
        if (!Meteor.isClient) {
            return;
        }
        
        SEO.set({
            title: "آرایشی مقاله ، Webzine در | Safir Iran",
            meta: {
                'description': "خودتان را در سفیر آرایشی Webzine در ، کشف زیبایی های اصلی خود را برای مطابقت با انواع محصول زیبایی دیگران است."
            },
            og: {
                'title': "آرایشی مقاله ، Webzine در | Safir Iran",
                'description': "خودتان را در سفیر آرایشی Webzine در ، کشف زیبایی های اصلی خود را برای مطابقت با انواع محصول زیبایی دیگران است."
            }
        });

    }
});
Router.route('/webzinedetails/:_id', {
    name: 'webzinedetails',
    data: function() {
        if (this.ready()) {
            var name = this.params._id;
            name = name.replace(/-/g, " ");
            var con = contents.findOne({ "title": { $regex: new RegExp(name, "i") } });
            var data = '';
            if (con) {
                var img_id = con.image[0];
                var url = getImg(img_id);
                data = { result: con, img_url: url };
            }
            return data;
        }
    },
    waitOn: function() {
        var name = this.params._id;
        name = name.replace(/-/g, " ");
        var title = name;
        title = title.replace(/\-/g, " ");
        title = title.replace(/\(percentag\)/g, "%");
        title = title.replace(/\(plush\)/g, "+");
        title = title.replace(/\(ocir\)/g, "ô");
        title = title.replace(/\(minus\)/g, "-");
        title = title.replace(/\(copyright\)/g, "®");
        title = title.replace(/\(number\)/g, "°");
        title = title.replace(/\(bigocir\)/g, "Ô");
        title = title.replace(/\(square\)/g, "²");
        title = title.replace(/\(accentaigu\)/g, "`");
        title = title.replace(/\(eaccentaigu\)/g, "é");
        title = title.replace(/\(bigeaccentaigu\)/g, "É");
        title = title.replace(/\(and\)/g, "&");
        title = title.replace(/\(slash\)/g, "/");
        title = title.replace(/\(apostrophe\)/g, "’");
        title = title.replace(/\(quote\)/g, "'");
        title = title.replace(/\(warning\)/g, "!");
        title = title.replace(/\(question\)/g, "?");
        title = title.replace(/\(dolla\)/g, "$");
        title = title.replace(/\(eaccentgrave\)/g, "è");
        title = title.replace(/\(hyphen\)/g, "–");

        var getuser=Meteor.userId();
        if(getuser){
            userid=getuser;
        }else{
            userid=Session.get("userId");
        }

        return [Meteor.subscribe('contentsdetail', title), Meteor.subscribe("productsWebzine", -1, title), Meteor.subscribe("contents_type"),Meteor.subscribe("getFavorite",userid)];

    },
    onAfterAction: function() {
        var name = this.params._id;
        name = name.replace(/-/g, " ");
        var data = this.data();
        var result = data.result;
        //console.log(result);
        if (!Meteor.isClient) {
            return;
        }
        if (result.content) {
            var contentDesc = result.content.replace(/(\<[^\>]*\>)|(\&nbsp\;)|(\\n)|(\s\s+)/g, "");
            if (contentDesc.length > 160) {
                contentDesc = contentDesc.trim().substring(0, 160).split(" ").slice(0, -1).join(" ") + "…";
            } else {
                contentDesc = contentDesc.trim().substring(0, contentDesc.length);
            }
        }
        SEO.set({
            title: result.title + " | Safir Iran",
            meta: {
                'description': result.content
            },
            og: {
                'title': result.title + " | Safir Iran",
                'image': data.img_url
            }
        });
    }
});

Router.route('/addContent', {
    name: 'addContent',
    template: 'addContent',
    waitOn: function() {
        return [Meteor.subscribe("contents_type")];
    }
});

Router.route('/updateContent/:_id', {
    name: 'updateContent',
    data: function() {
        if (this.ready()) {
            return contents.findOne({ _id: this.params._id });
        }
    },
    waitOn: function() {
        return [Meteor.subscribe("images"), Meteor.subscribe("contents"), Meteor.subscribe("contents_type")];
    }

});

Router.route('/managecontent', {
    name: 'managecontent',
    waitOn: function() {
        return [Meteor.subscribe('contents')];
    }
});
//end kis

//Parent Attribute
Router.route('/parentattr', {
    name: 'parentattr',
    waitOn: function() {
        return [TAPi18n.subscribe("parentattr")];
    }

});

Router.route('/editparentattr/:_id', {
    name: 'editparentattr',
    data: function() {
        if (this.ready()) {
            return parentattr.findOne({ _id: this.params._id });
        }
    },
    waitOn: function() {
        return [TAPi18n.subscribe("parentattr")];
    }

});
//Attribute
Router.route('/attribute', {
    name: 'attribute',
    waitOn: function() {
        return [Meteor.subscribe("attribute", -1), TAPi18n.subscribe("parentattr"), Meteor.subscribe('attribute_value')];
    }
});

Router.route('/editattr/:_id', {
    name: 'editattr',
    data: function() {
        if (this.ready()) {
            var attr = attribute.findOne({ _id: this.params._id });
            Session.setPersistent('id', attr.productImage); //store field productImage to use in helper to get file dispay
            Session.setPersistent('attrId', this.params._id); //store id attribute to use delete file
            var id = attr.parentId;
            var parent = parentattr.findOne({ _id: id })
            Session.setPersistent('parentID', parent._id); //store id parent attribute to find where not equal parentId
            var dataAll = {
                attr: attr,
                parent: parent
            }
            return dataAll;
        }
    },
    waitOn: function() {
        return [Meteor.subscribe("attribute", -1), TAPi18n.subscribe("parentattr")];
    }

});
Router.route('/tutolisting/:_id', {
    name: 'tutolisting',
    data: function() {
        if (this.ready()) {
            var name = this.params._id;
            //console.log('mytuto:' + name);
            name = name.replace(/-/g, " ");
           // console.log('mytuto:' + name);
            var cat = categories.findOne({ "title": name });
            if(!cat)
                cat = categories.findOne({ "i18n.en.title": name });
            //console.log('mytutoCat:' + cat);
            if (cat == null)
                cat = categories.findOne({ "i18n.en.title": { $regex: new RegExp(name, "i") } });
            return cat;
        }
    },
    waitOn: function() {
        var getuser=Meteor.userId();
        if(getuser){
            userid=getuser;
        }else{
            userid=Session.get("userId");
        }

        return [Meteor.subscribe("contents"),TAPi18n.subscribe("categories"), Meteor.subscribe("contents_type"),Meteor.subscribe("getFavorite",userid)];
    },
    onAfterAction: function() {

        var name = this.params._id;
        name = name.replace(/-/g, " ");
        var cat = categories.findOne({ "title": { $regex: new RegExp("^" + name, "i") } });
        if (cat == null)
            var title = name;
        title = title.replace(/\-/g, " ");
        title = title.replace(/\(percentag\)/g, "%");
        title = title.replace(/\(plush\)/g, "+");
        title = title.replace(/\(ocir\)/g, "ô");
        title = title.replace(/\(minus\)/g, "-");
        title = title.replace(/\(copyright\)/g, "®");
        title = title.replace(/\(number\)/g, "°");
        title = title.replace(/\(bigocir\)/g, "Ô");
        title = title.replace(/\(square\)/g, "²");
        title = title.replace(/\(accentaigu\)/g, "`");
        title = title.replace(/\(eaccentaigu\)/g, "é");
        title = title.replace(/\(bigeaccentaigu\)/g, "É");
        title = title.replace(/\(and\)/g, "&");
        title = title.replace(/\(slash\)/g, "/");
        title = title.replace(/\(apostrophe\)/g, "’");
        title = title.replace(/\(quote\)/g, "'");
        title = title.replace(/\(warning\)/g, "!");
        title = title.replace(/\(question\)/g, "?");
        title = title.replace(/\(dolla\)/g, "$");
        title = title.replace(/\(eaccentgrave\)/g, "è");
        title = title.replace(/\(hyphen\)/g, "–");
        cat = categories.findOne({ "i18n.en.title": { $regex: new RegExp("^" + title, "i") } });
        if (!Meteor.isClient) {
            return;
        }
        SEO.set({
            title: cat.title + " | Safir Iran",
            meta: {
                'description': cat.description
            },
            og: {
                'title': cat.title + " | Safir Iran",
                'description': cat.description
            }
        });
    }
});
Router.route('/tutodetails/:_id', {
    name: 'tutodetails',
    waitOn: function() {
        var name = this.params._id;
        name = name.replace(/-/g, " ");
        var title = name;
        title = title.replace(/\-/g, " ");
        title = title.replace(/\(percentag\)/g, "%");
        title = title.replace(/\(plush\)/g, "+");
        title = title.replace(/\(ocir\)/g, "ô");
        title = title.replace(/\(minus\)/g, "-");
        title = title.replace(/\(copyright\)/g, "®");
        title = title.replace(/\(number\)/g, "°");
        title = title.replace(/\(bigocir\)/g, "Ô");
        title = title.replace(/\(square\)/g, "²");
        title = title.replace(/\(accentaigu\)/g, "`");
        title = title.replace(/\(eaccentaigu\)/g, "é");
        title = title.replace(/\(bigeaccentaigu\)/g, "É");
        title = title.replace(/\(and\)/g, "&");
        title = title.replace(/\(slash\)/g, "/");
        title = title.replace(/\(apostrophe\)/g, "’");
        title = title.replace(/\(quote\)/g, "'");
        title = title.replace(/\(warning\)/g, "!");
        title = title.replace(/\(question\)/g, "?");
        title = title.replace(/\(dolla\)/g, "$");
        title = title.replace(/\(eaccentgrave\)/g, "è");
        title = title.replace(/\(hyphen\)/g, "–");

        var getuser=Meteor.userId();
        if(getuser){
            userid=getuser;
        }else{
            userid=Session.get("userId");
        }
        
        return [Meteor.subscribe("contents"), Meteor.subscribe("contents_type"), Meteor.subscribe("membership"), Meteor.subscribe('share'), Meteor.subscribe("productsWebzine", -1, title), Meteor.subscribe("viewing"),Meteor.subscribe("getFavorite",userid)];

    },
    data: function() {
        if (this.ready()) {
            var name = this.params._id;
            //console.log('mytuto:' + name);
            name = name.replace(/-/g, " ");
            //console.log('mytuto:' + name);
            var con = contents.findOne({ "title": { $regex: new RegExp(name, "i") } });
            var data = '';
            if (con) {
                var img_id = con.image[0];
                var url = getImg(img_id);
                data = { result: con, img_url: url };
            }
            return data;
        }
    },

    onAfterAction: function() {
        var name = this.params._id;
        name = name.replace(/-/g, " ");
        var data = this.data();
        var result = data.result;
        //console.log(result);
        if (!Meteor.isClient) {
            return;
        }
        if (result.content) {
            var contentDesc = result.content.replace(/(\<[^\>]*\>)|(\&nbsp\;)|(\\n)|(\s\s+)/g, "");
            if (contentDesc.length > 160) {
                contentDesc = contentDesc.trim().substring(0, 160).split(" ").slice(0, -1).join(" ") + "…";
            } else {
                contentDesc = contentDesc.trim().substring(0, contentDesc.length);
            }
        }
        SEO.set({
            title: result.title + " | Safir Iran",
            meta: {
                'description': result.content
            },
            og: {
                'title': result.title + " | Safir Iran",
                'image': data.img_url
                    //'description':result.contentDesc
            },
            fb: {
                app_id: "1712707052305819",
                admins: "100001452918892"
            }
        });
    }
});
Router.route('/tuto', {
    name: 'tutonew',
    waitOn: function() {
        var getuser=Meteor.userId();
        if(getuser)
            userid=getuser;
        else
            userid=Session.get("userId");
        return [TAPi18n.subscribe("categories"),Meteor.subscribe("getFavorite",userid)];
    },
    data: function() {
        if (this.ready()) {
            var cat = categories.find({ "parent": " " });
            //console.log("count: " + cat.count());
            return { getTutoCategory: cat };
        }
    },
    onAfterAction: function() {
        if (!Meteor.isClient) {
            return;
        }
        SEO.set({
            title: "آرایش، ابزارهای زیبایی و نکات آموزشی و ویدیو | Safir Iran",
            meta: {
                'description': "در حال جستجو برای آموزش آرایش ؟ سفیر مکانیزه نموده نظریه اسرار با آموزش تصویری در مورد عطر ، محصولات مراقبت از پوست ، محصولات آرایشی، بدن، و مراقبت از مو ."
            },
            og: {
                'title': "آرایش، ابزارهای زیبایی و نکات آموزشی و ویدیو | Safir Iran",
                'description': "در حال جستجو برای آموزش آرایش ؟ سفیر مکانیزه نموده نظریه اسرار با آموزش تصویری در مورد عطر ، محصولات مراقبت از پوست ، محصولات آرایشی، بدن، و مراقبت از مو ."
            }
        });
    }
});

Router.route('/journey', {
    name: 'journey'
});


Router.route('/test', {
    name: 'test',
    waitOn: function() {
        return [TAPi18n.subscribe("products", -1)];
    }
});

Router.route('/addlistproduct', {
    name: 'addlistproduct',
    waitOn: function() {
        return [TAPi18n.subscribe("products", -1), TAPi18n.subscribe("list_product")];
    }
});

Router.route('/updatelistproduct/:_id', {
    name: 'updatelistproduct',
    waitOn: function() {
        return [TAPi18n.subscribe("products", -1), TAPi18n.subscribe("list_product")];

    },
    data: function() {
        if (this.ready()) {
            var id = this.params._id;
            var da = list_product.findOne({ _id: id });
            return da;
        }
    }
});


Router.route('/addList', {
    name: 'addList',
    waitOn: function() {
        return [TAPi18n.subscribe("products", -1), TAPi18n.subscribe("list_product")];
    },
    data: function() {
        if (this.ready()) {
        var arr = [];
        for (var i = 0; i < 10; i++) {
            arr[i] = i;
        }
        //[0,1,2,3,4,5,6,7,8,9]
        return { p: arr };
        }
    }
});

Router.route('/confirmorder', {
    name: 'confirmorder',
    waitOn: function() {
        var getuser=Meteor.userId();
        if(getuser)
            userid=getuser;
        else
            userid=Session.get("userId");
        return [Meteor.subscribe('order'),Meteor.subscribe("getFavorite",userid)];
    }
});
Router.route('/confirmorder1', {
    name: 'confirmorder1',
    waitOn: function() {
        var getuser=Meteor.userId();
        if(getuser)
            userid=getuser;
        else
            userid=Session.get("userId");
        return [Meteor.subscribe('address'), Meteor.subscribe('order'),Meteor.subscribe("getFavorite",userid)];
    }
});
Router.route('/confirmorder2', {
    name: 'confirmorder2',
    waitOn: function() {
        var getuser=Meteor.userId();
        if(getuser)
            userid=getuser;
        else
            userid=Session.get("userId");
        return [Meteor.subscribe('address'), Meteor.subscribe('order'),Meteor.subscribe("getFavorite",userid)];
    }
});
Router.route('/recaporder/:_id', {
    name: 'recaporder',
    waitOn: function() {
        return [Meteor.subscribe('order'), Meteor.subscribe('productsOrder', this.params._id)];
    },
    data: function() {
        if (this.ready()) {
            return order.findOne({ _id: this.params._id });
        }
    }
});

Router.route('/listTranslate', {
    name: 'listTranslate',
    waitOn: function() {
        return [Meteor.subscribe("translation")];
    }

});

Router.route('/new', {
    name: 'new'
});
Router.route('/email', {
    name: 'email'
});
Router.route('/veryfy', {
    name: 'veryfy'
});
Router.route('/ForgotPassword', {
    name: 'ForgotPassword'
});
Router.route('/ResetPassword', {
    name: 'ResetPassword'
});

Router.route('/slider', {
    name: 'slider'
});

Router.route('/success', {
    name: 'success'
});

Router.route('/banner', {
    name: 'banner',
    waitOn: function() {
        return [Meteor.subscribe("banner")];
    }
});


Router.route('/updatebanner/:_id', {
    name: 'updatebanner',
    template: 'banner',
    data: function() {
        if (this.ready()) {
            return banner.findOne({ _id: this.params._id });
        }
    },
    waitOn: function() {
        return [Meteor.subscribe("banner")];
    }
});

Router.route('/menulink', {
    name: 'menulink'
});
Router.route('/managequestion', {
    name: 'managequestion',
    waitOn: function() {
        return [Meteor.subscribe("question")];
    }

});
Router.route('/updatequestion/:_id', {
    name: 'updatequestion',
    data: function() {
        if (this.ready()) {
            return question.findOne({ _id: this.params._id });
        }
    },
    waitOn: function() {
        return [Meteor.subscribe("question")];
    }
});
Router.route('/imedation', {
    name: 'imedation',
    waitOn: function() {
        return [Meteor.subscribe("imedation")];
    }
});


Router.route('/zoom', {
    name: 'zoom'
});

Router.route('/addanwser', {
    name: 'addanwser'
});

Router.route('/import', {

    name: 'import',
    data: function() {
        if (this.ready()) {
            Meteor.call("readCSV");
        }
    }
});
Router.route('listorder/', {
    name: 'listorder',
    waitOn: function() {
        return [Meteor.subscribe("order")];
    }

});

Router.route('/manageUserTracking', {
    name: 'manageUserTracking',
    waitOn: function() {
        var num = Number(Session.get("page")) - 1;
        //console.log("num " + num);
        var skipNum = num * 20;
        var findField = Session.get("findField");
        if (findField) {
            return [Meteor.subscribe("userTracking", skipNum, findField.field1, findField.field2, findField.field3)];
        } else {
            return [Meteor.subscribe("userTracking", skipNum)];
        }
    }
});

Router.route('/listitem', {
    name: 'listitem',
    waitOn: function() {
        return [Meteor.subscribe("order")];

    }
});

Router.route('/orderItem', {
    name: 'orderItem',
    waitOn: function() {
        return [Meteor.subscribe("order")];

    }
});

Router.route('/orderItemShop', {
    name: 'orderItemShop',
    waitOn: function() {
        return [Meteor.subscribe("order")];

    }
});

Router.route('/stock', {
    name: 'stock',
    waitOn: function() {
        var num = Number(Session.get("page")) - 1;
        var sesShop = Session.get("sessionShop");
        var skipNum = num * 20;
        var barcode = Session.get("barcode");
        //console.log(barcode);
        var ba = "";
        var stn = "";
        if (barcode != "") {
            if (barcode.val != "") {
                ba = barcode.val;
                //console.log("barcode val" + barcode.val);
            } else {
                ba = "";
            }
            if (barcode.field != "") {
                stn = barcode.field;
                //console.log("barcode field" + barcode.field);
            } else {
                stn = "";
            }
        } else {
            ba = "";
            stn = "";
        }
        return [Meteor.subscribe("stock", skipNum, sesShop, stn, ba)];
    }
});
Router.route('/userOrderList', {
    name: 'userOrderList',
    waitOn: function() {
        return [Meteor.subscribe("order")];
    }
});

Router.route('/logintwitter', {
    name: 'logintwitter'

});
Router.route('/loginsocial', {
    name: 'loginsocial'

});
Router.route('/orderDetail/:_id', {
    name: "orderDetail",
    waitOn: function() {
        return [TAPi18n.subscribe("products", -1), Meteor.subscribe("order")];
    },
    data: function() {
        if (this.ready()) {
            return order.findOne({ _id: this.params._id });
        }
    }
});

Router.route('/mousetracking', {
    name: 'mouseTracking',
    waitOn: function() {
        return [Meteor.subscribe("userTracking")];
    }
});

Router.route('/memberReview', {
    name: 'memberReview',
    waitOn: function() {
        return [TAPi18n.subscribe("products", -1)];
    }

});

Router.route('/next', {
    name: 'next'
});

Router.route('/sliderResponsive', {
    name: 'sliderResponsive'
});

Router.route('/addProductUser', {
    name: 'addProductUser',
    waitOn: function() {
        return [TAPi18n.subscribe("products", -1), Meteor.subscribe("products_node", -1), TAPi18n.subscribe("parent_tags")];
    }
});

Router.route('/manageProductUser', {
    name: 'manageProductUser',
    waitOn: function() {
        return [TAPi18n.subscribe("products", -1), Meteor.subscribe("products_node", -1), TAPi18n.subscribe("parent_tags")];
    }
});

Router.route('/updateProductUser/:_id', {
    name: 'updateProductUser',
    data: function() {
        if (this.ready()) {
            return products_node.findOne({ _id: this.params._id });
        }
    },
    waitOn: function() {
        return [TAPi18n.subscribe("products", -1), Meteor.subscribe("products_node", -1), TAPi18n.subscribe("parent_tags")];
    }
});
// ============= QUIZZ PAGE  =================//
Router.route('/addquizz', {
    name: 'addquizz',
    waitOn: function() {
        return [TAPi18n.subscribe("parent_tags"), TAPi18n.subscribe("tags")];

    }
});
Router.route('/managequizz', {
    name: 'managequizz',
    waitOn: function() {
        return [Meteor.subscribe("quizz")];
    }
});
Router.route('/updatequizz/:_id', {
    name: 'updatequizz',
    waitOn: function() {
        return [Meteor.subscribe("quizz"), TAPi18n.subscribe("parent_tags"), TAPi18n.subscribe("tags")];
    },
    data: function() {
        if (this.ready()) {
            return quizz.findOne({ _id: this.params._id });
        }
    }
});
Router.route('/prodiscount', {
    name: 'proDiscount',
    waitOn: function() {
        return [TAPi18n.subscribe('discount'), TAPi18n.subscribe("products")];
    }
});
Router.route('/manageDiscount', {
    name: 'manageDiscount',
    waitOn: function() {
        return [TAPi18n.subscribe('discount'), TAPi18n.subscribe("products")];
    }
});
Router.route('/forum/addnew', {
    name: 'addPost'
});
Router.route('/forum/myforum', {
    name: 'myforum',
    waitOn: function() {
        return [Meteor.subscribe('listposts')];
    }
});

Router.route('/forum/reply/:_id', {
    name: 'reply',
    data: function() {
        if (this.ready()) {
            return posts.findOne({ _id: this.params._id });
        }
    },
    waitOn: function() {
        return [Meteor.subscribe('postsbyId', this.params._id)];
    }

});
Router.route('/forum/listing', {
    name: 'listForum',
    waitOn: function() {
        return [Meteor.subscribe('users', this.userId), Meteor.subscribe('listposts')];
    }
});

Router.route('/forum/detail/:_id', {
    name: 'forumDetail',
    data: function() {
        if (this.ready()) {
            return posts.findOne({ _id: this.params._id });
        }
    },
    waitOn: function() {
        return [Meteor.subscribe('postsbyId', this.params._id)];
    }
});

Router.route('/forum/updateforum/:_id', {
    name: 'updateForum',
    data: function() {
        if (this.ready()) {
            return posts.findOne({ _id: this.params._id });
        }
    },
    waitOn: function() {
        return [Meteor.subscribe('postsbyId', this.params._id)];
    }
});

Router.route('/updateProDiscount/:_id', {
    name: 'updateProDiscount',
    waitOn: function() {
        return [TAPi18n.subscribe('discount'), TAPi18n.subscribe("products")];
    },
    data: function() {
        if (this.ready()) {
            return discount.findOne({ _id: this.params._id });
        }
    }
});

Router.route('/manageCollect', {
    name: 'manageCollect',
    waitOn: function() {
        return [TAPi18n.subscribe('collect')];
    }
});

Router.route('/division', {
    name: 'division',
});

Router.route('/updateCollect/:_id', {
    name: 'updateCollect',
    waitOn: function() {
        return [TAPi18n.subscribe('collect')];
    },
    data: function() {
        if (this.ready()) {
            return collect.findOne({ _id: this.params._id });
        }
    }
});

//survey Route
Router.route('/managesurvey', {
    name: 'managesurvey',
});

Router.route('/discount', {
    name: 'discount',
    waitOn: function() {
        return [TAPi18n.subscribe('discount'), TAPi18n.subscribe("products")];
    },
    data: function() {
        if (this.ready()) {
            var arr = [];
            var result = discount.find();
            result.forEach(function(item) {
                var pro = products.findOne({ "_id": item.proId });
                //console.log("MY PRODUCT IS===" + pro.title);
                var id = pro._id;
                var name = pro.title;
                var price_pro = pro.price;
                var price = Number(price_pro);
                var image = pro.image;
                var proId = item.proId;
                var percent = item.percentage;
                //console.log("MY ITEM IS===" + percent);
                var obj = {
                    _id: id,
                    title: name,
                    price: price,
                    image: image,
                    proId: proId,
                    percentage: percent
                }
                arr.push(obj);
            });
            var p_price = Session.get("SORT_DISCOUNT");
            if (p_price == "dis_price") {
                var arr_price = arr.sort(function(a, b) {
                    var min = a.price;
                    var max = b.price;
                    if (min < max)
                        return 1;
                    else if (min > max)
                        return -1;
                    else
                        return 0;
                })
                return { discountlist: arr_price };
            } else if (p_price == "sort_name") {
                var arr_name = arr.sort(function(a, b) {
                    var min = a.title;
                    var max = b.title;
                    if (min < max)
                        return -1;
                    else if (min > max)
                        return 1;
                    else
                        return 0;
                })
                return { discountlist: arr_name };
            } else {
                return { discountlist: arr };
            }
        }
    }
});
Router.route("/quiz", {
    name: "quiz",
    waitOn: function() {
        return [TAPi18n.subscribe('quizz'), Meteor.subscribe('answerquizz')];
    },
});
Router.route('/listQuizz', {
    name: 'listQuizz',
    waitOn: function() {
        return [TAPi18n.subscribe('quizz')];
    },
    data: function() {
        if (this.ready()) {
            return quizz.findOne({ _id: this.params._id });
        }
    }
});
Router.route('/quizzQA', {
    name: 'quizzQA',
    waitOn: function() {
        return [TAPi18n.subscribe('quizz')];
    },
    data: function() {
        if (this.ready()) {
            return quizz.findOne({ _id: this.params._id });
        }
    }
});

Router.route('/quizztwo', {
    name: 'quizztwo',
    waitOn: function() {
        return [TAPi18n.subscribe('quizz')];
    }
});

Router.route('/quizzthree', {
    name: 'quizzthree',
    waitOn: function() {
        return [TAPi18n.subscribe('quizz')];
    }
});

Router.route('/quizzQA/:id', {
    template: 'quizzQA',
    name: 'popupQuizz',
    waitOn: function() {
        return [Meteor.subscribe("quizz")];
    },
    data: function() {
        if (this.ready()) {
            var da = quizz.findOne({ _id: this.params.id });
            //console.log('QUIZZZ' + da);
            return da;
        }
    }
});

Router.route('/instagrampage', {
    name: "instagrampage"
});
Router.route('/suggestpages/:id', {
    name: "suggestpages",
    waitOn: function() {
        return [TAPi18n.subscribe('categories'), TAPi18n.subscribe('quizz'), Meteor.subscribe('contentsSuggested'), Meteor.subscribe('answerquizz'), Meteor.subscribe('contents_type'), TAPi18n.subscribe('productsSuggested', -1, this.params.id)];
    },
    data: function() {
        if (this.ready()) {
            var dataquizz = quizz.findOne({ _id: this.params.id });
            var answers = answerquizz.find({ "quizzId": this.params.id });
            //console.log('SUGGESTED:' + answers.fetch().length);
            if (answers.fetch().length != 0) {
                var lastAnswer = answers.fetch()[answers.fetch().length - 1];
                var listTags = [];
                for (var i = 0; i < lastAnswer.quizz.length; i++) {
                    listTags.push(lastAnswer.quizz[i].tag);
                }
               // console.log(listTags);
                var listProducts = products.find({ "tag_quizz": { $in: listTags } });
                //console.log('NB SUGGESTED:' + listProducts.fetch().length);
                return { products: listProducts, quizz: dataquizz };
            }

        }
    }
});

Router.route('/getusername', {
    name: "getusername"
});

Router.route('cleardata', {
    name: 'cleardata'
});

Router.route('popup', {
    name: 'popup'
});

Router.route('/addshoplearnit', {
    name: 'addShopLearnIt'
});
Router.route('/manageshoplearnit', {
    name: 'manageShopLearnIt'
});
Router.route('/updateshoplearnit/:_id', {
    name: 'editShopLearnIt',
    data: function() {
        if (this.ready()) {
            return shopLearnIt.findOne({ _id: this.params._id });
        }
    }
});
Router.route('/manageQuicklink', {
    name: 'manageQuicklink',
    waitOn: function() {
        return [TAPi18n.subscribe('quicklink')];
    }
});
Router.route('/editQuicklink/:id', {
    name: 'editQuicklink',
    template: 'manageQuicklink',
    waitOn: function() {
        return [TAPi18n.subscribe('quicklink')];
    },
    data: function() {
        if (this.ready()) {
            return quicklink.findOne({ _id: this.params.id });
        }
    }
});
Router.route('/admincenter', {
    name: 'admincenter'
});
Router.route('/admin/location', {
    name: 'manageLocation',
    waitOn: function() {
        return [Meteor.subscribe('locations')];
    }
});
Router.route('/addlocation', {
    name: "addLocation"
});
Router.route('/admin/editlocation/:_id', {
    name: 'editLocation',
    waitOn: function() {
        return [Meteor.subscribe('EditLocations',this.params._id)];
    },
    data: function() {
        return locations.findOne({ _id: this.params._id });
    }
});
Router.route('/admin/pages', {
    name: 'pages'
});
Router.route('/admin/editpages/:_id', {
    name: 'editpages',
    data: function() {
        if (this.ready()) {
            return pages.findOne({ _id: this.params._id });
        }
    },
    waitOn: function() {
        return [Meteor.subscribe("pages")];
    }
});
/*=== Admin ====*/
Router.route('/admin/order/:status', {
    name: 'adminorder',
    data: function() {
        if (this.ready()) {
        return { status: this.params.status };
    }
    },
    waitOn: function() {
        return [TAPi18n.subscribe("products", -1), Meteor.subscribe("order"), Meteor.subscribe('userOrderAdmin')];
    }
});

Router.route('/admin/orderdetail/:_id', {
    name: "adminorderdetail",
    waitOn: function() {
        return [TAPi18n.subscribe("products", -1), Meteor.subscribe("order")];
    },
    data: function() {
        if (this.ready()) {
            return order.findOne({ _id: this.params._id });
        }
    }
});
Router.route('/managemembership', {
    name: 'managemembership',
    waitOn: function() {
        return [Meteor.subscribe('membership')];
    }
});
Router.route('/updatemembership/:id', {
    name: 'updatemembership',
    template: 'managemembership',
    waitOn: function() {
        return [Meteor.subscribe('membership')];
    },
    data: function() {
        if (this.ready()) {
            return membership.findOne({ _id: this.params.id });
        }
    }
});

Router.route('/contact-us', {
    name: 'contactus',
    waitOn: function() {
        var getuser=Meteor.userId();
        if(getuser){
            userid=getuser;
        }
        else{
            userid=Session.get("userId");
        }
        return [Meteor.subscribe("getFavorite",userid)];
    },
    onAfterAction: function() {
        if (!Meteor.isClient) {
            return;
        }
        SEO.set({
            title: "تماس با ما | Safir Iran",
            meta: {
                'description': "خدمات مشتریان تماس با Safir برای کمک با سفارشات ، اطلاعات محصول، محل فروشگاه و بیشتر."
            },
            og: {
                'title': "تماس با ما | Safir Iran",
                'description': "خدمات مشتریان تماس با Safir برای کمک با سفارشات ، اطلاعات محصول، محل فروشگاه و بیشتر."
            }
        });
    }
});
Router.route('/about-us', {
    name: 'aboutus',
    waitOn: function() {
        var getuser=Meteor.userId();
        if(getuser){
            userid=getuser;
        }
        else{
            userid=Session.get("userId");
        }
        return [Meteor.subscribe("getFavorite",userid)];
    },
    onAfterAction: function() {
        if (!Meteor.isClient) {
            return;
        }
        SEO.set({
            title: "درباره ما | Safir Iran",
            meta: {
                'description': "اطلاعات بیشتر در مورد Safir و پیدا کردن پاسخ به سوالات شما در رابطه با رهبری شرکت ، فروشگاه ها و برنامه آرایشی خودی."
            },
            og: {
                'title': "درباره ما | Safir Iran",
                'description': "اطلاعات بیشتر در مورد Safir و پیدا کردن پاسخ به سوالات شما در رابطه با رهبری شرکت ، فروشگاه ها و برنامه آرایشی خودی."
            }
        });
    }
});
Router.route('/invoice', {
    name: 'invoice'
});

// Redirect url

Router.route('/contact-us/view/', function () {
  this.response.writeHead(301, {'Location': '/contact-us'});
  this.response.end();    
}, {where: 'server'});

Router.route('/about-us/history/view/', function () {
  this.response.writeHead(301, {'Location': '/about-us'});
  this.response.end();    
}, {where: 'server'});
// Router.route('/about-us/history/view/', function () {
//   this.response.writeHead(301, {'Location': '/about-us'});
//   this.response.end();    
// }, {where: 'server'});

Router.route('/products/groups/:name/:oldId/:view/:escaped/:pro_group/', function () {
  var prod = products.findOne({ "oldId": Number(this.params.oldId)});
    if(prod == null){
        this.response.writeHead(301, {'Location': '/'});
    }
    else{
        var pro_name = prod.title;
    var title = pro_name.replace(/\-/g, "(minus)");
    title = title.replace(/\s/g, "-");
    title = title.replace(/\%/g, "(percentag)");
    title = title.replace(/\+/g, "(plush)");
    title = title.replace(/\ô/g, "(ocir)");
    title = title.replace(/\®/g, "(copyright)");
    title = title.replace(/\°/g, "(number)");
    title = title.replace(/\Ô/g, "(bigocir)");
    title = title.replace(/\²/g, "(square)");
    title = title.replace(/\`/g, "(accentaigu)");
    title = title.replace(/\é/g, "(eaccentaigu)");
    title = title.replace(/\É/g, "(bigeaccentaigu)");
    title = title.replace(/\&/g, "(and)");
    title = title.replace(/\//g, "(slash)");
    title = title.replace(/\’/g, "(apostrophe)");
    title = title.replace(/\'/g, "(quote)");
    title = title.replace(/\!/g, "(warning)");
    title = title.replace(/\?/g, "(question)");
    title = title.replace(/\$/g, "(dolla)");
    title = title.replace(/\è/g, "(eaccentgrave)");
    title = title.replace(/\–/g, "(hyphen)");
    //title = title.toLowerCase();
  this.response.writeHead(301, {'Location': '/details/'+title});
    }
  this.response.end();    
}, {where: 'server'});

Router.route('/products/groups/:name/:oldId/:view/', function () {
            if (this.params.oldId == 101) {
                this.response.writeHead(301, { 'Location': '/nichefragrance' });
            } else if (this.params.oldId == 174) {
                this.response.writeHead(301, { 'Location': '/category/Make(minus)UP' });

            } else {
                var prod = products.findOne({ "oldId": Number(this.params.oldId) });
                if (prod == null) {
                    this.response.writeHead(301, { 'Location': '/' });
                } else {
                    var pro_name = prod.title;
                    var title = pro_name.replace(/\-/g, "(minus)");
                    title = title.replace(/\s/g, "-");
                    title = title.replace(/\%/g, "(percentag)");
                    title = title.replace(/\+/g, "(plush)");
                    title = title.replace(/\ô/g, "(ocir)");
                    title = title.replace(/\®/g, "(copyright)");
                    title = title.replace(/\°/g, "(number)");
                    title = title.replace(/\Ô/g, "(bigocir)");
                    title = title.replace(/\²/g, "(square)");
                    title = title.replace(/\`/g, "(accentaigu)");
                    title = title.replace(/\é/g, "(eaccentaigu)");
                    title = title.replace(/\É/g, "(bigeaccentaigu)");
                    title = title.replace(/\&/g, "(and)");
                    title = title.replace(/\//g, "(slash)");
                    title = title.replace(/\’/g, "(apostrophe)");
                    title = title.replace(/\'/g, "(quote)");
                    title = title.replace(/\!/g, "(warning)");
                    title = title.replace(/\?/g, "(question)");
                    title = title.replace(/\$/g, "(dolla)");
                    title = title.replace(/\è/g, "(eaccentgrave)");
                    title = title.replace(/\–/g, "(hyphen)");
                    //title = title.toLowerCase();
                    this.response.writeHead(301, { 'Location': '/details/' + title });
                }
            }

    this.response.end();
}
, {where: 'server'});

Router.route('/products/detail/:name/:oldId/view/', function () {
    var prod = products.findOne({ "oldId": Number(this.params.oldId)});
    if(prod == null){
        this.response.writeHead(301, {'Location': '/'});
    }
    else{
        var pro_name = prod.title;
    var title = pro_name.replace(/\-/g, "(minus)");
    title = title.replace(/\s/g, "-");
    title = title.replace(/\%/g, "(percentag)");
    title = title.replace(/\+/g, "(plush)");
    title = title.replace(/\ô/g, "(ocir)");
    title = title.replace(/\®/g, "(copyright)");
    title = title.replace(/\°/g, "(number)");
    title = title.replace(/\Ô/g, "(bigocir)");
    title = title.replace(/\²/g, "(square)");
    title = title.replace(/\`/g, "(accentaigu)");
    title = title.replace(/\é/g, "(eaccentaigu)");
    title = title.replace(/\É/g, "(bigeaccentaigu)");
    title = title.replace(/\&/g, "(and)");
    title = title.replace(/\//g, "(slash)");
    title = title.replace(/\’/g, "(apostrophe)");
    title = title.replace(/\'/g, "(quote)");
    title = title.replace(/\!/g, "(warning)");
    title = title.replace(/\?/g, "(question)");
    title = title.replace(/\$/g, "(dolla)");
    title = title.replace(/\è/g, "(eaccentgrave)");
    title = title.replace(/\–/g, "(hyphen)");
  this.response.writeHead(301, {'Location': '/details/'+title});
    }
  this.response.end();    
}, {where: 'server'});

Router.route('/products/detail/:name/:group/:oldId/view/', function () {
    var prod = products.findOne({ "oldId": Number(this.params.oldId)});
    if(prod == null){
        this.response.writeHead(301, {'Location': '/'});
    }
    else{
        var pro_name = prod.title;
    var title = pro_name.replace(/\-/g, "(minus)");
    title = title.replace(/\s/g, "-");
    title = title.replace(/\%/g, "(percentag)");
    title = title.replace(/\+/g, "(plush)");
    title = title.replace(/\ô/g, "(ocir)");
    title = title.replace(/\®/g, "(copyright)");
    title = title.replace(/\°/g, "(number)");
    title = title.replace(/\Ô/g, "(bigocir)");
    title = title.replace(/\²/g, "(square)");
    title = title.replace(/\`/g, "(accentaigu)");
    title = title.replace(/\é/g, "(eaccentaigu)");
    title = title.replace(/\É/g, "(bigeaccentaigu)");
    title = title.replace(/\&/g, "(and)");
    title = title.replace(/\//g, "(slash)");
    title = title.replace(/\’/g, "(apostrophe)");
    title = title.replace(/\'/g, "(quote)");
    title = title.replace(/\!/g, "(warning)");
    title = title.replace(/\?/g, "(question)");
    title = title.replace(/\$/g, "(dolla)");
    title = title.replace(/\è/g, "(eaccentgrave)");
    title = title.replace(/\–/g, "(hyphen)");
  this.response.writeHead(301, {'Location': '/details/'+title});
    }
  this.response.end();    
}, {where: 'server'});

Router.route('/articles/', function () {
  this.response.writeHead(301, {'Location': '/tuto'});
  this.response.end();    
}, {where: 'server'});

Router.route('/register/', function () {
  this.response.writeHead(301, {'Location': '/login'});
  this.response.end();    
}, {where: 'server'});
// /webzinelisting
Router.route('/Basket/', function () {
  this.response.writeHead(301, {'Location': '/checkout'});
  this.response.end();    
}, {where: 'server'});

Router.route('/webzinelisting/', function () {
  this.response.writeHead(301, {'Location': '/news'});
  this.response.end();    

}, {where: 'server'});
Router.route('/brands', {
    template: 'listAllBrands',
    waitOn: function() {
        var getuser=Meteor.userId();
        if(getuser){
            userid=getuser;
        }
        else{
            userid=Session.get("userId");
        }
        return [Meteor.subscribe("getFavorite",userid)];
    }
});
