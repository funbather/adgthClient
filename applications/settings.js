// Your custom settings
// See parameters in http://www.robrowser.com/getting-started#API
var ROConfig = {
	development: true, // don't need to compile javascript files in chrome app since it's already a package.
	remoteClient:  "http://localhost/client/",
	packetver:     20130807,
	skipServerList: true,
	autoLogin: ['test', 'test'],
	skipIntro: true,
	disableKorean: true,
};