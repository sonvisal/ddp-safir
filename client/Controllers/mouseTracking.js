

Session.setDefault("NAME_DIV","");
Session.setDefault("NAME_LOCATION","");
Session.setDefault("NAME_IP","");
Session.setDefault("USER_TRACKING", "");
// Auto scroll start
Session.set('limitTracking',25);

Template.header.events({
    "mouseenter .header":function(e,tpl){
        e.preventDefault();
        var currentLocation = window.location.href;
        var datestr = new Date().toString("yyyy-MM-dd HH:mm:ss");
        var timestamps = new Date();
            timestamps = timestamps.getTime();
        var timestamp = new Date(timestamps);
        var userId = Meteor.userId();
        var location = $(e.currentTarget).attr("name");
    }
    

});
Template.mouseTracking.helpers({
    getmouseTracking: function(){
        var name = Session.get("NAME_DIV");
        var location = Session.get("NAME_LOCATION");
        var ip = Session.get("NAME_IP");
        var userTrack = Session.get("USER_TRACKING");
        if(name)
            return userTracking.find({location:name},{sort:{time:1} ,limit:25});
        else if(location)
            return userTracking.find({currenturl:location},{sort:{time:1},limit:25});
        else if(ip)
            return userTracking.find({ip:ip},{sort:{time:1},limit:25});
        else if(userTrack)
            return userTracking.find({userId:userTrack},{sort:{time:1},limit:25});
        else
            return userTracking.find({},{sort:{time:1},limit:25});
    },
    getmoreTracking:function(){
        var name = Session.get("NAME_DIV");
        var location = Session.get("NAME_LOCATION");
        var limit = Session.get("limitTracking");
        var ip = Session.get("NAME_IP");
        var userTrack = Session.get("USER_TRACKING");

        if(name){
            var myname = userTracking.find({location:name},{sort:{time:1} ,limit:limit}).fetch();
            if(myname.length){
                return myname.slice(25,myname.length);
            }
        }else if(location){
            var mylocat = userTracking.find({currenturl:location},{sort:{time:1} ,limit:limit}).fetch();
            if(mylocat.length){
                return mylocat.slice(25,mylocat.length);
            }
        }else if(ip){
            var myIp = userTracking.find({ip:ip},{sort:{time:1} ,limit:limit}).fetch();
            if(myIp.length){
                return myIp.slice(25,myIp.length);
            }
        }
        else if(userTrack){
            var myUser = userTracking.find({userId:userTrack},{sort:{time:1} ,limit:limit}).fetch();
            if(myUser.length){
                return myUser.slice(25,myUser.length);
            }
        }else{
            if(limit>25){
                var items = userTracking.find({},{sort:{time:1} ,limit:limit}).fetch();
                if(items.length>0){
                    return items.slice(25,items.length);
                }
            }
        }

    },
    gettimeUserTracking:function(time){
        var today= new Date(time * 1000);
        var day = today.getDay();
        var month = today.getMonth();
        var year = today.getFullYear();
        var hour    = today.getHours();
        var minute  = today.getMinutes();
        var seconds = today.getSeconds();
        return day+"day/ "+hour+":"+minute;
    },
    getName:function(){
        var arr=[];
        var name=[];
            function onlyUnique(value, index, self) { 
             return self.indexOf(value) === index;
            }
            var result = userTracking.find();
            result.forEach(function(value){
                arr.push(value.location);
            });

            var unique = arr.filter(onlyUnique);
      
            return unique;
        },
        getLocation:function(){
        var arr=[];
        var name=[];
            function onlyUnique(value, index, self) { 
             return self.indexOf(value) === index;
            }
            var result = userTracking.find();
            result.forEach(function(value){
                arr.push(value.currenturl);
            });

            var unique = arr.filter(onlyUnique);
      
            return unique;
        },
        getIp:function(){
        var arr=[];
        var name=[];
            function onlyUnique(value, index, self) { 
             return self.indexOf(value) === index;
            }
            var result = userTracking.find();
            result.forEach(function(value){
                arr.push(value.ip);
            });

            var unique = arr.filter(onlyUnique);
      
            return unique;
        },
       geturl:function(){
        return userTracking.find({});
    },
    getUserName:function(){
        var arr=[];
        var name=[];
        function onlyUnique(value, index, self) { 
         return self.indexOf(value) === index;
        }
        var result = userTracking.find();
        result.forEach(function(value){
            arr.push(value.userId);
        });

        var unique = arr.filter(onlyUnique);
        //console.log("UNIQ="+unique);
        for(var i=0;i<unique.length;i++){
         var nameUser = users.findOne({_id:unique[i]});
         name.push(nameUser);

        }
        //console.log("PISEYUSER="+name);
        return name;
    },
    getTime:function(){
        return userTracking.find({});
    },
    getmouseuser:function(user){
        var result = users.findOne({_id:user});
        return result.profile.firstname+"_"+result.profile.lastname;
    }

});
Template.mouseTracking.events({
    'click #del':function(){
        var id = this._id;

        Meteor.call('deletemouse',id);

    },
    'change #nameDiv':function(){
        var nameDiv = $("#nameDiv").val();
        Session.set("NAME_DIV",nameDiv);
        Session.set("NAME_LOCATION",undefined);
        Session.set("NAME_IP",undefined);
        Session.set("USER_TRACKING",undefined);
        Session.set("limitTracking",25);
    },
    'change #nameLocation':function(){
        var nameLocation = $('#nameLocation').val();
        Session.set("NAME_LOCATION",nameLocation);
        Session.set("NAME_DIV",undefined);
        Session.set("NAME_IP",undefined);
        Session.set("USER_TRACKING",undefined);
        Session.set("limitTracking",25);
    },
    'change #nameIp':function(){
        var ip = $("#nameIp").val();
        Session.set("NAME_IP",ip);
        Session.set("NAME_LOCATION",undefined);
        Session.set("NAME_DIV",undefined);
        Session.set("USER_TRACKING",undefined);
        Session.set("limitTracking",25);
    },
     'change #userTrack':function(){
        var userTrack = $("#userTrack").val();
        Session.set("USER_TRACKING",userTrack);
        Session.set("NAME_IP",undefined);
        Session.set("NAME_LOCATION",undefined);
        Session.set("NAME_DIV",undefined);
        Session.set("limitTracking",25);
    },
    'click #seeall':function(){
        Session.set("NAME_IP",undefined);
        Session.set("NAME_LOCATION",undefined);
        Session.set("NAME_DIV",undefined);
        Session.set("USER_TRACKING",undefined);
    }
});

