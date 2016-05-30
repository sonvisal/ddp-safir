Session.set('compteur', 0);
Session.set('rank', '');
Session.set('quickview', '');
Template.reward.helpers({
    getProductByPoint: function() {
        var arr = [];
        var mypoint = Meteor.users.findOne({ _id: Meteor.userId() }).profile.shipcard.point;
        var cat = products.find({ category: "tester" });
        cat.forEach(function(data) {
            var point = data.point;
            var title = data.title;
            var price = data.price;
            var img = data.image;
            var id = data._id;
            var obj = {
                point:point,
                title:title,
                price:price,
                image:img,
                _id:id
            }
            if(point !== "" && point !== null && point <= mypoint){
                arr.push(obj);
            }
        });
        return arr;
    },
    getimgArray: function() {
        var id = Meteor.userId();
        var datauser = Meteor.users.findOne({ _id: id });
        if (datauser.image !== 'undefined' && datauser.hasOwnProperty('image')) {
            var len = datauser.image.length;
            return { image: datauser.image[len - 1] };
        }
    },
    membership: function() {
        var point = Meteor.users.findOne({ _id: Meteor.userId() }).profile.shipcard.point;
        var resultmembership = membership.find();
        var arrmem = [];
        resultmembership.forEach(function(value) {
            if (value.minpoint <= point && point <= value.maxpoint) {
                arrmem.push(value);
            }
        });
        if (arrmem[0].name == 'black') {
            return 'black';
        }
        if (arrmem[0].name == 'silver') {
            return 'silver';
        }
        if (arrmem[0].name == 'gold') {
            return 'gold';
        }
    },
    short: function(count) {
        return count.substr(0, 20);
    },
    getCount: function() {
        var cc = Session.get('compteur');
        cc = Number(cc);
        cc = cc + 1;
        Session.set('compteur', cc);
        return cc;
    },
    getpoint: function() {
        var me = Meteor.user();
        if (me == null)
            return;
        if (typeof me.profile.shipcard != "undefined")
            return me.profile.shipcard.point;
        else
            return 0;
    },
    isBronze: function() {
        if (Session.get('rank') == '') {
            var me = Meteor.user();
            //console.log('Getting user'+JSON.stringify(me));
            if (typeof me.profile.shipcard != "undefined")
                var point = Number(me.profile.shipcard.point);
            else
                point = 0;

            //console.log('ISBRONZEPOINT:'+point);
            if (point >= 0 && point < 1000) {
                Session.set('rank', 'BRONZE');
                //$('#ranking').addClass("backpt");
            } else if (point >= 1000 && point < 10000) {
                Session.set('rank', 'SILVER');
                //$('#ranking').addClass("backptsilver");
            } else {
                //$('#ranking').addClass("backptgold");
                Session.set('rank', 'GOLD');
            }
            //console.log('rank:'+Session.get('rank'));
        }
        if (Session.get('rank') == 'BRONZE')
            return true;
        else
            return false;
    },
    isSilver: function() {
        if (Session.get('rank') == '') {
            var me = Meteor.user();
            //console.log('Getting user ISSILVER');
            if (typeof me.profile.shipcard != "undefined")
                var point = Number(me.profile.shipcard.point);
            else
                point = 0;

            //console.log('POINT:'+point);
            if (point >= 0 && point < 1000) {
                Session.set('rank', 'BRONZE');
                //$('#ranking').addClass("backpt");
            } else if (point >= 1000 && point < 10000) {
                Session.set('rank', 'SILVER');
                //$('#ranking').addClass("backptsilver");
            } else {
                //$('#ranking').addClass("backptgold");
                Session.set('rank', 'GOLD');
            }
            //console.log('rank:'+Session.get('rank'));
        }
        if (Session.get('rank') == 'SILVER')
            return true;
        else
            return false;
    },
    isGold: function() {
        if (Session.get('rank') == '') {
            var me = Meteor.user();
            //console.log('Getting user ISGOLD');
            if (typeof me.profile.shipcard != "undefined")
                var point = Number(me.profile.shipcard.point);
            else
                point = 0;

            //console.log('POINT:'+point);
            if (point >= 0 && point < 1000) {
                Session.set('rank', 'BRONZE');
                //$('#ranking').addClass("backpt");
            } else if (point >= 1000 && point < 10000) {
                Session.set('rank', 'SILVER');
                //$('#ranking').addClass("backptsilver");
            } else {
                //$('#ranking').addClass("backptgold");
                Session.set('rank', 'GOLD');
            }
            //console.log('rank:'+Session.get('rank'));
        }
        if (Session.get('rank') == 'GOLD')
            return true;
        else
            return false;
    },
    isGold: function() {
        if (Session.get('rank') == '') {
            var me = Meteor.user();
            //console.log('Getting user ISSILVER');
            if (typeof me.profile.shipcard != "undefined")
                var point = Number(me.profile.shipcard.point);
            else
                point = 0;
            return point;
        }
    },
    getproduct: function() {
        var me = Meteor.user();
        if (typeof me.profile.shipcard != "undefined")
            var point = Number(me.profile.shipcard.point);
        else
            point = 0;

        //console.log('MyResult:'+point);
        var p = Number(point);
        //console.log('MyResult:'+p);
        //var result = products.find({point:{$gte:0,$lte:p}});
        var result = products.find({ point: p });

        //console.log("NB result: "+result.fetch().length);
        return result;

    },
    getproductreward: function() {
        result = products.find({ category: "tester" });
        return result;
    },
    getprofile: function() {
        var id = Meteor.userId();
        return Meteor.users.findOne({ _id: id });
    },
    getSelectedProduct: function() {
        var id = Session.get('quickview');
        if (id == '')
            return null;
        var currentProduct = products.find({ "_id": id });
        return currentProduct;
    }
});


Template.rewardsilver.helpers({
    getpoint: function() {
        var id = Meteor.userId();
        return Meteor.users.find({ _id: id });
    },
    getproduct: function() {
        var point = Meteor.user().profile.shipcard.point;
        //console.log('MyResult:'+point);
        var p = Number(point);
        //console.log('MyResult:'+p);
        var silver = 200;
        var gold = 300;
        var result = products.find({ point: { $gte: silver, $lte: p } });
        return result;
    }
});
Template.rewardgold.helpers({
    getpoint: function() {
        var id = Meteor.userId();
        return Meteor.users.find({ _id: id });
    },
    getproduct: function() {
        var point = Meteor.user().profile.shipcard.point;
        //console.log('MyResult:'+point);
        var p = Number(point);
        //console.log('MyResult:'+p);
        var gold = 300;
        var result = products.find({ point: { $gte: gold, $lte: p } });
        return result;
    }
});

Template.reward.events({
    // 'click #quickbtn': function(e,tpl){
    //        var productId=this._id;
    //        Session.set('quickview',productId);
    //    },
    //  'mouseover .thumbnail': function(e,tpl){
    //     $(e.currentTarget).find('.caption').slideDown(250);

    // },
    //  'mouseleave .thumbnail': function(e,tpl){
    //     $(e.currentTarget).find('.caption').slideUp(250);
    // },
    'mouseover ul.text-center li': function(e) {
        $(e.currentTarget).css("color", "#fff");
    },
    'click #addtocart': function(e, tpl) {
        e.preventDefault();
        var id_product = this._id;
        var qty = 1;
        var attribute = Session.get('selected_attr');
        if (attribute == 'No attribute')
            attribute = '';
        var userId = Session.get('userId');
        var selectPrice = this.price;
        var subtotal = 0;

        var sameproduct = cart.find({ id_product: id_product, userId: userId, attribute: attribute }).fetch();
        if (sameproduct.length > 0) {
            sameproduct = sameproduct[0];
            var pro = products.findOne({ _id: id_product });
            upqty = parseInt(sameproduct.quantity) + parseInt(qty);
            if (pro) {
                subtotal = upqty * parseInt(selectPrice);
            }
            var obj = { quantity: upqty, subtotal: subtotal };
            Meteor.call('updateStatus', sameproduct._id, obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert('درج افزودن به سبد خرید موفقیت <a href="/checkout" style="color:#fff; text-decoration: underline;">برو به پرداخت</a>', 'success', 'growl-bottom-right');
            } else {
                Bert.alert('Insert Add To Cart success <a href="/checkout" style="color:#fff; text-decoration: underline;">Go to Checkout</a>', 'success', 'growl-bottom-right');
            }
            $('.close').click();
        } else {
            var pro = products.findOne({ _id: id_product });
            if (pro) {
                subtotal = parseInt(qty) * parseInt(selectPrice);
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
                Bert.alert('درج افزودن به سبد خرید موفقیت <a href="/checkout" style="color:#fff; text-decoration: underline;">برو به پرداخت</a>', 'success', 'growl-bottom-right');
            } else {
                Bert.alert('Insert Add To Cart success <a href="/checkout" style="color:#fff; text-decoration: underline;">Go to Checkout</a>', 'success', 'growl-bottom-right');
            }
            $('.close').click();
        }
    }
});
// Template.reward.rendered=function(){
//  $("#quickbtn").click();
// };
