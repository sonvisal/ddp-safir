Meteor.publish('attribute', function(userid) {
    var arr=[];
    var fav=favorite.find({userId:userid});
    fav.forEach(function(v){
        var pros=products.findOne({_id:v.proId});
        if(pros && pros.oldId){
            var attr=attribute.find({product:pros.oldId});
            attr.forEach(function(val){
                arr.push(val._id);
        });
        }
        
    });
    return attribute.find({_id:{$in:arr}});
});
/*Meteor.publish('attribute', function(userid) {
    var arr=[];
    var fav=favorite.find({userId:userid});
    fav.forEach(function(v){
        var pros=products.findOne({_id:v.proId});
        if(pros.oldId!==undefined){
            var attr=attribute.find({product:pros.oldId});
            attr.forEach(function(val){
            arr.push(val._id);
            });
        }
    });
    return attribute.find({_id:{$in:arr}});
});*/

Meteor.publish('parentattr', function() {
  return parentattr.find({});
});


Meteor.publish('attrhome', function() {
    var arrAttr = [];
    var loc = locations.find({ page: "home" });
    loc.forEach(function(value) {
            var product = value.productid;
            for (var i = 0; i < product.length; i++) {
                //arrlocpro.push(product[i]);
                var oldId = products.findOne({ _id: product[i] }).oldId;
                var attr = attribute.find({ product: oldId }).fetch();
                if (attr.length>0) {
                    arrAttr.push(attr[0]._id);
                }
                /*attr.forEach(function(val){
                    arrAttr.push(val._id);
                })*/
            }
        })
        //console.log('ATTRID===='+arrAttr);
    return attribute.find({ _id: { $in: arrAttr } });
});

Meteor.publish('productCheckout', function(userid){
    var allid=[];
    var attrId=[];
    var proCheckId = cart.find({userId:userid}).fetch();
    for(var i=0;i<proCheckId.length;i++){
        allid.push(proCheckId[i].id_product);
        attrId.push(proCheckId[i].attribute);
    }
    var proData =  products.find({_id:{$in:allid}});
    var attrData = attribute.find({_id:{$in:attrId}});
    return [proData,attrData ]; 
});

Meteor.publish('productFavorite', function() {
  var arr=[];
  var result=favorite.find();
  result.forEach(function(value){
    arr.push(value.proId);
  });

  return products.find({_id:{$in:arr}});
});

Meteor.publish('attrlistproduct', function(name, limitproduct) {
    //=====define function select category by parent======
    var results = [];
    var mapChildren = function(cate) {
        results.push(cate._id);
        var children = categories.find({ parent: cate._id });
        children.forEach(function(item) {
            mapChildren(item);
        });
    };

    var l = categories.findOne({ "title": name });
    if (typeof l == 'undefined') {
        var title = name;
        //title = title.replace(/\-/g, " ");
        title = title.replace(/\(percentag\)/g, "%");
        title = title.replace(/\(plush\)/g, "+");
        title = title.replace(/\(ocir\)/g, "ô");
        title = title.replace(/\(minus\)/g, "-");
        title = title.replace(/\(copyright\)/g, "®");
        title = title.replace(/\(number\)/g, "°");
        title = title.replace(/\(bigocir\)/g, "Ô");
        title = title.replace(/\(square\)/g, "²");
        title = title.replace(/\(accentaigu\)/g, "`");
        title = title.replace(/\(eaccentaigu\)/g, "é");
        title = title.replace(/\(bigeaccentaigu\)/g, "É");
        title = title.replace(/\(and\)/g, "&");
        title = title.replace(/\(slash\)/g, "/");
        title = title.replace(/\(apostrophe\)/g, "’");
        title = title.replace(/\(quote\)/g, "'");
        title = title.replace(/\(warning\)/g, "!");
        title = title.replace(/\(question\)/g, "?");
        title = title.replace(/\(dolla\)/g, "$");
        title = title.replace(/\(eaccentgrave\)/g, "è");
        title = title.replace(/\(hyphen\)/g, "–");
        var l = categories.findOne({ "i18n.en.title": title });
    }
    
    var data = categories.find({ parent: l.parent });
    
    data.forEach(function(item) {

        mapChildren(item);
    });

    //console.log('cateID========='+results);
    var arr = [];
    var product = products.find({ category: { $in: results } }).fetch();
    var list = [];
    product.forEach(function(value, index){
        if( index < limitproduct){
            list.push(value.oldId);
        }
    });
    if (list.length > 0) {
        for (k = 0; k < list.length; k++) {
            var attr = attribute.find({ product: list[k] }).fetch();
            if (attr.length > 0) {
                for(var j=0;j<attr.length;j++){
                   arr.push(attr[j]._id); 
                }
                
            }
        }
    }
    return attribute.find({ _id: { $in: arr } });

});
Meteor.publish('attradvace', function(list_tags,list_categories,list_brand) {
    if (list_tags > 0) {
        var pro = products.find({ $and: [{ category: { $in: list_categories } }, { Brand: { $in: list_brand } }, { "tags.value": { $in: list_tags } }] });
        var arrLp = [];
        pro.forEach(function(l) {
            if (l.oldId) {
                arrLp = arrLp.concat(l.oldId);
            }
        });
        return attribute.find({ product: { $in: arrLp } });
    } else {
        var pro = products.find({ $and: [{ category: { $in: list_categories } }, { Brand: { $in: list_brand } }] });
        var arrLp = [];
        pro.forEach(function(l) {
            if (l.oldId) {
                arrLp = arrLp.concat(l.oldId);
            }
        });
        return attribute.find({ product: { $in: arrLp } });
    }
    // return attribute.find();
});
Meteor.publish('productsSearch', function(keyword, groupid) {

    if (keyword != "") {
        if (groupid == 1) {
            return products.find({ $or: [{ $and: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }, { $and: [{ description: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }] });
        } else if (groupid != 5 && groupid != 4) {
            return products.find({ $or: [{ $and: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }, { tag_quizz: { $regex: new RegExp(keyword, "i") } }, { "tags.value": { $regex: new RegExp(keyword, "i") } }, { $and: [{ description: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }] });
        }
    }
});
Meteor.publish('contentsSearch', function(keyword, groupid) {
    if (keyword != "") {
        if (groupid == 4) {
            var webzine = contents_type.findOne({ type: "Webzine" });
            return contents.find({ $or: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }, { content: { $regex: new RegExp(keyword, "i") } }], typeid: webzine._id });
            Session.set("searchall", "");
        } else if (groupid == 5) {
            var tuto = contents_type.findOne({ type: "Tuto" });
            return contents.find({ $or: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }, { content: { $regex: new RegExp(keyword, "i") } }], typeid: tuto._id });
        } else if (groupid != 5 && groupid != 4) {
            return contents.find({ $or: [{ title: { $regex: new RegExp(keyword, "i") } }, { tag_quizz: { $regex: new RegExp(keyword, "i") } }, { "tags.value": { $regex: new RegExp(keyword, "i") } }, { content: { $regex: new RegExp(keyword, "i") } }] });
        }
    }
});
Meteor.publish('attrsearch', function(keyword, groupid) {
    if (keyword != "") {
        if (groupid == 1) {
            var pro = products.find({ $or: [{ $and: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }, { $and: [{ description: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }] });
            // var lp = products.find({ category: { $in: finalList } });
            var arrLp = [];
            pro.forEach(function(l) {
                if (l.oldId) {
                    arrLp = arrLp.concat(l.oldId);
                }
            });
            return attribute.find({ product: { $in: arrLp } });
        } else if (groupid != 5 && groupid != 4) {
            var pro = products.find({ $or: [{ $and: [{ title: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }, { tag_quizz: { $regex: new RegExp(keyword, "i") } }, { "tags.value": { $regex: new RegExp(keyword, "i") } }, { $and: [{ description: { $regex: new RegExp(keyword, "i") } }, { category: { $ne: 'tester' } }] }] });
            var arrLp = [];
            pro.forEach(function(l) {
                if (l.oldId) {
                    arrLp = arrLp.concat(l.oldId);
                }
            });
            return attribute.find({ product: { $in: arrLp } });
        }
    }
    // return attribute.find({});
});
Meteor.publish('attrdetail', function(title) {
    var arrayAttr = [];
    var myArray = [];
    var resultRandom = [];
    var p = products.findOne({ "title": title });
    var result = products.find({ category: p.category });
    result.forEach(function(val) {
        var attr = attribute.find({ product: val.oldId });
        attr.forEach(function(v) {
            arrayAttr.push(v._id);
        })
    })
    return attribute.find({ _id: { $in: arrayAttr } });
});

/*TAPi18n.publish("productsrewards", function() { ////console.log('categories:'+categories.find({}).fetch().length);
    return products.i18nFind({ "category": "tester" });
});*/

/*News related*/
Meteor.publish('productsrewards', function() {
    function makaraRendomArray(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
    var myArray = [];
    var resultRandom = [];
    var result = products.find({ "category": "tester" });
    result.forEach(function(value) {
        myArray.push(value._id);
    });
    var arrayRandom = makaraRendomArray(myArray);
    for (var ran = 0; ran < 4; ran++) {
        if (arrayRandom[ran]) {
            resultRandom.push(arrayRandom[ran]);
        }
    }
    //console.log('sreyden=' + resultRandom);
    return products.find({ _id: { $in: resultRandom } });

});
TAPi18n.publish("categories", function() {
    return categories.i18nFind({});
});
Meteor.publish('publishBrandsByAlphabet', function( cats, alphabet ) {
    if( cats != 'undefined' ){
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
        //console.log('Alpha:', alphabet);
        letter = alphabet.toUpperCase();
        var ID = [];
        var liste = products.find({category:{$in:list_categories}}).fetch();
        //console.log("Count:" + liste.length);
        for (var i = 0; i < liste.length; i++) {
            if (liste[i].hasOwnProperty('Brand')) {
                var first = liste[i].Brand;
                if (first != '' && first.toUpperCase().substr(0, 1) == letter && ID.indexOf(first) == -1)
                    ID.push(liste[i]._id);
            }

        }
        var list = products.find({_id:{$in:ID}});
        //console.log('Num:', list.fetch().length);
        return list;

    }
});
Meteor.publish('advanceSearchTags', function( cats ) {
    if( cats ){
        var list_categories = [];
        list_categories.push(cats._id);
        var lvl1 = categories.find({ "parent": cats._id }).fetch();
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
    }else{
        var catlist = categories.find().fetch();
        for(i=0; i< catlist.length; i++){
            list_categories.push(catlist[i]._id);
        }
        
    }
    //console.log('cat len:', list_categories.length);

    var listparent = parent_tags.find({ categoryId: { $in: list_categories } });
    var listPRID = [];
    var listID = [];

    if( listparent.count() >0 ){
        listparent.forEach( function(data, index){
            
            var result = tags.find({parent: data._id}).fetch();
            if( result.length > 0 && data.title != '') {
                // console.log('title:', data.title);
                // console.log('len:', data.title);
                listPRID.push( data._id);
                for(i=0; i< result.length; i++){
                    listID.push(result[i]._id);
                }
            }
        })
         // console.log('parent tag len:', listPRID.length);
         // console.log('children tag len:', listID.length);
        //console.log('List ID:', listID);
        var parent= parent_tags.find({_id:{$in:listPRID}});
        var child = tags.find({_id:{$in:listID}});
        // console.log("all parent:", parent.fetch().length)
        // console.log("all child:", child.fetch().length)
        return [parent, child];
    }
})

Meteor.publish('advanceSearch', function(limit, cats, brands, tags, max_price) {
    if (limit != -1) {
        return products.find({}, { limit: limit });
    } else {
        var result = getProductList(cats, brands, tags, max_price);
        //console.log('Count:', result.count());
        /*var listID = [];
        if( result.count() > 0){
            result.forEach( function(data, index){
                listID.push(data._id);
            });
        }
        console.log('List ID:', listID.length);*/
        //console.log('List ID:', listID);
        return result;
    }
});
/*
Meteor.publish('refineAttribute', function(limit, cats, brands, tags) {
    if (limit != -1) {
        return products.find({}, { limit: limit });
    } else {
       
        var result = getProductList(cats, brands, tags);
        var listattr = [];
        if( result.count() > 0){
            result.forEach( function(data, index){
                var attr = attribute.find({product:data.oldId}).fetch();
                if( attr.length > 0){
                    listattr.push(attr[0])
                }
            })

        }
         return attribute.find({_id:{$in:listattr}});
    }
});*/
getProductList = function( cats, brands, tags, max_price){
    var list_categories = [];
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
      
        brands = brands.split(";");
        tags = tags.split(";");
        brands = brands.filter(function(n){ return n != "" }); 
        tags = tags.filter(function(n){ return n != "" });
        var maxPrice = max_price.toString();

        if( brands.length > 0 && tags.length <= 0){
            //find by brands list
            //var result = products.find({ $and: [{ category: { $in: list_categories } }, { Brand: { $in: [brands] } }] });
            var result = products.find({ category: { $in:  list_categories }, Brand:{ $in:brands}, price:{$lte:maxPrice} })
            //var result = products.find({ category: { $in:  [ 'eSQn6gJnXNrd4W9WW', 'gZRuiAjyXTfcHYZ9t', 'vxvyWfDBSpcTdJyfE' ] }, Brand:{ $in:["Axis"]} });
        }
        else if( brands.length <= 0 && tags.length > 0 ){
            //find by tags list
            var result = products.find({ category: { $in:  list_categories }, "tags.value": { $in: tags }, price:{$lte:maxPrice}  })
        }
        else if( brands.length > 0  && tags.length > 0 ){
            var result = products.find({ category: { $in:  list_categories }, Brand:{ $in:brands}, "tags.value": { $in: tags }, price:{$lte:maxPrice} })
        }else if( brands.length <= 0 && tags.length <= 0){
            var result = products.find({ category: { $in: list_categories }, price:{$lte:maxPrice} });
        }
        //console.log('Result:'+ result.count());
        //attribute
        var listattr = [];
        if( result.count() > 0){
            result.forEach( function(data, index){
                var attr = attribute.find({product:data.oldId}).fetch();
                if( attr.length > 0){
                    listattr.push(attr[0]._id)
                }
            })

        }
        var attrdata = attribute.find({_id:{$in:listattr}});
        
        //categories
        //var listcategory = categories.i18nFind({});
        //tags
        /*var listtag = [];
        if( result.count() > 0){
            result.forEach( function(data, index){
                var intags = data.tags;
                if( intags.length >0){
                    for(i=0; i< intags.length; i++){
                        listtag.push(intags[i].value);
                    }
                }
            });
        }
        
        var mytags = uniqueArray(listtag);
        
        console.log('List Tags:', mytags);
        */
        
       
        return [result,attrdata ];
}
uniqueArray = function(a) {
    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? [] : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? [] : objs.push(item);
    });
}

Meteor.publish('products', function(limit) {         
    
      if (limit != -1) {
        return products.find({}, { limit: limit });
        } else {
            return products.find({});
            }
        });

Meteor.publish('productsDjibWithTags', function(limit,subcategories,listtags) {         
        //console.log('have tags');
      return products.find({ "category": { $in: subcategories }, "tags.value": { $in: listtags } });
});


Meteor.publish('productsDjib', function(limit,subcategories, myprice, mybrand, mytag) {         
    if(subcategories!= null && subcategories!= ""){
        var pro = getFilterProducts(limit, subcategories, myprice, mybrand, mytag);
        //var pro = products.find({ "category": { $in: subcategories }},{limit:limit});
        var allpages =pages.find({page:'category', type:'slide', categoryId:{$in:subcategories}});
        var allLocations = allpages.fetch();
        var proId =[];
        for(var i=0;i<allLocations.length;i++){
            var currentlistProducts=allLocations[i].productid;
            for(var j=0;j<currentlistProducts.length;j++){
                proId.push(currentlistProducts[j]);
            }
        }
        pro = pro.fetch();
        for(var j=0;j<pro.length;j++){
            proId.push( pro[j]._id);
        }
        var allpro = products.find({_id:{$in:proId}});
        var allattr = publishAttributeByProducts( allpro );
        return [allpro, allattr];
    }else
        return [];
});
getFilterProducts = function(limit, subcategories, myprice, mybrands, mytags){
    
    var result = '';
    if( mybrands.length > 0 && mytags.length <= 0 && myprice.length <= 1){
        console.log('brand:');
        result = products.find({ category: { $in:  subcategories }, Brand: mybrands},{limit:limit});
    }
    else if( mybrands.length > 0 && mytags.length > 0 && myprice.length <= 1){
        console.log('brand & tag:');
        result = products.find({ category: { $in:  subcategories }, Brand: mybrands, "tags.value": { $in: [mytags] } }, {limit:limit});
    }
    else if( mybrands.length > 0 && mytags.length <= 0 && myprice.length > 1 ){
        console.log('brand & price:');
        result = products.find({ category: { $in:  subcategories }, Brand: mybrands, price:{$lte:myprice}  }, {limit:limit});
    }
    else if( mybrands.length > 0 && mytags.length > 0 && myprice.length > 1 ){
        console.log('brand, tag & price:');
        result = products.find({ category: { $in:  subcategories }, Brand: mybrands, "tags.value": { $in: [mytags] }, price:{$lte:myprice}  }, {limit:limit});
    }
    else if( mybrands.length <= 0  && mytags.length > 0 && myprice.length <= 1){
        console.log('tag:');
        result = products.find({ category: { $in:  subcategories }, "tags.value": { $in: [mytags] } },{limit:limit});
    }
    else if( mybrands.length <= 0  && mytags.length > 0 && myprice.length > 1){
        console.log('tag & price:');
        result = products.find({ category: { $in:  subcategories }, "tags.value": { $in: [mytags] }, price:{$lte:myprice} },{limit:limit});
    }
    else if( mybrands.length <= 0  && mytags.length <= 0 && myprice.length > 1){
        console.log('price:');
        result = products.find({ category: { $in:  subcategories }, price:{$lte:myprice} },{limit:limit});

    }
    else{
        result = products.find({ category: { $in: subcategories } },{limit:limit});
        console.log('category only');
    }

    console.log('price value:', myprice);
    console.log('brand value:', mybrands);
    console.log('tag value:', mytags);
    console.log('result:', result.count());
   return result;
}
publishAttributeByProducts =  function( allpro ){
    var attrlist = [];
    if( allpro.count() >0  ){
        allpro.forEach( function(data, index){
            var attr = attribute.find({product: data.oldId}).fetch();
            if( attr.length > 0){
                for( i=0; i < attr.length; i++){
                    attrlist.push(attr[i]._id);
                }
            }
        })
    }
    var allattr = attribute.find({_id:{$in:attrlist}});
    return allattr;
}
Meteor.publish('productsOrder', function(idOrder) {
    var curOrder = order.findOne({ _id: idOrder });
    var listIdProducts = [];
    for (var i = 0; i < curOrder.items.length; i++)
        listIdProducts.push(curOrder.items[i].id_product);
    return products.find({ _id: { $in: listIdProducts } });
});

Meteor.publish('productsPage', function() {
    var page = pages.find({});
    var arrLp = [];
    if (page.count() > 0) {
        page.forEach(function(d) {
            if (d.productid != '') {
                var da = d.productid;
                for (i = 0; i < da.length; i++) {
                    arrLp = arrLp.concat(da[i]);
                }
            }
        });
        return products.find({ _id: { $in: arrLp } });
    }
})
Meteor.publish('productsSuggested', function(limit, id) {
    if (limit != -1) {
        return products.find({}, { limit: limit });
    } else {
        var answers = answerquizz.find({ "quizzId": id });
        if (answers.fetch().length != 0) {
            var lastAnswer = answers.fetch()[answers.fetch().length - 1];
            var listTags = [];
            for (var i = 0; i < lastAnswer.quizz.length; i++) {
                listTags.push(lastAnswer.quizz[i].tag);
            }
            return products.find({ "tag_quizz": { $in: listTags } });
        }
    }
});
Meteor.publish('tutoSuggested', function(id) {
    var answers = answerquizz.find({ "quizzId": id });
    if (answers.fetch().length != 0) {
        var lastAnswer = answers.fetch()[answers.fetch().length - 1];
        var listTags = [];
        for (var i = 0; i < lastAnswer.quizz.length; i++) {
            listTags.push(lastAnswer.quizz[i].tag);
        }
        var result = contents_type.findOne({ type: "Tuto" });
        //return contents.find({ typeid: result._id },{ "tags": { $in: listTags } },{ limit: 3 });
        return contents.find({ $and: [{ typeid: result._id }, { "tags": { $in: listTags } }] }, { limit: 3 });
    }
    /*else{
            var result = contents_type.findOne({ type: "Tuto" });
            var contentsresult = contents.find({ typeid: result._id }, { limit: 3 });
            return contentsresult;
        }*/
});
Meteor.publish("getAttTutoWebzin", function(title) {
    var allID = [];
    var name = title.toString();
    var con = contents.findOne({ "title": { $regex: new RegExp(name, "i") } });
    if (con) {
        var conCatId = con.category;
        var l = categories.findOne({ "_id": con.category });
        var finalList = [];
        finalList.push(l._id);
        var lvl1 = categories.find({ "parent": l._id }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        /*console.log("BEFORE HAMLY");
        console.log(finalList);
        console.log("AFTER HAMLY");*/
        for (var d = 0; d < finalList.length; d++) {
            var pro = products.find({ category: finalList[d] }).fetch();
            //console.log("PROHAMLY " + pro.length);
            if (pro) {
                for (var f = 0; f < pro.length; f++) {
                    var attr = attribute.find({ product: pro[f].oldId }).fetch();
                    if (typeof attr == "undefined" || attr == "") {
                        console.log("HAMLY UNDEFINED");
                    } else {
                        allID.push(attr[0]._id);
                    }
                }

            } else {
                //console.log("PRO NOTHING");
            }

        }
    } else {
        console.log("CANNOT HAMLY");
    }
    return attribute.find({ _id: { $in: allID } });
});
Meteor.publish('productsWebzine', function(limit, name) {
    if (limit == -1 && name) {
        var con = contents.findOne({ title: name });
        //console.log('cat==='+con.category);
        var l = categories.findOne({ "_id": con.category });
        var finalList = [];
        finalList.push(l._id);
        var lvl1 = categories.find({ "parent": l._id }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }

        function makaraRendomArray(o) {
            for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }
        var myArray = [];
        var resultRandom = [];
        var result = products.find({ category: { $in: finalList } });
        result.forEach(function(value) {
            myArray.push(value);
        });
        var arrayRandom = makaraRendomArray(myArray);
        for (var ran = 0; ran < 4; ran++) {
            if (arrayRandom[ran]) {
                resultRandom.push(arrayRandom[ran]._id);
            }

        }
        //console.log('category==='+finalList);
        return products.find({ _id: { $in: resultRandom } });

    } else {
        return products.find({});
    }
});
TAPi18n.publish('productsHome', function(limit) {
    if (limit != -1) {
        return products.find({}, { limit: limit, fields: { _id: 1, title: 1, image: 1, price: 1 } }); //return products.find({},{limit:limit});
    } else {
        /*var lp = list_product.find({});
        var arrLp = [];
        lp.forEach(function(l) {
            arrLp = arrLp.concat(l.products);
        });
        */
        var arrLp = [];
        var loc = locations.i18nFind({ $or: [{ type: 'News' }, { type: 'Deal' }], productid: { $ne: "" } });
        loc.forEach(function(d) {

            if (d.productid != '') {
                var da = d.productid;
                for (i = 0; i < da.length; i++) {
                    arrLp = arrLp.concat(da[i]);
                }
            }
        });
        return products.find({ _id: { $in: arrLp } });
    }
});
Meteor.publish('productsAdvance', function(list_tags, list_categories, list_brand) {
    if (list_tags > 0) {
        return products.find({ $and: [{ category: { $in: list_categories } }, { Brand: { $in: list_brand } }, { "tags.value": { $in: list_tags } }] });
    } else {
        return products.find({ $and: [{ category: { $in: list_categories } }, { Brand: { $in: list_brand } }] });
    }
});
Meteor.publish('productsDetails', function(limit, title) {
    if (limit == -1 && title) {
        var p = products.findOne({ "title": title });
        return products.find({ $or: [{ "title": title }, { category: p.category }] });
    } else
        return products.find({});
});

TAPi18n.publish('productsCategory', function(limit, name, limitcount) {
    if (limit == -1 && name) {
        var l = categories.findOne({ "title": name });

        if (l == null) {
            var title = name;
            title = title.replace(/\-/g, " ");
            title = title.replace(/\(percentag\)/g, "%");
            title = title.replace(/\(plush\)/g, "+");
            title = title.replace(/\(ocir\)/g, "ô");
            title = title.replace(/\(minus\)/g, "-");
            title = title.replace(/\(copyright\)/g, "®");
            title = title.replace(/\(number\)/g, "°");
            title = title.replace(/\(bigocir\)/g, "Ô");
            title = title.replace(/\(square\)/g, "²");
            title = title.replace(/\(accentaigu\)/g, "`");
            title = title.replace(/\(eaccentaigu\)/g, "é");
            title = title.replace(/\(bigeaccentaigu\)/g, "É");
            title = title.replace(/\(and\)/g, "&");
            title = title.replace(/\(slash\)/g, "/");
            title = title.replace(/\(apostrophe\)/g, "’");
            title = title.replace(/\(quote\)/g, "'");
            title = title.replace(/\(warning\)/g, "!");
            title = title.replace(/\(question\)/g, "?");
            title = title.replace(/\(dolla\)/g, "$");
            title = title.replace(/\(eaccentgrave\)/g, "è");
            title = title.replace(/\(hyphen\)/g, "–");
            var l = categories.findOne({ "i18n.en.title": title });
        }
         //console.log('Category name:', l);
        var finalList = [];
        finalList.push(l._id);
        var lvl1 = categories.find({ "parent": l._id }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        //count = count + 1;
        //console.log('Cat ID:', finalList);
        var pageproID = [];
        var page = pages.i18nFind({type:'slide',page:'category'});

        if( page.count() >0 ){
            page.forEach(function(d) {
                
                if( d.productid !='' ){
                    var da = d.productid;
                    for( i=0; i < da.length; i++){
                        pageproID = pageproID.concat(da[i]);
                    }
                }
            });
        }
        
        return products.find({ $or:[{category: { $in: finalList } },{_id: { $in: pageproID }}]}); 
        //get products
        /*var list = products.find({ $or:[{category: { $in: finalList }}]}).fetch();
        var listbypage = [];
        
        if( list.length > 0){
            for(i=0; i < limitproduct; i++ ){
                listbypage.push(list[i]._id);
            }
        
        }
        //Get attribute
        var product_slide = products.find({ _id: { $in: pageproID }}).fetch();

        if( product_slide.length > 0){
            for(j=0; j < product_slide.length; j++ ){
                listbypage.push(product_slide[j]._id);
            }
        }
        console.log('COUNT:', listbypage.length);
        //console.log('LIST:',listbypage);
        var data_list = products.find({ _id: { $in: listbypage }});
    
        return data_list;
        */
    } else {
        return products.find({});
    }
});
Meteor.publish('images', function() {
    return images.find({});
});

Meteor.publish('shops', function() {
    return shops.find({})
});
Meteor.publish('parent_tags_cat', function() {
    return parent_tags.find();
});
Meteor.publish('parent_tags_advance', function(list_categories) {
    //console.log('idcat===' + list_categories[0]);
    var l = categories.findOne({ _id: list_categories[0] });
    var finalList = [];
    finalList.push(l._id);
    var lvl1 = categories.find({ "parent": l._id }).fetch();
    for (var i = 0; i < lvl1.length; i++) {
        var cur1 = lvl1[i]._id;
        finalList.push(cur1);
        var lvl2 = categories.find({ "parent": cur1 }).fetch();
        for (var j = 0; j < lvl2.length; j++) {
            var cur2 = lvl2[j]._id;
            finalList.push(cur2);
            var lvl3 = categories.find({ "parent": cur2 }).fetch();
            for (var k = 0; k < lvl3.length; k++) {
                var cur3 = lvl3[k]._id;
                finalList.push(cur3);
                var lvl4 = categories.find({ "parent": cur3 }).fetch();
                for (var l = 0; l < lvl4.length; l++) {
                    var cur4 = lvl4[l]._id;
                    finalList.push(cur4);
                }
            }
        }
    }
    //console.log('finalList===' + finalList);
    var dataparent = parent_tags.find({ "category_id": { $in: finalList } });
    if (dataparent.count() > 0) {
        return parent_tags.find({ "category_id": { $in: finalList } });
    } else {
        var catparent = categories.findOne({ _id: l.parent });
        if (catparent) {
            var finalList = [];
            finalList.push(catparent._id);
            var lvl1 = categories.find({ "parent": catparent._id }).fetch();
            for (var i = 0; i < lvl1.length; i++) {
                var cur1 = lvl1[i]._id;
                finalList.push(cur1);
                var lvl2 = categories.find({ "parent": cur1 }).fetch();
                for (var j = 0; j < lvl2.length; j++) {
                    var cur2 = lvl2[j]._id;
                    finalList.push(cur2);
                    var lvl3 = categories.find({ "parent": cur2 }).fetch();
                    for (var k = 0; k < lvl3.length; k++) {
                        var cur3 = lvl3[k]._id;
                        finalList.push(cur3);
                        var lvl4 = categories.find({ "parent": cur3 }).fetch();
                        for (var l = 0; l < lvl4.length; l++) {
                            var cur4 = lvl4[l]._id;
                            finalList.push(cur4);
                        }
                    }
                }
            }
            return parent_tags.find({ category_id: { $in: finalList } }, { fields: { _id: 1, title: 1, category_id: 1 } });
        } else {
            return parent_tags.find({}, { fields: { _id: 1, title: 1, category_id: 1 } });
        }




    }



});

/*Meteor.publish('productsDjibWithTags', function(limit,subcategories,listtags) {         
        console.log('have tags');
      return products.find({ "category": { $in: subcategories }, "tags.value": { $in: listtags } });
});


Meteor.publish('productsDjib', function(limit,subcategories) {         
        console.log('dont have tags'+subcategories);
        if(subcategories!= null && subcategories!= "")
            return products.find({ "category": { $in: subcategories }},{limit:limit});
        else
            return [];
});
*/
TAPi18n.publish('categoryParent_tags', function(name) {
    if (name) {
        var l = categories.findOne({ "title": name });
        if (typeof l == 'undefined' || l == '') {
            var title = name;
            //title = title.replace(/\-/g, " ");
            title = title.replace(/\(percentag\)/g, "%");
            title = title.replace(/\(plush\)/g, "+");
            title = title.replace(/\(ocir\)/g, "ô");
            title = title.replace(/\(minus\)/g, "-");
            title = title.replace(/\(copyright\)/g, "®");
            title = title.replace(/\(number\)/g, "°");
            title = title.replace(/\(bigocir\)/g, "Ô");
            title = title.replace(/\(square\)/g, "²");
            title = title.replace(/\(accentaigu\)/g, "`");
            title = title.replace(/\(eaccentaigu\)/g, "é");
            title = title.replace(/\(bigeaccentaigu\)/g, "É");
            title = title.replace(/\(and\)/g, "&");
            title = title.replace(/\(slash\)/g, "/");
            title = title.replace(/\(apostrophe\)/g, "’");
            title = title.replace(/\(quote\)/g, "'");
            title = title.replace(/\(warning\)/g, "!");
            title = title.replace(/\(question\)/g, "?");
            title = title.replace(/\(dolla\)/g, "$");
            title = title.replace(/\(eaccentgrave\)/g, "è");
            title = title.replace(/\(hyphen\)/g, "–");
            var l = categories.findOne({ "i18n.en.title": title });
        }
        var finalList = [];
        finalList.push(l._id);
        var lvl1 = categories.find({ "parent": l._id }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        var dataparent = tags.find({ categoryId: { $in: finalList } });
        if (dataparent.count() > 0) {
            var datatags = tags.find({ categoryId: { $in: finalList } });
        } else {

            var catparent = categories.findOne({ _id: l.parent });
            if (catparent) {
                var finalList = [];
                finalList.push(catparent._id);
                var lvl1 = categories.find({ "parent": catparent._id }).fetch();
                for (var i = 0; i < lvl1.length; i++) {
                    var cur1 = lvl1[i]._id;
                    finalList.push(cur1);
                    var lvl2 = categories.find({ "parent": cur1 }).fetch();
                    for (var j = 0; j < lvl2.length; j++) {
                        var cur2 = lvl2[j]._id;
                        finalList.push(cur2);
                        var lvl3 = categories.find({ "parent": cur2 }).fetch();
                        for (var k = 0; k < lvl3.length; k++) {
                            var cur3 = lvl3[k]._id;
                            finalList.push(cur3);
                            var lvl4 = categories.find({ "parent": cur3 }).fetch();
                            for (var l = 0; l < lvl4.length; l++) {
                                var cur4 = lvl4[l]._id;
                                finalList.push(cur4);
                            }
                        }
                    }
                }

                var datatags = tags.find({ categoryId: { $in: finalList } });
            } else {
                var datatags = tags.find();
            }


        }
        var parentTags = [];
        datatags.forEach(function(v) {
            parentTags.push(v.parent);
        });
        return parent_tags.i18nFind({ _id: { $in: parentTags } });

    } else {
        return parent_tags.i18nFind({}, { fields: { _id: 1, title: 1, category_id: 1 } });

    }
});
TAPi18n.publish('detailsParent_tags', function(title) {
    //console.log('susbribing with ' + title);
    if (title) {
        var p = products.findOne({ "title": { $regex: new RegExp(title, "i") } });
        if (p == null)
            return [];
        var finalList = [];
        finalList.push(p.category);
        var lvl1 = categories.find({ "parent": p.category }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        return parent_tags.i18nFind({ category_id: { $in: finalList } });
    } else {
        return parent_tags.i18nFind({});
    }
});
TAPi18n.publish('detailsTags', function(title) {
    if (title) {
        var p = products.findOne({ "title": title });
        var finalList = [];
        finalList.push(p.category);
        var lvl1 = categories.find({ "parent": p.category }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        var pt = parent_tags.i18nFind({ category_id: { $in: finalList } });

        var arrTag = [];
        pt.forEach(function(t) {
            if (t._id) {
                arrTag.push(t._id);
            }
        });
        return tags.i18nFind({ parent: { $in: arrTag } });
    } else {
        return tags.i18nFind({});
    }
});
TAPi18n.publish('tagsAdvance', function(list_categories) {
    var l = categories.findOne({ _id: list_categories[0] });
    var finalList = [];
    finalList.push(l._id);
    var lvl1 = categories.find({ "parent": l._id }).fetch();
    for (var i = 0; i < lvl1.length; i++) {
        var cur1 = lvl1[i]._id;
        finalList.push(cur1);
        var lvl2 = categories.find({ "parent": cur1 }).fetch();
        for (var j = 0; j < lvl2.length; j++) {
            var cur2 = lvl2[j]._id;
            finalList.push(cur2);
            var lvl3 = categories.find({ "parent": cur2 }).fetch();
            for (var k = 0; k < lvl3.length; k++) {
                var cur3 = lvl3[k]._id;
                finalList.push(cur3);
                var lvl4 = categories.find({ "parent": cur3 }).fetch();
                for (var l = 0; l < lvl4.length; l++) {
                    var cur4 = lvl4[l]._id;
                    finalList.push(cur4);
                }
            }
        }
    }
    var dataparent = parent_tags.find({ "category_id": { $in: finalList } });
    if (dataparent.count() > 0) {
        var parent = parent_tags.find({ "category_id": { $in: finalList } });
    } else {
        var catparent = categories.findOne({ _id: l.parent });
        if (catparent) {
            var finalList = [];
            finalList.push(catparent._id);
            var lvl1 = categories.find({ "parent": catparent._id }).fetch();
            for (var i = 0; i < lvl1.length; i++) {
                var cur1 = lvl1[i]._id;
                finalList.push(cur1);
                var lvl2 = categories.find({ "parent": cur1 }).fetch();
                for (var j = 0; j < lvl2.length; j++) {
                    var cur2 = lvl2[j]._id;
                    finalList.push(cur2);
                    var lvl3 = categories.find({ "parent": cur2 }).fetch();
                    for (var k = 0; k < lvl3.length; k++) {
                        var cur3 = lvl3[k]._id;
                        finalList.push(cur3);
                        var lvl4 = categories.find({ "parent": cur3 }).fetch();
                        for (var l = 0; l < lvl4.length; l++) {
                            var cur4 = lvl4[l]._id;
                            finalList.push(cur4);
                        }
                    }
                }
            }
            var parent = parent_tags.find({ category_id: { $in: finalList } }, { fields: { _id: 1, title: 1, category_id: 1 } });
        } else {
            var parent = parent_tags.find({}, { fields: { _id: 1, title: 1, category_id: 1 } });
        }
    }
        var arrTag = [];
        parent.forEach(function(t) {
            if (t._id) {
                arrTag.push(t._id);
            }
        });
        return tags.i18nFind({ parent: { $in: arrTag } }, { fields: { _id: 1, title: 1, parent: 1, categoryId: 1 } });
});
TAPi18n.publish('parent_tags', function(title) {
    return parent_tags.i18nFind({}, { fields: { _id: 1, title: 1, category_id: 1 } });
});
TAPi18n.publish('categoryTags', function(name) {
    if (name) {
        var l = categories.findOne({ "title": { $regex: new RegExp(name, "i") } });
        if (typeof l == 'undefined' || l == '') {
            var title = name;
            //title = title.replace(/\-/g, " ");
            title = title.replace(/\(percentag\)/g, "%");
            title = title.replace(/\(plush\)/g, "+");
            title = title.replace(/\(ocir\)/g, "ô");
            title = title.replace(/\(minus\)/g, "-");
            title = title.replace(/\(copyright\)/g, "®");
            title = title.replace(/\(number\)/g, "°");
            title = title.replace(/\(bigocir\)/g, "Ô");
            title = title.replace(/\(square\)/g, "²");
            title = title.replace(/\(accentaigu\)/g, "`");
            title = title.replace(/\(eaccentaigu\)/g, "é");
            title = title.replace(/\(bigeaccentaigu\)/g, "É");
            title = title.replace(/\(and\)/g, "&");
            title = title.replace(/\(slash\)/g, "/");
            title = title.replace(/\(apostrophe\)/g, "’");
            title = title.replace(/\(quote\)/g, "'");
            title = title.replace(/\(warning\)/g, "!");
            title = title.replace(/\(question\)/g, "?");
            title = title.replace(/\(dolla\)/g, "$");
            title = title.replace(/\(eaccentgrave\)/g, "è");
            title = title.replace(/\(hyphen\)/g, "–");
            var l = categories.findOne({ "i18n.en.title": title });
        }
        var finalList = [];
        finalList.push(l._id);
        var lvl1 = categories.find({ "parent": l._id }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        //console.log('List Cat:', finalList);
        /*var pt = parent_tags.i18nFind({ category_id: { $in: finalList } }, { fields: { _id: 1, title: 1, category_id: 1 } });
        console.log('Count Cat:', pt.count());
        var arrTag = [];
        if( pt.count() > 0){
            pt.forEach(function(t) {
                if (t._id) {
                    arrTag.push(t._id);
                }
            });
        }*/
        var list = tags.i18nFind({ categoryId: { $in: finalList } });
        return list;
        /*var datatag = tags.i18nFind({ parent: { $in: arrTag } }, { fields: { _id: 1, title: 1, parent: 1, categoryId: 1 } });
        if (datatag.count() > 0) {
            return tags.i18nFind({ parent: { $in: arrTag } }, { fields: { _id: 1, title: 1, parent: 1, categoryId: 1 } });
        } else {
            var catparent = categories.findOne({ _id: l.parent });
            if (catparent == null)
                return tags.i18nFind({}, { fields: { _id: 1, title: 1, parent: 1, categoryId: 1 } });

            var finalList = [];
            finalList.push(catparent._id);
            var lvl1 = categories.find({ "parent": catparent._id }).fetch();
            for (var i = 0; i < lvl1.length; i++) {
                var cur1 = lvl1[i]._id;
                finalList.push(cur1);
                var lvl2 = categories.find({ "parent": cur1 }).fetch();
                for (var j = 0; j < lvl2.length; j++) {
                    var cur2 = lvl2[j]._id;
                    finalList.push(cur2);
                    var lvl3 = categories.find({ "parent": cur2 }).fetch();
                    for (var k = 0; k < lvl3.length; k++) {
                        var cur3 = lvl3[k]._id;
                        finalList.push(cur3);
                        var lvl4 = categories.find({ "parent": cur3 }).fetch();
                        for (var l = 0; l < lvl4.length; l++) {
                            var cur4 = lvl4[l]._id;
                            finalList.push(cur4);
                        }
                    }
                }
            }
            var pt = parent_tags.i18nFind({ category_id: { $in: finalList } }, { fields: { _id: 1, title: 1, category_id: 1 } });
            var arrTag = [];
            pt.forEach(function(t) {
                if (t._id) {
                    arrTag.push(t._id);
                }
            });
            return tags.i18nFind({ parent: { $in: arrTag } }, { fields: { _id: 1, title: 1, parent: 1, categoryId: 1 } });
            */

    } else {
        return tags.i18nFind({}, { fields: { _id: 1, title: 1, parent: 1, categoryId: 1 } });
    }
});
TAPi18n.publish('tags', function() {
    return tags.i18nFind({}, { fields: { _id: 1, title: 1, parent: 1, categoryId: 1 } });
});
Meteor.publish('stats', function() {
    return stats.find({});
});
Meteor.publish('answerquizz', function() {
    return answerquizz.find({ "userId": this.userId });
});
Meteor.publish('quizzQA', function() {
    return quizzQA.find({});
});
Meteor.publish("attribute", function(product) {
    if (product == -1)
        return attribute.find({});
    else {
        var old = products.findOne({ "title": product });
        return attribute.find({ "product": old.oldId });
    }
});

Meteor.publish("getFavorite", function(userid) {
    if( userid ){
        var userid = userid.toString();
        var allfav = favorite.find({ userId: userid });
        return allfav;
    }
});

Meteor.publish("getAttrFavorite", function(userid) {
    //console.log("USERFAV "+userid);
    var allID = [];
    var userid = userid.toString();
    var allfav = favorite.find({ userId: userid }).fetch();
    //console.log("PROIDHAMLYLE "+allfav.length);
    for (var i = 0; i < allfav.length; i++) {
        var productId = allfav[i].proId;
        //console.log("PROIDHAMLY "+productId);
        var allpro = products.findOne({ _id: productId });
        if (allpro) {
            var myOldId = allpro.oldId
                //console.log("myOldIdHaml "+myOldId);
            var attr = attribute.find({ product: myOldId });
            if (attr[0]) {
                allID.push(attr[0]._id);
            } else {
                //console.log("Nothing");
            }
        }

    }
    return attribute.find({ _id: { $in: allID } });
});

Meteor.publish("getattribute", function(routname) {
    //console.log("getAttrInPages Rout"+routname);
    var allID = [];
    var routname = routname.toString();
    var listID = pages.findOne({ router: routname });
    if (listID) {
        listID = listID.productid;
        for (var i = 0; i < listID.length; i++) {
            var getproduct = products.findOne({ _id: listID[i] });
            if(!getproduct)
                break;
            var attr = attribute.find({ product: getproduct.oldId });
            if (attr[0]) {
                allID.push(attr[0]._id);
            }
            /*attr.forEach(function (items) {
                allID.push(items._id);
            })*/
        }
    }
    return attribute.find({ _id: { $in: allID } });
});

Meteor.publish("attributeHome", function(product) {

    var allProdOldId = [];
    var list = list_product.find({}).fetch();
    for (var j = 0; j < list.length; j++) {
        var currentList = list[j];

        for (var i = 0; i < currentList.products.length; i++) {
            var current = products.findOne({ _id: currentList.products[i] });

            allProdOldId.push(current.oldId);
        }
    }

    return attribute.find({ "product": { $in: allProdOldId } });

});

Meteor.publish("attributeSuggested", function(product, id) {
    if (product == -1) {
        var answers = answerquizz.find({ "quizzId": id });
        if (answers.fetch().length != 0) {
            var lastAnswer = answers.fetch()[answers.fetch().length - 1];
            var listTags = [];
            for (var i = 0; i < lastAnswer.quizz.length; i++) {
                listTags.push(lastAnswer.quizz[i].tag);
            }
            var listProducts = products.find({ "tags.value": { $in: listTags } });
            var iPro = [];
            listProducts.forEach(function(p) {
                if (p.oldId) {
                    iPro.push(p.oldId);
                }
            });
            return attribute.find({ "product": { $in: iPro } });
        }
    } else {
        var old = products.findOne({ "title": product });
        return attribute.find({ "product": old.oldId });
    }
});
Meteor.publish("attributeCategory", function(name) {
    if (name) {
        var l = categories.findOne({ "title": name });
        if (l == null) {
            var title = name;
            title = title.replace(/\-/g, " ");
            title = title.replace(/\(percentag\)/g, "%");
            title = title.replace(/\(plush\)/g, "+");
            title = title.replace(/\(ocir\)/g, "ô");
            title = title.replace(/\(minus\)/g, "-");
            title = title.replace(/\(copyright\)/g, "®");
            title = title.replace(/\(number\)/g, "°");
            title = title.replace(/\(bigocir\)/g, "Ô");
            title = title.replace(/\(square\)/g, "²");
            title = title.replace(/\(accentaigu\)/g, "`");
            title = title.replace(/\(eaccentaigu\)/g, "é");
            title = title.replace(/\(bigeaccentaigu\)/g, "É");
            title = title.replace(/\(and\)/g, "&");
            title = title.replace(/\(slash\)/g, "/");
            title = title.replace(/\(apostrophe\)/g, "’");
            title = title.replace(/\(quote\)/g, "'");
            title = title.replace(/\(warning\)/g, "!");
            title = title.replace(/\(question\)/g, "?");
            title = title.replace(/\(dolla\)/g, "$");
            title = title.replace(/\(eaccentgrave\)/g, "è");
            title = title.replace(/\(hyphen\)/g, "–");
            var l = categories.findOne({ "i18n.en.title": title });
        }
        var finalList = [];
        finalList.push(l._id);
        var lvl1 = categories.find({ "parent": l._id }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        var lp = products.find({ category: { $in: finalList } });
        var arrLp = [];
        lp.forEach(function(l) {

            if (l.oldId) {
                arrLp = arrLp.concat(l.oldId);
            }
        });
        return attribute.find({ product: { $in: arrLp } });
    } else {
        return attribute.find({});
    }
});
Meteor.publish("attributerecommandation", function(name) {
    if (name) {
        var l = categories.findOne({ "title": name });
        if (l == null) {
            var title = name;
            title = title.replace(/\-/g, " ");
            title = title.replace(/\(percentag\)/g, "%");
            title = title.replace(/\(plush\)/g, "+");
            title = title.replace(/\(ocir\)/g, "ô");
            title = title.replace(/\(minus\)/g, "-");
            title = title.replace(/\(copyright\)/g, "®");
            title = title.replace(/\(number\)/g, "°");
            title = title.replace(/\(bigocir\)/g, "Ô");
            title = title.replace(/\(square\)/g, "²");
            title = title.replace(/\(accentaigu\)/g, "`");
            title = title.replace(/\(eaccentaigu\)/g, "é");
            title = title.replace(/\(bigeaccentaigu\)/g, "É");
            title = title.replace(/\(and\)/g, "&");
            title = title.replace(/\(slash\)/g, "/");
            title = title.replace(/\(apostrophe\)/g, "’");
            title = title.replace(/\(quote\)/g, "'");
            title = title.replace(/\(warning\)/g, "!");
            title = title.replace(/\(question\)/g, "?");
            title = title.replace(/\(dolla\)/g, "$");
            title = title.replace(/\(eaccentgrave\)/g, "è");
            title = title.replace(/\(hyphen\)/g, "–");
            var l = categories.findOne({ "i18n.en.title": title });
        }
        var finalList = [];
        finalList.push(l._id);
        var lvl1 = categories.find({ "parent": l._id }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        var lp = products.find({ category: { $in: finalList } });
        var arrLp = [];
        lp.forEach(function(l) {

            if (l.oldId) {
                arrLp = arrLp.concat(l.oldId);
            }
        });
        return attribute.find({ product: { $in: arrLp } });
    } else {
        return attribute.find({});
    }
});
Meteor.publish("attributeSearch", function(name) {
    if (name) {
        var l = categories.findOne({ "title": name });
        if (l == null) {
            var title = name;
            title = title.replace(/\-/g, " ");
            title = title.replace(/\(percentag\)/g, "%");
            title = title.replace(/\(plush\)/g, "+");
            title = title.replace(/\(ocir\)/g, "ô");
            title = title.replace(/\(minus\)/g, "-");
            title = title.replace(/\(copyright\)/g, "®");
            title = title.replace(/\(number\)/g, "°");
            title = title.replace(/\(bigocir\)/g, "Ô");
            title = title.replace(/\(square\)/g, "²");
            title = title.replace(/\(accentaigu\)/g, "`");
            title = title.replace(/\(eaccentaigu\)/g, "é");
            title = title.replace(/\(bigeaccentaigu\)/g, "É");
            title = title.replace(/\(and\)/g, "&");
            title = title.replace(/\(slash\)/g, "/");
            title = title.replace(/\(apostrophe\)/g, "’");
            title = title.replace(/\(quote\)/g, "'");
            title = title.replace(/\(warning\)/g, "!");
            title = title.replace(/\(question\)/g, "?");
            title = title.replace(/\(dolla\)/g, "$");
            title = title.replace(/\(eaccentgrave\)/g, "è");
            title = title.replace(/\(hyphen\)/g, "–");
            var l = categories.findOne({ "i18n.en.title": title });
        }
        var finalList = [];
        finalList.push(l._id);
        var lvl1 = categories.find({ "parent": l._id }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        var lp = products.find({ category: { $in: finalList } });
        var arrLp = [];
        lp.forEach(function(l) {
            if (l.oldId) {
                arrLp = arrLp.concat(l.oldId);
            }

        });
        return attribute.find({ product: { $in: arrLp } });
    } else {
        return attribute.find({});
    }
});

Meteor.publish("attributeProDetails", function(product, title) {

    if (product == -1 && title) {
        var old = products.findOne({ "title": title });
        var result = attribute.find({ "product": old.oldId });
        
        //console.log('manyattribute=' + result.count());
        return result;
    } else {
        var old = products.findOne({ "title": product });
        return attribute.find({ "product": old.oldId });
    }

});
TAPi18n.publish("parentattr", function() {
    return parentattr.i18nFind({});
});
TAPi18n.publish("parentattrProDetails", function() {
    return parentattr.i18nFind({});
});

Meteor.publish("users", function(tab) {
    if (tab == null)
        tab = [];
    tab.push(this.userId);
    if (tab[0] == -1)
        return Meteor.users.find();
    return Meteor.users.find({ "_id": { $in: tab } });

});

Meteor.publish("cart", function(id) {
    if( id ){
        return mycart =  cart.find({ "userId": id });
        /*var allMycart = [];
        if (mycart.count() > 0) {
            mycart.forEach(function(data, index){
                allMycart.push(data.id_product);
            });
            var allProduct = products.find({"_id":{$in:allMycart}});
            var attrlist = [];
            if( allProduct.count() > 0){
                allProduct.forEach( function(data, index){
                    var attr = attribute.find({product:data.oldId}).fetch();
                    if( attr.length > 0){
                        attr.forEach( function(daattr, index){
                           attrlist.push(daattr._id); 
                        });
                    }
                })
            }
            var dataattr = attribute.find({_id:{$in:attrlist}});
            return[mycart, allProduct, dataattr];
        };*/
    }
   
});

Meteor.publish("AddToCartproducts", function(id) {
    var allcart= cart.find({ "userId": id });
    var allpro=[];
    for(var i=0;i<allcart.length;i++){
        allpro.push(allcart[i].id_product);
    }
    return products.find({_id:{$in:allpro}});
});

//contents
Meteor.publish("contents", function() {
    return contents.find({});
});
Meteor.publish("contentsdetail", function(contentTitle){
    return contents.find({title:contentTitle});
});
Meteor.publish("contentsSuggested", function() {
    var result = contents_type.findOne({ type: "Tuto" });
    var contentsresult = contents.find({ typeid: result._id }, { limit: 3 });
    return contentsresult;
});
Meteor.publish("contentsProDetails", function() {
    return contents.find({});
});
Meteor.publish("contents_type", function() {
    return contents_type.find({});
});
// address
Meteor.publish("address", function() {
    return address.find({});
});

Meteor.publish("favorite", function(userId) {
    //console.log("fav of "+userId);
    return favorite.find({ "userId": userId });
});

Meteor.publish("favoriteCategory", function(name) {
    if (name) {
        var l = categories.findOne({ "title": name });
        if (l == null) {
            var title = name;
            title = title.replace(/\-/g, " ");
            title = title.replace(/\(percentag\)/g, "%");
            title = title.replace(/\(plush\)/g, "+");
            title = title.replace(/\(ocir\)/g, "ô");
            title = title.replace(/\(minus\)/g, "-");
            title = title.replace(/\(copyright\)/g, "®");
            title = title.replace(/\(number\)/g, "°");
            title = title.replace(/\(bigocir\)/g, "Ô");
            title = title.replace(/\(square\)/g, "²");
            title = title.replace(/\(accentaigu\)/g, "`");
            title = title.replace(/\(eaccentaigu\)/g, "é");
            title = title.replace(/\(bigeaccentaigu\)/g, "É");
            title = title.replace(/\(and\)/g, "&");
            title = title.replace(/\(slash\)/g, "/");
            title = title.replace(/\(apostrophe\)/g, "’");
            title = title.replace(/\(quote\)/g, "'");
            title = title.replace(/\(warning\)/g, "!");
            title = title.replace(/\(question\)/g, "?");
            title = title.replace(/\(dolla\)/g, "$");
            title = title.replace(/\(eaccentgrave\)/g, "è");
            title = title.replace(/\(hyphen\)/g, "–");
            var l = categories.findOne({ "i18n.en.title": title });
        }
        var finalList = [];
        finalList.push(l._id);
        var lvl1 = categories.find({ "parent": l._id }).fetch();
        for (var i = 0; i < lvl1.length; i++) {
            var cur1 = lvl1[i]._id;
            finalList.push(cur1);
            var lvl2 = categories.find({ "parent": cur1 }).fetch();
            for (var j = 0; j < lvl2.length; j++) {
                var cur2 = lvl2[j]._id;
                finalList.push(cur2);
                var lvl3 = categories.find({ "parent": cur2 }).fetch();
                for (var k = 0; k < lvl3.length; k++) {
                    var cur3 = lvl3[k]._id;
                    finalList.push(cur3);
                    var lvl4 = categories.find({ "parent": cur3 }).fetch();
                    for (var l = 0; l < lvl4.length; l++) {
                        var cur4 = lvl4[l]._id;
                        finalList.push(cur4);
                    }
                }
            }
        }
        var lp = products.find({ category: { $in: finalList } }, { fields: { _id: 1, Brand: 1, category: 1, description: 1, image: 1, price: 1, title: 1 } }); //return products.find({},{limit:limit});
        var arrLp = [];
        lp.forEach(function(l) {
            arrLp = arrLp.concat(l._id);
        });
        return favorite.find({ proId: { $in: arrLp } });
    } else {
        return favorite.find({});
    }

});

Meteor.publish("favoriteHome", function() {
    var lp = list_product.find({});
    var arrLp = [];
    lp.forEach(function(l) {
        arrLp = arrLp.concat(l.products);
    });
    return favorite.find({ proId: { $in: arrLp } });
});
Meteor.publish("role", function() {
    return Meteor.roles.find({});
});
Meteor.publish("question", function() {
    return question.find({});
});

Meteor.publish("journey", function() {
    return journey.find({});
});

Meteor.publish("linkselling", function() {
    return linkselling.find({});
});

Meteor.publish("membershipcard", function() {
    return membershipcard.find({});
});

TAPi18n.publish("list_product", function() {
    return list_product.i18nFind({});
});

Meteor.publish('attribute_value', function() {
    return attribute_value.find({});
});

Meteor.publish('translation', function() {
    return translation.find({});
});

Meteor.publish('payments', function() {
    return payments.find({});
});
Meteor.publish('banner', function() {
    return banner.find({});
});
Meteor.publish('bannerfavorite', function() {
    var arr = [];
    var result = banner.findOne({ 'typebanner': 'favorite' });
    if (result == null)
        return [];
    else
        return banner.find({ _id: result._id });

});
Meteor.publish('daily', function() {
    return daily.find({});
});
Meteor.publish('imedation', function() {
    return imedation.find({});
});
Meteor.publish('newsletter', function() {
    return newsletter.find({});
});
Meteor.publish('anwser', function() {
    return anwser.find({});
});

Meteor.publish('barcode', function() {
    return barcode.find({});
});

Meteor.publish('userTracking', function(skip, field1, field2, field3) {
    if (field1 && field2 && field3 != null) {
        return userTracking.find({ time: { $gt: field2, $lt: field3 } }, { skip: skip, limit: 20 });
    }
    if (field1 && field2 && field3 == null) {
        if (field1 == "ip") {
            return userTracking.find({ ip: field2 }, { skip: skip, limit: 20 });
        }
        if (field1 == "currenturl") {
            return userTracking.find({ currenturl: { $regex: field2, $options: 'i' } }, { skip: skip, limit: 20 });
        }
        if (field1 == "location") {
            return userTracking.find({ location: field2 }, { skip: skip, limit: 20 });
        }
        if (field1 == "userId") {
            return userTracking.find({ userId: field2 }, { skip: skip, limit: 20 });
        }
    } else {
        return userTracking.find({}, { skip: skip, limit: 20 });

    }
});

Meteor.publish('mouse', function() {
    return mouse.find({});
});
Meteor.publish('quizz', function() {
    return quizz.find({});
});
Meteor.publish('tracking', function() {
    return tracking.find({});
});

Meteor.publish('order', function() {
    return order.find({});
});
//stock publisher
Meteor.publish('stock', function(skip, sesShop, field, val) {
    if (val != "") {
        return stock.find({ Barcode: val }, { skip: skip, limit: 20 });
    } else if (field != "") {
        return stock.find({ RetailStoreName: field }, { skip: skip, limit: 20 });
    } else if (sesShop != "") {
        return stock.find({ RetailStoreName: sesShop }, { skip: skip, limit: 20 });
    } else
        return stock.find({}, { skip: skip, limit: 20 });
});
Meteor.publish('products_node', function() {
    return products_node.find({});
});
Meteor.publish('discount', function() {
    return discount.find({});
});
Meteor.publish('collect', function() {
    return collect.find({});
});
Meteor.publish("listposts", function() {
    return posts.find({});
});
Meteor.publish("postsbyId", function(post_id) {
    return posts.find({_id:post_id});
});
//============makara========
//============publish attribute checkout=========
Meteor.publish('rendomProductCheckout', function(userid) {
    var attr=[];
    var arrpro=[];
    var cate=[];
    var finalIdpro=[];
    function makaraRendomArray(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
    var datacart= cart.find({userId:userid});
    datacart.forEach(function(v){
        //arrpro.push(v.id_product);
        var cat=products.findOne({_id:v.id_product}).category;
        cate.push(cat);
        arrpro.push(v.id_product);
        attr.push(v.attribute);

    });
    //========unique array========
    function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
    }
    var uniquecate = cate.filter( onlyUnique );
    //=======end unique array=====
    var proRandoms=products.find({category:{$in:uniquecate}}).fetch();
    //console.log('arrayproduct===='+proRandoms);
    var arrayRandom=makaraRendomArray(proRandoms);
    for(var i=0;i<4;i++){
        if (arrayRandom[i]!="undefined") {
            finalIdpro.push(arrayRandom[i]._id);
            var oldId=products.findOne({_id:arrayRandom[i]._id}).oldId;
            if(oldId){
               attr.push(attribute.findOne({product:oldId})._id); 
            }
            
        }
    }
    //console.log('idattr========'+attr);
    finalIdpro.push(arrpro);
    var listproduct=products.find({_id:{$in:finalIdpro}});
    var attrdata = attribute.find({_id:{$in:attr}});
    return [listproduct, attrdata];
});
//============end publish attribute checkout=====

Meteor.publish('randomRelatedProduct', function(title){
    var resultRandom = [];
    var result2 = products.findOne({"title":title});
    //console.log("result2 "+JSON.stringify(result2));
    if(result2.recommended)
        recommended=result2.recommended;
    else
        recommended=[];
    recommended.push(result2._id);
    var recommendpro = products.find({_id:{$in:recommended}});
    //console.log('recommend product '+recommendpro);
    //return recommendpro;

    var listproduct = products.find({ _id: { $in: recommended } });
    var listattr = [];
    if( listproduct.count() > 0){
        listproduct.forEach( function(data, index){
            var attr = attribute.find({product:data.oldId}).fetch();
            if( attr.length > 0){
                if(result2._id==data._id){
                    for(var i=0;i<attr.length;i++){
                        listattr.push(attr[i]._id);
                    }
                }else{
                   listattr.push(attr[0]._id) 
                }
            }
        });
    }
    var attrdata = attribute.find({_id:{$in:listattr}});
    return [recommendpro,attrdata];
});

Meteor.publish('rendomProduct', function(title) {
    function makaraRendomArray(o) {
        for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
    var myArray = [];
    var resultRandom = [];
    var p = products.findOne({ "title": title });
    var result = products.find({ category: p.category });
    result.forEach(function(value) {
        myArray.push(value);
    });
    var arrayRandom = makaraRendomArray(myArray);
    for (var ran = 0; ran < 4; ran++) {
        if (arrayRandom[ran]) {
            resultRandom.push(arrayRandom[ran]._id);
        }

    }
    resultRandom.push(p._id);
    var listproduct = products.find({ _id: { $in: resultRandom } });
    var listattr = [];
    if( listproduct.count() > 0){
        listproduct.forEach( function(data, index){
            var attr = attribute.find({product:data.oldId}).fetch();
            if( attr.length > 0){
                if(p._id==data._id){
                    for(var i=0;i<attr.length;i++){
                        listattr.push(attr[i]._id);
                    }
                }else{
                   listattr.push(attr[0]._id) 
                }
            }
        });
    }
    var attrdata = attribute.find({_id:{$in:listattr}});
    return [listproduct, attrdata];
});

TAPi18n.publish('quicklink', function() {
    return quicklink.i18nFind({});
});
Meteor.publish("shopLearnIt", function() {
    return shopLearnIt.find({});
});


Meteor.publish("userOrderAdmin", function() {
    var allOrders = order.find().fetch();
    var allUsers = [];
    for (var i = 0; i < allOrders.length; i++) {
        //console.log('Order id: ' + allOrders[i].userid);
        allUsers.push(allOrders[i].userid);
    }
    //console.log('all' + allUsers);
    return Meteor.users.find({ _id: { $in: allUsers } }, { fields: { _id: 1, username: 1, emails: 1, profile: 1 } });
});


Meteor.publish("locations", function() {
    return locations.find({});
});
Meteor.publish("EditLocations", function(id) {
    return locations.find({ _id: id });
});
Meteor.publish("pages", function() {
    return pages.find({});
});

Meteor.publish('membership', function() {
    return membership.find();
});

Meteor.publish('share', function() {
    return share.find();
});
Meteor.publish("viewing", function() {
    return viewing.find();
});

Meteor.publish('reachpoint', function(userId) {
    return reachpoint.find({ userId: userId });
})

Meteor.publish('getRouter', function(router) {
    console.log(router);
});


Meteor.publish('searchProductBrand', function(name) {
    if ( name ) {
        
            //var list = products.find({ $or: [{ $and: [{ title: { $regex: new RegExp(name, "i") } },{ Brand: { $regex: new RegExp(name, "i") } }, { category: { $ne: 'tester' } }] }, { tag_quizz: { $regex: new RegExp(name, "i") } }, { "tags.value": { $regex: new RegExp(name, "i") } }, { $and: [{ description: { $regex: new RegExp(name, "i") } }, { category: { $ne: 'tester' } }] }] });
            var list = products.find({Brand:name});
            //onsole.log('LIST FINISH:'+list.count());
            /*var listattr = [];
            if( list.count() > 0){
                list.forEach( function(data, index){
                    var attr = attribute.find({product:data.oldId}).fetch();
                    if( attr.length > 0){
                        listattr.push(attr[0]._id)
                    }
                })

            }*/
            //var attrresult = attribute.find({_id:{$in:listattr}});
            //console.log('length product:', list.count());
            //console.log('length attr:', attrresult.count());
            var attrresult = publishAttributeByProducts(list);
            return [list, attrresult];
        
    } 

});


Meteor.publish('searchProductKeyword', function(name, groupnumber) {
    if ( name ) {
        //console.log('Limit:', limit);
        groupnumber = parseInt(groupnumber);
        if( groupnumber == 1 || groupnumber == 0){
            //var list = products.find({ $or: [{ $and: [{ title: { $regex: new RegExp(name, "i") } },{ Brand: { $regex: new RegExp(name, "i") } }, { category: { $ne: 'tester' } }] }, { tag_quizz: { $regex: new RegExp(name, "i") } }, { "tags.value": { $regex: new RegExp(name, "i") } }, { $and: [{ description: { $regex: new RegExp(name, "i") } }, { category: { $ne: 'tester' } }] }] });
            var list = products.find(
                {$and : [
                    { $or : [
                        { title: { $regex: new RegExp(name, "i") } }, 
                        { Brand: { $regex: new RegExp(name, "i") } },
                        { tag_quizz: { $regex: new RegExp(name, "i") } },
                        //{ tags.value: { $regex: new RegExp(name, "i") } },
                        { description: { $regex: new RegExp(name, "i") } }]
                    },
                    { category: { $ne: 'tester' } }
                    ]}
                );
            //onsole.log('LIST FINISH:'+list.count());
            var attrresult = publishAttributeByProducts( list );
            var con = contents.find();
            return [list, attrresult, con];
        }else{
            var con = contents.find();
            return [con];
        }
    } 
});

Meteor.publish('productsInlocations', function() {
    var allLocations=locations.find().fetch();
    var allProductsTosubscribe=[];
    for(var i=0;i<allLocations.length;i++){
        var currentlistProducts=allLocations[i].productid;
        for(var j=0;j<currentlistProducts.length;j++){
            allProductsTosubscribe.push(currentlistProducts[j]);
        }
    }
    //console.log('LOCATIONS:  '+allProductsTosubscribe);

    return products.find({_id:{$in:allProductsTosubscribe}});
});

Meteor.publish('productsInPages', function() {
    var allLocations=pages.find().fetch();
    var allProductsTosubscribe=[];
    for(var i=0;i<allLocations.length;i++){
        var currentlistProducts=allLocations[i].productid;
        for(var j=0;j<currentlistProducts.length;j++){
            allProductsTosubscribe.push(currentlistProducts[j]);
        }
    }
    //console.log('PAGES:  '+allProductsTosubscribe);
    return products.find({_id:{$in:allProductsTosubscribe}});
});

Meteor.publish('publishProductCheckout', function(userId){
    //console.log('Userkey:', userId);
    if( userId ||  userId != 'undefined'){
        var mycart = cart.find({userId:userId});
        var listProduct = [];
        if( mycart.count() >= 0){
            var rows = mycart.fetch();
            for(i=0; i < rows.length ; i++){
                listProduct.push( rows[i].id_product);
            }
        }else{
            //console.log('vide');
            return null;
        }
        if( listProduct.length >= 0){
            //var listProduct = uniqueArray(listProduct);
            var tmp = [];
            for(var i = 0; i < listProduct.length; i++){
                if(tmp.indexOf(listProduct[i]) == -1){
                tmp.push(listProduct[i]);
                }
            }
            //console.log('List2:', tmp);
            var pros = products.find({_id:{$in:tmp}});
            return pros;
        }else return;
    }

});
Meteor.publish("publishProfilePic", function( userId ){
    var user = Meteor.users.findOne({ _id: userId });
    if( user.hasOwnProperty('image') ){
        var imageId = user.image;
        if( imageId instanceof Array)
            return images.find({_id:{$in:imageId}},{limit:1});
        else
            return images.find({_id:imageId},{limit:1});
    }
})
Meteor.publish("currentUserLoggedInImage", function(userId){
    if( userId ){
        var user = Meteor.users.findOne({ _id: userId });
        if( user.hasOwnProperty('image') ){
            var imageId = user.image;
            if( imageId instanceof Array)
                return images.find({_id:{$in:imageId}});
            else
                return images.find({_id:imageId});

        }else
            return [];
    }
});
Meteor.publish("categoryTester", function(userid){
    var arr = [];
    var userPoint = Meteor.users.findOne({ '_id': userid }).profile.shipcard.point;
    var cat = products.find({'category': 'tester'});
    cat.forEach(function(data){
        var point = data.point;
        if(point !== "" && point !== null && point <= userPoint){
            arr.push(data._id);
        }
    });
    return products.find({_id:{$in:arr}});
});