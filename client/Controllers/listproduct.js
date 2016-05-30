Session.set("pro","");
Session.set("proNew","");

Template.addlistproduct.helpers({
    getListPro:function(){
        var arr=[];
        var idArray=[];
        if(this._id){
            var string=this.products.toString();
            if(Session.get('pro')){
                string=Session.get('pro');
            }
            Session.set('pro',string);
            idArray=string.split(',');
            Session.set('idlistpro', idArray);
            for(var i=0;i<idArray.length;i++){
                if(idArray[i]!=""){
                    var result=products.findOne({_id:idArray[i]});
                    arr.push(result);
                }
            } 
        }else{
         var ids=Session.get('pro');
         idArray=ids.split(',');
         Session.set('idlistpro', idArray);
         for(var i=0;i<idArray.length;i++){
            if(idArray[i]!=""){
                var result=products.findOne({_id:idArray[i]});
                arr.push(result);
            }
        } 
    }

    return arr;
},
getListProduct: function(){
    return list_product.find();
},
getProcount: function(products){
    return products.length;
},
getProduct: function(){
    return products.find();
},
});
Template.updatelistproduct.helpers({
    getProduct: function(){
        return products.find();
    },
    getlistPro: function(){
        var id = this._id;
        var list = list_product.find({_id:id});
        return list;
    }
});
Template.addlistproduct.events({
    'click #btnAdd': function(e) {
        e.preventDefault();
        var site = $('#product').val();
        if(Session.get("pro")){
            var listTags=Session.get("pro")+","+site;
        }else{
            var listTags=site;  
        }
        Session.set('newIdpro',listTags);
        Session.set("pro", listTags);
    },
    'click #btnSubmit': function(e){
        var arr=[];
        e.preventDefault();
        var title = $('#title').val();
        var type = $('#type').val();
        if(title!=='' && type!==''){
            var myArray=Session.get('idlistpro');
            for(var i=0;i<myArray.length;i++){
                if(myArray[i]!=""){
                    arr.push(myArray[i]);
                }
            }
            var obj={
                title:title,
                type:type,
                products:arr
            }
            if(this._id){
                Meteor.call('updateList_pro',this._id,obj);
                Bert.alert('Add Successfully!','Success','growl-bottom-right');
            }else{
                Meteor.call('addlistPro',obj);
                Bert.alert('Update Successfully!','Success','growl-bottom-right');
            }
        }else{
            Bert.alert('Some fields is required, please check again!','danger','growl-bottom-right');
        }
        
        
        //alert("Successfully appended");
        Router.go('addlistproduct');
    },
    'click #removeSes':function(e){
        e.preventDefault();
        
        var alltags = Session.get('pro');
        var id = this._id;
        var resl = alltags.replace(id, "");
        var prolistId=$('#value_hidden').val();
        if(prolistId){
          Meteor.call('updateListpro',prolistId,id);  
      }

      Session.set("pro", resl);   
  },
  'click #remove': function(e){
    e.preventDefault();
    var id = this._id;
    return list_product.remove({_id:id});
},
'click #clear':function(e){
    e.preventDefault();
    Session.set('pro','');
},
"click #sortname":function(e){
    e.preventDefault();
    var result = products.find({}, {sort: {title:1}});
       // alert(result);
       return result;
   },
   'click #editListpro':function(e){
    e.preventDefault();
    delete Session.keys['pro'];
    var url='/updatelistproduct/'+this._id;
    Router.go(url);
}
});

Template.listproducts.helpers({
   getallprice: function(oldId){
    var attrprice = attribute.findOne({"product":oldId});
    return attrprice;
}
});
Template.listproducts.events({
/*'click .unlike':function(e){
        e.preventDefault();
        var unlike ='.unlike'+$(e.currentTarget).attr('data-id');
        var like = '.like'+$(e.currentTarget).attr('data-id');
        $(unlike).addClass('nonelike');
        $(like).removeClass('nonelike');    
        if(!Session.get('userId')){
            var newId=Random.id();
            Session.setPersistent('userId',newId);
        }             
        var userId=Session.get('userId');
        var obj={
            proId:this._id,
            userId:userId
        }
        Meteor.call('insertFavoritee',obj);
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصول شده است اضافه به مورد علاقه','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been add to Favorite','success','growl-bottom-right');
        }
        $('.close').click();
    },
    'click .like':function(e){
        e.preventDefault();
        var id=$(e.currentTarget).attr('data-id');
        var unlike ='.unlike'+$(e.currentTarget).attr('data-id');
        var like = '.like'+$(e.currentTarget).attr('data-id');
        $(like).addClass('nonelike');
        $(unlike).removeClass('nonelike');
        var userId=Session.get('userId');                    
        var obj=favorite.findOne({$and:[{userId:userId},{proId:id}]});       
        favorite.remove(obj._id);
        if(TAPi18n.getLanguage()=='fa'){
          Bert.alert('محصول شده است به مورد علاقه حذف','success','growl-bottom-right');
        }else{
          Bert.alert('Product has been Removed from Favorite','success','growl-bottom-right');
        }
        $('.close').click();
    }*/
});

Template.listproducts.onRendered(function(){
    var userId=Session.get('userId');
    var favoritelist=favorite.find({userId:userId});
    favoritelist.forEach(function(value){
      var like=".like"+value.proId;
      var unlike=".unlike"+value.proId;
      $(like).removeClass('nonelike');
      $(unlike).addClass('nonelike');
    });
    //alert("backt to top");
    var offset = 1400,
    offset_opacity = 1200,
    scroll_top_duration = 700,
    $back_to_top = $('.cd-top');
    $(window).scroll(function(){
        ( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
        if( $(this).scrollTop() > offset_opacity ) {
            $back_to_top.addClass('cd-fade-out');
        }
    });
    $back_to_top.on('click', function(event){
        event.preventDefault();
        $('body,html').animate({
            scrollTop: 0 ,
            }, scroll_top_duration
        );
    });
});