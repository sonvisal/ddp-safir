
Meteor.methods({
	addnewsletter: function(obj){
		return newsletter.insert(obj);
	},
	earnPoinInviteFriends:function(email){
		var count=0;
		var result=imedation.findOne({email_imedate:email});
		if(result && result!='undefined'){
			var user=Meteor.users.findOne({_id:result.user_id});
			if(user.profile.hasOwnProperty('numberinvite')){
			var numberinvite=user.profile.numberinvite;
			}else{
				var numberinvite=count;
			}
			count=numberinvite+1;
			Meteor.users.update({_id:result.user_id},{$set:{'profile.numberinvite':count}});
			return {count:count,userId:result.user_id,point:user.profile.shipcard.point};
		}
		
		
	},
	/*
	Function send email order products  
	*/
	sendMyManDrillEmail: function(){
    	var userId = 'zqhWspSva44HdmvW2'; //Meteor.userId()
    	var orderId = 'bfgCTrLMSk9pbcmeF';
    	var items = getOrderItemsByID( userId, orderId);
    	var myuser = Meteor.users.findOne({_id:userId});
    	var email = myuser.emails[0].address;
    	var firstname = myuser.profile.firstname;
    	var lastname = myuser.profile.lastname;
    	var address = ( items.address != '' )? items.address: myuser.profile.address; 
    	var paymentcon = 'NA';
	    Mandrill.messages.sendTemplate({
	        "template_name": 'safirtemplate',
	        "template_content": [
	          {
	          	name: "body",
	          	content: "Seyha Chroeng"
	          }
	        ],
	        message: {
        		subject: 'Meteor Newsletter',
			    from_email: "contact@safirperfumery.com",
			    to: [
			        { email: email }
			    ],
			    global_merge_vars: [
			        {

			            "name": "products",
			            "content": items
			        },
			        {
			        	"name":"customerName",
			        	"content":firstname+ " "+ lastname
			        },
			        {
			        	"name": "address",
			        	"content": address 
			        }
			    ]
			}
		});
	}
});
//Function get image in Sending Email
getImgByID = function( imgid ){
	var img = images.findOne({_id:imgid});
	if( img !='undefined' && img != null ) return escape(img.copies.images.key);
	else return null;
}
//Function get Attribute in Sending Email
getParentAttrByID = function( parentId ){
	return parentattr.findOne({_id:parentId});
}
//Function List Items in mail 
getOrderItemsByID = function(userId, orderId){
	var myorder = order.findOne({orderId:orderId});
	if( myorder ){
		var items = myorder.items;
		var myitems = [];
		if( items.length >0 ){
			for(i=0; i < items.length; i++){
				var myproduct = products.findOne({_id: items[i].id_product});
				var myattr = attribute.findOne({_id:items[i].attribute});

				var src = '';
				var absoluteurl = Meteor.absoluteUrl();
				var baseurl = ( absoluteurl == 'http://localhost:3000/')? 'http://54.169.80.2/upload/': absoluteurl+'uploads/';
				if( myattr.productImage != 'undefined'){
					var parentvalu = getParentAttrByID( myattr.parent);
					var parentName = ( parentvalu != 'undefined')? parentvalu.name:''; 
					var myimage = getImgByID( myattr.productImage );
					if( myimage ){
						src = baseurl+myimage; //absoluteurl+'uploads/'+myimage;
					}else{
						src = myattr.productImage;
					}
				}else{
					var myproductimg = getImgByID( myproduct.image[0] );
					if( myproductimg ){
						src = 'http://54.169.80.2/upload/'+myproductimg;
					}else{
						src = myproduct.image[0];
					}
				}
				var obj = {
		            "img": src,
		            "qty": items[i].qty,
		            "name": myproduct.title,
		            "attr": myattr.value,
		            "parentattr": parentName,
		            "price": myattr.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
		            "subtotal": items[i].subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		        	}
				myitems.push(obj);
			}
			var total = myorder.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return {total:total, items:myitems, address:myorder.address[0]};
		}
		else return;
	}
}

