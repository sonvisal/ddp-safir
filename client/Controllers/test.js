Template.test.events({
	'change #file': function(event, template) {
		event.preventDefault();
		var files = event.target.files;
		for (var i = 0, ln = files.length; i < ln; i++) {
			images.insert(files[i], function (err, fileObj) {
				Session.set('test', fileObj._id);
				
			});
		}
	}
});