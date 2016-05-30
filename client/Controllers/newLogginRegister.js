Session.set("loginErrors", "");
Session.set("registerError", "");
Session.set("Duplicate");
Session.set('multiUploadProfileImg', '');

var validateEmail=function(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

Template.upload.helpers({
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
    picture: function(){
      return Session.get('picture');
    },
    getIdImage: function() {
        var arr = [];
        var arrayImage = Session.get('multiUploadProfileImg').split(":");
        for (var i = 0; i < arrayImage.length; i++) {
            if (arrayImage[i]) {
                var obj = {
                    image: arrayImage[i]
                };
                arr.push(obj);
            }
        }
        return arr;
    },
    getPictureUpload:function(e){
    	var data = Session.get("DATAID");
    	console.log("data123 " + data);
    	var imguploaded = images.findOne({_id: data});
    	console.log("img123 " + imguploaded);
    	return img;
    }
});
Template.upload.events({
	'click .btn_login': function(e) {
	    e.preventDefault();
	    $("#loginErrors").text("");
	    var fields = $('#log_uname').val();
	    email = fields;

	    var password = $('#log_pass').val();

	    console.log("email " + email);
	    console.log("password " + password);

	    Meteor.loginWithPassword(email, password, function(error) {
	        if (error) {
	            if (TAPi18n.getLanguage() == 'fa') {
	                $('#loginErrors').text("نام کاربری یا کلمه عبور اشتباه است!");
	            } else {
	                $('#loginErrors').text("Username or Password is incorrect!");
	            }
	        } else {
	            Session.set("loginErrors", "");

	            var loggedInUser = Meteor.user();
	            if (loggedInUser.profile.language) {
	                if (loggedInUser.profile.language == 'Persian')
	                    Session.set('LANG', 'fa');
	                else
	                    Session.set('LANG', 'en');
	            }
	            var group = "mygroup";
	            if (Roles.userIsInRole(loggedInUser, ['admin'], group)) {
	                history.back();
	                console.log("sucess");
	            } else if (Roles.userIsInRole(loggedInUser, ['member'], group)) {
	                history.back();
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
	    var imgArray = Session.get('multiUploadProfileImg').split(":");

	    $('input[name="checkImg"]:checked').each(function() {
            imgArray.push(this.value);
        });


	    var point = 10;
	    var dataime = imedation.find();
	    var membersh = membership.findOne({ "name": { $regex: new RegExp("black", "i") } });
	    console.log("membersh " + membersh);
	    var shipcard = (membersh != '') ? membersh._id : membership.findOne({ minpoint: { $gt: 0 }, maxpoint: { $lte: 4000 } })._id;
	    dataime.forEach(function(v) {
	        if (v.email_imedate == email) {
	            point = 10;
	        }
	    });
	    console.log("hihi");
	    var rerole = 'member';
	    var msg = "";

	    if (username == "" || firstname == "" || lastname == "" || email == "" || password == "") {
	        if (password == "")
	            if (TAPi18n.getLanguage() == 'fa') {
	                Bert.alert('رمز عبور مورد نیاز است.', 'danger', 'growl-bottom-right');
	            } else {
	                Bert.alert('Password is required.', 'danger', 'growl-bottom-right');
	            }
	        if (email == "")
	            if (TAPi18n.getLanguage() == 'fa') {
	                Bert.alert('ایمیل مورد نیاز است.', 'danger', 'growl-bottom-right');
	            } else {
	                Bert.alert('Email is required.', 'danger', 'growl-bottom-right');
	            }
	        if (lastname == "")
	            if (TAPi18n.getLanguage() == 'fa') {
	                Bert.alert('نام خانوادگی مورد نیاز است.', 'danger', 'growl-bottom-right');
	            } else {
	                Bert.alert('Lastname is required.', 'danger', 'growl-bottom-right');
	            }
	        if (firstname == "")
	            if (TAPi18n.getLanguage() == 'fa') {
	                Bert.alert('نام مورد نیاز است.', 'danger', 'growl-bottom-right');
	            } else {
	                Bert.alert('Firstname is required.', 'danger', 'growl-bottom-right');
	            }
	        if (username == "")
	            if (TAPi18n.getLanguage() == 'fa') {
	                Bert.alert('نام کاربری لازم است.', 'danger', 'growl-bottom-right');
	            } else {
	                Bert.alert('Username is required.', 'danger', 'growl-bottom-right');
	            }


	        $(".register_msg").html(msg);
	        Session.set("registerError", msg);

	    // }else{
     //        //=======
     //        var validemail=validateEmail(email);
     //        if(validemail==false){

     //            if (TAPi18n.getLanguage() == 'fa') {
     //                $('.error_email').text("ایمیل نامعتبر است!");
     //            } else {
     //               $('.error_email').text("Email is invalid!");
     //            }
	    } else {
	        if (password.length >= 6) {
	            Meteor.call('regUser', firstname, lastname, email, password, shipcard, point, rerole, country, city, username, imgArray, function(err) {
	                if (err) {
	                    Session.set("registerError", err.reason);
	                } else {
	                    Session.set("registerError", "");
	                    var username = $(".reg-username").val('');
	                    var firstname = $('.reg-firstname').val('');
	                    var lastname = $('.reg-lastname').val('');
	                    var email = $('.reg-email').val('');
	                    var password = $('.reg-password').val('');
	                    var country = $('.reg-country').val('');
	                    var city = $('.reg-city').val('');
	                    Session.set('multiUploadProfileImg', '');
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
	                                    image: profiles.imgArray,
	                                    shipcard: {
	                                        membershipID: oldShipcardid,
	                                        point: oldPoint + 10
	                                    }

	                                }
	                            }
	                            Meteor.call('imedatPoint', value.user_id, obj);

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
	                    Router.go("/");
	                }
	            });
	        }
	    }
	// }
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
    'click #camera-button': function() {
        // Define the camera settings
        var options = {
            width: 640,
            height: 640,
            quality: 100
        };
        // Call the camera API
        MeteorCamera.getPicture(options, function(error, data) {
            if (error) {
                // Handle the error as you wish
                console.log(error);
            } else {
                // Store the a base64-encoded data URI for the image
                // taken by the camera
                Session.set('picture', data);
                $(".fa-times").click();
            }
        });
    },
    'change #upload': function(event) {
        event.preventDefault();
        var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            images.insert(files[i], function(err, fileObj) {
                var strImage = null;
                if (Session.get('multiUploadProfileImg')) {
                    strImage = Session.get('multiUploadProfileImg') + ":" + fileObj._id;
                } else {
                    strImage = fileObj._id;
                }
                Session.set('multiUploadProfileImg', strImage);

            });
        }
    },
    'click #profileImg':function(e){
    	$('.imageselected').each(function(index){
			$(this).removeClass('add-style');
		});
    	$(e.currentTarget).addClass('add-style').siblings().removeClass('add-style');
    	var elt=$(e.currentTarget).attr('data-id');
    	Session.set("DATAID", elt);
    },
    'click .saveImg': function(){	
    	console.log("result");
		var result = Session.get("DATAID");
		if(result){
			$(".fa-times").click();
		}else{
			alert("can't close");
		}
		return result;

    }
});
Template.upload.onRendered(function() {
    $(".hid_div").remove();
});


