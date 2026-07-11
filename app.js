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

loadVideos();

async function loadVideos(){

    const snapshot = await getDocs(collection(db,"videos"));

    videos = snapshot.docs.map(item=>({

        id:item.id,

        ...item.data()

    }));

    renderVideos(videos);

}

function renderVideos(list){

    videoList.innerHTML = "";

    list.forEach(video=>{

        videoList.innerHTML += createCard(video);

    });

}

function createCard(video){

    return `

<div class="video-item">

<img
src="${video.thumbnail}"
alt="${video.title}">

<div class="video-info">

<h3>${video.title}</h3>

<p>❤️ ${video.likes || 0}</p>

<p>👁️ ${video.views || 0}</p>

<div class="actions">

<button
class="edit-btn"
onclick="likeVideo('${video.id}')">

❤️ Like

</button>

<button
class="edit-btn"
onclick="shareVideo('${video.videoUrl}')">

🔗 Share

</button>

<button
class="delete-btn"
onclick="watchVideo('${video.id}','${video.videoUrl}')">

▶ Watch

</button>

</div>

</div>

</div>

`;

}
window.likeVideo = async function(id){

    await updateDoc(doc(db,"videos",id),{

        likes:increment(1)

    });

    loadVideos();

}

window.watchVideo = async function(id,url){

    await updateDoc(doc(db,"videos",id),{

        views:increment(1)

    });

    window.location.href =
        "watch.html?url=" + encodeURIComponent(url);

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
