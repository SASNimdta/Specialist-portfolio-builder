function getEvidenceAgeStatus(dateValue) {
    if (!dateValue) {
        return {
            status: "unknown",
            label: "Date not entered",
            message: "",
            unsuitable: false
        };
    }

    const evidenceDate = new Date(dateValue + "T00:00:00");
    const today = new Date();

    const fourYearAnniversary = new Date(evidenceDate);
    fourYearAnniversary.setFullYear(
        fourYearAnniversary.getFullYear() + 4
    );

    const fiveYearAnniversary = new Date(evidenceDate);
    fiveYearAnniversary.setFullYear(
        fiveYearAnniversary.getFullYear() + 5
    );

    if (today >= fiveYearAnniversary) {
        return {
            status: "unsuitable",
            label: "Over 5 years old",
            message:
                "This evidence is 5 years old or more and is considered unsuitable for portfolio-completion purposes.",
            unsuitable: true
        };
    }

    if (today >= fourYearAnniversary) {
        return {
            status: "age-warning",
            label: "Approaching 5 years old",
            message:
                "This evidence is 4 years old or more and is approaching the 5-year limit.",
            unsuitable: false
        };
    }

    return {
        status: "current",
        label: "Within 4 years",
        message: "",
        unsuitable: false
    };
}

function updateEvidenceDateWarning() {
    const dateInput = document.getElementById("evidenceDate");

    if (!dateInput) {
        return;
    }

    let warning = document.getElementById("evidenceDateWarning");

    if (!warning) {
        warning = document.createElement("div");
        warning.id = "evidenceDateWarning";
        warning.className = "evidence-age-message";
        dateInput.insertAdjacentElement("afterend", warning);
    }

    const ageStatus = getEvidenceAgeStatus(dateInput.value);

    warning.className =
        "evidence-age-message " + ageStatus.status;

    warning.textContent = ageStatus.message;
    warning.hidden = !ageStatus.message;
}
let evidence=[],currentDomain=1;const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2200)}function go(id){$$('.screen').forEach(x=>x.classList.remove('active'));$('#'+id).classList.add('active');$$('.nav button').forEach(x=>x.classList.toggle('active',x.dataset.screen===id));window.scrollTo(0,0);if(id==='dashboard')renderDashboard();if(id==='library')renderLibrary();if(id==='progress')renderProgress()}document.addEventListener('click',e=>{const b=e.target.closest('[data-screen]');if(b){if(b.dataset.screen==='upload'&&!b.closest('.library-item'))resetForm();go(b.dataset.screen)}});function statusFor(c){const req=c.requiredEvidenceTypes||[];if(!req.length)return{status:'unconfigured',done:0,total:0,missing:[]};const linked=new Set();
for (const e of evidence) {
    const ageStatus = getEvidenceAgeStatus(e.date);

    if (
        !ageStatus.unsuitable &&
        (e.criteria || []).includes(c.code)
    ) {
        (e.evidenceTypes || []).forEach(type => {
            linked.add(type);
        });
    }
}
const missing=req.filter(x=>!linked.has(x)),done=req.length-missing.length;return{status:done===0?'outstanding':missing.length?'progress':'complete',done,total:req.length,missing}}function domainStats(id){const cs=APP_DATA.criteria.filter(c=>c.domain===id),s=cs.map(statusFor),complete=s.filter(x=>x.status==='complete').length,progress=s.filter(x=>x.status==='progress').length,outstanding=s.filter(x=>x.status==='outstanding'||x.status==='unconfigured').length,pct=cs.length?Math.round(complete/cs.length*100):0;return{cs,s,complete,progress,outstanding,pct}}function domainCard(d){const s=domainStats(d.id);return`<article class="domain-card" data-domain="${d.id}"><h3>${d.name}</h3><div class="pct">${s.pct}%</div><div class="bar"><i style="width:${s.pct}%"></i></div><div class="counts">${s.outstanding} outstanding · ${s.progress} in progress · ${s.complete} complete</div></article>`}function renderDashboard(){const all=APP_DATA.criteria.map(statusFor),complete=all.filter(x=>x.status==='complete').length,progress=all.filter(x=>x.status==='progress').length,outstanding=all.filter(x=>x.status==='outstanding'||x.status==='unconfigured').length,pct=Math.round(complete/APP_DATA.criteria.length*100),wr=evidence.filter(e=>reflectionText(e)).length;$('#overallPct').textContent=pct+'%';$('#overallBar').style.width=pct+'%';$('#criteriaSummary').textContent=`${complete} of ${APP_DATA.criteria.length} criteria complete`;$('#completeCount').textContent=complete;$('#progressCount').textContent=progress;$('#outstandingCount').textContent=outstanding;$('#evidenceCount').textContent=evidence.length;$('#withReflection').textContent=wr;$('#withoutReflection').textContent=evidence.length-wr;$('#dashboardDomains').innerHTML=APP_DATA.domains.map(domainCard).join('')}function renderProgress(){$('#progressDomains').innerHTML=APP_DATA.domains.map(domainCard).join('')}document.addEventListener('click',e=>{const c=e.target.closest('[data-domain]');if(c)openDomain(+c.dataset.domain)});function criterionHtml(c){const s=statusFor(c);if(s.status==='unconfigured')return`<article class="criterion-card"><b>${c.code}</b><p>${c.description}</p><small>No required evidence types are specified in the current framework mapping. This criterion is not counted as complete.</small></article>`;return`<article class="criterion-card"><b>${c.code}</b><p>${c.description}</p><small>${s.done} of ${s.total} evidence types present</small>${s.missing.length?`<div class="missing"><b>Missing:</b> ${s.missing.join('; ')}</div>`:''}</article>`}function openDomain(id){currentDomain=id;const d=APP_DATA.domains.find(x=>x.id===id),s=domainStats(id);$('#domainTitle').textContent=d.name;$('#domainPct').textContent=s.pct+'%';$('#domainBar').style.width=s.pct+'%';$('#domainSummary').textContent=`${s.outstanding} outstanding · ${s.progress} in progress · ${s.complete} complete`;$('#domainOutstanding').innerHTML=s.cs.filter(c=>['outstanding','unconfigured'].includes(statusFor(c).status)).map(criterionHtml).join('')||'<p>None</p>';$('#domainProgress').innerHTML=s.cs.filter(c=>statusFor(c).status==='progress').map(criterionHtml).join('')||'<p>None</p>';$('#domainComplete').innerHTML=s.cs.filter(c=>statusFor(c).status==='complete').map(criterionHtml).join('')||'<p>None</p>';go('domain')}function renderTypes(q=''){const chosen=new Set($$('.etype:checked').map(x=>x.value));const list=APP_DATA.evidenceTypes.filter(x=>x.id.toLowerCase().includes(q.toLowerCase()));$('#evidenceTypes').innerHTML=list.map(x=>`<label class="check"><input class="etype" type="checkbox" value="${esc(x.id)}" ${chosen.has(x.id)?'checked':''}><span>${esc(x.id)}</span></label>`).join('')}function selectedTypes(){return $$('.etype:checked').map(x=>x.value)}function updateSuggestions(){const types=selectedTypes(),dom=new Set(),crit=new Set();types.forEach(t=>{const x=APP_DATA.evidenceTypes.find(e=>e.id===t);(x?.suggestedDomains||[]).forEach(v=>dom.add(v));(x?.suggestedCriteria||[]).forEach(v=>crit.add(v))});const chips=[...dom].map(i=>`<span class="suggest-chip">Domain ${i}</span>`).concat([...crit].map(i=>`<span class="suggest-chip">${i}</span>`));$('#suggestions').innerHTML=chips.length?chips.join(''):'Select an evidence type to see suggestions. Suggestions are guidance only and are never selected automatically.'}function renderDomainMapper(selected={}){$('#domainMapper').innerHTML=APP_DATA.domains.map(d=>{const rows=selected[d.id]||[];return`<div class="domain-map ${rows.length?'open':''}" data-map="${d.id}"><label class="domain-map-head"><input type="checkbox" class="dcheck" value="${d.id}" ${rows.length?'checked':''}> ${d.name}</label><div class="criterion-controls"><div class="criterion-rows">${rows.map(v=>criterionRow(d.id,v)).join('')}</div><button type="button" class="ghost add-criterion" data-add="${d.id}">+ Add another criterion</button></div></div>`}).join('')}function criterionRow(d,v=''){const options=APP_DATA.criteria.filter(c=>c.domain===d).map(c=>`<option value="${c.code}" ${c.code===v?'selected':''}>${c.code} · ${esc(c.description)}</option>`).join('');return`<div class="criterion-row"><select class="criterion-select"><option value="">Select criterion</option>${options}</select><button type="button" class="danger remove-criterion">Remove</button></div>`}document.addEventListener('change',e=>{if(e.target.classList.contains('etype'))updateSuggestions();if(e.target.classList.contains('dcheck')){const box=e.target.closest('.domain-map'),rows=box.querySelector('.criterion-rows');box.classList.toggle('open',e.target.checked);if(e.target.checked&&!rows.children.length)rows.insertAdjacentHTML('beforeend',criterionRow(+e.target.value))}});document.addEventListener('click',e=>{if(e.target.matches('.add-criterion'))e.target.previousElementSibling.insertAdjacentHTML('beforeend',criterionRow(+e.target.dataset.add));if(e.target.matches('.remove-criterion'))e.target.closest('.criterion-row').remove()});function mapping(){const out={};$$('.domain-map').forEach(box=>{const id=+box.dataset.map;if(box.querySelector('.dcheck').checked){out[id]=[...box.querySelectorAll('.criterion-select')].map(x=>x.value).filter(Boolean)}});return out}function resetForm()
    {const f=$('#evidenceForm');f.reset();$('#editId').value='';$('#uploadHeading').textContent='Upload evidence';renderTypes();renderDomainMapper();$('#suggestions').textContent='Select an evidence type to see suggestions. Suggestions are guidance only and are never selected automatically.'}$('#typeSearch').addEventListener('input',e=>renderTypes(e.target.value));$('#evidenceForm').addEventListener('submit',async e=>{e.preventDefault();const id=$('#editId').value?+$('#editId').value:Date.now(),old=await DB.get(id),file=$('#evidenceFile').files[0]||old?.file||null,m=mapping(),criteria=[...new Set(Object.values(m).flat())];if(!file&&!old)return toast('Please choose an evidence file');if(!selectedTypes().length)return toast('Select at least one evidence type');if(!criteria.length)return toast('Select at least one criterion');await DB.put({id,title:$('#evidenceTitle').value.trim(),date:$('#evidenceDate').value,file,fileName:file?.name||old?.fileName||'',evidenceTypes:selectedTypes(),criteria,domains:Object.keys(m).map(Number),reflection:old?.reflection||null,updated:new Date().toISOString()});evidence=await DB.all();toast('Evidence saved');go('library')});function reflectionText(e){return ['situation','hindrances','actions','results','plan'].some(k=>(e.reflection?.[k]||'').trim())}function renderLibrary(){const q=($('#librarySearch').value||'').toLowerCase();const list=evidence.filter(e=>[e.title,...(e.evidenceTypes||[]),...(e.criteria||[])].join(' ').toLowerCase().includes(q));$('#evidenceLibrary').innerHTML=list.length?list.sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map(e=>`<article class="library-item"><h3>${esc(e.title)}</h3><div class="meta"><span>${fmtDate(e.date)}</span><span>${esc(e.fileName)}</span><span class="reflection ${reflectionText(e)?'yes':'no'}">${reflectionText(e)?'Reflection attached':'Reflection not attached'}</span></div><div class="chips">${(e.evidenceTypes||[]).map(x=>`<span class="chip">${esc(x)}</span>`).join('')}${(e.criteria||[]).map(x=>`<span class="chip">${x}</span>`).join('')}</div><div class="item-actions"><button class="ghost edit-item" data-id="${e.id}">Edit</button><button class="secondary reflect-item" data-id="${e.id}">${reflectionText(e)?'Edit reflection':'Add reflection'}</button><button class="danger delete-item" data-id="${e.id}">Delete</button></div></article>`).join(''):'<p>No matching evidence has been added.</p>'}$('#librarySearch').addEventListener('input',renderLibrary);document.addEventListener('click',async e=>{let id;if(e.target.matches('.edit-item')){id=+e.target.dataset.id;const x=await DB.get(id);resetForm();$('#editId').value=x.id;$('#uploadHeading').textContent='Edit evidence';$('#evidenceTitle').value=x.title;$('#evidenceDate').value=x.date;renderTypes();$$('.etype').forEach(c=>c.checked=(x.evidenceTypes||[]).includes(c.value));const sel={};(x.domains||[]).forEach(d=>sel[d]=(x.criteria||[]).filter(c=>+c.split('.')[0]===d));renderDomainMapper(sel);updateSuggestions();go('upload')}if(e.target.matches('.delete-item')){id=+e.target.dataset.id;if(confirm('Delete this evidence item?')){await DB.remove(id);evidence=await DB.all();renderLibrary();toast('Evidence deleted')}}if(e.target.matches('.reflect-item')){id=+e.target.dataset.id;openReflection(id)}});async function openReflection(id){const x=await DB.get(id);$('#reflectionId').value=id;$('#reflectionTitle').textContent=`Reflection: ${x.title}`;['situation','hindrances','actions','results','plan'].forEach(k=>$('#'+k).value=x.reflection?.[k]||'');go('reflection')}$('#reflectionForm').addEventListener('submit',async e=>{e.preventDefault();const x=await DB.get(+$('#reflectionId').value);x.reflection={situation:$('#situation').value,hindrances:$('#hindrances').value,actions:$('#actions').value,results:$('#results').value,plan:$('#plan').value};await DB.put(x);evidence=await DB.all();toast('Reflection saved');go('library')});$('#saveProfile').addEventListener('click',()=>{localStorage.setItem('portfolioProfile',JSON.stringify({name:$('#candidateName').value.trim(),specialty:$('#candidateSpecialty').value.trim()}));toast('Portfolio details saved')});$('#fullExport').addEventListener('click',()=>exportFull(evidence));$('#indexedExport').addEventListener('click',()=>exportIndexed(evidence));$('#menuBtn').addEventListener('click',()=>$('#nav').classList.toggle('open'));
document
    .getElementById("evidenceDate")
    .addEventListener("change", updateEvidenceDateWarning);

document
    .getElementById("evidenceDate")
    .addEventListener("input", updateEvidenceDateWarning);
window.addEventListener('DOMContentLoaded',async()=>{evidence=await DB.all();renderTypes();renderDomainMapper();const p=JSON.parse(localStorage.getItem('portfolioProfile')||'{}');$('#candidateName').value=p.name||'';$('#candidateSpecialty').value=p.specialty||'';renderDashboard();renderProgress();if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js').catch(()=>{})});

/* Uploaded reflections and duplicate-criterion prevention */
function hasWrittenReflection(item){return ['situation','hindrances','actions','results','plan'].some(key=>(item.reflection?.[key]||'').trim())}
function hasUploadedReflection(item){return item.reflectionFile instanceof Blob}
function reflectionText(item){return hasWrittenReflection(item)||hasUploadedReflection(item)}
function reflectionStatusLabel(item){const written=hasWrittenReflection(item),uploaded=hasUploadedReflection(item);if(written&&uploaded)return'Written and uploaded reflections attached';if(written)return'Written reflection attached';if(uploaded)return'Uploaded reflection attached';return'No reflection attached'}
function renderLibrary(){const q=($('#librarySearch').value||'').toLowerCase();const list=evidence.filter(item=>[item.title,item.reflectionFileName||'',...(item.evidenceTypes||[]),...(item.criteria||[])].join(' ').toLowerCase().includes(q));$('#evidenceLibrary').innerHTML=list.length?list.sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map(item=>{const age=getEvidenceAgeStatus(item.date);return`<article class="library-item"><h3>${esc(item.title)}</h3><div class="meta"><span>${fmtDate(item.date)}</span><span>${esc(item.fileName)}</span><span class="evidence-age-badge ${age.status}">${age.label}</span><span class="reflection ${reflectionText(item)?'yes':'no'}">${reflectionStatusLabel(item)}</span></div>${age.message?`<div class="evidence-age-alert ${age.status}">${age.message}${age.unsuitable?' It remains in the portfolio but is excluded from completion calculations.':''}</div>`:''}${item.reflectionFileName?`<div class="chips"><span class="chip">Uploaded reflection: ${esc(item.reflectionFileName)}</span></div>`:''}<div class="chips">${(item.evidenceTypes||[]).map(value=>`<span class="chip">${esc(value)}</span>`).join('')}${(item.criteria||[]).map(value=>`<span class="chip">${value}</span>`).join('')}</div><div class="item-actions"><button class="ghost edit-item" data-id="${item.id}">Edit</button><button class="secondary reflect-item" data-id="${item.id}">Write Reflection</button><button class="secondary upload-reflection-item" data-id="${item.id}">Upload Reflection</button>${item.reflectionFile?`<button class="ghost download-reflection-item" data-id="${item.id}">Download Reflection</button><button class="danger remove-reflection-item" data-id="${item.id}">Remove Uploaded Reflection</button>`:''}<button class="danger delete-item" data-id="${item.id}">Delete</button></div></article>`}).join(''):'<p>No matching evidence has been added.</p>'}
function chooseReflectionFile(id){const input=document.createElement('input');input.type='file';input.accept='.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp';input.hidden=true;document.body.appendChild(input);input.addEventListener('change',async()=>{const file=input.files[0];input.remove();if(!file)return;const item=await DB.get(id);if(!item)return toast('Evidence item not found');item.reflectionFile=file;item.reflectionFileName=file.name;item.reflectionFileType=file.type||'application/octet-stream';item.updated=new Date().toISOString();await DB.put(item);evidence=await DB.all();renderLibrary();renderDashboard();toast('Reflection uploaded')},{once:true});input.click()}
function downloadStoredBlob(blob,fileName){const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=fileName||'reflection';document.body.appendChild(link);link.click();setTimeout(()=>{URL.revokeObjectURL(url);link.remove()},1500)}
document.addEventListener('click',async event=>{const uploadButton=event.target.closest('.upload-reflection-item');if(uploadButton){chooseReflectionFile(+uploadButton.dataset.id);return}const downloadButton=event.target.closest('.download-reflection-item');if(downloadButton){const item=await DB.get(+downloadButton.dataset.id);if(item?.reflectionFile)downloadStoredBlob(item.reflectionFile,item.reflectionFileName);return}const removeButton=event.target.closest('.remove-reflection-item');if(removeButton){if(!confirm('Remove the uploaded reflection from this evidence item?'))return;const item=await DB.get(+removeButton.dataset.id);if(!item)return;delete item.reflectionFile;delete item.reflectionFileName;delete item.reflectionFileType;await DB.put(item);evidence=await DB.all();renderLibrary();renderDashboard();toast('Uploaded reflection removed')}});
function updateCriterionAvailability(){document.querySelectorAll('.domain-map').forEach(map=>{const selects=[...map.querySelectorAll('.criterion-select')],selected=selects.map(select=>select.value).filter(Boolean);selects.forEach(select=>[...select.options].forEach(option=>{if(option.value)option.disabled=option.value!==select.value&&selected.includes(option.value)}))})}
document.addEventListener('change',event=>{if(event.target.classList.contains('criterion-select'))updateCriterionAvailability()});document.addEventListener('click',event=>{if(event.target.matches('.add-criterion,.remove-criterion'))setTimeout(updateCriterionAvailability,0)});const criterionObserver=new MutationObserver(()=>updateCriterionAvailability()),criterionRoot=document.getElementById('domainMapper');if(criterionRoot)criterionObserver.observe(criterionRoot,{childList:true,subtree:true});
