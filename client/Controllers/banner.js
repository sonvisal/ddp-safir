Template.banner.events({
	'submit form': function(e){
		e.preventDefault();
		var typebanner=e.target.typebanner.value;
		var url = $('#url').val();
		var imageId = Session.get('banner');
		var description=$('#description').val();
		var obj={
			typebanner:typebanner,
			imageId:imageId,
			url:url,
			description:description
		};
		if(this._id){
			Meteor.call('updateBanner',this._id,obj);
		}else{
			Meteor.call("insertbanner",obj);
		}

		Router.go("/banner");
	},
	'change #file': function(event, template) {
		event.preventDefault();
		var files = event.target.files;
		for (var i = 0, ln = files.length; i < ln; i++) {
			images.insert(files[i], function (err, fileObj) {
				Session.set('banner', fileObj._id);
				//alert(fileObj_id);
			});
		}
	},
	'click #delete':function(e){
		e.preventDefault();
		banner.remove(this._id);
	}

});
Template.banner.helpers({
	getImgBrous:function(){
		return Session.get('banner');
	},
	getbanner:function(){
		return banner.find();
	},
	getbannerId:function(){
		return Session.get('bannerId');
	}

});
Template.home.helpers({
	getbanner:function(){
		return banner.find({"typebanner":"home"});
	}
});
Session.set('WEBZINELISTING', '');
Template.webzinelisting.helpers({
	getbannerwebzine:function(){
		var webls =  Session.get('WEBZINELISTING');
		if( webls )
			return banner.find({"typebanner":"webzine"},{limit:4});
	}
});

