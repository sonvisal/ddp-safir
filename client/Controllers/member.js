Template.member.rendered = function() {
    var me = Meteor.user();
    if (me.profile.shipcard != 'undefined') {
        var point = Number(me.profile.shipcard.point);
        if (point >= 0 && point <= 4000) {
            var black = (point * 100) / 4000;
            document.getElementById("black").style.width = black + '%';
            $("#bg-member").addClass("bg_member_black");
            $("#title-black").addClass("member-pro");
            // $("p.errorPoint").addClass("remove");
            $(".s").addClass("hidden");
            $(".g").addClass("hidden");
        } else if (point > 4000 && point <= 8000) {
            var silver = ((point - 4000) * 100) / 4000;
            document.getElementById("black").style.width = '100%';
            document.getElementById("silver").style.width = silver + '%';
            $("#bg-member").addClass("bg_member_silver");
            $("#title-silver").addClass("member-siver");
            $(".b").addClass("hidden");
            $(".g").addClass("hidden");
        } else if (point >= 8000 && point != NaN) {
            document.getElementById("black").style.width = '100%';
            document.getElementById("silver").style.width = '100%';
            document.getElementById("gold").style.width = '70%';
            $("#bg-member").addClass("bg_member_gold");
            $("#title-gold").addClass("member-gold");
            $(".b").addClass("hidden");
            $(".s").addClass("hidden");
        } else {
            document.getElementById("black").style.width = '0%';
            document.getElementById("silver").style.width = '0%';
            document.getElementById("gold").style.width = '0%';
            $("#bg-member").addClass("bg_member_black");
            $("#title-black").addClass("member-pro");
            $(".s").addClass("hidden");
            $(".g").addClass("hidden");
        }
    }
    
}
Template.member.events({
    'mouseover ul.text-center li': function(e) {
        $(e.currentTarget).css("color", "#fff");
    },
    'change #file': function(event, template) {
        event.preventDefault();
        var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            images.insert(files[i], function(err, fileObj) {
                Session.set('profile', fileObj._id);
                Meteor.call('updateImageUser', fileObj._id);
                Bert.alert('Update profile Image success !', 'success', 'growl-bottom-right');
            });
        }
        $('#profile-image').click();

    }
});
Template.member.helpers({
    getimgArray: function() {
        var id = Meteor.userId();
        var datauser = Meteor.users.findOne({ _id: id });
        if (datauser.image !== 'undefined' && datauser.hasOwnProperty('image')) {
            var len = datauser.image.length;
            return { image: datauser.image[len - 1] };
        }
    },
    nb_comments: function() {
        var me = Meteor.user();
        var number = products.find({ "review.user": me._id }).count();
        return number;
    },
    nb_likes: function() {
        var me = Meteor.user();
        var number = favorite.find({ "userId": me._id }).count();
        return number;
    },
    getpoint: function() {
        var me = Meteor.user();
        if (me == null)
            return;
        if (me.profile.shipcard != 'undefined')
            return me.profile.shipcard.point;
        else
            return 0;
    },
    getPourcentage: function() {
        var me = Meteor.user();
        if (me == null)
            return;
        if (me.profile.shipcard != 'undefined') {
            var pt = Number(me.profile.shipcard.point);
            return pt / 10;
        } else
            return 0;
    },
    getPourcentageBlack: function() {
        var me = Meteor.user();
        if (me == null)
            return;
        if (me.profile.shipcard != 'undefined') {
            var pt = Number(me.profile.shipcard.point);
            if (pt <= 4000)
                return 100 * pt / 4000;
            else
                return 100;
        } else
            return 0;
    },
    getPourcentageSilver: function() {
        var me = Meteor.user();
        if (me == null)
            return;
        if (me.profile.shipcard != 'undefined') {
            var pt = Number(me.profile.shipcard.point);
            if (pt < 4000)
                return 0;
            if (pt <= 8000)
                return 100 * pt / 8000;
            else
                return 100;
        } else
            return 0;
    },
    getPourcentageGold: function() {
        var me = Meteor.user();
        if (me == null)
            return;
        if (me.profile.shipcard != 'undefined') {
            var pt = Number(me.profile.shipcard.point);
            if (pt < 8000)
                return 0;
            if (pt <= 16000)
                return 100 * pt / 16000;
            else
                return 100;
        } else
            return 0;
    },
    nextRank: function() {

        var me = Meteor.user();
        //console.log('Getting user');
        if (me.profile.shipcard != 'undefined')
            var point = Number(me.profile.shipcard.point);
        else
            point = 0;

        //console.log('POINT:' + point);
        if (point >= 0 && point < 4000) {

            return 'SILVER';
        } else if (point >= 4000 && point < 8000) {
            Session.set('rank', 'SILVER');
            return 'GOLD';
        } else {
            Session.set('rank', 'GOLD');
            return 'VIP';
        }
        //console.log('rank:' + Session.get('rank'));


    },
    pointLeft: function() {

        var me = Meteor.user();
        //console.log('Getting user' + JSON.stringify(me));
        if (typeof me.profile.shipcard != "undefined")
            var point = Number(me.profile.shipcard.point);
        else
            point = 0;

        //console.log("POINT RESTANT" + point);

        if (point <= 4000)
            return 4000 - point;
        else if (point > 4000 && point < 8000)
            return 8000 - point;
        else
            return 16000 - point;
    },
    /*backgroundimg:function(){
        if(Session.get('rank')=='BRONZE'){
            return "bg_member_black";
        }else if(Session.get('rank')=='SILVER'){
            return "bg_member_silver";
        }else if(Session.get('rank')=='GOLD'){
            return "bg_member_gold";
        }else{
            console.log("no background!");
        }
    },*/
    /*getCurrentPoint: function(){
        var me = Meteor.user();
        var point = Number(me.profile.shipcard.point);
        console.log("phalla point "+point);
        Session.set('MYPOINT', point);
    },
    // persentage: function() {
    //     var me = Meteor.user();
    //     if (me.profile.shipcard != 'undefined')
    //         var point = Number(me.profile.shipcard.point);
    //     else
    //         var point = 0;
    //     //var point = Session.get('MYPOINT');
    //     console.log("My point "+point);

    //     if (point >= 0 && point <= 4000) {
    //         var black = (point * 100) / 4000;
    //         console.log("black per "+black);
    //         //return black;
    //         $("#black").style.width = black+'%';
    //     } else if (point > 4000 && point <= 8000) {
    //         var silver = ((point-4000)*100) / 4000;
    //         console.log("silver per "+silver);
    //         $("#silver").style.width = silver+'%';
    //         //return silver;
    //     } else {
    //         console.log("100 % of gold!");
    //     }
    // },*/
    isBronze: function() {
        if (Session.get('rank') == '') {
            var me = Meteor.user();
            if (me.profile.shipcard != 'undefined') {
                var point = Number(me.profile.shipcard.point);
            } else {
                point = 0;
            }
            //console.log('POINT:' + point);
            if (point >= 0 && point <= 4000) {
                Session.set('rank', 'BRONZE');
                //$('#ranking').addClass("backpt");
            } else if (point > 4000 && point <= 8000) {
                Session.set('rank', 'SILVER');
                //$('#ranking').addClass("backptsilver");
            } else {
                //$('#ranking').addClass("backptgold");
                Session.set('rank', 'GOLD');
            }
            //console.log('rank:' + Session.get('rank'));
        }
        if (Session.get('rank') == 'BRONZE') {
            return true;
        } else {
            return false;
        }
    },
    isSilver: function() {
        if (Session.get('rank') == '') {
            var me = Meteor.user();
            if (me.profile.shipcard != 'undefined') {
                var point = Number(me.profile.shipcard.point);
            } else {
                point = 0;
            }
            //console.log('POINT:' + point);
            if (point >= 0 && point <= 4000) {
                Session.set('rank', 'BRONZE');
                //$('#ranking').addClass("backpt");
            } else if (point > 4000 && point <= 8000) {
                Session.set('rank', 'SILVER');
                //$('#ranking').addClass("backptsilver");
            } else {
                //$('#ranking').addClass("backptgold");
                Session.set('rank', 'GOLD');
            }
            //console.log('rank:' + Session.get('rank'));
        }
        if (Session.get('rank') == 'SILVER') {
            return true;
        } else {
            return false;
        }
    },
    isGold: function() {
        //console.log('gold');
        if (Session.get('rank') == '') {
            var me = Meteor.user();
            //console.log('Getting user');
            if (me.profile.shipcard != 'undefined') {
                var point = Number(me.profile.shipcard.point);
            } else {
                point = 0;
            }
            //console.log('POINT:' + point);
            if (point >= 0 && point <= 4000) {
                Session.set('rank', 'BRONZE');
                //$('#ranking').addClass("backpt");
            } else if (point > 4000 && point <= 8000) {
                Session.set('rank', 'SILVER');
                //$('#ranking').addClass("backptsilver");
            } else {
                //$('#ranking').addClass("backptgold");
                Session.set('rank', 'GOLD');
            }
            //console.log('rank:' + Session.get('rank'));
        }
        if (Session.get('rank') == 'GOLD') {
            return true;
        } else {
            return false;
        }
    },
    getproduct: function() {

        var point = Meteor.user().profile.shipcard.point;
        var p = Number(point);
        //console.log('MyResult:' + p);
        var result = products.find({ point: { $gte: 0, $lte: p } });
        //console.log("NB result: " + result.fetch().length);
        return result;

    }
});
