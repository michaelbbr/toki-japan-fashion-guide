import {budgetOptions} from './discovery-options.mjs';
const form=document.querySelector('#budget-entry-form');
if(form){
 const category=form.elements.namedItem('category'),budget=form.elements.namedItem('budget'),gender=form.elements.namedItem('gender');
 function sync(){
  for(const option of category.options){const hidden=gender.value==='men'&&['dress','skirt'].includes(option.value);option.hidden=hidden;option.disabled=hidden||!option.value;}
  if(category.selectedOptions[0]?.hidden)category.value='';
  const previous=budget.value,options=budgetOptions(category.value);
  budget.replaceChildren(...(options.length?[{id:'',name:'選擇這類單件預算'},{id:'all',name:'不限／先看價格'},...options]:[{id:'',name:'先選單品種類'}]).map(x=>new Option(x.name,x.id)));
  budget.options[0].disabled=true;budget.disabled=!options.length;
  budget.value=options.some(x=>x.id===previous)||previous==='all'?previous:'';
 }
 let lastCategory=category.value;
 form.addEventListener('change',()=>{if(category.value!==lastCategory){budget.value='';lastCategory=category.value;}sync();});
 form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const params=new URLSearchParams({category:category.value});if(budget.value!=='all')params.set('budget',budget.value);
  location.assign((gender.value==='all'?'/brands':'/'+gender.value)+'?'+params+'#brand-results');
 });
 sync();
}
