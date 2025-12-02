import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, ExternalLink, Menu, X, ChevronRight, 
  Wind, Coffee, Mountain, ShoppingBag, Calendar, 
  Plane, Bed, Car, Shirt, Snowflake, Utensils, AlertCircle,
  ThermometerSun, Edit3, Save, Info, CheckCircle, CreditCard, Phone, 
  ArrowRight, BookOpen, PenLine, Luggage
} from 'lucide-react';

// --- 背景紋理 ---
const JapaneseTexture = () => (
  <div className="fixed inset-0 pointer-events-none z-0" 
       style={{ 
         backgroundImage: 'url("/images/sea.jpg")', 
         backgroundSize: 'cover',
         backgroundPosition: 'center',
         backgroundRepeat: 'no-repeat',
         opacity: 0.1 
       }}>
  </div>
);

// --- 圓圈文字圖示組件 ---
const CircleIcon = ({ char, colorClass = "border-text text-text" }) => (
  <span className={`w-6 h-6 rounded-full border ${colorClass} flex items-center justify-center text-xs font-serif mr-2`}>
    {char}
  </span>
);

// --- 📍 資料設定區 (DATA) ---
const INFO_DATA = {
  flights: [
    { 
      id: 'outbound', type: 'outbound', title: '去程：台北 (TPE) - 濟州 (CJU)', date: '12月4日 (週四)', time: '02:50 - 06:05', duration: '2小時 15分', 
      image: '/images/flight_out.jpg'
    },
    { 
      id: 'inbound', type: 'inbound', title: '回程：濟州 (CJU) - 台北 (TPE)', date: '12月8日 (週一)', time: '22:15 - 23:50', duration: '2小時 35分', 
      image: '/images/flight_in.jpg' 
    }
  ],
  baggageInfo: [
    { type: '個人物品', desc: '1 件/人 (40*30*15CM)，須置於座位下方' },
    { type: '手提行李', desc: '1 件/人 (10kg, 40*20*55CM)' },
    { type: '託運行李', desc: '15kg/人 (長+寬+高 < 203CM)' }
  ],
  hotels: [
    { name: 'Day 1 住宿', engName: 'Jeju Aewol Quiet Month (Goyohandal)', checkIn: '12/04 17:30', checkOut: '12/05 09:00', address: '濟州市 涯月邑 涯月裡 1859', nights: 1, link: 'https://naver.me/xBMOHYtw' },
    { name: 'Day 2 住宿', engName: 'Heyy Seogwipo Hotel', checkIn: '12/05 18:00', checkOut: '12/06 08:00', address: '西歸浦市 西歸洞 820-1', nights: 1, link: 'https://naver.me/GZ6xBjW8' },
    { 
      name: 'Day 3-4 住宿', 
      engName: 'Urbanstay Jeju Airport', 
      checkIn: '12/06 18:50', 
      checkOut: '12/08 09:00', 
      address: '濟州市 連洞 263-2', 
      nights: 2, 
      link: 'https://naver.me/xfYL6fGn',
      parkingInfo: '停放在路肩或使用附近的公共停車場。（不提供額外停車費）- 附近停車場：新濟州公共停車場（步行 10 分鐘）',
      guideLink: 'https://ur.ustay.kr/j03joc'
    }
  ],
  carRental: { 
    orderId: '1359039416311386', 
    period: '12/04 07:00 - 12/08 21:00 (共五天)', 
    location: '樂天租車濟州 Auto House', 
    address: '濟州市 龍潭二洞 855', 
    transport: '機場有接駁車', 
    items: ['護照', '台灣駕照', '國際駕照', '信用卡(建議兩張)'], 
    link: 'https://naver.me/FqZqommG' 
  },
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
  },
  taxRefund: [
    { 
      title: '1) 店內即時退稅 (Instant Refund)', 
      desc: '部分店家支援現場退稅。付款時直接扣除稅金，或退還現金。',
      tips: ['需出示護照', '單筆消費需滿 ₩30,000'],
    },
    { 
      title: '2) 機場退稅 (Airport Refund)', 
      desc: '若店家無法當場退稅，需保留單據到機場辦理。位置：濟州國際機場 3 樓，5 號門左手邊。',
      tips: ['過安檢後，到 18、19 號登機口附近領現金', '可領韓元或美金', '無法領台幣'],
    }
  ],
  emergency: [
    { name: '報警', number: '112', desc: '犯罪、糾紛、緊急事件' },
    { name: '火災/救護車', number: '119', desc: '火災、受傷、醫療緊急狀況' },
    { name: '旅遊諮詢/翻譯', number: '1330', desc: '按 4 (中文)，24小時服務' },
    { name: '遺失物查詢', number: '182', desc: 'Lost112，查詢機場與全韓遺失物' },
  ]
};

const HIKING_DATA = {
  headerImage: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2076&auto=format&fit=crop',
  rental: { shop: 'Oshare (裝備店)', link: 'https://naver.me/Fdor8Xwk', time: '12/6 18:20 領取 - 12/7 16:00 歸還', note: '' },
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
    id: 'day1', date: '12/04 (週四)', title: '機場、早晨景點與西部海岸線',
    banner: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=2070&auto=format&fit=crop',
    route: [
      { 
        time: '06:05', title: '抵達濟州機場 (CJU)', place: '濟州國際機場', note: '出關領行李', link: 'https://map.naver.com/p/search/제주국제공항', 
        desc: '抵達後請先連上機場 Wi-Fi。出關後跟隨指示牌前往租車接駁區。', tips: ['機場便利商店可先買水', '上廁所'], 
        image: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?q=80&w=2000&auto=format&fit=crop' 
      },
      { time: '07:00', title: '領車', place: '樂天租車濟州 Auto 屋', note: '07:00 - 07:45', link: 'https://naver.me/FqZqommG', desc: '濟州市 龍潭二洞 855。', tips: ['檢查車況並錄影', '確認燃油種類'], image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop' },
      { time: '08:30', title: '景點', place: '龍頭岩 & 龍淵吊橋', note: '08:30 - 09:30', link: 'https://naver.me/GsougTPq', 
        desc: '利用 Osulloc 開館前空檔，欣賞龍頭岩奇景。', 
        guide: '龍頭岩高10米，長30米，是由漢拏山火山口噴出的熔岩在海上凝結而成，模樣有如龍頭。傳說住在海底龍宮的一條龍想要升天，但因未能如願而變成岩石。',
        tips: ['海邊風大請注意保暖'], image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=2000&auto=format&fit=crop' },
      { time: '10:00', title: '觀光', place: 'Osulloc 雪綠茶博物館', note: '10:00 - 11:30', link: 'https://naver.me/xquidf7l', 
        desc: '準時開館後入場，避開人潮。Innisfree 濟州小屋也在旁邊。', 
        guide: 'O’sulloc 位於濟州島西廣茶園入口，這裡不僅是韓國最大的茶文化展示館，更是為了推廣韓國傳統茶文化而建。建築本身融合了自然景觀，落地窗外的綠茶園景色非常療癒。',
        tips: ['必吃綠茶冰淇淋', '戶外茶園拍照'], image: 'https://images.unsplash.com/photo-1571506165871-ee72a35bc3d4?q=80&w=2000&auto=format&fit=crop' },
      { time: '11:30', title: '午餐', place: '西南/中文地區', note: '11:30 - 12:30', link: '', desc: '前往 Aewol 的途中享用午餐。', tips: [], image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2000&auto=format&fit=crop' },
      { time: '13:45', title: '下午茶/散步', place: 'Aewol 咖啡街', note: '13:45 - 17:30', link: 'https://naver.me/55PZwITc', 
        desc: '長途移動後享受悠閒下午。海岸散步路風景優美。', 
        guide: '涯月邑漢潭海岸散步路沿著海岸線蜿蜒，這裡聚集了許多特色咖啡廳。知名的 G-Dragon 咖啡廳 (Monsant) 雖然已易主，但該區域的夕陽美景依然是濟州西部最熱門的景點之一。',
        tips: ['海景第一排'], image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2000&auto=format&fit=crop' },
      { time: '17:30', title: '入住', place: 'Goyohandal (Jeju Aewol Quiet Month)', note: '17:30 - 18:00', link: 'https://naver.me/xBMOHYtw', desc: '濟州市 涯月邑 涯月裡 1859。', tips: ['確認 Check-in 時間'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop' },
      { time: '18:30', title: '晚餐', place: '涯月邑晚餐', note: '18:30', link: '', desc: '在住宿附近享用晚餐。', tips: [], image: 'https://images.unsplash.com/photo-1533920145389-d08019741817?q=80&w=2000&auto=format&fit=crop' },
    ],
    food: [
      { 
        name: 'Nolman 海鮮拉麵', desc: '無限挑戰拍攝地，湯頭鮮甜，海鮮給得很大方。', link: 'https://map.naver.com/p/search/놀맨', 
        tips: ['需抽取號碼牌', '只收現金 (建議確認)'] 
      },
      { name: 'Crab Jack', desc: '美式手抓海鮮，將滿滿的海鮮倒在桌上，視覺效果滿分，適合多人享用。', link: 'https://map.naver.com/p/search/크랩잭', tips: ['提供木槌敲螃蟹，舒壓好吃'] }
    ],
    cafe: [
      { 
        name: 'Cafe Knotted', desc: '首爾超人氣甜甜圈的濟州分店，擁有可愛的戶外庭園與限定口味。', link: 'https://map.naver.com/p/search/노티드제주', 
        tips: ['通常需要排隊', '濟州限定綠茶口味必點'] 
      },
      { name: 'Tribe', desc: '以可愛的造型馬卡龍與舒芙蕾鬆餅聞名，店內裝潢非常有波希米亞風。', link: 'https://map.naver.com/p/search/트라이브', tips: [] }
    ],
    backup: [
      { 
        name: 'Arte Museum', desc: '韓國最大的沉浸式光影藝術展，雨天首選備案。', link: 'https://map.naver.com/p/search/아르떼뮤지엄제주', 
        tips: ['館內較暗，走路小心', 'Wave 展區非常壯觀'] 
      }
    ]
  },
  day2: {
    id: 'day2', date: '12/05 (週五)', title: '西部精華、冬季花海與南部光影',
    banner: 'https://images.unsplash.com/photo-1570535384203-999990818c39?q=80&w=2046&auto=format&fit=crop',
    route: [
      { time: '09:30', title: '玩樂', place: '9.81 Park 重力賽車', note: '09:30 - 12:30', link: 'https://naver.me/GBvp7lRv', 
        desc: '重力賽車公園，不使用引擎俯衝。', 
        guide: '9.81 Park 是以重力加速度 (g=9.81m/s²) 為主題的環保賽車公園。車輛沒有引擎，完全依靠坡度和重力滑行，可以一邊享受速度感，一邊欣賞飛揚島的海景。賽後還可以透過 App 下載自己的比賽影片。',
        tips: ['不能穿拖鞋/高跟鞋', '下載 App 綁定票券'], image: 'https://images.unsplash.com/photo-1570535384203-999990818c39?q=80&w=2000&auto=format&fit=crop' },
      { time: '12:40', title: '午餐', place: '濟州堂 (Jejudang)', note: '12:40 - 13:40', link: 'https://naver.me/x4GM6Ft7', desc: '近期爆紅的大型農倉風格烘焙咖啡廳。', tips: ['洋蔥麵包是招牌'], image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2000&auto=format&fit=crop' },
      { time: '14:10', title: '賞花', place: '山茶花之丘 (Camellia Hill)', note: '14:10 - 15:40', link: 'https://naver.me/FytfmxtE', 
        desc: '冬季推薦行程，滿滿的山茶花海。', 
        guide: '擁有30年歷史的東洋最大山茶花樹木園。園內種植了來自80個國家、500多種、共6000多棵山茶花樹。冬季是山茶花盛開的季節，整個園區會被染成一片浪漫的粉紅色。',
        tips: ['停留 1.5 小時', '拍照聖地'], image: 'https://images.unsplash.com/photo-1571506165871-ee72a35bc3d4?q=80&w=2000&auto=format&fit=crop' },
      { time: '16:00', title: '體驗', place: 'WATERWORLD 水之幻境', note: '16:00 - 18:00', link: 'https://naver.me/FZ86s9bO', desc: '位於濟州世界盃體育場內的水上世界。', tips: ['下午場次', '享受光影效果'], image: 'https://images.unsplash.com/photo-1571506165871-ee72a35bc3d4?q=80&w=2000&auto=format&fit=crop' },
      { time: '18:00', title: '入住', place: 'Heyy Seogwipo Hotel', note: '18:00 - 18:30', link: 'https://naver.me/GZ6xBjW8', desc: '西歸浦市 西歸洞 820-1。', tips: ['Check-in'], image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2000&auto=format&fit=crop' },
      { time: '18:30', title: '晚餐', place: '西歸浦每日偶來市場', note: '18:30 - 20:00', link: 'https://naver.me/5UTwYDC6', desc: '西歸浦最大的傳統市場。', tips: ['橘子麻糬', '炸黑豬肉捲'], image: 'https://images.unsplash.com/photo-1533920145389-d08019741817?q=80&w=2000&auto=format&fit=crop' }
    ],
    food: [], cafe: [], backup: []
  },
  day3: {
    id: 'day3', date: '12/06 (週六)', title: '牛島、東部海岸與裝備領取',
    // 📷 [圖片更換] Day 3 橫幅
    banner: 'https://images.unsplash.com/photo-1549887552-93f8efb4133f?q=80&w=2070&auto=format&fit=crop',
    route: [
      { time: '08:00', title: '出發', place: '前往城山港', note: '長途移動 1h 20m', link: 'https://naver.me/5KqVxB8K', desc: '從西歸浦出發，前往東部港口。', tips: ['早點出發避免塞車'], image: 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?q=80&w=2000&auto=format&fit=crop' },
      { time: '09:20', title: '購票', place: '城山港 (Seongsan Port)', note: '09:20 - 09:50', link: 'https://naver.me/5KqVxB8K', desc: '辦理購票與登船手續。', tips: ['必備：護照', '國際駕照 (若要租車)'], image: 'https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?q=80&w=2000&auto=format&fit=crop' },
      { time: '10:00', title: '渡輪', place: '前往牛島', note: '10:00 - 10:20', link: '', desc: '搭乘渡輪前往牛島。', tips: [], image: 'https://images.unsplash.com/photo-1549887552-93f8efb4133f?q=80&w=2000&auto=format&fit=crop' },
      { time: '10:20', title: '觀光', place: '牛島環島', note: '10:20 - 14:50', link: 'https://naver.me/xDCkodxV', desc: '牛島海洋道立公園環島遊。', 
        guide: '牛島位於濟州島東端，因外型像臥牛而得名。這裡有韓國唯一的珊瑚沙海水浴場——西濱白沙。騎著電動車環島，海風拂面，隨處可見的石頭矮牆與碧海藍天構成最美的濟州印象。',
        tips: ['花生冰淇淋', '漢拿山炒飯'], image: 'https://images.unsplash.com/photo-1549887552-93f8efb4133f?q=80&w=2000&auto=format&fit=crop' },
      { time: '15:30', title: '景點', place: '城山日出峰 (可選)', note: '15:30 - 17:00', link: 'https://naver.me/GdlvFhgw', 
        desc: '世界自然遺產。可選擇登頂 (1.5h) 或前往光峙海岸平地賞景。', 
        guide: '城山日出峰是10萬年前海底火山爆發形成的巨大岩石山，頂部有一個巨大的火山口。這裡被聯合國教科文組織列為世界自然遺產。若體力允許登頂，可以俯瞰整個濟州島東部海岸線的壯麗景色。',
        tips: ['保留體力給明天爬山'], image: 'https://images.unsplash.com/photo-1629202758155-22b3543d463d?q=80&w=2000&auto=format&fit=crop' },
      { time: '18:20', title: '領裝備', place: 'Oshare 機場總店', note: '18:20 - 18:50', link: 'https://naver.me/Fdor8Xwk', desc: '領取預約好的登山裝備。', tips: ['檢查冰爪', '試穿鞋子'], image: 'https://images.unsplash.com/photo-1517172049103-67f0803c4f74?q=80&w=2000&auto=format&fit=crop' },
      { time: '18:50', title: '入住', place: 'Urbanstay Jeju Airport', note: '18:50 - 19:10', link: 'https://naver.me/xfYL6fGn', desc: '濟州市 連洞 263-2 (近機場)。', tips: ['Check-in'], image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2000&auto=format&fit=crop' },
      { time: '19:10', title: '晚餐/採買', place: '蓮洞商圈 / 新羅免稅店', note: '19:10 - 21:00', link: 'https://naver.me/5CFIagYV', desc: '採買明天漢拏山的行動糧 (飯捲、水)。', tips: ['新羅免稅店就在附近'], image: 'https://images.unsplash.com/photo-1533920145389-d08019741817?q=80&w=2000&auto=format&fit=crop' }
    ],
    food: [], cafe: [], backup: []
  },
  day4: {
    id: 'day4', date: '12/07 (週日)', title: '漢拏山健行與黑豬肉',
    // 📷 [圖片更換] Day 4 橫幅
    banner: 'https://images.unsplash.com/photo-1610368307274-12349899321e?q=80&w=2070&auto=format&fit=crop',
    route: [
      { time: '06:50', title: '出發', place: '從 Urbanstay 出發', note: '06:50', link: '', desc: '提早出發，搶御里牧停車位。', tips: ['早餐要吃飽'], image: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=2000&auto=format&fit=crop' },
      { time: '07:30', title: '抵達', place: '御里牧停車場 (Eorimok)', note: '07:30', link: 'https://naver.me/G7CYrjDW', desc: '準備登山裝備，做暖身操。', tips: ['穿好冰爪'], image: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=2000&auto=format&fit=crop' },
      { time: '08:00', title: '登山', place: '漢拏山 (御里牧➝靈室)', note: '08:00 - 13:30', link: '', 
        desc: '御里牧 ➝ 威勢岳 ➝ 靈室。總攀登時間約 5.5-6 小時 (含休息)。', 
        guide: '漢拏山是韓國最高的山 (1947m)，也是一座休眠火山。御里牧路線雖然不能登頂，但沿途經過的鳥接岳與萬歲東山能看到絕美的雪景與雲海。靈室路線則以奇岩怪石著稱，被稱為「靈室奇岩」，風景如畫。',
        tips: ['注意保暖', '垃圾自行帶下山'], image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2000&auto=format&fit=crop' },
      { time: '13:30', title: '接駁', place: '靈室登山口', note: '13:30 - 15:30', link: '', desc: '靈室下山後，搭乘 240 號公車返回御里牧停車場取車。', tips: ['備妥零錢/T-money'], image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop' },
      { time: '15:30', title: '還裝備', place: 'Oshare', note: '15:30 - 16:00', link: 'https://naver.me/Fdor8Xwk', desc: '歸還登山裝備。預留充裕時間應對山區交通。', tips: ['確認無遺漏物品'], image: 'https://images.unsplash.com/photo-1517172049103-67f0803c4f74?q=80&w=2000&auto=format&fit=crop' },
      { time: '17:00', title: '晚餐', place: '市區吃晚餐', note: '17:00', link: 'https://naver.me/G3P4DCkY', desc: '慰勞辛苦的雙腿，享用黑豬肉大餐。', tips: ['東門市場吃小吃', '黑豬肉燒烤'], image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=2000&auto=format&fit=crop' }
    ],
    food: [], cafe: [], backup: []
  },
  day5: {
    id: 'day5', date: '12/08 (週一)', title: '特色麵包、東部文化與返程',
    // 📷 [圖片更換] Day 5 橫幅
    banner: 'https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?q=80&w=2000',
    route: [
      { time: '09:30', title: '麵包', place: 'Audrant Bakery (Odeurang)', note: '09:30 - 10:00', link: 'https://naver.me/xNnJCq9r', desc: '著名的西餅店 (Hamdeok店)。', tips: ['大蒜麵包必買'], image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2000&auto=format&fit=crop' },
      { time: '10:20', title: '貝果', place: '倫敦貝果博物館 濟州', note: '10:20 - 11:30', link: 'https://naver.me/5ZSKL4vw', desc: '超人氣排隊名店。', tips: ['建議先抽號碼牌', '旁邊有 Cafe Layered'], image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2000&auto=format&fit=crop' },
      { time: '11:30', title: '海灘', place: '月汀里海灘 (Woljeongri)', note: '11:30 - 12:30', link: 'https://naver.me/xAAnOQdr', desc: '在海岸線上的咖啡廳休息或拍照。', tips: ['彩色椅子打卡點'], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop' },
      { time: '12:30', title: '午餐', place: '東部海岸線特色餐廳', note: '12:30 - 13:30', link: '', desc: '享用當地美食。', tips: [], image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2000&auto=format&fit=crop' },
      { time: '13:30', title: '文化', place: '濟州海女博物館 (Guide)', note: '13:30 - 14:30', link: '', 
        desc: '深入了解濟州島獨有的海女文化與歷史。',
        guide: '濟州海女文化於2016年被列入聯合國教科文組織人類非物質文化遺產。博物館展示了海女的生活、工作器具及歷史。海女不使用氧氣筒，僅憑憋氣潛入海中捕採海鮮，展現了強韌的生命力。', 
        tips: ['週一休館', '有影片導覽'], 
        image: 'https://images.unsplash.com/photo-1582101663353-6a742672b536?q=80&w=2000&auto=format&fit=crop' 
      },
      { time: '14:30', title: '活動', place: '金寧迷宮公園 (可選)', note: '14:30 - 15:30', link: 'https://naver.me/II4YnNsE', 
        desc: '戶外活動，拍照打卡的好地方。', 
        guide: '金寧迷宮公園是濟州島著名的迷宮公園，由柏樹組成，四季常青。迷宮的設計形狀像濟州島的輪廓。這裡也是許多韓劇和廣告的拍攝地，非常適合朋友或家庭一起挑戰，看誰先敲響終點的鐘聲。',
        tips: ['注意時間控制', '有貓咪出沒'], 
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2000&auto=format&fit=crop' 
      },
      { time: '16:30', title: '購物', place: '樂天免稅店 濟州店', note: '16:30 - 18:30', link: 'https://naver.me/5noaH784', desc: '最後購物衝刺，或回到蓮洞商圈。', tips: ['記得帶護照'], image: 'https://images.unsplash.com/photo-1533920145389-d08019741817?q=80&w=2000&auto=format&fit=crop' },
      { time: '18:30', title: '晚餐', place: '市區吃晚餐', note: '18:30 - 20:00', link: '', desc: '享用在濟州的最後一餐。', tips: [], image: 'https://images.unsplash.com/photo-1596627008770-e4b752496a78?q=80&w=2000&auto=format&fit=crop' },
      { time: '20:00', title: '還車', place: '樂天租車', note: '20:00 - 21:00', link: 'https://naver.me/FqZqommG', desc: '還車並搭乘接駁車前往機場。', tips: ['加滿油', '預留安檢時間'], image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2000&auto=format&fit=crop' },
      { time: '21:00', title: '返程', place: '濟州國際機場', note: '21:00 抵達機場', link: 'https://map.naver.com/p/search/제주국제공항', desc: '22:15 起飛，帶著滿滿回憶返家。', tips: ['Safe Flight!'], image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop' }
    ]
  }
};

export default function App() {
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

  const getRouteItems = (dayId) => {
    const day = SCHEDULE_DATA[dayId];
    if (!day) return [];
    return day.route || day.items || [];
  };

  return (
    <div className="min-h-screen bg-bg text-text font-sans selection:bg-wine selection:text-white relative">
      <JapaneseTexture />
      
      {/* 導航列 */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-bg/95 backdrop-blur-md border-b border-[#E6E4DD] h-16 flex items-center justify-between px-6 transition-all duration-300">
        <div className="text-lg tracking-widest font-sans font-bold text-text cursor-pointer" onClick={() => handleNav('home')}>JEJU 2025</div>
        <div className="hidden md:flex space-x-8 text-xs md:text-sm tracking-widest font-medium text-[#888]">
          {['INFO', 'SCHEDULE', 'HIKING'].map((item) => (
            <button key={item} onClick={() => handleNav(item.toLowerCase())} className={`hover:text-text transition-colors relative pb-1 ${activeCategory === item.toLowerCase() ? 'text-text' : ''}`}>
              {item === 'INFO' ? '重要資訊' : item === 'SCHEDULE' ? '每日行程' : '爬山資訊'}
              {activeCategory === item.toLowerCase() && (<motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-[1px] bg-wine" />)}
            </button>
          ))}
        </div>
        <button className="md:hidden text-text" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
      </nav>
      
      {/* 手機版選單 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-50 bg-bg pt-24 px-8 flex flex-col space-y-8">
            <button className="absolute top-6 right-6" onClick={() => setIsMenuOpen(false)}><X size={24}/></button>
            {[ { id: 'home', label: 'Home 首頁' }, { id: 'info', label: 'Info 重要資訊' }, { id: 'schedule', label: 'Schedule 每日行程' }, { id: 'hiking', label: 'Hiking 爬山資訊' } ].map((item) => (
              <button key={item.id} onClick={() => { handleNav(item.id); setIsMenuOpen(false); }} className="text-xl font-sans text-left text-[#666] flex justify-between items-center border-b border-[#E6E4DD] pb-4"><span>{item.label}</span><ChevronRight size={20} /></button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-16">
        {activeCategory === 'home' && <HomeView onNavigate={handleNav} />}
        {activeCategory === 'info' && <InfoView data={INFO_DATA} onItemClick={handleOpenModal} />}
        {activeCategory === 'schedule' && <ScheduleView schedule={SCHEDULE_DATA} activeDay={activeDay} onDayChange={setActiveDay} onItemClick={handleOpenModal} getRouteItems={getRouteItems} />}
        {activeCategory === 'hiking' && <HikingView data={HIKING_DATA} />}
      </main>

      {/* 浮動天氣島 */}
      <FloatingWeather />

      <DetailModal isOpen={modalOpen} onClose={handleCloseModal} data={modalData} />
      
      <footer className="py-12 text-center text-[#999] text-xs tracking-[0.2em] border-t border-[#E6E4DD] mt-20 bg-bg relative z-10"><p>JEJU TRIP 2025 • WINTER EDITION</p></footer>
    </div>
  );
}

// 浮動天氣組件
function FloatingWeather() {
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=33.4996&longitude=126.5312&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto')
      .then(res => res.json()).then(data => setWeather(data.current)).catch(console.error);
  }, []);

  if (!weather) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-40 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 flex items-center space-x-4 cursor-pointer hover:shadow-xl transition-shadow"
      onClick={() => window.open('https://weather.naver.com/today/14110580', '_blank')}
    >
      <div className="flex flex-col items-center">
        <ThermometerSun className="text-wine w-6 h-6" strokeWidth={1.5} />
        <span className="text-[10px] text-[#888] mt-1">Jeju</span>
      </div>
      <div>
        <p className="text-xl font-sans font-bold text-text">{weather.temperature_2m}°C</p>
        <div className="flex items-center text-xs text-[#666]">
          <Wind size={12} className="mr-1" strokeWidth={1.5}/> {weather.wind_speed_10m} km/h
        </div>
      </div>
      <ExternalLink size={14} className="text-wine/50" strokeWidth={1.5} />
    </motion.div>
  );
}

// DetailModal (背景全白，移除頂部大圖)
function DetailModal({ isOpen, onClose, data }) {
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      const key = `jeju-note-${data.id || data.place || data.title || 'default'}`;
      setNote(localStorage.getItem(key) || '');
      setSaved(false);
    }
  }, [data]);

  const handleNoteChange = (e) => {
    const val = e.target.value;
    setNote(val);
    const key = `jeju-note-${data.id || data.place || data.title || 'default'}`;
    localStorage.setItem(key, val);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isOpen || !data) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-6 right-6 z-10 bg-[#F5F5F5] p-2 rounded-full hover:bg-[#EEE] transition-colors text-gray-600"><X size={20} /></button>
          
          {/* 標題區 (純文字，無圖) */}
          <div className="p-8 md:p-10 border-b border-[#F0F0F0] bg-white">
             <h2 className="text-3xl md:text-4xl font-serif font-bold text-text mb-2 tracking-wide">{data.place || data.title}</h2>
             <div className="w-10 h-1 bg-wine mt-4 mb-2"></div>
             <p className="text-[#888] tracking-widest uppercase text-xs font-medium mt-2">{data.title || "TRAVEL GUIDE"}</p>
          </div>

          <div className="p-8 md:p-10 space-y-10 bg-white">
            {/* INFORMATION */}
            <div>
              <h3 className="flex items-center text-xs font-bold tracking-[0.2em] text-[#CCC] uppercase mb-4">
                <CircleIcon char="訊" colorClass="border-wine text-wine" />
                INFORMATION
              </h3>
              <div className="text-sm text-[#555] leading-8 font-sans text-justify">
                <p className="mb-4">{data.desc || "暫無詳細介紹"}</p>
                {data.guide && (
                  <div className="bg-[#FAFAFA] p-6 border-l-2 border-wine text-[#444] italic font-serif">
                    {data.guide}
                  </div>
                )}
              </div>
            </div>

            {/* TIPS */}
            {data.tips && data.tips.length > 0 && (
              <div>
                 <h3 className="flex items-center text-xs font-bold tracking-[0.2em] text-[#CCC] uppercase mb-4">
                    <CircleIcon char="撇" colorClass="border-coffee text-coffee" />
                    TIPS
                 </h3>
                 <ul className="space-y-3">
                    {data.tips.map((tip, i) => (
                      <li key={i} className="flex items-start text-sm text-[#555] leading-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-coffee/40 mt-2 mr-3 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                 </ul>
              </div>
            )}
            
            {/* 旅行備忘錄 */}
            <div className="pt-10 border-t border-[#F0F0F0]">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xs font-bold tracking-[0.2em] text-wine uppercase flex items-center"><PenLine size={16} strokeWidth={1.5} className="mr-2"/> 旅行備忘錄</h3>
                 {saved && <span className="text-xs text-green-600 flex items-center bg-green-50 px-2 py-1 rounded"><CheckCircle size={12} className="mr-1"/> 已儲存</span>}
               </div>
               <textarea 
                 value={note} 
                 onChange={handleNoteChange} 
                 placeholder="想說什麼就寫什麼，你的專屬景點筆記空間..." 
                 className="w-full h-32 p-4 bg-[#FAFAFA] border border-[#EEE] rounded focus:outline-none focus:border-wine text-sm leading-relaxed resize-none text-text placeholder:text-[#CCC]"
               />
            </div>
            
            {/* Map Link Button */}
            {data.link && (
               <div className="pt-4 flex justify-end">
                  <a href={data.link} target="_blank" rel="noreferrer" className="flex items-center justify-center bg-wine text-white px-6 py-3 rounded hover:bg-coffee transition-colors shadow-lg shadow-wine/20 gap-2 text-xs tracking-widest font-bold">
                    <span>VIEW MAP</span> <ArrowRight size={16} strokeWidth={1.5} />
                  </a>
               </div>
            )}
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
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img src="/images/sea.jpg" onError={(e) => {e.target.src = 'https://images.unsplash.com/photo-1528629297340-d1d466945dc5?q=80&w=2244&auto=format&fit=crop'}} alt="Jeju Hero" className="w-full h-full object-cover animate-pan-slow" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
            <h2 className="text-sm tracking-[0.3em] mb-6 uppercase text-white/90 font-sans">December 4 - 8, 2025</h2>
            <h1 className="text-6xl md:text-8xl font-serif font-thin mb-8 tracking-widest text-white drop-shadow-md">濟州島</h1>
            <p className="max-w-md mx-auto text-sm leading-loose opacity-90 font-light tracking-wide border-l border-white/50 pl-6 text-left text-white font-sans">從西岸的海風到漢拏山的雪白。<br/>這是一段關於自然、咖啡與自我的對話。</p>
          </motion.div>
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} onClick={() => onNavigate('schedule')} className="mt-16 px-8 py-3 border border-white/50 bg-white/10 hover:bg-white hover:text-black transition-all text-sm tracking-[0.2em] backdrop-blur-sm text-white font-sans">VIEW ITINERARY</motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function InfoView({ data, onItemClick }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto px-6 py-12 space-y-20">
      <div className="text-center space-y-4"><h2 className="text-3xl font-serif text-text font-bold">Trip Essentials</h2><p className="text-[#888] tracking-widest text-sm">重要資訊 • 航班 • 住宿 • 穿搭</p></div>
      
      {/* 1. 航班資訊 */}
      <section>
        <SectionTitle icon={<Plane size={20} strokeWidth={1.5} />} title="航班資訊 Flights" />
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* 去程 */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-[#E6E4DD]">
            <div className="mb-4 h-32 bg-gray-100 overflow-hidden rounded relative"><img src={data.flights[0].image} className="w-full h-full object-cover" alt="Outbound"/></div>
            <h3 className="font-bold text-lg text-text mb-2 font-sans">去程 (Outbound)</h3>
            <div className="space-y-1 text-sm text-[#666]">
              <p>台北 (TPE) - 濟州 (CJU)</p>
              <p className="font-medium text-wine">{data.flights[0].date}</p>
              <p>{data.flights[0].time}</p>
            </div>
          </div>
          {/* 回程 */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-[#E6E4DD]">
            <div className="mb-4 h-32 bg-gray-100 overflow-hidden rounded relative"><img src={data.flights[1].image} className="w-full h-full object-cover" alt="Inbound"/></div>
            <h3 className="font-bold text-lg text-text mb-2 font-sans">回程 (Inbound)</h3>
            <div className="space-y-1 text-sm text-[#666]">
              <p>濟州 (CJU) - 台北 (TPE)</p>
              <p className="font-medium text-wine">{data.flights[1].date}</p>
              <p>{data.flights[1].time}</p>
            </div>
          </div>
          {/* 行李 (移除圖片) */}
          <div className="bg-white p-6 rounded-sm shadow-sm border border-[#E6E4DD]">
            <div className="mb-4 h-32 bg-[#F5F5F5] flex items-center justify-center rounded text-[#CCC]"><Luggage size={40} strokeWidth={1}/></div>
            <h3 className="font-bold text-lg text-text mb-2 font-sans">行李額度 (Baggage)</h3>
            <div className="space-y-2 text-xs text-[#666]">
              {data.baggageInfo.map((info, i) => (
                <div key={i} className="border-b border-[#F0F0F0] pb-1 mb-1 last:border-0">
                  <span className="font-bold block text-[#444]">{info.type}</span>
                  <span>{info.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. 住宿資訊 */}
      <section><SectionTitle icon={<Bed size={20} strokeWidth={1.5} />} title="住宿 Accommodation" /><div className="space-y-6 mt-6">{data.hotels.map((hotel, idx) => (<div key={idx} className="bg-white p-8 rounded-sm shadow-sm border border-[#E6E4DD]"><div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4"><h3 className="text-xl font-sans font-bold text-text">{hotel.name} <span className="text-sm font-normal text-[#888] ml-2">{hotel.engName}</span></h3><span className="text-xs bg-[#F5F4F0] px-2 py-1 mt-2 md:mt-0 rounded text-[#888] tracking-widest">{hotel.nights} NIGHTS</span></div><div className="grid md:grid-cols-2 gap-4 text-sm text-[#666] mb-6"><div><span className="block text-xs text-[#AAA] mb-1">CHECK-IN</span>{hotel.checkIn}</div><div><span className="block text-xs text-[#AAA] mb-1">CHECK-OUT</span>{hotel.checkOut}</div><div><span className="block text-xs text-[#AAA] mb-1">ADDRESS</span>{hotel.address}</div></div>
      <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-[#F0F0F0]">
        {/* 住宿地圖按鈕 */}
        {hotel.link && <a href={hotel.link} target="_blank" rel="noreferrer" className="flex items-center justify-center px-4 py-2 bg-wine text-white text-xs tracking-widest rounded hover:bg-coffee transition-colors gap-2 font-bold"><span>VIEW MAP</span><ArrowRight size={14}/></a>}
        {/* 停車與指南按鈕 (深灰色塊) */}
        {hotel.parkingInfo && <button className="flex items-center justify-center px-4 py-2 bg-[#666] text-white text-xs tracking-widest rounded hover:bg-[#444] transition-colors" onClick={() => alert(hotel.parkingInfo)}>停車資訊</button>}
        {hotel.guideLink && <a href={hotel.guideLink} target="_blank" rel="noreferrer" className="flex items-center justify-center px-4 py-2 bg-[#666] text-white text-xs tracking-widest rounded hover:bg-[#444] transition-colors">住宿指南</a>}
      </div></div>))}</div></section>
      
      {/* 3. 租車資訊 */}
      <section><SectionTitle icon={<Car size={20} strokeWidth={1.5} />} title="租車資訊 Car Rental" /><div className="bg-white p-8 rounded-sm border border-[#E6E4DD] mt-6"><div className="flex justify-between items-start mb-6"><div><p className="text-xs text-[#888] tracking-widest uppercase mb-1">ORDER ID</p><p className="text-2xl font-sans tracking-wide text-text font-bold">{data.carRental.orderId}</p></div><div className="bg-[#F5F4F0] p-2 rounded"><Car size={24} strokeWidth={1} className="text-[#CCC]"/></div></div><div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-[#F0F0F0]"><div className="space-y-1"><p className="text-xs text-[#AAA]">PERIOD</p><p className="font-bold text-[#444]">{data.carRental.period}</p></div><div className="space-y-1"><p className="text-xs text-[#AAA]">LOCATION</p><p className="font-bold text-[#444]">{data.carRental.location}</p>
      <a href={data.carRental.link} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-4 py-2 bg-wine text-white text-xs tracking-widest rounded hover:bg-coffee transition-colors gap-2 mt-2 font-bold"><span>VIEW MAP</span><ArrowRight size={14}/></a></div></div></div></section>
      
      {/* 4. 退稅 */}
      <section>
        <SectionTitle icon={<CreditCard size={20} strokeWidth={1.5} />} title="退稅攻略 Tax Refund" />
        <div className="bg-white p-6 rounded-sm shadow-sm border border-[#E6E4DD] mb-6">
          <p className="text-sm text-[#666] mb-6 border-l-2 border-wine pl-3">門檻：消費滿 ₩30,000 即可退稅。店家會貼有 Tax Refund 標誌。</p>
          <div className="grid md:grid-cols-2 gap-4">
            {data.taxRefund.map((item, idx) => (
              <div key={idx} onClick={() => onItemClick(item)} className="p-5 border border-[#E6E4DD] hover:border-wine/30 hover:bg-[#FAFAFA] cursor-pointer transition-all flex items-center justify-between group">
                 <span className="font-bold text-text group-hover:text-wine font-sans">{item.title}</span>
                 <ArrowRight size={16} className="text-[#ccc] group-hover:text-wine transition-colors"/>
              </div>
            ))}
          </div>
          {/* 新增退稅連結 */}
          <div className="mt-4 flex justify-end">
             <a href="https://djbcard.com/koreataxrefund/" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-xs font-bold tracking-widest text-wine hover:text-coffee transition-colors border-b border-wine pb-1">
               <span>READ MORE</span> <ArrowRight size={14} />
             </a>
          </div>
        </div>
      </section>

      {/* 5. 緊急電話 */}
      <section>
        <SectionTitle icon={<Phone size={20} strokeWidth={1.5} />} title="緊急電話 Emergency" />
        <div className="bg-white rounded-sm shadow-sm border border-[#E6E4DD] overflow-hidden">
          <table className="w-full text-sm text-left text-[#666]">
            <thead className="text-xs text-text uppercase bg-[#F5F4F0]">
              <tr>
                <th className="px-6 py-4 font-sans font-bold">服務</th>
                <th className="px-6 py-4 font-sans font-bold">電話</th>
                <th className="px-6 py-4 font-sans font-bold">說明</th>
              </tr>
            </thead>
            <tbody>
              {data.emergency.map((item, idx) => (
                <tr key={idx} className="border-b border-[#F0F0F0] hover:bg-[#FAFAFA] last:border-0">
                  <td className="px-6 py-4 font-medium text-text">{item.name}</td>
                  <td className="px-6 py-4 font-bold text-wine font-mono">{item.number}</td>
                  <td className="px-6 py-4 text-[#888]">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-12">
        <div><SectionTitle icon={<Shirt size={20} strokeWidth={1.5} />} title="穿搭建議 Weather & Wear" /><div className="mt-6 space-y-6"><div className="space-y-3">{data.clothing.layers.map((l, i) => (<div key={i} className="flex items-center text-sm border-b border-[#EEE] pb-3 last:border-0"><span className="w-20 font-bold text-[#AA9988] text-xs uppercase tracking-wider">{l.part}</span><div className="flex-1"><span className="text-text font-medium block mb-1">{l.item}</span><p className="text-[10px] text-[#999]">{l.note}</p></div></div>))}</div></div></div>
        <div><SectionTitle icon={<ShoppingBag size={20} strokeWidth={1.5} />} title="必帶物品 Checklist" /><div className="mt-6 grid grid-cols-2 gap-3">{data.packing.map((item, i) => (<div key={i} className="flex items-center space-x-2 text-sm text-[#555]"><div className="w-1.5 h-1.5 rounded-full bg-[#CCC]" /><span>{item}</span></div>))}</div></div>
      </section>
      
      <MemoSection />
    </motion.div>
  );
}

function MemoSection() {
  const [memo, setMemo] = useState('');
  const [saved, setSaved] = useState(false);
  useEffect(() => { setMemo(localStorage.getItem('jeju-personal-memo') || ''); }, []);
  const handleChange = (e) => {
    const val = e.target.value;
    setMemo(val);
    localStorage.setItem('jeju-personal-memo', val);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div className="bg-white p-8 rounded-sm shadow-sm border border-[#E6E4DD] mt-8">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#F0F0F0]">
        <h3 className="font-sans font-bold text-lg text-text flex items-center"><BookOpen size={20} strokeWidth={1.5} className="mr-2 text-wine"/> 旅行備忘錄</h3>
        {saved && <span className="text-xs text-green-600 flex items-center bg-green-50 px-2 py-1 rounded"><CheckCircle size={12} className="mr-1"/> 已儲存</span>}
      </div>
      <textarea 
        className="w-full h-40 p-4 border border-[#DDD] rounded focus:outline-none focus:border-wine text-sm leading-relaxed resize-none text-text placeholder:text-[#CCC] bg-[#FAFAFA]"
        placeholder="想說什麼就寫什麼，你的專屬景點筆記空間..."
        value={memo}
        onChange={handleChange}
      />
    </div>
  );
}

function HikingView({ data }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 py-12">
      <div className="relative rounded-xl overflow-hidden mb-12 h-64 md:h-80 shadow-lg"><img src={data.headerImage || 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2076&auto=format&fit=crop'} alt="Hallasan" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 flex items-center justify-center flex-col text-white"><h1 className="text-4xl font-sans mb-2 text-white">Hallasan Hiking</h1><p className="tracking-widest text-sm opacity-90 text-white">漢拏山 • 雪地健行攻略</p></div></div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-12">
          <section><h3 className="text-xl font-sans text-text mb-4 flex items-center"><MapPin className="mr-2" size={18} strokeWidth={1.5} /> 路線資訊</h3><div className="bg-white p-6 rounded border border-[#E6E4DD] space-y-4"><div className="flex justify-between items-start border-b border-[#F0F0F0] pb-4"><div><h4 className="font-bold text-lg text-text">{data.route.name}</h4><p className="text-sm text-[#666] mt-1">{data.route.desc}</p></div><div className="text-right"><span className="block text-2xl font-light text-wine">{data.route.distance}</span><span className="text-xs text-[#888]">總距離</span></div></div><div className="grid grid-cols-2 gap-4 text-sm"><div><span className="block text-[#888] text-xs mb-1">預計耗時</span><span className="font-medium text-[#444]">{data.route.duration}</span></div><div><span className="block text-[#888] text-xs mb-1">預計氣溫</span><span className="font-medium text-[#444]">{data.route.temp}</span></div></div></div></section>
          <section><h3 className="text-xl font-sans text-text mb-4 flex items-center"><AlertCircle className="mr-2" size={18} strokeWidth={1.5} /> 裝備指南</h3><div className="space-y-4">{data.gear.map((g, i) => (<div key={i} className="flex bg-white p-4 rounded border border-[#E6E4DD]"><div className="w-24 flex-shrink-0 font-bold text-[#888] text-sm uppercase">{g.item}</div><div className="text-sm text-text leading-relaxed">{g.desc}</div></div>))}</div></section>
        </div>
        <div className="space-y-8"><div className="bg-text text-[#F5F4F0] p-6 rounded shadow-lg"><h4 className="text-lg font-sans mb-4 border-b border-gray-600 pb-2">裝備租借</h4><p className="font-bold text-xl mb-1 text-white">{data.rental.shop}</p>
        {/* 爬山地圖連結按鈕化 */}
        <a href={data.rental.link} target="_blank" rel="noreferrer" className="flex items-center justify-center px-4 py-2 bg-wine text-white text-xs tracking-widest rounded hover:bg-coffee transition-colors gap-2 mt-4 font-bold"><span>VIEW MAP</span><ArrowRight size={14}/></a>
        <div className="space-y-4 text-sm mt-4"><div><span className="block text-[#888] text-xs mb-1">借用時間</span><p className="text-white/90">{data.rental.time}</p></div>{/* 移除警告 */}</div></div></div>
      </div>
    </motion.div>
  );
}

function ScheduleView({ schedule, activeDay, onDayChange, onItemClick, getRouteItems }) {
  const dayData = schedule[activeDay];
  const routeItems = getRouteItems(activeDay);
  return (
    <div className="min-h-screen pb-20">
      <div className="sticky top-16 z-30 bg-bg/95 backdrop-blur border-b border-[#E6E4DD] overflow-x-auto scrollbar-hide"><div className="flex justify-start md:justify-center min-w-max px-4">{Object.values(schedule).map((day) => (<button key={day.id} onClick={() => onDayChange(day.id)} className={`px-6 py-4 text-sm tracking-widest transition-colors border-b-2 ${activeDay === day.id ? 'border-wine text-wine font-bold' : 'border-transparent text-[#999] hover:text-text'}`}>{day.id.toUpperCase().replace('DAY', 'DAY ')}</button>))}</div></div>
      <motion.div key={activeDay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative h-[40vh] md:h-[50vh] w-full"><div className="absolute inset-0 bg-black/40" /><img src={dayData.banner} alt="Banner" className="w-full h-full object-cover" /><div className="absolute bottom-0 left-0 p-8 md:p-12 text-white bg-gradient-to-t from-black/80 to-transparent w-full"><p className="tracking-[0.2em] text-sm mb-2 opacity-90 text-white">{dayData.date} • {dayData.id.toUpperCase()}</p><h2 className="text-3xl md:text-5xl font-sans font-light text-white">{dayData.title}</h2></div></motion.div>
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-8 relative z-10 space-y-12">
        <div className="bg-white rounded shadow-xl shadow-[#00000005] border border-[#EBE9E4] overflow-hidden">
          <div className="p-6 border-b border-[#F0F0F0] bg-white/50 sticky top-0 flex justify-between items-center"><h3 className="text-xs font-bold tracking-[0.2em] text-[#888] uppercase flex items-center"><MapPin size={14} strokeWidth={1.5} className="mr-2"/> Main Route</h3><span className="text-[10px] text-[#AAA]">點擊項目查看詳情</span></div>
          <div className="divide-y divide-[#F0F0F0]">{routeItems.map((item, idx) => (<div key={idx} onClick={() => onItemClick(item)} className="p-6 hover:bg-[#FAF9F6] transition-colors flex gap-6 cursor-pointer group"><div className="w-16 flex-shrink-0 text-right font-medium text-text font-sans pt-1">{item.time}</div><div className="flex-1 border-l-2 border-[#F0F0F0] pl-6 relative"><div className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-[#E6E4DD] border-2 border-white group-hover:bg-wine transition-colors" /><h4 className="text-lg font-medium text-text group-hover:text-wine font-sans">{item.place}</h4><p className="text-xs font-bold text-[#AA9988] tracking-wider uppercase mb-1">{item.title}</p><p className="text-sm text-[#666] font-light mb-2 line-clamp-1">{item.desc || item.note}</p><div className="flex items-center text-xs text-coffee opacity-0 group-hover:opacity-100 transition-opacity">查看更多 <ChevronRight size={12} className="ml-1"/></div></div></div>))}</div>
        </div>
        <HorizontalSection title="Nearby Food 美食" icon={<Utensils size={16} strokeWidth={1.5}/>} items={dayData.food} onItemClick={onItemClick} />
        <HorizontalSection title="Coffee & Dessert 咖啡甜點" icon={<Coffee size={16} strokeWidth={1.5}/>} items={dayData.cafe} onItemClick={onItemClick} />
        <HorizontalSection title="Backup Plan 備案" icon={<AlertCircle size={16} strokeWidth={1.5}/>} items={dayData.backup} onItemClick={onItemClick} />
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
          <div key={idx} onClick={() => onItemClick(item)} className="flex-shrink-0 w-64 bg-white border border-[#E6E4DD] p-5 rounded snap-center hover:shadow-md transition-shadow cursor-pointer group">
            {/* 純文字卡片 */}
            <h4 className="font-bold text-text mb-1 font-sans">{item.name}</h4>
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
  return <div className="flex items-center space-x-3 border-b border-[#E6E4DD] pb-2 mb-4"><span className="text-[#2C2C2C]">{icon}</span><h3 className="text-lg font-sans text-[#2C2C2C]">{title}</h3></div>;
}
