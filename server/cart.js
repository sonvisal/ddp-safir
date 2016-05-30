Meteor.methods({
	addtocart: function(obj){
		//console.log('start');
		var ipAddress=this.connection.clientAddress;
		//console.log("IP ADDRESS:"+ipAddress);
		obj.ip_address=ipAddress;
		//console.log('INSERTING '+JSON.stringify(obj));
		cart.insert(obj);
	},
	removemycart: function(id){
		cart.remove(id);
	},
	updateCart: function(id,qty,subtotal){
		cart.update(id, {$set: {quantity: qty, subtotal:subtotal}});
	},
	updateStatus:function(id,obj){
		cart.update({_id:id},{$set:obj});
	},
	
	updateCartStatus:function(id){
		cart.update({_id:id},{$set:{order_status:1}});
	},
	changeQty:function(attr,proId){
		if(attr){
			return attribute.findOne({_id:attr}).price;
		}else{
			return products.findOne({_id:proId}).price;
		}
	},
	getAtrByParentt:function(attr){
		var myAttr=attribute.findOne({_id:attr});
		if(myAttr || myAttr!=='undefine'){
			var MyParentId = myAttr.parent;
			return parentattr.findOne({_id:MyParentId}).name;
		}else return ''; 
	},
	getAttrValueById:function(attr){
		var myAttr=attribute.findOne({_id:attr});
		if(myAttr){
			return myAttr.value;
		}
	},
	getImgAttrById:function(attr,proId){
		var myAttr=attribute.findOne({_id:attr});
		if(myAttr || myAttr!=="undefine"){
			return myAttr.productImage;
		}else{
			var mypro= products.findOne({_id:productImage});
            if(mypro.image instanceof Array){
               var id= pro.image[0]; 
            }
            else{
               var id= pro.image; 
            }
            return id;

		}
	},
	getProductInfo: function( item_id ){
		var data =  products.findOne({_id:item_id});
		return {item_id:item_id, result: data}
	}
});