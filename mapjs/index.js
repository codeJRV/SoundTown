// This is a companion pen to go along with https://beta.observablehq.com/@grantcuster/using-three-js-for-2d-data-visualization. It shows a three.js pan and zoom example using d3-zoom working on 100,000 points. The code isn't very organized here so I recommend you check out the notebook to read about what is going on.

let point_num = 970;
let point_num1 = 970;
let width = 2000;
let viz_width = width;
let height = 600;
let fov = 40;
let near = 10;
let far = 7000;

// Set up camera and scene
let camera = new THREE.PerspectiveCamera(
  fov,
  width / height,
  near,
  far 
);

window.addEventListener('resize', () => {
 width = 2000;
  viz_width = width;
	height=600;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
})


// Add canvas
let renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

let zoom = d3.zoom()
  .scaleExtent([getScaleFromZ(far), getScaleFromZ(near)])
  .on('zoom', () =>  {
    let d3_transform = d3.event.transform;
    zoomHandler(d3_transform);
  });

view = d3.select(renderer.domElement);
function setUpZoom() {
  view.call(zoom);    
  let initial_scale = getScaleFromZ(far);
  var initial_transform = d3.zoomIdentity.translate(viz_width/2, height/2).scale(initial_scale);    
  zoom.transform(view, initial_transform);
  camera.position.set(far/1.9,far/5 , far);
}
setUpZoom();

circle_sprite= new THREE.TextureLoader().load(
  "https://fastforwardlabs.github.io/visualization_assets/circle-sprite.png"
)
function getScaleFromZ (camera_z_position) {
  let half_fov = fov/2;
  let half_fov_radians = toRadians(half_fov);
  let half_fov_height = Math.tan(half_fov_radians) * camera_z_position;
  let fov_height = half_fov_height * 2;
  let scale = height / fov_height; // Divide visualization height by height derived from field of view
  return scale;
}
function toRadians (angle) {
  return angle * (Math.PI / 180);
}
function zoomHandler(d3_transform) {
  let scale = d3_transform.k;
  let x = -(d3_transform.x - viz_width/2) / scale;
  let y = (d3_transform.y - height/2) / scale;
  let z = getZFromScale(scale);
  camera.position.set(x, y, z);
}
function getZFromScale(scale) {
  let half_fov = fov/2;
  let half_fov_radians = toRadians(half_fov);
  let scale_height = height / scale;
  let camera_z_position = scale_height / (2 * Math.tan(half_fov_radians));
  return camera_z_position;
}
var mydata = JSON.parse(data);
var GlobalFriendName =800;
var globalfilternameforfriend="genre";
var tsne=mydata.tsnemodelA10;
var GlobalFilterType =mydata.tsnemodelA10;
var isitFriend=0;

createmap(GlobalFriendName);

//Create the Map
function createmap(GlobalFriendName,isitFriend){


let color_array = [
  "#1f78b4",
  "#ff7f00",
  "#8AAF1D",
  "#AF1DA4",
  "#8EF5F2",
  "#F5EE10",
  "#F51029",
  "#6A149B",
  "#4FF726",
  "#641761",
  "#efefef"
]

let color_array2 = [
  "#7dbde8",
  "#eaa560",
  "#d9f783",
  "#f293eb",
  "#d0f2f1",
  "#f4f2ab",
  "#f298a2",
  "#d39df2",
  "#b9f4ab",
  "#f29fef",
  "#efefef"
]

//attach songs
let data_points = [];
var songdata = JSON.parse(songs);
var songuri = JSON.parse(uri);

var dict_filter = {};
dict_filter[0] = "Genre: Blues";
dict_filter[1] = "Genre: classical";
dict_filter[2] = "Genre: country";
dict_filter[3] = "Genre: disco";
dict_filter[4] = "Genre: hiphop";
dict_filter[5] = "Genre: jazz";
dict_filter[6] = "Genre: metal";
dict_filter[7] = "Genre: pop";
dict_filter[8] = "Genre: regge";
dict_filter[9] = "Genre: rock";
//dict_filter[10] = "nothing";

blues= songuri.blues;
classical= songuri.classical;
country= songuri.country;
disco= songuri.Disco;
hiphop= songuri.HipHop;
pop= songuri.Pop;
reggae= songuri.Reggae;
rock= songuri.Rock;
metal= songuri.Metal;

function randomPosition(i) {
  var tt= tsne[i];
  var pt_x = tt["coordinates"][0] * 3000;
  //console.log("pt_x"+pt_x);
  var pt_y = tt["coordinates"][1] * 3000;
  return [pt_x, pt_y];
}

for (let i = 0; i < point_num; i++) {
  let position = randomPosition(i);
  let name = 'Song ' + i;
  var temphold = tsne[i];
  let newname = temphold["coordinates"][2];
  //= Math.floor(Math.random() * 4);
  let group=dict_filter[newname];
  let on_off=0;
  if(newname==0)
  {
    songname=blues.pop();
    songname="https://open.spotify.com/embed?uri="+songname;
  }
  else if(newname==1)
  {
    songname=classical.pop();
    songname="https://open.spotify.com/embed?uri="+songname;
  }
  else if(newname==2)
  {
    songname=country.pop();
    songname="https://open.spotify.com/embed?uri="+songname;
  }
  else if(newname==3)
  {
    songname=disco.pop();
    songname="https://open.spotify.com/embed?uri="+songname;
  }
  else if(newname==4)
  {
    songname=hiphop.pop();
    songname="https://open.spotify.com/embed?uri="+songname;
  }
    else if(newname==5)
  {
    songname=blues.pop();
    songname="https://open.spotify.com/embed?uri="+songname;
  }
    else if(newname==6)
  {
    songname=metal.pop();
    songname="https://open.spotify.com/embed?uri="+songname;
  }
    else if(newname==7)
  {
    songname=pop.pop();
    songname="https://open.spotify.com/embed?uri="+songname;
  }
    else if(newname==8)
  {
    songname=reggae.pop();
    songname="https://open.spotify.com/embed?uri="+songname;
  }
    else if(newname==9)
  {
    songname=rock.pop();
    songname="https://open.spotify.com/embed?uri="+songname;
  }
  else
  {
    //do nothing
  }

  let point = { position, name, newname,group,songname,on_off};
  //console.log(point);
  data_points.push(point);
}

for (let i = 0; i < 800; i++) {
  data_points[i].on_off = 1;
}

if(isitFriend==1)
{
  for (let i = 0; i < GlobalFriendName; i++) {
  data_points[i].on_off = -1;
}
}

let generated_points = data_points;

let pointsGeometry = new THREE.Geometry();

let colors = [];
for (let datum of generated_points) {
  // Set vector coordinates from data
  let vertex = new THREE.Vector3(datum.position[0], datum.position[1], 0);
  pointsGeometry.vertices.push(vertex);
  let color;

  if(datum.on_off==1)
  {
    color=new THREE.Color(color_array[10]);
  }
  else if(datum.on_off==0)
  {
    color=new THREE.Color(color_array2[datum.newname]);
    //"#F9082C"
  }
  else
  {
    color = new THREE.Color(color_array[datum.newname]);
  }
  
  
  colors.push(color);
}
pointsGeometry.colors = colors;

let pointsMaterial = new THREE.PointsMaterial({
  size: 8,
  sizeAttenuation: false,
  vertexColors: THREE.VertexColors,
  map: circle_sprite,
  transparent: true
});

let points = new THREE.Points(pointsGeometry, pointsMaterial);

let scene = new THREE.Scene();
scene.add(points);
scene.background = new THREE.Color(0xefefef);

// Three.js render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();


// Hover and tooltip interaction

raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 10;

view.on("mousemove", () => {
  let [mouseX, mouseY] = d3.mouse(view.node());
  let mouse_position = [mouseX, mouseY];
checkIntersects(mouse_position);
});

function mouseToThree(mouseX, mouseY) {
  return new THREE.Vector3(
    mouseX / viz_width * 2 - 1,
    -(mouseY / height) * 2 + 1,
    1
  );
}

function checkIntersects(mouse_position) {
  let mouse_vector = mouseToThree(...mouse_position);
  raycaster.setFromCamera(mouse_vector, camera);
  let intersects = raycaster.intersectObject(points);
  if (intersects[0]) {
    let sorted_intersects = sortIntersectsByDistanceToRay(intersects);
    let intersect = sorted_intersects[0];
    let index = intersect.index;
    let datum = generated_points[index];
    if(datum.on_off!=1)
      {
        
            highlightPoint(datum);
    showTooltip(mouse_position, datum); 
        
      }

  } else {
    removeHighlights();
    hideTooltip();
  }
}

// Song and play interaction

raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 10;

view.on("click", () => {
  let [mouseX, mouseY] = d3.mouse(view.node());
  let mouse_position = [mouseX, mouseY];
checkIntersects_songplay(mouse_position);
});

function checkIntersects_songplay(mouse_position) {
  let mouse_vector = mouseToThree(...mouse_position);
  raycaster.setFromCamera(mouse_vector, camera);
  let intersects = raycaster.intersectObject(points);
  if (intersects[0]) {
    let sorted_intersects = sortIntersectsByDistanceToRay(intersects);
    let intersect = sorted_intersects[0];
    let index = intersect.index;
    let datum = generated_points[index];
    if(datum.on_off!=1)
      {
        //alert("group",datum.group);
		  //alert("play a song here");  
      //minsong = Math.ceil(0);
      //maxsong = Math.floor(songdata["song"].length -1 );
      //var songindex=Math.floor(Math.random() * (maxsong - minsong + 1)) + minsong;
      console.log("song"+datum.songname);
      document.getElementById("spotifyplayer").src = datum.songname;
		//document.getElementById("player").src="https://www.youtube.com/embed/CnAmeh0-E-U";
		//document.getElementById('some_frame_id').contentWindow.location.reload();
        
      }
  } 
}


function sortIntersectsByDistanceToRay(intersects) {
  return _.sortBy(intersects, "distanceToRay");
}

hoverContainer = new THREE.Object3D()
scene.add(hoverContainer);

function highlightPoint(datum) {
  removeHighlights();
  
  let geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(
      datum.position[0],
      datum.position[1],
      0
    )
  );
  geometry.colors = [ new THREE.Color(color_array[datum.newname]) ];

  let material = new THREE.PointsMaterial({
    size: 26,
    sizeAttenuation: false,
    vertexColors: THREE.VertexColors,
    map: circle_sprite,
    transparent: true
  });
  
  let point = new THREE.Points(geometry, material);
  hoverContainer.add(point);
}

function removeHighlights() {
  hoverContainer.remove(...hoverContainer.children);
}

view.on("mouseleave", () => {
  removeHighlights()
});

// Initial tooltip state
let tooltip_state = { display: "none" }

let tooltip_template = document.createRange().createContextualFragment(`<div id="tooltip" style="display: none; position: absolute; pointer-events: none; font-size: 13px; width: 120px; text-align: center; line-height: 1; padding: 6px; background: white; font-family: sans-serif;">
  <div id="point_tip" style="padding: 4px; margin-bottom: 4px;"></div>
  <div id="group_tip" style="padding: 4px;"></div>
</div>`);
document.body.append(tooltip_template);

let $tooltip = document.querySelector('#tooltip');
let $point_tip = document.querySelector('#point_tip');
let $group_tip = document.querySelector('#group_tip');

function updateTooltip() {
  $tooltip.style.display = tooltip_state.display;
  $tooltip.style.left = tooltip_state.left + 'px';
  $tooltip.style.top = tooltip_state.top + 'px';
  $point_tip.innerText = tooltip_state.name;
  $point_tip.style.background = color_array[tooltip_state.group];
  $group_tip.innerText = tooltip_state.group;
}

function showTooltip(mouse_position, datum) {
  let tooltip_width = 120;
  let x_offset = -tooltip_width/2;
  let y_offset = 30;
  tooltip_state.display = "block";
  tooltip_state.left = mouse_position[0] + x_offset;
  tooltip_state.top = mouse_position[1] + y_offset;
  tooltip_state.name = datum.name;
  tooltip_state.group = datum.group;
  //console.log(tooltip_state);
  updateTooltip();
}

function hideTooltip() {
  tooltip_state.display = "none";
  updateTooltip();
}
}
/*

function makeNewCloud(map_model, pgroup,color_array,n, dict_filter_local){


    function randomPosition(i) {
      var tt= map_model[i];
      var pt_x = tt["coordinates"][0] * 3000;
      //console.log("pt_x"+pt_x);
      var pt_y = tt["coordinates"][1] * 3000;
      return [pt_x, pt_y];
    }

    let data_points = [];
    for (let i = 0; i < pgroup; i++) {
      let position = randomPosition(i);
      let name = 'Point ' + i;
      let newname = Math.floor(Math.random() * 1);
      let group=dict_filter_local[newname];
      let point = { position, name, newname,group };

      data_points.push(point);
    }

    for (let i = pgroup; i < point_num; i++) {
      let position = randomPosition(i);
      let name = 'Point ' + i;
      let newname = Math.floor(Math.random() * n);
      let group=dict_filter_local[newname];
      let point = { position, name, newname,group };
      //console.log(point);
      data_points.push(point);
    }

    let generated_points = data_points;

    let pointsGeometry = new THREE.Geometry();

    let colors = [];
    for (let datum of generated_points) {
      // Set vector coordinates from data
      let vertex = new THREE.Vector3(datum.position[0], datum.position[1], 0);
      pointsGeometry.vertices.push(vertex);
      let color = new THREE.Color(color_array[datum.newname]);
      colors.push(color);
    }
    pointsGeometry.colors = colors;

    let pointsMaterial = new THREE.PointsMaterial({
      size: 8,
      sizeAttenuation: false,
      vertexColors: THREE.VertexColors,
      map: circle_sprite,
      transparent: true
    });

    let points = new THREE.Points(pointsGeometry, pointsMaterial);

    let scene = new THREE.Scene();
    scene.add(points);
    scene.background = new THREE.Color(0xefefef);

    // Three.js render loop
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

// Hover and tooltip interaction

raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 10;

view.on("mousemove", () => {
  let [mouseX, mouseY] = d3.mouse(view.node());
  let mouse_position = [mouseX, mouseY];
checkIntersects(mouse_position);
});

function mouseToThree(mouseX, mouseY) {
  return new THREE.Vector3(
    mouseX / viz_width * 2 - 1,
    -(mouseY / height) * 2 + 1,
    1
  );
}

function checkIntersects(mouse_position) {
  let mouse_vector = mouseToThree(...mouse_position);
  raycaster.setFromCamera(mouse_vector, camera);
  let intersects = raycaster.intersectObject(points);
  if (intersects[0]) {
    let sorted_intersects = sortIntersectsByDistanceToRay(intersects);
    let intersect = sorted_intersects[0];
    let index = intersect.index;
    let datum = generated_points[index];
    if(datum.newname!=0)
      {
        
            highlightPoint(datum);
    showTooltip(mouse_position, datum); 
        
      }

  } else {
    removeHighlights();
    hideTooltip();
  }
}

// Song and play interaction

raycaster = new THREE.Raycaster();
raycaster.params.Points.threshold = 10;

view.on("click", () => {
  let [mouseX, mouseY] = d3.mouse(view.node());
  let mouse_position = [mouseX, mouseY];
checkIntersects_songplay(mouse_position);
});

function checkIntersects_songplay(mouse_position) {
  let mouse_vector = mouseToThree(...mouse_position);
  raycaster.setFromCamera(mouse_vector, camera);
  let intersects = raycaster.intersectObject(points);
  if (intersects[0]) {
    let sorted_intersects = sortIntersectsByDistanceToRay(intersects);
    let intersect = sorted_intersects[0];
    let index = intersect.index;
    let datum = generated_points[index];
    if(datum.newname!=0)
      {
        //alert("group",datum.group);
      //alert("play a song here");  
      minsong = Math.ceil(0);
      maxsong = Math.floor(songdata["song"].length -1 );
      var songindex=Math.floor(Math.random() * (maxsong - minsong + 1)) + minsong;
      console.log("index"+songindex);
      document.getElementById("spotifyplayer").src = songdata.song[songindex];
    //document.getElementById("player").src="https://www.youtube.com/embed/CnAmeh0-E-U";
    //document.getElementById('some_frame_id').contentWindow.location.reload();
        
      }
  } 
}


function sortIntersectsByDistanceToRay(intersects) {
  return _.sortBy(intersects, "distanceToRay");
}

hoverContainer = new THREE.Object3D()
scene.add(hoverContainer);

function highlightPoint(datum) {
  removeHighlights();
  
  let geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(
      datum.position[0],
      datum.position[1],
      0
    )
  );
  geometry.colors = [ new THREE.Color(color_array[datum.newname]) ];

  let material = new THREE.PointsMaterial({
    size: 26,
    sizeAttenuation: false,
    vertexColors: THREE.VertexColors,
    map: circle_sprite,
    transparent: true
  });
  
  let point = new THREE.Points(geometry, material);
  hoverContainer.add(point);
}

function removeHighlights() {
  hoverContainer.remove(...hoverContainer.children);
}

view.on("mouseleave", () => {
  removeHighlights()
});

// Initial tooltip state
let tooltip_state = { display: "none" }

let tooltip_template = document.createRange().createContextualFragment(`<div id="tooltip" style="display: none; position: absolute; pointer-events: none; font-size: 13px; width: 120px; text-align: center; line-height: 1; padding: 6px; background: white; font-family: sans-serif;">
  <div id="point_tip" style="padding: 4px; margin-bottom: 4px;"></div>
  <div id="group_tip" style="padding: 4px;"></div>
</div>`);
document.body.append(tooltip_template);

let $tooltip = document.querySelector('#tooltip');
let $point_tip = document.querySelector('#point_tip');
let $group_tip = document.querySelector('#group_tip');

function updateTooltip() {
  $tooltip.style.display = tooltip_state.display;
  $tooltip.style.left = tooltip_state.left + 'px';
  $tooltip.style.top = tooltip_state.top + 'px';
  $point_tip.innerText = tooltip_state.name;
  $point_tip.style.background = color_array[tooltip_state.group];
  $group_tip.innerText = tooltip_state.group;
}

function showTooltip(mouse_position, datum) {
  let tooltip_width = 120;
  let x_offset = -tooltip_width/2;
  let y_offset = 30;
  tooltip_state.display = "block";
  tooltip_state.left = mouse_position[0] + x_offset;
  tooltip_state.top = mouse_position[1] + y_offset;
  tooltip_state.name = datum.name;
  tooltip_state.group = datum.group;
  //console.log(tooltip_state);
  updateTooltip();
}

function hideTooltip() {
  tooltip_state.display = "none";
  updateTooltip();
}

}
*/

// Change shape based on selected friend
function ChangePointCloud(elt){
  /*
var n=4;
var dict_filter_local={};
//document.getElementById("spotifyplayer") 


if(elt.id=="mood")
{
  globalfilternameforfriend="mood";
}
else if (elt.id=="Charts")
{
globalfilternameforfriend="Charts";
}
else if(elt.id=="Language")
{
globalfilternameforfriend="Language";
}
else
{
  //do nothing
}

  if(globalfilternameforfriend=="mood")
  {
    
    dict_filter_local[0] = "nothing";
    dict_filter_local[1] = "Mood: Romance";
    dict_filter_local[2] = "Mood: Travel";
    dict_filter_local[3] = "Mood: Chill and study";
    dict_filter_local[4] = "Mood: Workout";

     color_array = [
        "#efefef",
        "#1f78b4",
        "#ff7f00",
        "#ff33fc",
        "#ffc300"]
        n=5;
    GlobalFilterType=mydata.tsnemodelA00;
    document.getElementById("filterbutton").value="Filter: Mood";
     makeNewCloud(GlobalFilterType, GlobalFriendName,color_array,n,dict_filter_local);
    
  }
  else if(globalfilternameforfriend=="Charts")
  {
    dict_filter_local[0] = "nothing";
    dict_filter_local[1] = "Charts: Top 50";
    dict_filter_local[2] = "Charts: Top 20 weekely";
    dict_filter_local[3] = "Charts: All time favourites";
         color_array = [
        "#efefef",,
        "#ff3346",
        "#ffc300",
        "#4CFF33"]
        n=4;
    GlobalFilterType=mydata.tsnemodelA04;
    document.getElementById("filterbutton").value="Filter: Charts";
     makeNewCloud(GlobalFilterType, GlobalFriendName,color_array,n,dict_filter_local);

  }
  else if(globalfilternameforfriend=="Language")
  {
    dict_filter_local[0] = "nothing";
    dict_filter_local[1] = "Language: English";
    dict_filter_local[2] = "Language: Hindi";
    dict_filter_local[3] = "Language: Spanish";
         color_array = [
        "#efefef",
        "#ff7f00",
        "#4CFF33",
        "#ffc300"]
        n=4;
    GlobalFilterType=mydata.umapmodelA04;
    document.getElementById("filterbutton").value="Filter: Language";
     makeNewCloud(GlobalFilterType, GlobalFriendName,color_array,n,dict_filter_local);

  }
  */

 
  
  if(elt.id == "Henry")
    {
      GlobalFriendName = 100;
      document.getElementById("friendbutton").value="Friend: Henry";
      createmap(GlobalFriendName,1);
    }
  
  else if(elt.id == "David")
    {
      GlobalFriendName = 400;
      document.getElementById("friendbutton").value="Friend: David";
      createmap(GlobalFriendName,1);
    }
  
  else if(elt.id == "Gab")
    {
      GlobalFriendName = 600;
      document.getElementById("friendbutton").value="Friend: Gabriella";
      createmap(GlobalFriendName,1);
    }

    else if(elt.id == "none")
    {
      GlobalFriendName = 800;
      document.getElementById("friendbutton").value="Friend: Me!";
      createmap(GlobalFriendName,0);
    }



 



}
