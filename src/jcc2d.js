(function() {
	window.JC = window.JC||{};

	//=include modules/RAF.js

	//=include modules/tween.js

	//=include modules/loader.js

	//=include modules/jcc2d.js

	if (typeof exports !== 'undefined') {
	    if (typeof module !== 'undefined' && module.exports) {
	        exports = module.exports = JC;
	    }else{
	        exports = JC;
	    }
	} else if (typeof define !== 'undefined' && define.amd) {
	    define(JC);
	}else{
	    window.JC = JC;
	}

})();