const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const img=(n,a,l)=>n?`<img src="assets/${n}.jpg" alt="${a}" ${l?'loading="lazy"':''}>`:`<div class="ph-img">Photo coming soon</div>`;
const wa=t=>SB.whatsapp?`https://wa.me/${SB.whatsapp}?text=${encodeURIComponent(t)}`:"#contact";
function setWA(){$$("[data-wa]").forEach(a=>{const t=a.dataset.msg||"Hello Sign Base, I would like to make an enquiry.";a.href=wa(t);if(SB.whatsapp){a.target="_blank";a.rel="noopener"}else a.onclick=()=>{go("contact");return false}})}
$$("[data-f]").forEach(e=>{const v=SB[e.dataset.f];if(v)e.textContent=v;else if(e.dataset.f==="location")e.textContent=SB.location});
$("#yr").textContent=new Date().getFullYear();
$("#soc").innerHTML=Object.entries(SB.social).filter(([,u])=>u).map(([k,u])=>`<a href="${u}" target="_blank" rel="noopener">${k}</a>`).join("");
// views
const views=["home","about","products","work","contact"];
function go(v){location.hash=v}
function route(){let v=location.hash.slice(1);if(!views.includes(v))v="home";$$(".view").forEach(e=>e.classList.toggle("on",e.id==="v-"+v));$$("nav a:not(.btn)").forEach(a=>a.classList.toggle("on",a.hash==="#"+v));$("#nav").classList.remove("open");scrollTo(0,0)}
addEventListener("hashchange",route);
// catalogue
let cat="All";
const prodCard=(p,i)=>`<article class="card">${img(p.img,p.n,1)}<div class="cb"><span class="tag">${p.c}</span><h3>${p.n}</h3><p>${p.d}</p><p><b>Request a Quote</b></p><div class="row"><button class="btn dark" data-v="${i}">View Details</button><button class="btn" data-q="${i}">Request a Quote</button></div></div></article>`;
function renderP(){const q=$("#q").value.toLowerCase();const l=PRODUCTS.map((p,i)=>[p,i]).filter(([p])=>(cat==="All"||p.c===cat)&&(p.n+p.d+p.c).toLowerCase().includes(q));$("#plist").innerHTML=l.map(([p,i])=>prodCard(p,i)).join("");$("#none").hidden=l.length>0}
const chips=(el,list,cur,fn)=>{el.innerHTML=["All",...list].map(c=>`<button class="chip ${c===cur?"on":""}" aria-pressed="${c===cur}">${c}</button>`).join("");$$(".chip",el).forEach(b=>b.onclick=()=>fn(b.textContent))};
const setCat=c=>{cat=c;chips($("#chips"),CATS,cat,setCat);renderP()};
$("#q").oninput=renderP;setCat("All");
$("#homeCats").innerHTML=CATS.map(c=>`<a class="card" href="#products" data-cat="${c}">${img(CATIMG[c],c,1)}<div class="cb"><h3>${c}</h3><p>${CATDESC[c]}</p><div class="row"><span class="btn">Explore</span></div></div></a>`).join("");
$$("[data-cat]").forEach(a=>a.addEventListener("click",()=>setCat(a.dataset.cat)));
$("#fcats").innerHTML=CATS.map(c=>`<a href="#products" data-cat="${c}">${c}</a>`).join("");$$("#fcats [data-cat]").forEach(a=>a.addEventListener("click",()=>setCat(a.dataset.cat)));
$("#fprod").innerHTML=`<option value="">Select…</option>`+PRODUCTS.map(p=>`<option>${p.n}</option>`).join("")+`<option>Other / not sure</option>`;
// gallery
let wc="All";const fig=([n,c])=>`<figure data-src="${n}"><img src="assets/${n}.jpg" alt="${c} project" loading="lazy"><figcaption>${c}</figcaption></figure>`;
function renderW(){$("#wgal").innerHTML=WORK.filter(w=>wc==="All"||w[1]===wc).map(fig).join("")}
const setW=c=>{wc=c;chips($("#wchips"),[...new Set(WORK.map(w=>w[1]))],wc,setW);renderW()};setW("All");
$("#homeGal").innerHTML=WORK.slice(0,6).map(fig).join("");
document.addEventListener("click",e=>{const f=e.target.closest("figure[data-src]");if(f){$("#lb img").src=`assets/${f.dataset.src}.jpg`;$("#lb").hidden=false}});
// modal
let last;const close=()=>{$("#modal").hidden=$("#lb").hidden=true;last&&last.focus()};
$$(".x,.modal").forEach(e=>e.addEventListener("click",x=>{if(x.target===e)close()}));addEventListener("keydown",e=>e.key==="Escape"&&close());
function details(i){const p=PRODUCTS[i];last=document.activeElement;
$("#mbody").innerHTML=`<div class="mbox" style="box-shadow:none">${img(p.img,p.n)}<div class="mb"><span class="tag">${p.c}</span><h2>${p.n}</h2><p>${p.d}</p>${Object.entries(p.o||{}).map(([k,v])=>`<label>${k}<select data-opt="${k}">${v.map(x=>`<option>${x}</option>`).join("")}</select></label>`).join("")}<label>Quantity<input type="number" min="1" value="1" id="qty"></label><p><b>Request a Quote</b></p><div class="row"><button class="btn" id="mq">Request a Quote</button><a class="btn dark" id="mw" target="_blank" rel="noopener" href="#">WhatsApp enquiry</a></div></div></div>`;
$("#modal").hidden=false;const sum=()=>`Hello Sign Base, I'd like a quote for: ${p.n}. ${$$("[data-opt]").map(s=>s.dataset.opt+": "+s.value).join(", ")}. Quantity: ${$("#qty").value}.`;
const upd=()=>{$("#mw").href=wa(sum())};$$("#mbody select,#qty").forEach(x=>x.oninput=upd);upd();
if(!SB.whatsapp)$("#mw").onclick=()=>{$("#mq").click();return false};$("#mq").onclick=()=>{close();quote(p.n,sum())};$("#mbody .mb").querySelector("select,input")?.focus()}
function quote(name,msg){go("contact");if(name)$("#fprod").value=name;if(msg)$("[name=msg]").value=msg}
document.addEventListener("click",e=>{const v=e.target.closest("[data-v]"),q=e.target.closest("[data-q]");if(v)details(v.dataset.v);if(q){const p=PRODUCTS[q.dataset.q];quote(p.n,`Hello Sign Base, I'd like a quote for: ${p.n}.`)}});
$$("[data-quote]").forEach(a=>a.addEventListener("click",()=>{$("#fprod").value=""}));
// form
$("#form").onsubmit=async e=>{e.preventDefault();const f=e.target,s=$("#status");s.className="";
if(!f.checkValidity()){f.reportValidity();s.className="err";s.textContent="Please complete the required fields.";return}
const d=Object.fromEntries(new FormData(f));delete d.file;const body=Object.entries(d).map(([k,v])=>k+": "+v).join("\n");
const b=$("#send");b.disabled=true;b.textContent="Sending…";
try{if(SB.formEndpoint){const r=await fetch(SB.formEndpoint,{method:"POST",body:new FormData(f),headers:{Accept:"application/json"}});if(!r.ok)throw 0;s.className="ok";s.textContent="Thank you. Your request has been sent and we will be in touch.";f.reset()}
else if(SB.email){location.href=`mailto:${SB.email}?subject=${encodeURIComponent("Quote request: "+d.product)}&body=${encodeURIComponent(body)}`;s.className="ok";s.textContent="Your email app has opened with your request. Press send to finish. Attach any reference image there."}
else{s.className="err";s.textContent="Sign Base has not set up its enquiry email yet. Please try again soon."}}
catch{s.className="err";s.textContent="Something went wrong. Please try again or use WhatsApp."}
b.disabled=false;b.textContent="Send quote request"};
// ui
$("#burger").onclick=()=>{const o=$("#nav").classList.toggle("open");$("#burger").setAttribute("aria-expanded",o)};
const up=$("#up");addEventListener("scroll",()=>up.hidden=scrollY<500);up.onclick=()=>scrollTo({top:0,behavior:"smooth"});
setWA();route();
