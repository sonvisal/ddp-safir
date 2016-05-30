
Meteor.methods({
	//add products
	getAttributeFromProduct: function(oldId){
		//console.log("LOOKING FOR "+oldId);
		//oldId=String(oldId);
		//console.log('NB RESULT='+attribute.find({product:oldId}).fetch().length);
		//console.log("LOOKING FOR "+oldId);
		//oldId=String(oldId);
		//console.log('NB RESULT='+attribute.find({product:oldId}).fetch().length);
		return {product:oldId,
				list:attribute.find({product:oldId}).fetch()};
	},
	addPro: function(prod){
		//console.log(JSON.stringify(prod));

		var attributes={ 
				oldId		:prod.oldId,
				price		:prod.price,
				attrImage   :prod.attrImage,
				title		:prod.title,
				description	:prod.description,
				image		:prod.image,
				Brand		:prod.brand,
				CODE		:123,
				metaTitle	:prod.description,
				metaKeyword	:prod.description,
				point		:prod.point,
				ratio		:prod.ratio,
				status		:prod.status,
				category	:prod.category,
				priority	:prod.priority,
				shop		:prod.shop,
				date		:prod.date,
				tags        :prod.tags,
				articles	:prod.articles,
				tutoes      :prod.tutoes,
				video       :prod.video,
            	videoUrl    :prod.videoUrl
		};
		var productId=products.insert(attributes);

		//console.log('Attribute:'+prod.attr.length);
		for(var i=0;i<prod.attr.length;i++){
			//console.log('Inserting '+JSON.stringify(prod.attr[i]));
			var obj={
				product: prod.oldId,
				parent: prod.attr[i].parent,
				price: prod.attr[i].price,
				point: prod.attr[i].point,
				value: prod.attr[i].value,
				barcode:prod.attr[i].barcode,
				productImage:prod.attr[i].productImage
			};
			attribute.insert(obj);
		}

		//console.log("Inserted");
		return productId;
	},

	updateProduct: function(id,prod){
		//console.log(JSON.stringify(prod));
		var attributes={
				//_id			:prod._id,
				oldId		:prod.oldId,
				price		:prod.price,
				attrImage   :prod.attrImage,
				title		:prod.title,
				description	:prod.description,
				image		:prod.image,
				Brand		:prod.brand,
				CODE		:123,
				metaTitle	:prod.description,
				metaKeyword	:prod.description,
				point		:prod.point,
				ratio		:prod.ratio,
				status		:prod.status,
				category	:prod.category,
				priority	:prod.priority,
				shop		:prod.shop,
				date		:prod.date,
				tags        :prod.tags,
				articles	:prod.articles,
				tutoes      :prod.tutoes,
				video       :prod.video,
            	videoUrl    :prod.videoUrl
		};

		var productId=products.update({"_id":prod._id},{$set :attributes});
		

	},
	deletePro: function(id){
		products.remove(id);
	},
	//publish 
	publishPro: function(id, attr){
		products.update({_id:id},{$set: attr});
	},
	//unpublish 
	unpublishPro: function(id, attr){
		products.update({_id:id},{$set: attr});
	},
	add_review: function(title,comment,grade,userid,productid){
		var date=new Date();
		var attr={
			'title':title,
			'comment':comment,
			'grade':grade,
			'userid':userid,
			'date':date
		};
		//console.log('Adding this review '+JSON.stringify(attr));
		products.update({_id:productid},{ $push: { review: attr } });

	},
	getPath: function(){
		return process.env.PWD;
	},
	addlistPro:function(obj){
		return list_product.insert(obj);
	},
	insertAddress:function(id,obj){
		users.update({_id:id}, {$set:obj});
	},
	insertTradeDetail:function(obj){
		translation.insert(obj);
	},
	addPointdetails:function(userid,obj){
  		Meteor.users.update({_id:userid}, {$set:obj});
    },
    clearcomment:function(){
    	var arr=[];
    	var result=products.find();
    	result.forEach(function(value){
    		//arr.push(value._id);
    		products.update({_id:value._id},{$unset:{review:""}})
    	});
    },
    clearorder:function(){
    	order.remove({});
    },
    clearCommentContent:function(){
    	var arr=[];
    	var result=contents.find();
    	result.forEach(function(value){
    		//arr.push(value._id);
    		contents.update({_id:value._id},{$unset:{review:""}})
    	});
    },
    getAttrPrice:function(oldId){
    	return attribute.findOne({ product:oldId});
    },
    updateListpro:function(id,arrayid){
    	list_product.update({_id:id},{$pull:{products:arrayid}});
    
    },
    updateList_pro:function(id,obj){
    	list_product.update({_id:id},{$set:obj});
    },
    commentDetail:function(){
    	var arr=[];
    	var array=[];
    	var userid = Meteor.userId();
    	var userComment = products.find({"review.user":userid});
    	if(userComment){
	    	userComment.forEach(function(value){
	    		for(var i=0;i<value.review.length;i++){
	    			if(value.review[i].user==userid){
	    				arr.push(value.review[i].user);
	    			}
	    			
	    		}
	    	});
	    	
	    	//console.log('myuser==='+arr.length);
	    	return arr.length;
	    }else{
	    	return 1;
	    }
    },
    checkImgExist: function( path, id_product ){

	    fs = Meteor.npmRequire('fs');
	    fullpath=process.env.PWD;
	    if( typeof fullpath == 'undefined' ){
	        base_path = fs.realpathSync( process.cwd() + '../../../../../../' );
	    }else{
	        base_path=fullpath;
	    }
	    var image_path  = base_path+'/upload/'+path;
	    console.log('checking '+ fs.existsSync(image_path));
    	if(fs.existsSync(image_path) === true)
    		return {id_product:id_product, status:1}
    	else
    		return {id_product:id_product, status:0}

    },
    getImgPath: function( id ){

	    var img=images.findOne({_id:id});
    	if(img)
    		return {id:id, path:img.copies.images.key}
    	else
    		return {id:id, path:-1}

    },
    getAllBrandsByAlphabet: function(cats, alphabet){
    	if( cats != 'undefined' ){
	        var list_categories = getListCategoryByParent( cats );
	        //console.log('Alpha:', alphabet);
	        letter = alphabet.toUpperCase();
	        var mybrands = [];
	        var liste = products.find({category:{$in:list_categories}}).fetch();
	        //console.log("Count:" + liste.length);
	        for (var i = 0; i < liste.length; i++) {
	            if (liste[i].hasOwnProperty('Brand')) {
	                var first = liste[i].Brand;
	                if (first != '' && first.toUpperCase().substr(0, 1) == letter && mybrands.indexOf(first) == -1)
	                    mybrands.push(first);
	            }

	        }
	      
	        //console.log('Num:', mybrands.length);
	        return mybrands;

	    }
   	},
   	getAllBrands: function( cats ){
   		if( cats != 'undefined' ){
	        var list_categories = getListCategoryByParent( cats );
	        var liste = products.find({category:{$in:list_categories}},{fields:{Brand:1}}).fetch();
	        return liste;
	    }
   	},
    getResult: function(catId){
    	//console.log( 'Array cat:', catId );
    	return products.find({ "category": { $in: catId} }).count();
    },
    /*getAttributeByID: function( id_product ){
    	var pro = products.findOne({_id:id_product});
    	var attrlist = [];
    	if( pro ){
            //pro.forEach( function(data, index){
                var attr = attribute.find({product: pro.oldId}).fetch();
                if( attr.length > 0){
                    for( i=0; i < attr.length; i++){
                        attrlist.push(attr[i]._id);
                    }
                }
            //})
            var dataattr = attribute.find({_id:{$in:attrlist}});
            console.log('attribute:'+id_product+':', dataattr.count());
            return {id_product:id_product, attr:dataattr};
        }else return;

    }*/
    getAllTagByCat:function( list_categories ){
    	if( list_categories.length > 0){
    		
    		//var list_categories = getArrayIdCateByParent(cats);
    		var list = tags.find({categoryId:{$in:list_categories}},{fields:{_id:1, title:1,"i18n.en.title":1}}).fetch();

    		/*for( var i =0 ; i<list.length ; i++ ){
    			if( list[i].hasOwnProperty('tags') && list[i].tags.length > 0){
    				for( var j=0 ; j<list[i].tags.length ; j++){
    					if(listTag.indexOf(list[i].tags[j].value) == -1){
    						listTag.push({_id:list[i].tags[j]._id, value:list[i].tags[j].value});
    					}
    					
    				}
    			}
    		}*/

    		return list;
    	}
    }
});
getListCategoryByParent = function( cats ){
	var list_categories = [];
    list_categories.push(cats._id);
    var lvl1 = categories.find({ "parent": cats._id}).fetch();
    for (var i = 0; i < lvl1.length; i++) {
        var cur1 = lvl1[i]._id;
        list_categories.push(cur1);
        var lvl2 = categories.find({ "parent": cur1 }).fetch();
        for (var j = 0; j < lvl2.length; j++) {
            var cur2 = lvl2[j]._id;
            list_categories.push(cur2);
            var lvl3 = categories.find({ "parent": cur2 }).fetch();
            for (var k = 0; k < lvl3.length; k++) {
                var cur3 = lvl3[k]._id;
                list_categories.push(cur3);
                var lvl4 = categories.find({ "parent": cur3 }).fetch();
                for (var l = 0; l < lvl4.length; l++) {
                    var cur4 = lvl4[l]._id;
                    list_categories.push(cur4);
                }
            }
        }
    }
    return list_categories;
}