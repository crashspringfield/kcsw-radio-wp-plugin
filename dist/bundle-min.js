window.addEventListener("load",()=>{let e=!1,t=null;const n=e=>e%60,d=(e,t)=>(e-t)/60,o=e=>e<10?"0":"",u=e=>e.substring(0,e.indexOf(",")),c=(e,t)=>{const n=t.indexOf(e);return n+1>=t.length?t[0]:t[n+1]},a=(e,t)=>{const n=t.indexOf(e);return n>0?t[n-1]:t[t.length-1]};function m(e){const t=c(e,feedz),n=a(e,feedz);document.getElementById("podcast-name").textContent=e.podcast,document.getElementById("podcast-title").textContent=e.title,document.getElementById("podcast-date").textContent=u(e.date),document.getElementById("previous-podcast").textContent=n.podcast,document.getElementById("next-podcast").textContent=t.podcast}function i(){const e=document.getElementById("audio-media"),t=e.currentTime,u=n(t),c=d(t,u);document.getElementById("current-time").textContent=`${c}:${o(u)}${Math.floor(u)}`,document.getElementById("progress-bar").value=t/e.duration}function l(t){t?(e=!0,document.getElementById("playpause-button").classList.remove("play"),document.getElementById("playpause-button").classList.add("pause")):(e=!1,document.getElementById("playpause-button").classList.remove("pause"),document.getElementById("playpause-button").classList.add("play"),document.getElementById("audio-media").pause())}function r(){null!==t&&(t=c(t,feedz),E(),m(t),s(t),l(!1))}function s(e){let t=document.getElementById("audio-container");if(null===t){const e=document.getElementsByTagName("body")[0];(t=document.createElement("div")).setAttribute("id","audio-container"),e.insertBefore(t,e.firstChild)}const n=document.createElement("audio");n.setAttribute("id","audio-media"),t.appendChild(n);const d=document.createElement("source");d.setAttribute("src",e.audio),n.appendChild(d)}function E(){null!==document.getElementById("audio-container")&&document.getElementById("audio-container").remove()}document.getElementById("progress-bar").value=0,document.getElementById("progress-bar").addEventListener("change",()=>{document.getElementById("audio-media").currentTime=document.getElementById("audio-media").duration*document.getElementById("progress-bar").value}),document.getElementById("playpause-button").addEventListener("click",()=>{e?l(!1):(!function(){const e=document.getElementById("audio-media");let t=e.play();void 0!==t&&(t.then(()=>{!function(e){const t=n(e),u=d(e,t);document.getElementById("total-time").textContent=`${u}:${o(t)}${Math.floor(t)}`}(e.duration),i(),l(!0)}).catch(e=>{console.log("ERROR",e),l(!1)}),e.addEventListener("timeupdate",()=>{i()}),e.addEventListener("ended",()=>{r()}))}(),l(!0))}),document.getElementById("replay10-button").addEventListener("click",()=>{if(null!==t){const e=document.getElementById("audio-media");e.currentTime=e.currentTime-10>0?e.currentTime-10:0}}),document.getElementById("forward10-button").addEventListener("click",()=>{if(null!==t){const e=document.getElementById("audio-media");e.currentTime=e.currentTime+10<e.duration?e.currentTime+10:e.duration}}),document.getElementById("previous-button").addEventListener("click",()=>{if(null!==t){const e=document.getElementById("audio-media");e.currentTime<5?null!==t&&(t=a(t,feedz),E(),m(t),s(t),l(!1)):e.currentTime=0}}),document.getElementById("next-button").addEventListener("click",()=>{r()}),m(t=(e=>e[Math.floor(Math.random()*e.length)])(feedz)),s(t)});