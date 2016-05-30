/*Template.listproducts.onRendered = function() {
  //$('head').append('<script type="text/javascript" src="http://164.138.19.120/js/chien_jquery.contentcarousel.js">');
  IRLibLoader.load('http://164.138.19.120/js/chien_jquery.contentcarousel.js')
}*/
// No need to command this function (getImgForProduct & getImg), please.
//=============update cart===========
updateQty = function(id, qty, price) {
        var subtotal = 0;
        subtotal = parseInt(price) * parseInt(qty);
        Meteor.call('updateCart', id, qty, subtotal);
        var mycart = '';
        userid = Session.get('userId');
        if (userid) {
            mycart = cart.find({ $and: [{ order_status: 0 }, { userId: userid }] });
        }
        var total = 0;
        mycart.forEach(function(value, index) {
            total = total + value.subtotal;
        });
        Session.set("total", total);
    }
    //=============end update cart=======
Template.registerHelper('getCssCDN', function() {
    Meteor.call('getCSSCDN', function(err, ret) {
        Session.set('CSS_CDN', ret);
        // console.log(err);
        // console.log(ret);
    });
    return Session.get('CSS_CDN');

});
Template.registerHelper('farsi', function() {
    if (TAPi18n.getLanguage() == 'fa') {
        return true;
    } else {
        return false;
    }
});
Template.registerHelper('get', function(id_product) {
    //console.log('calling img for '+id_product);
    return getImgForProduct(id_product);

});

Template.registerHelper('getImgForProduct', function(id_product) {
    //console.log('calling img for '+id_product);
    return getImgForProduct(id_product);

});
Template.registerHelper('getImgForProductDetailZoom', function(id_product) {
    //console.log('calling img for '+id_product);
    return getImgForProductDetailZoom(id_product);

});
getImgForProductDetailZoom = function(id_product) {
    var p = products.findOne({ _id: id_product });
    if (p.image instanceof Array)
        var id = p.image[0];
    else
        var id = p.image;
    // console.log('checking for '+id);

    if (id == null) {
        var attr = attribute.findOne({ product: p.oldId });
        id = attr.productImage;
        //console.log('ID='+id);
    }


    if (id == '' || typeof id == "undefined") {
        return '/img/unknown.png';
    } else if (id.indexOf("http://") > -1) {
        //console.log("hi img 2");
        return id;

    } else if (id.indexOf("upload") > -1) {
        //console.log('elseif');
        var img_path = id.replace("/UserUploads", "");

        Meteor.call('checkImgExist', id, id_product, function(err, data) {
            if (err) console.log(err);
            else Session.set('IMAGE' + data.id_product, data.status);
        });
        var product = Session.get('IMAGE' + id_product);
        if (product == 1)
            return '/uploads' + img_path;
        else {
            id = id.replace(/ /g, "%20");
            path = id.replace('/upload/images/', '');
            paths = path.replace("/uploads", "/upload/");

            return Session.get("IMG_CDN") + '/upload/' + paths;
        }

    } else {
        //console.log('finally');
        var img = images.findOne({ _id: id });

        if (img) {
            var idImg = img.copies.images.key;
            //console.log('Image='+idImg);
            Meteor.call('checkImgExist', idImg, id_product, function(err, data) {
                if (err) console.log(err);
                else Session.set('IMAGE' + data.id_product, data.status);
            });
            var product = Session.get('IMAGE' + id_product);
            //console.log('return '+product);
            if (product == 1)
                return '/uploads/' + idImg;
            else {
                idImg = idImg.replace(/ /g, "%20");
                path = idImg.replace('/upload/images/', '');
                paths = path.replace("/uploads", "/upload/");

                return Session.get("IMG_CDN") + '/upload/' + paths;
            }

        } else {
            return;
        }
    }
}

//Session.set("IMG_CDN",ret);Session.get("IMG_CDN")
getImgForProduct = function(id_product) {
    var p = products.findOne({ _id: id_product });
    if (p == 'undefined' || p == null) {
        p = getProductfromServer(id_product);
    }
    if (p.image instanceof Array)
        var id = p.image[0];
    else
        var id = p.image;

    if (id == null) {
        var oldId = p.oldId;
        //console.log('OLDID='+oldId);

        Meteor.call('getAttributeFromProduct', oldId, function(err, ret) {
            if (ret != null)
                Session.set('AttributeFromProduct_' + ret.product, ret.list[0]);
            //console.log(JSON.stringify(ret));
        });

        var attr = Session.get('AttributeFromProduct_' + oldId); //attribute.findOne({product:p.oldId});
        //console.log(JSON.stringify(attr));
        if (attr) {
            id = attr.productImage;
            //console.log('ID='+id);
        }

    }

    if (id == '' || typeof id == "undefined") {
        return '/img/unknown.png';
    } else if (id.indexOf("http://") > -1 || id.indexOf("https://") > -1) {
        //console.log("reading ..."+id);
        return id;

    } else if (id.indexOf("upload") > -1) {
        id = id.replace(/ /g, "%20");
        path = id.replace('/upload/images/', '');
        paths = path.replace("/uploads", "/upload/");
        //return '/uploads/'+path;
        return '' + paths;



    } else {
        //var img = images.findOne({_id:id});
        Meteor.call('getImgPath', id, function(err, data) {
            if (err) console.log(err);
            else Session.set('IMAGE' + data.id, data.path);
        });
        var product = Session.get('IMAGE' + id);
        if (product == -1)
            return null
        else {
            img = product;
        }
        if (img) {
            // var id= img.copies.images.key;
            // path=id.replace('images','');
            return '/uploads/' + img;
            //return '/uploads/'+id;

        } else {
            return;
        }
    }
};

Template.registerHelper('getImgForProductCDN', function(id_product) {
    //console.log('calling img for '+id_product);
    return getImgForProductCDN(id_product);

});
getImgForProductCDN = function(id_product) {
    var p = products.findOne({ _id: id_product });
    if (p == 'undefined' || p == null) {
        p = getProductfromServer(id_product);
    }

    if (p.image instanceof Array)
        var id = p.image[0];
    else
        var id = p.image;

    if (id == null) {
        //var attr=attribute.findOne({product:p.oldId});

        /*Meteor.call('getAttributeFromProduct',p.oldId,function(err,ret){
            if(ret!=null)
                Session.set('AttributeFromProduct_'+ret.product,ret.list[0]);
            //console.log(JSON.stringify(ret));
        });
        */
        var attr = Session.get('AttributeFromProduct_' + p.oldId); //attribute.findOne({product:p.oldId});
        //console.log(JSON.stringify(attr));

        if (attr) {
            id = attr.productImage;
            //console.log('ID='+id);
        }

    }


    if (id == '' || typeof id == "undefined")
        return '/img/unknown.png';

    else if (id.indexOf("upload") > -1) {
        id = id.replace(/ /g, "%20");
        path = id.replace('/upload/images/', '');
        paths = path.replace("/uploads", "/upload/");
        //return '/uploads/'+path;
        return Session.get('IMG_CDN') + '/upload/' + paths;

    } else if (id.indexOf("http://") > -1) {
        //console.log("hi img 2");
        return id;

    } else {
        //var img = images.findOne({ _id: id });
        Meteor.call('getImgPath', id, function(err, data) {
            if (err) console.log(err);
            else Session.set('IMAGE' + data.id, data.path);
        });
        var product = Session.get('IMAGE' + id);
        if (product == -1)
            return null
        else {
            img = product;
        }

        if (img) {
            //var id = img.copies.images.key;
            // path=id.replace('images','');
            return Session.get('IMG_CDN') + '/upload/' + img;
            //return '/uploads/'+id;

        } else {
            return;
        }
    }
};
getProductfromServer = function(id_product) {
        Meteor.call('getProductInfo', id_product, function(err, data) {
            if (!err)
                Session.set('RECORDPRODUCT' + data.item_id, data.result);
        })
        return Session.get('RECORDPRODUCT' + id_product);
    }
    //For user upload
Template.registerHelper('getIdAttr', function(id) {
    var pro = products.findOne({ _id: id });
    if (pro.oldId) {
        return attribute.findOne({ product: pro.oldId })._id;
    } else {
        return '';
    }
});
Template.registerHelper('getImgAttr', function(idattr, id_product) {
    //console.log('Attr ID:', idattr);
    if (idattr) {
        var img = attribute.findOne({ _id: idattr });
        if (img != 'undefined') {
            //alert(img);
            // console.log('Image attr:', img)
            return { img: img }
        } else {
            var pro = products.findOne({ _id: id_product });
            if (pro.image instanceof Array) {
                var id = pro.image[0];
            } else {
                var id = pro.image;
            }
            return { img: id };
        }

    } else {
        var pro = products.findOne({ _id: id_product });
        if (pro.image instanceof Array) {
            var id = pro.image[0];
        } else {
            var id = pro.image;
        }
        return { img: id };
    }
})
Template.registerHelper('getTitleproduct', function(id) {
    //alert(id);
    var pro = products.findOne({ _id: id });
    //alert('title=='+pro.title);
    return pro;
});
Template.registerHelper('getinforAttr', function(id) {
    return attribute.findOne({ _id: id });
});
Template.registerHelper('nameparent', function(parent) {
    return parentattr.findOne({ _id: parent }).name;
});

Template.registerHelper('getimgAttr', function(id) {
    var pro = products.findOne({ _id: id });
    if (pro.oldId) {
        var image = attribute.findOne({ product: pro.oldId }).productImage;
        return getImg(image);
    } else {
        if (pro.image instanceof Array) {
            var id = pro.image[0];
        } else {
            var id = pro.image;
        }
        return getImg(id);
    }

});
Template.registerHelper('getimgAttrCDN', function(id) {
    var pro = products.findOne({ _id: id });
    if (pro.oldId) {
        var image = attribute.findOne({ product: pro.oldId });

        //return getImgCDN(image); 
    } else {
        if (pro.image instanceof Array) {
            var id = pro.image[0];
        } else {
            var id = pro.image;
        }
        return getImgCDN(id);
    }

});
Template.registerHelper('getImg', function(id) {
    var image = getImg(id);
    return image;

});
Template.registerHelper('getImgCDN', function(id) {
    var image = getImgCDN(id);
    return image;

});
getImgCDN = function(id) {
    if (id == '' || typeof id == "undefined")
        return '/img/unknown.png';

    else if (id.indexOf("upload/images") > -1) {
        id = id.replace(/ /g, "%20");
        path = id.replace('/upload/images/', '');
        return Session.get('IMG_CDN') + '/upload/' + path;
        // return id;
    } else if (id.indexOf("http://") > -1) {
        return id;

    } else {
        //var img = images.findOne({_id:id});
        Meteor.call('getImgPath', id, function(err, data) {
            if (err) console.log(err);
            else Session.set('IMAGE' + data.id, data.path);
        });
        var product = Session.get('IMAGE' + id);
        if (product == -1)
            return null
        else {
            img = product;
        }

        if (img) {
            //console.log(img);

            //path = id.replace('images/','');
            //path=id.replace('UserUploads/','');
            //return 'http://52.87.200.238/upload/'+id;
            //return '/uploads/'+path;
            return Session.get('IMG_CDN') + '/upload/' + img;

        } else {
            return;
        }
    }
};

getImg = function(id) {
    //console.log(id);
    if (id == '' || typeof id == "undefined")
        return '/img/unknown.png';
    else if (id.indexOf("upload/images") > -1) {
        id = id.replace(/ /g, "%20");
        path = id.replace('/upload/images/', '');
        return '' + path;
        // return id;
    } else if (id.indexOf("http://") > -1) {
        return id;

    } else {

        //var img = images.findOne({ _id: id });
        Meteor.call('getImgPath', id, function(err, data) {
            if (err) console.log(err);
            else Session.set('IMAGE' + data.id, data.path);
        });
        var product = Session.get('IMAGE' + id);
        if (product == -1)
            return null
        else {
            img = product;
        }
        if (img) {
            // console.log('Returned img from server:'+img);


            //path=id.replace('images','');
            var imgUrl = "/uploads/" + img;
            return imgUrl;

        } else {
            return;
        }
    }

};

// end

Template.registerHelper('trimString', function(passedString) {
    var theString = passedString.substring(0, 110);
    return new Handlebars.SafeString(theString)
});

Template.registerHelper('getDate', function(curdate) {
    // console.log('date' + curdate);
    var d = new Date(curdate);
    var months = Number(d.getMonth()) + 1;
    var str = d.getDate() + "/" + months + "/" + d.getFullYear();
    return str;
});

Template.registerHelper('recap', function(text) {
    return text.split(" ").splice(0, 3).join(" ");
});

Template.registerHelper('getTotal', function(text) {
    return Session.get("total");
});

Template.registerHelper('getProductInfo', function(item_id) {
    //var cartItem = cart.findOne({ "id_product": item_id });
    Meteor.call('getProductInfo', item_id, function(err, data) {
        if (!err)
            Session.set('RECORDPRODUCT' + data.item_id, data.result);
    })
    return Session.get('RECORDPRODUCT' + item_id);
});

Template.registerHelper('getProductInfoDetails', function(product) {
    var result = products.findOne({ _id: product });
    return result;
});


Template.registerHelper('getCart', function(curdate) {
    var mycart = '';
    userid = Session.get('userId');
    mycart = cart.find({ userId: userid });
    var total = 0;
    mycart.forEach(function(value, index) {
        total = total + value.subtotal;
    })
    Session.set("total", total);
    if (mycart.count() <= 3) {
        $('.ka_checkout_scroll').css('overflow-y', '');
    } else {
        $('.ka_checkout_scroll').css('overflow-y', 'scroll');
    }
    return mycart;
});

var clock = 100;
var timeLeft = function() {
    if (clock > 0) {
        clock--;
        Session.set("time", clock);
    } else {
        return Meteor.clearInterval(interval);
    }
};

var interval = Meteor.setInterval(timeLeft, 1000);

Template.registerHelper("time", function() {
    return Session.get("time");
});


Template.registerHelper("getFirstImgContent", function(id) {
    var p = contents.findOne({ _id: id });
    if (p.image instanceof Array)
        return p.image[0];
    else
        return p.image;
});

Template.registerHelper("getFirstImgProduct", function(id) {
    var p = products.findOne({ _id: id });
    if (p.image instanceof Array)
        return p.image[0];
    else
        return p.image;
});

Template.registerHelper("validProduct", function(img, price) {
    if (typeof price === "undefined" || price == "" || typeof img === "undefined" || img == "")
        return false;
    else
        return true;
});

Template.registerHelper("getDirection", function(img, price) {
    if (TAPi18n.getLanguage() == 'fa')
        return 'rtl';
    else
        return 'ltr'
});

Template.registerHelper("getCurrentLanguage", function(img, price) {
    if (TAPi18n.getLanguage() == 'fa')
        return 'fa-IR';
    else
        return 'en'
});

Template.registerHelper("getDirectionMenu", function(img, price) {
    if (TAPi18n.getLanguage() == 'fa')
        return 'navbar-right';
    else
        return 'navbar-left'
});

Template.registerHelper("classCom", function(img, price) {
    if (TAPi18n.getLanguage() == 'fa')
        return 'megamenu_left';
    else
        return 'megamenu_right'
});
Template.registerHelper("searching", function(img, price) {
    if (TAPi18n.getLanguage() == 'fa')
        return 'searchleft';
});
Template.registerHelper("footerleft", function(img, price) {
    if (TAPi18n.getLanguage() == 'fa')
        return 'footerfarsi';
});
Template.registerHelper("newslat", function(img, price) {
    if (TAPi18n.getLanguage() == 'fa')
        return 'newsletters';
});
Template.registerHelper("classItem", function(img, price) {
    if (TAPi18n.getLanguage() == 'fa')
        return 'megamenu_right';
    else
        return 'megamenu_left'
});
Template.registerHelper("backCom", function(img, price) {
    if (TAPi18n.getLanguage() == 'fa')
        return 'background:url(/images/bg_nav1.png)';
    else
        return 'background:url(/images/bg_nav_right.png)'
});


Template.registerHelper("smaller", function(text, size) {
    var finalText = '';
    var line = text.split(' ');
    if (line.length < size)
        var wordmax = line.length;
    else
        wordmax = size;
    for (var i = 0; i < wordmax; i++) {
        finalText = finalText + line[i] + ' ';
    }
    return finalText;
});

Template.registerHelper("slug", function() {
    return slugname(this.title);
});
var slugname = function(title) {
    title = title.replace(/\-/g, "(minus)");
    title = title.replace(/\s/g, "-");
    title = title.replace(/\%/g, "(percentag)");
    title = title.replace(/\+/g, "(plush)");
    title = title.replace(/\ô/g, "(ocir)");
    title = title.replace(/\®/g, "(copyright)");
    title = title.replace(/\°/g, "(number)");
    title = title.replace(/\Ô/g, "(bigocir)");
    title = title.replace(/\²/g, "(square)");
    title = title.replace(/\`/g, "(accentaigu)");
    title = title.replace(/\é/g, "(eaccentaigu)");
    title = title.replace(/\É/g, "(bigeaccentaigu)");
    title = title.replace(/\&/g, "(and)");
    title = title.replace(/\//g, "(slash)");
    title = title.replace(/\’/g, "(apostrophe)");
    title = title.replace(/\'/g, "(quote)");
    title = title.replace(/\!/g, "(warning)");
    title = title.replace(/\?/g, "(question)");
    title = title.replace(/\$/g, "(dolla)");
    title = title.replace(/\è/g, "(eaccentgrave)");
    title = title.replace(/\–/g, "(hyphen)");
    //title = title.toLowerCase();
    return title;
}

Template.registerHelper("unSlug", function() {
    return unSlugName(this.title);
});
var unSlugName = function(title) {
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
    return title;
}

Template.registerHelper("slugProduct", function() {
    var title = this.title;
    title = title.toLowerCase();
    title = title.replace(/ /g, "-");
    title = title.replace(/\+/g, "(plus)");
    title = title.replace(/ô/g, "(o-cir)");
    return title;
});

Template.registerHelper("headermenu", function() {
    if (TAPi18n.getLanguage() == 'fa')
        return 'text-right';
});

Template.registerHelper("liFa", function() {
    if (TAPi18n.getLanguage() == 'fa')
        return 'faright';
});

Template.registerHelper('getDecalage', function(index) {
    //console.log('calling img for '+id_product);
    //var  decal=$(".megamenu_drop.menuclick").eq(Number(index)).offset().left;
    //console.log('decal= '+index);

    return 104 * Number(index) - 100;

});

Template.registerHelper("getMenuClass", function(index) {
    if (index == 1)
        return 'dropdown_fullwidth';

    index = Number(index);

    var newIndex = 12 - (1 * index);

    var str = 'dropdown_' + newIndex + 'columns dropdown_container';
    return str;
});

Template.registerHelper("convertMsTimeStamp", function(tms) {
    var d = new Date(tms), // Convert the passed timestamp to milliseconds
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
        dd = ('0' + d.getDate()).slice(-2), // Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2), // Add leading 0.
        ampm = 'AM',
        hTime;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh == 0) {
        h = 12;
    }
    // ie: 2013-02-18, 8:35 AM 
    hTime = yyyy + '/' + mm + '/' + dd + ', ' + h + ':' + min + ' ' + ampm;
    return hTime;
});
// ==========makara=======================
Template.registerHelper("getReviewBySort", function(review) {
    var result = review.sort(function(x, y) {
        return y.date - x.date;
    })
    var number = Session.get('toggleReview');
    if (number == 1) {
        var leng = 5;
    } else {
        var leng = result.length;
    }
    var arr = [];
    for (var i = 0; i < leng; i++) {
        if (result[i]) {
            arr.push(result[i]);
        }
    }
    return arr;
});
//======end makara==============================

Template.registerHelper("capitalWord", function(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
});
Template.registerHelper("getprofile", function(userId, topic, category, id, date, description) {
    //var user = Meteor.users.findOne({_id:userId});
    //console.log(user);
    Meteor.call('getUser', userId, function(err, data) {
        if (!err) Session.set("USERDATA" + userId, data);
        //console.log('_id:'+userId);
    })
    var user = Session.get("USERDATA" + userId);
    var info = { topic: topic, category: category, forumId: id, date: date, description: description };
    if (typeof user != 'undefined' && user != "") {
        if (typeof user.image != 'undefined') {
            return { status: true, imageId: user.image, info: info, name: user.profile.firstname }
        } else {
            return { status: false, info: info, name: user.profile.firstname };
        }
    } else {
        return { status: false };
    }
});
Template.registerHelper("getHumanTime", function(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
});

Template.registerHelper("getListprice", function(oldId) {
    var attrprice = attribute.findOne({ "product": oldId });
    return attrprice;

});
//====================relate product content====================
Template.registerHelper('related_product', function(categoryId) {
    var resultRandom = products.find();
    var dataLenght = false;
    if (resultRandom.count() > 0) dataLenght = true;
    return { productsRelat: resultRandom, dataLenght: dataLenght };
});
item1 = 0;
counter1 = 0;
item2 = 0;
counter2 = 0;
item3 = 0;
counter3 = 0;

if (Meteor.isClient) {
    Template.mainLayout.events({
        'click .size-productlist': function(e) {
            var attrid = $(e.currentTarget).attr('data-size');
            var proid = $(e.currentTarget).attr('data-pro');
            $('#pro' + proid + ' .size-productlist').each(function() {
                $(this).removeClass('active');
            });
            $(e.currentTarget).addClass('active');
            var attr = attribute.findOne({ _id: attrid });
            if (attr) {
                var price = attr.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                $('.price' + proid).text(price);
            }
        },
        'click .btn_viewCard': function(e) {
            e.preventDefault();
            Meteor.flush();
            Router.go('/checkout');
        },
        'click .unlike': function(e) {
            e.preventDefault();
            var productid = $(e.currentTarget).attr('data-id');
            $('#like' + productid).removeClass('nonelike');
            $('#unlike' + productid).addClass('nonelike');
            var userId = Meteor.userId();
            var obj = {
                proId: productid,
                userId: userId
            }
            if (userId) {
                Meteor.call('insertFavoritee', obj, function(error) {
                    if (error) {
                        console.log("Add Favorite Problem" + error.reason);
                    } else {
                        item1 = 0;
                        counter1 = 0;
                        item2 = 0;
                        counter2 = 0;
                        if (TAPi18n.getLanguage() == 'fa') {
                            Bert.icons['my-error'] = 'fa-fav-iconbg';
                            Bert.alert({
                                message: 'به لیست علاقمندی شما افزوده شد!<br><a href="/favorite" style="color:#B81425; margin-left:40px;">نمایش فهرست علاقمندی ها</a>',
                                type: 'my-error',
                                style: 'growl-bottom-right',
                                icon: 'fa-fav-iconbg'
                            });
                        } else {
                            Bert.icons['my-error'] = 'fa-fav-iconbg';
                            Bert.alert({
                                message: 'New favorites ! <br><a href="/favorite" style="color:#B81425; margin-left:40px;">See all favorites</a>',
                                type: 'my-error',
                                style: 'growl-bottom-right',
                                icon: 'fa-fav-iconbg'
                            });
                        }
                    }
                });
            } else {
                var current = Iron.Location.get().path;
                Session.set("CURRENT-FAVORITE", current);
                Router.go("/login");
            }
        },
        'click .like': function(e) {
            e.preventDefault();
            var productid = $(e.currentTarget).attr('data-id');
            $('#unlike' + productid).removeClass('nonelike');
            $('#like' + productid).addClass('nonelike');
            var userId = Meteor.userId();
            if (userId) {
                Meteor.call('deleteFavoritee', productid, userId, function(error) {
                    if (error) {
                        console.log("Delete Favorite Problem");
                    } else {
                        item1 = 0;
                        counter1 = 0;
                        item2 = 0;
                        counter2 = 0;
                        if (TAPi18n.getLanguage() == 'fa') {
                            Bert.icons['my-error'] = 'fa-remove-iconbg';
                            Bert.alert({
                                message: 'Favorites remove ! <br><a href="/favorite" style="color:#B81425; margin-left:40px;">See all favorites</a>',
                                type: 'my-error',
                                style: 'growl-bottom-right',
                                icon: 'fa-remove-iconbg'
                            });
                        } else {
                            Bert.icons['my-error'] = 'fa-remove-iconbg';
                            Bert.alert({
                                message: 'Favorites remove ! <br><a href="/favorite" style="color:#B81425; margin-left:40px;">See all favorites</a>',
                                type: 'my-error',
                                style: 'growl-bottom-right',
                                icon: 'fa-remove-iconbg'
                            });
                        }
                    }
                });
            } else {
                var current = Iron.Location.get().path;
                Session.set("CURRENT-FAVORITE", current);
                Router.go("/login");
            }
        },
        'click #addmycart-quickview': function(e) {
            e.preventDefault();
            var id_product = this._id;
            var qty = $("#qty").val();
            var userId = Session.get('userId');
            var pro = products.findOne({ _id: id_product });
            var attr = attribute.find({ product: pro.oldId }).fetch();
            var attrid = '';
            if (attr.length > 0)
                var attrid = attr[0]._id;

            //console.log('attr Id:', attrid);
            /* Add To Cart Function was defined in general.js*/
            addToCart(id_product, attrid, userId, qty);
            $('.close').click();
        }
    });
}
Template.registerHelper('oneSlide1', function(data) {
    if (data) {
        //console.log('ONESLIDE '+data);
        var html = '';
        var active = 0;
        var item1 = 0;
        for (i = 0; i < data.length; i++) {

            var result = products.findOne({ "_id": data[i] });
            //console.log('ONESLIDE RESULT'+result);
            if (result == null)
                return;

            item1 = item1 + 1;

            if (item1 == 1) {
                active = active + 1;
                var str = (active <= 1) ? 'active' : '';
                html += '<div class="item ' + str + '"><div class="row">';
            }
            html += oneProduct(result, false);
            if (item1 == 4) {
                html += '</div></div>';
                item1 = 0;
            }
        }
        return html;
    }
});
Template.registerHelper('oneSlide2', function(data) {
    if (data) {
        var html = '';
        var active = 0;
        var item2 = 0;
        data.forEach(function(value, index) {
            var result = products.findOne({ "_id": value });
            item2 = item2 + 1;
            counter2 = counter2 + 1;

            if (item2 == 1) {
                active = active + 1;
                var str = (active <= 1) ? 'active' : '';
                html += '<div class="item ' + str + '"><div class="row">';
            }
            html += oneProduct(result, false);
            if (item2 == 4) {
                html += '</div></div>';
                item2 = 0;
            }
        });
        return html;
    }
});
Template.registerHelper('oneSlide3', function(data) {
    if (data) {
        var html = '';
        data.forEach(function(value, index) {
            var result = products.findOne({ "_id": value });
            item3 = item3 + 1;
            counter3 = counter3 + 1;
            var active = '';
            if (counter3 == 1) active = 'active';
            if (item3 == 1) {
                html += '<div class="item ' + active + '"><div class="row">';
            }
            html += oneProduct(result, false);
            if (item3 == 4) {
                html += '</div></div>';
                item3 = 0;
            }
        });
        return html;
    }
});
Template.registerHelper('getSelectedProduct', function() {

    var id = Session.get('quickview');
    //console.log('session:'+id);
    if (id == '')
        return null;

    var currentProduct = products.findOne({ "_id": id });

    return currentProduct;
});
Template.home.events({
    'click #quickbtn': function(e, tpl) {
        e.preventDefault();
        var productId = $(e.currentTarget).attr('data-id');
        //console.log('product quickvirw: '+productId);
        Session.set('quickview', productId);
        //console.log('QuickView:', productId);
        Session.set('miniature', 0);
    },
    "mouseenter #ex1": function(e, tpl) {
        if (Session.get('miniature') == 0) {
            $('#ex1').trigger('zoom.destroy');
            $('#ex1').zoom();
            Session.set('miniature', 1);

        }

    },
})
Template.listproducts.events({
    'click #quickbtn': function(e, tpl) {
        e.preventDefault();
        var productId = $(e.currentTarget).attr('data-id');
        Session.set('quickview', productId);
        Session.set('miniature', 0);
    },
    "mouseenter #ex1": function(e, tpl) {
        if (Session.get('miniature') == 0) {
            $('#ex1').trigger('zoom.destroy');
            $('#ex1').zoom();
            Session.set('miniature', 1);
        }

    }
})
Template.relateDetail.events({
    'click #quickbtn': function(e, tpl) {
        e.preventDefault();
        var productId = $(e.currentTarget).attr('data-id');
        Session.set('quickview', productId);
        Session.set('miniature', 0);
    },
    "mouseenter #ex2": function(e, tpl) {
        if (Session.get('miniature') == 0) {
            $('#ex2').trigger('zoom.destroy');
            $('#ex2').zoom();
            Session.set('miniature', 1);
        }

    },
    'click #addtocartrelate': function(e, tpl) {
        e.preventDefault();
        var id_product = this._id;
        var qty = tpl.$("#qty").val();
        var attribute = $(e.currentTarget).attr('data-id');
        if (attribute == '')
            attribute = '';
        var userId = Session.get('userId');
        var subtotal = 0;

        var sameproduct = cart.find({ id_product: id_product, userId: userId, attribute: attribute }).fetch();

        if (sameproduct.length > 0) {
            sameproduct = sameproduct[0];
            var pro = products.findOne({ _id: id_product });
            upqty = parseInt(sameproduct.quantity) + parseInt(qty);
            if (pro) {
                subtotal = upqty * parseInt(Session.get('priceAttr'));
            }
            //console.log('update of the cart');
            var obj = { quantity: upqty, subtotal: subtotal };
            Meteor.call('updateStatus', sameproduct._id, obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'محصول با موفقیت به سبد خرید افزوده شد!<br><a href="/checkout" style="color:#B81425; margin-left:80px;">مشاهده لیست خرید</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'Success, Insert Add to Cart ! <br><a href="/checkout" style="color:#B81425; margin-left:80px;">See checkout</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            }
            $('.close').click();
            //Router.go("/checkout");
        } else {
            var pro = products.findOne({ _id: id_product });
            if (pro) {
                subtotal = parseInt(qty) * parseInt(Session.get('priceAttr'));
            } else
                subtotal = 0;
            var obj = {
                id_product: id_product,
                userId: Session.get('userId'),
                quantity: qty,
                subtotal: subtotal,
                /*shop:shop,*/
                attribute: attribute,
                order_status: 0
            };
            Meteor.call('addtocart', obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'محصول با موفقیت به سبد خرید افزوده شد!<br><a href="/checkout" style="color:#B81425; margin-left:80px;">مشاهده لیست خرید</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'Success, Insert Add to Cart ! <br><a href="/checkout" style="color:#B81425; margin-left:80px;">See checkout</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            }
            $('.close').click();
            //Router.go("/checkout");
        }
    }

});
Template.fav.events({
    'click #quickbtn': function(e, tpl) {
        e.preventDefault();
        var productId = $(e.currentTarget).attr('data-id');
        Session.set('quickview', productId);
    }
});
Template.searchproduct.events({
    'click #quickbtn': function(e, tpl) {
        e.preventDefault();
        var productId = $(e.currentTarget).attr('data-id');
        Session.set('quickview', productId);
        Session.set('miniature', 0);
    },
    "mouseenter #ex1": function(e, tpl) {
        if (Session.get('miniature') == 0) {
            $('#ex1').trigger('zoom.destroy');
            $('#ex1').zoom();
            Session.set('miniature', 1);
        }

    }
});

Template.ideagift.events({
    'click #quickbtn': function(e, tpl) {
        e.preventDefault();
        var productId = $(e.currentTarget).attr('data-id');
        Session.set('quickview', productId);
        Session.set('miniature', 0);
    },
    "mouseenter #ex1": function(e, tpl) {
        if (Session.get('miniature') == 0) {
            $('#ex1').trigger('zoom.destroy');
            $('#ex1').zoom();
            Session.set('miniature', 1);
        }

    },
    'click #addtocart': function(e, tpl) {
        e.preventDefault();
        var id_product = this._id;
        var qty = tpl.$("#qty").val();
        var attribute = Session.get('selected_attr');
        if (attribute == 'No attribute')
            attribute = '';
        var userId = Session.get('userId');
        var subtotal = 0;

        var sameproduct = cart.find({ id_product: id_product, userId: userId, attribute: attribute }).fetch();

        if (sameproduct.length > 0) {
            sameproduct = sameproduct[0];
            var pro = products.findOne({ _id: id_product });
            upqty = parseInt(sameproduct.quantity) + parseInt(qty);
            if (pro) {
                subtotal = upqty * parseInt(Session.get('priceAttr'));
            }
            //console.log('update of the cart');
            var obj = { quantity: upqty, subtotal: subtotal };
            Meteor.call('updateStatus', sameproduct._id, obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'محصول با موفقیت به سبد خرید افزوده شد!<br><a href="/checkout" style="color:#B81425; margin-left:80px;">مشاهده لیست خرید</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'Success, Insert Add to Cart ! <br><a href="/checkout" style="color:#B81425; margin-left:80px;">See checkout</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            }
            $('.close').click();
            //Router.go("/checkout");
        } else {
            var pro = products.findOne({ _id: id_product });
            if (pro) {
                subtotal = parseInt(qty) * parseInt(Session.get('priceAttr'));
            } else
                subtotal = 0;
            var obj = {
                id_product: id_product,
                userId: Session.get('userId'),
                quantity: qty,
                subtotal: subtotal,
                /*shop:shop,*/
                attribute: attribute,
                order_status: 0
            };
            Meteor.call('addtocart', obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'محصول با موفقیت به سبد خرید افزوده شد!<br><a href="/checkout" style="color:#B81425; margin-left:80px;">مشاهده لیست خرید</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'Success, Insert Add to Cart ! <br><a href="/checkout" style="color:#B81425; margin-left:80px;">See checkout</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            }
            $('.close').click();
            //Router.go("/checkout");
        }
    }
});
Template.ideagift.helpers({
    getIconlike: function(product_id) {
        var fav = '';
        var userid = getFavUserId();
        fav = favorite.findOne({ proId: product_id, userId: userid });
        if (fav) {
            var heartempty = 'nonelike';
            var heartfull = '';
        } else {
            var heartempty = '';
            var heartfull = 'nonelike';
        }
        var html = '';
        html += '<a href="#" data-id="' + product_id + '" class="heart ' + heartempty + ' unlike unlike' + product_id + '"><span class="fa fa-heart-o" style="padding-top: 10px;padding-left: 37px;"></span></a>';
        html += '<a href="#" data-id="' + product_id + '" class="heart ' + heartfull + ' like like' + product_id + '"><span class="fa fa-heart fa-heart-full" style="padding-top: 10px;padding-left: 37px;"></span></a>';
        return html;
    },
    getAttribprice: function(oldId) {
        //var attrprice = attribute.findOne({"product":oldId});
        Meteor.call('getAttrPrice', oldId, function(err, data) {
            if (!err) {
                var attr = '.price' + data.product;
                var price = data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                $(attr).html('ریال ' + price);
                // console.log('oldiD= ' + data.product + "price =" + data.price)
                Session.set('priceAttr', data.price);
            }
        });
    }
});

Template.bestselling.events({
    'click #quickbtn': function(e, tpl) {
        e.preventDefault();
        var productId = $(e.currentTarget).attr('data-id');
        Session.set('quickview', productId);
        Session.set('miniature', 0);
    },
    "mouseenter #ex1": function(e, tpl) {
        if (Session.get('miniature') == 0) {
            $('#ex1').trigger('zoom.destroy');
            $('#ex1').zoom();
            Session.set('miniature', 1);
        }

    },
    'click #addtocart': function(e, tpl) {
        e.preventDefault();
        var id_product = this._id;
        var qty = tpl.$("#qty").val();
        var attribute = Session.get('selected_attr');
        if (attribute == 'No attribute')
            attribute = '';
        var userId = Session.get('userId');
        var subtotal = 0;

        var sameproduct = cart.find({ id_product: id_product, userId: userId, attribute: attribute }).fetch();

        if (sameproduct.length > 0) {
            sameproduct = sameproduct[0];
            var pro = products.findOne({ _id: id_product });
            upqty = parseInt(sameproduct.quantity) + parseInt(qty);
            if (pro) {
                subtotal = upqty * parseInt(Session.get('priceAttr'));
            }
            //console.log('update of the cart');
            var obj = { quantity: upqty, subtotal: subtotal };
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'محصول با موفقیت به سبد خرید افزوده شد!<br><a href="/checkout" style="color:#B81425; margin-left:80px;">مشاهده لیست خرید</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'Success, Insert Add to Cart ! <br><a href="/checkout" style="color:#B81425; margin-left:80px;">See checkout</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            }
            $('.close').click();
            //Router.go("/checkout");
        } else {
            var pro = products.findOne({ _id: id_product });
            if (pro) {
                subtotal = parseInt(qty) * parseInt(Session.get('priceAttr'));
            } else
                subtotal = 0;
            var obj = {
                id_product: id_product,
                userId: Session.get('userId'),
                quantity: qty,
                subtotal: subtotal,
                /*shop:shop,*/
                attribute: attribute,
                order_status: 0
            };
            Meteor.call('addtocart', obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'محصول با موفقیت به سبد خرید افزوده شد!<br><a href="/checkout" style="color:#B81425; margin-left:80px;">مشاهده لیست خرید</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'Success, Insert Add to Cart ! <br><a href="/checkout" style="color:#B81425; margin-left:80px;">See checkout</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            }
            $('.close').click();
            //Router.go("/checkout");
        }
    }
});
Template.bestselling.helpers({
    getIconlike: function(product_id) {
        var fav = '';
        var userid = getFavUserId();
        fav = favorite.findOne({ proId: product_id, userId: userid });
        if (fav) {
            var heartempty = 'nonelike';
            var heartfull = '';
        } else {
            var heartempty = '';
            var heartfull = 'nonelike';
        }
        var html = '';
        html += '<a href="#" data-id="' + product_id + '" class="heart ' + heartempty + ' unlike unlike' + product_id + '"><span class="fa fa-heart-o" style="padding-top: 10px;padding-left: 37px;"></span></a>';
        html += '<a href="#" data-id="' + product_id + '" class="heart ' + heartfull + ' like like' + product_id + '"><span class="fa fa-heart fa-heart-full" style="padding-top: 10px;padding-left: 37px;"></span></a>';
        return html;
    },
    getAttribprice: function(oldId) {
        //var attrprice = attribute.findOne({"product":oldId});
        Meteor.call('getAttrPrice', oldId, function(err, data) {
            if (!err) {
                var attr = '.price' + data.product;
                var price = data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                $(attr).html('ریال ' + price);
                //console.log('oldiD= ' + data.product + "price =" + data.price)
                Session.set('priceAttr', data.price);
            }
        });
    }
});
Template.newarrival.events({
    'click #quickbtn': function(e, tpl) {
        e.preventDefault();
        var productId = $(e.currentTarget).attr('data-id');
        Session.set('quickview', productId);
        Session.set('miniature', 0);
    },
    "mouseenter #ex1": function(e, tpl) {
        if (Session.get('miniature') == 0) {
            $('#ex1').trigger('zoom.destroy');
            $('#ex1').zoom();
            Session.set('miniature', 1);
        }

    },
    'click #addtocart': function(e, tpl) {
        e.preventDefault();
        var id_product = this._id;
        var qty = tpl.$("#qty").val();
        var attribute = Session.get('selected_attr');
        if (attribute == 'No attribute')
            attribute = '';
        var userId = Session.get('userId');
        var subtotal = 0;

        var sameproduct = cart.find({ id_product: id_product, userId: userId, attribute: attribute }).fetch();

        if (sameproduct.length > 0) {
            sameproduct = sameproduct[0];
            var pro = products.findOne({ _id: id_product });
            upqty = parseInt(sameproduct.quantity) + parseInt(qty);
            if (pro) {
                subtotal = upqty * parseInt(Session.get('priceAttr'));
            }
            //console.log('update of the cart');
            var obj = { quantity: upqty, subtotal: subtotal };
            Meteor.call('updateStatus', sameproduct._id, obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'محصول با موفقیت به سبد خرید افزوده شد!<br><a href="/checkout" style="color:#B81425; margin-left:80px;">مشاهده لیست خرید</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'Success, Insert Add to Cart ! <br><a href="/checkout" style="color:#B81425; margin-left:80px;">See checkout</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            }
            $('.close').click();
            //Router.go("/checkout");
        } else {
            var pro = products.findOne({ _id: id_product });
            if (pro) {
                subtotal = parseInt(qty) * parseInt(Session.get('priceAttr'));
            } else
                subtotal = 0;
            var obj = {
                id_product: id_product,
                userId: Session.get('userId'),
                quantity: qty,
                subtotal: subtotal,
                /*shop:shop,*/
                attribute: attribute,
                order_status: 0
            };
            Meteor.call('addtocart', obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'محصول با موفقیت به سبد خرید افزوده شد!<br><a href="/checkout" style="color:#B81425; margin-left:80px;">مشاهده لیست خرید</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'Success, Insert Add to Cart ! <br><a href="/checkout" style="color:#B81425; margin-left:80px;">مشاهده لیست خرید</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            }
            $('.close').click();
            //Router.go("/checkout");
        }
    }
});
Template.newarrival.helpers({
    getIconlike: function(product_id) {
        var fav = '';
        var userid = getFavUserId();
        fav = favorite.findOne({ proId: product_id, userId: userid });
        if (fav) {
            var heartempty = 'nonelike';
            var heartfull = '';
        } else {
            var heartempty = '';
            var heartfull = 'nonelike';
        }
        var html = '';
        html += '<a href="#" data-id="' + product_id + '" class="heart ' + heartempty + ' unlike unlike' + product_id + '"><span class="fa fa-heart-o" style="padding-top: 10px;padding-left: 37px;"></span></a>';
        html += '<a href="#" data-id="' + product_id + '" class="heart ' + heartfull + ' like like' + product_id + '"><span class="fa fa-heart fa-heart-full" style="padding-top: 10px;padding-left: 37px;"></span></a>';
        return html;
    },
    getAttribprice: function(oldId) {
        //var attrprice = attribute.findOne({"product":oldId});
        Meteor.call('getAttrPrice', oldId, function(err, data) {
            if (!err) {
                var attr = '.price' + data.product;
                var price = data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                $(attr).html('ریال ' + price);
                //$(attr).html('ریال ' + data.price);
                //console.log('oldiD= ' + data.product + "price =" + data.price)
                Session.set('priceAttr', data.price);
            }
        });
    }
});

Template.nichefragrance.events({
    'click #quickbtn': function(e, tpl) {
        e.preventDefault();
        var productId = $(e.currentTarget).attr('data-id');
        Session.set('quickview', productId);
        Session.set('miniature', 0);
    },
    "mouseenter #ex1": function(e, tpl) {
        if (Session.get('miniature') == 0) {
            $('#ex1').trigger('zoom.destroy');
            $('#ex1').zoom();
            Session.set('miniature', 1);
        }

    },
    'click #addtocart': function(e, tpl) {
        e.preventDefault();
        var id_product = this._id;
        var qty = tpl.$("#qty").val();
        var attribute = Session.get('selected_attr');
        if (attribute == 'No attribute')
            attribute = '';
        var userId = Session.get('userId');
        var subtotal = 0;

        var sameproduct = cart.find({ id_product: id_product, userId: userId, attribute: attribute }).fetch();

        if (sameproduct.length > 0) {
            sameproduct = sameproduct[0];
            var pro = products.findOne({ _id: id_product });
            upqty = parseInt(sameproduct.quantity) + parseInt(qty);
            if (pro) {
                subtotal = upqty * parseInt(Session.get('priceAttr'));
            }
            //console.log('update of the cart');
            var obj = { quantity: upqty, subtotal: subtotal };
            Meteor.call('updateStatus', sameproduct._id, obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'محصول با موفقیت به سبد خرید افزوده شد!<br><a href="/checkout" style="color:#B81425; margin-left:80px;">مشاهده لیست خرید</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'Success, Insert Add to Cart ! <br><a href="/checkout" style="color:#B81425; margin-left:80px;">See checkout</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            }
            $('.close').click();
            //Router.go("/checkout");
        } else {
            var pro = products.findOne({ _id: id_product });
            if (pro) {
                subtotal = parseInt(qty) * parseInt(Session.get('priceAttr'));
            } else
                subtotal = 0;
            var obj = {
                id_product: id_product,
                userId: Session.get('userId'),
                quantity: qty,
                subtotal: subtotal,
                /*shop:shop,*/
                attribute: attribute,
                order_status: 0
            };
            Meteor.call('addtocart', obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'محصول با موفقیت به سبد خرید افزوده شد!<br><a href="/checkout" style="color:#B81425; margin-left:80px;">مشاهده لیست خرید</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'Success, Insert Add to Cart ! <br><a href="/checkout" style="color:#B81425; margin-left:80px;">See checkout</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            }
            $('.close').click();
            // Router.go("/checkout");
        }
    }
});
Template.nichefragrance.helpers({
    getIconlike: function(product_id) {
        var fav = '';
        var userid = getFavUserId();
        fav = favorite.findOne({ proId: product_id, userId: userid });
        if (fav) {
            var heartempty = 'nonelike';
            var heartfull = '';
        } else {
            var heartempty = '';
            var heartfull = 'nonelike';
        }
        var html = '';
        html += '<a href="#" data-id="' + product_id + '" class="heart ' + heartempty + ' unlike unlike' + product_id + '"><span class="fa fa-heart-o" style="padding-top: 10px;padding-left: 37px;"></span></a>';
        html += '<a href="#" data-id="' + product_id + '" class="heart ' + heartfull + ' like like' + product_id + '"><span class="fa fa-heart fa-heart-full" style="padding-top: 10px;padding-left: 37px;"></span></a>';
        return html;
    },
    getAttribprice: function(oldId) {
        //var attrprice = attribute.findOne({"product":oldId});
        Meteor.call('getAttrPrice', oldId, function(err, data) {
            if (!err) {
                var attr = '.price' + data.product;
                //$(attr).html('ریال ' + data.price);
                var price = data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                $(attr).html('ریال ' + price);
                //console.log('oldiD= ' + data.product + "price =" + data.price);
                Session.set('priceAttr', data.price);
            }
        });
    }
});

Template.natural.events({
    'click #quickbtn': function(e, tpl) {
        e.preventDefault();
        var productId = $(e.currentTarget).attr('data-id');
        Session.set('quickview', productId);
        Session.set('miniature', 0);
    },
    "mouseenter #ex1": function(e, tpl) {
        if (Session.get('miniature') == 0) {
            $('#ex1').trigger('zoom.destroy');
            $('#ex1').zoom();
            Session.set('miniature', 1);
        }

    },
    'click #addtocart': function(e, tpl) {
        e.preventDefault();
        var id_product = this._id;
        var qty = tpl.$("#qty").val();
        var attribute = Session.get('selected_attr');
        if (attribute == 'No attribute')
            attribute = '';
        var userId = Session.get('userId');
        var subtotal = 0;

        var sameproduct = cart.find({ id_product: id_product, userId: userId, attribute: attribute }).fetch();

        if (sameproduct.length > 0) {
            sameproduct = sameproduct[0];
            var pro = products.findOne({ _id: id_product });
            upqty = parseInt(sameproduct.quantity) + parseInt(qty);
            if (pro) {
                subtotal = upqty * parseInt(Session.get('priceAttr'));
            }
            //console.log('update of the cart');
            var obj = { quantity: upqty, subtotal: subtotal };
            Meteor.call('updateStatus', sameproduct._id, obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'محصول با موفقیت به سبد خرید افزوده شد!<br><a href="/checkout" style="color:#B81425; margin-left:80px;">مشاهده لیست خرید</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'Success, Insert Add to Cart ! <br><a href="/checkout" style="color:#B81425; margin-left:80px;">See checkout</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            }
            $('.close').click();
            //Router.go("/checkout");
        } else {
            var pro = products.findOne({ _id: id_product });
            if (pro) {
                subtotal = parseInt(qty) * parseInt(Session.get('priceAttr'));
            } else
                subtotal = 0;
            var obj = {
                id_product: id_product,
                userId: Session.get('userId'),
                quantity: qty,
                subtotal: subtotal,
                /*shop:shop,*/
                attribute: attribute,
                order_status: 0
            };
            Meteor.call('addtocart', obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'محصول با موفقیت به سبد خرید افزوده شد!<br><a href="/checkout" style="color:#B81425; margin-left:80px;">مشاهده لیست خرید</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'Success, Insert Add to Cart ! <br><a href="/checkout" style="color:#B81425; margin-left:80px;">See checkout</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            }
            $('.close').click();
            //Router.go("/checkout");
        }
    }
});
Template.natural.helpers({
    getIconlike: function(product_id) {
        var fav = '';
        var userid = getFavUserId();
        fav = favorite.findOne({ proId: product_id, userId: userid });
        if (fav) {
            var heartempty = 'nonelike';
            var heartfull = '';
        } else {
            var heartempty = '';
            var heartfull = 'nonelike';
        }
        var html = '';
        html += '<a href="#" data-id="' + product_id + '" class="heart ' + heartempty + ' unlike unlike' + product_id + '"><span class="fa fa-heart-o" style="padding-top: 10px;padding-left: 37px;"></span></a>';
        html += '<a href="#" data-id="' + product_id + '" class="heart ' + heartfull + ' like like' + product_id + '"><span class="fa fa-heart fa-heart-full" style="padding-top: 10px;padding-left: 37px;"></span></a>';
        return html;
    },
    getAttribprice: function(oldId) {
        //var attrprice = attribute.findOne({"product":oldId});
        Meteor.call('getAttrPrice', oldId, function(err, data) {
            if (!err) {
                var attr = '.price' + data.product;
                var price = data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                $(attr).html('ریال ' + price);
                //$(attr).html('ریال ' + data.price);
                //console.log('oldiD= ' + data.product + "price =" + data.price);
                Session.set('priceAttr', data.price);
            }
        });
    }
});

Template.smokyeyes.events({
    'click #quickbtn': function(e, tpl) {
        e.preventDefault();
        var productId = $(e.currentTarget).attr('data-id');
        Session.set('quickview', productId);
        Session.set('miniature', 0);
    },
    "mouseenter #ex1": function(e, tpl) {
        if (Session.get('miniature') == 0) {
            $('#ex1').trigger('zoom.destroy');
            $('#ex1').zoom();
            Session.set('miniature', 1);
        }

    },
    'click #addtocart': function(e, tpl) {
        e.preventDefault();
        var id_product = this._id;
        var qty = tpl.$("#qty").val();
        var attribute = Session.get('selected_attr');
        if (attribute == 'No attribute')
            attribute = '';
        var userId = Session.get('userId');
        var subtotal = 0;

        var sameproduct = cart.find({ id_product: id_product, userId: userId, attribute: attribute }).fetch();

        if (sameproduct.length > 0) {
            sameproduct = sameproduct[0];
            var pro = products.findOne({ _id: id_product });
            upqty = parseInt(sameproduct.quantity) + parseInt(qty);
            if (pro) {
                subtotal = upqty * parseInt(Session.get('priceAttr'));
            }
            //console.log('update of the cart');
            var obj = { quantity: upqty, subtotal: subtotal };
            Meteor.call('updateStatus', sameproduct._id, obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'محصول با موفقیت به سبد خرید افزوده شد!<br><a href="/checkout" style="color:#B81425; margin-left:80px;">مشاهده لیست خرید</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'Success, Insert Add to Cart ! <br><a href="/checkout" style="color:#B81425; margin-left:80px;">See checkout</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            }
            $('.close').click();
            //Router.go("/checkout");
        } else {
            var pro = products.findOne({ _id: id_product });
            if (pro) {
                subtotal = parseInt(qty) * parseInt(Session.get('priceAttr'));
            } else
                subtotal = 0;
            var obj = {
                id_product: id_product,
                userId: Session.get('userId'),
                quantity: qty,
                subtotal: subtotal,
                /*shop:shop,*/
                attribute: attribute,
                order_status: 0
            };
            Meteor.call('addtocart', obj);
            if (TAPi18n.getLanguage() == 'fa') {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'محصول با موفقیت به سبد خرید افزوده شد!<br><a href="/checkout" style="color:#B81425; margin-left:80px;">مشاهده لیست خرید</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            } else {
                Bert.icons['my-error'] = 'fa-addcart-iconbg';
                Bert.alert({
                    message: 'Success, Insert Add to Cart ! <br><a href="/checkout" style="color:#B81425; margin-left:80px;">See checkout</a>',
                    type: 'my-error',
                    style: 'growl-bottom-right',
                    icon: 'fa-addcart-iconbg'
                });
            }
            $('.close').click();
            //Router.go("/checkout");
        }
    }
});

Template.smokyeyes.helpers({
    getIconlike: function(product_id) {
        var fav = '';
        var userid = getFavUserId();
        fav = favorite.findOne({ proId: product_id, userId: userid });
        if (fav) {
            var heartempty = 'nonelike';
            var heartfull = '';
        } else {
            var heartempty = '';
            var heartfull = 'nonelike';
        }
        var html = '';
        html += '<a href="#" data-id="' + product_id + '" class="heart ' + heartempty + ' unlike unlike' + product_id + '"><span class="fa fa-heart-o" style="padding-top: 10px;padding-left: 37px;"></span></a>';
        html += '<a href="#" data-id="' + product_id + '" class="heart ' + heartfull + ' like like' + product_id + '"><span class="fa fa-heart fa-heart-full" style="padding-top: 10px;padding-left: 37px;"></span></a>';
        return html;
    },
    getAttribprice: function(oldId) {
        //var attrprice = attribute.findOne({"product":oldId});
        Meteor.call('getAttrPrice', oldId, function(err, data) {
            if (!err) {
                var attr = '.price' + data.product;
                var price = data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                $(attr).html('ریال ' + price);
                //$(attr).html('ریال ' + data.price);
                // console.log('oldiD= ' + data.product + "price =" + data.price);
                Session.set('priceAttr', data.price);
            }
        });
    }
});

Template.registerHelper('showquickview', function() {
    return false;
});

Template.registerHelper('hidequickview', function() {
    return true;
});

Template.registerHelper('oneProduct', function(prod) {
    return oneProduct(prod);
});

Template.registerHelper('oneStyleProduct', function(products, related = '') {
    if (products) {
        var data = '';
        products.forEach(function(value, index) {
            data += oneProduct(value, related);
        });
        return data;
    } else { console.log('NOTHING HTML'); }
});




Template.registerHelper('oneStyleProductReward', function(products, related = '') {
    if (products) {
        var data = '';
        products.forEach(function(value, index) {
            data += oneProductReward(value, related);
        })
        return data;
    }
});

Template.registerHelper('favoriteProducts', function(productid, title, price) {
    if (productid) {
        return favoriteProduct({ _id: productid, title: title, price: price }, false, false);
    }
})
Template.registerHelper('newsBlockBanners', function(order, page, position = '', category = '') {
    var ordernum = parseInt(order);
    if (page == 'category')
        var data = locations.findOne({ type: 'News', order: ordernum, page: page, categoryId: category, position: position, $or: [{ productid: "" }, { productid: [] }] });
    else
        var data = locations.findOne({ type: 'News', order: ordernum, page: page, $or: [{ productid: "" }, { productid: [] }] });


    if (data) {
        if (data.image_id) {
            var img = getImg(data.image_id);
            var imgCDN = getImgCDN(data.image_id);
        } else {
            var img = '/images/default.png';
            var imgCDN = 'http://52.87.200.238/upload/djib.jpg';
        }


        var result = { name: data.name, link: data.link, image: img, date: data.date, imageCDN: imgCDN };

        return result;

    }
})
Template.registerHelper('lifeStyleBanners', function(category = '') {
    //console.log("categoryId==="+category);
    if (category) {
        var data = locations.find({ type: 'Lifestyle', page: 'category', categoryId: category, $or: [{ productid: "" }, { productid: [] }] }, { sort: { order: 1 } });
    } else {
        var data = locations.find({ type: 'Lifestyle', page: 'home', $or: [{ productid: "" }, { productid: [] }] }, { sort: { order: 1 } });
    }
    var list = [];
    if (data.count() > 0) {
        data.forEach(function(data, index) {
            if (data.image_id) {
                var img = getImg(data.image_id);
                var imgCDN = getImgCDN(data.image_id);
            } else {
                var img = '/images/default.png';
                var imgCDN = '/images/default.png';
            }

            list.push({ _id: data._id, name: data.name, link: data.link, image: img, imageCDN: imgCDN });

        });
        return list;
    }
});

Template.registerHelper('Pages', function(router) {

    var data = pages.findOne({ type: 'singlepage', router: router });
    var list = [];
    if (data) {
        var ids = data.productid;
        if (ids.length > 0) {
            for (i = 0; i < ids.length; i++) {
                var pro = products.findOne({ _id: ids[i] });
                //console.log(pro);
                list.push(pro);
            }
        }
        return { products: list };
    } else return;


})
window.Pages = function(router) {
    var data = pages.findOne({ type: 'singlepage', router: router });
    var list = [];
    if (data) {
        var ids = data.productid;
        if (ids.length > 0) {
            for (i = 0; i < ids.length; i++) {
                var pro = products.findOne({ _id: ids[i] });
                //console.log(pro);
                list.push(pro);
            }
        }
        return { products: list };
    } else return;
}
UI.registerHelper('getHumanDate', function(timestamp) {

    var d = new Date(timestamp * 1000),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    hour = d.getHours();
    min = d.getMinutes();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('/') + ' ' + hour + ':' + min;
});
getTimestamp = function() {
    var date = new Date();
    var timestamp = date.getTime() / 1000;
    return timestamp;
}
getAttrParentByAttrId = function(parent) {
    return parentattr.findOne({ _id: parent });
}
oneProduct = function(result, enableQuickview = '', enableAddtoCart = '') {
    // var product_id = result._id;
    // var title = result.title;
    // //var price = result.price;
    // var attr = attribute.find({ "product": result.oldId }).fetch();
    // if(attr.length > 0){
    //     var re_price = attr[0].price;
    //     var price = re_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //     if(price==0){
    //         var re_price = result.price;
    //         var price = re_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //     }
    // }else{
    //    // var price=1111;
    //     var re_price = result.price;
    //     if(re_price)
    //         var price = re_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //     else
    //         var price=0;
    // }
    if (!result)
        return;
    var product_id = result._id;
    var title = result.title;
    var brand = result.Brand;

    // console.log('looping for '+title);
    // console.log('looping  '+result.oldId);
    //var price = result.price;

    Meteor.call('getAttributeFromProduct', result.oldId, function(err, ret) {
        if (ret != null)
            Session.set('AttributeFromProduct1_' + ret.product, ret.list);
    });

    var attr = Session.get('AttributeFromProduct1_' + result.oldId);

    if (!attr)
        return;
    //console.log(attr);
    //console.log('Found  '+attr.length);
    //var attr = attribute.find({ "product": result.oldId }).fetch();

    if (attr.length > 0) {
        var re_price = attr[0].price + "";
        re_price = re_price.replace(/\s+/g, '');

        var price = re_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (price == 0) {
            var re_price = (result.price).toString();
            re_price = re_price.replace(/\s+/g, '');

            var price = re_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    } else {
        // var price=1111;
        var re_price = (result.price).toString();
        re_price = re_price.replace(/\s+/g, '');

        if (re_price)
            var price = re_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        else
            var price = 0;
    }

    var img = getImgForProduct(result._id);
    var imgCDN = getImgForProductCDN(result._id);
    var myslug = slugname(title);

    //var fav = '';
    var userid = Meteor.userId();

    var fav = favorite.findOne({ proId: result._id, userId: userid });

    if (fav) {

        var heartempty = 'nonelike';
        var heartfull = '';
    } else {
        var heartempty = '';
        var heartfull = 'nonelike';
    }
    //==========
    var htmlattr = '';
    var myattr = '';
    if (result.oldId != 'undefined' && result.oldId != null) {
        myattr = attribute.find({ 'product': result.oldId });
        //console.log('Attribute:', oneattr.length )
        if (myattr.count() > 0) {
            myattr.forEach(function(data, index) {
                var pattr = getAttrParentByAttrId(data.parent);
                if (data.value != null && pattr != 'undefined') {
                    if (pattr.name === 'Size')
                        htmlattr += '<a href="#" class="size-productlist" data-pro="' + product_id + '" data-size="' + data._id + '">' + data.value + ' </a>&nbsp;&nbsp;';
                }
            })
        }
    }
    /*var htmlattr='<div class="choose-size"><ul class="nav nav-justified select-size">';
    var allattr=attribute.find({'product':result.oldId});
    allattr.forEach(function(v){
        htmlattr+='<li><p class="img_attr">'+v.value +'</p></li>'
    })
    htmlattr+='</ul> </div>'*/
    //==========
    var html = '';
    /*if(){
        html += '<li class="li-news-home">';
    }else{*/
    html += '<li class="col-md-3 col-sm-6 col-lg-3 col-xs-12 home-ads-list">';
    //}
    html += '<div class="thumbnail">';
    html += '<div class="hold-quickview">';
    //html +=             '<a href="/details/'+myslug+'"><img style="height:201px" class="img-responsive" src="/uploads/2ZDZrhQ47mfF9JffP-love1.jpg" alt="'+title+'"></a>';
    html += '<a href="/details/' + myslug + '"><img data-id="' + product_id + '" style="height:201px;width:201px"  src="' + img + '" onError="this.onerror=null;this.src=\'' + imgCDN + '\';" alt="' + title + '"></a>';
    if (!enableQuickview) {
        html += '<div class="quickview"><button type="button" data-id="' + product_id + '" id="quickbtn" class="btn btn-quickview center-block btn-block" data-toggle="modal" data-target="#quickView">Quick View</button></div>';

    }

    html += '</div>';
    html += '<div class="caption" id="pro' + product_id + '">';
    // html += '<p>';
    html += '<p class="text-center" style="font-weight:bold; color:#000;"> ' + brand + '</p>';
    html += '<a href="/details/' + myslug + '">' + title + '</a>';
    html += '<p>' + htmlattr + '</p>';
    html += '<div class="rating">';
    //html +=                 '<span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star"></span><span class="glyphicon glyphicon-star-empty"></span><span class="glyphicon glyphicon-star-empty"></span></div>';
    // html += '<p>';
    html += '<a class="price pull-left price' + product_id + '" style="font-size:19px;">' + price + '</a><span>&nbsp;&nbsp;ریال</span>';
    html += '<a href="#" data-id="' + product_id + '" class="heart pull-right ' + heartempty + ' unlike unlike' + product_id + '"><span class="fa fa-heart-o"></span></a>';
    html += '<a href="#" data-id="' + product_id + '" class="heart pull-right ' + heartfull + ' like like' + product_id + '"><span class="fa fa-heart fa-heart-full"></span></a>';
    // html += '</p>';
    html += '</div>';
    if (enableAddtoCart == true) {
        html += '<button class="btn profile-black" type="button">ADD TO CART</button>';
    }
    html += '</div>';
    html += '</li>';
    return html;
}
favoriteProduct = function(result, enableQuickview = '', enableAddtoCart = '') {
    var product_id = result._id;
    var title = result.title;
    //var catname = categories.findOne({"_id":result.category}).title;
    //var price = result.price;

    var attr = attribute.findOne({ "product": result.oldId });
    if (attr) {
        var re_price = attr.price;
        var price = re_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (price == 0) {
            var re_price = result.price;
            var price = re_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    } else {
        //console.log("PRICE HAMLY "+result.oldId);
        // var price=1111;
        var re_price = result.price;
        if (re_price)
            var price = re_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        else
            var price = 0;
    }
    var img = getImgForProduct(result._id);
    var imgCDN = getImgForProductCDN(result._id);
    var myslug = slugname(title);

    var fav = '';
    var userid = Meteor.userId();

    fav = favorite.findOne({ proId: result._id, userId: userid });

    if (fav) {

        var heartempty = 'nonelike';
        var heartfull = '';
    } else {
        var heartempty = '';
        var heartfull = 'nonelike';
    }
    var html = '';
    /*html += '<div class="row" style="padding-top: 50px;">';
        html += '<div class="col-md-3">';
            html += '<a href="/details/'+myslug+'"><img src="'+img+'" class="img-responsive" width="120" height="120" onError="this.onerror=null;this.src=\''+imgCDN+'\';" alt="'+title+'"></a>';
        html += '</div>';
        html += '<div class="col-md-3">';
            html += '<div class="deatil-favo">';
            html += '<span>'+title+'</span>';
            html += '<h4>Size:</h4>';
                html += '<ul class="list-inline size-product">';
                html += '<li class="active"><a id="img_attr" href="">100 میلی لیتر</a></li>';
                html += '<li><a id="img_attr" href="">100 میلی لیتر</a></li>';
                html += '</ul>';
                html += '<div id="gallerycontainer" dir="ltr">';
                    html += '<div id="gallery">';
                        html += '<ul class="list-inline img-attribute">';
                           html += '<li>';
                                html += '<a href=""><img src="'+img+'" onError="this.onerror=null;this.src=\''+imgCDN+'\';" alt="'+title+'"></a>';
                            html += '</li>';
                        html += '</ul>';
                   html += '</div>';
                html += '</div>';
            // html += '<p><span class="glyphicon glyphicon glyphicon-ok-sign color3" aria-hidden="true"></span></p>';
        html += '</div>';
    html += '</div>';
    html += '<div class="col-md-3">';
        html += '<div class="deatil-favo left-textfavo">';
            html += '<span class="price-favo">'+price+' ریال</span>';
        html += '</div>';
    html += '</div>';
    html += '<div class="col-md-3">';
        html += '<div class="deatil-favo pull-right">';
            if (TAPi18n.getLanguage() == 'fa') {
                html += '<button style="background:#000;color:#fff;font-size:18px;" class="btn profile-black" id="addtocart" type="button">افزودن به سبد خرید</button>';
            }else{
                html += '<button style="background:#000;color:#fff;font-size:18px;" class="btn profile-black" id="addtocart" type="button">ADD TO CART</button>';
            }
        html += '</div>';
        html += '<div class="clearfix"></div>';
        html += '<a href="#" data-id="' + product_id + '" class="heart pull-right ' + heartempty + ' unlike unlike' + product_id + '"><span class="fa fa-heart-o"></span></a>';
        html += '<a href="#" data-id="' + product_id + '" class="heart pull-right ' + heartfull + ' like like' + product_id + '"><span class="fa fa-heart fa-heart-full"></span></a>';
        //html += '<span class="glyphicon glyphicon-remove-circle pull-right" aria-hidden="true"></span>';
    html += '</div>';
    html += '</div>';

    html += '<div class="border-favo">';
        html += '<hr style="border:1px solid #e9e9e8;">';
    html += '</div>';
    return html;*/
}
oneProductReward = function(result, enableQuickview = '', enableAddtoCart = '') {
    var product_id = result._id;
    var title = result.title;
    var attr = attribute.findOne({ "product": result.oldId });
    if (attr) {
        var price = attr.price;
    } else {
        var price = result.price;
    }



    var img = getImgForProduct(result._id);
    var imgCDN = getImgForProductCDN(result._id);
    var myslug = slugname(title);

    var fav = '';
    var userid = Meteor.userId();

    fav = favorite.findOne({ proId: result._id, userId: userid });

    if (fav) {

        var heartempty = 'nonelike';
        var heartfull = '';
    } else {
        var heartempty = '';
        var heartfull = 'nonelike';
    }
    var html = '';
    html += '<li class="col-md-3 col-sm-6 col-lg-3 col-xs-12 home-ads-list">';
    html += '<div class="thumbnail">';
    html += '<div class="hold-quickview">';
    html += '<a href="/details/' + myslug + '"><img style="height:201px;width:201px"  src="' + img + '" onError="this.onerror=null;this.src=\'' + imgCDN + '\';" alt="' + title + '"></a>';
    if (!enableQuickview) {
        html += '<div class="quickview"><button type="button" data-id="' + product_id + '" id="quickbtn" class="btn btn-quickview center-block btn-block" data-toggle="modal" data-target="#quickView">Quick View</button></div>';

    }

    html += '</div>';
    html += '<div class="caption">';
    html += '<p class="title"><a href="/details/' + myslug + '">' + title + '</a></p>';

    if (enableAddtoCart == true) {
        html += '<button class="btn profile-black" type="button">ADD TO CART</button>';
    }
    html += '</div>';
    html += '</li>';
    return html;
}

getLocationProducts = function(data) {
    var text = '';
    if (data.length > 0) {
        for (i = 0; i < data.length; i++) {
            var pro = products.findOne({ _id: data[i] });

            if (pro) {
                var image = getImgForProduct(pro._id);
                //text += '<li class="col-md-3"><img src="'+image+'" class="img-responsive"></li><li class="col-md-3">'+pro.title+'</li>';
                text += '<div class="list-pro">';
                text += '<li class="col-md-5"><span class="glyphicon glyphicon-remove-circle remove" pro-id="' + pro._id + '"></span><img src="' + image + '" width="60" height="60"></li>';
                text += '<li class="col-md-7">' + pro.title + '</li>';
                text += '</div>';

            }
        }
        return text;
    } else return;
}
getPages = function() {
    return pages.find({});
}
getFavUserId = function() {
    if (Meteor.userId()) {
        var userId = Meteor.userId();

    }
    return userId;
}
getCurrentUserId = function() {
    var userId = Meteor.userId();
    if (userId) {
        return userId;
    } else {
        return Session.get("userId");
    }
}
getpoint = function(typename, blackpt, silverpt, goldpt) {
    typename = typename.toLowerCase();
    if (typename == 'black') return blackpt;
    if (typename == 'silver') return silverpt;
    if (typename == 'gold') return goldpt;
}


cleanTitle = function(name) {
    name = name.replace(/ô/g, "o");
    name = name.replace(/Ô/g, "O");
    return name;
}
EarnPoint = function(action, blackpt, silverpt, goldpt) {
    //var user = Meteor.user();
    var userid = Meteor.userId();
    // var point = userid.profile.shipcard.point;
    var profile = Meteor.users.findOne({ _id: userid }).profile;
    var point = profile.shipcard.point;
    var memberid = profile.shipcard.membershipID;
    var member = membership.findOne({ _id: memberid });
    var typename = (member != '') ? member.name : '';
    var addpoint = getpoint(typename, blackpt, silverpt, goldpt);
    Meteor.call('updateUserPoint', userid, point, addpoint);
    if (TAPi18n.getLanguage() == 'fa') {
        Bert.icons['my-error'] = 'fa-earnpoint-iconbg';
        Bert.alert({
            message: 'با موفقیت برنده ' + addpoint + '  امتیاز شدید! <br><a href="/member" style="color:#B81425; margin-left:60px;">کسب امتیازات بیشتر</a>',
            type: 'my-error',
            style: 'growl-bottom-right',
            icon: 'fa-earnpoint-iconbg'
        });
    } else {
        Bert.icons['my-error'] = 'fa-earnpoint-iconbg';
        Bert.alert({
            message: 'Success you win ' + addpoint + ' points ! <br><a href="/member" style="color:#B81425; margin-left:60px;">Earn more points</a>',
            type: 'my-error',
            style: 'growl-bottom-right',
            icon: 'fa-earnpoint-iconbg'
        });
    }

    /*var upoint = Meteor.users.findOne({ _id: Meteor.userId() }).profile.shipcard.point;
    var resultmembership = membership.find();
    var arrmem = [];
    resultmembership.forEach(function(value) {
        if (value.minpoint <= upoint && upoint <= value.maxpoint) {
            arrmem.push(value);
        }
    });
    if (arrmem[0].name == 'black') {
        point = blkpoint;
    }
    if (arrmem[0].name == 'silver') {
        point = slvpoint;
    }
    if (arrmem[0].name == 'gold') {
        point = gldpoint
    }
    upoint += point;
    return upoint;*/

}
window.addToCart = function(id_product, dataattr, userId, qty) {
    var myproduct = products.findOne({ _id: id_product });
    var price = 0;
    var subtotal = 0;
    qty = parseInt(qty);
    if (myproduct) {
        var oldId = myproduct.oldId;
        var attr = attribute.findOne({ _id: dataattr });
        if (attr) {
            price = attr.price;
        } else {
            price = myproduct.price;
        }
    }
    price = price.toString().replace(/\s/g, '');
    console.log('Qty:', qty);
    console.log('Price:', price);
    console.log('Attribute:', dataattr)
    var sameproduct = cart.find({ id_product: id_product, userId: userId, attribute: dataattr }).fetch();
    Session.set('ADDTOCART', Session.get('ADDTOCART') + 1);
    if (sameproduct.length > 0) {
        sameproduct = sameproduct[0];
        var pro = products.findOne({ _id: id_product });
        upqty = parseInt(sameproduct.quantity) + parseInt(qty);
        if (pro) {
            subtotal = upqty * parseInt(price);
        }
        // console.log('update of the cart');
        var obj = { quantity: upqty, subtotal: subtotal };
        Meteor.call('updateStatus', sameproduct._id, obj);
        if (TAPi18n.getLanguage() == 'fa') {
            Bert.icons['my-error'] = 'fa-addcart-iconbg';
            Bert.alert({
                message: 'محصول با موفقیت به سبد خرید افزوده شد!<br><a href="/checkout" style="color:#B81425; margin-left:80px;">مشاهده لیست خرید</a>',
                type: 'my-error',
                style: 'growl-bottom-right',
                icon: 'fa-addcart-iconbg'
            });
        } else {
            Bert.icons['my-error'] = 'fa-addcart-iconbg';
            Bert.alert({
                message: 'Success, Insert Add to Cart ! <br><a href="/checkout" style="color:#B81425; margin-left:80px;">See checkout</a>',
                type: 'my-error',
                style: 'growl-bottom-right',
                icon: 'fa-addcart-iconbg'
            });
        }
        $('.close').click();
        // Router.go("/checkout");
    } else {
        var pro = products.findOne({ _id: id_product });
        if (pro) {
            subtotal = parseInt(qty) * parseInt(price);
        } else
            subtotal = 0;
        var obj = {
            id_product: id_product,
            userId: userId,
            quantity: qty,
            subtotal: subtotal,
            attribute: dataattr,
            order_status: 0
        };
        Meteor.call('addtocart', obj);
        if (TAPi18n.getLanguage() == 'fa') {
            Bert.icons['my-error'] = 'fa-addcart-iconbg';
            Bert.alert({
                message: 'محصول با موفقیت به سبد خرید افزوده شد!<br><a href="/checkout" style="color:#B81425; margin-left:80px;">مشاهده لیست خرید</a>',
                type: 'my-error',
                style: 'growl-bottom-right',
                icon: 'fa-addcart-iconbg'
            });
        } else {
            Bert.icons['my-error'] = 'fa-addcart-iconbg';
            Bert.alert({
                message: 'Success, Insert Add to Cart ! <br><a href="/checkout" style="color:#B81425; margin-left:80px;">See checkout</a>',
                type: 'my-error',
                style: 'growl-bottom-right',
                icon: 'fa-addcart-iconbg'
            });
        }
    }
}
Template.registerHelper("quickviewStyle", function(img, price) {
    if (TAPi18n.getLanguage() == 'fa')
        return 'fa_quickview';
    else
        return 'en_quickview';
});

Template.registerHelper("getAttributeById", function(id_attr) {
    return getAttributeById(id_attr);
});
window.getAttributeById = function(id_attr) {

    var attr = attribute.findOne({ _id: id_attr });
    console.log('attr:', attr);
    if (attr.parent != 'undefined') {
        var pattr = parentattr.findOne({ _id: attr.parent });
        //console.log( 'attribute:', {pattr:pattr, attr:attr})
        return { pattr: pattr, attr: attr }
    }

}

// getProfileImg
Template.registerHelper('getImgProfile', function(id) {
    var image = getImgProfile(id);
    return image;

});
Template.registerHelper('getImgProfileCDN', function(id) {
    var image = getImgProfileCDN(id);
    return image;

});
getImgProfileCDN = function(id) {
    if (id == '' || typeof id == "undefined")
        return '/img/default_profile.png';

    else if (id.indexOf("upload/images") > -1) {
        id = id.replace(/ /g, "%20");
        path = id.replace('/upload/images/', '');
        return Session.get('IMG_CDN') + '/upload/' + path;
    } else if (id.indexOf("http://") > -1) {
        return id;

    } else {
        Meteor.call('getImgPath', id, function(err, data) {
            if (err) console.log(err);
            else Session.set('IMAGE' + data.id, data.path);
        });
        var product = Session.get('IMAGE' + id);
        if (product == -1)
            return null
        else {
            img = product;
        }
        if (img) {
            return Session.get('IMG_CDN') + '/upload/' + img;

        } else {
            return;
        }
    }
};

getImgProfile = function(id) {
    if (id == '' || typeof id == "undefined")
        return '/img/default_profile.png';
    else if (id.indexOf("upload/images") > -1) {
        id = id.replace(/ /g, "%20");
        path = id.replace('/upload/images/', '');
        return '' + path;
    } else if (id.indexOf("http://") > -1) {
        return id;

    } else {
        Meteor.call('getImgPath', id, function(err, data) {
            if (err) console.log(err);
            else Session.set('IMAGE' + data.id, data.path);
        });
        var product = Session.get('IMAGE' + id);
        if (product == -1)
            return null
        else {
            img = product;
        }
        if (img) {
            var imgUrl = "/uploads/" + img;
            return imgUrl;

        } else {
            return;
        }
    }
};

window.getListCategoryByParent = function(cats) {
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
    return list_categories;
}
window.getListCategoryByName = function(name) {
    if (name != 'undefined' && name != null) {
        var l = categories.findOne({ "i18n.en.title": name });
        if (l == "undefined" || l == null) {
            var title = name;
            //console.log('Title:', title);
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
            l = categories.findOne({ title: title });

        }
        return l;
    }
}
