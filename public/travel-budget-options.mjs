// Editorial planning amounts, not fixed brand price tiers or a shopping basket.
export const travelBudgets=[
 {id:'under-10000',name:'¥10,000 以內',note:'先從日常衣服開始',ceiling:10000},
 {id:'10000-30000',name:'¥10,001–30,000',note:'幾件日常，或一件重點',ceiling:30000},
 {id:'30000-60000',name:'¥30,001–60,000',note:'多一些搭配與設計選擇',ceiling:60000},
 {id:'60000-plus',name:'超過 ¥60,000',note:'填入預計總額，安排這趟購物',ceiling:null},
 {id:'all',name:'還沒決定',note:'先認識品牌，再抓預算',ceiling:null}
];
export const shoppingWays=[
 {id:'more',name:'多買幾件',note:'補齊日常衣櫃',count:3,advice:'先用 3 件分配，從平常會穿的衣服挑起。'},
 {id:'fewer',name:'少買、買好一點',note:'挑材質與剪裁',count:2,advice:'先用 2 件分配，試穿時比較布料、剪裁與實寸。'},
 {id:'special',name:'找一件特別的',note:'看看設計與小眾品牌',count:1,advice:'先把預算留給 1 件重點單品，留意設計細節與穿著感。'}
];
