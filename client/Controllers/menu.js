
Session.set('children1','');
Session.set('children2','');
Session.set('selected_menu','');

Template.header.helpers({
	getParent: function(){
		Session.get('LANG');
		var menu = categories.find({"$or":[{"parent":"0"},{"parent":" "}]}).map(function(document, index) {
			document.index = index + 1;
			return document;
		});
		Session.set('NUMMENU', menu.length);
		return menu;
	},
	getChildren: function(parent){
		Session.get('LANG');
		var children = categories.find({"parent":parent}).map(function(document, index) {
			document.index = index + 1;
			return document;
		});
		
		return children;
		/*if( children.length > 0 ){
			return {hasChildren:true, children: children}
		}else{
			return {hasChildren:false}
		}*/
	},
	haveBaby: function(id){
		var babies=categories.find({parent:id}).count();
		if(babies==0)
			return false;
		else
			return true;
	},
	column: function( parent ){
		Meteor.call('categoryChildren', parent, function(err, result){
	        if(!err) Session.set('CATEGORYCHILD'+result.id, result.data);
    	})
    	var result = Session.get('CATEGORYCHILD'+parent);
		
		if( result == true) return '4';
		else return '12';

	},
	changeLanguage: function(){
		if(TAPi18n.getLanguage()=='fa')
			return 'English';
		if(TAPi18n.getLanguage()=='en')
			return 'فارسی';
	}
});
Template.header.onRendered(function () {
//default font
	$('body').css('font-family','Nazanin Bold');
	var userId = Meteor.userId();
	var time = Date.now();
	var currenturl = window.location.href;
	if( !Session.get('userId') || Session.get('userId') == ""){
		var newId=Random.id();
		Session.setPersistent('userId',newId);
		//console.log('Newid'+newId);
	}
	//console.log('MY CART USER ID='+Session.get('userId'));
	//$("#en").click();

});
Template.footer.events({
	'mouseenter #footer':function(e){
		e.preventDefault();
		var userId = Meteor.userId();
		var time = Date.now();
		var currenturl = window.location.href
		var location = 'Footer';

	},
	'click .instagram':function(){
  		EarnPoint('getPointByInsta',30,60,120);
 	}
});
Template.header.events({
	'mouseup .menu-mobile-item': function(e,tpl){
		//alert('ok');
		//$(".collapse").removeClass("in");
		/*var getClass=$(".section_mobile").find("div.collapse").attr("class");
		getClass=getClass.replace(/\s+/g,'');
		if(getClass=='collapsein'){
			alert("NEW CLASS");
			var curElmt=$(e.currentTarget).attr('data-id');
			document.getElementById(curElmt).setAttribute("class","collapse");
			alert(curElmt);
		}else{*/
			//$this.removeClass('m-megamenu-dropdown');
		$('.collapse').each(function(index){
			$(this).removeClass('in');
		});
		/*$('.collapse').each(function(index){
			$(this).removeClass('in');
		});*/
	},
	'mouseenter #header':function(e){
		e.preventDefault();
		var userId = Meteor.userId();
		var time = Date.now();
		var currenturl = window.location.href
		var location = 'Header';

	},
	'click .menuclick':function(){
		var id = this._id;
		//alert(id);
		Session.set("MENUID",id);
	}

});
Template.mainLayout.events({
	'mouseenter #mainContent':function(e){
		e.preventDefault();
		var userId = Meteor.userId();
		var time = Date.now();
		var currenturl = window.location.href
		var location = 'Content';

	}
});


Template.header.events({
	'click #en':function(e,tpl){
		e.preventDefault();
		$('body').removeClass('modal-open');
		var lang="";
		if(TAPi18n.getLanguage()=='fa'){
			lang='en';
			$("body").css("font-family","HelveticaNeue, sans-serif");
			console.log('Changing to english');
		}
		else{
			lang='fa';
			$('body').css('font-family','Nazanin Bold');

		}
		Session.set('LANG',lang);
		//Session.set('DEFAULTLANG',lang);
		//Global Variable when language change
		//item1 = 0,counter1 = 0, item2 = 0, counter2 = 0, item3 = 0, counter3 = 0, countmenu = 0, down = 12;
		//console.log('NEW LANG '+lang);
		//TAPi18n.setLanguage(lang);
		console.log("New LANG"+Session.get('LANG'));

	},
	'click .kesearch': function(e,tpl){
		var search=tpl.$("#textToSearch").val();
		//Session.set('keyword',search);
		var url="/searchproduct"+"/"+search;
		Router.go(url);
	}

});