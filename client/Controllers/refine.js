Template.myrefine2.helpers({
    //================code new refine========
    getAllBrandRefine:function(){
        var cats = Session.get('currentCategory');
        
        Meteor.call('getAllBrands', cats, function(err, mybrand){
            if(!err){
                Session.set('dataBrands',mybrand);
            }
        })
        return {};
        /*for( i=0; i < alpha.length; i++){
            var value = alpha[i].toUpperCase();
            Meteor.call('getAllBrandsByAlphabet', cats, value, function(err, myBrands){
               if(!err){
                Session.set('dataBrands'+value,myBrands);
               }        
            })
            var arrbrand = Session.get('dataBrands'+value);
            console.log('brand:', arrbrand);
            allbrandByAlphabet.push({alphabet:value, list:arrbrand});
        }
        
        return allbrandByAlphabet;*/
    },
    getAllAlphabets: function(){
        var alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
        //var allbrandByAlphabet = [];
        return alpha;
    },
    getBrandByalphabet: function( alphabet ){
        var arrbrand = Session.get('dataBrands');
        //console.log('All:', arrbrand.length );
        if( arrbrand.length > 0 ){
            var letter = alphabet.toUpperCase();
            
            var mybrands = [];
            for (i = 0; i < arrbrand.length; i++) {
                if (arrbrand[i].hasOwnProperty('Brand')) {
                    var first = arrbrand[i].Brand;
                    //console.log('Brand:', first, ' , Alpha:', alphabet ); 
                    if (first != '' && first.toUpperCase().substr(0, 1) == letter && mybrands.indexOf(first) == -1)
                        mybrands.push(first);
                }

            }
            //console.log('Alphabet:', alphabet ,'==========================');
            return mybrands;
        }
    },
    getAllTags:function(){
        var cats = Session.get('currentCategory');
        var listing = getCategoryListing( cats );
        //alert('cats=='+cats);
        Meteor.call('getAllTagByCat',listing,function(err,data){
            if(!err){
                Session.set('myListTags',data);
            }
        });
        return Session.get('myListTags');
    },
    getCategoryList: function(){
        var cat = Session.get('currentCategory');
        var listing = getCategoryListing( cat );
        console.log('curcat:', cat);
        console.log('listcat:', listing);
        return {currentcat:cat, subcat:listing}
    },
    getCategoryByID : function(id){
        return categories.findOne({_id:id});
    }
});
Template.myrefine2.events({
    'click .select-price': function(e){
        var price = $(e.currentTarget).attr('data-price');
        $('#refine-price').text( $(e.currentTarget).text());
        $('.quick-drop-price-range').css('display', 'none');
        Session.set('MYPRICE', price);
    },
    'click .select-brand': function(e){
        var brand = $(e.currentTarget).text();
        $('#refine-brand').text( $(e.currentTarget).text());
        $('.quick-drop-brand').css('display', 'none');
        Session.set('MYBRAND', brand);
    },
    'click .select-tag': function(e){
        var tag = $(e.currentTarget).attr('data-tag');
        $('#refine-tag').text( $(e.currentTarget).text());
        $('.quick-drop-tage').css('display', 'none');
        Session.set('MYTAG', tag);
    },
    'click .select-category': function(e){
        var cat = $(e.currentTarget).attr('data-cat');
         $('#refine-category').text( $(e.currentTarget).text());
         $('.quick-drop-allcategory').css('display', 'none');
        var listcat = {_id:cat};
        var subcat = getListCategoryByParent(listcat);
        Session.set('subcategories', subcat );
    }
});

getCategoryListing = function( cats ){
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
