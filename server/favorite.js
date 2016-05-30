Meteor.methods({
    insertFavoritee: function(attr) {
        favorite.insert(attr);
    },
    deleteFavoritee: function(productId, userId) {
        favorite.remove({ proId: productId, userId: userId });
    },
    reviewtFavorite: function(attr) {
        favoritereview.insert(attr);
    },
   listfavorite:function(){
	var data = favorite.find().count();
	console.log("my favorite:"+data);
	return data;
	}
});
