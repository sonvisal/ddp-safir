Template.header.events({
    'click #logout': function(event){
        event.preventDefault();
        var url = 'https://www.google-analytics.com/collect?v=1&t=event&tid=UA-71059459-2&cid=555&ec=logout&ea=click&el=logout&ev=1';
        Meteor.call('eventCall', url, function(error, result) {
            if (error) {
                //console.log('Analytic CLIENT ERRR');
                console.log(error);
            } else {
                //console.log('Analytic CLIENT RESULT');
                console.log(result);
            }
        });
        var currentRoute = Iron.Location.get().path;
        Session.set("CURRENTROUTE",currentRoute);
        Meteor.logout();
        Router.go('login');
    }
});