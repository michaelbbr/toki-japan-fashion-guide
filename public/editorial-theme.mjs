const photoToggle=document.querySelector('#photo-color-toggle');
if(photoToggle){
 let original=false;
 try{original=sessionStorage.getItem('toki-photo-color')==='original';}catch{}
 function apply(){
  document.documentElement.dataset.photoColor=original?'original':'editorial';
  photoToggle.setAttribute('aria-pressed',String(original));
  photoToggle.title=original?'目前顯示原色；按下切換黑白照片':'目前顯示黑白；按下查看衣服原色';
 }
 photoToggle.addEventListener('click',()=>{original=!original;apply();try{sessionStorage.setItem('toki-photo-color',original?'original':'editorial');}catch{}});
 apply();
}
