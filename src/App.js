import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, ExternalLink, Menu, X, ChevronRight, 
  Wind, Coffee, Mountain, ShoppingBag, Calendar, 
  Plane, Bed, Car, Shirt, Snowflake, Utensils, AlertCircle,
  ThermometerSun, Edit3, Save, Info, CheckCircle
} from 'lucide-react';

// --- 背景紋理 ---
const JapaneseTexture = () => (
  <div className="fixed inset-0 pointer-events-none z-0" 
       style={{ 
         // 📷 [背景更換] 修正路徑：指向 public/images/sea.jpg
         backgroundImage: 'url("/images/sea.jpg")', 
         backgroundSize: 'cover',
         backgroundPosition: 'center',
         backgroundRepeat: 'no-repeat',
         opacity: 0.15 
       }}>
  </div>
);

// --- 📍 資料設定區 (DATA) ---
const INFO_DATA = {
  flights: [
    { 
      id: 'outbound', title: '去程：台北 (TPE) - 濟州 (CJU)', date: '12月4日 (週四)', time: '02:50 - 06:05', duration: '2小時 15分', 
      // 📷 [圖片更換] 建議路徑: /images/flight_out.jpg
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop' 
    },
    { 
      id: 'inbound', title: '回程：濟州 (CJU) - 台北 (TPE)', date: '12月8日 (週一)', time: '22:15 - 23:50', duration: '2小時 35分', 
      // 📷 [圖片更換] 建議路徑: /images/flight_in.jpg
      image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=2070&auto=format&fit=crop' 
    }
  ],
  hotels: [
    { name: '第一晚住宿', engName: 'Jeju West Coast Stay', checkIn: '12/04 16:00後', checkOut: '12/05 11:00前', address: 'Jeju Island Jeju-si Aewol Coastal-ro 21104', nights: 1, link: 'https://naver.me/xAAnhla2' },
    { name: 'Heyy Seogwipo Hotel', engName: 'Heyy Seogwipo', checkIn: '12/05 16:00後', checkOut: '12/06 11:00前', address: '西歸浦市區', nights: 1, link: 'https://map.naver.com/p/search/헤이서귀포' },
    { name: 'Urbanstay Jeju', engName: 'Urbanstay Jeju City', checkIn: '12/06 16:00後', checkOut: '12/08 11:00前', address: '濟州市區', nights: 2, link: 'https://map.naver.com/p/search/어반스테이제주연동' }
  ],
  carRental: { orderId: '1359039416311386', period: '12/04 07:00 - 12/08 20:00 (共五天)', location: 'Jeju AutoHouse', address: '92 Yonghae-ro, Jeju-do', transport: '有接駁車', items: ['護照', '台灣駕照', '國際駕照', '信用卡(建議兩張)'], link: 'https://map.naver.com/p/search/롯데렌터카제주오토하우스' },
  packing: ['護照', '駕照(台/國際)', '台幣/信用卡', '轉接頭', '手機/3C', '換洗衣物', '拖鞋/布鞋', '牙刷牙膏', '常備藥', '雨具', '生理用品'],
  clothing: {
    tips: '12月的濟州島海風非常強勁，雖然氣溫顯示可能在 5-13度，但體感溫度往往接近 0度，且容易有濕冷的感覺。',
    layers: [
      { part: '外層', item: '防風厚外套/長版羽絨', note: '這層最重要，一般的毛呢大衣如果不防風，在海邊會很痛苦。' },
      { part: '中層', item: '毛衣、厚衛衣 (大學T)', note: '進室內有暖氣，建議方便穿脫。' },
      { part: '內層', item: '發熱衣、保暖內衣', note: '貼身保暖必備。' },
      { part: '下身', item: '內刷毛長褲/厚褲襪', note: '牛仔褲若不防風會變冰棒，建議內搭褲襪。' },
      { part: '配件', item: '毛帽、圍巾、手套', note: '風大吹頭容易痛，毛帽是救星。' }
    ]
  }
};

const HIKING_DATA = {
  // 📷 [圖片更換] 建議路徑: /images/hiking_main.jpg
  rental: { shop: 'Oshare (裝備店)', link: 'https://map.naver.com/p/search/오쉐어', time: '12/7 19:00 - 12/8 19:00', note: '請務必準時歸還，建議先在官網預約。' },
  route: { name: '漢拏山 (御里牧上 - 靈室下)', desc: '這是一條「非登頂」路線，但風景被公認是漢拏山最美的。比起登頂的城板岳路線，這裡人潮較少，且能欣賞到壯觀的屏風岩與威瑟岳雪景。', distance: '12.6 KM', duration: '5.5 ~ 6 小時', temp: '0°C 至 -10°C (體感極低)' },
  gear: [
    { item: '頭部', desc: '毛帽 (必備)、圍脖 (比圍巾好用，不會被風吹散)' },
    { item: '上身內層', desc: '排汗衣/發熱衣 (絕對不要穿棉質，流汗濕了會失溫)' },
    { item: '上身中層', desc: '刷毛衣 (Fleece) 或輕薄羽絨背心' },
    { item: '上身外層', desc: '防風防水外套 (硬殼) - 最重要！擋風！' },
    { item: '下身', desc: '內刷毛防風登山褲 或 運動緊身褲+短褲 (裡面加保暖層)' },
    { item: '足部', desc: '厚羊毛襪 (建議多備一雙)、高筒防水登山鞋、冰爪 (必備)' },
    { item: '補給品', desc: '水(1.5-2L)、能量棒、飯捲、麵包 (避難所無餐食，需自帶)' }
  ]
};

const SCHEDULE_DATA = {
  day1: {
    id: 'day1', date: '12/04', title: '抵達 + Aewol 西岸放鬆',
    // 📷 [圖片更換] 建議路徑: /images/day1_banner.jpg
    banner: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=2070&auto=format&fit=crop',
    route: [
      { 
        time: '06:05', title: '抵達', place: '濟州國際機場', note: '出關領行李，準備開始旅程', link: 'https://map.naver.com/p/search/제주국제공항', 
        desc: '抵達後請先連上機場 Wi-Fi。出關後跟隨指示牌前往租車接駁區 (Rent-a-car Shuttle)。', tips: ['機場便利商店可先買水或 T-money 卡', '廁所建議先上'], 
        // 📷 [圖片更換] 建議路徑: /images/airport.jpg
        image: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?q=80&w=2000&auto=format&fit=crop' 
      },
      { time: '07:00', title: '租車', place: 'LOTTE Rent-a-Car', note: '搭乘接駁車前往 Auto House', link: 'https://map.naver.com/p/search/롯데렌터카제주오토하우스', desc: '濟州島最大的租車公司之一。抵達後請抽取號碼牌，準備好護照、台灣駕照、國際駕照與信用卡。', tips: ['請務必檢查車輛外觀並錄影', '確認燃油種類 (汽油/柴油/LPG)'], image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop' },
      { time: '08:30', title: '咖啡放鬆', place: 'Bomnal Café', note: '韓劇《心情好又暖》拍攝地', link: 'https://map.naver.com/p/search/봄날카페', desc: '位於涯月邑咖啡街的起點，擁有無敵海景。這裡的柯基犬是鎮店之寶。', tips: ['戶外座位風大，請拉緊外套', '建議點熱拿鐵暖身'], image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2000&auto=format&fit=crop' },
      { time: '10:30', title: '散步拍照', place: '協載海灘', note: '濟州島最美的果凍海', link: 'https://map.naver.com/p/search/협재해수욕장', desc: '以其獨特的祖母綠海水顏色聞名，對面就是飛揚島。退潮時可以走到很遠的地方。', tips: ['這裡風沙較大，注意相機鏡頭', '推薦與堆疊的許願石合照'], image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=2000&auto=format&fit=crop' },
      { time: '12:30', title: '午餐', place: 'Aewol 附近', note: '自由選擇，詳見下方美食推薦', link: '', desc: '涯月邑有許多海鮮拉麵與黑豬肉餐廳，是覓食的好地方。', tips: [], image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2000&auto=format&fit=crop' },
      { time: '20:00', title: '入住', place: '第一晚住宿', note: 'Aewol Coastal-ro', link: 'https://map.naver.com/p/search/제주애월해안로21104', desc: '第一晚入住西岸海景民宿，聽著海浪聲入睡。', tips: ['請確認 Check-in 密碼或櫃檯時間'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop' },
    ],
    food: [
      { 
        name: 'Nolman 海鮮拉麵', desc: '無限挑戰拍攝地，湯頭鮮甜，海鮮給得很大方。', link: 'https://map.naver.com/p/search/놀맨', 
        // 📷 [圖片更換] 建議路徑: /images/nolman.jpg
        image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?q=80&w=2000&auto=format&fit=crop', 
        tips: ['需抽取號碼牌', '只收現金 (建議確認)'] 
      },
      { name: 'Crab Jack', desc: '美式手抓海鮮，將滿滿的海鮮倒在桌上，視覺效果滿分。', link: 'https://map.naver.com/p/search/크랩잭', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2000&auto=format&fit=crop', tips: ['提供木槌敲螃蟹，舒壓好吃'] }
    ],
    cafe: [
      { 
        name: 'Cafe Knotted', desc: '首爾超人氣甜甜圈的濟州分店，擁有可愛的戶外庭園。', link: 'https://map.naver.com/p/search/노티드제주', 
        // 📷 [圖片更換] 建議路徑: /images/knotted.jpg
        image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2000&auto=format&fit=crop', 
        tips: ['通常需要排隊', '濟州限定綠茶口味必點'] 
      },
      { name: 'Tribe', desc: '以可愛的造型馬卡龍與舒芙蕾鬆餅聞名。', link: 'https://map.naver.com/p/search/트라이브', image: 'https://images.unsplash.com/photo-1529385075673-4e4b52c0879f?q=80&w=2000&auto=format&fit=crop', tips: [] }
    ],
    backup: [
      { 
        name: 'Arte Museum', desc: '韓國最大的沉浸式光影藝術展，雨天首選備案。', link: 'https://map.naver.com/p/search/아르떼뮤지엄제주', 
        // 📷 [圖片更換] 建議路徑: /images/arte.jpg
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2000&auto=format&fit=crop', 
        tips: ['館內較暗，走路小心', 'Wave 展區非常壯觀'] 
      }
    ]
  },
  day2: {
    id: 'day2', date: '12/05', title: '9.81 Park → 綠茶 → 西歸浦',
    banner: 'https://images.unsplash.com/photo-1570535384203-999990818c39?q=80&w=2046&auto=format&fit=crop',
    route: [
      { time: '09:00', title: '前往', place: '9.81 Park', note: '全球首座重力賽車主題公園', link: 'https://map.naver.com/p/search/9.81파크', desc: '不使用引擎，僅靠重力加速度俯衝的賽車體驗。車上會自動錄影。', tips: ['不能穿拖鞋/高跟鞋 (現場有賣鞋套)', '建議下載 9.81 App 綁定票券'], image: 'https://images.unsplash.com/photo-1570535384203-999990818c39?q=80&w=2000&auto=format&fit=crop' },
      { time: '12:40', title: '午餐', place: '濟州堂', note: 'Jejudang Bakery Cafe', link: 'https://map.naver.com/p/search/제주당베이커리', desc: '近期爆紅的大型農倉風格烘焙咖啡廳，空間開闊。', tips: ['洋蔥麵包是招牌', '適合拍照的角落很多'], image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2000&auto=format&fit=crop' },
      { time: '15:00', title: '觀光', place: 'O’Sulloc 綠茶博物館', note: 'Innisfree House 也在旁邊', link: 'https://map.naver.com/p/search/오설록티뮤지엄', desc: '韓國著名的茶葉品牌博物館。旁邊的 Innisfree 濟州屋可以製作手工皂。', tips: ['必吃綠茶冰淇淋與綠茶捲', '戶外茶園小心泥土'], image: 'https://images.unsplash.com/photo-1571506165871-ee72a35bc3d4?q=80&w=2000&auto=format&fit=crop' },
      { time: '17:30', title: '入住', place: 'Heyy Seogwipo', note: '西歸浦市區飯店', link: 'https://map.naver.com/p/search/헤이서귀포', desc: '位於西歸浦市中心，設計簡約現代，距離偶來市場步行可達。', tips: ['大廳有提供旅遊資訊'], image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2000&auto=format&fit=crop' },
      { time: '18:00', title: '晚餐', place: '每日偶來市場', note: '體驗濟州夜市小吃', link: 'https://map.naver.com/p/search/서귀포매일올레시장', desc: '西歸浦最大的傳統市場。中間有水道座位區，買了小吃可以直接坐著吃。', tips: ['推薦橘子麻糬、黑豬肉捲、蒜味炸雞'], image: 'https://images.unsplash.com/photo-1533920145389-d08019741817?q=80&w=2000&auto=format&fit=crop' }
    ],
    food: [
      { name: '偶來市場 橘子麻糬', desc: '現做的麻糬包入整顆濟州橘子，酸甜多汁。', link: 'https://map.naver.com/p/search/서귀포매일올레시장', image: 'https://images.unsplash.com/photo-1634547372295-82736b47f074?q=80&w=2000&auto=format&fit=crop', tips: [] },
      { name: '炸黑豬肉捲', desc: '類似春捲，裡面包著黑豬肉與蔬菜。', link: '', image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=2000&auto=format&fit=crop', tips: [] },
    ],
    cafe: [
      { name: 'Innisfree House', desc: '就在綠茶博物館旁，大片落地窗看茶園。', link: 'https://map.naver.com/p/search/이니스프리제주하우스', image: 'https://images.unsplash.com/photo-1621245033722-1925b6a7a726?q=80&w=2000&auto=format&fit=crop', tips: [] },
    ],
    backup: [
      { name: '大浦柱狀節理帶', desc: '大自然的鬼斧神工，六角形的石柱群直插入海。', link: 'https://map.naver.com/p/search/주상절리대', image: 'https://images.unsplash.com/photo-1629202758155-22b3543d463d?q=80&w=2000&auto=format&fit=crop', tips: ['需購買門票', '風非常大'] }
    ]
  },
  day3: {
    id: 'day3', date: '12/06', title: 'Day 3: 牛島 & 城山',
    banner: 'https://images.unsplash.com/photo-1549887552-93f8efb4133f?q=80&w=2070&auto=format&fit=crop',
    // ✅ 修正：統一改為 route
    route: [
      { time: '08:00', title: '出發', place: '城山港', note: '前往牛島的碼頭', link: 'https://map.naver.com/p/search/성산포항종합여객터미널', desc: '請在此填寫乘船申報單 (一式兩份，來回各一張)，並連同護照、現金購買船票。', tips: ['一定要帶護照！', '確認末班船時間'], image: 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?q=80&w=2000&auto=format&fit=crop' },
      { time: '10:20', title: '環島', place: '牛島 Udo', note: '租電動車/腳踏車', link: 'https://map.naver.com/p/search/우도', desc: '濟州的離島，海水清澈見底。租一台可愛的電動車環島是最好的方式。', tips: ['租車需出示國際駕照', '推薦西濱白沙、下古水洞海灘'], image: 'https://images.unsplash.com/photo-1549887552-93f8efb4133f?q=80&w=2000&auto=format&fit=crop' },
      { time: '16:00', title: '景點', place: '城山日出峰', note: '世界自然遺產', link: 'https://map.naver.com/p/search/성산일출봉', desc: '巨大的火山噴發口。如果不爬到頂，旁邊的免費步道也能拍到很美的側面與海景。', tips: ['登頂約需 20-30 分鐘 (階梯多)', '每月第一個週一公休 (請確認)'], image: 'https://images.unsplash.com/photo-1629202758155-22b3543d463d?q=80&w=2000&auto=format&fit=crop' },
      { time: '18:20', title: '領裝備', place: 'Oshare', note: '位於機場附近', link: 'https://map.naver.com/p/search/오쉐어', desc: '領取預約好的登山裝備。請現場試穿確認尺寸合適。', tips: ['檢查冰爪是否有生鏽或損壞', '確認歸還時間'], image: 'https://images.unsplash.com/photo-1517172049103-67f0803c4f74?q=80&w=2000&auto=format&fit=crop' },
      { time: '19:10', title: '入住', place: 'Urbanstay Jeju', note: '濟州市區', link: 'https://map.naver.com/p/search/어반스테이제주연동', desc: '位於蓮洞商圈，交通方便，樓下就有便利商店與餐廳。', tips: [], image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2000&auto=format&fit=crop' }
    ],
    food: [
      { name: '牛島花生冰淇淋', desc: '牛島特產花生粉灑在冰淇淋上，香氣濃郁。', link: '', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=2000&auto=format&fit=crop', tips: [] },
      { name: '漢拿山炒飯', desc: '在鐵板上將炒飯堆成火山形狀，淋上蛋液模擬岩漿。', link: '', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=2000&auto=format&fit=crop', tips: [] }
    ],
    cafe: [
      { name: 'Blanc Rocher', desc: '牛島最美的海景咖啡廳之一。', link: 'https://map.naver.com/p/search/블랑로쉐', image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2000&auto=format&fit=crop', tips: ['花生拿鐵是招牌'] }
    ],
    backup: [
      { name: '涉地可支', desc: '韓劇《All In》拍攝地，步道平緩。', link: 'https://map.naver.com/p/search/섭지코지', image: 'https://images.unsplash.com/photo-1610368307274-12349899321e?q=80&w=2000&auto=format&fit=crop', tips: [] }
    ]
  },
  day4: {
    id: 'day4', date: '12/07', title: 'Day 4: 漢拏山健行', 
    // 📷 [圖片更換] Day 4 橫幅
    banner: 'https://images.unsplash.com/photo-1610368307274-12349899321e?q=80&w=2070&auto=format&fit=crop',
    items: [
      { time: '07:00', title: '移動', place: '前往御里牧', note: 'Eorimok Trailhead', link: 'https://map.naver.com/p/search/어리목탐방로', desc: '建議早起出發，避免登山口停車場客滿。若搭公車請確認 240 號公車時刻表。', tips: ['車程約 30-40 分鐘', '早餐要吃飽'], image: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=2000&auto=format&fit=crop' },
      { time: '07:30', title: '登山', place: '開始爬山', note: '御里牧路線上山', link: '', desc: '剛開始是一段森林路，之後視野會開闊。務必在入口處穿好冰爪。', tips: ['注意保暖', '適時補充水分'], image: 'https://images.unsplash.com/photo-1516655855035-d5215bcb5604?q=80&w=2000&auto=format&fit=crop' },
      { time: '全天', title: '健行', place: '御里牧 - 靈室', note: '享受雪景與挑戰', link: '', desc: '抵達威瑟岳避難所後，可以休息吃泡麵（需自備熱水）。下山走靈室路線，風景如畫。', tips: ['避難所有廁所', '垃圾請自行帶下山'], image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2000&auto=format&fit=crop' },
      { time: '傍晚', title: '下山', place: '靈室登山口', note: 'Yeongsil Trailhead', link: 'https://map.naver.com/p/search/영실탐방로', desc: '下山後需走到停車場或公車站。若太累可請計程車排班處叫車。', tips: [], image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop' },
      { time: '晚上', title: '晚餐', place: '市區黑豬肉', note: '犒賞自己的一餐', link: '', desc: '爬完山最適合吃油滋滋的黑豬肉燒烤補充體力！', tips: [], image: 'https://images.unsplash.com/photo-1596627008770-e4b752496a78?q=80&w=2000&auto=format&fit=crop' }
    ],
    food: [
      { name: '黑豚家', desc: '老字號黑豬肉，炭火香氣十足。', link: 'https://map.naver.com/p/search/흑돈가', image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=2000&auto=format&fit=crop', tips: [] },
      { name: '校村炸雞', desc: '蜂蜜炸雞外皮酥脆，適合外帶回飯店當宵夜。', link: 'https://map.naver.com/p/search/교촌치킨', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2000&auto=format&fit=crop', tips: [] },
    ],
    cafe: [],
    backup: [
      { name: '1100高地', desc: '如果不爬山，開車到這裡也能輕鬆看到漢拏山的雪景。', link: 'https://map.naver.com/p/search/1100고지', image: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?q=80&w=2000&auto=format&fit=crop', tips: ['冬天路面可能結冰，開車小心'] }
    ]
  },
  day5: {
    id: 'day5', date: '12/08', title: 'Day 5: 採買 & 返程', 
    // 📷 [圖片更換] Day 5 橫幅
    banner: 'https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?q=80&w=2000',
    items: [
      { time: '早上', title: '採買', place: '東門市場', note: '伴手禮最後衝刺', link: 'https://map.naver.com/p/search/동문재래시장', desc: '離機場最近的大型市場。可以買到橘子巧克力、橘子乾、Omegi 糕等特產。', tips: ['Gate 8 附近有很多吃的', '水果可以試吃'], image: 'https://images.unsplash.com/photo-1533920145389-d08019741817?q=80&w=2000&auto=format&fit=crop' },
      { time: '下午', title: '彈性', place: '補齊未去景點', note: '海邊咖啡發呆', link: '', desc: '旅程的最後，找間喜歡的咖啡廳寫寫明信片，或去海邊做最後的道別。', tips: [], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop' },
      { time: '19:00', title: '歸還', place: 'Oshare 裝備', note: '檢查裝備無損壞', link: 'https://map.naver.com/p/search/오쉐어', desc: '將租借的登山裝備歸還。', tips: ['確認無遺漏物品'], image: 'https://images.unsplash.com/photo-1517172049103-67f0803c4f74?q=80&w=2000&auto=format&fit=crop' },
      { time: '20:00', title: '還車', place: 'LOTTE Rent-a-Car', note: '預留時間接駁', link: 'https://map.naver.com/p/search/롯데렌터카제주오토하우스', desc: '開回租車公司還車，工作人員會快速檢查油量與車況。搭乘接駁車前往機場。', tips: ['請加滿油再還車', '檢查車上垃圾是否清空'], image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2000&auto=format&fit=crop' },
      { time: '22:15', title: '飛機', place: '返回台北', note: '再見濟州', link: 'https://map.naver.com/p/search/제주국제공항', desc: '帶著滿滿的回憶與戰利品回家。', tips: [], image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop' }
    ]
  }
};

export default function App() {
  // useTailwindCDN 已移除，因為 index.html 已負責載入

  const [activeCategory, setActiveCategory] = useState('home');
  const [activeDay, setActiveDay] = useState('day1');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleNav = (category, day = null) => {
    setActiveCategory(category);
    if (day) setActiveDay(day);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenModal = (item) => {
    setModalData(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  // 安全獲取行程資料的輔助函式 (防呆)
  const getRouteItems = (dayId) => {
    const day = SCHEDULE_DATA[dayId];
    // 優先讀取 route，如果沒有則嘗試讀取 items，都沒有則回傳空陣列
    return day && (day.route || day.items) ? (day.route || day.items) : [];
  };

  return (
    <div className="min-h-screen bg-bg text-text font-body selection:bg-wine selection:text-white">
      <JapaneseTexture />
      <nav className="fixed top-0 left-0 right-0 z-40 bg-bg/95 backdrop-blur-md border-b border-[#E6E4DD] h-16 flex items-center justify-between px-6 transition-all duration-300">
        <div className="text-lg md:text-xl tracking-widest font-serif font-bold text-text cursor-pointer" onClick={() => handleNav('home')}>JEJU 2025</div>
        <div className="hidden md:flex space-x-10 text-sm tracking-widest font-medium text-[#888]">
          {['INFO', 'SCHEDULE', 'HIKING'].map((item) => (
            <button key={item} onClick={() => handleNav(item.toLowerCase())} className={`hover:text-text transition-colors relative pb-1 ${activeCategory === item.toLowerCase() ? 'text-text' : ''}`}>
              {item === 'INFO' ? '重要資訊' : item === 'SCHEDULE' ? '每日行程' : '爬山資訊'}
              {activeCategory === item.toLowerCase() && (<motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-[1px] bg-wine" />)}
            </button>
          ))}
        </div>
        <button className="md:hidden text-text" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
      </nav>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-50 bg-bg pt-24 px-8 flex flex-col space-y-8">
            <button className="absolute top-6 right-6" onClick={() => setIsMenuOpen(false)}><X size={24}/></button>
            {[ { id: 'home', label: 'Home 首頁' }, { id: 'info', label: 'Info 重要資訊' }, { id: 'schedule', label: 'Schedule 每日行程' }, { id: 'hiking', label: 'Hiking 爬山資訊' } ].map((item) => (
              <button key={item.id} onClick={() => { handleNav(item.id); setIsMenuOpen(false); }} className="text-2xl font-serif text-left text-[#666] flex justify-between items-center border-b border-[#E6E4DD] pb-4"><span>{item.label}</span><ChevronRight size={20} /></button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <main className="relative z-10 pt-16">
        {activeCategory === 'home' && <HomeView onNavigate={handleNav} />}
        {activeCategory === 'info' && <InfoView data={INFO_DATA} />}
        {activeCategory === 'schedule' && <ScheduleView schedule={SCHEDULE_DATA} activeDay={activeDay} onDayChange={setActiveDay} onItemClick={handleOpenModal} getRouteItems={getRouteItems} />}
        {activeCategory === 'hiking' && <HikingView data={HIKING_DATA} />}
      </main>
      <DetailModal isOpen={modalOpen} onClose={handleCloseModal} data={modalData} />
      <footer className="py-12 text-center text-[#999] text-xs tracking-[0.2em] border-t border-[#E6E4DD] mt-20 bg-bg"><p>JEJU TRIP 2025 • WINTER EDITION</p></footer>
    </div>
  );
}

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=33.4996&longitude=126.5312&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto')
      .then(res => res.json()).then(data => setWeather(data.current)).catch(console.error);
  }, []);
  if (!weather) return <div className="text-xs text-gray-400">天氣載入中...</div>;
  return (
    <div className="bg-white/80 p-4 rounded-lg border border-coffee/30 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3"><ThermometerSun className="text-coffee" size={24} /><div><p className="font-bold text-gray-700 text-lg">{weather.temperature_2m}°C</p><p className="text-xs text-gray-500">Jeju City</p></div></div>
      <div className="text-right"><div className="flex items-center text-xs text-gray-600"><Wind size={14} className="mr-1"/> {weather.wind_speed_10m} km/h</div><a href="https://weather.naver.com/today/14110580" target="_blank" rel="noreferrer" className="text-[10px] text-wine underline mt-1 block">Forecast &gt;</a></div>
    </div>
  );
}

function DetailModal({ isOpen, onClose, data }) {
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      const key = `jeju-note-${data.id || data.place || 'default'}`;
      setNote(localStorage.getItem(key) || '');
      setSaved(false);
    }
  }, [data]);

  const handleNoteChange = (e) => {
    const val = e.target.value;
    setNote(val);
    const key = `jeju-note-${data.id || data.place || 'default'}`;
    localStorage.setItem(key, val);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-white transition-colors text-gray-800"><X size={20} /></button>
          
          <div className="h-64 md:h-80 w-full relative">
            <img src={data.image || 'https://images.unsplash.com/photo-1528629297340-d1d466945dc5?q=80&w=2000'} alt={data.place || data.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-2 shadow-sm">{data.place || data.name}</h2>
              <p className="text-white/80 tracking-widest uppercase text-sm font-medium">{data.title || data.desc?.slice(0, 20)}</p>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8 bg-white">
            <div>
              <h3 className="text-sm font-bold tracking-[0.2em] text-[#888] uppercase mb-3 flex items-center"><Info size={16} className="mr-2"/> About</h3>
              <p className="text-text leading-relaxed text-lg font-light">{data.desc || "暫無詳細介紹"}</p>
            </div>

            {data.tips && <div className="bg-[#EBE9E4]/60 p-5 rounded-lg border border-[#E6E4DD]"><h3 className="text-sm font-bold tracking-[0.2em] text-[#888] uppercase mb-3 flex items-center"><AlertCircle size={16} className="mr-2"/> Travel Tips</h3><ul className="space-y-2">{data.tips.map((tip, i) => <li key={i} className="flex items-start text-sm text-text"><span className="mr-2 text-wine font-bold">•</span> {tip}</li>)}</ul></div>}
            
            <div>
               <div className="flex justify-between items-center mb-3">
                 <h3 className="text-sm font-bold tracking-[0.2em] text-wine uppercase flex items-center"><Edit3 size={16} className="mr-2"/> My Notes</h3>
                 {saved && <span className="text-xs text-green-600 flex items-center bg-green-50 px-2 py-1 rounded"><CheckCircle size={12} className="mr-1"/> 已自動儲存</span>}
               </div>
               <textarea value={note} onChange={handleNoteChange} placeholder="在此貼上您的備註..." className="w-full h-32 p-4 bg-white border border-[#DDD] rounded focus:outline-none focus:border-wine focus:ring-1 focus:ring-wine text-sm leading-relaxed resize-none text-text"/>
            </div>

            <div className="pt-6 border-t border-[#E6E4DD] flex justify-end">
              {data.link ? <a href={data.link} target="_blank" rel="noreferrer" className="flex items-center space-x-2 bg-wine text-white px-6 py-3 rounded hover:bg-coffee transition-colors shadow-lg shadow-wine/20"><span>Open Naver Map</span> <ExternalLink size={16} /></a> : <button disabled className="bg-[#EEE] text-[#AAA] px-6 py-3 rounded cursor-not-allowed">No Link</button>}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function HomeView({ onNavigate }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
      <div className="relative w-full h-[90vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        {/* 📷 [圖片更換] 首頁大圖 */}
        <img src="/images/sea.jpg" onError={(e) => {e.target.src = 'https://images.unsplash.com/photo-1528629297340-d1d466945dc5?q=80&w=2244&auto=format&fit=crop'}} alt="Jeju Hero" className="w-full h-full object-cover animate-pan-slow" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
            <h2 className="text-sm tracking-[0.3em] mb-6 uppercase text-white/90">December 4 - 8, 2025</h2>
            <h1 className="text-6xl md:text-8xl font-serif font-thin mb-8 tracking-widest text-white drop-shadow-md">濟州島</h1>
            <p className="max-w-md mx-auto text-sm leading-loose opacity-90 font-light tracking-wide border-l border-white/50 pl-6 text-left text-white">從西岸的海風到漢拏山的雪白。<br/>這是一段關於自然、咖啡與自我的對話。</p>
          </motion.div>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} onClick={() => onNavigate('schedule')} className="mt-16 px-8 py-3 border border-white/50 bg-white/10 hover:bg-white hover:text-black transition-all text-sm tracking-[0.2em] backdrop-blur-sm text-white">VIEW ITINERARY</motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function InfoView({ data }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto px-6 py-12 space-y-20">
      <div className="text-center space-y-4"><h2 className="text-3xl font-serif text-text">Trip Essentials</h2><p className="text-[#888] tracking-widest text-sm">重要資訊 • 航班 • 住宿 • 穿搭</p></div>
      <section><SectionTitle icon={<Plane size={20} />} title="航班資訊 Flights" /><div className="grid md:grid-cols-2 gap-8 mt-6">{data.flights.map((flight) => (<div key={flight.id} className="bg-white/90 p-6 rounded shadow-sm border border-[#E6E4DD] group"><div className="mb-4 aspect-video bg-[#F0F0F0] overflow-hidden rounded relative"><img src={flight.image} alt="Flight" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div><h3 className="font-bold text-[#444] mb-2">{flight.title}</h3><div className="space-y-1 text-sm text-[#666]"><p className="flex items-center"><Calendar size={14} className="mr-2"/> {flight.date}</p><p className="flex items-center"><Clock size={14} className="mr-2"/> {flight.time} ({flight.duration})</p></div></div>))}</div></section>
      <section><SectionTitle icon={<Bed size={20} />} title="住宿 Accommodation" /><div className="space-y-6 mt-6">{data.hotels.map((hotel, idx) => (<div key={idx} className="bg-white/90 p-6 md:p-8 rounded shadow-sm border border-[#E6E4DD] flex flex-col md:flex-row justify-between gap-6"><div className="flex-1"><div className="flex items-baseline space-x-3 mb-1"><h3 className="text-xl font-serif text-text">{hotel.name}</h3><span className="text-xs bg-[#F5F4F0] px-2 py-0.5 rounded text-[#888]">{hotel.nights}晚</span></div><p className="text-sm text-[#999] mb-4">{hotel.engName}</p><div className="space-y-2 text-sm text-[#666]"><p><strong>Check-in:</strong> {hotel.checkIn}</p><p><strong>Check-out:</strong> {hotel.checkOut}</p><p className="text-[#888] text-xs mt-2">{hotel.address}</p></div></div><div className="flex flex-col justify-end"><a href={hotel.link} target="_blank" rel="noreferrer" className="flex items-center justify-center space-x-2 px-6 py-3 bg-wine text-white text-xs tracking-widest hover:bg-coffee transition-colors rounded-sm"><span>VIEW MAP</span> <ExternalLink size={14} /></a></div></div>))}</div></section>
      <section><SectionTitle icon={<Car size={20} />} title="租車資訊 Car Rental" /><div className="bg-[#FAF9F6] p-8 rounded border border-[#E6E4DD] mt-6 relative overflow-hidden"><div className="absolute top-0 right-0 p-4 opacity-10"><Car size={120} /></div><div className="relative z-10 space-y-4"><div><p className="text-xs text-[#888] tracking-widest uppercase">Order ID</p><p className="text-2xl font-serif tracking-wide text-text">{data.carRental.orderId}</p></div><div className="grid md:grid-cols-2 gap-6 pt-4"><div><p className="font-bold text-[#444] mb-1">租借期間</p><p className="text-sm text-[#666]">{data.carRental.period}</p></div><div><p className="font-bold text-[#444] mb-1">地點 ({data.carRental.transport})</p><p className="text-sm text-[#666]">{data.carRental.location}</p><a href={data.carRental.link} target="_blank" rel="noreferrer" className="text-xs text-coffee underline mt-2 inline-block">在地圖上開啟</a></div></div></div></div></section>
      <section className="grid md:grid-cols-2 gap-12"><div><SectionTitle icon={<Shirt size={20} />} title="穿搭建議 Weather & Wear" /><div className="mt-6 space-y-6"><WeatherWidget /><div className="space-y-3">{data.clothing.layers.map((l, i) => (<div key={i} className="flex items-center text-sm border-b border-[#EEE] pb-2 last:border-0"><span className="w-16 font-bold text-[#AA9988] text-xs uppercase">{l.part}</span><div className="flex-1"><span className="text-text">{l.item}</span><p className="text-[10px] text-[#999]">{l.note}</p></div></div>))}</div></div></div><div><SectionTitle icon={<ShoppingBag size={20} />} title="必帶物品 Checklist" /><div className="mt-6 grid grid-cols-2 gap-3">{data.packing.map((item, i) => (<div key={i} className="flex items-center space-x-2 text-sm text-[#555]"><div className="w-4 h-4 rounded border border-[#CCC]" /><span>{item}</span></div>))}</div></div></section>
    </motion.div>
  );
}

function HikingView({ data }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 py-12">
      <div className="relative rounded-xl overflow-hidden mb-12 h-64 md:h-80 shadow-lg">
        {/* 📷 [圖片更換] 爬山大圖 */}
        <img src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2076&auto=format&fit=crop" alt="Hallasan" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center flex-col text-white"><h1 className="text-4xl font-serif mb-2 text-white">Hallasan Hiking</h1><p className="tracking-widest text-sm opacity-90 text-white">漢拏山 • 雪地健行攻略</p></div>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-12">
          <section><h3 className="text-xl font-serif text-text mb-4 flex items-center"><MapPin className="mr-2" size={18} /> 路線資訊</h3><div className="bg-white/90 p-6 rounded border border-[#E6E4DD] space-y-4"><div className="flex justify-between items-start border-b border-[#F0F0F0] pb-4"><div><h4 className="font-bold text-lg text-text">{data.route.name}</h4><p className="text-sm text-[#666] mt-1">{data.route.desc}</p></div><div className="text-right"><span className="block text-2xl font-light text-wine">{data.route.distance}</span><span className="text-xs text-[#888]">總距離</span></div></div><div className="grid grid-cols-2 gap-4 text-sm"><div><span className="block text-[#888] text-xs mb-1">預計耗時</span><span className="font-medium text-[#444]">{data.route.duration}</span></div><div><span className="block text-[#888] text-xs mb-1">預計氣溫</span><span className="font-medium text-[#444]">{data.route.temp}</span></div></div></div></section>
          <section><h3 className="text-xl font-serif text-text mb-4 flex items-center"><AlertCircle className="mr-2" size={18} /> 裝備指南</h3><div className="space-y-4">{data.gear.map((g, i) => (<div key={i} className="flex bg-[#FAF9F6] p-4 rounded border border-[#E6E4DD]"><div className="w-24 flex-shrink-0 font-bold text-[#888] text-sm uppercase">{g.item}</div><div className="text-sm text-text leading-relaxed">{g.desc}</div></div>))}</div></section>
        </div>
        <div className="space-y-8"><div className="bg-text text-[#F5F4F0] p-6 rounded shadow-lg"><h4 className="text-lg font-serif mb-4 border-b border-gray-600 pb-2">裝備租借</h4><p className="font-bold text-xl mb-1 text-white">{data.rental.shop}</p><a href={data.rental.link} target="_blank" rel="noreferrer" className="text-xs text-[#AAA] hover:text-white underline mb-6 block">開啟地圖連結</a><div className="space-y-4 text-sm"><div><span className="block text-[#888] text-xs mb-1">借用時間</span><p className="text-white/90">{data.rental.time}</p></div><div className="p-3 bg-white/10 rounded text-xs text-[#CCC]">⚠️ {data.rental.note}</div></div></div></div>
      </div>
    </motion.div>
  );
}

function ScheduleView({ schedule, activeDay, onDayChange, onItemClick, getRouteItems }) {
  const dayData = schedule[activeDay];
  // 使用 getRouteItems 來安全獲取資料，防止 undefined 錯誤
  const routeItems = getRouteItems(activeDay);

  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-16 z-30 bg-bg/95 backdrop-blur border-b border-[#E6E4DD] overflow-x-auto scrollbar-hide"><div className="flex justify-start md:justify-center min-w-max px-4">{Object.values(schedule).map((day) => (<button key={day.id} onClick={() => onDayChange(day.id)} className={`px-6 py-4 text-sm tracking-widest transition-colors border-b-2 ${activeDay === day.id ? 'border-wine text-wine font-bold' : 'border-transparent text-[#999] hover:text-text'}`}>{day.id.toUpperCase().replace('DAY', 'DAY ')}</button>))}</div></div>
      <motion.div key={activeDay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative h-[40vh] md:h-[50vh] w-full"><div className="absolute inset-0 bg-black/40" /><img src={dayData.banner} alt="Banner" className="w-full h-full object-cover" /><div className="absolute bottom-0 left-0 p-8 md:p-12 text-white bg-gradient-to-t from-black/80 to-transparent w-full"><p className="tracking-[0.2em] text-sm mb-2 opacity-90 text-white">{dayData.date} • {dayData.id.toUpperCase()}</p><h2 className="text-3xl md:text-5xl font-serif font-light text-white">{dayData.title}</h2></div></motion.div>
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-8 relative z-10 space-y-12">
        <div className="bg-white/95 rounded shadow-xl shadow-[#00000005] border border-[#EBE9E4] overflow-hidden">
          <div className="p-6 border-b border-[#F0F0F0] bg-white/50 sticky top-0 flex justify-between items-center"><h3 className="text-xs font-bold tracking-[0.2em] text-[#888] uppercase flex items-center"><MapPin size={14} className="mr-2"/> Main Route</h3><span className="text-[10px] text-[#AAA]">點擊項目查看詳情</span></div>
          <div className="divide-y divide-[#F0F0F0]">
            {routeItems.map((item, idx) => (
              <div key={idx} onClick={() => onItemClick(item)} className="p-6 hover:bg-[#FAF9F6] transition-colors flex gap-6 cursor-pointer group">
                <div className="w-16 flex-shrink-0 text-right font-medium text-text font-serif pt-1">{item.time}</div>
                <div className="flex-1 border-l-2 border-[#F0F0F0] pl-6 relative">
                  <div className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-[#E6E4DD] border-2 border-white group-hover:bg-wine transition-colors" />
                  <h4 className="text-lg font-medium text-text group-hover:text-wine">{item.place}</h4>
                  <p className="text-xs font-bold text-[#AA9988] tracking-wider uppercase mb-1">{item.title}</p>
                  <p className="text-sm text-[#666] font-light mb-2 line-clamp-1">{item.desc || item.note}</p>
                  <div className="flex items-center text-xs text-coffee opacity-0 group-hover:opacity-100 transition-opacity">查看更多 <ChevronRight size={12} className="ml-1"/></div>
                </div>
              </div>
            ))}
            {routeItems.length === 0 && <div className="p-6 text-center text-gray-400">暫無行程資料</div>}
          </div>
        </div>
        <HorizontalSection title="Nearby Food 美食" icon={<Utensils size={16}/>} items={dayData.food} onItemClick={onItemClick} />
        <HorizontalSection title="Coffee & Dessert 咖啡甜點" icon={<Coffee size={16}/>} items={dayData.cafe} onItemClick={onItemClick} />
        <HorizontalSection title="Backup Plan 備案" icon={<AlertCircle size={16}/>} items={dayData.backup} onItemClick={onItemClick} />
      </div>
    </div>
  );
}

function HorizontalSection({ title, icon, items, onItemClick }) {
  if (!items || items.length === 0) return null;
  return (
    <section>
      <h3 className="flex items-center text-sm font-bold tracking-[0.2em] text-[#444] uppercase mb-4 px-2"><span className="mr-2 text-[#888]">{icon}</span> {title}</h3>
      <div className="flex overflow-x-auto space-x-4 pb-6 px-2 scrollbar-hide snap-x">
        {items.map((item, idx) => (
          <div key={idx} onClick={() => onItemClick(item)} className="flex-shrink-0 w-64 bg-white/95 border border-[#E6E4DD] p-5 rounded snap-center hover:shadow-md transition-shadow cursor-pointer group">
            {/* 卡片圖片移除，僅保留文字內容 */}
            <h4 className="font-bold text-text mb-1">{item.name}</h4>
            <p className="text-sm text-[#666] mb-4 h-10 overflow-hidden line-clamp-2">{item.desc}</p>
            <span className="text-xs text-[#2C2C2C] border border-[#DDD] px-3 py-1.5 rounded group-hover:bg-wine group-hover:text-white group-hover:border-wine transition-colors block text-center">READ MORE</span>
          </div>
        ))}
        <div className="w-2 flex-shrink-0" />
      </div>
    </section>
  );
}

function SectionTitle({ icon, title }) {
  return <div className="flex items-center space-x-3 border-b border-[#E6E4DD] pb-2 mb-4"><span className="text-[#2C2C2C]">{icon}</span><h3 className="text-lg font-serif text-[#2C2C2C]">{title}</h3></div>;
}
