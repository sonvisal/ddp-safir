Session.set('currentLetter', "A");
Session.setDefault('advanced_price_min', 0);
Session.setDefault('advanced_price_max', 100000000);
Session.setDefault('advanced_tags', '');
Session.setDefault('advanced_brand', '');
Session.setDefault('advanced_has_comment', 0);
Session.setDefault('advanced_is_favorite', 0);
Session.setDefault('currentCategory', '');
Session.setDefault('parentTagId', '');
Session.setDefault('click', '');

Session.setDefault('AllBrandsByAlphabet', '');
/*Template.listproducts.rendered = function() {
     var cats = Session.get('currentCategory');
     console.log('CatIdA:', cats);
    Deps.autorun(function () {
        if(Session.get('publishParentTags') == true){
            console.log('CatIdB:', cats);
            Meteor.subscribe('publishParentTags', cats);
        }
        //if( Session.get('publishTags') == true )
             //Meteor.subscribe('publishTags', Session.get('parentTagId'));
        //if( Session.get('publishBrands') == true )
             //Meteor.subscribe('publishBrands', Session.get('publishBrandsLetter'));
    });
}
*/
/*
clickAlpha = 0;
Tracker.autorun(function () {
    if(Session.get('publishBrandsByAlphabet') == true){
        var cats = Session.get('currentCategory');
        var alphabet = Session.get('alphabet');
        console.log('CatData:', cats);
        Meteor.subscribe('publishBrandsByAlphabet', cats, alphabet);
        Session.set('publishBrandsByAlphabet', false);
        clickAlpha = clickAlpha +1;
        Session.set("clickbrand", clickAlpha);
        console.log('click:', clickAlpha);
    }
});*/
Template.myrefine.events({
    'click #refine_price_range': function(e, tpl) {
        var url = 'https://www.google-analytics.com/collect?v=1&t=event&tid=UA-71059459-2&cid=555&ec=refine&ea=click&el=refineByPrice&ev=1000';
        Meteor.call('eventCall', url, function(error, result) {
            if (error) {
                console.log('Analytic CLIENT ERRR');
                console.log(error);
            } else {
                console.log('Analytic CLIENT RESULT');
                console.log(result);
            }
        });
        $("#panel_price").slideToggle("slow");
    },
    'click #refineBrand': function(e, tpl) {
        var url = 'https://www.google-analytics.com/collect?v=1&t=event&tid=UA-71059459-2&cid=555&ec=refine&ea=click&el=refineByBrand&ev=1000';
        Meteor.call('eventCall', url, function(error, result) {
            if (error) {
                console.log('Analytic CLIENT ERRR');
                console.log(error);
            } else {
                console.log('Analytic CLIENT RESULT');
                console.log(result);
            }
        });
        console.log('changing');
        $(".refine-item").addClass('tohide');
        $(".refine-item").removeClass('toshow');
        $("#brands").removeClass('tohide');
        $("#brands").addClass('toshow');

    },
    'click #refinetag': function(e, tpl) {
        console.log('changing');
        $(".refine-item").addClass('tohide');
        $(".refine-item").removeClass('toshow');
        $("#parentTag").removeClass('tohide');
        $("#parentTag").addClass('toshow');
         Session.set('publishParentTags',true);

    },
    'click #refineRating': function(e, tpl) {
        console.log('changing');
        $(".refine-item").addClass('tohide');
        $(".refine-item").removeClass('toshow');
        $("#rating").removeClass('tohide');
        $("#rating").addClass('toshow');
    },
    'click #refinePrix': function(e, tpl) {
        console.log('changing');
        $(".refine-item").addClass('tohide');
        $(".refine-item").removeClass('toshow');
        $(".price-range").removeClass('tohide');
        $(".price-range").addClass('toshow');
        $(".slider.slider-horizontal .slider-tick-label-container .slider-tick-label").css('width', '87.5px');
        $(".slider.slider-horizontal .slider-tick-label-container .slider-tick-label").css('margin-left', '0px');
        $(".slider.slider-horizontal .slider-tick-label-container").css('margin-left', '-40px');
        Router.go('advanced');
    },
    'click .alphabet': function(e, tpl) {
        e.preventDefault();
        var value = $(e.currentTarget).text();
        Session.set('publishBrandsByAlphabet', true);
        Session.set('alphabet', value);
        Session.set('limit', -1);
        var cats = Session.get('currentCategory');
        Meteor.call('getAllBrandsByAlphabet', cats, value, function(err, myBrands){
            if(err) console.log(err);
            else {
                //Session.set('AllBrandsByAlphabet', data );
                tpl.$("#allBrands").html("");
                console.log('myBrands=', myBrands);
                if( myBrands.length > 0){
                    for (var i = 0; i < myBrands.length; i++)
                        tpl.$("#allBrands").append('<li><a href="/listproducts/' + myBrands[i] + '" class="targetBrand">' + myBrands[i] + '</a></li>');
                }else{
                    tpl.$("#allBrands").append('<li>Brand is not match category "'+cats.title+'" and alphabet "'+value+'" </li>');
                }   

            }
        })
        /*if( cats != 'undefined'){
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
             var liste = products.find().fetch({category:{$in:list_categories}});
        }else{
             var liste = products.find().fetch();
        }
        letter = value.toUpperCase();
        var myBrands = [];

       
        console.log("Processing2:" + liste.length);
        for (var i = 0; i < liste.length; i++) {
            if (liste[i].hasOwnProperty('Brand')) {
                var first = liste[i].Brand;
                if (first != '' && first.toUpperCase().substr(0, 1) == letter && myBrands.indexOf(first) == -1)
                    myBrands.push(first);
            }

        }*/
        //var myBrands =  Session.get('AllBrandsByAlphabet');
        
    },
    'click #tagrefine': function(e, tpl) {
        e.preventDefault();
        console.log('this._id=' + this._id);
        Session.set('advanced_tagss', this._id);
        Router.go('/advanced');

    },
    'click #parentTags': function(e) {
        e.preventDefault();
        Session.set('parentTagId', $(e.currentTarget).html());
        //Session.set('PRTAGID',)
        console.log('ParentTag:', $(e.currentTarget).html());
        Session.set('publishTags',true);
    },
    'click .targetBrand': function(e, tpl) {
        e.preventDefault();
        var brand = $(e.currentTarget).text();
        var oldValue = Session.get('advanced_brand');
        var newVal = oldValue + '' + brand + ';';

        Session.set('advanced_product', 1);
        Session.set("itemsLimit", 16);
        Session.set('advanced_brand', newVal);
        console.log('brand Liste Brand= ' + Session.get('advanced_brand'));
        Router.go('advanced');
    },
    'click .targetTag': function(e, tpl) {
        e.preventDefault();
        var tag = $(e.currentTarget).text();
        var oldValue = Session.get('advanced_tags');
        var newVal = oldValue + '' + tag + ';';
        Session.set('advanced_product', 1);
        Session.set("itemsLimit", 16);
        Session.set('advanced_tags', newVal);
        console.log('tag Liste Brand= ' + Session.get('advanced_tags'));
        Router.go('advanced');
    },
    'click .removeRefineItemBrand': function(e, tpl) {
        e.preventDefault();
        var brand = $(e.currentTarget).parent().text();
        brand = brand.substr(0, brand.length - 1);
        console.log('Deleting ' + brand);
        var oldValue = Session.get('advanced_brand');

        var toDelete = brand + ';';
        console.log('Brand to delete:' + toDelete);
        var newVal = oldValue.replace(toDelete, '');
        Session.set('advanced_brand', newVal);
        $(e.currentTarget).parent().parent().remove();
        Router.go('advanced');

    },
    'click .removeRefineItemTag': function(e, tpl) {
        e.preventDefault();
        var mytag = $(e.currentTarget).parent().text();
        mytag = mytag.substr(0, mytag.length - 1);
        var oldValue = Session.get('advanced_tags');
        var toDelete = mytag + ';';
        console.log('Brand to delete:' + toDelete);
        var newVal = oldValue.replace(toDelete, '');
        Session.set("itemsLimit", 16);
        Session.set('advanced_tags', newVal);
        $(e.currentTarget).parent().parent().remove();
        Router.go('advanced');

    },
    'click .removeRefineItemPrice': function(e, tpl) {
        e.preventDefault();
        $(e.currentTarget).parent().parent().remove();
        Session.set("itemsLimit", 16);
        Session.set('advanced_price_min', 0);
        Session.set('advanced_price_max', 100000000);
    },
    'change #selectParentCat': function(e){
        var id = $(e.currentTarget).val();
        var data = categories.findOne({_id:id});
        console.log('data cat:', data );
        Session.set("currentCategory", data);
    }
});

Template.myrefine.helpers({
    getParentCatList: function(){
        return categories.find({parent:" "})
    },
    selectedCategory: function( id ){
        var cat = Session.get("currentCategory");
        var curID = (cat !='')? cat._id:'';
        if(id == curID) return "selected";
        else return;
    },
    getParentTag: function() {
        var title=[];
        var arr=[];
        var names=parent_tags.find().fetch();
       
        names.forEach(function(v){
            var tag = tags.find({parent:v._id}).fetch();
            if( tag.length > 0 )
                title.push(v.title);
        });
        /*
        function onlyUnique(value, index, self) { 
            return self.indexOf(value) === index;
        }
        var unique = title.filter( onlyUnique );
        for(var i=0;i<unique.length;i++){
            var result=parent_tags.findOne({title:unique[i]});
            if( result.title ) arr.push(result);
        }*/
        //var names = ["Mike","Matt","Nancy","Adam","Jenny","Nancy","Carl"];
        var uniqueNames = [];
        $.each(title, function(i, el){
            if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
        });
        return uniqueNames;
        // var arr=[];
        // var parent=parent_tags.find();
        // parent.forEach(function(v){
        //     var datatags=tags.find({parent:v.parent});
        //     if(datatags.count()>0){
        //         alert(datatags.count());
        //         arr.push(v);
        //     }
        // });
        // return arr;
    },
    getNoParenttag: function() {
        if (Session.get('getrresultparenttag') < 1) return true;
        else return false;
    },
    getListTag: function() {
        if (Session.get('parentTagId') !== ''){
            var arr=[];
            var arrtitle=[];
            var dataparent=parent_tags.findOne({title:Session.get('parentTagId')});
            if( ! dataparent )
                 var dataparent=parent_tags.findOne({"i18n.en.title":Session.get('parentTagId')});

            
            if( dataparent ){
                 console.log('obj:', dataparent);
                var data = tags.find({parent:dataparent._id}).fetch();
                 console.log('Tag list:', data.length);
                for(i=0; i < data.length; i++){
                    if( data[i].title )
                        arrtitle.push(data[i].title);
                }
            }
            console.log(arrtitle)
           
            var uniqueNames = [];
            $.each(arrtitle, function(i, el){
                if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
            });

            return uniqueNames;
            
            /*dataparent.forEach(function(v){
                arr.push(v._id);
                
            });
           //return tags.find({ "parent": Session.get('parentTagId') });
           var restag=tags.find({parent:{$in:arr}}); 
           restag.forEach(function(val){
            arrtitle.push(val.title);
           });
           function onlyUnique(value, index, self) { 
            return self.indexOf(value) === index;
            }
            //alert('title=='+arrtitle);
            var unique = arrtitle.filter( onlyUnique );
            return unique;*/

        }
            
    },
    getPriceFilter: function() {
        var min = Session.get('advanced_price_min');
        var max = Session.get('advanced_price_max');
        return { min: min, max: max };
    },
    getAllFilter: function() {
        var allFilter = Session.get('advanced_brand').split(';');
        var res = [];
        for (var i = 0; i < allFilter.length; i++)
            if (allFilter[i] != '')
                res.push(allFilter[i]);
        return res;
    },
    getAllTag: function() {
        var allFilter = Session.get('advanced_tags').split(';');
        var res = [];
        for (var i = 0; i < allFilter.length; i++){
            if (allFilter[i] != ''){
               res.push(allFilter[i]); 
            }
                
        }
            
        return res;
    },
    isBrand: function(letter) {
        letter = letter.toUpperCase();
        var found = false;
        var liste = products.find().fetch();
        for (var i = 0; i < liste.length; i++) {
            if (liste[i].hasOwnProperty('Brand')) {
                var first = liste[i].Brand.toUpperCase().substr(0, 1);
                if (first == letter)
                    found = true;
            }

        }
        //console.log('letter:' + letter + '= ' + found);
        return found;
    },
    listBrand: function(letter) {
        //console.log("Processing " + letter);
        letter = letter.toUpperCase();
        var myBrands = [];
        var liste = products.find().fetch();
        for (var i = 0; i < liste.length; i++) {
            if (liste[i].hasOwnProperty('Brand')) {
                var first = liste[i].Brand.toUpperCase();
                if (first.substr(0, 1) == letter && myBrands.indexOf(first) == -1)
                    myBrands.push(first);
            }

        }

       // console.log('myBrands=' + myBrands);
        return myBrands;
    },
    categories: function() {
        var currentCategory = Router.current().route.getName();
        if (route == 'details') {
            //console.log('Entering details page');
            var productId = Router.current().params.id;
            var title = this.params.id;
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
            var product = products.findOne({ "title": { $regex: new RegExp(title, "i") } });

            currentCategory = product.category;
        } else if (route == 'listing') {

            var title = this._id;
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
            var currentCategory = categories.findOne({ "title": { $regex: new RegExp(title, "i") } })._id;
        } else {
            //console.log('Entering any page');
            return;
        }
        var listCategories = [];
        var obj = categories.findOne({ "_id": currentCategory });
        while (obj != null && obj.parent != "0") {
            listCategories.push(obj);
            currentCategory = obj.parent;
            obj = categories.findOne({ "_id": currentCategory });
        }
        listCategories.push(obj);
        var res = [];
        for (var i = listCategories.length - 1; i >= 0; i--)
            res.push(listCategories[i]);
        return res;
    },
    currentLetter: function() {
        return Session.get('currentLetter');
    },
    getListParent: function() {
        // alert("id " + id);
        //console.log("MYID="+id);
        var id = Session.get("MENUID");
        var list = [];
        var currentCategory = categories.findOne({ "_id": id });
        //console.log("currentCategory " + currentCategory);
        list.push(currentCategory);
        var parent = (typeof currentCategory!='undefined')? currentCategory.parent:'';
        if( parent ){
            while (parent != " " && parent != "0") {
                currentCategory = categories.findOne({ "_id": parent });
                parent=currentCategory.parent;
                list.push(currentCategory);

            }
        }
        var reverse = [];
        for (var i = list.length - 1; i > -1; i--) {
            reverse.push(list[i]);
        }
        //onsole.log("reverse " + JSON.stringify(reverse));
        return reverse;
    }
});

Template.myrefine.onRendered(function() {
    $('#makara').on('slideStop', function(ev) {
        $(".slider.slider-horizontal .slider-tick-label-container .slider-tick-label").css('margin-left', '0px');
        //console.log('sliderstop');
        var slide = Number($(".tooltip-inner").text().split(':')[0].replace(' ', '')); //$("#sl2").data('slider-min');
        Session.set('advanced_price_max', slide);
        Session.set('advanced_price_min', 0);
        Router.go('/advanced');
    });
    var currenturl = window.location.href;
    if (currenturl.indexOf("category")>=0 || currenturl.indexOf("details")>=0 ) {
        Session.set('advanced_brand', '');
        Session.set('advanced_tags', '');
        Session.set('advanced_price_max', 100000000);
        Session.set('parentTagId', '');
    }
    


});
