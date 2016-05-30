Session.set('multiUploadContentAdd', '');
Session.set('multiUploadContent', '');
//Session.set('numberOfReviews', 2);
Session.set('contentlimit', 6);
Session.set('numberOfReviews', 5);
Session.set('toggleReview',1);
Session.set("filter", "");
Session.set('fiterValue', "");
Session.set('removefilter', '');
Meteor.call('getPath', function(err, res) {
    Session.set('path', res);
});

var processScroll = true;
$(window).scroll(function() {
    if (processScroll  && $(window).scrollTop() > $(document).height() - $(window).height() - 100) {
        processScroll = false;

    var oldLimit=Session.get('contentlimit');
    oldLimit+=6;
    Session.set('contentlimit',oldLimit);
    processScroll = true;

    }
});

Template.addContent.events({
    'submit form': function(event) {
        event.preventDefault();
        var datestr = new Date().toString("yyyy-MM-dd HH:mm:ss");
        var timestamp = (new Date(datestr.split(".").join("-")).getTime()) / 1000;
        var author = Meteor.userId();
        var title = $('#title').val();
        var content = $('#editor1').val();
        var typeid = $('#type').val();
        var category = $('#catId').val();
        var url = $('#url').val();
        var date = timestamp;
        var imgArray = Session.get('multiUploadContentAdd').split(":");
        //hamly
        //alert(Session.get('ADDTAGS'));
        var getallTag=Session.get('ADDTAGS').split(";");
        // console.log('getallTag >>>>');
        // console.log(getallTag);

        //hamly

        Meteor.call('addContent', title, content, typeid, date, imgArray, author, category, url,getallTag);
        Session.set('multiUploadContentAdd', '');
         Session.set('ADDTAGS', '');
        Router.go('managecontent');
    },
    'change #image': function(event) {
        event.preventDefault();
        var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            images.insert(files[i], function(err, fileObj) {
                var strImage = null;
                if (Session.get('multiUploadContentAdd')) {
                    strImage = Session.get('multiUploadContentAdd') + ":" + fileObj._id;
                } else {
                    strImage = fileObj._id;
                }
                Session.set('multiUploadContentAdd', strImage);

            });
        }
    },
    'click #rmFile': function(event) {
        event.preventDefault();
        var result = confirm('Do you want to delete?');
        if (result) {
            var aferRemove = Session.get('multiUploadContentAdd').replace(this.image, '');
            Session.set('multiUploadContentAdd', aferRemove);
            images.remove(this.image, function(err, file) {
                if (err) {
                    console.log('error', err);
                } else {
                    //console.log('remove success');
                    success();
                };
            });
        }

    },
    'click #btnaddTags':function(event){
        event.preventDefault();
        var txttag =$("#txttag").val();
        if(txttag){
            if(Session.get("ADDTAGS")){
            var allTags = Session.get('ADDTAGS')+";"+txttag;
            Session.set("ADDTAGS",allTags);
            }else{
                Session.set("ADDTAGS",txttag);
            }
            if(TAPi18n.getLanguage()=='fa'){
                Bert.alert('برچسب است، شده است اضافه کنید!','success','growl-bottom-right');
            }else{
                Bert.alert('Tag has been add','success','growl-bottom-right');
            }
            $('.close').click();
        }else{
            $('#textreq').removeAttr('class');
        }
    }
});
Template.addContent.helpers({
    getIdImage: function() {
        var arr = [];
        var arrayImage = Session.get('multiUploadContentAdd').split(":");
        for (var i = 0; i < arrayImage.length; i++) {
            if (arrayImage[i]) {
                var obj = {
                    image: arrayImage[i]
                };
                arr.push(obj);
            }
        }
        return arr;
    }
});
Session.get('UPDATEIMAGEID', '');
Template.updateContent.events({
    'click #btnUpdate': function(event) {
        event.preventDefault();
        var arrayIMG = [];
        var datestr = new Date().toString("yyyy-MM-dd HH:mm:ss");
        var timestamp = (new Date(datestr.split(".").join("-")).getTime()) / 1000;
        var author = Meteor.userId();
        var title = $('#title').val();
        var content = CKEDITOR.instances.editor1.getData(); //$('#editor1').val();
        var typeid = $('#type').val();
        var category = $('#catId').val();
        var url = $('#url').val();
        var date = timestamp;

        $('input[name="checkImg"]:checked').each(function() {
            arrayIMG.push(this.value);
        });

        if (typeid == "" || category == "") {
            console.log("Some field is require. Check again!");
        } else {

            var obj = {
                title: title,
                image: arrayIMG,
                url: url,
                author: author,
                content: content,
                typeid: typeid,
                category: category,
                date: timestamp
            };
            contents.update(this._id, obj);
            Session.set('multiUploadContentAdd', '');
            Session.set('multiUploadContent', '');
            Router.go('managecontent');
            //console.log("updated!");
        }
    },
    'change #image': function(event) {
        event.preventDefault();
        var arrayImage = [];
        var imagsearr = this.image;
        for (var j = 0; j < imagsearr.length; j++) {
            arrayImage.push(imagsearr[j]);
        }

        var files = event.target.files;
        for (var i = 0, ln = files.length; i < ln; i++) {
            images.insert(files[i], function(err, fileObj) {

                if (Session.get('multiUploadContent')) {
                    var strImage = Session.get('multiUploadContent') + ',' + fileObj._id;
                } else {

                    var strImage = arrayImage.toString() + ',' + fileObj._id;

                }
                Session.set('multiUploadContent', strImage);

            });

        }
    }
});

Template.updateContent.helpers({
    getIdImage: function(image) {
        var imageArr = null;
        if (Session.get('multiUploadContent')) {
            imageArr = Session.get('multiUploadContent').split(',');
        } else {
            imageArr = image;
        }

        var nameImage = [];
        for (var i = 0; i < imageArr.length; i++) {
            var img = images.findOne({ _id: imageArr[i] });
            if (!img)
                continue;
            if (!img.copies)
                continue;
            //console.log(img.copies.images.key);
            var name = img.copies.images.key;
            var obj = {
                imageId: imageArr[i],
                imageName: name
            };
            nameImage.push(obj);
        }
        //console.log('All img=' + JSON.stringify(nameImage));
        return nameImage;
    }
});

/*Template.webzinelisting.rendered = function() {
    var pgwSlider = $('.pgwSlider').pgwSlider();
    pgwSlider.startSlide();
    
};*/
Template.webzinelisting.events({
    'click ul li#menu':function(e){
        e.preventDefault();
        $(e.currentTarget).attr("class","currentActive");
        $(e.currentTarget).prevAll('li').removeAttr('class');
        $(e.currentTarget).nextAll('li').removeAttr('class');
        var curMenu = $(e.currentTarget).attr("data-text");;
        Session.set("CURRENTMENU",curMenu);
    }
});
Template.webzinelisting.helpers({
    getCategories:function(id){
        return categories.find({parent:" "});
    },
    newwebzinelists: function() {
        var arr = [];
        var i = 0;
        var type = contents_type.findOne({ "type": "Webzine" });
        var typid=type._id;
        var curCategory = Session.get("CURRENTMENU");
        var curCate = categories.findOne({$or:[{"i18n.en.title":curCategory},{"title":curCategory}]});
        if(curCategory!==undefined){
            if(curCate){
                var myCurCate = curCate._id;
                var result = contents.find({$and:[{"typeid":typid},{"category":myCurCate}]}/*, { limit: Session.get('contentlimit'),sort: {date:-1} }*/);
            }
        }
        if(!curCategory || curCategory === undefined){
            var result = contents.find({"typeid": typid}/*, { limit: Session.get('contentlimit'),sort: {date:-1} }*/);
        }

        return result;
    },
    webzinelists: function() {
        var arr = [];
        var i = 0;
        var type = contents_type.findOne({ "type": "Webzine" });
        var typid=type._id;
        var result = contents.find({"typeid": typid}, { limit: Session.get('contentlimit'),sort: {date:-1} });
        result.forEach(function(value) {
            var obj = {
                _id: value._id,
                number: i,
                title: value.title,
                image: value.image,
                author: value.author,
                content: value.content,
                typeid: value.typeid,
                category: value.category,
                date: value.date,
                review: value.review
            };
            arr.push(obj);
            i = i + 1;
        });
        return arr;
    },
    odd: function(number) {
        if (number % 3 == 0) {
            return true;
        } else {
            return false;
        }
    },
    getCatergoryName: function(categoryId) {
        return categories.findOne(categoryId).title;
    },
    isFirstWebzine: function() {
        i = i + 1;
        if (i <= 1) return false;
        else return true;
    },
    getImage: function(id) {
        var p = contents.findOne({ _id: id });
        if (p.image instanceof Array)
            return p.image[0];
        else
            return p.image;
    }
});
Session.set("commentValidation", "");
Template.webzinedetails.helpers({
    // related_product: function( categoryId ){
    //  function shuffle(o){
    //            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    //            return o;
    //        }
    //        var myArray=[];
    //        var resultRandom=[];
    //        var result=products.find({category:categoryId});
    //        result.forEach(function(value){
    //            myArray.push(value);
    //        });
    //        var arrayRandom=shuffle(myArray);
    //        for(var ran=0;ran<4;ran++){
    //            if(arrayRandom[ran]){
    //               resultRandom.push(arrayRandom[ran]);
    //            }

    //        }
    //        var dataLenght=false;
    //        if(resultRandom.length>0) dataLenght=true;
    //        return {productsRelat:resultRandom,dataLenght:dataLenght};

    // },
    related: function(category, id) {
       // console.log("article related of " + category);
        var list = contents.find({ category: category, _id: { $not: id } });
        var max = list.count();
        //console.log('relatedcount=' + max);
        var index = Math.floor((Math.random() * max) + 1);
        //console.log('index=' + index);
        if (max == 0)
            return null;
        else
            return list.fetch()[index - 1];
    },
    getErrormsg: function() {
        return Session.get("commentValidation");
    },
    getComment: function() {
        var comment = contents.findOne({ _id: this._id });
        if (comment) {
            return comment.review;
        } else {
            return;
        }
    },
    getUsername: function(userid) {
        var user = users.findOne(userid);
        if (user) return user.profile.firstname + ' ' + user.profile.lastname
    },
    getarticle: function() {
        var article = contents_type.findOne({ _id: this.typeid }).type;
        return article;
    },
    getReviews: function(reviews, filtre, toremove) {
        if (Session.get('fiterValue') == "" || Session.get('fiterValue') == "undefined") {
            var lastResult = [];
            var numberOfResult = Session.get('numberOfReviews');

            if (numberOfResult > reviews.length)
                numberOfResult = reviews.length;
            //console.log('NUMBER OF lastResult.length ' + numberOfResult);
            for (var i = 0; i < numberOfResult; i++)
                lastResult.push(reviews[i]);

            //console.log('NUMBER OF lastResult.length ' + lastResult.length);
            return lastResult;

        }
        //console.log('Calling filterReview=' + reviews.length);
        var values = Session.get('fiterValue').split(':');
        //fiterValue
        var ages = [];
        var myTags = [];
        var grades = [];

        for (var i = 0; i < values.length; i++) {
            var param = values[i];
            if (param == '')
                continue;
            //console.log("Processing " + param);
            if (param.indexOf('-') >= 0) {
                ages.push(param);
            } else if (param.indexOf('/') >= 0) {
                grades.push(param);
            } else {
                myTags.push(param);
            }
        }

        // console.log('ages:' + ages.length);
        // console.log('myTags:' + myTags.length);
        // console.log('grades:' + grades.length);

        var results = [];
        for (var i = 0; i < ages.length; i++) {
            var ageMin = Number(ages[i].split('-')[0]);
            var ageMax = Number(ages[i].split('-')[1]);

            // console.log('min:' + ageMin);
            // console.log('max:' + ageMax);
            //Loop into reviews
            for (var j = 0; j < reviews.length; j++) {
                var curUser = users.findOne({ "_id": reviews[j].user });
                if (Number(curUser.profile.age) <= ageMax && Number(curUser.profile.age) >= ageMin) {
                    results.push(reviews[j]);

                }

            }
        }
        // console.log('Size of the rest:' + reviews.length);
        // console.log('Still in the sand after ager filter:' + results.length);
        if (results.length > 0) {
            //console.log('remise a 0');
            reviews = [];
            reviews = results.slice(0);
            results = [];
        }

        //console.log('Size of the rest:' + reviews.length);
        for (var i = 0; i < myTags.length; i++) {
            var curTag = myTags[i];
            //console.log('tagging ' + curTag);
            for (var j = 0; j < reviews.length; j++) {
                var curUser = users.findOne({ "_id": reviews[j].user });
                if (curUser.profile.tag.indexOf(curTag) >= 0)
                    results.push(reviews[j]);
            }
        }

        //console.log('Still in the sand(tags):' + results.length);
        if (results.length > 0) {
            //console.log('remise a 0');
            reviews = [];
            reviews = results.slice(0);
            results = [];

        }
        if (grades.length == 0)
            results = reviews.slice(0);
        //console.log('Size of the rest:' + reviews.length);
        for (var i = 0; i < grades.length; i++) {
            var curGrade = grades[i].split('/')[0];
            //Loop into reviews

            for (var j = 0; j < reviews.length; j++) {

                if (Number(reviews[j].grade) == Number(curGrade) && results.indexOf(reviews[j]) < 0) {
                    results.push(reviews[j]);
                    //console.log('Comparing ' + curGrade + ' and ' + reviews[j].grade);
                }

            }
        }

        // console.log('Still in the sand(grades):' + results.length);
        // console.log('afterFilter:' + results.length);

        var lastResult = [];
        var numberOfResult = Session.get('numberOfReviews');

        if (numberOfResult > results.length)
            numberOfResult = results.length
        //console.log('NUMBER OF lastResult.length ' + numberOfResult);
        for (var i = 0; i < numberOfResult; i++)
            lastResult.push(results[i]);

        //console.log('NUMBER OF lastResult.length ' + lastResult.length);
        //return lastResult;
    },
});

Template.addContent.helpers({
    getFEContext: function() {
        var self = this;
        return {
            // Set html content
            _value: self.myDoc.myHTMLField,

            // Set some FE options
            toolbarInline: true,
            initOnClick: false,
            tabSpaces: false,

            // FE save.before event handler function:
            "_onsave.before": function(e, editor) {
                // Get edited HTML from Froala-Editor
                var newHTML = editor.html.get();
                // Do something to update the edited value provided by the Froala-Editor plugin, if it has changed:
                if (!_.isEqual(newHTML, self.myDoc.myHTMLField)) {
                    //console.log("onSave HTML is :" + newHTML);
                    myCollection.update({ _id: self.myDoc._id }, {
                        $set: { myHTMLField: newHTML }
                    });
                }
                return false; // Stop Froala Editor from POSTing to the Save URL
            }
        };
    },
    contentposttype: function() {
        var co = contents_type.find();
        return co;
    },
    getcategory: function() {
        return categories.find();
    }
});

Template.updateContent.helpers({
    contenttype: function() {
        return contents_type.find();
    },
    getcategory: function() {

        return categories.find();
    },
    getCategoryOne: function(cat) {
        //console.log('ILOVEU:' + cat);
        return categories.findOne({ _id: cat });
    },
    getText: function(content) {
        return Session.get('contentText');
    },
    getToUpadteSelectType: function(id) {
        return contents_type.findOne({ _id: id });
    }

});

//ManageContent
Template.managecontent.helpers({
    getAllImg: function(c) {
        var p = contents.findOne({ _id: c });
        if (p.image instanceof Array)
            return p.image;
        else
            return [p.image];
    },
    managecontent: function() {
        return contents.find();
    },
    getTypename: function() {
        var id = this.typeid;
        return contents_type.findOne({ _id: id }).type;
    },
    getCatname: function() {
        var id = this.category;
        return categories.findOne({ _id: id }).title;
    }

});
//Remove all content
Template.managecontent.events({
    'click #remove': function() {
        var id = this._id;
        if (confirm("Are you sure you want to delete this Contents?")) {
            Meteor.call('deleteContent', id);
        }
    }
});

Template.tutonew.helpers({
    getTutoCategory: function() {
        return categories.find({ "parent": " " });
    },
    getCategoryImg: function(id) {
        var p = categories.findOne({ _id: id });
        if (p.image instanceof Array)
            return p.image[0];
        else
            return p.image;
    }
});
Template.tutolisting.events({
    'click #getPoint': function(event) {
        event.preventDefault();
        var userid = Meteor.userId();
        var earnpoints = Meteor.users.findOne({ _id: userid });
        var point = Number(earnpoints.profile.shipcard.point) + 5;
        var obj = {
            profile: {
                firstname: mypoints.profile.firstname,
                lastname: mypoints.profile.lastname,
                country: mypoints.profile.country,
                city: mypoints.profile.city,
                shipcard: {
                    point: point
                }
            }
        };

        Meteor.call('earnPoint', userid, obj);
    }
});

Template.tutolisting.helpers({
    getContent: function(id) {
        var type = contents_type.findOne({ type: "Tuto" });
        //console.log('makar:' + type._id + 'categoryId:' + id);

        //console.log('Displaying tuto');
        var string = type._id + ':' + id;
        Session.set('Tuto', string);
        return contents.find({ category: id ,typeid: type._id },{sort: {_id:-1}});
    },
    getTutoImg: function(id) {
        var p = contents.findOne({ _id: id });
        if (p.image instanceof Array)
            return p.image[0];
        else
            return p.image;
    }
});

Template.tutodetails.helpers({
    show_review_more5:function(review){
        return (review.length > 5);
    },
    getImgTuTO: function(id) {
        var p = contents.findOne({ _id: id });
        if (p.image instanceof Array)
            return p.image[0];
        else
            return p.image;
    },
    getTutodetails: function(id) {
        $("#mainVideo").load();
        return contents.findOne({ _id: id });
    },
    getRelated: function() {
        var ret = [];
        var currentTuto = contents.findOne({ "_id": this._id });
        var currentCategory = currentTuto.category;
        var currenttypeid = currentTuto.typeid;
        var result = contents.find({ typeid: currenttypeid, category: currentCategory }).fetch();
        //console.log('ALL RELATED:' + result.length);
        var max = 0;
        if (result.length < 4)
            max = result.length;
        else
            max = 4;
        var historique = [];
        for (var i = 0; i < max; i++) {
            var index = Math.floor((Math.random() * max));
            while (historique.indexOf(index) != -1)
                index = Math.floor((Math.random() * max));
            historique.push(index);
            ret.push(result[index]);


        }
        //console.log(ret.length);
        return ret;
    },
    tuto: function() {
        return contents.find({});
    },
    getReviews: function(reviews, filtre, toremove) {

        if (Session.get('fiterValue') == "" || Session.get('fiterValue') == "undefined") {
            var lastResult = [];
            var numberOfResult = Session.get('numberOfReviews');

            if (numberOfResult > reviews.length)
                numberOfResult = reviews.length;
            //console.log('NUMBER OF lastResult.length ' + numberOfResult);
            for (var i = 0; i < numberOfResult; i++)
                lastResult.push(reviews[i]);

            //console.log('NUMBER OF lastResult.length ' + lastResult.length);
            return lastResult;

        }
        //console.log('Calling filterReview=' + reviews.length);
        var values = Session.get('fiterValue').split(':');
        //fiterValue
        var ages = [];
        var myTags = [];
        var grades = [];

        for (var i = 0; i < values.length; i++) {
            var param = values[i];
            if (param == '')
                continue;
            //console.log("Processing " + param);
            if (param.indexOf('-') >= 0) {
                ages.push(param);
            } else if (param.indexOf('/') >= 0) {
                grades.push(param);
            } else {
                myTags.push(param);
            }
        }

        // console.log('ages:' + ages.length);
        // console.log('myTags:' + myTags.length);
        // console.log('grades:' + grades.length);

        var results = [];
        for (var i = 0; i < ages.length; i++) {
            var ageMin = Number(ages[i].split('-')[0]);
            var ageMax = Number(ages[i].split('-')[1]);

            // console.log('min:' + ageMin);
            // console.log('max:' + ageMax);
            //Loop into reviews
            for (var j = 0; j < reviews.length; j++) {
                var curUser = users.findOne({ "_id": reviews[j].user });
                if (Number(curUser.profile.age) <= ageMax && Number(curUser.profile.age) >= ageMin) {
                    results.push(reviews[j]);

                }

            }
        }
        // console.log('Size of the rest:' + reviews.length);
        // console.log('Still in the sand after ager filter:' + results.length);
        if (results.length > 0) {
            //console.log('remise a 0');
            reviews = [];
            reviews = results.slice(0);
            results = [];
        }

        //console.log('Size of the rest:' + reviews.length);
        for (var i = 0; i < myTags.length; i++) {
            var curTag = myTags[i];
            //console.log('tagging ' + curTag);
            for (var j = 0; j < reviews.length; j++) {
                var curUser = users.findOne({ "_id": reviews[j].user });
                if (curUser.profile.tag.indexOf(curTag) >= 0)
                    results.push(reviews[j]);
            }
        }

        //console.log('Still in the sand(tags):' + results.length);
        if (results.length > 0) {
            //console.log('remise a 0');
            reviews = [];
            reviews = results.slice(0);
            results = [];

        }
        if (grades.length == 0)
            results = reviews.slice(0);
        //console.log('Size of the rest:' + reviews.length);
        for (var i = 0; i < grades.length; i++) {
            var curGrade = grades[i].split('/')[0];
            //Loop into reviews

            for (var j = 0; j < reviews.length; j++) {

                if (Number(reviews[j].grade) == Number(curGrade) && results.indexOf(reviews[j]) < 0) {
                    results.push(reviews[j]);
                    //console.log('Comparing ' + curGrade + ' and ' + reviews[j].grade);
                }

            }
        }

        // console.log('Still in the sand(grades):' + results.length);
        // console.log('afterFilter:' + results.length);

        var lastResult = [];
        var numberOfResult = Session.get('numberOfReviews');

        if (numberOfResult > results.length)
            numberOfResult = results.length;
        //console.log('NUMBER OF lastResult.length ' + numberOfResult);
        for (var i = 0; i < numberOfResult; i++)
            lastResult.push(results[i]);

        //console.log('NUMBER OF lastResult.length ' + lastResult.length);
        return lastResult;


    },
    getReviewsShort: function(reviews, limit) {
        if (Session.get("filter") == "") {
            var ret = [];
            for (var i = 0; i < reviews.length && i <= limit; i++) {
                var current = reviews[i];
                ret.push(current);
            }
            return ret;
        } else {
            var ret = [];
            for (var i = 0; i < reviews.length && i <= limit; i++) {
                var current = reviews[i];
                var currentAuthor = users.findOne({ _id: current.user });
                if (currentAuthor.emails[0].address == Session.get("filter"))
                    ret.push(current);
            }
            return ret;
        }
    },
    getcurrentURl: function() {
        var routeName = window.location.href;
        //console.log("curenturl: " + routeName);
        return routeName;
    }

});
Template.webzinedetails.events({
    'click #show1':function(e){
        e.preventDefault();
        var data_toggle=$('#show1').attr('data-toggle');
        Session.set('toggleReview',data_toggle);
    },
    "click .morereviews": function(e) {
        e.preventDefault();
        var counter = $(".morereviews").attr("data-toggle");
        var update = "";
        if (counter == 0) {
            Session.set("numberReviews", true);
            if (TAPi18n.getLanguage() == 'fa') {
                $(".morereviews").text("Persian hide");
            }else{
                $(".morereviews").text("HIDE REVIEW");
            }
            $(".morereviews").attr("data-toggle", "1");
            $('.close').click();
        } else {
            Session.set("numberReviews", false);
            $(".morereviews").attr("data-toggle", "0");
            if (TAPi18n.getLanguage() == 'fa') {
                $(".morereviews").text("هیچ بررسی");
            }else{
               $(".morereviews").text("MORE REVIEWS");
            }
            $('.close').click();
        }
        return update;
    },
    'click .morereview': function(e) {
        e.preventDefault();
        var last = Session.get('numberOfReviews');
        var sum = Number(last) + 5;
        var update = Session.set('numberOfReviews', sum);
        return update;
    },
    'submit form': function(e, tpl) {
        e.preventDefault();
        var userid = Meteor.userId();
        var title = tpl.$("#title").val();
        var text = tpl.$("#comment").val();
        //var grade = tpl.$("#sel1").val();
        var grade = Session.get("STARRATE");
        var profile = Meteor.users.findOne({ _id: userid }).profile;
        var point = 5;
        var idreview = Random.id();
        var webzineId=tpl.$("#productreviewid").val();
        //console.log("grade :"+grade);
        var upoint = 0;
        if (profile.shipcard != null)
            upoint = Number(profile.shipcard.point);
        else
            upoint = 0;
        upoint += point;

        if (userid == null) {
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert('!شما باید وارد سیستم شوید برای ارسال یک بررسی', 'success', 'growl-bottom-right');
            } else {
                Bert.alert('You have to be logged to submit a review!', 'success', 'growl-bottom-right');
            }
            $('.close').click();
            return;
        }
        if(text == ""){
            if (TAPi18n.getLanguage() == 'fa') {
                $("#validwebzine1").text("لطفا عنوان ورودی در اینجا ");
            } else {
                $('#validwebzine1').text("Title requier!");
            }
        }else{
            Meteor.call('addReviewwebzine',idreview, title, text, grade, userid, this._id, function(err,id){
                if(err){
                    console.log("error " + err.reason);
                }else{
                    Session.set("STARRATE",'');
                    $("#title").val('');
                    $("#comment").val('');
                    $('#validwebzine').text("");
                    $('#validwebzine1').text("");
                    if (TAPi18n.getLanguage() == 'fa') {
                        Bert.icons[ 'my-error' ] = 'fa-review-iconbg';
                        Bert.alert({
                        message: 'نظر شما با موفقیت ثبت شد!',
                        type: 'my-error',
                        style: 'growl-bottom-right',
                        icon: 'fa-review-iconbg'
                        });
                    } else {
                        Bert.icons[ 'my-error' ] = 'fa-review-iconbg';
                        Bert.alert({
                        message: 'Add review success !',
                        type: 'my-error',
                        style: 'growl-bottom-right',
                        icon: 'fa-review-iconbg'
                        });
                    }
                    $('.close').click();
                 }
            });
        }

    },
    'click .morereview': function(e) {
        e.preventDefault();
        var last = Session.get('numberOfReviews');
        var sum = Number(last) + 5;
        var update = Session.set('numberOfReviews', sum);
        return update;

    },
    "submit .addComment": function(e, tmp) {
        e.preventDefault();
        var title = $("#inputName").val();
        var description = $("#description").val();
        var grade = 0;
        $(".group-grade input").each(function() {
            if (this.checked) {
                grade = parseInt($(this).val());
            }
        });
        if (title == "" || description == "" || grade == 0 || !Meteor.userId()) {
            $("#inputName").parent().removeClass("has-error");
            $("#description").parent().removeClass("has-error");
            $(".group-grade").removeClass("has-error");
            $(".group-grade").children(".with-errors").html("");
            if (title == "")
                $("#inputName").parent().addClass("has-error");
            if (description == "")
                $("#description").parent().addClass("has-error");
            if (grade == 0) {
                var error = $(".group-grade").attr("data-error");
                $(".group-grade").addClass("has-error");
                $(".group-grade").children(".with-errors").html(error);
            }
            if (!Meteor.userId()) {
                var msg = '<div class="alert-danger form-control" role="alert">Please <a href="/login">login </a>before add comment.</div>';
                Session.set("commentValidation", msg);
            }
        } else {
            var userId = Meteor.userId();
            var review = [];
            var con = contents.findOne({ _id: this._id });
            var review = (con.review) ? con.review : [];
            review.push({ title: title, description: description, grade: grade, userId: userId });
            var id = contents.update(this._id, { $set: { review: review } })
            if (id) {
                $("#inputName").val("");
                $("#description").val("");
                $("#inputName").parent().removeClass("has-error");
                $("#description").parent().removeClass("has-error");
                $(".group-grade").removeClass("has-error");
                $(".group-grade").children(".with-errors").html("");
                Session.set("commentValidation", "");
            }
        }
    },
    'click #popup': function(e) {
        e.preventDefault();
        $("#myModaltuto2").css("display", "none");
        $("#myModaltuto").parent().hide();
        //console.log("hide");
    },
    'click #popup1': function(e) {
        $("#myModaltuto").parent().hide();
    },
    'click .rateStar': function(e, tpl) {
        e.preventDefault();
        var value = tpl.$(e.currentTarget).attr('data-star');
        //alert("Rating "+value);
        Session.set("STARRATE", value);
    },
    'click div i.rateStar': function(e) {
        var currentStar = $(e.currentTarget).attr('class');
        if (!currentStar.match('yellow-star')) {
            $(e.currentTarget).addClass('yellow-star');
            $(e.currentTarget).parent().prevAll('div').children('i').addClass('yellow-star');
        } else {
            $(e.currentTarget).parent().nextAll('div').children('i').removeClass('yellow-star');
        }

    }
});

Template.tutodetails.events({
    'click #show1':function(e){
        e.preventDefault();
        var data_toggle=$('#show1').attr('data-toggle');
        Session.set('toggleReview',data_toggle);
    },
    "click .morereviews": function(e) {
        e.preventDefault();
        var counter = $(".morereviews").attr("data-toggle");
        var update = "";
        if (counter == 0) {
            Session.set("numberReviews", true);
            if (TAPi18n.getLanguage() == 'fa') {
                $(".morereviews").text("Persian hide");
            }else{
                $(".morereviews").text("HIDE REVIEW");
            }
            $(".morereviews").attr("data-toggle", "1");
            $('.close').click();
        } else {
            Session.set("numberReviews", false);
            $(".morereviews").attr("data-toggle", "0");
            if (TAPi18n.getLanguage() == 'fa') {
                $(".morereviews").text("هیچ بررسی");
            }else{
               $(".morereviews").text("MORE REVIEWS");
            }
            $('.close').click();
        }
        return update;
    },
    'click .morereview': function(e) {
        e.preventDefault();
        var last = Session.get('numberOfReviews');
        var sum = Number(last) + 5;
        var update = Session.set('numberOfReviews', sum);
        return update;
    },
    'click .rateStar': function(e, tpl) {
        e.preventDefault();
        var value = tpl.$(e.currentTarget).attr('data-star');
        //alert("Rating "+value);
        Session.set("STARRATE", value);
    },
    'click div i.rateStar': function(e) {
        var currentStar = $(e.currentTarget).attr('class');
        if (!currentStar.match('yellow-star')) {
            $(e.currentTarget).addClass('yellow-star');
            $(e.currentTarget).parent().prevAll('div').children('i').addClass('yellow-star');
        } else {
            $(e.currentTarget).parent().nextAll('div').children('i').removeClass('yellow-star');
        }

    },
    'submit form': function(e, tpl) {
        e.preventDefault();
        Session.set('toggleReview',1);
        $('#show1').attr('data-toggle',0);
        var userid = Meteor.userId();
        var title = tpl.$("#title").val();
        var comment = tpl.$("#comment").val();
        //var grade = tpl.$("#sel1").val();
        var grade = Session.get("STARRATE");
        var profile = Meteor.users.findOne({ _id: userid }).profile;
        var point = 5;
        var idreview = Random.id();

        if (profile.shipcard != null)
            var upoint = Number(profile.shipcard.point);
        else
            var upoint = 0;
        upoint += point;

        if (userid == null) {
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert('!شما باید وارد سیستم شوید برای ارسال یک بررسی', 'success', 'growl-bottom-right');
            } else {
                Bert.alert('You have to be logged to submit a review!', 'success', 'growl-bottom-right');
            }
            $('.close').click();
            return;
        }
        if (comment == "") {
                if (TAPi18n.getLanguage() == 'fa') {
                    Bert.alert('لطفا متن را قبل از کلیک بر روی دکمه!', 'success', 'growl-bottom-right');
                } else {
                    Bert.alert('Please put a text before to click the submit!', 'success', 'growl-bottom-right');
                }
                $(".close").click();
        }else{
            Meteor.call('addReviewTuto',idreview, title, comment, grade, Meteor.userId(), this._id, function(err){
                if(!err){
                    var grade = Session.get("STARRATE",'');
                    var title = tpl.$("#title").val('');
                    var comment = tpl.$("#comment").val('');
                    if (TAPi18n.getLanguage() == 'fa') {
                        Bert.icons[ 'my-error' ] = 'fa-review-iconbg';
                        Bert.alert({
                        message: 'نظر شما با موفقیت ثبت شد!',
                        type: 'my-error',
                        style: 'growl-bottom-right',
                        icon: 'fa-review-iconbg'
                        });
                    } else {
                        Bert.icons[ 'my-error' ] = 'fa-review-iconbg';
                        Bert.alert({
                        message: 'Add review success !',
                        type: 'my-error',
                        style: 'growl-bottom-right',
                        icon: 'fa-review-iconbg'
                        });
                    }
                    $('.close').click();
                }
            });
        }

        // Meteor.call('earnPoint', userid, upoint, function(err) {
        //     if (err) {
        //         console.log("error " + reason);
        //     } else {
        //         console.log("success" + upoint);
        //         if (upoint == 10) {
        //             console.log("upoint ==10");
        //             $("#myModaltuto").show();

        //         } else if (upoint == 15) {
        //             $("#myModaltuto2").show();

        //         } else {
        //             $("#myModaltuto").parent().hide();
        //             $("#myModaltuto2").parent().hide();
        //         }
        //     }
        // });
        // if (TAPi18n.getLanguage() == 'fa') {
        //     Bert.alert('شما باید کسب 5 امتیاز بیشتر!', 'success', 'growl-bottom-right');
        // } else {
        //     Bert.alert('You have earn 5 point more!', 'success', 'growl-bottom-right');
        // }
        // $(".close").click();

    },
    'click .morereview': function(e) {
        e.preventDefault();
        var last = Session.get('numberOfReviews');
        var sum = Number(last) + 5;
        var update = Session.set('numberOfReviews', sum);
        return update;
    },
    'click #popup': function(e) {
        e.preventDefault();
        $("#myModaltuto2").css("display", "none");
        $("#myModaltuto").parent().hide();
        //console.log("hide");
    },
    'click #popup1': function(e) {
        $("#myModaltuto").parent().hide();
    },
    /*'click .container':function(evt,tpl) {
        //$(evt.target).attr(“class”)
        var str=$(evt.target).attr('class');
        alert(str);
    },*/
    'click #mainVideo': function(e) {
        var vid = document.getElementById("mainVideo");
        if (vid.paused) {
            vid.play();
            vid.controls = true;
            vid.load;
        }
        else {
            vid.pause();
        }

        var userid = Meteor.userId();
        var contentid = this._id;
        vid.onplay = function() {
            var v = viewing.findOne({$and:[{userid:userid},
                                            {contentid:contentid}]});
            if (v == null) {
                var obj = {
                    userid: userid,
                    contentid: contentid,
                    date:new Date()
                }
                Meteor.call('insertView', obj);

                var uid = Meteor.userId();
                var earngUser = Meteor.users.findOne({ _id: uid});
                if(earngUser != null) {
                    var fpoints = Number(earngUser.profile.shipcard.point)
                    var resultmembership=membership.find();
                    var mbrship = 0;
                    resultmembership.forEach(function(value){
                        if(fpoints >= value.minpoint && fpoints <= value.maxpoint){
                             mbrship = value.name;
                            //console.log(mbrship);
                        }
                    });

                    if(mbrship=='Black')
                        var point=20;
                    else if(mbrship=='Silver')
                        var point=40;
                    else if(mbrship=='Gold')
                        var point=80;
                    //console.log(point);

                    fpoints += point;
                    Meteor.call('earnPoint', uid, fpoints, function(err) {
                     if (err)
                        console.log("error ");
                     else
                        console.log("success " + earngUser.profile.shipcard.point);
                    });
                }
                //console.log(earngUser.profile.shipcard.point);
            } else {
                console.log("Already watched!");
            }
        };
    },

    // event is working fine but doesnt trigger at the right place
    'click .btnShare':function(e){
       /* FB.ui({
            method: 'share',
            href: 'https://developers.facebook.com/docs/',
        },
        // callback
        function(response) {
            if (response && !response.error_message) {
                alert('Posting completed.');
            } else {
                alert('Error while posting.');
            }
        });*/

        var userid = Meteor.userId();
        if (userid == null) {
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert('!شما باید وارد سیستم شوید برای ارسال یک بررسی', 'success', 'growl-bottom-right');
            } else {
                Bert.alert('You have to be logged to share!', 'success', 'growl-bottom-right');
            }
            return;
        }
        var contentid = this._id;
        var profile = Meteor.users.findOne({ _id: userid }).profile;
        var points=profile.shipcard.point;

        var obj = {
            userid: userid,
            contentid: contentid,
            date:new Date()
        }
        //console.log(obj);
        Meteor.call('insertShare', obj);

        var resultmembership=membership.find();
        var mbrship = 0;
        resultmembership.forEach(function(value){
            if(points >= value.minpoint && points <=value.maxpoint){
                 mbrship = value.name;
                //console.log(mbrship);
            }
        });

        if(mbrship=='Black')
            var point=30;
        else if(mbrship=='Silver')
            var point=60;
        else if(mbrship=='Gold')
            var point=120;
        //console.log(point);

        if (profile.shipcard != null)
            var upoint = Number(profile.shipcard.point);
        else
            var upoint = 0;
        upoint += point;

       /* if (userid == null) {
            if (TAPi18n.getLanguage() == 'fa') {
                console.log("log lang fa");
                Bert.alert('!شما باید وارد سیستم شوید برای ارسال یک بررسی', 'success', 'growl-bottom-right');
            } else {
                console.log("log lang");
                Bert.alert('You have to be logged to share!', 'success', 'growl-bottom-right');
            }
           return;
        }*/
        var userShare = share.find({ userid: userid }).count();
        //console.log("userShare "+userShare);

        if (userShare == 0 || userShare == 2 ){
            Meteor.call('earnPoint', userid, upoint, function(err) {
                if (err) {
                    console.log("error ");
                } else {
                    console.log("success" + upoint);
                }
            });
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.alert('شما باید کسب بیشتر امتیاز!', 'success', 'growl-bottom-right');
            } else {
                Bert.alert('You have earn more points!', 'success', 'growl-bottom-right');
            }
        } else {
            console.log("No points!");
        }
    }
});

Template.webzinedetails.helpers({
    show_review_more5:function(review){
        return (review.length > 5);
    },
    getRate: function(num) {
        // var rate = $('fa-star-o');
        var allhtm = '';
        var html = '<div class="col-xs-2 rate-star" style="margin-left:-11px;"><i class="fa fa-star" data-star="1" style="font-size:15px;"></i></div>';
        var htmlyellow = '<div class="col-xs-2 rate-star" style="margin-left:-11px;"><i class="fa fa-star yellow-star" data-star="1" style="font-size:15px;"></i></div>';
        for (var i = 0; i < 5; i++) {
            if (i < Number(num)) {
                allhtm += htmlyellow;
            } else {
                allhtm += html;
            }
        }

        return allhtm;
    },
    suggestion: function(title) {
        return contents.find({ "content": { "$regex": title } });
    },
    getArticle: function(idarticle) {
        return contents.findOne({ "_id": idarticle });
    },
    getTutoes: function(idtutoes) {
        return contents.findOne({ "_id": idtutoes });
    },
    getAllAttributes: function(productId, parent) {
        return attribute.find({ "product": productId, "parent": parent });
    },
    getParentDetails: function(parent) {
        return parentattr.findOne({ "_id": parent });
    },
    listAttr: function(parent) {
       // console.log("OLDID=" + parent);
        return attribute.find({ "product": parent });
    },
    getParentAttr: function(product) {
        //console.log('cherche les attr de ' + product);
        var list = attribute.find({ "product": product }).fetch();
        var out = [];
        for (var i = 0; i < list.length; i++) {
            var contains = 0;
            for (var j = 0; j < out.length; j++)
                if (out[j].parent == list[i].parent)
                    contains = 1;
            if (contains == 0)
                out.push(list[i]);
        }

        return out;
    },
    getShops: function(id) {
        return shops.find({ "products.product": id, "products.quantity": { "$nin": ["0"] } });
    },
    getAttribute: function(id) {

        return attribute.findOne({ "_id": id });
    },
    getTagName: function(tagid) {
        if (tagid != null)
            return tags.findOne({ _id: tagid }).title;
        else
            return;
    },
    getAttr: function(id) {
        return attribute.findOne({ "_id": id });
    },
    getCategoryName: function(categoryid) {
        //console.log("cat:" + categoryid);
        if (categoryid != null)
            return categories.findOne({ _id: categoryid }).title;
        else
            return;
    },
    getShopname: function(id) {
        var shop = shops.findOne({ _id: id });
        if (shop) return shop.name;
    },
    filterReview: function() {
        Tracker.autorun(function() {
            //console.log('RERUNNING');
            return Session.get('fiterValue');
        });
    },
    removeFilter: function() {
        Tracker.autorun(function() {
           // console.log('RERUNNING delete');
            return Session.get('removefilter');
        });
    },
    slic: function(tags) {
        var parentarr = [];
        var valuearr = [];
        var nameParent = [];
        for (var i = 0; i < tags.length; i++) {

            parentarr.push(tags[i].parent);
            valuearr.push(tags[i].value);
        }

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        var unique = parentarr.filter(onlyUnique);
        for (var j = 0; j < unique.length; j++) {
            var name = parent_tags.findOne({ "_id": unique[j] }).title;
            nameParent.push(name);
        }
        var obj = {
            parents: nameParent,
            values: valuearr
        }

        return obj;

    },
    getParentTagName: function(id) {
        return parent_tags.findOne({ "_id": id }).title;
    },
    getReviews: function(reviews, filtre, toremove) {

        if (Session.get('fiterValue') == "" || Session.get('fiterValue') == "undefined") {
            var lastResult = [];
            var numberOfResult = Session.get('numberOfReviews');

            if (numberOfResult > reviews.length)
                numberOfResult = reviews.length
            //console.log('NUMBER OF lastResult.length ' + numberOfResult);
            for (var i = 0; i < numberOfResult; i++)
                lastResult.push(reviews[i]);

            //console.log('NUMBER OF lastResult.length ' + lastResult.length);
            return lastResult;

        }
       // console.log('Calling filterReview=' + reviews.length);
        var values = Session.get('fiterValue').split(':');
        //fiterValue
        var ages = [];
        var myTags = [];
        var grades = [];

        for (var i = 0; i < values.length; i++) {
            var param = values[i];
            if (param == '')
                continue;
            //console.log("Processing " + param);
            if (param.indexOf('-') >= 0) {
                ages.push(param);
            } else if (param.indexOf('/') >= 0) {
                grades.push(param);
            } else {
                myTags.push(param);
            }
        }

        // console.log('ages:' + ages.length);
        // console.log('myTags:' + myTags.length);
        // console.log('grades:' + grades.length);

        var results = [];
        for (var i = 0; i < ages.length; i++) {
            var ageMin = Number(ages[i].split('-')[0]);
            var ageMax = Number(ages[i].split('-')[1]);

            // console.log('min:' + ageMin);
            // console.log('max:' + ageMax);
            //Loop into reviews
            for (var j = 0; j < reviews.length; j++) {
                var curUser = users.findOne({ "_id": reviews[j].user });
                if (Number(curUser.profile.age) <= ageMax && Number(curUser.profile.age) >= ageMin) {
                    results.push(reviews[j]);

                }

            }
        }
        // console.log('Size of the rest:' + reviews.length);
        // console.log('Still in the sand after ager filter:' + results.length);
        if (results.length > 0) {
            //console.log('remise a 0');
            reviews = [];
            reviews = results.slice(0);
            results = [];
        }

        //console.log('Size of the rest:' + reviews.length);
        for (var i = 0; i < myTags.length; i++) {
            var curTag = myTags[i];
            //console.log('tagging ' + curTag);
            for (var j = 0; j < reviews.length; j++) {
                var curUser = users.findOne({ "_id": reviews[j].user });
                if (curUser.profile.tag.indexOf(curTag) >= 0)
                    results.push(reviews[j]);
            }
        }

        //console.log('Still in the sand(tags):' + results.length);
        if (results.length > 0) {
            //console.log('remise a 0');
            reviews = [];
            reviews = results.slice(0);
            results = [];

        }
        if (grades.length == 0)
            results = reviews.slice(0);
        //console.log('Size of the rest:' + reviews.length);
        for (var i = 0; i < grades.length; i++) {
            var curGrade = grades[i].split('/')[0];
            //Loop into reviews

            for (var j = 0; j < reviews.length; j++) {

                if (Number(reviews[j].grade) == Number(curGrade) && results.indexOf(reviews[j]) < 0) {
                    results.push(reviews[j]);
                    //console.log('Comparing ' + curGrade + ' and ' + reviews[j].grade);
                }

            }
        }

        // console.log('Still in the sand(grades):' + results.length);
        // console.log('afterFilter:' + results.length);

        var lastResult = [];
        var numberOfResult = Session.get('numberOfReviews');

        if (numberOfResult > results.length)
            numberOfResult = results.length
        //console.log('NUMBER OF lastResult.length ' + numberOfResult);
        for (var i = 0; i < numberOfResult; i++)
            lastResult.push(results[i]);

        //console.log('NUMBER OF lastResult.length ' + lastResult.length);
        return lastResult;
    },

    getReviewsShort: function(reviews, limit) {
        if (Session.get("filter") == "") {
            var ret = [];
            for (var i = 0; i < reviews.length && i <= limit; i++) {
                var current = reviews[i];
                ret.push(current);
            }
            return ret;
        } else {
            var ret = [];
            for (var i = 0; i < reviews.length && i <= limit; i++) {
                var current = reviews[i];
                var currentAuthor = users.findOne({ _id: current.user });
                if (currentAuthor.emails[0].address == Session.get("filter"))
                    ret.push(current);
            }
            return ret;
        }
    },

    path: function() {
        return Session.get('path');
    },

    selected_attr: function() {
        return Session.get('selected_attr');
    },

    selected_price: function() {
        return Session.get('selected_price');
    },

    selected_point: function() {
        return Session.get('selected_point');
    },

    getcurrentURl: function() {
        var routeName = window.location.href;
        c//onsole.log("curenturl: " + routeName);
        return routeName;
    }
});
