Meteor.methods({
    // shop 
    showNameParentAttr:function(id_attr){
        var attr=attribute.findOne({_id:id_attr});
        if(attr && attr!='undefined'){
            var attrParent=parentattr.findOne({_id:attr.parent});
            return {id_attr:id_attr,name:attrParent.name};
        }
    },
    showAttrValue:function(id_attr){
        var attr=attribute.findOne({_id:id_attr});
        if(attr && attr!='undefined'){
            return {id_attr:id_attr,value:attr.value};
        }
    },
    insertCart: function(obj) {
        order.insert(obj);
    },
    removemycheckout: function(id) {
        cart.remove(id);
    },
    saveInvoice: function(res, amount, orderid) {
        var time = Date.now();
        var obj = {
            time: time,
            resNum: res,
            amount: amount,
            order: orderid
        };
        invoices.insert(obj);
    },
    addAdress: function(id, add) {
        order.update({ orderId: id }, { $addToSet: { address: add } });
    },
    updateMyCart: function(id_product, userId, qty, id_attr) {
        var mycart = cart.findOne({ id_product: id_product, userId: userId, attribute: id_attr });
        if (mycart) {
            var attrid = mycart.attribute;
            var price = 0;
            var attrdata = attribute.findOne({ _id: attrdata });
            if (attrdata) {

                price = attrdata.price;

            } else {
                price = products.findOne({ _id: id_product }).price;
            }

            price = price.toString().replace(/\s/g, '');

            //console.log('qty from cart:', mycart.quantity);
            //qty =  qty + parseInt(mycart.quantity);
            var subtotal = qty * parseInt(price);

            cart.update({ id_product: id_product, userId: userId, attribute: id_attr }, { $set: { quantity: qty, subtotal: subtotal } });
        }
    },
    removeProInCart: function(userid, dataPro, dataProAttr) {
        cart.remove({ userId: userid, id_product: dataPro, attribute: dataProAttr });
    },
    minusPointUser: function(newpoint) {
        var id = Meteor.userId();
        Meteor.users.update({ _id: id }, { $set: { 'profile.shipcard.point': newpoint } });
    },
    removeItem: function(proId, id) {
        var pro=products.findOne({_id:proId});
        if(pro){
            if(pro.category == 'tester'){
                order.update({ _id: id }, { $pull: { items: { id_product: proId } } });
                var items=order.findOne({_id:id}).items;
                if(items.length == 0){
                    order.remove({_id:id});
                }
            }
        }
    },
    getAllPointProOrder:function(item){
        var allpoint = 0;
        var data_id=[];
        for(var i=0;i<item.length;i++){
            var proId = item[i].id_product;
            data_id.push(proId);
            var qty = item[i].qty;
            var myproduct = products.findOne({_id:proId, category:"tester"});
            if(myproduct !== "undefined" && myproduct){
                var points =  myproduct.point;
                var total = points*qty;
                allpoint = allpoint+total;
            }
        }
        return {allpoint:allpoint,data_id:data_id};
    }
});
