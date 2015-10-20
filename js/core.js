function init()
{
   canvas = document.getElementById("canvas");
   canvas.width  = canvas.clientWidth;
   canvas.height = canvas.clientHeight;
   ctx = canvas.getContext("2d");

   gui.init();
   
   menu.init();
   state = menu;
   
   window.setInterval("run()", 1000/33);

   menu.button.easy();
}

function run()
{
   update();
   draw();
}

function draw()
{
   ctx.clearRect(0,0,800,600);
   
   state.draw();
}

function update()
{
   state.update();
}

function getElementsByClass(searchClass,node,tag)
{
	var classElements = new Array();

	if ( node == null )
		node = document;

	if ( tag == null )
		tag = '*';

	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");

	for (i = 0, j = 0; i < elsLen; i++) 
	{
		if ( pattern.test(els[i].className) ) 
		{
			classElements[j] = els[i];
			j++;
		}
	}

	return classElements;
}
