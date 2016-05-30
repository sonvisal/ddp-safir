Session.set('nbproducts', '');
Session.set('querylimit', 16);
Session.set('quickview', '');
Session.set('selected_attr', 'No attribute');
Session.set("itemsLimit", 16);

Template.fav.helpers({
    firstAttr:function(id){
        var title = attribute.findOne({ "_id": id }).value;
        //console.log("attr " + title);
        return title;
    },
    getAttribprice: function(oldId) {
        //var attrprice = attribute.findOne({"product":oldId});
        Meteor.call('getAttrPrice', oldId, function(err, data) {
            if (!err) {
                var attr = '.price' + data.product;
                var price = data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                $(attr).html(price);
                $(attr).attr('data-value',data.price);
                //$(attr).html('ریال ' + data.price);
                Session.set('priceAttr',data.price);
            }
        });
    },
    getListprice: function(oldId) {
        //console.log("oldID="+oldId);
        var attrprice = attribute.findOne({ "product": oldId });
        //console.log("OLDID="+oldId+'price='+attrprice.price);
        return attrprice;
    },
    totalProducts: function() {
        return Session.get('allproducts');
    },
    nbproducts: function() {
        return Session.get('nbproducts');
    },
    isLiked: function(productId) {
        if (Session.get('userId')) {
            var ses = Session.get('userId');
            var data = favorite.find({ userId: ses });
            var object = [];
            var obj = {};
            var found = false;
            data.forEach(function(entry) {
                var proid = entry.proId;
                if (proid == productId) {
                    //console.log(productId+'=>'+proid+ " favorite?");
                    found = true;
                }
            });

            return found;
        } else {
            //console.log(productId+' isNotFavorite');
            return false;
        }

    },
    getBanner: function() {
        var result = categories.findOne({ _id: Session.get('idBanner') }).bannercat;
        return result;
    },
    getimagebanner: function() {
        var result = banner.find({});
        return result;
    },
    // getSelectedProduct: function() {
    //     var id = Session.get('quickview');
    //     if (id == '')
    //         return null;
    //     var currentProduct = products.find({ "_id": id });
    //     return currentProduct;
    // },
    getShop: function() {
        return shops.find({});
    },
    getShopname: function(id) {
        var shop = shops.findOne({ _id: id });
        if (shop) return shop.name;
    },
   /* getAllAttributes: function(productId, parent) {
        var result = attribute.find({ "product": productId, "parent": parent });
        if (result.count() < 2) {
            Session.set('removescroll', true);

        } else {
            Session.set('removescroll', false);
        }
        return result;
    }*/

    getAllAttributes: function(productId, parent) {
        //console.log('getAllAttributes'+productId+' = '+parent);
        var result = attribute.find({ "product": productId, "parent": parent });
        if (result.count() < 2) {
            Session.set('removescroll', true);

        } else {
            Session.set('removescroll', false);
        }
        //console.log('getAllAtrr:'+result);
        return result;
    }

});
Template.fav.events({
    'click #addmycart': function(e, tpl) {
        /*var attr = attribute.findOne({ "_id": this._id });
        var title = attribute.findOne({ "_id": this._id }).value;
        var parent=attribute.findOne({ "_id": this._id }).parent;
        var parentname=parentattr.findOne({_id:parent}).name;
        var product = products.findOne({ "oldId": this.product });
        var newprice=attr.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $('.price'+this.product).html(newprice);
        $('.price'+this.product).attr('data-value',attr.price);
        //Session.set('priceAttr', attr.price);
        Session.set('selected_point', attr.point);
        Session.set('selected_attr', attr._id);
        $('#addtocart').attr('data-id',attr._id);
        var url = this.productImage;
        var src=getImgCDN(url);
        //$("#zoomimage"+product._id).attr('data-zoom-image', src);
        $("#zoomimage"+product._id).attr('src', src);
        if(parentname=="Color"){
          $("#current_attr"+product._id).text(title);
        }else{
            $("#current_attr"+product._id).text(title);
        }
        Session.set('miniature', 0);*/
        var userId = Session.get('userId');
        var id_product = $(e.currentTarget).attr('pro-id');
        var attrid = $(e.currentTarget).attr('data-id');
        var qty = $('#qty'+id_product).val();
        var pro = products.findOne({_id:id_product});
        var attr = attribute.find({product:pro.oldId}).fetch();
        if( attrid == '' )
                var attrid = attr[0]._id;
        /* Add To Cart Function was defined in general.js*/
        addToCart( id_product, attrid, userId, qty );

    },
    'click .size-attr': function(e){
        var parentele = $(e.currentTarget).parents('.main-fav').attr('id');
        
        $('#'+parentele+' .size-product li').each( function(){
            $(this).removeClass('active');
        });
        var attrid = $(e.currentTarget).attr('attr-id');
        $('#'+parentele+' #addmycart').attr('data-id', attrid);
        $(e.currentTarget).parent().addClass('active');
        var id_product = parentele.replace('row','');
        
        var attr = attribute.findOne({_id:attrid});
        if( attr ){
            var price = attr.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $('#'+parentele +' .price-favo').text(price);
            $('#current_attr'+id_product).text(attr.value);
            var image_src = getImg(attr.productImage);
            var src = getAttributeImageCDN( image_src );
            $('#'+parentele +' .thumb').attr('src', src);
        }
        
    },
    'click .color-attr': function(e){
        var parentele = $(e.currentTarget).parents('.main-fav').attr('id');
        
         $('#'+parentele+' .color-product li').each( function(){
            $(this).removeClass('active');
        });
        var attrid = $(e.currentTarget).attr('attr-id');
        $('#'+parentele+' #addmycart').attr('data-id', attrid);
        $(e.currentTarget).parent().addClass('active');
        //get product id
        var id_product = parentele.replace('row','');
        
        var attr = attribute.findOne({_id:attrid});
        if( attr ){
            //update price
            var price = attr.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $('#'+parentele +' .price-favo').text(price);
            $('#current_attr'+id_product).text(attr.value);
            //update image
            var image_src = getImg(attr.productImage);
            $('#'+parentele +' .thumb').attr('src', image_src);
           
        }
       
            
        
    },
    // 'click #img_attr':function(e){
    //     e.preventDefault();

    // },
    'click #favorite': function(e, tpl) {
        e.preventDefault();
        var id = this._id;
        var css = $(e.currentTarget).attr("class");
        if (css == "fa fa-heart red pull-right") {
            Meteor.call('deleteFavorite', id);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons[ 'my-error' ] = 'fa-remove-iconbg';
                Bert.alert({
                message: 'Favorites remove ! <br><a href="/favorite" style="color:#B81425; margin-left:40px;">See all favorites</a>',
                type: 'my-error',
                style: 'growl-bottom-right',
                icon: 'fa-remove-iconbg'
                });
            } else {
                Bert.icons[ 'my-error' ] = 'fa-remove-iconbg';
                Bert.alert({
                message: 'Favorites remove ! <br><a href="/favorite" style="color:#B81425; margin-left:40px;">See all favorites</a>',
                type: 'my-error',
                style: 'growl-bottom-right',
                icon: 'fa-remove-iconbg'
                });
            }
            $('.close').click();

        } else {
            if (Session.get('userId')) {
                var obj = {
                    proId: id,
                    userId: Session.get('userId')
                }
                Meteor.call('insertFavorite', obj);
                if (TAPi18n.getLanguage() == 'fa') {
                    Bert.icons[ 'my-error' ] = 'fa-fav-iconbg';
                    Bert.alert({
                    message: 'به لیست علاقمندی شما افزوده شد! <br><a href="/favorite" style="color:#B81425; margin-left:40px;">نمایش فهرست علاقمندی ها</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-fav-iconbg'
                    });
                } else {
                    Bert.icons[ 'my-error' ] = 'fa-fav-iconbg';
                    Bert.alert({
                    message: 'New favorites ! <br><a href="/favorite" style="color:#B81425; margin-left:40px;">See all favorites</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-fav-iconbg'
                    });
                }
                $('.close').click();

            } else {
                var newId = Random.id();
                Session.setPersistent('userId', newId);

                var obj = {
                    proId: id,
                    userId: Session.get('userId')
                }

                Meteor.call('insertFavorite', obj);
                if (TAPi18n.getLanguage() == 'fa') {
                    Bert.icons[ 'my-error' ] = 'fa-fav-iconbg';
                    Bert.alert({
                    message: 'به لیست علاقمندی شما افزوده شد! <br><a href="/favorite" style="color:#B81425; margin-left:40px;">نمایش فهرست علاقمندی ها</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-fav-iconbg'
                    });
                } else {
                    Bert.icons[ 'my-error' ] = 'fa-fav-iconbg';
                    Bert.alert({
                    message: 'New favorites ! <br><a href="/favorite" style="color:#B81425; margin-left:40px;">See all favorites</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-fav-iconbg'
                    });
                }
                $('.close').click();

            }
        }

    },
    'click .more': function(e, tpl) {
        var limit = Number(Session.get('querylimit'));
        limit = limit + 16;
        Session.set('querylimit', limit);
    },
    /*'mouseover .thumbnail': function(e,tpl){
        $(e.currentTarget).find('.caption').slideDown(250);

    },
    'mouseleave .thumbnail': function(e,tpl){
        $(e.currentTarget).find('.caption').slideUp(250);
    },
    'click #quickbtn': function(e,tpl){
        var productId=this._id;
        Session.set('quickview',productId);
    },*/
    "click #name": function(e) {
        e.preventDefault();
        Session.set("GETName", 'name');
    },
    "click #price": function(e) {
        e.preventDefault();
        Session.set("GETName", 'price');
    },
    "click #bestSelling": function(e) {
        e.preventDefault();
        Session.set("GETName", 'sell');
    },
    "click #removefav": function(e) {
        e.preventDefault();
        var userid = Meteor.userId();
        var fav = favorite.findOne({ proId:this._id,userId:userid});
        favorite.remove({_id:fav._id});

    },
    'change #qty':function(e){
        e.preventDefault();
        var qty = $(e.currentTarget).val();
        Session.set("QUANTITY",qty)
    },
    'click #addtocart': function(e, tpl) {
        e.preventDefault();
        //console.log('add to cart...');
        var url = 'https://www.google-analytics.com/collect?v=1&t=event&tid=UA-71059459-2&cid=555&ec=purchase&ea=click&el=addTocart&ev=1000';

        Meteor.call('eventCall', url, function(error, result) {
            if (error) {
                //console.log('Analytic CLIENT ERRR');
                console.log(error);
            } else {
                //console.log('Analytic CLIENT RESULT');
                console.log(result);
            }
        });
        var id_product = this._id;
        var qty = Session.get("QUANTITY");
        if(qty==undefined || qty==''){
            qty=1;
        }
        //var attribute = Session.get('selected_attr');
        var attribute=$('#addtocart').attr('data-id');
        if (attribute == '')
            attribute = '';
        var userId = Session.get('userId');
        var selectPrice = Session.get('selected_price');
        var subtotal = 0;

        var sameproduct = cart.find({ id_product: id_product, userId: userId, attribute: attribute }).fetch();

        if (sameproduct.length > 0) {
            sameproduct = sameproduct[0];
            var pro = products.findOne({ _id: id_product });
            upqty = parseInt(sameproduct.quantity) + parseInt(qty);
            if (pro) {
                subtotal = upqty * parseInt(Session.get('selected_price'));
            }
            //console.log('update of the cart');
            var obj = { quantity: upqty, subtotal: subtotal };
            Meteor.call('updateStatus', sameproduct._id, obj,function(err){
                if(!err){
                    Session.set("QUANTITY",undefined);
                    if (TAPi18n.getLanguage() == 'fa') {
                        Bert.alert('درج افزودن به سبد خرید موفقیت <a href="/checkout" style="color:#fff; text-decoration: underline;">برو به پرداخت</a>', 'success', 'growl-bottom-right');
                    } else {
                        Bert.alert('Insert Add To Cart success <a href="/checkout" style="color:#fff; text-decoration: underline;">Go to Checkout</a>', 'success', 'growl-bottom-right');
                    }
                    $('.close').click();
                }
            });
            
           // Router.go("/checkout");
        } else {
            var pro = products.findOne({ _id: id_product });
            if (pro) {
                subtotal = parseInt(qty) * parseInt(Session.get('selected_price'));
            } else
                subtotal = 0;
            var obj = {
                id_product: id_product,
                userId: Session.get('userId'),
                quantity: qty,
                subtotal: subtotal,
               
                attribute: attribute,
                order_status: 0
            };
            Meteor.call('addtocart', obj, function(err){
                if(!err){
                    Session.set("QUANTITY",undefined);
                    if (TAPi18n.getLanguage() == 'fa') {
                        Bert.alert('درج افزودن به سبد خرید موفقیت <a href="/checkout" style="color:#fff; text-decoration: underline;">برو به پرداخت</a>', 'success', 'growl-bottom-right');
                    } else {
                        Bert.alert('Insert Add To Cart success <a href="/checkout" style="color:#fff; text-decoration: underline;">Go to Checkout</a>', 'success', 'growl-bottom-right');
                    }
                    $('.close').click();
                }
            });
        }
    }
});
Template.fav.rendered = function(){
    $("#pinme").attr('src','https://stefansundin.com/stuff/pinterest-iframe-embed.php?type=embedBoard&url=https://www.pinterest.com/safirperfumery/safir-favorite-looks/');

    $(window).scroll(showMoreFavorite);
    // var productId = this.data._id;
    // var p = products.find({ "_id": productId });
    // var attr = attribute.findOne({ "product": p.fetch()[0].oldId });
    // console.log('price=' + attr.price);
    // $("#current_attr").text(attr.value);
    // console.log('data: ' + productId);
    $('.main-fav').each(function(){
        $(".attr a img:first").addClass("border_attr");
    });

};

Template.details.rendered = function() {
    $("[rel='tooltip']").tooltip();
};

//scrool favorite
Session.set("limitFavorite", 16);
 showMoreFavorite = function() {
    //console.log('Start scroll...');
    var threshold, target = $(".wrapper-first-con");
    if (!target.length) return;
    threshold = $(window).scrollTop() + $(window).height() - target.height();
    if (target.offset().top < threshold ) {
        //console.log('Load more favorite...');
        //console.log( 'threshold:', threshold);
        //console.log( 'target offset:', target.offset().top);
        if (!target.data("visible")) {
            // console.log("target became visible (inside viewable area)");
            target.data("visible", true);
            Session.set("limitFavorite", Session.get("limitFavorite") + 16);

            //console.log('limit:',  Session.get("limitFavorite"))
        }
    } else {
        if (target.data("visible")) {
            // console.log("target became invisible (below viewable arae)");
            target.data("visible", false);
        }
    }  
          
}

//end scrool

Template.listpro.events({
    'click #favorite': function(e) {
        e.preventDefault();
        var id = this._id;
        if (Session.get('userId')) {
            var obj = {
                proId: id,
                userId: Session.get('userId')
            }
            Meteor.call('insertFavorite', obj);
        } else {
            var newId = Random.id();
            Session.setPesistent('userId', newId);
            var obj = {
                proId: id,
                userId: Session.get('userId')
            }
            Meteor.call('insertFavorite', obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons[ 'my-error' ] = 'fa-fav-iconbg';
                Bert.alert({
                message: 'به لیست علاقمندی شما افزوده شد! <br><a href="/favorite" style="color:#B81425; margin-left:40px;">نمایش فهرست علاقمندی ها</a>',
                type: 'my-error',
                style: 'growl-bottom-right',
                icon: 'fa-fav-iconbg'
                });
            } else {
                Bert.icons[ 'my-error' ] = 'fa-fav-iconbg';
                Bert.alert({
                message: 'New favorites ! <br><a href="/favorite" style="color:#B81425; margin-left:40px;">See all favorites</a>',
                type: 'my-error',
                style: 'growl-bottom-right',
                icon: 'fa-fav-iconbg'
                });
            }
            $('.close').click();
        }
    },
    'click #remove': function(e) {
        var id = this._id;
        var obj = favorite.findOne({ proId: id });
        favorite.remove(obj._id);
        if (TAPi18n.getLanguage() == 'fa') {
            Bert.icons[ 'my-error' ] = 'fa-remove-iconbg';
            Bert.alert({
            message: 'Favorites remove ! <br><a href="/favorite" style="color:#B81425; margin-left:40px;">نمایش فهرست علاقمندی ها</a>',
            type: 'my-error',
            style: 'growl-bottom-right',
            icon: 'fa-remove-iconbg'
            });
        } else {
            Bert.icons[ 'my-error' ] = 'fa-remove-iconbg';
            Bert.alert({
            message: 'Favorites remove ! <br><a href="/favorite" style="color:#B81425; margin-left:40px;">See all favorites</a>',
            type: 'my-error',
            style: 'growl-bottom-right',
            icon: 'fa-remove-iconbg'
            });
        }
        $('.close').click();
    }
});

Template.listpro.helpers({
    favoriteList: function() {
        if (Session.get('userId')) {
            var ses = Session.get('userId');
            var data = favorite.find({ userId: ses });
            var object = [];
            var obj = {};
            data.forEach(function(entry) {
                var proid = entry.proId;
                obj = products.findOne({ _id: proid })
                object.push(obj);
            });
            return object;
        }

    },
    getProduct: function() {
        var result = products.find();
        return result;
    }
});
//==============favorite new
Template.searchproduct.events({
    /*'click #unlike':function(e){
        e.preventDefault();
        var unlike = '#unlike'+this._id;
        var like = '#like'+this._id;
        $(like).removeClass('nonelike');
        $(unlike).addClass('nonelike');
        if(Meteor.userId()){
            var userId=Meteor.userId();
          }else{
              var userId=Session.get('userId');
              if(!userId){
                  var newId=Random.id();
                  Session.setPersistent('userId',newId);
              }  
          } 
          var obj={
              proId:this._id,
              userId:userId
          }
        Meteor.call('insertFavoritee',obj); 
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصول شده است اضافه به مورد علاقه','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been add to Favorite','success','growl-bottom-right');
        }
        $('.close').click();      
    },
    'click #like':function(e){
        e.preventDefault();
        var unlike = '#unlike'+this._id;
        var like = '#like'+this._id;
        $(like).addClass('nonelike');
        $(unlike).removeClass('nonelike');
        if(Meteor.userId()){
                var userId=Meteor.userId();
        }else{
            var userId=Session.get('userId');
              
        }
        var obj=favorite.findOne({userId:userId},{proId:this._id});      
        favorite.remove(obj._id);
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصول شده است به مورد علاقه حذف','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been Removed from Favorite','success','growl-bottom-right');
        }
        $('.close').click();
    }*/
});

Template.searchproduct.onRendered(function() {
    var userId = Session.get('userId');
    if (Meteor.userId()) {
        var userId = Meteor.userId();
    }
    var favoritelist = favorite.find({ userId: userId });
    favoritelist.forEach(function(value) {
        var like = "#like" + value.proId;
        var unlike = "#unlike" + value.proId;
        $(like).removeClass('nonelike');
        $(unlike).addClass('nonelike');
    });
});
Template.fav.helpers({
    getCountAllAttributes: function(productId, parent) {
        //console.log('getAllAttributes'+productId+' = '+parent);
        var result = attribute.find({ "product": productId, "parent": parent });
        if (result.count() < 2) {
            Session.set('removescroll', true);
        } else {
            Session.set('removescroll', false);
        }
        var nbcount=result.count();
        //console.log("LENGHT HAMLY "+nbcount);
        if(nbcount<5){
            count=300 ;
             $("#gallerycontainer122").css("overflow-x", "");
        }else{
            count=Number(nbcount)*82;
             $("#gallerycontainer122").css("overflow-x", "scroll");
        }
        return count;
    },
    getScrollAttr:function(productId, parent){
        var result = attribute.find({ "product": productId, "parent": parent });
        var nbcount=result.count();
        var getNum=Number(nbcount);
        var mystyle='';
        if(getNum<=5){
            mystyle="overflow-x:";
        }else{
            mystyle="overflow-x:scroll";
        }
        return mystyle;
    },
    getParentAttr: function(product) {
        //console.log('cherche les attr de ' + product);
        var list = attribute.find({ "product": product }).fetch();
        var out = [];
        for (var i = 0; i < list.length; i++) {
            var contains = 0;
            for (var j = 0; j < out.length; j++){
                //console.log('comparing: '+out[j].parent+' a VS '+ list[i].parent);
                if (out[j].parent == list[i].parent)
                    contains = 1;
            }
            if (contains == 0)
                out.push(list[i]);
        }
        //console.log('finish parentattr '+JSON.stringify(out));
        //alert('attrparent=='+JSON.stringify(out));
        return out;
    },
    checkname:function(name){
        if(name=='Color'){
            return true;
        }else{
            return false;
        }
    },
    getParentDetails: function(parent) {
        return parentattr.findOne({ "_id": parent });
    },
    // getParentAttr: function() {
    //     return parentattr.find();
    // },
    getallprice: function(oldId) {
        var attrprice = attribute.findOne({ "product": oldId });
        return attrprice;
    },
    selected_price: function() {
        var id = this._id;
        var val = Session.get('selected_price');
        var result = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return result;
    },
    priceAttribute: function(){
        var productId = this.data._id;
        var p = products.find({ "_id": productId });
        var attr = attribute.findOne({ "product": p.fetch()[0].oldId });
        var prices = attr.price;
        return prices;
    }
});
Template.fav.events({
    /*'click .unlike':function(e){
            e.preventDefault();
            var unlike ='.unlike'+$(e.currentTarget).attr('data-id');
            var like = '.like'+$(e.currentTarget).attr('data-id');
            $(unlike).addClass('nonelike');
            $(like).removeClass('nonelike');
            if(!Session.get('userId')){
                var newId=Random.id();
                Session.setPersistent('userId',newId);
            }
            var userId=Session.get('userId');
            var obj={
                proId:this._id,
                userId:userId
            }
            Meteor.call('insertFavoritee',obj);
            if(TAPi18n.getLanguage()=='fa'){
              Bert.alert('محصول شده است اضافه به مورد علاقه','success','growl-bottom-right');
            }else{
              Bert.alert('Product has been add to Favorite','success','growl-bottom-right');
            }
            $('.close').click();
    },*/
    /*'click .like':function(e){
        e.preventDefault();
        var id=$(e.currentTarget).attr('data-id');
        var unlike ='.unlike'+$(e.currentTarget).attr('data-id');
        var like = '.like'+$(e.currentTarget).attr('data-id');
        $(like).addClass('nonelike');
        $(unlike).removeClass('nonelike');
        var userId=Session.get('userId');
        var obj=favorite.findOne({$and:[{userId:userId},{proId:id}]});
        favorite.remove(obj._id);
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصول شده است به مورد علاقه حذف','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been Removed from Favorite','success','growl-bottom-right');
        }
        $('.close').click();
    }*/
});

Template.fav.onRendered(function() {
    var userId = Session.get('userId');
    var favoritelist = favorite.find({ userId: userId });
    favoritelist.forEach(function(value) {
        var like = ".like" + value.proId;
        var unlike = ".unlike" + value.proId;
        $(like).removeClass('nonelike');
        $(unlike).addClass('nonelike');
    });
});

Template.home.events({
    /*'click .unlike':function(e){
        e.preventDefault();
        var unlike ='.unlike'+$(e.currentTarget).attr('data-id');
        var like = '.like'+$(e.currentTarget).attr('data-id');
        $(unlike).addClass('nonelike');
        $(like).removeClass('nonelike');
          
        if(!Session.get('userId')){
            var newId=Random.id();
            Session.setPersistent('userId',newId);
        } 
        var userId=Session.get('userId');              
        var obj={
            proId:this._id,
            userId:userId
        }
        Meteor.call('insertFavoritee',obj);
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصول شده است اضافه به مورد علاقه','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been Add to Favorite','success','growl-bottom-right');
        }
        $('.close').click();
    },
    'click .like':function(e){
        e.preventDefault();
        var id=$(e.currentTarget).attr('data-id');
        var unlike ='.unlike'+$(e.currentTarget).attr('data-id');
        var like = '.like'+$(e.currentTarget).attr('data-id');
        $(like).addClass('nonelike');
        $(unlike).removeClass('nonelike');
        var userId=Session.get('userId');                   
        var obj=favorite.findOne({$and:[{userId:userId},{proId:id}]});      
        favorite.remove(obj._id);
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصولات از برگزیدن حذف شده است','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been Removed from Favorite','success','growl-bottom-right');
        }
        $('.close').click();
    }*/
});

Template.home.onRendered(function() {
    var userId = Session.get('userId');
    var favoritelist = favorite.find({ userId: userId });
    favoritelist.forEach(function(value) {
        var like = ".like" + value.proId;
        var unlike = ".unlike" + value.proId;
        $(like).removeClass('nonelike');
        $(unlike).addClass('nonelike');
    });
});
Template.suggestpages.onRendered(function() {
    var userId = Session.get('userId');
    var favoritelist = favorite.find({ userId: userId });
    favoritelist.forEach(function(value) {
        var like = ".like" + value.proId;
        var unlike = ".unlike" + value.proId;
        $(like).removeClass('nonelike');
        $(unlike).addClass('nonelike');
    });
});
Template.suggestpages.events({
    /*'click .unlike':function(e){
        e.preventDefault();
        var unlike ='.unlike'+$(e.currentTarget).attr('data-id');
        var like = '.like'+$(e.currentTarget).attr('data-id');
        $(unlike).addClass('nonelike');
        $(like).removeClass('nonelike');
          
        if(!Session.get('userId')){
            var newId=Random.id();
            Session.setPersistent('userId',newId);
        } 
        var userId=Session.get('userId');              
        var obj={
            proId:this._id,
            userId:userId
        }
        Meteor.call('insertFavoritee',obj);
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصول شده است اضافه به مورد علاقه','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been Add to Favorite','success','growl-bottom-right');
        }
        $('.close').click();
    },
    'click .like':function(e){
        e.preventDefault();
        var id=$(e.currentTarget).attr('data-id');
        var unlike ='.unlike'+$(e.currentTarget).attr('data-id');
        var like = '.like'+$(e.currentTarget).attr('data-id');
        $(like).addClass('nonelike');
        $(unlike).removeClass('nonelike');
        var userId=Session.get('userId');                   
        var obj=favorite.findOne({$and:[{userId:userId},{proId:id}]});      
        favorite.remove(obj._id);
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصولات از برگزیدن حذف شده است','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been Removed from Favorite','success','growl-bottom-right');
        }
        $('.close').click();
    }*/
});
var getAttributeImageCDN = function( image_src ){
    image_src = image_src.replace('/uploads/','');
    image_src = image_src.replace(/ /g, "%20");
    var path = image_src.replace('/upload/images/', '');
    var paths = path.replace("/uploads", "/upload/");
    src = Session.get("IMG_CDN")+'/upload/' + paths;
    return src;
}
