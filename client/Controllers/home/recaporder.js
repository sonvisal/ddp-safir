Template.recaporder.helpers({
    getprofile: function() {
    	var id = Meteor.userId();
    	return Meteor.users.findOne({ _id: id });  
  },

    getExplicitDate: function() {
    	var d = Date.now();
    	return d;
    }
});