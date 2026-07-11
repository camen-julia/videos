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

async function loadVideos() {

  videoList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "videos"));

  snapshot.forEach(item => {

    const video = item.data();

    const id = item.id;

    videoList.innerHTML += createCard(id, video);

  });

}

function createCard(id, video) {

  return `

<div class="video-card">

<img
class="thumb"
src="${video.thumbnail}"
alt="${video.title}">

<div class="overlay">

<h2>${video.title}</h2>

</div>

<div class="actions">

<button onclick="likeVideo('${id}')">
❤️
</button>

<span id="likes-${id}">
${video.likes || 0}
</span>

<button onclick="shareVideo('${video.videoUrl}')">
🔗
</button>

<button disabled>
👁️
</button>

<span id="views-${id}">
${video.views || 0}
</span>

</div>

<button
class="watch-btn"
onclick="watchVideo('${id}','${video.videoUrl}')">

▶ Watch Video

</button>

</div>

`;

}

window.likeVideo = async function(id){

    await updateDoc(doc(db,"videos",id),{

        likes:increment(1)

    });

    const like=document.getElementById("likes-"+id);

    like.innerText=parseInt(like.innerText)+1;

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

            text:"Watch this video",

            url:url

        });

    }else{

        await navigator.clipboard.writeText(url);

        alert("Video link copied");

    }

}
