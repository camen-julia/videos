import {
  db,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "./firebase.js";

const title = document.getElementById("title");
const videoUrl = document.getElementById("videoUrl");
const saveBtn = document.getElementById("saveBtn");
const status = document.getElementById("status");
const videoList = document.getElementById("videoList");
const search = document.getElementById("search");

const totalVideos = document.getElementById("totalVideos");
const totalLikes = document.getElementById("totalLikes");
const totalViews = document.getElementById("totalViews");

let videos = [];
let editId = null;

loadVideos();

function getYoutubeId(url){

    if(url.includes("watch?v=")){
        return url.split("watch?v=")[1].split("&")[0];
    }

    if(url.includes("youtu.be/")){
        return url.split("youtu.be/")[1].split("?")[0];
    }

    if(url.includes("shorts/")){
        return url.split("shorts/")[1].split("?")[0];
    }

    return "";
}

function getThumbnail(url){

    const id = getYoutubeId(url);

    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

}

saveBtn.addEventListener("click", saveVideo);

async function saveVideo(){

    if(!title.value.trim() || !videoUrl.value.trim()){

        alert("Please enter title and YouTube URL");

        return;

    }

    const data={

        title:title.value.trim(),

        videoUrl:videoUrl.value.trim(),

        thumbnail:getThumbnail(videoUrl.value.trim())

    };

    if(editId){

        await updateDoc(doc(db,"videos",editId),{

            title:data.title,

            videoUrl:data.videoUrl,

            thumbnail:data.thumbnail

        });

        status.innerHTML="✅ Video Updated";

        editId=null;

        saveBtn.innerHTML="💾 Save Video";

    }else{

        await addDoc(collection(db,"videos"),{

            ...data,

            likes:0,

            views:0

        });

        status.innerHTML="✅ Video Saved";

    }

    title.value="";
    videoUrl.value="";

    setTimeout(()=>{

        status.innerHTML="";

    },2000);

    loadVideos();

}
async function loadVideos() {

    const snapshot = await getDocs(collection(db, "videos"));

    videos = [];

    snapshot.forEach(item => {

        videos.push({
            id: item.id,
            ...item.data()
        });

    });

    renderVideos(videos);

}

function renderVideos(list){

    videoList.innerHTML="";

    let likes=0;
    let views=0;

    list.forEach(video=>{

        likes += video.likes || 0;
        views += video.views || 0;

        videoList.innerHTML += `

<div class="video-item">

<img src="${video.thumbnail}" alt="${video.title}">

<div class="video-info">

<h3>${video.title}</h3>

<p>❤️ ${video.likes || 0}</p>

<p>👁️ ${video.views || 0}</p>

<div class="actions">

<button
class="edit-btn"
data-id="${video.id}">
✏️ Edit
</button>

<button
class="delete-btn"
data-id="${video.id}">
🗑 Delete
</button>

</div>

</div>

</div>

`;

    });

    totalVideos.innerText=list.length;
    totalLikes.innerText=likes;
    totalViews.innerText=views;

    document.querySelectorAll(".edit-btn").forEach(btn=>{

        btn.onclick=()=>editVideo(btn.dataset.id);

    });

    document.querySelectorAll(".delete-btn").forEach(btn=>{

        btn.onclick=()=>deleteVideo(btn.dataset.id);

    });

}

search.addEventListener("input",()=>{

    const key=search.value.toLowerCase();

    const result=videos.filter(v=>

        v.title.toLowerCase().includes(key)

    );

    renderVideos(result);

});

function editVideo(id){

    const video=videos.find(v=>v.id===id);

    if(!video) return;

    editId=id;

    title.value=video.title;
    videoUrl.value=video.videoUrl;

    saveBtn.innerHTML="💾 Update Video";

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}

async function deleteVideo(id){

    if(!confirm("Delete this video?")) return;

    await deleteDoc(doc(db,"videos",id));

    status.innerHTML="🗑 Video Deleted";

    setTimeout(()=>{

        status.innerHTML="";

    },2000);

    loadVideos();

}
