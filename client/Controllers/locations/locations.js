Template.topcategory.onCreated(function(){
  this.subscribe( "pages" );
});
Template.topcategory.helpers({
	list1: function( categoryId ){
        //var cat = this._id;
		var list = pages.find({type:"slide",page:"category", categoryId:categoryId}).fetch()[0];
		if( list ) return list;
		else return;
	},
	list2: function( categoryId ){
        //var cat = this._id;
		var list = pages.find({type:"slide",page:"category", categoryId:categoryId}).fetch()[1];
		if( list ) return list;
		else return;
	}
})