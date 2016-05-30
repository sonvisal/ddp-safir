Template.addLocation.onCreated(function(){
  // Here, we're making use of Meteor's new template-level subscriptions.
  this.subscribe( "products" );
});
Template.editLocation.onCreated(function(){
  // Here, we're making use of Meteor's new template-level subscriptions.
  this.subscribe( "products" );
  Session.set('PROIDUPDATE', '');
});
Template.addLocation.onRendered(function(){
	$('#catVal').parents('.form-group').hide();
	$('#position').parents('.form-group').hide();
	$('#order').parents('.form-group').hide();
	$('#product').parents('.form-group').hide();
});
Session.set('IMAGELOCATIONEDIT','');
Session.set('PROIDUPDATE', '');
Template.editLocation.events({
	'click #edit':function(){
		var id = this._id;
		var name = $('#name').val();
		var image = Session.get('IMAGELOCATIONEDIT');
		var oldImage = $('input#oldImage').val();
		var link = $('#link').val();
		var type = $('#type').val();
		var order = parseInt($('#order').val());
		var productid = Session.get('PROIDUPDATE');
		var type = $('#type').val();
		var page = $('#page').val();
		var position = $('#position').val();
		var catlist = [];
		$('.listcategory input').each( function(){
			if( this.checked ){
				catlist.push($(this).val());
			}
		})
		
		//oldImage = oldImage.attributes['value'].value;
		
		//console.log( 'Old:'+ oldImage);
		if(image == '')
			image=oldImage

		if( name =='' || type==''){
			Bert.alert('Name or Type is require!', 'danger', 'growl-bottom-right');
		}else{
			var obj = {
				name:name,
				image_id:image,
				link:link,
				type:type,
				page:page,
				categoryId:catlist,
				position:position,
				productid:productid,
				order:order

			}
			
			//console.log( obj );
			Meteor.call('updateLocation',id,obj,function(err){
				if(err)
					console.log("Error edit location: "+err.reason);
				else{
					Bert.alert('Location has been added!', 'success', 'growl-bottom-right');
					Router.go('/admin/location');
					Session.set('IMAGELOCATIONEDIT','');
				}

			});
		}

	},
	'change #image':function(e){
		e.preventDefault();
	    var files = e.target.files;
	    for (var i = 0, ln = files.length; i < ln; i++) {
	      	var img = images.insert(files[i], function (err, fileObj) {});

	  		Session.set('IMAGELOCATIONEDIT',img._id);
	  		//console.log( "image:"+img._id);
    	}
	},
	'click #addProduct': function(){
		var product = $('#product').attr('data-id');
		if( product != ''){
			var proid = [];
			if( Session.get('PROIDUPDATE') ){
				var data = Session.get('PROIDUPDATE');
				data.push(product);
				proid = data;
			}else{
				proid.push( product );
			}
			//console.log(proid);
			Session.set('PROIDUPDATE', proid);
		}else{
			Bert.alert('Product is require!', 'danger', 'growl-bottom-right');
		}
	},
	'keyup #product': function(e){
		var key = $(e.currentTarget).val();
		if( key.length > 3){
			var data = products.find({ "title": { $regex: new RegExp(key, "i") } });
			var text = '';
			if( data.count() > 0){
				data.forEach( function(data, index){
					text += '<li data-id="'+data._id+'" class="listpro">'+data.title+'</li>';
				})	
			}
			if( text!='')
				$('#result').html( '<div style="border:1px solid #ddd;padding:5px">'+text+'</div>' );
			else
				$('#result').html( '<li>No result.</li>' );
		}
	},
	'click .listpro': function(e){
		var title = $(e.currentTarget).html();
		var id = $(e.currentTarget).attr('data-id');
		$('#product').val(title);
		$('#product').attr('data-id', id);
		$('#result').html('');

	},
	'change #type': function(e){
		var type = $(e.currentTarget).val();
		if( type == 'Deal'){
			$('#image').parents('.form-group').hide();
			$('#link').parents('.form-group').hide();
			$('#order').parents('.form-group').hide();
			$('#product').parents('.form-group').show();
		}else if( type =='Quicklinks' || type =='Lifestyle'){
			$('#image').parents('.form-group').show();
			$('#link').parents('.form-group').show();
			$('#order').parents('.form-group').show();
			$('#product').parents('.form-group').hide();
		}else{
			$('#image').parents('.form-group').show();
			$('#link').parents('.form-group').show();
			$('#order').parents('.form-group').show();
			$('#product').parents('.form-group').show();
		}
	},
	'click .remove': function(e){
		var removeid = $(e.currentTarget).attr('pro-id');
		var proid = [];
		if( Session.get('PROIDUPDATE') ){
			var data = Session.get('PROIDUPDATE');
			var index = data.indexOf(removeid);
			if (index > -1) 
				data.splice(index, 1);
			
			Meteor.call('updateLocationProduct',this._id, data);
			proid = data;

		}
		Session.set('PROIDUPDATE', proid);
		
	}
});
Template.editLocation.helpers({
	getCurrentType:function(type){
		return locations.findOne({type:type}).type;
	},
	listpro : function(){
		var data = [];
		var da = Session.get('PROIDUPDATE');
		data = (da.length > 0)? da:[];
		var id = this._id;
		var listdb = locations.findOne({_id:id});
		if( listdb ){
			var ls = listdb.productid;
			for( i=0; i < ls.length; i++){
				if( ls[i] ){
					var index = data.indexOf(ls[i]);
					if (index <= -1) 
						data.push(ls[i]);
				}
			}
			var html =  getLocationProducts( data );
		}else{
			var html = getLocationProducts( data );
		}
		// console.log( 'product from db:' )
		// console.log( data )
		Session.set('PROIDUPDATE', data);
		return html;
		

	},
	getParentCat: function(){
		return categories.find({parent:" "});
	},
	Ischecked:function(id){
		//console.log("MYCAT_ID="+id);
		var result = categories.find({_id:id}).count();
		//console.log("MYCAT_NUM="+result);
		if(result > 0) return 'checked';
		else return;
	}
});
Template.manageLocation.events({
	'click #remove':function(e){
		e.preventDefault();
		var id = this._id;
		if(confirm("Are you sure that you want to delete this?")){
			Meteor.call('deleteLocation', id);
		}
	},
	'click .updateorder':function(e){
		e.preventDefault();
		var id = $(e.currentTarget).attr('data-id');
		var ordernum = $(e.currentTarget).val();

		Meteor.call('updateOrderNum', id, ordernum, function(err, data){
			if(err) Bert.alert('Order can not update!', 'danger', 'growl-bottom-right');
			else Bert.alert('Order has been updated!', 'success', 'growl-bottom-right');
		});
	},
	'change .updateorder': function(e){
		var id = $(e.currentTarget).attr('data-id');
		var value = $(e.currentTarget).val();
		if( value !="" && IsNumeric(value) ){
			order = parseInt(value);
			Meteor.call('updateOrderNum', id, order,function(err, respond){
				if(!err) Bert.alert('Order is successfully updated!', 'success', 'growl-bottom-right');
			})
		}else{
			Bert.alert('Order Number is invalid!', 'danger', 'growl-bottom-right');
		}
	},
	'change .selecttype': function(e){
		var type = $(e.currentTarget).val();
		Session.set('CHOOSETYPE',type);
	},
	'change .selectpage': function(e){
		var page = $(e.currentTarget).val();
		Session.set('CHOOSEPAGE',page);
	}
});
Session.set('CHOOSETYPE','');
Session.set('CHOOSEPAGE','');
Template.manageLocation.helpers({
	getLocation:function(){
		var type = Session.get('CHOOSETYPE');
		var page = Session.get('CHOOSEPAGE');
		if( type !="" && page == "")
			var loc = locations.find({type:type},{sort:{order:1}});
		else if( type !="" && page != "")
			var loc = locations.find({type:type, page:page},{sort:{order:1}});
		else
			var loc = locations.find({},{sort:{order:1}});

		return loc;
	}
});
Session.set('PROID','');
Template.addLocation.helpers({
	listpro : function(){
		var data = Session.get('PROID');
		return getLocationProducts( data );

	},
	getParentCat: function(){
		return categories.find({parent:" "});
	}
});
Template.addLocation.events({
	'click #btnAdd':function(){
		var name = $('#name').val();
		var image = Session.get('IMAGELOCATION');
		var link = $('#link').val();
		var order = parseInt($('#order').val());
		var productid = Session.get('PROID');
		var type = $('#type').val();
		var page = $('#page').val();
		var position = $('#position').val();
		var catlist = [];
		$('.listcategory input').each( function(){
			if( this.checked ){
				catlist.push($(this).val());
			}
		})
		

		if( name =='' || type==''){
			Bert.alert('Name or Type is require!', 'danger', 'growl-bottom-right');
		}else{
			var obj = {
				name:name,
				image_id:image,
				link:link,
				type:type,
				page:page,
				categoryId:catlist,
				position:position,
				productid:productid,
				order:order,
				date:getTimestamp()
			}
			Meteor.call('addLocation',obj,function(err){
				if(err)
					console.log("Error location: "+err.reason);
				else{
					Bert.alert('Save successfully!', 'success', 'growl-bottom-right');
					Router.go('/admin/location');
					Session.set('IMAGELOCATION',undefined);
					Session.set('TYPE',undefined);
				}
			});
		}
	},
	'change #image':function(e){
		e.preventDefault();
	    var files = e.target.files;
	    for (var i = 0, ln = files.length; i < ln; i++) {
	      	images.insert(files[i], function (err, fileObj) {
		      	Session.set('IMAGELOCATION',fileObj._id);
	  		});
    	}
	},
	'click #addProduct': function(){
		var product = $('#product').attr('data-id');
		if( product != ''){
			var proid = [];
			if( Session.get('PROID') ){
				var data = Session.get('PROID');
				data.push(product);
				proid = data;
			}else{
				proid.push( product );
			}
			$('#product').removeAttr('data-id');
			$('#product').val('');
			Session.set('PROID', proid);
		}else{
			Bert.alert('Product is require!', 'danger', 'growl-bottom-right');
		}
	},
	'keyup #product': function(e){
		var key = $(e.currentTarget).val();
		if( key.length > 3){
			var data = products.find({ "title": { $regex: new RegExp(key, "i") } });
			var text = '';
			if( data.count() > 0){
				data.forEach( function(data, index){
					text += '<li data-id="'+data._id+'" class="listpro">'+data.title+'</li>';
				})	
			}
			if( text!='')
				$('#result').html( '<div style="border:1px solid #ddd;padding:5px">'+text+'</div>' );
			else
				$('#result').html( '<li>No result.</li>' );
		}
	},
	'click .listpro': function(e){
		var title = $(e.currentTarget).html();
		var id = $(e.currentTarget).attr('data-id');
		$('#product').val(title);
		$('#product').attr('data-id', id);
		$('#result').html('');

	},
	'change #type': function(e){
		var type = $(e.currentTarget).val();
		if( type == 'Deal'){
			$('#image').parents('.form-group').hide();
			$('#link').parents('.form-group').hide();
			$('#order').parents('.form-group').hide();
			$('#position').parents('.form-group').hide();
			$('#product').parents('.form-group').show();
		}else if( type =='Quicklinks' || type =='Lifestyle'){
			$('#image').parents('.form-group').show();
			$('#link').parents('.form-group').show();
			$('#catVal').parents('.form-group').hide();
			$('#order').parents('.form-group').hide();
			$('#position').parents('.form-group').hide();
			$('#product').parents('.form-group').hide();
		}else if(type == 'News'){
			$('#image').parents('.form-group').show();
			$('#link').parents('.form-group').show();
			$('#catVal').parents('.form-group').show();
			$('#position').parents('.form-group').show();
			$('#order').parents('.form-group').show();
			$('#product').parents('.form-group').show();
		}else{
			$('#position').parents('.form-group').hide();
			$('#order').parents('.form-group').hide();
			$('#product').parents('.form-group').hide();
		}
	},
	'change #page': function(e){
		var page = $(e.currentTarget).val();
		if( page == 'category'){
			$('#catVal').parents('.form-group').show();
		}else{
			$('#catVal').parents('.form-group').hide();
		}
	},
	'click .remove': function(e){
		var removeid = $(e.currentTarget).attr('pro-id');
		var proid = [];
		if( Session.get('PROID') ){
			var data = Session.get('PROID');
			var index = data.indexOf(removeid);
			if (index > -1) 
				data.splice(index, 1);
			proid = data;
		}
		Session.set('PROID', proid);
		//console.log(proid);
	}
});