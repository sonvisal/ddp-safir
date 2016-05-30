Template.listAllBrands.helpers({
	 getAllListBrands:function(){
       Meteor.call('allbrands', function(err, data){
            if(err) console.log(err);
            else {
              Session.set("mybrands",data)
            }
        });
        return Session.get('mybrands'); 
    }

});

Template.listAllBrands.events({

	'click .brandtosearch':function(e,tpl){
        var key=$(e.currentTarget).attr('data-brand');
        //alert(key);
        Session.set('keyword', key);
            if (Session.get('groupsearch') == ''){
                Session.set('groupsearch', 0);
            }
            //alert("hi");
            Router.go('/brand/'+key);
    }
});