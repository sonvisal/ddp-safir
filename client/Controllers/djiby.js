
Session.set('MYPRICE','');
Session.set('MYBRAND','');
Session.set('MYTAG','');
Session.set('MYLOGINUSERID', '');
Session.set('CHANGEPROFILEIMAGE', '');
Template.djiby.helpers({
	products: function(){
		return products.find({});
	}
});

Template.djiby.events({
	'click #btn': function(e,tpl){
		var val=Session.get('DJIB_LIM');
		val=val+16;
		//console.log('SUB '+val);
		Session.set('DJIB_LIM',val);
	}
});


Tracker.autorun(function () {

	 var limit=Session.get('DJIB_LIM');
	 var changeprofile = Session.get('CHANGEPROFILEIMAGE');
	 if(limit){
	 		//console.log('come on');
		var cat =Session.get('subcategories');
		var myprice = Session.get('MYPRICE');
		var mybrand = Session.get('MYBRAND');
		var mytag = Session.get('MYTAG');
		Meteor.subscribe('productsDjib',limit, cat, myprice, mybrand, mytag);
			 
	 }
	 /*
	 var uploadnewimg = Session.get('UPLOADNEWIMAGE');
	 if( uploadnewimg ){
	 	 console.log('auto run==true');
	 	var userid = Meteor.userId();
	 	Meteor.subscribe('currentUserLoggedInImage', userid);
	 }
	*/
	 //}
	// console.log('UPDATE LISTPRODUCT: '+limit)
	 
});