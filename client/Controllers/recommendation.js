Template.recommendation.helpers({

    products: function() {
        //alert('myid=='+this._id);
        function shuffle(o) {
            for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }
        var myArray = [];
        var resultRandom = [];
        var result = products.find({_id:{$ne:this._id}});
        result.forEach(function(value) {
            myArray.push(value);
        });
        var arrayRandom = shuffle(myArray);
        for (var ran = 0; ran < 4; ran++) {
            if (arrayRandom[ran]) {
                resultRandom.push(arrayRandom[ran]);
            }
        }
        return resultRandom;
    },
    getAttribprice: function(oldId) {
        //var attrprice = attribute.findOne({"product":oldId});
        Meteor.call('getAttrPrice', oldId, function(err, data) {
            if (!err) {
                var attr = '.price' + data.product;
                var price = data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                $(attr).html('ریال ' + price);
                //console.log('oldiD= ' + data.product + "price =" + data.price)
                Session.set('priceAttr',data.price);
            }
        });
    }
});
Template.relateDetail.helpers({

    products: function() {
        function shuffle(o) {
            for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }

        var resultRandom = [];
        var myArray = [];
        var result2 = products.findOne({_id:this._id});
        var result3 = result2.recommended;

        for(var i=0;i<result3.length;i++){
            var currentProduct=products.findOne({_id:result3[i]});
            resultRandom.push(currentProduct);
        }
        //console.log("resultRandom "+resultRandom);
        var arr = shuffle(resultRandom);
        for (var ran = 0; ran < 4; ran++) {
            if (arr[ran]) {
                myArray.push(arr[ran]);
            }
        }
        return myArray;
    },
    getAttribprice: function(oldId) {
        //var attrprice = attribute.findOne({"product":oldId});
        Meteor.call('getAttrPrice', oldId, function(err, data) {
            if (!err) {
                var attr = '.price' + data.product;
                var price = data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                $(attr).html('ریال ' + price);
                //console.log('oldiD= ' + data.product + "price =" + data.price)
                Session.set('priceAttr',data.price);
            }
        });
    }
});

Template.relateReward.helpers({

    products: function() {
        function shuffle(o) {
            for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        }
        var myArray = [];
        var resultRandom = [];
        var result = products.find({_id:{$ne:this._id}});
        result.forEach(function(value) {
            myArray.push(value);
        });
        var arrayRandom = shuffle(myArray);
        for (var ran = 0; ran < 4; ran++) {
            if (arrayRandom[ran]) {
                resultRandom.push(arrayRandom[ran]);
            }
        }
        return resultRandom;
    },
    getAttribprice: function(oldId) {
        //var attrprice = attribute.findOne({"product":oldId});
        Meteor.call('getAttrPrice', oldId, function(err, data) {
            if (!err) {
                var attr = '.price' + data.product;
                //$(attr).html('ریال ' + data.price);
                var price = data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                $(attr).html('ریال ' + price);
                //console.log('oldiD= ' + data.product + "price =" + data.price)
            }
        });
    }
});