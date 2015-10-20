mouse = new vector();
rightclick = false;
mouseOnCanvas = false;

function mousemovehandler(e)
{  

   mouse.x = e.pageX - canvas.offsetLeft;
   mouse.y = e.pageY - canvas.offsetTop;

   if(mouse.x < 0 || mouse.x > canvas.width || mouse.y < 0 || mouse.y > canvas.height)
      mouseOnCanvas = false;
   
   else
      mouseOnCanvas = true;
      
   if(mouse.x < 0)
      mouse.x = 0;
   if(mouse.x > canvas.width)
      mouse.x = canvas.width;
      
   if(mouse.y < 0)
      mouse.y = 0;
   if(mouse.y > canvas.height)
      mouse.y = canvas.height;
}

function mousedownhandler(e)
{

   if(mouseOnCanvas == true)
      state.mousedownhandler(e);
}

function mouseuphandler(e)
{
    
   if(mouseOnCanvas == true)
      state.mouseuphandler();
}


document.onkeydown = KeyPressed;
document.onkeyup = KeyReleased;

function KeyPressed(event)
{
   state.keyPressed(getKeyCode(event));
}

function KeyReleased(event)
{
   state.keyReleased(getKeyCode(event));
}

function getKeyCode(event)
{
   if (!event)
      event = window.event;
   if (event.which) 
      return event.which;
   else if (event.keyCode) 
      return event.keyCode;
}
