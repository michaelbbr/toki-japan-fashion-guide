export const itemTypes=[
 {id:'tshirt',name:'T-shirt／衛衣',note:'棉T、長袖T、衛衣',cuts:[3000,6000,10000]},
 {id:'shirt',name:'襯衫／罩衫',note:'扣襯衫、襯衫式上衣',cuts:[5000,10000,20000]},
 {id:'knitwear',name:'針織／毛衣',note:'毛衣、針織開襟衫',cuts:[8000,15000,30000]},
 {id:'bottoms',name:'褲子',note:'丹寧、休閒褲、西裝褲',cuts:[5000,10000,20000]},
 {id:'outerwear',name:'外套／大衣',note:'夾克、羽絨、大衣',cuts:[10000,20000,40000]},
 {id:'dress',name:'洋裝',note:'連身裙、連身洋裝',cuts:[8000,15000,30000]},
 {id:'skirt',name:'裙子',note:'長裙、短裙',cuts:[5000,10000,20000]},
 {id:'shoes',name:'鞋子',note:'球鞋、戶外鞋與日常鞋履',cuts:[10000,20000,30000]},
 {id:'bags',name:'包袋',note:'背包、托特包與肩背包',cuts:[10000,30000,60000]}
];
export const styleOptions=[
 ['city','City Casual','城市休閒','寬鬆日常、襯衫與輕鬆層次。','beams','muji'],
 ['minimal','Minimal','簡約乾淨','素色、簡潔線條與材質。','aton','muji'],
 ['outdoor','Outdoor','戶外機能','機能外套、口袋與戶外混搭。','mont-bell','andwander'],
 ['street','Street','街頭','圖像、寬鬆輪廓與街頭層次。','neighborhood','jeanasis'],
 ['athleisure','Athleisure','運動休閒','衛衣、運動長褲與輕鬆活動的日常搭配。','lululemon','emmi'],
 ['workwear','Workwear','工裝軍裝','工作服、軍裝口袋與實用細節。','engineered','beamsboy'],
 ['americana','Americana','美式休閒','美式襯衫、丹寧、經典休閒。','beamsplus','rhodolirion'],
 ['vintage','Vintage Mix','復古混搭','復古配色與有年代感的搭配。','needles','lilybrown'],
 ['mode','Mode','設計感／黑色系','寬大輪廓、不對稱與設計細節。','ssstein','issey'],
 ['natural','Natural','自然舒適','柔和色調、寬鬆與生活感。','orcival','muji'],
 ['smart','Smart Casual','俐落通勤','襯衫、西裝褲與乾淨的搭配。','unitedtokyo','mila-owen'],
 ['feminine','Feminine','都會柔美','柔和線條、抓皺與精緻細節。',null,'snidel'],
 ['girly','Girly','甜美浪漫','蕾絲、荷葉邊與浪漫層次。',null,'lilybrown']
].map(([id,name,zh,note,men,women])=>({id,name,zh,note,examples:{men,women,all:men||women},cell:1}));
// Editorial discovery tags, not an official definition of every item from a brand.
export const extraStyleTags={
 street:['jeanasis','rageblue','needles','south2','hare','raybeams'],
 athleisure:['emmi'],
 workwear:['beams','engineered','south2','danton','gramicci','beamsboy','beamsplus','freaks-store','journal-standard'],
 americana:['beams','beamsplus','freaks-store','journal-standard','engineered','rhodolirion','ships','bayflow'],
 vintage:['needles','rhodolirion','lilybrown','nikoand','beamsboy','beamsplus','journal-standard','freaks-store'],
 mode:['ssstein','issey','hare','cullni','beautifulpeople','yoke','clane','unitedtokyo','publictokyo'],
 natural:['muji','orcival','lepsim','nikoand','globalwork','danton','sm2','studioclip'],
 smart:['united-arrows','unitedtokyo','publictokyo','mila-owen','ships','greenlabel','beautyandyouth','demiluxebeams','effebeams','beamsf','brilla_per_il_gusto','coen','iena','edifice'],
 girly:['snidel','lilybrown','lowrysfarm','rhodolirion','frayid','celford','raybeams']
};
export const prefectureGroups=[
 ['北海道',[['hokkaido','北海道（札幌・小樽等）']]],
 ['東北',[['aomori','青森'],['iwate','岩手'],['miyagi','宮城（仙台）'],['akita','秋田'],['yamagata','山形'],['fukushima','福島']]],
 ['關東',[['tokyo','東京'],['kanagawa','神奈川（橫濱・箱根）'],['chiba','千葉'],['saitama','埼玉'],['ibaraki','茨城'],['tochigi','栃木'],['gunma','群馬']]],
 ['中部',[['niigata','新潟'],['toyama','富山'],['ishikawa','石川（金澤）'],['fukui','福井'],['yamanashi','山梨'],['nagano','長野'],['gifu','岐阜'],['shizuoka','靜岡'],['aichi','愛知（名古屋）'],['mie','三重']]],
 ['關西',[['shiga','滋賀'],['kyoto','京都'],['osaka','大阪'],['hyogo','兵庫（神戶）'],['nara','奈良'],['wakayama','和歌山']]],
 ['中國・四國',[['tottori','鳥取'],['shimane','島根'],['okayama','岡山'],['hiroshima','廣島'],['yamaguchi','山口'],['tokushima','德島'],['kagawa','香川（高松）'],['ehime','愛媛'],['kochi','高知']]],
 ['九州',[['fukuoka','福岡（博多・天神）'],['saga','佐賀'],['nagasaki','長崎'],['kumamoto','熊本'],['oita','大分'],['miyazaki','宮崎'],['kagoshima','鹿兒島']]],
 ['沖繩',[['okinawa','沖繩（那霸等）']]]
];
export const destinations=prefectureGroups.flatMap(([region,list])=>list.map(([id,name])=>({id,name,region})));
export function budgetOptions(category){
 const item=itemTypes.find(x=>x.id===category);if(!item)return [];
 const [a,b,c]=item.cuts,n=n=>'¥'+n.toLocaleString('en-US');
 return [{id:'under-'+a,name:'低於 '+n(a)},{id:a+'-'+b,name:n(a)+'–未滿 '+n(b)},{id:b+'-'+c,name:n(b)+'–未滿 '+n(c)},{id:c+'-plus',name:n(c)+' 以上'}];
}
