Meteor.methods({
	addPages:function(obj, str){
		check(obj,Object);
		check(str,String);
		var id = pages.insert(obj);
		if( id ){
			var fs = Npm.require('fs');
			fullpath=process.env.PWD;
			if( typeof fullpath == 'undefined' ){
				base_path = fs.realpathSync( process.cwd() + '../../../../../../' );
			}else{
				base_path=fullpath;
			}
			if( obj.type == 'singlepage'){
				fs.writeFile(base_path+"/client/Views/App/page/"+obj.tempname+'.html', str, function(err) {
				    if(err) {
				        return console.log(err);
				    }
				    //console.log("The file was saved!");
				});
			}
		}
	},
	updatePages:function(id,obj){
		check(id, String);
		check(obj, Object)
		return pages.update({_id:id},{$set:obj});
	},
	deletePages:function(id){
		//console.log( "ID:"+id)
		var fs = Npm.require('fs');
		fullpath=process.env.PWD;
		if( typeof fullpath == 'undefined' ){
			base_path = fs.realpathSync( process.cwd() + '../../../../../../' );
		}else{
			base_path=fullpath;
		}

		var data = pages.findOne({_id:id});
		var path = base_path+"/client/Views/App/page/"+data.tempname+'.html';
		//fs.exists( path, function(){
			fs.unlinkSync(path);
		//});
		pages.remove(id);

	},
	updatePagesProduct: function(id,pro){
		return pages.update({_id:id},{$set:{productid:pro}});
	},
	getpages: function(){
		return pages.find({});
	}
});