import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateReport} from '../scripts/validate.mjs';
const item={id:'test',title:'test',summary:'s',reason:'r',affected:'a',check:'c',action:'a',priority:'利用確認',change:'新規',verification:'未確認',tags:['Ruby'],sources:[{title:'source',url:'https://example.org/advisory',kind:'参考'}]};
const report=()=>({summary:'test',coverage:{x:'searched',official:'searched'},items:[structuredClone(item)]});
test('requires evidence for official verification',()=>{const r=report();r.items[0].verification='公式確認済み';assert.throws(()=>validateReport(r));});
test('rejects executable source URLs',()=>{const r=report();r.items[0].sources[0].url='javascript:alert(1)';assert.throws(()=>validateReport(r));});
test('accepts valid unconfirmed findings and empty results',()=>{assert.ok(validateReport(report()));const r=report();r.items=[];assert.ok(validateReport(r));});
