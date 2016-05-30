var datapage = '';
var router = '';
var tempname = '';
if( Meteor.isServer){
	var page = pages.find({});
	if( page.count() > 0){
		page.forEach( function(data, index){
			/*router = data.router;
			tempname = data.tempname;
			Router.map(function () {
			  this.route(tempname, {
			    	path: '/' + router
				});
			});*/
		})
	}
}
Router.map(function () {
  this.route('newarrival', {
    	path: '/newarrival',
    	waitOn: function() {
            var name = window.location.href;
            name=name.split("/")[3];
            console.log("HAMLY ROUT "+name);
            var getuser=Meteor.userId();
            if(getuser)
                userid=getuser;
            else
                userid=Session.get("userId");
    		return [Meteor.subscribe( "pages" ), Meteor.subscribe( 'productsPage'),Meteor.subscribe("favorite"),Meteor.subscribe("getattribute",name),Meteor.subscribe("getFavorite",userid)];
    	},
    onAfterAction: function() {
        if (!Meteor.isClient) {
            return;
        }
        SEO.set({
            title: "محصولات جدید | Safir Iran",
            meta: {
                'description': "خرید محصولات زیبایی جدید در Safir . داغترین محصولات جدید در آرایش ، مراقبت از پوست ، عطر، مراقبت از مو، محصولات مردانه و بیشتر. ... تازه از راه رسیده"
            },
            og: {
                'title': "محصولات جدید | Safir Iran",
                'description': "خرید محصولات زیبایی جدید در Safir . داغترین محصولات جدید در آرایش ، مراقبت از پوست ، عطر، مراقبت از مو، محصولات مردانه و بیشتر. ... تازه از راه رسیده"
            }
        });
    }
	});
});
Router.map(function () {
  this.route('bestselling', {
    	path: '/bestselling',
    	waitOn: function() {
            var name = window.location.href;
            name=name.split("/")[3];
            var getuser=Meteor.userId();
            if(getuser)
                userid=getuser;
            else
                userid=Session.get("userId");
    		return [Meteor.subscribe( "pages" ),Meteor.subscribe( 'productsPage'),Meteor.subscribe("favorite"),Meteor.subscribe("getattribute",name),Meteor.subscribe("getFavorite",userid)];
    	},
    onAfterAction: function() {
        if (!Meteor.isClient) {
            return;
        }
        SEO.set({
            title: "پیشنهادات سفیر | Safir Iran",
            meta: {
                'description': "فروشگاه Safir بهترین فروشندگان . مرور مجموعه ما از آرایش، مراقبت از پوست و حمام محصولات محبوب ، همه از مارک های مورد علاقه خود را."
            },
            og: {
                'title': "پیشنهادات سفیر | Safir Iran",
                'description': "فروشگاه Safir بهترین فروشندگان . مرور مجموعه ما از آرایش، مراقبت از پوست و حمام محصولات محبوب ، همه از مارک های مورد علاقه خود را."
            }
        });
    }
	});
});
Router.map(function () {
  this.route('ideagift', {
    	path: '/ideagift',
    	waitOn: function() {
            var name = window.location.href;
            name=name.split("/")[3];
            var getuser=Meteor.userId();
            if(getuser)
                userid=getuser;
            else
                userid=Session.get("userId");
    		return [Meteor.subscribe( "pages" ),Meteor.subscribe( 'productsPage'),Meteor.subscribe("favorite", userid),Meteor.subscribe("getattribute",name),Meteor.subscribe("getFavorite",userid)];
    	},
    onAfterAction: function() {
        if (!Meteor.isClient) {
            return;
        }
        SEO.set({
            title: "ایده های هدیه | Safir Iran",
            meta: {
                'description': "خرید هدیه زیبایی در Safir . یافتن مجموعه هدیه، کیت آرایش، عطر و ادکلن نمونه و بیشتر از مارک های مراقبت از پوست، عطر و آرایش امتیاز بالا ."
            },
            og: {
                'title': "ایده های هدیه | Safir Iran",
                'description': "خرید هدیه زیبایی در Safir . یافتن مجموعه هدیه، کیت آرایش، عطر و ادکلن نمونه و بیشتر از مارک های مراقبت از پوست، عطر و آرایش امتیاز بالا ."
            }
        });
    }
	});
});
Router.map(function () {
  this.route('natural', {
    	path: '/natural',
    	waitOn: function() {
            var name = window.location.href;
            name=name.split("/")[3];
            var getuser=Meteor.userId();
            if(getuser)
                userid=getuser;
            else
                userid=Session.get("userId");
    		return [Meteor.subscribe( "pages" ), Meteor.subscribe( 'productsPage'),Meteor.subscribe("favorite"),Meteor.subscribe("getattribute",name),Meteor.subscribe("getFavorite",userid)];
    	},
    onAfterAction: function() {
        if (!Meteor.isClient) {
            return;
        }
        SEO.set({
            title: "همه آرایش طبیعی برندها ، آرایشی و بهداشتی آلی | Safir Iran",
            meta: {
                'description': "فروشگاه همه علامت های تجاری آرایش طبیعی در Safir . فهرست انتخاب ما را از آرایش آلی ، مراقبت از پوست ، مراقبت از مو ، محصولات حمام و بیشتر از مارک های مورد اعتماد."
            },
            og: {
                'title': "همه آرایش طبیعی برندها ، آرایشی و بهداشتی آلی | Safir Iran",
                'description': "فروشگاه همه علامت های تجاری آرایش طبیعی در Safir . فهرست انتخاب ما را از آرایش آلی ، مراقبت از پوست ، مراقبت از مو ، محصولات حمام و بیشتر از مارک های مورد اعتماد."
            }
        });
    }
	});
});
Router.map(function () {
  this.route('smokyeyes', {
    	path: '/smokyeyes',
    	waitOn: function() {
            var name = window.location.href;
            name=name.split("/")[3];
            var getuser=Meteor.userId();
            if(getuser)
                userid=getuser;
            else
                userid=Session.get("userId");
    		return [Meteor.subscribe( "pages" ), Meteor.subscribe( 'productsPage'),Meteor.subscribe("favorite"),Meteor.subscribe("getattribute",name),Meteor.subscribe("getFavorite",userid)];
    	},
    onAfterAction: function() {
        if (!Meteor.isClient) {
            return;
        }
        SEO.set({
            title: "چشم اسموکی | Safir Iran",
            meta: {
                'description': "مجموعه ای از براش های چشم و ریمل مژه و ابرو حجم دهنده طراحی شده برای چشم دودی خیره کننده. با اطمینانشرجی، چشم دودی با این مجموعه قلم مو و ریمل مژه و ابرو زیبا ایجاد کنید."
            },
            og: {
                'title': "چشم اسموکی | Safir Iran",
                'description': "مجموعه ای از براش های چشم و ریمل مژه و ابرو حجم دهنده طراحی شده برای چشم دودی خیره کننده. با اطمینانشرجی، چشم دودی با این مجموعه قلم مو و ریمل مژه و ابرو زیبا ایجاد کنید."
            }
        });
    }
	});
});
Router.map(function () {
  this.route('nichefragrance', {
    	path: '/nichefragrance',
    	waitOn: function() {
            var name = window.location.href;
            name=name.split("/")[3];
            var getuser=Meteor.userId();
            if(getuser)
                userid=getuser;
            else
                userid=Session.get("userId");
    		return [Meteor.subscribe( "pages" ), Meteor.subscribe( 'productsPage'),Meteor.subscribe("favorite"),Meteor.subscribe("getattribute",name),Meteor.subscribe("getFavorite",userid)];
    	},
    onAfterAction: function() {
        if (!Meteor.isClient) {
            return;
        }
        SEO.set({
            title: "عطرهای دست ساز | Safir Iran",
            meta: {
                'description': "عطر طاقچه فروشگاه و ادکلن در Safir . فهرست مجموعه ما از رایحه منحصر به فرد و به خصوص سرپرستی را پیدا عطر مورد علاقه جدید خود را."
            },
            og: {
                'title': "عطرهای دست ساز | Safir Iran",
                'description': "عطر طاقچه فروشگاه و ادکلن در Safir . فهرست مجموعه ما از رایحه منحصر به فرد و به خصوص سرپرستی را پیدا عطر مورد علاقه جدید خود را."
            }
        });
    }
	});
});