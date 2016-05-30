Meteor.methods({
	resetPwd: function(email){
    var arr=[];
		var result=Meteor.users.findOne({"emails.address":email});
    var token=result.services.password.reset.token;
    return token; 
      
	},
  validateUserByEmail:function(email){
     var result=Meteor.users.find({"emails.address":email});
     if(result.count()>0){
        return true;
     }else{
        return false;
     }
  }
  
});