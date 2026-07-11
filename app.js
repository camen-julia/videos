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

async function loadVideos() {

    const snapshot = await getDocs(collection(db, "videos"));

    videos = snapshot.docs.map(item => ({
        id: item.id,
        ...item.data()
    }));

    renderVideos(videos);
}

function renderVideos(list) {

    videoList.innerHTML = "";

    list.forEach(video => {

        videoList.innerHTML += createCard(video);

    });

}

function createCard(video){

return `

<div class="video-item">

<img src="${video.thumbnail}" alt="${video.title}">

<div class="actions">

<button onclick="likeVideo('${video.id}')">
❤️
</button>

<span>${video.likes || 0}</span>

<button onclick="shareVideo('${video.videoUrl}')">
🔗
</button>

<button onclick="watchVideo('${video.id}','${video.videoUrl}')">
▶️
</button>

<span>${video.views || 0}</span>

</div>

<div class="video-info">

<h3>${video.title}</h3>

</div>

<button
class="watch-btn"
onclick="watchVideo('${video.id}','${video.videoUrl}')">

▶ Watch Video

</button>

</div>

`;

}

window.likeVideo = async function(id){

    try{

        await updateDoc(doc(db,"videos",id),{

            likes:increment(1)

        });

        const video = videos.find(v=>v.id===id);

        if(video){

            video.likes = (video.likes || 0) + 1;

            renderVideos(videos);

        }

    }catch(e){

        console.log(e);

    }

}

window.watchVideo = async function(id,url){

    try{

        await updateDoc(doc(db,"videos",id),{

            views:increment(1)

        });

        const video = videos.find(v=>v.id===id);

        if(video){

            video.views = (video.views || 0) + 1;

        }

    }catch(e){

        console.log(e);

    }

    window.location.href =
    "watch.html?url=" + encodeURIComponent(url);

}

window.shareVideo = async function(url){

    try{

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

    }catch(e){

        console.log(e);

    }

}
