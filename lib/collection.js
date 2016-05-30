
products = new TAPi18n.Collection("products");
posts = new TAPi18n.Collection("posts");
categories = new TAPi18n.Collection('categories');
shops = new Meteor.Collection('shops');
parent_tags = new TAPi18n.Collection('parent_tags');
tags = new TAPi18n.Collection('tags');
stats = new Mongo.Collection('stats');
share = new Mongo.Collection('share');
viewing = new Mongo.Collection('viewing');

fullpath="upload";

if (Meteor.isServer) {
	fullpath=process.env.PWD;
	console.log('linux path:'+fullpath);
	if( typeof fullpath == 'undefined' ){
		base_path = Meteor.npmRequire('fs').realpathSync( process.cwd() + '../../../../../../' );
		console.log('window path:'+base_path);
		//base_path = base_path.split('\\').join('/');
		//base_path = base_path.replace(/\/\.meteor.*$/, '');
	}else{
		base_path=fullpath;
	}
	
}
else{
	base_path="/";
}

images = new FS.Collection("images", {
	stores: [new FS.Store.FileSystem("images", {path:base_path+"/upload"})]
});

/*No Need to Command, please! */
//S3
/*imageStore = new FS.Store.S3("images", {
  region: "", //optional in most cases
  accessKeyId: "AKIAJBSUL7QEY2GSJKAA", //required if environment variables are not set
  secretAccessKey: "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", //required if environment variables are not set
  bucket: "safirperfumery", //required
  ACL: "", //optional, default is 'private', but you can allow public or secure access routed through your app URL
  folder: "/uploads/UserUploads", //optional, which folder (key prefix) in the bucket to use 
  // The rest are generic store options supported by all storage adapters
  //transformWrite: myTransformWriteFunction, //optional
  //transformRead: myTransformReadFunction, //optional
  maxTries: 1 //optional, default 5
});
images = new FS.Collection("images", {
  stores: [imageStore]
});*/
// end S3

/*====*/
attribute = new Mongo.Collection('attribute');
parentattr = new TAPi18n.Collection('parentattr');

cart=new Mongo.Collection('cart');
contents = new Meteor.Collection('contents');
contents_type = new Meteor.Collection('contents_type');
address = new Mongo.Collection('address');
favorite = new Mongo.Collection('favorite');
question = new Mongo.Collection('question');
journey=new Mongo.Collection('journey');//added by djisse
linkselling=new Mongo.Collection('linkselling');//added by djisse
membershipcard = new Mongo.Collection('membershipcard');
list_product = new TAPi18n.Collection('list_product');
attribute_value=new Mongo.Collection('attribute_value');
order=new Mongo.Collection('order');
translation=new Mongo.Collection('translation');
payments = new Meteor.Collection('payments');
banner = new Meteor.Collection('banner');
daily = new Meteor.Collection('daily');
userTracking = new Meteor.Collection('userTracking');
imedation=new Meteor.Collection('imedation');
anwser=new Meteor.Collection('anwser');
stock=new Meteor.Collection('stock');
mouse = new Mongo.Collection('mouse');
quizz = new Mongo.Collection('quizz');
answerquizz=new Mongo.Collection('answerquizz');
tracking = new Mongo.Collection('tracking');
barcode = new Mongo.Collection('barcode');
products_node = new Mongo.Collection('products_node');
quizzQA = new Mongo.Collection('quizzQA');
discount = new Mongo.Collection('discount');
collect = new Mongo.Collection('collect');
//quicklink_type = new TAPi18n.Collection('quick_type');
quicklink = new TAPi18n.Collection('quicklink');
shopLearnIt = new Mongo.Collection('shopLearnIt');
locations = new TAPi18n.Collection('locations');
pages = new TAPi18n.Collection('pages');
invoices = new Mongo.Collection('invoices');
receipts = new Mongo.Collection('receipts');
membership= new Mongo.Collection('membership');
reachpoint= new Mongo.Collection('reachpoint');
newsletter = new Meteor.Collection('newsletter');

