// Meteor.subscribe('locations');
Meteor.subscribe("shopLearnIt");
Meteor.subscribe("newsletter");
TAPi18n.subscribe("categories");
//Meteor.subscribe("posts");
Meteor.subscribe("membership");
//Meteor.subscribe("images");
Meteor.subscribe("updatemembershipID",Meteor.userId());
Meteor.subscribe("favorite",Session.get('userId'));
//Meteor.subscribe("favorite",Meteor.userId());
Session.setDefault('storeName','');
Session.setDefault('RetailBarcode','');
Meteor.subscribe('productCheckout',Session.get('userId'));
Meteor.subscribe('parentattr');
Tracker.autorun(function() { 
	if(Session.get('users_to_subsribe')==null ||Session.get('users_to_subsribe')=='' || Session.get('users_to_subsribe')==[])
		Session.set('users_to_subsribe',[]);
	//console.log('JE SOUSCRIS A'+Session.get('users_to_subsribe'));
	Meteor.subscribe("users",Session.get('users_to_subsribe'));
	if(!Session.get('userId')){
		Session.setPersistent('userId',Random.id());
	}
}); 

console.log('FAVORITE TO '+Session.get('userId'));
Meteor.subscribe("cart",Session.get('userId'));
//Meteor.subscribe("getFavorite",Meteor.userId());
//Meteor.subscribe("cart",Meteor.userId());

// Meteor.subscribe("contents_type");
// Meteor.subscribe("favorite");
Meteor.subscribe("role");
// Meteor.subscribe("order");
//Meteor.subscribe("answerquizz");

//Meteor.subscribe("journey");

//Meteor.subscribe("linkselling");

//Meteor.subscribe("userTracking");
//Meteor.subscribe("manageuserTracking");
//Meteor.subscribe("imedation");
Meteor.subscribe("anwser");
// Meteor.subscribe("shops");
//Meteor.subscribe("barcode");
//Meteor.subscribe("discount");

//Meteor.subscribe("quizz");


//Meteor.subscribe("shops");
//Meteor.subscribe("barcode");
// Meteor.subscribe("stock");

 // Tracker.autorun(function() { 
 // 	console.log('subscribing '+Session.get('storeName')+' / '+Session.get('RetailBarcode'))
 // if(Session.get('RetailBarcode')!='')
 // 	Meteor.subscribe("stock",Session.get('storeName'),Session.get('RetailBarcode'));

 // });
// Meteor.subscribe("stock",Session.get('storeName'),Session.get('RetailBarcode'));
//Meteor.subscribe("stock");
//Meteor.subscribe("userTracking");

