Meteor.methods({
   editprofile: function(id,attr) {
      Meteor.users.update({_id:id},{$set: attr});
    },
    editarray: function(id,arr) {
      Meteor.users.update({_id:id},{$addToSet: arr});
    },
    addanswer: function(id,array) {
      Meteor.users.update({_id:id},{$set: array});
    },
    imedatPoint:function(id,obj){
    	Meteor.users.update({_id:id},{$set:obj});
    },
    earnPoint: function(userid,point) {
      Meteor.users.update({_id:userid},{$set: {"profile.shipcard.point":point}});
    },
    insertShare:function(attr){
      share.insert(attr);
    },
    insertView:function(attr){
      viewing.insert(attr);
    },
    updatestatusearnpoint:function(id){
      Meteor.users.update({_id:id},{$set: {status:1}});
    },
    updateUserPoint: function(id, point, addpoint){
        var total = Number(point + addpoint);
        Meteor.users.update({_id:id},{$set: {'profile.shipcard.point':total}});
        var list = membership.find();

        if( list.count() > 0 ){
          list.forEach( function(value, index){
              if( total > value.minpoint && total <= value.maxpoint && value.name.toLowerCase() == 'silver'){
                  Meteor.users.update({_id:id},{$set: {'profile.shipcard.membershipID':value._id}});
              }
              else if( total > value.minpoint && total <= value.maxpoint && value.name.toLowerCase() == 'gold'){
                  Meteor.users.update({_id:id},{$set: {'profile.shipcard.membershipID':value._id}});
              }
          })
        }
    },
    updateStatusProfile:function(id){
        Meteor.users.update({_id:id},{$set: {"profile.earnpoint":1}});
    },
    editEmail:function(email){
      Meteor.users.update({_id:Meteor.userId()},{$set:{"emails.0.address":email}});
    },
    updateImageUser:function(idimage){
      var dataimage = Meteor.users.findOne({_id:Meteor.userId()});
      var objimage = [];
      if( dataimage && typeof dataimage.image != 'undefined'){
        if( dataimage.image instanceof Array  ){
          objimage = dataimage.image
        }else {
          objimage.push( dataimage.image );
        }
        objimage.push( idimage );
      }else{
        objimage.push( idimage );
      }
      Meteor.users.update({_id:Meteor.userId()},{$set:{image:objimage}});
    },
    getImageById: function( imageId ){
      var img = images.findOne({_id:imageId})
      if( img )
        return img.copies.images.key;
      else
        return '';
    },
    updateProfilePic: function(userid, obj){
        Meteor.users.update({_id:userid},{$set:{image:obj}});
    },
    savePhoto: function( data ){
      var base64Data = data.replace(/^data:image\/jpeg;base64,/, "");
      fullpath=process.env.PWD;
      if( typeof fullpath == 'undefined' ){
        base_path = Meteor.npmRequire('fs').realpathSync( process.cwd() + '../../' );
        base_path = base_path.split('\\').join('/');
        base_path = base_path.replace(/\/\.meteor.*$/, '');
      }else{
        base_path=fullpath;
      }
      var img_name = new Meteor.Collection.ObjectID();
      img_name = img_name._str;
      var date = new Date().toString();
    
      //var Fsimage = new Meteor.Collection('cfs.images.filerecord');
       Meteor.npmRequire('fs').writeFile(base_path+"/upload/"+img_name+".jpg", base64Data, 'base64', function(err) {
      
      });
      images.insert(base_path+"/upload/"+img_name+".jpg", function (err, fileObj) {
        if(err) console.log(err);
        else{
          var userdata = Meteor.users.findOne({_id:Meteor.userId()});
          var arrimg = [];
            
          if( userdata.image instanceof Array  )
            arrimg = userdata.image;
          else
            arrimg.push(userdata.image);

          arrimg.push(fileObj._id);
          Meteor.users.update({_id:Meteor.userId()},{$set:{image:arrimg}});
          Meteor.npmRequire('fs').unlinkSync(base_path+"/upload/"+img_name+".jpg");
        } 
      })
    }
});