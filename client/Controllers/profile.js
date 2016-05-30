Session.set('ADDAVATAR', '');
Session.set('profile', '');
Session.set("error_mg", "");
var validateEmail=function(email) {
var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
return re.test(email);
}
Template.profile.onRendered(function(){
    var userOnly=Meteor.users.findOne({_id:Meteor.userId()});
    var image=userOnly.image;
    var firstname=userOnly.profile.firstname;
    var lastname=userOnly.profile.lastname;
    var city=userOnly.profile.city;
    var sex=userOnly.profile.sex;
    var birth=userOnly.profile.birth;
    var address=userOnly.profile.address;
    var phone=userOnly.profile.phone;
    var language=userOnly.profile.language;
    var userearn = userOnly.profile.earnpoint;
    //alert('image='+image+'/firstname='+firstname+'/lastname='+lastname+'/sex='+sex+'/birth='+birth+'/address='+address+'/phone='+phone+'/language='+language);
    if(image && firstname && lastname && sex && birth && address && phone  && language){
        if( userearn == 0){
            EarnPoint('complete_profile',20,40,80);
            //Session.set('ADDAVATAR',undefined);
            Meteor.call("updateStatusProfile",Meteor.userId(),function(err){
                
            });
        }
    }
})
Template.profileimage.helpers({
    getprofile: function() {
        var id = Meteor.userId();
        return Meteor.users.findOne({ _id: id });
    },
    hasProfileImage: function( ){
        var id = Session.get('CHANGEPROFILEIMAGE');
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
})
Session.set('POPUPCHANGEPIC', '');
Template.profileimage.events({
    'click #changepropic': function(e){
        e.preventDefault();
        Session.set('POPUPCHANGEPIC',1);
    }
})
Template.updatepicture.helpers({
    getHistoryPic: function(){
        var pop = Session.get('POPUPCHANGEPIC');
        console.log('pop:', pop);
        if( pop ){
            var myuser = Meteor.users.findOne({_id:Meteor.userId()});
            var image = '';
            if( myuser ){
                var array = myuser.image;

                if( array instanceof Array){
                    var leng = array.length;
                    var last = array[leng - 1];
                    array.splice(-1);
                    image = images.find({_id:{$in:array}});
                }else{
                    image = images.find({_id:array});
                }
            }
            console.log('image:', image.fetch());
            return image;
        }
    },
    photo: function () {
      return Session.get("photo");
    }
})
Template.updatepicture.events({
    'change #file': function(event, template) {
        event.preventDefault();
        FS.Utility.eachFile(event, function(file) {
            console.log('File:', event);
          images.insert(file, function (err, fileObj) {
            
            // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
            if( !err ){
                Meteor.call('updateImageUser',fileObj._id, function(err){ 
                    $('#loading').show();
                    $('.close').trigger('click');
                    setTimeout(function(){
                         Session.set('CHANGEPROFILEIMAGE', fileObj._id);
                         //Session.set('UPLOADNEWIMAGE', Session.get('UPLOADNEWIMAGE') + 1);
                         var userid = Meteor.userId();
                         Meteor.subscribe('currentUserLoggedInImage', userid);
                         $('#loading').hide();
                     }, 3000);
                    
                });
            }
          });
        });
        
    },
    'click #browse-upload': function(){
        $('#file').trigger('click');
    },
    'click .history-pic': function( e){
        var id = $(e.currentTarget).attr('data-id');
        var myuser = Meteor.users.findOne({_id:Meteor.userId()});
        if( myuser ){
            var arrimage = myuser.image;
            
            var obj = [];
            if( arrimage instanceof Array){
                var leng = arrimage.length;
                var index = arrimage.indexOf(id);
                if(index != -1)
                    arrimage.splice( index, 1 );

                obj = arrimage;
                
            }
            obj.push( id );
            console.log('after:', obj);
            //Meteor.users.update({_id:Meteor.userId()},{$set:{image:obj}});
            Meteor.call('updateProfilePic', Meteor.userId(), obj, function(err){
                $('.close').trigger('click');
                $('#loading').show();
                setTimeout(function(){
                     Session.set('CHANGEPROFILEIMAGE', id);
                     $('#loading').hide();
                 }, 3000);
            })
            
        }

    },
    'click #camara': function () {
        $('.close').trigger('click');
          var cameraOptions = {
            width: 800,
            height: 600
          };

          MeteorCamera.getPicture(cameraOptions, function (error, data) {
            //Session.set("photo", data);
            $('#loading').show();
            Meteor.call('savePhoto', data, function(err, respond){
                if(!err){
                    setTimeout(function(){
                        var userid = Meteor.userId();
                        Meteor.subscribe('currentUserLoggedInImage', userid);
                        var datauser = Meteor.users.findOne({_id:userid})
                        var imageId = datauser.image[ datauser.image.length -1 ];
                        console.log('Image:', imageId);
                        Session.set('CHANGEPROFILEIMAGE', imageId);
                        $('#loading').hide();
                    }, 3000);


                }
            });
          });
    }
})
Template.profile.helpers({
    getnewImg: function(){
        return Session.get('profile');
    },
    getimgArray: function(){
        var id = Meteor.userId();
        var datauser= Meteor.users.findOne({_id:id});
        if(datauser.image!=='undefined' && datauser.hasOwnProperty('image')){
            var len=datauser.image.length;
            return {image:datauser.image[len-1]};
        }
    },
    getprofile: function() {
        var id = Meteor.userId();
        return Meteor.users.findOne({ _id: id });
    },
    getquestions: function() {
        return question.find({});
    },
    Answer: function(qId) {
        var id = Meteor.userId();
        var answer = "";
        var question = Meteor.users.findOne({ _id: id, "answerdata.qcmId": qId });
        question.answerdata.forEach(function(i) {
            if (i.qcmId == qId) {
                answer = i.answer;
            }
        });
        return answer;
    },
    checkProfileData: function( value ){
        if( value.length > 0 && value[0] != null) 
            return true;
        else return false;
    }
});

Template.editprofile.helpers({
    getimgArray: function(){
        var id = Meteor.userId();
        var datauser= Meteor.users.findOne({_id:id});
        if(datauser.image!=='undefined' && datauser.hasOwnProperty('image')){
            var len=datauser.image.length;
            return {image:datauser.image[len-1]};
        }
    },
    getprofile: function() {
        var id = Meteor.userId();
        var profile = Meteor.users.find({ _id: id });
        return profile;
    },
    error_message: function() {
        var msg = Session.get('error_mg', msg);
        if (msg != "") return msg;
        else msg = '';
    },
    getDay: function(){
        var num = [];
        for(i=1; i<=31; i++){
            num.push({num:i});
        }
        return num;
    },
    getYear: function(){
        var year = [];
        var d = new Date();
        var y = d.getFullYear();
        //console.log('Year:',y)
        for(i=y; i >= y - 111; i--){
            year.push({year:i});
        }
        return year;
    },
    currentDay:function(str){
       var day = str.split('-')[0];
       return day;
    },
    currentMonth:function(str){
       var month = str.split('-')[1];
       return month;
    },
    currentYear:function(str){
       var year = str.split('-')[2];
       return year;
    }
});

// Template.header.rendered= function(){
//     if (Session.get("Language") == "Persian") {
//         alert("Persian");
//         return TAPi18n.getLanguage() == 'fa';
//     } else if (Session.get("Language") == "English") {
//         alert("English");
//         return TAPi18n.getLanguage() == 'en';
//     } else {
//         return;
//     }   
// }

Template.editprofile.events({
    'mouseover ul.text-center li':function(){
        $('p.my_text').css("color","#fff");
    },
    'click #updatePro': function() {
        var email=$('#email').val();
        var firstname = $('#firstname').val();
        var lastname = $('#lastname').val();
        var sex = $('#gender').val();
        var address = $('#address').val();
        var phone = $("#phone").val();
        var day = $('.day').val();
        var month = $('.month').val();
        var year = $('.year').val();
        var user = Meteor.user();
        var id = user._id;
        var point = user.profile.shipcard.point;
        var mbs = user.profile.shipcard.membershipID;
        var name = user.profile.name;
        var country = user.profile.country;
        var city = user.profile.city;
        var userearn = user.profile.earnpoint;
        var dateofbirth = day + ' - '+ month + ' - ' + year;
        var language = $("#language").val();
       // Session.setPersistent("Language", language);

        var profile = {
            firstname: firstname,
            lastname: lastname,
            name:name,
            country:country,
            city:city,
            earnpoint:userearn,
            sex: sex,
            language:language,
            birth: dateofbirth,            
            address: address,
            phone: phone,
            shipcard: { membershipID:mbs, point: point }
        };
        var img = Session.get('ADDAVATAR');
        var old_img = $("#old_img").val();
        var img_id = (img!='')? img:old_img;

        var obj = {
            profile: profile
            //image: img_id
        };
        
        if(firstname == "" || lastname =="" || email =="" || language=="" ){
            if (firstname == ""){
                if (TAPi18n.getLanguage() == 'fa') {
                   $('.error_firstname').text("لطفا ورودی نام خود را!");
                } else {
                   $('.error_firstname').text("Firstname is required!");
                }
            }
            if (lastname == ""){
                if (TAPi18n.getLanguage() == 'fa') {
                    $('.error_lastname').text("لطفا نام خانوادگی خود را به!");
                } else {
                   $('.error_lastname').text("Lastname is required!");
                }
            }
            // if (address == ""){
            //     if (TAPi18n.getLanguage() == 'fa') {
            //         $('.error_address').text("آدرس مورد نیاز است!");
            //     } else {
            //        $('.error_address').text("Address is required!");
            //     }
            // }
            // if (phone == ""){
            //     if (TAPi18n.getLanguage() == 'fa') {
            //          $('.error_phone').text("تلفن مورد نیاز است!");
            //     } else {
            //         $('.error_phone').text("Phone is required!");
            //     }
            // }
            // if (img_id == ""){
            //     if (TAPi18n.getLanguage() == 'fa') {
            //          $('.error_img').text("تصویر مورد نیاز است!");
            //     } else {
            //         $('.error_img').text("Image is required!");
            //     }
            // }
            // if (day == ""){
            //     if (TAPi18n.getLanguage() == 'fa') {
            //          $('.error_dob').text("تاریخ تولد مورد نیاز است!");
            //     } else {
            //         $('.error_dob').text("Date of Birth is required!");
            //     }
            // }
            //  if (month == ""){
            //     if (TAPi18n.getLanguage() == 'fa') {
            //          $('.error_dob').text("تاریخ تولد مورد نیاز است!");
            //     } else {
            //         $('.error_dob').text("Date of Birth is required!");
            //     }
            // }
            //  if (year == ""){
            //     if (TAPi18n.getLanguage() == 'fa') {
            //          $('.error_dob').text("تاریخ تولد مورد نیاز است!");
            //     } else {
            //         $('.error_dob').text("Date of Birth is required!");
            //     }
            // }
            //  if (sex == ""){
            //     if (TAPi18n.getLanguage() == 'fa') {
            //          $('.error_sex').text("تاریخ تولد مورد نیاز است!");
            //     } else {
            //         $('.error_sex').text("Gender is required!");
            //     }
            // }
            if (language == ""){
                if (TAPi18n.getLanguage() == 'fa') {
                     $('.error_language').text("Language is required!");
                } else {
                    $('.error_language').text("Language is required!");
                }
            }
            if(email==""){
               if (TAPi18n.getLanguage() == 'fa') {
                     $('.error_email').text("ایمیل مورد نیاز است!");
                } else {
                    $('.error_email').text("Email is required!");
                } 
            }
        }else{
            //=======
            var validemail=validateEmail(email);
            if(validemail==false){

                if (TAPi18n.getLanguage() == 'fa') {
                    $('.error_email').text("ایمیل نامعتبر است!");
                } else {
                   $('.error_email').text("Email is invalid!");
                }
            }else{
                Meteor.call('editEmail',email);
                Meteor.call('editprofile', id, obj, function(err, respond) {
                    if(!err){
                        if(language=="Persian")
                            language='fa';
                        else
                            language='en';
                        Session.set('LANG', language);
                        Router.go('/profile');
                    }
                });
            }
            //=======
            
        }
        //getEarnPoint();
        //var email = $("#email").val();
        /*var id = Meteor.userId();
        var point = 10;
        var profile = Meteor.users.findOne({ _id: id }).profile.firstname;

        var upoint = Meteor.users.findOne({ _id: id }).profile.shipcard.point;
        var memberShipId = Meteor.users.findOne({ _id: id }).profile.shipcard.membershipID;
        

        var resultmembership = membership.find();
        var arrmem = [];
        resultmembership.forEach(function(value) {
            if (value.minpoint <= upoint && upoint <= value.maxpoint) {
                arrmem.push(value);
            }
        });
        if (arrmem[0].name == 'black') {
            point = 20;
        }
        if (arrmem[0].name == 'silver') {
            point = 40;
        }
        if (arrmem[0].name == 'gold') {
            point = 80
        }
        upoint += point;
        var attr = {
            profile: {
                firstname: firstname,
                lastname: lastname,
                sex: sex,
                birth: birth,
                address: address,
                phone: phone,
                //email: email,
                shipcard: {
                    point: upoint,
                    membershipID:memberShipId
                }
            }
        }
        var error_mg = "";
        if (firstname == "" || sex == "" || birth == "" || lastname == "" || address == "" || phone == "" || email == "") {

            if (firstname == "")
                error_mg += "Firstname is requied ";
            if (lastname == "")
                error_mg += "Lastname is requied! ";
            if (birth == "")
                error_mg += "Dat of birth is requied! "
            if (sex == "")
                error_mg += "Gender is requied! ";
            if (address == "")
                error_mg += "Address is requied! ";
            if (phone == "")
                error_mg += "Phone is requied! ";
            // if (email == "")
            //     error_mg += "Email is requied! ";
            return Session.set("error_mg", error_mg);

        } else {
            Session.set("error_mg", "");
            delete Session.keys['error_mg'];
            var datauser = Meteor.users.findOne({ _id: Meteor.userId() });
            var oldpoint = datauser.profile.shipcard.point;
            var memberShipId = Meteor.users.findOne({ _id: id }).profile.shipcard.membershipID;
        
            var profile = {
                firstname: firstname,
                lastname: lastname,
                sex: sex,
                birth: birth,
                shipcard: { point: oldpoint,membershipID:memberShipId },
                address: address,
                phone: phone
                //email: email
            };
            if (Session.get('ADDAVATAR') != '') {
                var img_id = Session.get('ADDAVATAR');
                var obj = {
                    profile: profile,
                    image: img_id
                };
            } else {
                var obj = {
                    profile: profile,
                };
            }
            Meteor.call('editprofile', id, obj, function(err) {
                if (err) {
                    console.log("error update profile");
                } else {
                    var imgprofile = Meteor.users.findOne({ _id: id }).image;
                    var dateofbirth = Meteor.users.findOne({ _id: id }).profile.birth;
                    var sexuser = Meteor.users.findOne({ _id: id }).profile.sex;
                    var addressuser = Meteor.users.findOne({ _id: id }).profile.address;
                    var phonenumber = Meteor.users.findOne({ _id: id }).profile.phone;
                    //var email = Meteor.users.findOne({ _id: id }).profile.email;
                    if (imgprofile != "" && dateofbirth != "" && sexuser != "" && addressuser != "" && phonenumber != "") {
                        var checkstatus = Meteor.users.findOne({ _id: id }).status;
                        //var pointuser = Meteor.users.findOne({ _id: id }).profile.shipcard.point;
                        if (checkstatus) {
                            var attrs = {
                                profile: {
                                    firstname: firstname,
                                    lastname: lastname,
                                    sex: sex,
                                    birth: birth,
                                    address: address,
                                    phone: phone,
                                    //email: email,
                                    shipcard: {
                                        point: point,
                                        membershipID:memberShipId
                                    }
                                }
                            }
                        } else {
                            Meteor.call("updatestatusearnpoint", id, function(err) {
                                if (err) {
                                    console.log("can not update status ");
                                }else{
                                    Meteor.call('addpoint', id, attr, function(err) {
                                        if (err) {
                                            console.log("error " + reason);
                                        } else {
                                            console.log("success" + upoint);
                                            if (upoint == 10) {
                                                $("#myModal").parent().show();
                                            } else if (upoint == 30) {
                                                $("#myModal2").show();
                                                $("#myModal").parent().hide();
                                            } else {
                                                $("#myModal").parent().hide();
                                                $("#myModal2").parent().hide();
                                                if (!$("#myModal2").parent().hide()) {
                                                    console.log("can not go to profile");
                                                } else {
                                                    console.log("can go to profile");
                                                    //Router.go('/profile');
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                        }

                    } else {
                        console.log("update profile not completed");
                    }
                    if (TAPi18n.getLanguage() == 'fa') {
                        Bert.alert('مشخصات به روز شده است', 'success', 'growl-bottom-right');
                    } else {
                        Bert.alert('Profile has been Updated', 'success', 'growl-bottom-right');
                    }
                    $('.close').click();
                    Router.go('/profile');
                }

            });
        }*/
    },
    'change #upload': function(event, template) {
        var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            images.insert(files[i], function(err, fileObj) {
                // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
                Session.set('ADDAVATAR', fileObj._id);
                Meteor.call('updateImageUser',fileObj._id); 

            });
        }
    },
    'click #popup': function(e) {
        e.preventDefault();
        $("#myModal2").css("display", "none");
        $("#myModal").parent().hide();
        Router.go('/profile');
    },
    'click #popup1': function(e) {
        e.preventDefault();
        $("#myModal").parent().hide();
        Router.go('/profile');
    },
    'focusout #phone':function(e){
        var phone = $("#phone").val();
        if(phone!=""){
            if(phone.match(/\d{9,11}/)){
                console.log("Match Phone Number")
            }else{
                Bert.alert('Please enter 9 or 10 digit to validate Phone', 'danger', 'growl-bottom-right');
                $("#phone").val("")
                
            }
        }
    }
});

Template.profile.events({
    'click #btn-answer': function(e) {
        var value = [];
        var attr = [];
        e.preventDefault();
        var id = Meteor.userId();
        var answer = $('[name=answer]');
        answer.each(function(i, val) {
            if (val) {
                var val = $(this).val();
                value.push(val);
            }
        });
        var qcm = [];
        var question = $('[name=question]');
        question.each(function(i, val1) {
            var val1 = $(this).val();
            qcm.push(val1);
        });
        for (var i = 0; i < value.length; i++) {
            obj = {
                qcmId: qcm[i],
                answer: value[i]
            }
            attr.push(obj);
        }
        var array = { answerdata: attr };
        Meteor.call('addanswer', id, array);
    },

});
Template.editprofile.onRendered(function() {
    this.$('.datetimepicker').datetimepicker();
});

Template.member.helpers({
    getprofile: function() {
        var id = Meteor.userId();
        return Meteor.users.findOne({ _id: id });
    }
});
Template.profile.onRendered(function() {
    var point = Meteor.users.findOne({ _id: Meteor.userId() }).profile.shipcard.point;
    var rowblack = membership.findOne({ name: 'black' });
    var rowsilver = membership.findOne({ name: 'silver' });
    var rowgold = membership.findOne({ name: 'gold' });
    if (rowsilver.minpoint <= point && point < rowgold.minpoint) {
        var repoint = reachpoint.findOne({ userId: Meteor.userId() });
        if (!repoint) {
            point += 500;
            Session.set('blackpoint', 'black_already');
            Meteor.call("earnPoint", Meteor.userId(), point, function(err) {
                if (!err) {
                    if (TAPi18n.getLanguage() == 'fa') {
                        Bert.alert('شما باید کسب  امتیاز بیشتر!', 'success', 'growl-bottom-right');
                    } else {
                        Bert.alert('You have earn  point more!', 'success', 'growl-bottom-right');
                    }
                }
            });
            var obj = {
                userId: Meteor.userId(),
                level: 'silver'
            }
            reachpoint.insert(obj);

        }



    } else {
        var repoint = reachpoint.findOne({ userId: Meteor.userId() });
        if (repoint.level == 'silver') {
            point += 1000;
            Session.set('silverpoint', 'silver_already');
            Meteor.call("earnPoint", Meteor.userId(), point, function(err) {
                if (!err) {
                    if (TAPi18n.getLanguage() == 'fa') {
                        Bert.alert('شما باید کسب  امتیاز بیشتر!', 'success', 'growl-bottom-right');
                    } else {
                        Bert.alert('You have earn  point more!', 'success', 'growl-bottom-right');
                    }
                }
            });
            var obj = {
                userId: Meteor.userId(),
                level: 'gold'
            }
            reachpoint.update({ _id: repoint._id }, { $set: obj });
        }


    }
});
getProfileImageByUser = function( user ){
    var userImage = '';
    if( user.hasOwnProperty('image') ){
        var leng = user.image.length;
        var imageId = ( user.image instanceof Array  )? user.image[user.image.length - 1] : user.image;
        console.log('Object Image:', imageId);
        Meteor.call('getImageById', imageId, function(err, data){
            if(!err) Session.set("PROFILEIMAGELOAD", data);
        });
        var data = Session.get("PROFILEIMAGELOAD");
        if( data ){
            userImage = '/uploads/'+data;
        }else
            userImage = user.services.instagram.profile_picture;

    }else if( user.services.hasOwnProperty('instagram') ){
        userImage = user.services.instagram.profile_picture;
    }else{
        userImage = '/img/default_profile.png';
    }
    return userImage;
}
getImageById = function( imageId ){
    return getImageServer( imageId );
}
getImageServer =  function( imageId ){
    Meteor.call('getImageById', imageId, function(err, data){
        if(!err) Session.set("PROFILEIMAGE"+data.imageId, data.src);
    });
    return Session.get("PROFILEIMAGE"+imageId);
}
