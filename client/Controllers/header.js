Session.set("loginError", "");
Session.set("registerError", "");
Session.set("Duplicate");
Session.set('quickview', '');

// Template.body.rendered = function() {
// 	var idpopup = Session.get("popup");
//     //$("#en").click();
//     if (!Session.get("popup")) {
        
//         this.$("#instaModal").modal('show');
//         //$(".modal").addClass("modalalert");
//         $(".modal-backdrop").removeClass("modal-backdrop");
//         $('#instaModal').on('hidden.bs.modal', function () {
//             Router.go('/home');
//         });
//         $('#instaModalcomfirm').on('hidden.bs.modal', function () {
//             Router.go('/profile');
//         });

//     	//console.log("first time popup");
//         setTimeout(function() {
//             $('#popupfivemin').show();
//         }, 300000);
//         //}, 10000);
        
//         setTimeout(function() {
//            $('#popupfivemin').hide();
//         }, 318000);

//         var idcurrentuser = Random.id();
//         var timeInMs = Date.now() / 1000;
//         //console.log("timestamp:" + timeInMs);

//         if (!Session.get("timeuser") && !Session.get("popup")) {
//             Session.setPersistent("popup", idcurrentuser);
//             Session.setPersistent("timeuser", timeInMs);
//         }

//         var id = Session.get("popup");
//         //console.log("id user :" + id);
//         //console.log("timeuser :" + Session.get("timeuser"));

//     } else {
//     	//console.log("after first time popup");
//         setTimeout(function() {
//             $('#popupfivemin').show();
//         }, 18000000);

//          setTimeout(function() {
//             $('#popupfivemin').hide();
//         },18030000);
//     }

// }
Template.body.events({
    "click #fiveminpopup": function() {
        $('#popupfivemin').hide();
        //console.log("close modal");
    },
    "click .close-popupdaily":function(){
         $('#popupfivemin').hide();
    }

});
Template.header.onRendered(function(){
    var width = $(window).width();
    if(width <= 480){
        $(".login_register").click(function(){
            $(".my_fast_login").addClass("hidden");
        });
    }
});
Template.header.helpers({
    //dropdown_9columns dropdown_right dropdown_container droplast_right
    getMenuStyle:function(){
        if (TAPi18n.getLanguage() == 'fa') {
            return 'dropdown_9columns dropdown_right  droplast_right';
        } else {
            return 'dropdown_container_left';
        }
    },
    myCart: function() {
        var totalItem = 0;
        var userId = Session.get('userId');
        mycart = cart.find({ userId: userId });
        mycart.forEach(function(value) {
            totalItem += parseInt(value.quantity);
        });
        return totalItem;
    },
    myfavorit: function() {
        var userId = getFavUserId(); //Session.get('userId');
        myfavorit = favorite.find({ userId: userId }).count();
        return myfavorit;
    },
    getDiv:function(){
        if (TAPi18n.getLanguage() == 'en')
            return 'pull-right';
    },
    getText:function(){
        if (TAPi18n.getLanguage() == 'en')
        return 'text-right';
    },
    /*getCart: function() {
        var total = 0;
        var userId = Session.get('userId');
        mycart = cart.find({ "userId": userId });

        mycart.forEach(function(value, index) {
            total = total + value.subtotal;
        });
        Session.set("total", total);
        if(mycart.count()<=3){
            $('.ka_checkout_scroll').css('overflow-y','');
        }else{
            $('.ka_checkout_scroll').css('overflow-y','scroll');
        }
        return mycart;
    },*/
    /*getProductInfo: function(productid) {
        return products.findOne({ _id: productid });
    },*/
    getTotal: function() {
        var total = Session.get("total");
        return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    Contotal:function(total){
        //console.log("TOTAl==="+total);
        return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    // fast login
    duplicateEmail: function() {
        if (Session.get("DUPLICATE") == true) return true;
        else return false;
    },
    loginError: function() {
        var msg = Session.get("loginError");
        if (msg) return true;
        else return false;
    },
    loginErrormsg: function() {
        return Session.get("loginError");
    },
    registerError: function() {
        var msg = Session.get("registerError");
        if (msg) return true;
        else return false;
    },
    registerErrormsg: function() {
        return Session.get("registerError");
    },

    getallbrand:function(){
           Meteor.call('allbrands', function(err, data){
            if(err) console.log(err);
            else {
              Session.set("mybrands1",data)
            }
        });
        //console.log("all "+Session.get('mybrands'));
        return Session.get('mybrands1');
    }


});
Template.header.events({
    'click #btn_invite':function(e){
        e.preventDefault();
    if(Meteor.userId()){
      var user=Meteor.users.findOne({_id:Meteor.userId()});
      
      var name=user.profile.firstname;
        var subject =name+' invite you to safirperfumery.com !';
        var sendTo = $('#emailinvite').val();
        var message= ' <a href="http://localhost:3000/login">Pleas confirm</a>';
        //console.log(Meteor.userId());
        if(validateEmail(sendTo) == true){
          alert('ok');
          Meteor.call('inviteFriends',sendTo,subject,message,function(err){
              if(err){
                  console.log("error" + err);
              }else{
                obj={
                 user_id:Meteor.userId(),
                 email_imedate:sendTo,
                 date:Date.now()
                }
               Meteor.call('insertImedation',sendTo,obj)
             }
          });
        }
        
    }else{
      Router.go('/login');
    } 
    },
    'click #regis':function(){
        $(".loginform").css("display", "none");
        $(".registerform").css("display", "block");
    },
    'click #loginback':function(){
        $(".loginform").css("display", "block");
        $(".registerform").css("display", "none");
    },
    'click .login_register':function(){
        var currentRoute = Iron.Location.get().path;
        Session.set("CURRENTROUTE",currentRoute);
        Router.go('/login');
    },
    'click .img-shopcart':function(){
        Router.go('/checkout');
    },
    'click .my-add-card-delete': function(e) {
        e.preventDefault();
        var id = this._id;
        var itemid = $(e.currentTarget).attr("data-remove");
        if (Meteor.userId()) {
            userid = Meteor.userId();
        } else {
            userid = Session.get('userId');
        }
        Meteor.call('removemycheckout', id, function(err) {
            if (err){
                //console.log("Error Remove Checkout: " + err.reason);
            }
            else{
                //console.log("Remove Checkout Success!!!");
            }
        });
    },
    'click #proccedOrder':function(){
        var userid = Session.get('userId');
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
            alert('Please make order product to check out!');
        }
    },
    'keyup .reg-password': function(e) {
        e.preventDefault();
        $(".alert-warning").addClass("hid_div");
        var password = $('.reg-password').val();
        var passwordsInfo = $('#info_pass');
        //Must contain 5 characters or more
        var WeakPass = /(?=.{6,}).*/;
        //Must contain lower case letters and at least one digit.
        var MediumPass = /^(?=\S*?[a-z])(?=\S*?[0-9])\S{6,}$/;
        //Must contain at least one upper case letter, one lower case letter and one digit.
        var StrongPass = /^(?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])\S{6,}$/;
        //Must contain at least one upper case letter, one lower case letter and one digit.
        var VryStrongPass = /^(?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[^\w\*])\S{6,}$/;

        if (password) {
            if (VryStrongPass.test(password)) {
                passwordsInfo.removeClass().addClass('vrystrongpass').html("Very Strong! (Awesome, please don't forget your pass now!)");
            } else if (StrongPass.test(password)) {
                passwordsInfo.removeClass().addClass('strongpass').html("Strong! (Enter special chars to make even stronger");
            } else if (MediumPass.test(password)) {
                passwordsInfo.removeClass().addClass('goodpass').html("Good! (Enter uppercase letter to make strong)");
            } else if (WeakPass.test(password)) {
                passwordsInfo.removeClass().addClass('stillweakpass').html("Still Weak! (Enter digits to make good password)");
            } else {
                passwordsInfo.removeClass().addClass('weakpass').html("Very Weak! (Must be 6 or more chars)");
            }
        };

    },
    'click .fast_login': function(event, tpl) {
        event.preventDefault();
        var url = 'https://www.google-analytics.com/collect?v=1&t=event&tid=UA-71059459-2&cid=555&ec=login&ea=click&el=login&ev=1';
        Meteor.call('eventCall', url, function(error, result) {
            Bert.icons[ 'my-error' ] = 'fa-users-iconbg';
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert({
                message: 'ورود به سیستم با موفقیت انجام شد!<br><a href="/profile" style="color:#B81425; margin-left:60px;">نمایش پروفایل</a>',
                type: 'my-error',
                style: 'growl-bottom-right',
                icon: 'fa-users-iconbg'
                });
            } else {
                Bert.alert({
                message: 'Successfully logged in! <br><a href="/profile" style="color:#B81425; margin-left:60px;">See my profile</a>',
                type: 'my-error',
                style: 'growl-bottom-right',
                icon: 'fa-users-iconbg'
                });
            }
            if (error) {
                //console.log('Analytic CLIENT ERRR');
                //console.log(error);
            } else {
                //console.log('Analytic CLIENT RESULT');
                //console.log(result);
            }
        });
        $("#loginError").text("");
        var fields = $('#name').val();
        email = fields;

        var password = $('#pass').val();

        Meteor.loginWithPassword(email, password, function(error) {
            if (error) {
                if (TAPi18n.getLanguage() == 'fa') {
                    Bert.icons[ 'my-error' ] = 'fa-loginerr-iconbg';
                    Bert.alert({
                    message: 'نام و یا رمز عبور شما اشتباه است!',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-loginerr-iconbg'
                    });
                } else {
                    Bert.icons[ 'my-error' ] = 'fa-loginerr-iconbg';
                    Bert.alert({
                    message: 'Login error !',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-loginerr-iconbg'
                    });
                }
            } else {
                Session.set("loginError", "");
                var loggedInUser = Meteor.user();
                if(loggedInUser.profile.language){
                    if(loggedInUser.profile.language=='Persian')
                        Session.set('LANG','fa');
                    else
                        Session.set('LANG','en');
                }
                var group = "mygroup";
                var currentRoute = Iron.Location.get().path;
                if (Roles.userIsInRole(loggedInUser,['admin'], group)) {
                     if(currentRoute==="/login"){
                        Router.go("/profile");
                    }else{
                        Router.go(currentRoute);
                    }
                } else if(Roles.userIsInRole(loggedInUser, ['member'], group)) {
                     if(currentRoute==="/login"){
                        Router.go("/profile");
                    }else{
                        Router.go(currentRoute);
                    }
                }
            }
            Session.set('pass', null);
        });
    },
    'click .btn-register': function(event) {
        event.preventDefault();
        var url = 'https://www.google-analytics.com/collect?v=1&t=event&tid=UA-71059459-2&cid=555&ec=register&ea=click&el=register&ev=1';
        Meteor.call('eventCall', url, function(error, result) {
            if (error) {
                //console.log('Analytic CLIENT ERRR');
                //console.log(error);
            } else {
                //console.log('Analytic CLIENT RESULT');
               // console.log(result);
            }
        });
        var username = $(".reg-username").val();
        var firstname = $('.reg-firstname').val();
        var lastname = $('.reg-lastname').val();
        var email = $('.reg-email').val();
        var password = $('.reg-password').val();
        var confpassword = $('.confpassword').val();
        var country = $('.reg-country').val();
        var city = $('.reg-city').val();
        var point = 10;
        var dataime = imedation.find();
        var membersh = membership.findOne({"name":{$regex: new RegExp("black", "i") }});
        var shipcard = (membersh !='')? membersh._id: membership.findOne({minpoint:{$gt:0}, maxpoint:{$lte:4000}})._id;
        
        dataime.forEach(function(v) {
            if (v.email_imedate == email) {
                point = 10;
            }
        });
        var rerole = 'member';
        var msg = "";
        //console.log("registering....");
        if (username == "" || email == "" || password == "" || confpassword =="") {
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons[ 'my-error' ] = 'fa-errorfield-iconbg';
                Bert.alert({
                message: 'خطای متنی! !',
                type: 'my-error',
                style: 'growl-bottom-right',
                icon: 'fa-errorfield-iconbg'
                });
            } else {
                Bert.icons[ 'my-error' ] = 'fa-errorfield-iconbg';
                Bert.alert({
                message: 'Text field error !',
                type: 'my-error',
                style: 'growl-bottom-right',
                icon: 'fa-errorfield-iconbg'
                });
            }
            $(".register_msg").html(msg);
            Session.set("registerError", msg);
        } else {
            if (password.length >= 6 && password == confpassword) {
                //console.log('controls passed with success!');
                Meteor.call('regUser', firstname, lastname, email, password, shipcard, point, rerole, country, city, username, function(err) {
                    if (err) {
                        //console.log("REGISTER PROBLEM==="+err.reason);
                        Session.set("registerError", err.reason);
                    } else {
                        //console.log('register done!!!');
                        Session.set("registerError", "");
                        var username = $(".reg-username").val('');
                        var firstname = $('.reg-firstname').val('');
                        var lastname = $('.reg-lastname').val('');
                        var email = $('.reg-email').val('');
                        var password = $('.reg-password').val('');
                        var confpassword = $('.confpassword').val('');
                        var country = $('.reg-country').val('');
                        var city = $('.reg-city').val('');
                        var dataImedation = imedation.find();
                        dataImedation.forEach(function(value) {
                            if (email == value.email_imedate) {
                                var profiles = Meteor.users.findOne({ _id: value.user_id }).profile;
                                if (!profiles.shipcard) {
                                    var oldShipcardid = '';
                                    var oldPoint = 0;

                                } else {
                                    var oldPoint = profiles.shipcard.point;
                                    var oldShipcardid = profiles.shipcard.shipcardId
                                }
                                var obj = {
                                    profile: {
                                        firstname: profiles.firstname,
                                        lastname: profiles.lastname,
                                        country: profiles.country,
                                        city: profiles.city,
                                        shipcard: {
                                            membershipID: oldShipcardid,
                                            point: oldPoint + 10
                                        }
                                    }
                                }
                                Meteor.call('imedatPoint', value.user_id, obj);
                                //alert('success');

                            }
                        });
                        if (TAPi18n.getLanguage() == 'fa') {
                            Bert.icons[ 'my-error' ] = 'fa-user-plus-iconbg';
                            Bert.alert({
                            message: 'ثبت نام با موفقیت انجام شد!',
                            type: 'my-error',
                            style: 'growl-bottom-right',
                            icon: 'fa-user-plus-iconbg'
                            });
                        } else {
                            Bert.icons[ 'my-error' ] = 'fa-user-plus-iconbg';
                            Bert.alert({
                            message: 'Successfully registered!',
                            type: 'my-error',
                            style: 'growl-bottom-right',
                            icon: 'fa-user-plus-iconbg'
                            });
                        }
                        $(".close").click();
                        //$(".userfocus").focus();
                        $("#loginback").click();
                    }
                });
            }else{
                if (password != confpassword){
                    if (TAPi18n.getLanguage() == 'fa') {
                        Bert.alert('نام کاربری لازم است.', 'danger', 'growl-bottom-right');
                    } else {
                        Bert.alert('Confirm Password not match!', 'danger', 'growl-bottom-right');
                    }
                }
            }
        }

    },
    'change #email': function(e) {
        e.preventDefault();
        var email = $('#email').val();
        Meteor.call('validateUserByEmail', email, function(err, data) {
            if (!err) {
                if (data == true) {
                    Session.set("DUPLICATE", true);
                } else {
                    Session.set("DUPLICATE", false);
                }
            }
        });

    },
    'click #insta-login': function(event) {
        event.preventDefault();
        Meteor.call("fetchFromService", function(error, result) {
            if (error) throw error;
            else {
                //console.log(" instagram username " + result.data.username);
                Meteor.call('getMatchUser', result.data.username, function(err, matchId) {
                    if (err) {
                        //console.log(" Not match " + err);
                    } else {
                        //console.log("userId " + matchId + "  instaId " + result.data.id);
                    }

                });
            }
        });
        Meteor.loginWithInstagram({}, function(err) {
            if (err) {
                throw new Meteor.Error("Instagram login failed");
            } else {
                var user = Meteor.users.findOne({ _id: Meteor.userId() });
                var firstname = user.services.instagram.username;
                var istagramId = user.services.instagram.id;
                var lastname = '';

                var image = user.services.instagram.profile_picture;
                var sex = '';
                if (user.profile.firstname) {
                    //$('.close').click();
                    Router.go('/profile');
                } else {
                    var membersh = membership.findOne({ "name": { $regex: new RegExp("black", "i") } });
                    var userObj = {
                        firstname: firstname,
                        lastname: lastname,
                        sex: sex,
                        shipcard: {
                            shipcardId: membersh._id,
                            point: 10
                        }
                    }
                    var obj = {
                        profile: userObj,
                        roles: { mygroup: ["member"] },
                        image: image
                    }
                    Meteor.call('updateRoleWithSocail', Meteor.userId(), obj, function(err, data) {
                        if (!err) {
                            $('.close').click();
                            Router.go('/profile');
                        }
                    });
                }
            }
        });
    }
});

Template.header.onRendered(function(){
    $(".hid_div").remove();
    /*$("#regis").click(function(){
        $(".loginform").css("display", "none");
        $(".registerform").css("display", "block");
    });
    $("#login").click(function(){
        $(".loginform").css("display", "block");
        $(".registerform").css("display", "none");
    });*/
});

