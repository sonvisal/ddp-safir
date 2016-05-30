Meteor.startup(function() {

     Session.set('LANG','fa');
});


Tracker.autorun(function () {
    TAPi18n.setLanguage(Session.get('LANG'));
});