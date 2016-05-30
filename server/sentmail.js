Meteor.startup(function () {
//GoogleMaps.load();
// process.env.MAIL_URL="smtp://tinhamly%40gmail.com:0977484889@smtp.gmail.com:465/";
process.env.MAIL_URL="smtp://djibril.cisse%40noo-lab.com:senegal95@ssl0.ovh.net:465/";
//smtp://djibril.cisse7%40%noo-lab.com:senegal95@ssl0.ovh.net:465


});
Meteor.methods({
	mysendEmail: function (to, subject, html) {
		this.unblock();
		Email.send({
			to: to,
			from: 'djibril.cisse@gmail.com',
			cc:'kisphly.sup@gmail.com',
			subject: subject,
			html: html
		});
	},
	inviteFriends: function (to, subject, message) {
		this.unblock();
        console.log('to=='+to+'/subject=='+subject+'/message=='+message);
		Email.send({
			to: to,
			from: 'contact@safirperfumery.com',
			//cc:'kisphly.sup@gmail.com',
			subject: subject,
			html: message
			

		});
	},
	insertImedation:function(email,obj){
        var invite=imedation.findOne({email_imedate:email});
        console.log('email=='+email);
        if(invite=='undefined'){
           imedation.insert(obj); 
        }
		
	},
	mail: function(html1){
        this.unblock();
        Email.send({
            to: 'sokhy.yin@gmail.com',
            from: 'contact@safirperfumery.com',
            subject: 'test send email',
            html: html1
        });
    },
    'newsmail':function(newsmail){
    	this.unblock();
    	Email.send({
    		to: newsmail,
    		from: 'contact@safirperfumery.com',
    		subject: 'You have been Sign Up with our Website!',
    		text: 'When we have something news, we will send you vai this email address! Thanks.'

    	})
    },
    'sendMailByOrder': function(){
    	this.unblock();
    	Email.send({
    		to: 'sokhy.yin@gmail.com',
    		from: 'contact@safirperfumery.com',
    		subject: 'YOu have order our product',
    		text: 'Thanks for your order, plz. come again!'
    	})
    }

});