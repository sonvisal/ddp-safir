///////checkout.js
Session.set("total", 0);
Template.checkout.helpers({
    attrValue:function(id_attr){
        Meteor.call('showAttrValue',id_attr,function(err,data){
            if(!err){
                $('.value_attr'+data.id_attr).html(data.value);
            }
        });
    },
    nameParent:function(id_attr){
        Meteor.call('showNameParentAttr',id_attr,function(err,data){
            if(!err){
                $('.parent_name'+data.id_attr).html(data.name+' ');
            }
        });
    },
    basket: function() {
        var userId = Session.get('userId');
        mycart = cart.find({ "userId": userId });
        if (mycart.count() == 0) {
            return true;
        } else {
            return false;
        }
    },
    getprofile: function() {
        var id = Meteor.userId();
        return Meteor.users.findOne({ _id: id });
    },
    numberItemCart: function() {
        var totalItem = 0;
        var userId = Session.get('userId');
        mycart = cart.find({ userId: userId });

        // console.log('cartid:' + userId);
        // console.log('DJIBCARTING:' + mycart.count());
        mycart.forEach(function(value) {
            totalItem += parseInt(value.quantity);
        });
        return totalItem;
    },
    getGetway: function() {
        var getway = Session.get("GETWAY");
        if (getway == "success") {
            return "/confirmorder2";
        } else {
            return "#";
        }
    },
    resNum: function() {
        return Random.id();
    },
    /*getCart: function() {
        var total = 0;
        var userId = Session.get('userId');
        mycart = cart.find({ "userId": userId });

        mycart.forEach(function(value, index) {
            total = total + value.subtotal;
        });
        Session.set("total", total);

        return mycart;
    },
    getProductInfo: function(productid) {
        return products.findOne({ _id: productid });
    },*/
    getImage: function(id) {
        var image = products.findOne({ _id: id }).image;

        var res = image.replace("uploads", "upload");
        return res;
    },
    getShopName: function(id) {
        return shops.findOne({ "_id": id }).name;
    },
    getProname: function(id) {
        return products.findOne({ _id: id }).title;
    },
    getPrice: function(id) {
        return products.findOne({ _id: id }).price;
    },
    getTotal: function() {
        var total = Session.get("total");
        return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    getImageid: function(id) {

        return products.findOne({ _id: id }).image;
    },
    Contotal: function(total) {
        //console.log("TOTAl==="+total);
        return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});
Template.checkout.events({
    "click .continue-shop": function() {
        history.back();
    },
    "click #bank": function(e, tpl) {
        var resNum = $("#ResNum").val();
        var amount = $("#Amount").val();
        var t = Date.now();
        var user = Session.get('userId');
        var obj = {
            resNum: resNum,
            amount: amount,
            time: t,
            user: user
        };
        //console.log('inserting payment:' + JSON.stringify(obj));
        Meteor.call('addPayment', obj);

    },
    "change #updateqty": function(e, tmp) {
        var id_product = $(e.currentTarget).attr('data-pro');
        var id_attr = $(e.currentTarget).attr('data-attr');
        var qty = $(e.currentTarget).val();
        qty = parseInt(qty);
        var userId = Session.get('userId');
        Meteor.call('updateMyCart', id_product, userId, qty, id_attr);
    },
    "click .glyphicon-trash": function(e, tmp) {
        var id = this._id;
        return cart.remove({ _id: id });
    },
    'click #removeProdInCart': function(e) {
        e.preventDefault();
        var userid = '';
        var dataPro = $(e.currentTarget).attr("data-pro");
        var dataProAttr = $(e.currentTarget).attr("data-attr");
        userid = Session.get('userId');
        Meteor.call('removeProInCart', userid, dataPro, dataProAttr);
    },
    'click #removecheckout': function(e) {
        e.preventDefault();
        var id = this._id;
        alert(id);
        var itemid = $(e.currentTarget).attr("data-remove");
        if (Meteor.userId()) {
            userid = Meteor.userId();
        } else {
            userid = Session.get('userId');
        }
        Meteor.call('removemycheckout', id, function(err) {
            if (err) {
                console.log("Error Remove Checkout: " + err.reason);
            } else {
                console.log("Remove Checkout Success!!!");
            }
        });
    },
    'click #btnAdd': function(e) {
        e.preventDefault();
        var userid = Session.get('userId');
        // if(Meteor.userId()){
        //  userid=Meteor.userId();
        // }
        mycart = cart.find({ userId: userid });
        var total = 0;
        if (mycart.count() > 0) {
            var allItems = [];
            mycart.forEach(function(value) {
                var item = {
                    "id_product": value.id_product,
                    "qty": value.quantity,
                    "shop": value.shop,
                    "attribute": value.attribute,
                    "subtotal": value.subtotal,
                    "order_status": 1
                };
                total = total + value.subtotal;
                allItems.push(item);
                Meteor.call('updateCartStatus', value._id);
            });
            Session.setPersistent('orderId', Random.id());
            var obj = {
                userid: Meteor.userId(),
                orderId: Session.get('orderId'),
                total: total,
                items: allItems,
                time: getTimestamp(),
                status: 'pending'
            }
            Meteor.call('insertOrder', obj);
            Router.go("/confirmorder");
        } else {
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert('Please make order product to check out! : Secure Server', 'danger', 'growl-bottom-right');
            } else {
                Bert.alert('Please make order product to check out! : Secure Server', 'danger', 'growl-bottom-right');
            }
        }
    },
    "click .btn_checkout": function() {
        var curUrlCo = Iron.Location.get().path;
        Session.set("REDIRECTCO", curUrlCo);
    }
});
Template.checkout.helpers({
    getAtrByParent: function(attribute) {
        Meteor.call('getAtrByParentt', attribute, function(err, data) {
            if (!err) {
                $('.parent' + attribute).html(data);
            }
        });
    },
    getAttrValue: function(attr) {
        Meteor.call('getAttrValueById', attr, function(err, data) {
            if (!err) {
                $('.valueAttr' + attr).html(data);
            }
        });
    },
    getImgByrow: function(attr, proId) {
        Meteor.call('getImgAttrById', attr, proId, function(err, data) {
            if (!err) {
                if (attr) {
                    var img = getImgCDN(data);
                    $('.imgAttr' + attr).attr('src', img)
                    $('.imgAttr' + attr).error(function() {
                        $('.imgAttr' + attr).attr('src', getImg(data));
                    });
                } else {
                    $('.imgAttr' + proId).attr('src', getImgForProductCDN(data))
                    $('.imgAttr' + proId).error(function() {
                        $('.imgAttr' + proId).attr('src', getImgForProductCDN(data));
                    });
                }
            }
        });
    },
    getprofile: function() {
        var id = Meteor.userId();
        return Meteor.users.findOne({ _id: id });
    },
    'click #conf': function() {
        var getway = Session.get("GETWAY");
        if (getway != "success") {
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert('Please click on button Continue : Secure Server', 'danger', 'growl-bottom-right');
            } else {
                Bert.alert('Please click on button Continue : Secure Server', 'danger', 'growl-bottom-right');
            }
        }
    }
});
Template.confirmorder.helpers({
    getprofile: function() {
        var id = Meteor.userId();
        return Meteor.users.findOne({ _id: id });
    },
    getAddress1: function() {
        var id = Meteor.userId();
        return Meteor.users.findOne({ _id: id }).profile.address;
    },
    getGetway: function() {
        var getway = Session.get("GETWAY");
        if (getway == "success") {
            return "/confirmorder2";
        } else {
            return "#";
        }
    }
});
Template.confirmorder.events({
    'click #btnshopcart': function(e) {
        e.preventDefault();
        var add = $("#oldAddress").text();
        if (add == '') {
            Bert.alert('-ادرس خود را وارد نماييد', 'danger', 'growl-bottom-right');
        } else {
            Meteor.call('addAdress', Session.get('orderId'), add);
            Router.go("/confirmorder2");
        }
    },
    'click #btnAdd': function(e) {
        e.preventDefault();
        var add = $("#newAddress").val();
        if (add == '') {
            Bert.alert('-ادرس خود را وارد نماييد', 'danger', 'growl-bottom-right');
        } else {
            Meteor.call('addAdress', Session.get('orderId'), add);
            Router.go("/confirmorder2");
        }
    },
    'click .btn_edit': function(e) {
        e.preventDefault();
        $('.confirm').addClass('hidden');
        $('.edit_confirm').removeClass('hidden');
    },
    'click .btn_validation': function(e) {
        e.preventDefault();
        var email1 = $("#email1").val();
        var address1 = $("#address1").val();
        var phone1 = $("#phone1").val();

        var email2 = $("#email").val();
        var address2 = $("#address").val();
        var phone2 = $("#phone").val();

        var user = Meteor.user();
        var id = user._id;
        var fname = user.profile.firstname;
        var lname = user.profile.lastname;
        var name = user.profile.name;
        var country = user.profile.country;
        var city = user.profile.city;
        var userearn = user.profile.earnpoint;
        var sex = user.profile.sex;
        var language = user.profile.language;
        var birth = user.profile.birth;
        var point = user.profile.shipcard.point;
        var membershipId = user.profile.shipcard.membershipID;
        var img_id = user.image;
        if (email1 == '' && address1 == '' && phone1 == '') {
            var email = email2;
            var address = address2;
            var phone = phone2;
        }
        if (email2 == '' && address2 == '' && phone2 == '') {
            var email = email1;
            var address = address1;
            var phone = phone1;
        }
        var obj = {
            profile: {
                firstname: fname,
                lastname: lname,
                name: name,
                country: country,
                city: city,
                earnpoint: userearn,
                sex: sex,
                language: language,
                birth: birth,
                address: address,
                phone: phone,
                shipcard: {
                    membershipID: membershipId,
                    point: point
                }
            },
            image: img_id
        }
        if (email == '' || address == '' || phone == '') {
            if (email == '') {
                if (TAPi18n.getLanguage() == 'fa') {
                    $('.error_email').text("-ايميل ادرس درست نمي باشد");
                } else {
                    $('.error_email').text("Email is required!");
                }
            }
            if (address == '') {
                if (TAPi18n.getLanguage() == 'fa') {
                    $('.error_address').text("-ادرس خود را وارد نماييد");
                } else {
                    $('.error_address').text("Address is required!");
                }
            }
            if (phone == '') {
                if (TAPi18n.getLanguage() == 'fa') {
                    $('.error_phone').text("-شماره موبايل وارد نماييد");
                } else {
                    $('.error_phone').text("Phone is required!");
                }
            }
        } else {
            Meteor.call('editEmail', email);
            Meteor.call('editprofile', id, obj, function(err, respond) {
                if (!err) {
                    $('.error_email').text("");
                    $('.error_address').text("");
                    $('.error_phone').text("");
                    Session.set("GETWAY", undefined);
                    $('.confirm').removeClass('hidden');
                    $('.edit_confirm').addClass('hidden');
                }
            });
        }
    },
    'click .btn-con-server': function() {
        var getform = $('#hideform').attr("class");
        var checkform = getform.replace(/\s+/g, '');
        if (checkform == 'edit_confirm') {
            var email = $('#email1').text();
            var address = $('#address1').text();
            var phone = $('#phone1').text();
        } else {
            var email = $('#email').text();
            var address = $('#address').text();
            var phone = $('#phone').text();
        }

        var delivery = $('#delivery').val();
        var idorder = Session.get('orderId');
        /*var email = $('#email').text();
        var address = $('#address').text();
        var phone = $('#phone').text();*/
        //var userId = Session.get('userId');
        var uid = Meteor.userId();
        var earngUser = Meteor.users.findOne({ _id: uid });
        if (email == "" || address == "" || phone == "") {
            if (email == "") {
                if (TAPi18n.getLanguage() == 'fa') {
                    Bert.alert('Email is required', 'danger', 'growl-bottom-right');
                } else {
                    Bert.alert('Email is required', 'danger', 'growl-bottom-right');
                }
            }
            if (address == "") {
                if (TAPi18n.getLanguage() == 'fa') {
                    Bert.alert('Address is required', 'danger', 'growl-bottom-right');
                } else {
                    Bert.alert('Address is required', 'danger', 'growl-bottom-right');
                }
            }
            if (phone == "") {
                if (TAPi18n.getLanguage() == 'fa') {
                    Bert.alert('Phone is required', 'danger', 'growl-bottom-right');
                } else {
                    Bert.alert('Phone is required', 'danger', 'growl-bottom-right');
                }
            }
        } else {
            if (earngUser != null) {
                var points = Number(earngUser.profile.shipcard.point) + 70;
                Meteor.call('earnPoint', uid, points, function(err) {
                    if (err)
                        console.log("earnPoint error === " + err.reason);
                    else {
                        //console.log("success " + earngUser.profile.shipcard.point);
                        Meteor.call('addDelivery', idorder, delivery, email, address, phone, uid, Session.get('orderId'), function(err) {
                            if (err) {
                                console.log("Error Delivery===" + err.reason);
                            } else {
                                Session.set("GETWAY", "success");
                                Router.go('/confirmorder2');
                            }
                        });
                    }
                });
            }
        }
    },
    'click #conf': function() {
        var getway = Session.get("GETWAY");
        if (getway != "success") {
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert('Please click on button Continue : Secure Server', 'danger', 'growl-bottom-right');
            } else {
                Bert.alert('Please click on button Continue : Secure Server', 'danger', 'growl-bottom-right');
            }
        }
    }
});

Template.confirmorder2.helpers({
    farsi: function() {
        if (TAPi18n.getLanguage() == 'fa') {
            return true;
        } else {
            return false;
        }
    },
    getTotal: function() {
        return Session.get("total");
    },
    resNum: function() {
        var res = Random.id();
        Meteor.call('saveInvoice', res, Session.get("total"));
        return res;
    },
    getOrderId: function() {
        var user = Meteor.userId();
        var myOrder = order.findOne({ userid: user }, { sort: { time: -1 } });
        return myOrder.orderId;
    }
});
Template.confirmorder2.events({
    'mouseover .clickSubmit':function(e){
        var user = Meteor.users.findOne({ _id: Meteor.userId() });
        var pointUser = user.profile.shipcard.point;
        console.log("user point "+pointUser);
        var id = user._id;
        var IdOrder=$(e.currentTarget).attr('data-id');
        var pro = order.findOne({'orderId':IdOrder});
        var item = pro.items;
        Meteor.call('getAllPointProOrder',item,function(err,data){
            if(!err){
                //========
                console.log('allpoint=='+data.allpoint);
                if(data.allpoint>pointUser){
                    if (TAPi18n.getLanguage() == 'fa') {
                        Bert.icons[ 'my-error' ] = 'fa-reviewsc-iconbg';
                        Bert.alert({
                        message: 'Need farsi (You have not enough!)',
                        type: 'my-error',
                        style: 'growl-bottom-right',
                        icon: 'fa-reviewsc-iconbg'
                        });
                    } else {
                        Bert.icons[ 'my-error' ] = 'fa-reviewsc-iconbg';
                        Bert.alert({
                        message: 'You have not enough!',
                        type: 'my-error',
                        style: 'growl-bottom-right',
                        icon: 'fa-reviewsc-iconbg'
                        });
                    }
                    $('.close').click();
                }
                //========
            }
        });
        
    },
    /*'click #btnUpdate': function(e) {
        var idorder = Session.get('orderId');
        var delivery = $('#sel1').val();
        var userId = Session.get('userId');
        var uid = Meteor.userId();
        var earngUser = Meteor.users.findOne({ _id: uid});

        if(earngUser != null) {
            var points = Number(earngUser.profile.shipcard.point) + 70;
            Meteor.call('earnPoint', uid, points, function(err) {
             if (err)
                console.log("error ");
             else
                console.log("success " + earngUser.profile.shipcard.point);
            });
        }
        Meteor.call('addDelivery', idorder, delivery, userId, Session.get('orderId'));
    }*/
    'click #btnUpdate': function(e) {
        var userId = Session.get('userId');
        var user = Meteor.users.findOne({ _id: Meteor.userId() });
        var pointUser = user.profile.shipcard.point;
        console.log("user point "+pointUser);
        var id = user._id;
        var IdOrder=$(e.currentTarget).attr('data-id');
        var resulOder = order.findOne({'orderId':IdOrder});
        var item = resulOder.items;
        Meteor.call('getAllPointProOrder',item,function(err,data){
            if(!err){
                var data_id=data.data_id;
                if(data.allpoint>pointUser){
                    for(var i=0;i<data_id.length;i++){
                        Meteor.call("removeItem",data_id[i],resulOder._id);
                    }
                }else{
                    var newpoint = Number(pointUser-data.allpoint);
                    console.log("newpoint "+newpoint);
                    Meteor.call("minusPointUser",newpoint, function(err){
                        if(!err){
                            console.log("success");
                        }else{
                            console.log("error");
                        }
                    });
                }
            }
        });
        Meteor.call("removeCart", userId, function(err) {
            if (err) {
                console.log("remove cart Error===" + err.reason);
            } else {
                console.log("removed cart");
            }
        });
    }
});
Template.checkout.onRendered(function() {
    this.autorun(function() {
        Template.currentData();
    });
})
