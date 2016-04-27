(function(){
	window.JC = window.JC||{};
	function ImagesLoad(opts){
		this.sprite = {};
		this.OKNum = 0;
		this.errNum = 0;
		this.totalNum = 0;
		this.imagesLoad(opts);
	}
	ImagesLoad.prototype.imagesLoad = function (opts){
		var This = this;
		for(var img in opts){
			this.sprite[img] = new Image();
			this.totalNum++;
			this.sprite[img].onload = function (){
				This.OKNum++;
				if(This.OKNum>=This.totalNum){
					This.imagesLoaded();
				}
			};
			this.sprite[img].onerror = function (){
				This.errNum++;
			};
			this.sprite[img].src = opts[img];
		}
	};
	ImagesLoad.prototype.imagesLoaded = noop;
	ImagesLoad.prototype.getResult = function (id){
		return this.sprite[id];
	};
	JC.ImagesLoad = ImagesLoad;
	/* 结束 纹理预加载 */
})();