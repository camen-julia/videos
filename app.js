import {
  db,
  collection,
  getDocs,
  doc,
  updateDoc,
  increment
} from "./firebase.js";

const videoList = document.getElementById("videoList");

let videos = [];

async function loadVideos() {

  videoList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "videos"));

  videos = [];

  snapshot.forEach(item => {

    videos.push({
      id: item.id,
      ...item.data()
    });

  });

  videos.forEach(video => {

    videoList.innerHTML += createCard(video);

  });

}

function createCard(video) {

  const youtubeId = getYoutubeId(video.videoUrl);

  return `

<div class="video-card">

<iframe
src="https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&playsinline=1&rel=0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen>
</iframe>

<div class="overlay">

<h2>${video.title}</h2>

</div>

<div class="actions">

<button onclick="likeVideo('${video.id}')">
❤️
</button>

<span id="likes-${video.id}">
${video.likes || 0}
</span>

<button onclick="shareVideo('${video.videoUrl}')">
🔗
</button>

<button disabled>
👁️
</button>

<span id="views-${video.id}">
${video.views || 0}
</span>

</div>

<button
class="watch-btn"
onclick="watchVideo('${video.id}','${video.videoUrl}')">

Watch

</button>

</div>

`;

}

function getYoutubeId(url){

  if(url.includes("watch?v=")){

      return url.split("watch?v=")[1].split("&")[0];

  }

  if(url.includes("youtu.be/")){

      return url.split("youtu.be/")[1].split("?")[0];

  }

  return "";

}

window.likeVideo = async function(id){

  await updateDoc(doc(db,"videos",id),{

      likes:increment(1)

  });

  const txt=document.getElementById("likes-"+id);

  txt.innerText=parseInt(txt.innerText)+1;

}

window.watchVideo = async function(id,url){

  await updateDoc(doc(db,"videos",id),{

      views:increment(1)

  });

  location.href="watch.html?url="+encodeURIComponent(url);

}

window.shareVideo = async function(url){

  if(navigator.share){

      await navigator.share({

          title:"Videos",

          url:url

      });

  }else{

      await navigator.clipboard.writeText(url);

      alert("Video link copied");

  }

}

loadVideos();
