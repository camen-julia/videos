import {
db,
collection,
getDocs,
doc,
updateDoc,
increment
} from "./firebase.js";

const videoList = document.getElementById("videoList");

loadVideos();

async function loadVideos(){

videoList.innerHTML="";

const snapshot = await getDocs(collection(db,"videos"));

snapshot.forEach(item=>{

const data=item.data();

const id=item.id;

const youtubeId=getYoutubeId(data.videoUrl);

videoList.innerHTML+=`

<div class="video-card">

<iframe
src="https://www.youtube.com/embed/${youtubeId}?enablejsapi=1"
allowfullscreen>
</iframe>

<div class="overlay">

<h2>${data.title}</h2>

</div>

<div class="actions">

<button onclick="likeVideo('${id}')">
❤️
</button>

<span id="like-${id}">
${data.likes||0}
</span>

<button onclick="shareVideo('${data.videoUrl}')">
🔗
</button>

<button>
👁️
</button>

<span id="view-${id}">
${data.views||0}
</span>

</div>

<button
class="watch-btn"
onclick="watchVideo('${id}','${data.videoUrl}')">

Watch

</button>

</div>

`;

});

}

function getYoutubeId(url){

const match=url.match(/[?&]v=([^&]+)/);

if(match) return match[1];

return url.split("/").pop();

}

window.shareVideo=function(url){

navigator.clipboard.writeText(url);

alert("Copied");

}

window.likeVideo=async function(id){

await updateDoc(doc(db,"videos",id),{

likes:increment(1)

});

document.getElementById("like-"+id).innerText++;

}

window.watchVideo=async function(id,url){

await updateDoc(doc(db,"videos",id),{

views:increment(1)

});

location.href="watch.html?url="+encodeURIComponent(url);

}
