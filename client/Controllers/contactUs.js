Session.set("requestpassword","");
Template.contactus.events({
	"click #btnContact":function(){
		var userId=Meteor.userId();
		var fname=$("#fname").val();
		var lname=$("#lname").val();
		var emails=$("#useremail").val();
		var subject=$("#subject").val();
		var comment = $("#comment").val();

		var obj={
			fname:fname,
			lname:lname,
			emails:emails,
			subject:subject,
			comment:comment
		}
		if(fname == "" || lname == "" || emails == "" || subject == "" || comment == ""){
			if(fname == ""){
				$(".firstname").text("First Name is required!");
			}
			if(lname == ""){
				$(".lastname").text("Last Name is required!");
			}
			if(emails == ""){
				$(".email").text("Email is required!");
			}
			if(subject == ""){
				$(".subject").text("Subject is required!");
			}
			if(comment == ""){
				$(".comment").text("Comment is required!");
			}
		}else{
			var dataContext={
				firstname:fname,
				lastname:lname,
				emails:emails,
				subject:subject,
				comment:comment
			}
			var subject = $("#subject").val();
			//var html = '<p>firstname'+firstname+'</p>'

			var html=Blaze.toHTMLWithData(Template.getEmail,dataContext);
			Meteor.call("sendEmailComment", subject,html, function(err, respond){
				if(err){
					alert("error hz");
				}else{
					var fname=$("#fname").val('');
					var lname=$("#lname").val('');
					var subject=$("#subject").val('');
					var comment = $("#comment").val('');
					$(".firstname").text("");
					$(".lastname").text("");
					$(".email").text("");
					$(".subject").text("");
					$(".comment").text("");
				 	if (TAPi18n.getLanguage() == 'fa') {
                        Bert.alert('مشخصات به روز شده است', 'success', 'growl-bottom-right');
                    } else {
                        Bert.alert('Your comment has been send!', 'success', 'growl-bottom-right');
                    }
                    var dataContext1={
                    	title:"Hello, ",
                    	message:"We have received your message, it will be processed as soon as possible. ",
                    	text:"Thank you for your visit on Safirperfumery.com."
                    }
                    var sendTo = $('#useremail').val();
                    Session.set("requestpassword",sendTo);
                    var subject = "Thanks for visit Safirperfumery";
                    var html=Blaze.toHTMLWithData(Template.sendEmailBack,dataContext1);
                    //console.log("emails back"+sendTo);
                    Meteor.call("sendMailBack",sendTo,subject,html,function(err){
                    	if(err){
                    		alert("err send back");
                    	}else{
                    		var emails=$("#useremail").val('');
                    		if (TAPi18n.getLanguage() == 'fa') {
		                        Bert.alert('مشخصات به روز شده است', 'success', 'growl-bottom-right');
		                    } else {
		                        Bert.alert('You resive one email from us!', 'success', 'growl-bottom-right');
		                    }
		                }
                    });
				}
			});
		}
	}
});