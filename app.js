import {
  db,
  collection,
  getDocs,
  updateDoc,
  doc,
  increment
} from "./firebase.js";

const container = document.getElementById("videoList");

let videos = [];

async function loadVideos() {

  const snapshot = await getDocs(collection(db, "videos"));

  videos = snapshot.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));

  renderVideos();

}

function renderVideos() {

  container.innerHTML = "";

  videos.forEach(video => {

    container.innerHTML += `

<div class="video-card">

<iframe
src="${convertYoutube(video.videoUrl)}"
allowfullscreen>
</iframe>

<div class="overlay">
<h2>${video.title}</h2>
</div>

<div class="actions">

<button onclick="likeVideo('${video.id}')">
❤️
</button>

<span id="like-${video.id}">
${video.likes || 0}
</span>

<button onclick="shareVideo('${video.videoUrl}')">
🔗
</button>

<button onclick="watchVideo('${video.id}','${video.videoUrl}')">
👁️
</button>

<span id="view-${video.id}">
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

  });

}

function convertYoutube(url){

  if(url.includes("watch?v=")){

      const id=url.split("watch?v=")[1].split("&")[0];

      return "https://www.youtube.com/embed/"+id;

  }

  if(url.includes("youtu.be/")){

      const id=url.split("youtu.be/")[1];

      return "https://www.youtube.com/embed/"+id;

  }

  return url;

}

window.shareVideo = async function(url){

  if(navigator.share){

      await navigator.share({
          title:"Videos",
          url:url
      });

  }else{

      await navigator.clipboard.writeText(url);

      alert("Link Copied");

  }

}

window.likeVideo = async function(id){

  const liked = localStorage.getItem("liked_"+id);

  if(liked){
      alert("You already liked this video.");
      return;
  }

  await updateDoc(doc(db,"videos",id),{
      likes:increment(1)
  });

  localStorage.setItem("liked_"+id,"1");

  loadVideos();

}

window.watchVideo = async function(id,url){

  await updateDoc(doc(db,"videos",id),{
      views:increment(1)
  });

  location.href="watch.html?url="+encodeURIComponent(url);

}

loadVideos();
