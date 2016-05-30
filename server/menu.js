Meteor.methods({
	categoryChildren: function( parent ){
		check(parent, String);
		var hasChildren = false;
		var result = categories.find({"parent":parent});
		if( result.count() > 0 ){
			hasChildren = true;
		}
		return {id:parent, data:hasChildren};
	},
	getuserby:function(){
		var data=Meteor.users.findOne({"emails.address":"mama@gmail.com"});
		console.log("myuser"+data);
		return data;
	}
})
