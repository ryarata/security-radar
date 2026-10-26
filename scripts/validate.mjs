export function validateReport(report){
 if(typeof report.summary!=='string'||!Array.isArray(report.items)||report.items.length>8)throw new Error('レポート形式が不正です');
 if(!report.coverage||typeof report.coverage.x!=='string'||typeof report.coverage.official!=='string')throw new Error('収集範囲がありません');
 for(const item of report.items){
  for(const k of ['id','title','summary','reason','affected','check','action'])if(typeof item[k]!=='string'||!item[k].trim())throw new Error(`必須項目 ${k} がありません`);
  if(!['今日確認','利用確認','動向把握'].includes(item.priority)||!['新規','更新','継続'].includes(item.change)||!['公式確認済み','未確認'].includes(item.verification))throw new Error('分類が不正です');
  if(!Array.isArray(item.tags)||!item.tags.every(t=>typeof t==='string'))throw new Error(`${item.id}: タグの形式が不正です`);
  if(!Array.isArray(item.sources)||!item.sources.length)throw new Error(`${item.id}: 出典がありません`);
  for(const s of item.sources){if(typeof s.title!=='string'||!['公式','X','参考'].includes(s.kind)||new URL(s.url).protocol!=='https:')throw new Error('出典が不正です')}
  if(item.verification==='公式確認済み'&&!item.sources.some(s=>s.kind==='公式'))throw new Error('公式出典がありません');
 }
 return report;
}
