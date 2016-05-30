var IR_BeforeHooks = {
    isAdmin: function(pause) {
        console.log('djib hook');
        if (!Roles.userIsInRole(Meteor.userId(), ['admin'], 'mygroup')) {
            this.render('login');
            pause();
        } else {
            this.next();
        }
    },
    isAdminOrMember: function(pause) {
        if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'member'], 'mygroup')) {
            this.render('login');
            pause();
        } else {
            this.next();
        }
    },
    checkoutNotLogin: function(pause) {
        if (!Roles.userIsInRole(Meteor.userId(), ['admin', 'member'], 'mygroup')) {
            this.render('login');
            pause();
        } else {
            this.next();
        }
    },
    trackingRouter: function() {
        if (Meteor.isClient) {
            if (Meteor.userId() != null)
                userId = Meteor.userId();
            else
                userId = Session.get('userId');
            var time = Date.now();
            var currenturl = window.location.href;
            Meteor.call('trackingRouter', userId, time, currenturl);
        }
    },
    MySubscription: function() {
        console.log('subscribing');
        if (Meteor.isClient) {;
            this.subscribe("users", [this.userId]);
            this.next();
        }
    },
    sitemap: function() {
        if (Meteor.isClient) {
            var now = new Date();
            // console.log(" today is "+now.getDay() +" hours "+now.getHours()+" Minutes "+ now.getMinutes() +" Second "+ now.getSeconds());
            if (now.getHours() == 11 ) {
                Meteor.call('catSiteMap');
            }
            if (now.getHours() == 11) {
                Meteor.call('proSiteMap');
            }
        }
    },
    pageView: function() {
        if (Meteor.isClient) {
            var admin_url = Router.current().url;
            var result = admin_url.split('/')[1];
            if (result=="")
                result = "home";
            var url = 'https://www.google-analytics.com/collect?v=1&t=pageview&tid=UA-71059459-2&cid=555&dh=' + admin_url + '&dp=%2F' + result + '&dt=' + result + 'page';
            Meteor.call('eventCall', url, function(error, result) {
                if (error) {
                    console.log('Analytic CLIENT ERRR');
                    console.log(error);
                } else {
                    console.log('Analytic CLIENT RESULT');
                    console.log(result);
                }
            });
            this.next();
        }
    },
    updateMembershipId:function(){
        if(Meteor.isClient){
            var userid=Meteor.userId();
            var profile = Meteor.users.findOne({ _id: userid }).profile;
            var oldpoint = profile.shipcard.point;
            var resultmembership = membership.find();
            var arrmem = [];

            resultmembership.forEach(function(value) {
                if (value.minpoint <= oldpoint && oldpoint <= value.maxpoint) {
                    arrmem.push(value);
                }
            });
            if (arrmem[0].name == 'black') {
                var membershipId=arrmem[0]._id;
                console.log("black");
            }
            if (arrmem[0].name == 'silver') {
                var membershipId=arrmem[0]._id;
                console.log("silver");
            }
            if (arrmem[0].name == 'gold') {
                var membershipId=arrmem[0]._id;
                console.log("gold");
            }
            Meteor.users.update({_id:userid},{$set: {"profile.shipcard.membershipID":membershipId}});
        }
    }
};

var routerNameAdmin = [
    'manageproduct',
    'addproduct',
    'updateproduct',
    'managecategory',
    'addcategory',
    'updatecategory',
    'manageshop',
    'updateshop',
    'managecontent',
    'addContent',
    'updatecontent',
    'manageparenttag',
    'updateparenttag',
    'managetag',
    'edittag',
    'parentattr',
    'editparentattr',
    'attribute',
    'editattr',
    'addlistproduct',
    'updatelistproduct',
    'linkselling',
    'addlist',
    'banner',
    'listTranslate',
    'mousetracking',
    'manageUserTracking',
    'stock',
    'listQuizz',
    'proDiscount',
    'manageDiscount',
    'updateProDiscount',
    'manageCollect',
    'updateCollect',
    'adminorder',
    'adminorderdetail'

];
var routerNameMember = [
    'profile',
    'editprofile',
    'reward',
    'member',
    'dailyPopup',
    'confirmorder',
    'confirmorder1',
    'confirmorder2',
    'payment'

];
var routerCheckout = ['checkout'];
//Router.before(IR_BeforeHooks.pageView);
Router.before(IR_BeforeHooks.isAdmin, { only: routerNameAdmin });
Router.before(IR_BeforeHooks.isAdminOrMember, { only: routerNameMember }); //for member
Router.onAfterAction(IR_BeforeHooks.trackingRouter);
// Router.onAfterAction(IR_BeforeHooks.sitemap);
//Router.onAfterAction(IR_BeforeHooks.updateMembershipId);


//Router.onBeforeAction(IR_BeforeHooks.MySubscription);
//Router.onBeforeAction(IR_BeforeHooks.checkoutNotLogin,{only:routerCheckout});
