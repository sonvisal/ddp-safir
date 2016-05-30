var cssCDN="",jsCDN="",imgCDN="";


Meteor.methods({
	getCSSCDN: function(){
		var country =Assets.getText('country.conf');
		//console.log('COUNTRY='+country);
		if (typeof(country) !== 'undefined') {
			if(country==='EU'){

				return "http://54.171.224.22"
			}else if(country==='SIN'){
				return "http://54.169.251.255";
			}else{
				return "http://164.138.19.129"
			}
			
		}else{
			return '/';
		}
		
	},
	getJSCDN: function(){
		var country =Assets.getText('country.conf');
		//console.log('COUNTRY='+country);
		if (typeof(country) !== 'undefined') {
			if(country==='EU'){

				return "http://54.171.54.7"
			}else if(country==='SIN'){
				return "http://54.169.255.109";
			}else{
				return "http://164.138.19.120"
			}
			
		}else{
			return '/';
		}
		
	},
	getIMGCDN: function(){
		var country =Assets.getText('country.conf');
		//console.log('COUNTRY='+country);
		if (typeof(country) !== 'undefined') {
			if(country==='EU'){

				return "http://54.171.217.142"
			}else if(country==='SIN'){
				return "http://54.169.80.2";
			}else{
				return "http://164.138.19.140"
			}
			
		}else{
			return '/';
		}
		
	}
});