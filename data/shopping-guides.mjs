import {stores as previousStores} from './areas.mjs';
export const shoppingCheckedAt='2026-10-16';
const both=['men','women'];
const profiles={
 beams:{audience:both,styles:['city','americana'],kind:'多標籤選貨店',difference:'先比較日常休閒與不同服裝標籤，適合還不知道自己喜歡什麼的人。',buy:'寬鬆上衣、襯衫與休閒褲；先試平常就會穿的版型。',photo:'beams'},
 auralee:{audience:both,styles:['minimal'],kind:'品牌直營店',difference:'想細看布料、色澤與輪廓，可以把它和 COS 的簡約設計放在一起比較。',buy:'襯衫、針織與長褲；比較觸感、厚度和試穿後的垂墜。',photo:'auralee'},
 goldwin:{audience:both,styles:['outdoor','minimal'],kind:'品牌直營店',difference:'從機能需求挑衣服；可先比較防風、防雨與活動空間，再看外觀。',buy:'機能外套與長褲；先想清楚是城市日常還是戶外活動。',photo:'goldwin'},
 cos:{audience:both,styles:['minimal','smart'],kind:'國際品牌直營店',difference:'喜歡乾淨線條但還不熟日本設計師，可以先用熟悉的品類比較剪裁。',buy:'針織、襯衫與寬褲；和 AURALEE 比較材質、比例及實際標價。',photo:'cos'},
 nanamica:{audience:both,styles:['outdoor','city'],kind:'品牌直營店',difference:'想把機能衣穿進日常，可先看襯衫、大衣的外觀與面料說明。',buy:'Balmacaan Coat 類型的大衣、襯衫與長褲；留意機能與保養。',photo:'nanamica'},
 needles:{audience:['men'],styles:['vintage','mode','americana'],kind:'設計選貨店',difference:'偏好有辨識度的配色、運動褲與美式混搭，可從 NEPENTHES 系列認識設計服。',buy:'先認識 Needles 的 Track Pants 與不同褲型；當店品牌與現貨另問。',photo:'needles'},
 south2:{audience:both,styles:['outdoor','workwear'],kind:'品牌店／選貨空間',difference:'以釣魚、戶外與多口袋輪廓為切入點，適合喜歡戶外混搭的人。',buy:'Tenkara Jacket 類型的多口袋外套與寬褲；比較收納和活動感。',photo:'south2'},
 yamatomichi:{audience:both,styles:['outdoor'],kind:'品牌直營店',difference:'先從輕量健行的用途出發，理解材質、重量與走動時的舒適度。',buy:'先認識 5-Pocket Pants；帶著自己的健行需求請店員介紹。',photo:'yamatomichi'}
};
const enriched=previousStores.map(s=>({...profiles[s.brand],...s,brands:[s.brand],checkedAt:'2026-10-15'}));
for(const s of enriched){
 if(s.id==='beams-harajuku'||s.id==='beams-shibuya'||s.id==='auralee-shinjuku-men')s.audience=['men'];
 if(s.id.includes('women'))s.audience=['women'];
 if(s.id==='beams-sapporo')s.district='大通';
 if(s.id==='beams-harajuku')Object.assign(s,{kind:'BEAMS 主標籤旗艦店',difference:'主標籤偏日常休閒，先用寬鬆上衣、襯衫和長褲認識輪廓。其他支線各有不同的方向與販售門市。',scope:'男裝休閒；現行官方標籤清單列 BEAMS。其他支線請選對門市。'});
 if(s.id==='beams-shibuya')Object.assign(s,{brands:['beams','beamsplus'],scope:'男裝；官方列 BEAMS、BEAMS PLUS、BEAMS T 等。',checkedAt:shoppingCheckedAt});
 if(['beams-fukuoka','beams-sapporo','beams-harajuku','beams-umeda','beams-kyoto','auralee-tokyo'].includes(s.id))s.checkedAt=shoppingCheckedAt;
}
const store=(id,brand,city,district,name,address,source,extra={})=>({id,brand,city,district,name,address,source,...profiles[brand],brands:[brand],checkedAt:shoppingCheckedAt,...extra});
const goldwin='https://jp.goldwin.global/pages/shoplist';
const nepenthes='https://nepenthes.co.jp/stores/';
const ark='https://www.arknets.co.jp/store/storelist/';
const beamsLabels=['beams','beamsplus','raybeams','beamsboy','beamsf','brilla_per_il_gusto','demiluxebeams'];
for(const s of enriched)if(['beams-fukuoka','beams-sapporo','beams-umeda','beams-kyoto'].includes(s.id)){
 s.brands=beamsLabels;
 s.scope='男裝：BEAMS、BEAMS PLUS、BEAMS F 等；女裝：Ray BEAMS、BEAMS BOY、Demi-Luxe BEAMS 等。各店完整標籤見官方。';
}
const newStores=[
 store('beams-women-harajuku','raybeams','tokyo','原宿','BEAMS WOMEN 原宿','東京都渋谷区神宮前3-25-15 神宮前テラス 1F・B1F','https://www.beams.co.jp/shop/hw/',{...profiles.beams,audience:['women'],photo:'raybeams',brands:['raybeams','beamsboy','internationalgallerybeams'],scope:'女裝門市；Ray BEAMS、BEAMS BOY、International Gallery BEAMS 等。',difference:'想看女裝可以直接來這家。Ray BEAMS 偏流行混搭，BEAMS BOY 可從美式、工裝的穿法比較。',buy:'上衣、裙裝與寬褲，先比較兩條線的輪廓。'}),
 store('goldwin-harajuku','goldwin','tokyo','原宿','Goldwin Harajuku','東京都渋谷区神宮前6-10-12 Citta 神宮前 1F',goldwin),
 store('cos-aoyama','cos','tokyo','青山','COS 青山','東京都港区南青山4-21-26','https://www.cos.com/ja-jp/aoyama-store'),
 store('nanamica-daikanyama','nanamica','tokyo','代官山','nanamica DAIKANYAMA','東京都渋谷区猿楽町26-13','https://us.nanamica.com/pages/nanamica-daikanyama'),
 store('nepenthes-tokyo','needles','tokyo','神宮前','NEPENTHES TOKYO','東京都渋谷区神宮前5-44-1',nepenthes,{scope:'設計選貨；照片為 Needles 穿搭示例，具體販售品牌請向當店核對。'}),
 store('engineered-tokyo','engineered','tokyo','神宮前','ENGINEERED GARMENTS TOKYO','東京都渋谷区神宮前5-45-12',nepenthes,{audience:['men'],styles:['workwear','americana'],kind:'品牌直營店',photo:'engineered',difference:'比起素色基本款，這裡適合看工作服口袋、拼接和層次怎麼搭。',buy:'先認識 Bedford Jacket；比較多口袋外套和自己常穿的襯衫。'}),
 store('nepenthes-osaka','needles','osaka','京町堀','NEPENTHES OSAKA','大阪府大阪市西区京町堀1-13-16',nepenthes,{scope:'設計選貨；當店販售系列與現貨請向店員確認。'}),
 store('goldwin-kyoto','goldwin','kyoto','三條・柳馬場','Goldwin Kyoto','京都府京都市中京区坂井町460番',goldwin),
 store('yamatomichi-kyoto','yamatomichi','kyoto','五條','山と道 京都','京都府京都市下京区早尾町312-1','https://www.yamatomichi.com/stores/287659',{visit:'官方現列金、土、日 11:00–18:00；出發當日先核對臨時公告與庫存。',hours:'金・土・日 11:00–18:00'}),
 store('nanamica-fukuoka','nanamica','fukuoka','大名','nanamica FUKUOKA','福岡県福岡市中央区大名2-1-14','https://us.nanamica.com/pages/nanamica-fukuoka'),
 store('nepenthes-hakata','needles','fukuoka','博多・店屋町','NEPENTHES HAKATA','福岡県福岡市博多区店屋町2-28 2F',nepenthes,{scope:'設計選貨；當店販售系列與現貨請向店員確認。'}),
 store('beams-nagoya','beams','aichi','榮','BEAMS 名古屋','愛知県名古屋市中区栄3-6-1 ラシック2階','https://www.beams.co.jp/shop/bna/',{brands:beamsLabels,scope:'BEAMS、BEAMS PLUS、Ray BEAMS、BEAMS BOY、BEAMS F 等；完整標籤見官方。'}),
 store('ua-nagoya','united-arrows','aichi','榮','UNITED ARROWS 名古屋','愛知県名古屋市中区栄3-6-1 ラシック2F','https://store.united-arrows.co.jp/brand/ua/stores/ung.html',{audience:both,styles:['smart','minimal'],kind:'選貨店',photo:'united-arrows',difference:'若想找上班也能穿的衣服，可在同一棟樓和 BEAMS 的休閒方向比較。',buy:'襯衫、針織與俐落長褲；比較肩線、褲長及正式程度。'}),
 store('goldwin-sapporo','goldwin','hokkaido','大通','Goldwin Sapporo','北海道札幌市中央区南1条西4丁目1番地1 4PLA 2F',goldwin),
 store('south2-sapporo','south2','hokkaido','南2西8','SOUTH2 WEST8 SAPPORO','北海道札幌市中央区南2条西8丁目2-1',nepenthes),
 store('ark-utsunomiya','neighborhood','tochigi','傳馬町','ARK','栃木県宇都宮市伝馬町3-19',ark,{audience:['men'],styles:['street'],kind:'ARKnets 系列選貨店',photo:'neighborhood',brands:['neighborhood','wtaps','wackomaria'],difference:'同屬 ARKnets，但這家從街頭方向看，與下面的設計師選貨、機能服分開。',buy:'先比較 WTAPS、NEIGHBORHOOD、WACKO MARIA 的圖像與輪廓。',scope:'官方列出 WTAPS、NEIGHBORHOOD、WACKO MARIA 等；不同分店品牌不同。'}),
 store('ripe-ark','comoli','tochigi','西1丁目','RIPE ARK','栃木県宇都宮市西1-3-6',ark,{audience:['men'],styles:['minimal','mode'],kind:'ARKnets 系列選貨店',photo:'comoli',brands:['comoli','lemaire','maisonmargiela'],difference:'想從面料、份量與設計師服裝比較，可把這家當作 ARKnets 的另一個起點。',buy:'COMOLI、LEMAIRE 的襯衫與長褲，先看試穿比例。',scope:'官方列出 Maison Margiela、LEMAIRE、COMOLI 等。'}),
 store('pier-lounge-ark','daiwapier39','tochigi','西1丁目','Pier Lounge by ARK','栃木県宇都宮市西1-2-1 1F・2F',ark,{audience:['men'],styles:['outdoor','city'],kind:'ARKnets 系列選貨店',photo:'daiwapier39',brands:['daiwapier39','goldwin','patagonia','nanamica','purple-label'],difference:'想在一間店比較城市機能服，可從 DAIWA PIER39、Goldwin、nanamica 看起。',buy:'機能長褲、口袋襯衫與輕外套；分清品牌及用途。',scope:'官方列出 DAIWA PIER39、Goldwin、patagonia、nanamica、THE NORTH FACE PURPLE LABEL。'}),
 store('dear-ark','clane','tochigi','傳馬町','DEAR BY ARK','栃木県宇都宮市伝馬町3-24',ark,{audience:['women'],styles:['minimal','city'],kind:'ARKnets 系列女裝選貨店',photo:'clane',brands:['clane','graphpaper','batoner','arcteryx'],difference:'ARKnets 的女裝入口，和 ARK 等男裝分店分開。',buy:'先比較 CLANE 的輪廓與 BATONER 的針織。',scope:'官方列為 WOMEN；列出 CLANE、Graphpaper、BATONER 等。'}),
 store('yamatomichi-kamakura','yamatomichi','kamakura','由比濱','山と道 鎌倉','神奈川県鎌倉市由比ヶ浜2丁目5-19','https://www.yamatomichi.com/stores/14741',{visit:'現行店址在由比濱，別導航至舊材木座店。官方現列金、土、日 11:00–18:00；臨時公告及活動規則另查。',hours:'金・土・日 11:00–18:00'})
];
// Catalog links are limited to existing guides; the official scope text also names other stocked labels.
export const shoppingStores=[...enriched,...newStores].map(s=>({...s,brand:s.brand==='daiwapier39'?'daiwa-pier39':s.brand,photo:s.photo==='daiwapier39'?'daiwa-pier39':s.photo,brands:s.brands.map(id=>id==='daiwapier39'?'daiwa-pier39':id==='arcteryx'?'arc-teryx':id).filter(id=>!['internationalgallerybeams','lemaire','maisonmargiela'].includes(id))}));
export const shoppingCities=[
 {id:'tokyo',name:'東京',en:'TOKYO',major:true,teaser:'原宿入門、青山簡約、代官山機能',intro:'先從原宿幾家風格不同的店開始；喜歡簡約或設計感，再換一個街區深入逛。',start:['beams-harajuku','beams-women-harajuku','goldwin-harajuku'],routes:[['harajuku','原宿入門','日常休閒、女裝混搭、機能服，先比較三個方向。',['beams-harajuku','beams-women-harajuku','goldwin-harajuku']],['aoyama','青山・簡約','COS 與 AURALEE：都乾淨，從材質和剪裁看差別。',['cos-aoyama','auralee-tokyo']],['jingumae','神宮前・設計選貨','NEPENTHES 與 ENGINEERED GARMENTS，從混搭到工裝。',['nepenthes-tokyo','engineered-tokyo']],['daikanyama','代官山・日常機能','想把機能融入日常，從 nanamica 開始。',['nanamica-daikanyama']],['shinjuku','新宿','車站周邊選貨與 AURALEE 男女裝櫃位。',['beams-shinjuku','auralee-shinjuku-men','auralee-shinjuku-women']]]},
 {id:'osaka',name:'大阪',en:'OSAKA',major:true,teaser:'梅田選貨、女裝質感、京町堀設計',intro:'第一次可從梅田開始比較休閒與質感女裝；想看設計選貨再前往京町堀。這兩區分開安排交通。',start:['beams-umeda','auralee-umeda-women','nepenthes-osaka']},
 {id:'kyoto',name:'京都',en:'KYOTO',major:true,teaser:'三條日常、機能直營、五條輕量健行',intro:'三條周邊先看日常服與 Goldwin；對輕量健行有興趣，再另外安排五條的山と道。',start:['beams-kyoto','goldwin-kyoto','yamatomichi-kyoto']},
 {id:'fukuoka',name:'福岡',en:'FUKUOKA',major:true,teaser:'天神入門、大名機能、博多設計選貨',intro:'先比較天神的多標籤選貨和大名的日常機能；NEPENTHES HAKATA 在店屋町，需另外前往。',start:['beams-fukuoka','nanamica-fukuoka','nepenthes-hakata']},
 {id:'aichi',slug:'nagoya',name:'名古屋',en:'NAGOYA',major:true,teaser:'先在榮比較休閒與俐落通勤',intro:'還不熟品牌，就先從榮的 LACHIC 開始。同一棟樓的 BEAMS 與 UNITED ARROWS，可以比較休閒和俐落的穿衣方向。',start:['beams-nagoya','ua-nagoya']},
 {id:'hokkaido',slug:'sapporo',name:'札幌',en:'SAPPORO',major:true,teaser:'大通日常、Goldwin、SOUTH2 WEST8',intro:'大通周邊先看日常服和機能服；喜歡釣魚、戶外混搭，再往南2西8的品牌店逛。',start:['beams-sapporo','goldwin-sapporo','south2-sapporo']},
 {id:'tochigi',slug:'utsunomiya',name:'宇都宮・栃木',en:'UTSUNOMIYA',major:false,teaser:'為了 ARKnets：依選貨方向挑分店',intro:'ARKnets 是多間風格不同的選貨店，不能只搜尋一個總店名。先決定街頭、設計師、機能或女裝，再選實際分店。',start:['ark-utsunomiya','ripe-ark','pier-lounge-ark','dear-ark']},
 {id:'kamakura',name:'鎌倉',en:'KAMAKURA',major:false,teaser:'為了山と道：了解輕量健行的衣服',intro:'如果本來就在鎌倉旅行，或想實際了解山と道，可以安排由比濱的直營店；先確認營業日。',start:['yamatomichi-kamakura']}
];
export const citySlug=c=>c.slug||c.id;
export const findCity=id=>shoppingCities.find(c=>c.id===id||citySlug(c)===id);
export const storeHasBrand=(s,id)=>s.brands.includes(id);
