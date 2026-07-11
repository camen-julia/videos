function createCard(video){

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

▶ Watch

</button>

</div>

`;

}
