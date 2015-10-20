serveradress = "http://unsnarl-it.jonasjuffinger.com/";
var random_p = [
'202|183|264|66|202|99|142|150|138|64|202|100|201|32|202|98|202|99|268|145|#4|9|9|8|8|4|4|5|5|0|0|4|9|5|5|6|6|9|9|3|3|8|8|7|7|3|3|6|6|2|2|5|5|1|1|0|1|2|2|3|7|2|0|2|8|0|'];
function save_puzzle()
{
   save_puzzle_Request=new XMLHttpRequest();

   save_puzzle_Request.open("POST", serveradress+"savePuzzle.php", false);
   save_puzzle_Request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
   
   points_string = ""; 
   for(i=0; i<points.length; i++)
      points_string += Math.round(points[i][0]) + "|" + Math.round(points[i][1]) + "|";
   
   joints_string = "";
   for(i=0; i<joints.length; i++)
      joints_string += joints[i][0] + "|" + joints[i][1] + "|";
      
   save_puzzle_Request.send("difficulty="+difficulty+"&points="+points_string+"&joints="+joints_string);
   
   alert(save_puzzle_Request.responseText);
}
// использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function get_puzzle()
{
  // get_puzzle_Request=new XMLHttpRequest();
   
   //get_puzzle_Request.open("GET", serveradress+"getPuzzle.php?difficulty="+difficulty, false);
  // get_puzzle_Request.send();
   
   

   response = random_p[getRandomInt(0,random_p.length - 1)];  
   
   points_string = response.split("#")[0].split("|");
   for(i=0; i<points_string.length-2; i++)
   {
      points.push(new Array(4));
      points[points.length-1][0] = points_string[i];
      points[points.length-1][1] = points_string[++i];
      points[points.length-1][2] = false;
      points[points.length-1][3] = false;
   }
   
   joints_string = response.split("#")[1].split("|");
   for(i=0; i<joints_string.length-2; i++)
   {
      joints.push(new Array(4));
      joints[joints.length-1][0] = joints_string[i];
      joints[joints.length-1][1] = joints_string[++i];
      joints[joints.length-1][2] = false;
      joints[joints.length-1][3] = false;
   }
}
