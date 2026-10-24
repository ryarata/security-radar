let report,priority='all';
const $=id=>document.getElementById(id);
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n};
const fmt=value=>new Date(value).toLocaleString('ja-JP',{timeZone:'Asia/Tokyo',hour12:false});
async function json(path){const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw new Error(`取得失敗 (${r.status})`);return r.json()}
function render(){
 $('date').textContent=report.date||'初回収集待ち';$('updated').textContent=report.generatedAt?`収集日時 ${fmt(report.generatedAt)} JST`:'毎朝10時ごろ更新';$('summary').textContent=report.summary;
 for(const [id,p] of [['urgent','今日確認'],['check','利用確認'],['trend','動向把握']])$(id).textContent=report.items.filter(x=>x.priority===p).length;
 $('coverage').replaceChildren(...Object.entries(report.coverage||{}).map(([k,v])=>el('p',`${k==='x'?'X検索':'公式情報'}：${v}`)));
 const query=$('search').value.toLowerCase();const items=report.items.filter(i=>(priority==='all'||i.priority===priority)&&JSON.stringify(i).toLowerCase().includes(query));
 $('items').replaceChildren();
 if(!items.length){$('items').append(el('div',report.generatedAt?'表示する項目がありません。収集範囲や絞り込み条件も確認してください。':'初回の情報収集を待っています。実際の調査結果が取得されると、ここに表示されます。','empty'));return}
 for(const i of items){const card=el('article',undefined,`card ${i.priority==='今日確認'?'urgent':i.priority==='利用確認'?'check':''}`);const meta=el('div',undefined,'meta');meta.append(el('span',i.priority,'badge priority'),el('span',i.change,'badge'),el('span',i.verification),...i.tags.map(t=>el('span',t,'badge')));card.append(meta,el('h2',i.title),el('p',i.summary,'description'),el('p',i.reason,'reason'));const details=el('details');details.append(el('summary','影響範囲・確認方法・対応を読む'));const dl=el('dl');for(const [k,v]of [['該当判定','未判定：利用環境での確認が必要'],['影響範囲',i.affected],['確認方法',i.check],['対応方法',i.action]])dl.append(el('dt',k),el('dd',v));details.append(dl);const sources=el('div',undefined,'sources');for(const s of i.sources){try{if(new URL(s.url).protocol!=='https:')continue;const a=el('a',`${s.kind} · ${s.title} ↗`);a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';sources.append(a)}catch{}}details.append(sources);card.append(details);$('items').append(card)}
}
document.querySelectorAll('[data-priority]').forEach(b=>b.addEventListener('click',()=>{priority=b.dataset.priority;document.querySelectorAll('[data-priority]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});render()}));
$('search').addEventListener('input',()=>report&&render());
$('archive').addEventListener('change',async()=>{try{report=await json($('archive').value==='latest'?'data/latest.json':`data/reports/${$('archive').value}.json`);render()}catch(e){$('status').textContent=e.message;$('status').className='error'}});
async function start(){try{const [data,status,archive]=await Promise.all([json('data/latest.json'),json('data/status.json'),json('data/archive.json')]);report=data;for(const date of archive){const o=el('option',date);o.value=date;$('archive').append(o)}const stale=data.generatedAt&&Date.now()-new Date(data.generatedAt)>36*3600000;$('status').textContent=status.state==='error'?`収集エラー：${status.message}。前回成功時のレポートを表示しています。`:stale?'更新が36時間以上ありません。GitHub Actionsの実行状況を確認してください。':status.state==='ok'?`収集完了 · ${status.message} · 環境への該当有無は各項目で確認してください。`:status.message;$('status').className=status.state==='error'||stale?'error':'';render()}catch(e){$('status').textContent=`レポートを読み込めませんでした：${e.message}`;$('status').className='error'}}start();
