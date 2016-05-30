Session.set("loginErrors", "");
Session.set("registerError", "");
Session.set("Duplicate");
Session.set('multiUploadProfileImg', '');
Session.set('PROFILEIMG', '');

var validateEmail=function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

Template.login.helpers({
    loginErrors: function() {
        var msg = Session.get("loginErrors");
        if (msg) return true;
        else return false;
    },
    loginErrormsg: function() {
        return Session.get("loginErrors");
    },
    registerError: function() {
        var msg = Session.get("registerError");
        if (msg) return true;
        else return false;
    },
    registerErrormsg: function() {
        return Session.get("registerError");
    },
    messageLogin: function() {
        if (Session.get('loginErrors')) {
           // console.log('1');
            return true;
        } else {
            return false;
             //console.log('2');
        }
    },
    duplicateEmail: function() {
        if (Session.get("DUPLICATE") == true) return true;
        else return false;
    },
    forgetPass:function(){
        var html = "";
        if (TAPi18n.getLanguage() == 'fa') {
           html+= '<a href="/email" id="forgot" style="color:#333;text-decoration: underline #d9534f; margin-right:162px;">رمز خود را فراموش کرده اید؟</a>';
        }else{
            html+='<a href="/email" id="forgot" style="color:#333;text-decoration: underline #d9534f;">Forgot your password ?</a>';
        }
        return html;
    },
    hasProfileImage: function( ){
        var id = Session.get('PROFILEIMG');
        if( id ){
            console.log('ImagesID:'+ id);
            Meteor.call('getImageById', id, function(err, data){
            if(!err) Session.set("PROFILEIMAGECHANGE", data);
        });
        var data = Session.get("PROFILEIMAGECHANGE");

        var userImage = '/uploads/'+data;

        }else{
            var id = Meteor.userId();
            var user = Meteor.users.findOne({ _id: id });
            var userImage = getProfileImageByUser( user );
            
        }
         console.log('Image:', userImage);
        return userImage;
    }
});
Template.login.events({
    'click .btn_login': function(event) {
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
        });

         $("#loginErrors").text("");
        var fields = $('#log_uname').val();
        email = fields;

        var password = $('#log_pass').val();

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
                Session.set("loginErrors", "");

                var loggedInUser = Meteor.user();
                if(loggedInUser.profile.language){
                    if(loggedInUser.profile.language=='Persian')
                        Session.set('LANG','fa');
                    else
                        Session.set('LANG','en');
                }
                var group = "mygroup";
                var curRoute = Session.get("CURRENTROUTE");
                if (Roles.userIsInRole(loggedInUser,['admin'], group)) {
                    if(curRoute==="/login"){
                        Router.go("/profile");
                    } else if(curRoute===" " || curRoute===undefined || !curRoute){
                        history.back();
                    }else{
                        Router.go(curRoute);
                    }
                } else if(Roles.userIsInRole(loggedInUser, ['member'], group)) {
                    if(curRoute==="/login"){
                        Router.go("/profile");
                    } else if(curRoute===" " || curRoute===undefined || !curRoute){
                        history.back();
                    }else{
                        Router.go(curRoute);
                    }
                }
            }
            Session.set('pass', null);
        });
    },
    'submit #js-upload-form': function(e) {
        e.preventDefault();
        var url = 'https://www.google-analytics.com/collect?v=1&t=event&tid=UA-71059459-2&cid=555&ec=register&ea=click&el=register&ev=1';
        Meteor.call('eventCall', url);
        var username = $("#username").val();
        var firstname = $('#first_name').val();
        var lastname = $('#last_name').val();
        var email = $('#re_email').val();
        var password = $('#re_password').val();
        var country = $('#country').val();
        var city = $('#city').val();

        var img_id = Session.get('PROFILEIMG');
        console.log("img_id " + img_id);
        // var old_img = $("#file").val();
        // var img_id = (img!='')? img:old_img;

        var point = 10;
        var dataime = imedation.find();
        var membersh = membership.findOne({ "name": { $regex: new RegExp("black", "i") } });
        var shipcard = (membersh != '') ? membersh._id : membership.findOne({ minpoint: { $gt: 0 }, maxpoint: { $lte: 4000 } })._id;
        dataime.forEach(function(v) {
            if (v.email_imedate == email) {
                point = 10;
            }
        });

        var rerole = 'member';
        var msg = "";

        if (username == "" || firstname == "" || lastname == "" || email == "" || password == "") {
            // if (password == "")
            //     if (TAPi18n.getLanguage() == 'fa') {
            //         Bert.alert('رمز عبور مورد نیاز است.', 'danger', 'growl-bottom-right');
            //     } else {
            //         Bert.alert('Password is required.', 'danger', 'growl-bottom-right');
            //     }
            // if (email == "")
            //     if (TAPi18n.getLanguage() == 'fa') {
            //         Bert.alert('ایمیل مورد نیاز است.', 'danger', 'growl-bottom-right');
            //     } else {
            //         Bert.alert('Email is required.', 'danger', 'growl-bottom-right');
            //     }
            // if (lastname == "")
            //     if (TAPi18n.getLanguage() == 'fa') {
            //         Bert.alert('نام خانوادگی مورد نیاز است.', 'danger', 'growl-bottom-right');
            //     } else {
            //         Bert.alert('Lastname is required.', 'danger', 'growl-bottom-right');
            //     }
            // if (firstname == "")
            //     if (TAPi18n.getLanguage() == 'fa') {
            //         Bert.alert('نام مورد نیاز است.', 'danger', 'growl-bottom-right');
            //     } else {
            //         Bert.alert('Firstname is required.', 'danger', 'growl-bottom-right');
            //     }
            // if (username == "")
            //     if (TAPi18n.getLanguage() == 'fa') {
            //         Bert.alert('نام کاربری لازم است.', 'danger', 'growl-bottom-right');
            //     } else {
            //         Bert.alert('Username is required.', 'danger', 'growl-bottom-right');
            //     }
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
            if (password.length >= 6) {
                Meteor.call('regUser', firstname, lastname, email, password, shipcard, point, rerole, country, city, username, img_id, function(err) {
                    if (err) {
                        Session.set("registerError", err.reason);
                    } else {
                        Session.set("registerError", "");
                        // var username = $(".reg-username").val('');
                        // var firstname = $('.reg-firstname').val('');
                        // var lastname = $('.reg-lastname').val('');
                        // var email = $('.reg-email').val('');
                        // var password = $('.reg-password').val('');
                        // var country = $('.reg-country').val('');
                        // var city = $('.reg-city').val('');
                        var img_id = Session.set("PROFILEIMG", '');
                        $("#default-img").removeClass("hidden");

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
                                        imageId: profiles.img_id,
                                        shipcard: {
                                            membershipID: oldShipcardid,
                                            point: oldPoint + 10
                                        }

                                    }
                                }
                                Meteor.call('imedatPoint', value.user_id, obj);

                            }
                        });
                         Meteor.loginWithPassword(email, password, function(error) {
                            if(!error){
                                Router.go("/profile");
                            }
                        });
                        if (TAPi18n.getLanguage() == 'fa') {
                            Bert.icons['my-error'] = 'fa-user-plus-iconbg';
                            Bert.alert({
                                message: 'Register with success !',
                                type: 'my-error',
                                style: 'growl-bottom-right',
                                icon: 'fa-user-plus-iconbg'
                            });
                        } else {
                            Bert.icons['my-error'] = 'fa-user-plus-iconbg';
                            Bert.alert({
                                message: 'Register with success !',
                                type: 'my-error',
                                style: 'growl-bottom-right',
                                icon: 'fa-user-plus-iconbg'
                            });
                        }
                        $(".close").click();
                        $(".userfocus").focus();
                        Router.go("/profile");

                    }
                });
            }
        }
    },
    'keyup #re_password': function(e) {
        e.preventDefault();
        $(".alert-warning").addClass("hid_div");
        var password = $('#re_password').val();
        var passwordsInfo = $('#pass-infomation');
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
    'change #re_email': function(e) {
        e.preventDefault();
        var email = $('#re_email').val();
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
    'change #file': function(event, template) {
        event.preventDefault();
        $("#default-img").addClass("hidden");
        FS.Utility.eachFile(event, function(file) {
            images.insert(file, function (err, fileObj) {
                // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
                if( !err ){
                    // Meteor.call('updateImageUser',fileObj._id); 
                    $('#loading').show();
                    setTimeout(function(){
                         Session.set('PROFILEIMG', fileObj._id);
                         $('#loading').hide();
                     }, 3000);
                   
                }
            });
        });        
    }
});
Template.login.onRendered(function() {
    $(".hid_div").remove();
});


