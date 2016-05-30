Meteor.methods({
    addReview: function(idreview, title, text, grade, userid, productId) {
        var curDate = Date.now();
        var attr = {
            idreview: idreview,
            title: title,
            comment: text,
            grade: grade,
            user: userid,
            date: curDate
        };

        products.update({ "_id": productId }, { $addToSet: { review: attr } });

    },
    addReviewwebzine: function(idreview, title, text, grade, userid, id) {
        var curDate = Date.now();
        var attr = {
            idreview: idreview,
            title: title,
            comment: text,
            grade: grade,
            user: userid,
            date: curDate
        };

        return contents.update({ "_id": id }, { $addToSet: { review: attr } });

    },
    addReviewTuto: function(idreview, title, text, grade, userid, productId) {
        var curDate = Date.now();
        var attr = {
            idreview: idreview,
            title: title,
            comment: text,
            grade: grade,
            user: userid,
            date: curDate
        };

        contents.update({ "_id": productId }, { $addToSet: { review: attr } });

    },
    updatelikereview: function(reviews, productid) {
        //console.log("visal" + productid + ":" + reviews);
        return products.update({ _id: productid }, { $set: { "review": reviews } });

    },
    addpointinst: function(userid, point) {
        return Meteor.users.update({ _id: userid }, { $set: { "profile.shipcard.point": point } });
    }

});
