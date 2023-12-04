$(document).ready(function() {
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
		var urlBase = window.location.protocol + '//' + window.location.host;
		var realm = getRealm(window.location.pathname);
		if (realm != null)
			window.location.href = urlBase + "/auth/realms/" + realm + "/account/browserSupport";
	}

	const browser = bowser.getParser(window.navigator.userAgent);
	const isValidBrowser = browser.satisfies({
		
		macos: {
		  safari: ">10.1"
		},
		// per platform (mobile, desktop or tablet)
		mobile: {
		  safari: '>=9',
		  'android browser': '>3.10'
		},		
		// or in general
		'microsoft edge':'>=11',
		chrome: ">20.1.1432",
		firefox: ">31",
		ipad:'>=1',
		safari: '>=9',
		'Samsung Internet for Android': '>=6.2'
	});
	if (isValidBrowser == this.undefined || isValidBrowser == false){
	console.debug(browser);
	var urlBase = window.location.protocol + '//' + window.location.host;
	var realm = getRealm(window.location.pathname);
	if (realm != null)
		window.location.href = urlBase + "/auth/realms/" + realm + "/account/browserSupport";
	}
});

function getRealm(url) {
	if (url.includes('realms')) {
		var realm = "";
		var substr = url.match(/realms\/(.*?)\//).toString().substring(7);;
		for (var i=0; i<substr.length && substr[i] != '\/'; i++) { 
			realm = realm.concat(substr[i]);    
		}		
		return realm;
	}
	return null;
}
