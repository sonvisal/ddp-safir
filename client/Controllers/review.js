Session.set('countReview',1);
Session.set('toggleReview',1);
Template.details.events({
    'click .rateStar': function(e, tpl) {
        e.preventDefault();
        var value = tpl.$(e.currentTarget).attr('data-star');
        //alert("Rating "+value);
        Session.set("STARRATE", value);
    },
    'click div i.rateStar': function(e) {
        Session.set('CLICK','getclick');
        $(e.currentTarget).addClass('yellow-star star_active');
        $(e.currentTarget).parent().prevAll('div').children('i').addClass('yellow-star star_active');
        $(e.currentTarget).parent().nextAll('div').children('i').removeClass('yellow-star');
    },

    // 'mouseover div i.rateStar': function (e) {
    //     var currentStar = $(e.currentTarget).attr('id');
    //     if (!currentStar.match('yellow-star-over')) {
    //         $(e.currentTarget).attr('id','yellow-star-over');
    //         $(e.currentTarget).parent().prevAll('div').children('i').attr('id','yellow-star-over');
    //     } else {
    //         $(e.currentTarget).parent().nextAll('div').children('i').removeAttr('id');
    //     }
    // },
    // 'mouseout .outclass':function(e){
    //     var getclick=Session.get('CLICK');
    //     if(getclick){
    //         console.log("already click");
    //     }else{
          
    //         $(e.currentTarget).find(".rateStar").removeAttr('id');
    //         // $(".rateStar").parent().nextAll('div').children('i').removeAttr('id');
    //         // $(".rateStar").parent().prevAll('div').children('i').removeAttr('id');  
            
    //     }
        
    // }

});

Template.reward.events({
    'change #file': function(event, template) {
        event.preventDefault();
        var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            images.insert(files[i], function (err, fileObj) {
                Session.set('profile', fileObj._id); 
                Meteor.call('updateImageUser',fileObj._id); 
                Bert.alert('Update profile Image success !', 'success', 'growl-bottom-right');           
            });
        }
        $('#profile-image').click();
        
    }
});
Template.details.events({
    'click #show1':function(e){
        e.preventDefault();
        var data_toggle=$('#show1').attr('data-toggle');
        Session.set('toggleReview',data_toggle);

    },
    "click .morereviews": function(e) {
        e.preventDefault();
        var counter = $(".morereviews").attr("data-toggle");
        var update = "";
        if (counter == 0) {
            Session.set("numberReviews", true);
            $(".morereviews").text("HIDE REVIEW");
            $(".morereviews").attr("data-toggle", "1")
        } else {
            Session.set("numberReviews", false);
            $(".morereviews").attr("data-toggle", "0")
            $(".morereviews").text("MORE REVIEWS");
        }
        return update;
    },
    'click #insta': function(e) {
        EarnPoint('getPointByInsta',30,60,120);
    }
    /*'submit form': function(e, tpl) {
        e.preventDefault();
        Session.set('toggleReview',1);
        $('#show1').attr('data-toggle',0);
        if (Meteor.userId()) {
            var userid = Meteor.userId();
            if (userid == null) {
                alert("You have to be logged to submit a review!");
                return;
            }
            var title = tpl.$("#title").text();
            var text = tpl.$("#comment").val();z
            //var grade = tpl.$("#sel1").val();
            var grade = Session.get("STARRATE");
            $("#bt_review").click();
            var idreview = Random.id();

            if (text == "") {
                if (TAPi18n.getLanguage() == 'fa') {
                    Bert.alert('لطفا متن را قبل از کلیک بر روی دکمه!', 'success', 'growl-bottom-right');
                } else {
                    Bert.alert('Please put a text before to click the submit!', 'success', 'growl-bottom-right');
                }
                $(".close").click();
            } else {
                Meteor.call('addReview', idreview, title, text, grade, userid, this._id, function(err) {
                    if (err) {
                        console.log("error " + reason);
                    } else {
                        //======phalla=======
                        //var title = tpl.$("#title").val('');
                        var text = tpl.$("#comment").val('');
                        var grade = Session.get("STARRATE",'');
                        Meteor.call('commentDetail', function(err, data) {
                            if (!err) {
                                Session.set('countReview', data);
                            }
                        });
                        if (Session.get('countReview') < 5) {
                            EarnPoint('reviewproduct', 10, 20, 40);

                            // if (TAPi18n.getLanguage() == 'fa') {
                            //     Bert.alert('شما باید کسب ' + point + ' امتیاز بیشتر!', 'success', 'growl-bottom-right');
                            // } else {
                            //     Bert.alert('You have earn ' + point + ' point more!', 'success', 'growl-bottom-right');
                            // }
                            // $(".close").click();
                        }
                        //======end phalla===
                    }
                });
            }
        } else {
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert('!لطفا قبل از ساخت ترجمه ورود', 'success', 'growl-bottom-right');
            } else {
                Bert.alert('Please login before making translation!', 'success', 'growl-bottom-right');
            }
            $('.close').click();
        }

    },*/
    /*'click modal-backdrop.in': function(e) {
        $("#myModaltuto").parent().hide();
        $("#myModaltuto2").parent().hide();
    },*/

    // 'click #popup': function(e) {
    //     e.preventDefault();
    //     $("#myModalSecond").css("display", "none");
    //     $("#myModal").parent().hide();
    //     console.log("hide");
    // },
    // 'click #popup1': function(e) {
    //     $("#myModal").parent().hide();
    // },

    // 'click #insta': function(e) {

    //     var userid = Meteor.userId();
    //     var profile = Meteor.users.findOne({ _id: userid }).profile;
    //     var oldpoint = profile.shipcard.point;
    //     var resultmembership = membership.find();
    //     var arrmem = [];
    //     resultmembership.forEach(function(value) {
    //         if (value.minpoint <= oldpoint && oldpoint <= value.maxpoint) {
    //             arrmem.push(value);
    //         }
    //     });
    //     if (arrmem[0].name == 'black') {
    //         var point = 30;
    //     }
    //     if (arrmem[0].name == 'silver') {
    //         var point = 60;
    //     }
    //     if (arrmem[0].name == 'gold') {
    //         var point = 120
    //     }

    //     if (profile.shipcard != null)
    //         var upoint = Number(profile.shipcard.point);
    //     else
    //         var upoint = 0;

    //     upoint += point;
    //     Meteor.call("addpointinst", userid, upoint, function(error) {
    //         if (error) {
    //             console.log("can not earn point insta");
    //         } else {
    //             console.log("can earn point insta");
    //         }
    //     });
    // }
});
Template.addreview.helpers({
    getimgArray: function(){
        var id = Meteor.userId();
        var datauser= Meteor.users.findOne({_id:id});
        if(datauser.image!=='undefined' && datauser.hasOwnProperty('image')){
            var len=datauser.image.length;
            return {image:datauser.image[len-1]};
        }
    }
});
Template.addreview.events({
    'submit form': function(e, tpl) {
        e.preventDefault();
        Session.set('toggleReview',1);
        $('#show1').attr('data-toggle',0);
        if (Meteor.userId()) {
            var userid = Meteor.userId();
            if (userid == null) {
                alert("You have to be logged to submit a review!");
                return;
            }
            var text = tpl.$("#comment").val();
            var title = tpl.$("#comment").val();
            //var grade = tpl.$("#sel1").val();
            var grade = Session.get("STARRATE");
            $("#bt_review").click();
            var idreview = Random.id();

            if (text == "") {
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
                $(".close").click();
            } else {
                Meteor.call('addReview', idreview, title, text, grade, userid, this._id, function(err) {
                    if (!err) {
                        //======phalla=======
                        var text = tpl.$("#comment").val('');
                        var grade = Session.get("STARRATE",'');
                        Meteor.call('commentDetail', function(err, data) {
                            if (!err) {
                                Session.set('countReview', data);
                            }
                        });
                        if (Session.get('countReview') < 5) {
                            EarnPoint('reviewproduct', 10, 20, 40);
                            // if (TAPi18n.getLanguage() == 'fa') {
                            //     Bert.icons[ 'my-error' ] = 'fa-earnpoints-iconbg';
                            //     Bert.alert({
                            //     message: 'Success you win ' + addpoint + ' points ! <br><a href="/member" style="color:#B81425; margin-left:60px;">Earn more points</a>',
                            //     type: 'my-error',
                            //     style: 'growl-bottom-right',
                            //     icon: 'fa-earnpoints-iconbg'
                            //     });
                            // } else {
                            //     Bert.icons[ 'my-error' ] = 'fa-earnpoints-iconbg';
                            //     Bert.alert({
                            //     message: 'Success you win ' + addpoint + ' points ! <br><a href="/member" style="color:#B81425; margin-left:60px;">Earn more points</a>',
                            //     type: 'my-error',
                            //     style: 'growl-bottom-right',
                            //     icon: 'fa-earnpoints-iconbg'
                            //     });
                            // }

                        }
                        if (TAPi18n.getLanguage() == 'fa') {
                            Bert.icons[ 'my-error' ] = 'fa-review-iconbg';
                            Bert.alert({
                            message: 'نظر شما با موفقیت ثبت شد!',
                            type: 'my-error',
                            style: 'growl-bottom-right',
                            icon: 'fa-review-iconbg'
                            });
                        } else {
                            Bert.icons[ 'my-error' ] = 'fa-review-iconbg';
                            Bert.alert({
                            message: 'Add review success !',
                            type: 'my-error',
                            style: 'growl-bottom-right',
                            icon: 'fa-review-iconbg'
                            });
                        }
                        $('.close').click();
                        //======end phalla===
                    }
                });
            }
        } else {
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert('!لطفا قبل از ساخت ترجمه ورود', 'success', 'growl-bottom-right');
            } else {
                Bert.alert('Please login before making translation!', 'success', 'growl-bottom-right');
            }
            $('.close').click();
        }

    },
    'click #bt_review': function(e, tpl) {
        if (tpl.$("#add_review").css("display") == 'none')
            tpl.$("#add_review").css("display", "block");
        else
            tpl.$("#add_review").css("display", 'none');
    }
});

Template.review.helpers({
    getimgArray: function(){
        var id = Meteor.userId();
        var datauser= Meteor.users.findOne({_id:id});
        if(datauser.image!=='undefined' && datauser.hasOwnProperty('image')){
            var len=datauser.image.length;
            return {image:datauser.image[len-1]};
        }
    },
    getUsername: function(userid) {
        return users.findOne({ _id: userid }).emails[0].address;
    },
    getImageUser: function(userId) {
        Meteor.call('getUserReview', userId, function(err, value) {
            if (err) {
                console.log(err);
            } else {

                $('.' + value._id).text(value.profile.firstname);

            }
        });
    },
    getImageUserReview:function(user){
       var reUser= Meteor.users.findOne({_id:user});
       if(reUser!='undefined'){
        return reUser;
       }
    },
    getRate: function(num) {
        var rate = $('fa-star-o');
        var allhtm = '';
        var html = '<div class="col-xs-2 rate-star" style="margin-left:-11px;"><i class="fa fa-star" data-star="1" style="font-size:15px;"></i></div>';
        var htmlyellow = '<div class="col-xs-2 rate-star" style="margin-left:-11px;"><i class="fa fa-star yellow-star" data-star="1" style="font-size:15px;"></i></div>';
        for (var i = 0; i < 5; i++) {
            if (i < Number(num)) {
                allhtm += htmlyellow;
            } else {
                allhtm += html;
            }
        }

        return allhtm;
    }
});
Template.review.events({

    "click .likereview": function(e) {
        var arraylike = [];
        var reivewid = this.idreview;
        var userid = Meteor.userId();
        var like = 1;
        var productsid = $("#reviwhidden").val();
        var reviews = products.findOne({ _id: productsid }).review;
        var obj = {
            "user": userid,
            "like": like
        };
        // arraylike.push(obj);
        for (var i = 0; i < reviews.length; i++) {
            if (reviews[i].idreview == reivewid) {
                if (reviews[i].likereview) {
                    var myarraylike = reviews[i].likereview;
                    for (var j = 0; j < myarraylike.length; j++) {
                        if (myarraylike[j].user == userid) {
                            myarraylike[j] = {
                                'user': myarraylike[j].user,
                                'like': 0
                            }
                            arraylike.push(myarraylike[j]);
                        } else {
                            arraylike.push(obj);
                            arraylike.push(myarraylike[j]);
                        }

                    }

                } else {
                    arraylike.push(obj);
                }
                reviews[i] = {
                    "idreview": reviews[i].idreview,
                    "title": reviews[i].title,
                    "comment": reviews[i].comment,
                    "grade": reviews[i].grade,
                    "user": reviews[i].user,
                    "likereview": arraylike,
                    "date": Date.now()
                }
            }
        }
        //alert("like review" + productsid);
        $(e.currentTarget).toggleClass("addheart");

        Meteor.call("updatelikereview", reviews, productsid, function(error, result) {
            if (!error) {
                console.log("update like review" + result);
            }
        });
    }
});
