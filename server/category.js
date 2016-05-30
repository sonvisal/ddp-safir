Meteor.methods({
	// add categories
	addCat: function(title,description, parent, image) {
		var attributes={
			title:title,
			description:description,
			parent:parent,
			image:image,
		};
		categories.insert(attributes);
		//console.log("Inserted");
	},
	updateCat: function(id,attr) {
		categories.update({_id:id},{$set: attr});
	},
	updateImgCat:function(id,imageid){
		categories.update({_id:id},{$set:{bannercat:imageid}});
	},
	deleteCategory: function(id){
		categories.remove(id);
	},
	getChildrenList: function(elt){
		
		var finalList=[];
		var current=categories.find({"parent":elt}).fetch();
		//console.log('finding parent of: '+elt);
		for(var i=0;i<current.length;i++){
			finalList.push(current[i]._id);
			//console.log('finaList:'+finalList);
			var listchildren=Meteor.call('getChildrenList',current[i]._id);
			//console.log('listChild:'+listchildren);
			for(var j=0;j<listchildren.length;j++){
				finalList.push(listchildren[i]);
			}
		}
		return finalList;
	}, 
	insertbannercate:function(obj){
  	
    categories.insert(obj);
  },
 /* updateBanner:function(id,obj){
    categories.update({_id:id},{$set:obj});
  }*/
  allbrandsPage:function(){
  	/*var mybrands = [];
    var brandlist = products.find({},{sort:{Brand:1}}).fetch();
    //console.log("all brand "+brandlist);
    for (var i = 0; i < brandlist.length; i++) {
        if (brandlist[i].hasOwnProperty('Brand')) {
            var first = brandlist[i].Brand;
            //console.log("brand only "+first);
            mybrands.push(first);
        }
    }
    function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
	}
	var unique = mybrands.filter( onlyUnique );
	var arraySort=unique.sort();
	var arrayb=[];
	var html='';
	
	for(var j=0;j<arraySort.length;j++){
		if(arraySort[j]!=='Tester'){
			if(j%20==0){
				if(j>0){
					html+='</div>'
				}
				html+='<div class="col-md-3">';
				html+='<li><a href="/brand/'+arraySort[j]+'" id="searchbrand" data-brand="'+arraySort[j]+'" class="menuclick brandtosearch">'+arraySort[j]+'</a></li>';

			}else{
				html+='<li><a href="/brand/'+arraySort[j]+'" id="searchbrand" data-brand="'+arraySort[j]+'" class="menuclick brandtosearch">'+arraySort[j]+'</a></li>';
			}
			
		}
		
	}
    return html;*/
 		
        var mybrands = [];
         var liste = products.find({}).fetch();
         //console.log("Count:" + liste.length);
         for (var i = 0; i < liste.length; i++) {
             if (liste[i].hasOwnProperty('Brand')) {
                 if(mybrands.indexOf(liste[i].Brand)<0)
                 	mybrands.push(liste[i].Brand);
             }

         }
      
   //      //console.log('Num:', mybrands.length);
         return mybrands;
  },
  allbrands:function(){
  	var mybrands = [];
    var brandlist = products.find({},{sort:{Brand:1}}).fetch();
    //console.log("all brand "+brandlist);
    for (var i = 0; i < brandlist.length; i++) {
        if (brandlist[i].hasOwnProperty('Brand')) {
            var first = brandlist[i].Brand;
            //console.log("brand only "+first);
            mybrands.push(first);
        }
    }
    function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
	}
	var unique = mybrands.filter( onlyUnique );
	var arraySort=unique.sort();
	var arrayb=[];
	var html='';
	
	for(var j=0;j<arraySort.length;j++){
		if(arraySort[j]!=='Tester'){
			if(j%20==0){
				if(j>0){
					html+='</div>'
				}
				html+='<div class="col-md-3">';
				html+='<li><a href="/brand/'+arraySort[j]+'" id="searchbrand" data-brand="'+arraySort[j]+'" class="menuclick brandtosearch">'+arraySort[j]+'</a></li>';

			}else{
				html+='<li><a href="/brand/'+arraySort[j]+'" id="searchbrand" data-brand="'+arraySort[j]+'" class="menuclick brandtosearch">'+arraySort[j]+'</a></li>';
			}
			
		}
		
	}
    return html;
 		// var letter = value.toUpperCase();
   //      var mybrands = [];
   //      var liste = products.find({}).fetch();
   //      //console.log("Count:" + liste.length);
   //      for (var i = 0; i < liste.length; i++) {
   //          if (liste[i].hasOwnProperty('Brand')) {
   //              var first = liste[i].Brand;
   //              if (first != '' && first.toUpperCase().substr(0, 1) == letter && mybrands.indexOf(first) == -1 && first!=='Tester')
   //                  mybrands.push(first);
   //          }

   //      }
      
   //      //console.log('Num:', mybrands.length);
   //      return mybrands;
  }

});

//a
// b c