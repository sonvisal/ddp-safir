Session.set('currentAnswer','');
Session.set('list_tag','');
Session.set('parentAnswer','');
Session.set('currentAnswer','');
Session.set('parentAnswer','');
Session.set('finishQuizz','');
Template.quizz.helpers({
	currentQuestionId: function(){
		return Session.get('currentQuestion');
	},
	currentQuestion: function(){
		//console.log('CURCATEGORY:'+Session.get('currentCategory'));
		if(Session.get('parentAnswer')=='')
			var j=journey.find({"category":Session.get('currentCategory')}).fetch();
		else
			var j=journey.find({"parent":Session.get('parentAnswer')}).fetch();
		// console.log("journey:"+j.length);
		// console.log('currentanwser'+Session.get('parentAnswer'));
		return j[0];
	},
	showPopup: function(){
		//console.log('DiplayPopup:'+Session.get('finishQuizz'));
		if(Session.get('finishQuizz')=='yes')
			$('#myJourney').modal('hide');
		else
			$('#myJourney').modal('show');

	}
});

Template.quizz.events({
	'click #next': function(e,tpl){
		//TAGS
		//alert("hi");
		$("#choice_tag").prop( "checked", false );
		var choice=Session.get('currentAnswer');
		var list=Session.get('list_tag')+choice+';';
		Session.set('list_tag',list);

		//id
		var temp=Session.get('currentAnswerIdTemp');
		Session.set('parentAnswer',temp);
		var j=journey.find({"parent":Session.get('parentAnswer')}).fetch();
		if(j.length==0){
			Session.set('finishQuizz','yes');
			$('#myJourney').modal('hide');
			//console.log('listTag:'+list);

		}
		//console.log('TAGSEARCH:'+list);
	},
	'change #choice_tag': function(e,tpl){
		if(e.target.checked){
			Session.set('currentAnswer',this.tag);
			Session.set('currentAnswerIdTemp',this.id);
		}
	}
});

Template.quizz.onRendered(function () {
	if(Router.current().route.getName()=='category'){
		if(Session.get('finishQuizz')=='yes')
				$('#myJourney').modal('hide');
		else
				$('#myJourney').modal('show');
	}
		
});

Template.listQuizz.helpers({
	qetListQuizz:function(){
		return quizz.find({});
	}
});
Template.quiz.helpers({
	qetListQuizz:function(){
		return quizz.find({});
	},
	getTypeSkin:function(){
      var result = quizz.findOne({type:"Skin"});
      return result;
  	},

});

Template.quizztwo.rendered=function(){
	$("#quizzpop").click();
};

Template.quizzthree.rendered=function(){
	$("#quizzpop").click();
};