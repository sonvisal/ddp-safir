Meteor.startup(function() {
    $('html').attr({ lang: 'fa-IR' });
});
Session.set('quickview', '');

loadPinterest = function() {
    alert('Adding Script...')
        (function(d) {
            var f = d.getElementsByTagName('SCRIPT')[0],
                p = d.createElement('SCRIPT');
            p.type = 'text/javascript';
            p.async = true;
            p.src = '//assets.pinterest.com/js/pinit.js';
            f.parentNode.insertBefore(p, f);
        }(document));
}
var item = 0;

Template.home.rendered = function() {
    $("#pinme").attr('src', 'https://stefansundin.com/stuff/pinterest-iframe-embed.php?type=embedBoard&url=https://www.pinterest.com/safirperfumery/safir-favorite-looks/');
    //======imedation=======
    Meteor.call('earnPoinInviteFriends', function(err, data) {
        if (!err) {
            var user = Meteor.users.findOne({ _id: Meteor.userId() });
            if (user.profile.hasOwnProperty('inviteFrieds')) {
                if (data % 3 == 0 && data != user.profile.inviteFrieds) {
                    EarnPoint('inviteFreids', 100, 100, 100);
                    Meteor.call('updateInviteFrieds', data);
                }
            } else {
                if (data % 3 == 0) {
                    EarnPoint('inviteFreids', 100, 100, 100);
                    Meteor.call('updateInviteFrieds', data);
                }
            }

        }
    });
};
Template.home.helpers({
    getIconlike:function(product_id){
        var fav = '';
        var userid = getFavUserId();
        fav = favorite.findOne({ proId: product_id, userId: userid });
        if (fav) {
        var heartempty = 'nonelike';
        var heartfull = '';
        } else {
        var heartempty = '';
        var heartfull = 'nonelike';
        }
        var html = '';
        html += '<a href="#" data-id="' + product_id + '" class="heart ' + heartempty + ' unlike unlike' + product_id + '"><span class="fa fa-heart-o" style="padding-top: 10px;padding-left: 37px;"></span></a>';
        html += '<a href="#" data-id="' + product_id + '" class="heart ' + heartfull + ' like like' + product_id + '"><span class="fa fa-heart fa-heart-full" style="padding-top: 10px;padding-left: 37px;"></span></a>';
        return html;
    },
    list1: function() {
        return list_product.find().fetch()[0];
    },
    list2: function() {

        return list_product.find().fetch()[1];
    },
    list3: function() {

        return list_product.find().fetch()[2];
    },
    Deal: function() {
        var data = locations.findOne({ type: 'Deal' });

        if (data) {
            var id = data.productid;
            return { products: id }
        }
    },
    getProduct: function(id) {
        var result = products.findOne({ "_id": id });
        return result;
    },
    contents: function() {
        var type = contents_type.findOne({ "type": "Webzine" });
        if (type != null)
            return contents.find({ "typeid": type._id });
    },
    getContentImg: function(id) {
        var p = contents.findOne({ _id: id });
        if (p.image instanceof Array)
            return p.image[0];
        else
            return p.image;
    },
    getAttribprice: function(oldId) {
        Meteor.call('getAttrPrice', oldId, function(err, data) {
            if (!err) {
                var attr = '.price' + data.product;
                //$(attr).html('ریال ' + data.price);
                var price = data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                $(attr).html('ریال ' + price);
                Session.set('priceAttr', data.price);
            }
        });
    },
    getQuickLink: function() {
        var data = locations.find({ type: 'Quicklinks' }, { sort: { order: 1 }, limit: 4 });
        //console.log('Quick:'+data.count());
        if (data.count() > 0) {
            var quicklinkimage = '';
            var quicklink = ''
            var allQuicklink = '';
            var hasQuicklink = false;
            data.forEach(function(value, index) {
                var img = getImg(value.image_id);
                if (index == 0) {
                    quicklinkimage += '<div class="col-sm-9">';
                    quicklinkimage += '<a href="#"><img  data-toggle="modal" data-target="#shop_learn_it" class="img-responsive" src="' + img + '"></a>';
                    quicklinkimage += '</div>';
                } else {
                    quicklink += '<li><a href="' + value.link + '">' + value.name + '</a></li>';
                    hasQuicklink = true;
                }

            })
            if (hasQuicklink == true) {
                allQuicklink += quicklinkimage
                allQuicklink += '<div class="col-sm-3 text-center">';
                allQuicklink += '<div class="quicklink">';
                if (TAPi18n.getLanguage() == 'fa') {
                    allQuicklink += '<h2><b>لینک های سریع</b></h2>';
                } else {
                    allQuicklink += '<h2><b>QUICK LINKS</b></h2>';
                }
                allQuicklink += '<ul class="nav">' + quicklink + '</ul>';
                allQuicklink += '</div>';
                allQuicklink += '</div>';
                return allQuicklink;
            } else return;

        }
    },
    newsBlockProducts: function() {
            var data = locations.findOne({ type: 'News', page: "home", order: 1, productid: { $ne: "" } });
            var numpro = 2;
            if (data) {
                var id = [];
                var html = '';
                //data.forEach( function(value, index){
                id = data.productid;
                //console.log(id);
                for (i = 0; i < id.length; i++) {
                    if (i < numpro) {

                        var result = products.findOne({ _id: id[i] }, { limit: 1 });
                        //console.log(result);
                        if (result) {

                            html += oneProduct(result, false, false);
                        }
                    }
                }
                //});
                return html;
            }
        }
        /*getSelectedProduct: function(){
            var id=Session.get('quickview');

            if(id=='')
                return null;

            var currentProduct=products.find({"_id":id});
            return currentProduct;
        }*/
});

Template.home.events({
    /*'click #quickbtn': function(e,tpl){
         e.preventDefault();
        var productId = $(e.currentTarget).attr('data-id');
        Session.set('quickview', productId);
    },*/
    /*'mouseover .thumbnail': function(e,tpl){
        $(e.currentTarget).find('.caption').slideDown(250);

    },
     'mouseleave .thumbnail': function(e,tpl){
        $(e.currentTarget).find('.caption').slideUp(250);
    },*/
    /*'click #quickbtn': function(e,tpl){
        var productId=this._id;
        Session.set('quickview',productId);
    },*/
    'click .testMail': function(e){
        e.preventDefault();
        Meteor.call('sendMyManDrillEmail', function(error, result) {
            if (error) {
               alert("Can't send Email");
            } else {
                alert("Send Success!");
            }
        });
    },
    'click #addmycart':function(e,tpl){       
        // e.preventDefault();
        var id_product = this._id;
        var qty = tpl.$("#qty").val();
        var userId = Session.get('userId');
        var pro = products.findOne({ _id: id_product });
        var attr = attribute.find({ product: pro.oldId }).fetch();
        var attrid = '';
        if (attr.length > 0)
            var attrid = attr[0]._id;

        //console.log('attr Id:', attrid);
        /* Add To Cart Function was defined in general.js*/
        addToCart(id_product, attrid, userId, qty);
        $('.close').click();
        /*
        var sameproduct = cart.find({ id_product:id_product, userId:userId,attribute:attribute}).fetch();
        
        if( sameproduct.length>0){
            sameproduct=sameproduct[0];
            var pro = products.findOne({_id:id_product});
            upqty = parseInt( sameproduct.quantity ) + parseInt(qty);
            if( pro ){
                subtotal = upqty * parseInt(pro.price);
            }
            //console.log('update of the cart');
            var obj={quantity: upqty, subtotal:subtotal};
            Meteor.call('updateStatus',sameproduct._id,obj);
            // Bert.alert('محصول با موفقیت به سبد کالا اضافه شد ','success','growl-bottom-right');
             if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons[ 'my-error' ] = 'fa-addcart-iconbg';
                Bert.alert({
                //title: 'Success, Insert Add to Cart !',
                message: '<Success, Insert Add to Cart ! a href="/checkout" style="color:#B81425; text-align: left;">See checkout</a>',
                type: 'my-error',
                style: 'growl-bottom-right',
                icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons[ 'my-error' ] = 'fa-addcart-iconbg';
                Bert.alert({
                //title: 'Success, Insert Add to Cart !',
                message: 'Success, Insert Add to Cart ! <a href="/checkout" style="color:#B81425; text-align: left;">See checkout</a>',
                type: 'my-error',
                style: 'growl-bottom-right',
                icon: 'fa-addcart-iconbg'
                });
            }
            $('.close').click();
            //Router.go("/checkout");
        }else{
            var pro = products.findOne({_id:id_product});
            if( pro ){
                subtotal = parseInt(qty) * parseInt(pro.price);
            }
            else
                subtotal=0;
            var obj={
                id_product:id_product,
                userId:Session.get('userId'),
                quantity:qty,
                subtotal:subtotal,
                attribute:attribute,
                order_status:0
            };
            Meteor.call('addtocart',obj);
            //Bert.alert('محصول با موفقیت به سبد کالا اضافه شد ','success','growl-bottom-right');
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons[ 'my-error' ] = 'fa-addcart-iconbg';
                Bert.alert({
               // title: 'Success, Insert Add to Cart !',
                message: 'Success, Insert Add to Cart ! <a href="/checkout" style="color:#B81425; text-align: left;">See checkout</a>',
                type: 'my-error',
                style: 'growl-bottom-right',
                icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons[ 'my-error' ] = 'fa-addcart-iconbg';
                Bert.alert({
                //title: 'Success, Insert Add to Cart !',
                message: 'Success, Insert Add to Cart ! <a href="/checkout" style="color:#B81425; text-align: left;">See checkout</a>',
                type: 'my-error',
                style: 'growl-bottom-right',
                icon: 'fa-addcart-iconbg'
                });
            }
            $('.close').click();
            
        }*/
    }
});

Template.footer.events({
    'submit #formemail': function(e, tpl) {
        e.preventDefault();
        var newsmail = tpl.$(".newsmail").val();
        console.log(newsmail);
        var obj = {
            newsmail: newsmail
        }
        if (newsmail == "") {
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-errorfield-iconbg';
                Bert.alert({
                    message: 'خطای متنی! !',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-errorfield-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-errorfield-iconbg';
                Bert.alert({
                    message: 'Text field error !',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-errorfield-iconbg'
                });
            }
        } else {
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-newslet-iconbg';
                Bert.alert({
                    message: 'ایمیل شما با موفقیت به خبرنامه افزوده شد!',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-newslet-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-newslet-iconbg';
                Bert.alert({
                    message: 'Successfully signed up!',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-newslet-iconbg'
                });
            }
            Meteor.call('addnewsletter', obj);
            Meteor.call('newsmail', newsmail);
            var newsmail = tpl.$(".newsmail").val('');
        }
    }
})
