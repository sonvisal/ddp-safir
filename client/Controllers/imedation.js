Template.imedation.events({
	'submit form':function(e){
		e.preventDefault();
    if(Meteor.userId()){
      var user=Meteor.users.findOne({_id:Meteor.userId()});
      
      var name=user.profile.firstname;
        var subject =name+' invite you to safirperfumery.com !';
        var sendTo = event.target.email.value;
        var message= ' <a href="http://localhost:3000/login">Pleas confirm</a>';
        //console.log(Meteor.userId());
        if(validateEmail(sendTo) == true){
          alert('ok');
          Meteor.call('inviteFriends',sendTo,subject,message,function(err){
              if(err){
                  console.log("error" + err);
              }else{
                obj={
                 user_id:Meteor.userId(),
                 email_imedate:sendTo,
                 date:Date.now()
                }
               Meteor.call('insertImedation',sendTo,obj)
             }
          });
        }
        
    }else{
      Router.go('/login');
    }
  }  
});
