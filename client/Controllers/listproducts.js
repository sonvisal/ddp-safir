Session.set('nbproducts', '');
Session.set('querylimit', 16);
Session.set('quickview', '');
Session.set('DJIB_LIM', 16);

var processScroll = true;
$(window).scroll(function() {
    if (processScroll && $(window).scrollTop() > $(document).height() - $(window).height() - 600) {
        processScroll = false;
        //var oldLimit = Session.get('querylimit');
        //oldLimit += 16;
        //Session.set('querylimit', oldLimit);
        var route = window.location.href;
        //console.log('Router: '+route);
        if (route.indexOf('/category') > -1 || route.indexOf('/manageproduct') > -1) {
            var val = Session.get('DJIB_LIM');
            val = val + 16;
            //console.log('SUB '+val);
            Session.set('DJIB_LIM', val);
        }
        processScroll = true;
    }
});
Template.listproducts.rendered = function() {
    $(window).scroll(showMoreVisible);
}

Template.topcategory.helpers({
    Isblock: function(category) {
        var data1 = locations.findOne({ type: 'News', order: 1, page: 'category', categoryId: category, position: 'top', $or: [{ productid: "" }, { productid: [] }] });
        var data2 = locations.findOne({ type: 'News', order: 2, page: 'category', categoryId: category, position: 'top', $or: [{ productid: "" }, { productid: [] }] });
        var data3 = locations.findOne({ type: 'News', order: 1, page: 'category', categoryId: category, position: 'bottom', $or: [{ productid: "" }, { productid: [] }] });
        var data4 = locations.findOne({ type: 'News', order: 2, page: 'category', categoryId: category, position: 'bottom', $or: [{ productid: "" }, { productid: [] }] });
        var lifestyle = locations.find({ type: 'Lifestyle', page: 'category', categoryId: category, $or: [{ productid: "" }, { productid: [] }] }, { sort: { order: 1 } });

        if (typeof data1 == 'undefined' || typeof data2 == 'undefined' || typeof data3 == 'undefined' || typeof data4 == 'undefined' || lifestyle == 'undefined') {
            return false;
        } else {
            return true;
        }
    }
});

Template.listproducts.helpers({
    getIconlike: function(product_id) {
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
    myCurrentHelp: function() {
        return { products: products.find() };
    },
    checkListproductAction: function() {
        //console.log('Page:', Session.get('advanced_product'));
        if (Session.get('advanced_product') == 1)
            return false;
        else
            return true;
    },
    getListProduct: function() {

        var limit = Session.get('DJIB_LIM');
        var toSort = Session.get("GETName");
        var listtags = Session.get('list_tag').split(';');

        /*if (toSort == "name") {
            if (Session.get('list_tag') == '') {
                var result = products.find({ "category": { $in: Session.get('subcategories') } }, { limit: limit, sort: { title: 1 } }); ///////////////return products.find({},{sort:{title:1}});
                var total = products.find({ "category": { $in: Session.get('subcategories') } }).count(); ///////////////return products.find({},{sort:{title:1}});

            } else {
                var result = products.find({ "category": { $in: Session.get('subcategories') }, "tags.value": { $in: listtags } }, { limit: limit, sort: { title: 1 } });
                var total = products.find({ "category": { $in: Session.get('subcategories') }, "tags.value": { $in: listtags } }).count();

            }
        } else if (toSort == "price") {
            if (Session.get('list_tag') == "") {
                var result = products.find({ "category": { $in: Session.get('subcategories') } }, { limit: limit, sort: { price: -1 } }); //return products.find({},{sort:{price:-1}});
                var total = products.find({ "category": { $in: Session.get('subcategories') } }).count(); //return products.find({},{sort:{price:-1}});

            } else {
                var result = products.find({ "category": { $in: Session.get('subcategories') }, "tags.value": { $in: listtags } }, { limit: limit, sort: { price: -1 } });
                var total = products.find({ "category": { $in: Session.get('subcategories') }, "tags.value": { $in: listtags } }).count();
            }

        } else if (toSort == "sell") {
            if (Session.get('list_tag') == "") {
                var result = products.find({ "category": { $in: Session.get('subcategories') } }, { limit: limit, sort: { ratio: -1 } }); //return products.find({},{sort:{price:-1}});
                var total = products.find({ "category": { $in: Session.get('subcategories') } }).count(); //return products.find({},{sort:{price:-1}});
            } else {
                var result = products.find({ "category": { $in: Session.get('subcategories') }, "tags.value": { $in: listtags } }, { limit: limit, sort: { ratio: -1 } });
                var result = products.find({ "category": { $in: Session.get('subcategories') }, "tags.value": { $in: listtags } }).count();
            }

        } else {
               // console.log('LE BONBLOCK'+Session.get('subcategories'));
                var result = products.find({ "category": { $in: Session.get('subcategories') } }, { limit: limit });
                var total = products.find({ "category": { $in: Session.get('subcategories') } }).count();
                //console.log('NB RESULT='+total);
            

        }*/
        var cat = Session.get('subcategories');
        var myprice = Session.get('MYPRICE');
        var mybrands = Session.get('MYBRAND');
        var mytags = Session.get('MYTAG');
        var mysort = '';
        //console.log('sort key:', toSort);
        switch (toSort) {
            case "name":
                mysort = { limit: limit, sort: { title: 1 } }
                break;
            case "price":
                mysort = { limit: limit, sort: { price: -1 } }
                break;
            case "sell":
                mysort = { limit: limit, sort: { ratio: -1 } }
                break;
            default:
                mysort = { limit: limit, sort: { title: 1 } };
                break;

        }
        console.log('data sort', mysort);
        var result = getFilterProductsClient(limit, cat, myprice, mybrands, mytags, mysort);

        Session.set('nbproducts', result.fetch().length);
        Session.set('allproducts', result.fetch().length);
        if (Session.get('finishQuizz') == '') {
            var j = journey.find({ "category": parent }).fetch();
            if (j.length > 0) {}
        }
        //console.log('count product:', result.fetch.length);
        return { products: result, category: Session.get('currentCategory') };
    },
    getAdvanced: function() {
        var currenturl = Router.current().route.path();
        //console.log("currenturl " + currenturl);
        if (currenturl == "/advanced") {
            return true;
        } else {
            return false;
        }

    },
    getListprice: function(oldId) {
        var attrprice = attribute.findOne({ "product": oldId });
        return attrprice;
    },
    getAttribprice: function(oldId) {
        Meteor.call('getAttrPrice', oldId, function(err, data) {
            if (!err) {
                var attr = '.price' + data.product;
                var price = data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                $(attr).html('ریال ' + price);
                //$(attr).html('ریال ' + data.price);
                Session.set('priceAttr', data.price);
            }
        });
    },
    totalProducts: function() {
        //return Session.get('allproducts');
        var catId = Session.get('subcategories');
        Meteor.call('getResult', catId, function(err, result) {
            if (!err) {
                //console.log("result of result " + result);
                Session.set("RESULT", result);
            }

        });
        return Session.get("RESULT");
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
                    found = true;
                }
            });

            return found;
        } else {
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
    /*getSelectedProduct: function(){
        var id=Session.get('quickview');
        if(id=='')
            return null;
        var currentProduct=products.find({"_id":id});
        return currentProduct;
    },*/
    getShop: function() {
        return shops.find({});
    },
    getShopname: function(id) {
        var shop = shops.findOne({ _id: id });
        if (shop) return shop.name;
    },
    checkBanner: function(param) {
        //console.log('Param:'+param)
        if (typeof param != 'undefined' && param != '') return true;
        else return false;
    }
});
Template.listproducts.events({
    'click .img_attr': function(e, tpl) {
        var attr = attribute.findOne({ "_id": this._id });
        Session.set('selected_price', attr.price);
    },
    'click #quickbtn': function(e, tpl) {
        $('.modal-backdrop').remove();
    },
    "mouseenter #ex1": function(e, tpl) {
        if (Session.get('miniature') == 0) {
            $('#ex1').trigger('zoom.destroy');
            $('#ex1').zoom();
            Session.set('miniature', 1);
        }

    },
    'click #favorite': function(e, tpl) {
        e.preventDefault();
        var id = this._id;
        var css = $(e.currentTarget).attr("class");
        if (css == "fa fa-heart red pull-right") {
            Meteor.call('deleteFavorite', id);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert('محصولات از برگزیدن حذف شده است', 'success', 'growl-bottom-right');
            } else {
                Bert.alert('Product has been Removed from Favorite', 'success', 'growl-bottom-right');
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
                    Bert.alert('محصول شده است اضافه به مورد علاقه', 'success', 'growl-bottom-right');
                } else {
                    Bert.alert('Product has been Add to Favorite', 'success', 'growl-bottom-right');
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
                    Bert.alert('محصول شده است اضافه به مورد علاقه', 'success', 'growl-bottom-right');
                } else {
                    Bert.alert('Product has been Add to Favorite', 'success', 'growl-bottom-right');
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
    },*/
    /*'click #quickbtn': function(e,tpl){
        var productId=this._id;
        Session.set('quickview',productId);
    },*/
    'click #addtocart': function(e, tpl) {
        e.preventDefault();
        var id_product = this._id;
        var qty = tpl.$("#qty").val();
        var attribute = Session.get('selected_attr');
        if (attribute == 'No attribute')
            attribute = '';
        var userId = Session.get('userId');
        var subtotal = 0;

        var sameproduct = cart.find({ id_product: id_product, userId: userId, attribute: attribute }).fetch();

        if (sameproduct.length > 0) {
            sameproduct = sameproduct[0];
            var pro = products.findOne({ _id: id_product });
            upqty = parseInt(sameproduct.quantity) + parseInt(qty);
            if (pro) {
                subtotal = upqty * parseInt(Session.get('priceAttr'));
            }
            //console.log('update of the cart');
            var obj = { quantity: upqty, subtotal: subtotal };
            Meteor.call('updateStatus', sameproduct._id, obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    //title: 'Success, Insert Add to Cart !',
                    message: '<Success, Insert Add to Cart ! a href="/checkout" style="color:#B81425; text-align: left;">See checkout</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
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
        } else {
            var pro = products.findOne({ _id: id_product });
            if (pro) {
                subtotal = parseInt(qty) * parseInt(Session.get('priceAttr'));
            } else
                subtotal = 0;
            var obj = {
                id_product: id_product,
                userId: Session.get('userId'),
                quantity: qty,
                subtotal: subtotal,
                /*shop:shop,*/
                attribute: attribute,
                order_status: 0
            };
            Meteor.call('addtocart', obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    //title: 'Success, Insert Add to Cart !',
                    message: '<Success, Insert Add to Cart ! a href="/checkout" style="color:#B81425; text-align: left;">See checkout</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
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
        }
    },
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
    }

});

Template.details.rendered = function() {

    $("[rel='tooltip']").tooltip();
};

getFilterProductsClient = function(limit, subcategories, myprice, mybrands, mytags, sort) {

    var result = '';
    var query = '';
    if (mybrands.length > 0 && mytags.length <= 0 && myprice.length <= 1) {
        console.log('brand:');
        query = { category: { $in: subcategories }, Brand: mybrands };
        result = products.find(query, sort);
    } else if (mybrands.length > 0 && mytags.length > 0 && myprice.length <= 1) {
        console.log('brand & tag:');
        query = { category: { $in: subcategories }, Brand: mybrands, "tags.value": { $in: [mytags] } };
        result = products.find(query, sort);
    } else if (mybrands.length > 0 && mytags.length <= 0 && myprice.length > 1) {
        console.log('brand & price:');
        query = { category: { $in: subcategories }, Brand: mybrands, price: { $lte: myprice } };
        result = products.find(query, sort);
    } else if (mybrands.length > 0 && mytags.length > 0 && myprice.length > 1) {
        console.log('brand, tag & price:');
        query = { category: { $in: subcategories }, Brand: mybrands, "tags.value": { $in: [mytags] }, price: { $lte: myprice } };
        result = products.find(query, sort);
    } else if (mybrands.length <= 0 && mytags.length > 0 && myprice.length <= 1) {
        console.log('tag:');
        query = { category: { $in: subcategories }, "tags.value": { $in: [mytags] } };
        result = products.find(query, sort);
    } else if (mybrands.length <= 0 && mytags.length > 0 && myprice.length > 1) {
        console.log('tag & price:');
        query = { category: { $in: subcategories }, "tags.value": { $in: [mytags] }, price: { $lte: myprice } };
        result = products.find(query, sort);
    } else if (mybrands.length <= 0 && mytags.length <= 0 && myprice.length > 1) {
        console.log('price:');
        query = { category: { $in: subcategories }, price: { $lte: myprice } };
        result = products.find(query, sort);

    } else {
        result = products.find({ category: { $in: subcategories } }, sort);
        console.log('category only');
    }
    //console.log('category:', Session.get('subcategories'));
    //console.log('result:', result.count());
    return result;
}
