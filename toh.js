var GLOBAL = {};
GLOBAL.towerOfHanoi = {};
GLOBAL.colors = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'lime'
				, 'maroon', 'navy', 'olive', 'purple', 
				'silver', 'teal',  'yellow'];
GLOBAL.width = 20;

function TowerOfHanoi(n,parentId)
{
	this.id = "toh"+n;
	this.parentId = parentId;
	var divObj  = $("<div></div>");
	divObj.attr("id",this.id);
	$("#"+this.parentId).append(divObj);
	this.hanoiObj=divObj;
	this.numberOfDiscs = n;
	GLOBAL.towerOfHanoi["toh"+n] = this;
	this.createTowers();
	this.createDiscs();
	this.addPositions();
	this.init();
}

TowerOfHanoi.prototype.addPositions = function()
{
	var i;
	for (i = this.towers.length; i > 0 ; i--)
	{
		var tower = this.towers[i-1];
		var leftPosition = $('div.towerStem',tower).offset()['left'] + GLOBAL.width/2;
		var topPosition = $('div.towerBase',tower).offset()['top'];
		var towerLeft = tower.offset()['left'];
		var towerRight = towerLeft + parseInt(tower.css("width"));
		tower.data({'axisX':leftPosition,'axisY':topPosition,'towerLeft':towerLeft,
					'towerRight':towerRight});
	}
}

TowerOfHanoi.prototype.init = function()
{
	var firstTower = this.towers[0];
	var discs = this.discs;
	var towerDataObj = firstTower.data();
	var discIndexes = [];
	var i;
	for (i = 0; i < this.discs.length ; i++)
	{
		var disc = this.discs[i];
		var discData = disc.data();
		var width = discData.width;
		var discTop = towerDataObj.axisY - GLOBAL.width*(i+1);
		var discLeft = towerDataObj.axisX - width/2;
		discData.discLeft = discLeft;
		discData.discTop = discTop;
		discData.tower = 1;
		disc.offset({'top':discTop, 'left':discLeft});
		discIndexes.push(disc.data('index'));
	}
	firstTower.data("discIndexes",discIndexes);

}

TowerOfHanoi.prototype.createDiscs = function()
{
	var i;
	this.discs = [];
	var discParent = $('<div></div>');
	discParent.addClass('discs');
	discParent.css({"float":"left",
	"height":"auto"});
	var n = this.numberOfDiscs;
	for(i = n; i > 0 ; i--)
	{
		var divObj = $("<div></div>");
		divObj.attr("id",this.id+'disc'+i);
		divObj.addClass("disc");
		divObj.css({"width":GLOBAL.width*2*i+'px',"background":GLOBAL.colors[i],"height":GLOBAL.width+'px'});
		divObj.data({"width":GLOBAL.width*2*i,"index":i});
		if(i == 1)
			divObj.draggable({stop: this.placeDisc,opacity:0.35});
		this.discs.push(divObj);
		discParent.prepend(divObj);
		
	}
	this.hanoiObj.append(discParent);
}

TowerOfHanoi.prototype.placeDisc = function(event,ui)
{
	var disc = $(this);
	var tohId = disc.attr("id").split('disc')[0];
	var tohObj = GLOBAL.towerOfHanoi[tohId];
	var discData = disc.data();
	var discLeft = disc.offset()['left'] + discData.width/2;
	var i;
	var towerFound = false
	for (i = 0 ; i < tohObj.towers.length ; i++)
	{
		var tower = tohObj.towers[i];
		var towerData = tower.data();
		var discInsideTower = (towerData.towerLeft < discLeft && discLeft <= towerData.towerRight)?true:false;
		var differentTower = (i+1 == discData.tower)?false:true;
		if (discInsideTower && differentTower)
		{
			towerFound = true;
			var discIndexes = towerData.discIndexes;
			if (discIndexes > 0 && (discIndexes[discIndexes.length - 1] < discData.index))
			{
				disc.offset({"top":discData.discTop,'left':discData.discLeft});
			}
			else
			{
				var discTop;
				if(towerData.discIndexes && towerData.discIndexes.length > 0)
				{
					tohObj.discs[tohObj.discs.length  - towerData.discIndexes[towerData.discIndexes.length -1] ].draggable('destroy');
					discTop = towerData.axisY - GLOBAL.width*(towerData.discIndexes.length+1);
				}
				else
					discTop = towerData.axisY - GLOBAL.width*1;
				var discLeft = towerData.axisX - discData.width/2;	
				discData.discLeft = discLeft;
				discData.discTop = discTop;
				disc.offset({'top':discTop, 'left':discLeft});
				if(! towerData.discIndexes)
					towerData.discIndexes = [];
				towerData.discIndexes.push(discData.index);
				var initialTower = tohObj.towers[discData.tower - 1];
				var initialTowerDiscIndexes = initialTower.data().discIndexes;
				initialTowerDiscIndexes.pop();
				if(initialTowerDiscIndexes.length > 0)
					tohObj.discs[tohObj.discs.length-initialTowerDiscIndexes[initialTowerDiscIndexes.length -1]].draggable(
					{stop: tohObj.placeDisc,opacity:0.35}
					);
				discData.tower = i + 1;
				if(i== 2)
				{
					if(towerData.discIndexes.length == tohObj.numberOfDiscs)
						alert("You Won");
				}
			}
			break;
		}
	}
	if(! towerFound)
	{
		disc.offset({"top":discData.discTop,'left':discData.discLeft});
	}
}

TowerOfHanoi.prototype.showAlert = function(alertString)
{
	var divObj = $('<div>'+alertString+'</div>');
	
}

TowerOfHanoi.prototype.createTowers = function()
{
	var i;
	this.towers = [];
	for (i = 3; i > 0; i--)
	{
		var tower = $(document.createElement('div'));
		tower.addClass("tower");
		tower.css({
				"float":"left",
				"margin":"5px"
				});
		var towerStem = $(document.createElement('div'));
		towerStem.addClass("towerStem");
		towerStem.css({"height":(this.numberOfDiscs+ 1)*GLOBAL.width + "px",
						"width":GLOBAL.width + 'px',
						"margin-left":(this.numberOfDiscs+ 1)*GLOBAL.width - GLOBAL.width/2 + 'px',
						"background":"red"});
		var towerBase = $(document.createElement('div'));
		towerBase.addClass("towerBase");
		towerBase.css({"width":(this.numberOfDiscs+ 1)*2*GLOBAL.width + "px",
						"height":GLOBAL.width + 'px',
						"background":"green"});
		tower.append(towerStem).append(towerBase);
		this.towers.push(tower);
		this.hanoiObj.append(tower);
	}
}