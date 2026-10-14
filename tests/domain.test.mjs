import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize, matchBrand, budgetMatch, escapeHtml } from '../src/domain.mjs';

const now = new Date('2026-10-14T12:00:00Z');
const snapshot = {
  market: 'JP', query: 'BEAMS', provider: 'google-trends',
  providerMode: 'explore_internal', scalingMode: 'query_relative_0_100',
  signalStatus: 'REAL', sourceStatus: 'ok', sourceType: 'live_provider',
  observedAt: '2026-10-13T00:00:00Z',
  timeline: Array.from({length: 16}, (_, i) => ({date:'day '+i, value:i<7?10:20, hasData:true,isPartial:i===15}))
};
test('trusted recent JP timeline preserves partial gap and valid momentum', () => {
  const v=summarize(snapshot,now);
  assert.equal(v.state,'current');
  assert.equal(v.points.at(-1).value,null);
  assert.equal(v.change,75);
});
test('stale snapshots preserve real dates/history but suppress current momentum', () => {
  const v=summarize({...snapshot,observedAt:'2026-09-11T00:00:00Z'},now);
  assert.equal(v.state,'stale');
  assert.equal(v.change,null);
  assert.equal(v.observedAt,'2026-09-11T00:00:00Z');
  assert.equal(v.points[0].value,10);
});
test('fixtures, foreign market and invalid provenance never become JP observations', () => {
  for (const s of [{...snapshot,sourceType:'seed_fixture'},{...snapshot,market:'US'},{...snapshot,scalingMode:'absolute_volume'},{...snapshot,observedAt:'bad'}]) {
    assert.equal(summarize(s,now).state,'unavailable');
  }
  assert.equal(summarize(undefined,now).state,'missing');
});
test('zero previous window is new activity without invented percentage',()=>{
  const v=summarize({...snapshot,timeline:Array.from({length:14},(_,i)=>({date:''+i,value:i<7?0:10}))},now);
  assert.equal(v.change,null); assert.equal(v.newActivity,true);
});
test('non-overlapping price brackets handle all exact boundaries',()=>{
  assert.equal(budgetMatch(5000,'under-5000'),false);
  assert.equal(budgetMatch(5000,'5000-10000'),true);
  assert.equal(budgetMatch(10000,'5000-10000'),false);
  assert.equal(budgetMatch(10000,'10000-30000'),true);
  assert.equal(budgetMatch(30000,'30000-plus'),true);
  assert.equal(budgetMatch(null,'under-5000'),false);
});
test('brand matching supports Unicode aliases and combined filters',()=>{
  const b={name:'BEAMS',jp:'ビームス',aliases:['比姆斯'],styles:['city'],audience:['men','women'],samples:[{price:5170,category:'tops'}]};
  assert.equal(matchBrand(b,{q:'ビームス',style:'city',budget:'5000-10000',gender:'women',category:'tops'}),true);
  assert.equal(matchBrand(b,{q:'比姆斯',style:'outdoor'}),false);
  assert.equal(matchBrand(b,{q:'<script>alert(1)</script>'}),false);
});
test('escaping protects dynamic text and attributes',()=>{
  assert.equal(escapeHtml('"><script>&'), '&quot;&gt;&lt;script&gt;&amp;');
});
