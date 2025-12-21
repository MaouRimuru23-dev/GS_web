// ===============================
// CONFIGURACIÓN
// ===============================

const container = document.getElementById("unit-container");

const ELEMENT_COLORS = {
  1: "#c0392b", // Fire
  2: "#2980b9", // Water
  3: "#27ae60", // Earth
  4: "#f1c40f", // Light
  5: "#8e44ad"  // Dark
};
const RAREZA_ES = {
  "覚醒～超覚醒": "Awakening ~ Ascended",
  "★5～覚醒": "★5 ~ Awakening",
  "★5～夢幻": "★5 ~ Dream Awakening"
};
const ELEMENT_ES = {
  "火": "Fuego",
  "水": "Agua",
  "樹": "Tierra",
  "光": "Luz",
  "闇": "Oscuridad"
};
const RAZAS_ES = {
  "神族": "Dios",
  "人族": "Humano",
  "精霊族": "Espíritu",
  "魔族": "Demonio",
  "獣族": "Bestia",
  "竜族": "Dragón",
  "機族": "Maquina",
  "巨人族": "Gigante"

};
const ROLES_ES = {
  "サポーター": "Soporte",
  "アタッカー": "Atacante",
  "物理アタッカー": "Atacante",
  "魔法アタッカー": "Atacante",
  "サブアタッカー": "Sub DPS",
  "ディフェンダー": "Defensor",
  "ヒーラー": "Sanador"
};
function t(map, value) {
  return map[value] || value;
}
const JP_TERMS = {
  "物理ダメージ": "daño físico ",
  "魔法ダメージ": "daño mágico ",
  "UP": "aumenta ",
  "DOWN": "reduce ",
  "秒間": "segundos ",
  "味方全体": "todos los aliados ",
  "自身": "el usuario ",
  "(重複なし)":"(No Stackea) ",
  "(重複あり)": "(Stackea) ",
  "奥義ゲージ":"Barra de Arts ",
  "超奥義":"Super Arts ",
  "真奥義":"True Arts ",
  "奥義": "Arts ",
  "スキル":"Skill ",
  "ブレイク":"BREAK ",
  "光属性":"Elemeto Luz ",
  "火属性":"Elemeto Fuego ",
  "水属性":"Elemeto Agua ",
  "樹属性":"Elemeto Tierra ",
  "闇属性":"Elemeto Oscuridad ",
  "の": "de ",
  "マギアドライブ":"Magia Drive ",
  "ロード・オブ・フェザー": "Lord of Feathers ",
  "中": "dentro ",
  "ダメージ":"Daño ",
  "クエスト開始時": "Al inicio de la quest ",
  "クエスト":"Quest ",
  "アンリミテッド":"Magia Unlimited ",
  "神装解放":"Divine Liberation ",
  "バレット": "Phantom Bullet",
  "大奥義":"Mega Arts ",
"大スキル":"Mega Skill ",
"カイガン": "Third Eye",
"シンカイガン": "True Third Eye",
};
const SKILL_SECTIONS = {
  super_arts: "SUPER ARTS",
  true_arts: "TRUE ARTS",
  arts: "ARTS",
  skill: "SKILL",
  bullet: "PHANTOM BULLET",
  divine: "DESPERTAR DIVINO",
  grand: "MEGA ARTS",
  special: "MEGA SKILL",
  link: "CROSS ARTS"
};

const NOMBRES_ES = {
"EDEN-typeΩ":"",
"No.2":"",
"SX-602型Limited":"",
"うそつきセリア":"",
"かき鳴らす熱狂コスモ":"",
"アイラ":"",
"アインズ":"",
"アクセラレータ":"",
"アシㇼパ":"",
"アズエル":"",
"アッシュ":"",
"アトラ":"",
"アフラ=ドラギム":"",
"アマネ":"",
"アリステラ・オルビス":"",
"アルカナ":"",
"アルファ":"",
"アルベド":"",
"アンジェラス":"",
"アンリエッタ":"",
"イスリーダ皇帝":"",
"イビルアイ":"",
"イビル・ポーラ":"",
"イリス":"",
"イリヤ":"",
"インデックス":"",
"イーグル":"",
"エスト":"",
"エチカ":"",
"エミリア":"",
"エミー":"",
"エリス":"",
"エルザ・スカーレット":"",
"エレノア":"",
"エレンス":"",
"エンプレス":"",
"オイカッツォ":"",
"オカルン":"",
"オーンゴード":"",
"オーヴェル":"",
"カイザーX・ガナン":"",
"カズレーザー":"",
"カティ・ソフィ":"",
"カナリア":"",
"ガナン":"",
"ガロウ":"",
"キサラギ":"",
"キリサメ":"",
"キリンR・リーゼ":"",
"キングダキュオン":"",
"キングピキュオン":"",
"キングミキュオン":"",
"キングモキュオン":"",
"キングレキュオン":"",
"ギリアム":"",
"ギンゾウ":"",
"ギンゾウ＜陣備え＞":"",
"クロエ":"",
"グランガロード":"",
"グラード":"",
"グレイ・フルバスター":"",
"グロイツ":"",
"グロヴォーグ":"",
"ケイン":"",
"コクリ":"",
"コログラン":"",
"ゴブリンスレイヤー":"",
"サイガ-0":"",
"サイクロプス":"",
"サイタマ":"",
"サク":"",
"サクヤ":"",
"サンラク":"",
"サーディオン":"",
"シオン(サンタver)":"",
"シキ":"",
"シグニット":"",
"システィーナ":"",
"シズ":"",
"シモン":"",
"シャウラ":"",
"シャドウ":"",
"シャルティア":"",
"シャルロット":"",
"シュタルク":"",
"シュナ(和装ver)":"",
"シュリ":"",
"シュローザー":"",
"シルフィエット":"",
"シーリア":"",
"ジェイ":"",
"ジェノス":"",
"ジジ":"",
"ジュノー":"",
"ジンオウX・レイアス":"",
"スキュラ":"",
"ストレングス":"",
"スピニシオス":"",
"セティス":"",
"セティス【天地】":"",
"セラ":"",
"ゼイオルグ":"",
"ゼファー":"",
"ソフィ":"",
"タケミチ":"",
"タマエ":"",
"ディアブロ":"",
"ディムローバ":"",
"デッドマスター":"",
"デミウルゴス":"",
"デューク":"",
"デルタ":"",
"ドラケン":"",
"ナターシャ":"",
"ナツ・ドラグニル":"",
"ナーベラル":"",
"ニーア":"",
"ノエル":"",
"ノルン":"",
"ハイゴブル":"",
"ハイランダー":"",
"ハオ":"",
"ハクロウ":"",
"ハズキ":"",
"ハルト":"",
"ハルト-Xi-":"",
"ハロウィンシャルロット":"",
"ハロウィンフォルテ":"",
"ハロウィンヴァレリー":"",
"バクー":"",
"バティスト":"",
"バレンタインシスティーナ":"",
"バレンタインプリシラ":"",
"バレンタインミランダ":"",
"バレンタインリザ":"",
"ヒューマ":"",
"ヒーロー サイタマ":"",
"ビッグフレイド":"",
"ファフニール":"",
"フィトリア":"",
"フィーロ":"",
"フェマシューザ":"",
"フェルン":"",
"フェン":"",
"フリーレン":"",
"ブラッディバット":"",
"プリシラ":"",
"プリシラ-Is-":"",
"ベアトリス":"",
"ベニマル":"",
"ベリック":"",
"ベータ":"",
"ペンシルゴン":"",
"ボロス":"",
"マイキー":"",
"マリカ":"",
"マールゼクス":"",
"マーレット":"",
"ミズキ":"",
"ミゼット":"",
"ミツネS・ロイ":"",
"ミモーザス":"",
"ミラ":"",
"ミランダ":"",
"ミリム":"",
"ミリム(サンタver)":"",
"ミリム(和装ver)":"",
"ミリム戦闘形態":"",
"ミーナス":"",
"メリア":"",
"メル=ヴァーラ":"",
"メルティ":"",
"モノケロース":"",
"モモ":"",
"モモン":"",
"ユナ":"",
"ユーベル":"",
"ラグシェルム":"",
"ラグドベイオス":"",
"ラダック":"",
"ラフタリア":"",
"ラム":"",
"ラーク":"",
"リアナ":"",
"リザ":"",
"リムル":"",
"リムル(サンタver)":"",
"リムル(スライムver)":"",
"リムル(和装ver)":"",
"リヴィエラ":"",
"リヴィエラ【深淵】":"",
"リーゼ":"",
"ルアン":"",
"ルアーナ":"",
"ルーシィ・ハートフィリア":"",
"ルーデウス":"",
"レイアR・イリス":"",
"レイアス":"",
"レウスネコ・アイルー":"",
"レオーネ":"",
"レム":"",
"ロイ":"",
"ロキシー":"",
"ロゼッタ":"",
"ロン":"",
"ワールドエンド・レオーネ":"",
"ヴァルティー":"",
"ヴァルティー-Lr-":"",
"ヴァレリー":"",
"ヴィクトワール":"",
"ヴィラーゴ":"",
"ヴェナ":"",
"ヴェルザード":"",
"ヴェルドラ":"",
"ヴォックス":"",
"万霊騎皇エルメシオ":"",
"三ツ谷":"",
"上条当麻":"",
"亜左弔兵衛":"",
"光竜騎神メリッサ":"",
"六魔使后ミクス":"",
"冥宵竜神バロッサ":"",
"冥獣ギリウス":"",
"冥翼魔后リフィリー":"",
"冥華魔后ポーラ":"",
"冥葬鎌妃神リリー":"",
"冥鎌貴神シビル":"",
"冥魔槍后ミーズィナ":"",
"冥黒騎皇レグルス":"",
"凛&ルヴィア":"",
"凛舞大鎌ベロニカ":"",
"凶戦士ダラン":"",
"刀神ルアン":"",
"初音ミク":"",
"剣士ベリック":"",
"剣鬼ベリック":"",
"創成の申し子アルル":"",
"創造邪精ストラフ":"",
"十二代目ミズキ":"",
"千冬":"",
"原典の魔女セリア":"",
"双翠剣皇アルス":"",
"双聖騎神フィーナ":"",
"双豪の義后カティロ":"",
"双銃冥皇ゼクト":"",
"叡天騎帥パロット":"",
"叡樹巨神オルゲス":"",
"古竜神妃ファブル":"",
"唯海神ハーク":"",
"国謀幻帥ジル":"",
"土方歳三":"",
"地動戦鬼ガーラン":"",
"地獄のフブキ":"",
"堅樹鎧王グラデス":"",
"壊魂滅神ゼノン":"",
"夢幻魔后シャシャ":"",
"大盗賊クロウ":"",
"天主シーリア":"",
"天雷大神リオティス":"",
"奉凰慈聖フェレス":"",
"女神官":"",
"妖精弓手":"",
"封神狐后ジーラ":"",
"山田浅ェ門佐切":"",
"岩谷尚文":"",
"巨兵煌姫ファロン":"",
"巨神愛姫ユミィ":"",
"幻創神樹バルハラ":"",
"幻奏影師ゼクス":"",
"幻聖プラチナ":"",
"彩忍ロゼッタ":"",
"御坂美琴":"",
"心の抱擁者アーシュリー":"",
"志々雄真実":"",
"快殺魔神ボーゲン":"",
"恐山アンナ":"",
"悠碧の聖護神クオン":"",
"戦慄のタツマキ":"",
"戦神獣王ロッズ":"",
"戸愚呂(弟)":"",
"撃滅の焔機神ソレイユ":"",
"操死魔后アルティ":"",
"救済の奏者リッツ":"",
"斎藤一":"",
"断無剣聖ノギア":"",
"星剣使いヴァレリー":"",
"星槍の翼神システィーナ":"",
"星章剣士ロゼッタ":"",
"星華弓聖マモリ":"",
"時空魔導卿アルマ":"",
"暁天剣神エタニア":"",
"暗黒魔導オグナード":"",
"杉元佐一":"",
"杠":"",
"桑原和真":"",
"桜ミク":"",
"桜華一刀流ミラ":"",
"武神竜帥ロスト":"",
"殲滅の怨魔神リオン":"",
"水着イリス":"",
"水着イリヤ":"",
"水着クロエ":"",
"水着システィーナ":"",
"水着シーリア":"",
"水着ジュノー":"",
"水着バゼット":"",
"水着フェン":"",
"水着ミラ":"",
"水着リザ":"",
"水着リヴィエラ":"",
"水着ルヴィア&凛":"",
"水着レオーネ":"",
"水着ロゼッタ":"",
"水着美遊":"",
"水着間桐桜":"",
"水神剣帝ノア":"",
"氷界の魔凍妃セリア":"",
"氷藍獣姫ターニャ":"",
"氷魔槍皇ヴィッツ":"",
"浄魔聖師バレンティア":"",
"浦飯幽助":"",
"海賊帝グラッフル":"",
"満艦飾 マコ":"",
"溢れる想像力レイン":"",
"滅壊機神ラプレ":"",
"滅界鬼神フォスレ":"",
"漆黒の神燕アイリ":"",
"漆黒の銃聖ライラ":"",
"漆黒剣皇ケイン":"",
"漆黒銃皇フェン":"",
"瀑麗神后ヨミ":"",
"烈華ミラ":"",
"焔刃の鬼神オーヴェル":"",
"焔志獣神クルト":"",
"焔獄巨神ゾルダス":"",
"焔竜騎神アロスデア":"",
"焔統神イフリート":"",
"焔聖護神アンナ":"",
"焔豪剣士オルガ":"",
"煌忍烈機ジャック":"",
"煌炎の守護精フェルド":"",
"煌炎烈后リオネ":"",
"煌華剣神タリス":"",
"熾天盾聖サンストン":"",
"熾炎の小隊長シャルロット":"",
"燦煌射才アルズ":"",
"燼滅獄炎竜テリオドス":"",
"犬牟田 宝火":"",
"狂戮魔皇グロール":"",
"狼殺銃神スライ":"",
"猿投山 渦":"",
"獣召魔煌ピエンツ":"",
"獣皇ヴァルド":"",
"獣神拳后シンシア":"",
"瑞麗占姫ティア":"",
"画眉丸":"",
"百獣姫レン":"",
"相楽左之助":"",
"真識竜帥ルーヴェ":"",
"破壊の銃姫アメル":"",
"碧命剣聖ヴォーグ":"",
"碧愛師聖マキナス":"",
"碧閃剣騎フィリア":"",
"碧魔降帥ディアス":"",
"祝命献姫アルシェ":"",
"神出砲姫コートニー":"",
"神剣舞后メルティ":"",
"神弧の画聖スミレ":"",
"神星リザ":"",
"神機総帥ヴィシャス":"",
"神滅の狂騎神アバドン":"",
"神滅兵器ヴァイド":"",
"神焔剣聖グラン=ブレイブ":"",
"神焔忍姫ホノカ":"",
"神焔騎皇ラグナ":"",
"神煌聖騎プラチナ":"",
"神燃導獅ヴァーミリア":"",
"神狂究帥カイト":"",
"神眼聖姫クーシー":"",
"神竜聖匠ロディア":"",
"神霊槍妃デイシー":"",
"神魔皇帝フリード":"",
"神魔統帥シーリア":"",
"禁破狂獣ゼルカラ":"",
"秘謀の調停者カテミラ":"",
"究至剣神ラサオウ":"",
"竜克騎神ウィーバ":"",
"竜牙兵":"",
"竜軍将帥ジェラルド":"",
"精霊メオール":"",
"精霊神妃ミュゼ":"",
"紅炎獣姫ミリーニャ":"",
"紅蓮斧姫フィアナ":"",
"終視姫聖エンド":"",
"絶天神マールゼクス":"",
"絶氷剣后コルセア":"",
"絶零殺竜グラニス":"",
"緋村剣心":"",
"縛封恐羅リゴール":"",
"纏 流子":"",
"羅将オロチ":"",
"羅岩ドーグル":"",
"美遊":"",
"翠神帝姫ベル":"",
"翼仰騎士エルザ":"",
"聖天覇神ニース":"",
"聖樹弓神アシュ・トト":"",
"聖盾神騎デュラン":"",
"聖護神威イオ":"",
"聖騎士ロイ":"",
"若きイスリーダ皇帝":"",
"英将魔神レボル":"",
"蒼氷麗刃メリア":"",
"蒼碧術姫アデル":"",
"蒼華神輝ガイア":"",
"蒼輝の獣神エルファラ":"Empyreal Beast Elfalla",
"蔵馬":"Kurama",
"虚構魔術士ハルト":"Hart the Fabricator",
"蛇崩 乃音":"Nonon Jakuzure",
"蟇郡 苛":"Ira Gamagoori",
"衛宮士郎":"Shirou Emiya",
"覇弓騎凰ケオネス":"Fiery Archer Keiones",
"覇煌剣神クライド":"Clyde, the Crimson Sword God",
"覇煌竜神ダルギオン":"Fatewyrm Dargeon",
"覇獣神后シャディ":"Divine Beast Empress Shadie",
"覇獣魔王ザール":"Savage Dynasty Saar",
"誅神超騎ゼクシア":"Heavenly Executioner Zechsia",
"諜戮滅魔ミレニア":"Blood Devil Spy Millenia",
"護焔巨神バドル":"Hades Gigant Guardian Badoul",
"護神竜后ネリム":"Dragon Guardian Empress Nerim",
"豪剣覇皇ルーダ":"Sword Ruler Ruda",
"豪炎拳姫ディアナ":"Diana, of the Blazing Fist",
"貫いた理想サリサ":"Percing Paragon Salyssa",
"超オーヴェル":"Granverge D. Orvell",
"超機動兵エドラム":"Mega Mobile soldier Edram",
"軍神フェン":"War Hero Fen",
"転魔狂神カイアス":"Fallen Creato Kayas",
"輝焔斧后リシュリー":"Blazing Axe Empress Rishley",
"迅勇幻神サイ":"Swift Brave Phantom God Sai",
"迅雷弓帝ファル":"Hunter Phalle",
"運命を超えしイスリーダ皇帝":"Isliid, Human Pinacle",
"道蓮":"Tao Ren",
"醒魔槍神アルヴィナ":"Icicle Spear Goddesss Alvina",
"針目 縫":"Harime Nui",
"銃覇帝ヴォイド":"Gunnman Void",
"閃神槍覇レイオン":"Radiant Spear God Reyon",
"閃耀の演者シャロン":"Brilliant Actress Sharon",
"闇竜騎神ワーグル":"God of Dark Dragons Wargul",
"闇軍統妃フォルテ":"Twilight Commander Forte",
"闘神竜将ゾロアス":"Gracious Warrior Zoroas",
"闘竜軍神エイシス":"Venom Queen Dragoness Aesis",
"雷哮剣鬼ライザー":"Roaring Blade Raizer",
"霊焔剣后リアン":"Flame Spirit Empress Lian",
"霊視魔后ソニエ":"Empress of Spirit Worl Sonije",
"静聖神パルラミシア":"Virtuos Torch Vermilia",
"音速のソニック":"Speed-o'-sound Sonic",
"飛影":"Hiei",
"駆け抜ける焔ロイ":"Bullet Hell Roy",
"騎砲黒神ダリア":"Magical Shadow Goddess Dahlia",
"高僧リーダ":"High Priest Leader",
"鬼龍院 皐月":"Satsuki Kiryuin",
"魔剣英雄ゼイオルグ":"Hero of Darkness Zeorg",
"魔壊封妃アリステラ":"Queen of Ancient Powers Aristela",
"魔王リムル":"Demon Lord Rimuru",
"魔王リムル(和装ver)":"Demon Lord Samurai Rimuru",
"魔王ヴォックス":"Demon Lord Vox",
"魔神臣姫ココ":"Evil Demon Empress Coco",
"魔神術卿オンファン":"Lord of Black Art Oufan",
"魔翼剣豪ラキ":"Dark Winged Swordsman Raki",
"鳳神輝皇ダキ":"Shining Winged Emperor Daki",
"麗艶亡姫メイラ":"Beautiful Death Meira",
"麻倉 葉":"Asakura Yoh",
"黎明の翠エリザベス":"Elizabeth the Dawnfounder",
"黒化英霊セイバー":"Saber Alter",
"黒猫探偵リーゼ":"Black Cat Detective Liese",
};
const RAZA_ID_ES = {
  1: "humano",
  2: "gigante",
  3: "dragon",
  4: "bestia",
  5: "maquina",
  6: "espiritu",
  7: "dios",
  8: "demonio"
};
function nombreES(nombreJP) {
  const es = NOMBRES_ES[nombreJP];
  return (es && es.trim() !== "") ? es : nombreJP;
}


function translateText(text) {
  let result = text;
  Object.keys(JP_TERMS).forEach(jp => {
    result = result.replaceAll(jp, JP_TERMS[jp]);
  });
  return result;
}

// ===============================
// ESTADO GLOBAL
// ===============================

let units = [];
let currentElement = "all";
let currentRare = "all";
let searchText = "";
let cardFace = 0; // 0=front, 1=skills, 2=passives
let imgIndex = 0;
let currentImages = [];
let suppressFlip = false;
let currentRace = "all";



const loading = document.getElementById("loading");

// ===============================
// FETCH INICIAL
// ===============================

loading.classList.remove("hidden");
container.classList.add("hidden");

fetch("/api/units")
  .then(res => {
    if (!res.ok) throw new Error("API error " + res.status);
    return res.json();
  })
  .then(data => {
    units = data;

    loading.classList.add("hidden");
    container.classList.remove("hidden");

    applyFilters(); // o renderUnits(units)
  })
  .catch(err => {
    console.error("Error cargando unidades:", err);

    loading.innerHTML = `
      <p style="color:#f87171">Error cargando unidades</p>
    `;
  });


// ===============================
// FILTROS
// ===============================
function applyFilters() {
  const filtered = units.filter(u => {

    // =====================
    // ELEMENTO
    // =====================
    if (currentElement !== "all" && u.elemento !== Number(currentElement)) {
      return false;
    }

    // =====================
    // RAREZA
    // =====================
    if (currentRare !== "all" && u.rareza !== Number(currentRare)) {
      return false;
    }

    // =====================
    // RAZA (JP → ES)
    // =====================

if (currentRace !== "all") {
  const raceES = RAZA_ID_ES[u.raza];

  if (!raceES) return false;        // ⬅️ excluir si no hay raza válida
  if (raceES !== currentRace) return false;
}


    // =====================
    // BÚSQUEDA
    // =====================
    if (searchText) {
      const jp = (u.nombre_jp || "").toLowerCase();
      const es = (nombreES(u.nombre_jp) || "").toLowerCase();
      if (!jp.includes(searchText) && !es.includes(searchText)) {
        return false;
      }
    }

    return true;
  });

  renderUnits(filtered);
}


// ===============================
// RENDER
// ===============================

function renderUnits(list) {
  container.innerHTML = "";

  list.forEach(unit => {
    const card = document.createElement("div");
    card.className = "card";

    const color = ELEMENT_COLORS[unit.elemento] || "#2c3e50";
    card.style.borderColor = color;
    card.style.boxShadow = `0 0 12px ${color}`;

    card.innerHTML = `
      <img src="${unit.imagen}" alt="${unit.nombre_jp}" width="60" height="60">
      <div class="name">${nombreES(unit.nombre_jp)}</div>
    `;

    card.addEventListener("click", () => {
  openUnitCard(unit.id);
});

    container.appendChild(card);
  });
}

// ===============================
// FICHA INDIVIDUAL (BASEBALL CARD)
// ===============================

function openUnitCard(unitId) {
  fetch(`/api/unit/${unitId}`)
    .then(res => res.json())
    .then(data => {
      renderBaseballCard(data);
    })
    .catch(err => console.error("Error cargando ficha:", err));
}

function renderBaseballCard(data) {
  const modal = document.getElementById("unit-modal");
  const front = document.getElementById("card-front");
  const back  = document.getElementById("card-back");
  const card = document.getElementById("unit-card");
  const cardInner = card.querySelector(".card-inner");

  imgIndex = 0;
  currentImages = data.imagenes_grandes || [data.imagen_grande];

front.innerHTML = `
  <div class="front-image">
    <img id="stand-img" src="${currentImages[0]}" alt="${data.nombre}">
    ${currentImages.length > 1 ? `
      <button class="img-nav left" id="img-prev">◀</button>
      <button class="img-nav right" id="img-next">▶</button>
    ` : ""}
  </div>

  <div class="front-info">

    <!-- NOMBRE -->
    <h2 class="unit-name">${nombreES(data.nombre)}</h2>


    <!-- META -->
    <div class="unit-meta">
      <span class="badge rating">${data.rating}</span>
      <span class="badge rol">${t(ROLES_ES, data.rol)}</span>
      <span class="badge rareza">${t(RAREZA_ES,data.rareza)}</span>
    </div>

    <!-- STATS -->
    <div class="stats">
      <div class="stat hp">
        <span class="label">HP</span>
        <span class="value">${data.stats.lvmax.hp}</span>
      </div>
      <div class="stat atk">
        <span class="label">ATK</span>
        <span class="value">${data.stats.lvmax.atk}</span>
      </div>
      <div class="stat def">
        <span class="label">DEF</span>
        <span class="value">${data.stats.lvmax.def}</span>
      </div>
    </div>

    <!-- INFO SECUNDARIA -->
    <div class="unit-tags">
      <span>${data.elemento}</span>
      <span>${t(ELEMENT_ES, data.elemento)}</span>
      <span>${t(RAZAS_ES, data.raza)}</span>
    </div>

    <!-- EQUIPOS -->
    <div class="equipos">
      <h4>Equipos</h4>

      <div class="equipos-row">
        <strong>Inicial</strong>
        ${data.equipos.inicial.map(e =>
  `<span class="slot ${getSlotClass(e.tipo)}">${e.tipo}★${e.estrellas}</span>`
).join("")}

      </div>

      <div class="equipos-row">
        <strong>Máximo</strong>
        ${data.equipos.maximo.map(e =>
  `<span class="slot ${getSlotClass(e.tipo)}">${e.tipo}★${e.estrellas}</span>`
).join("")}

      </div>
    </div>

  </div>
`;

if (currentImages.length > 1) {
  const img = document.getElementById("stand-img");

 document.getElementById("img-prev").addEventListener("pointerdown", (e) => {
  suppressFlip = true;
  e.stopPropagation();
});

document.getElementById("img-prev").addEventListener("click", (e) => {
  imgIndex = (imgIndex - 1 + currentImages.length) % currentImages.length;
  img.src = currentImages[imgIndex];
});

document.getElementById("img-next").addEventListener("pointerdown", (e) => {
  suppressFlip = true;
  e.stopPropagation();
});

document.getElementById("img-next").addEventListener("click", (e) => {
  imgIndex = (imgIndex + 1) % currentImages.length;
  img.src = currentImages[imgIndex];
});

}
function renderAllSkills(skills) {
  const grupos = agruparSkills(skills);
  let html = "";

  for (const sistema in SKILL_SECTIONS) {
    if (!grupos[sistema]) continue;

    html += `
      <div class="skill-group ${sistema}">
        <h3 class="skill-title ${sistema}">
          ${SKILL_SECTIONS[sistema]}
        </h3>
    `;

    grupos[sistema].forEach(skill => {
      html += `
        <div class="skill-item">
          <strong>${skill.raw_title}</strong>
          <p>${translateText(skill.descripcion)}</p>
        </div>
      `;
    });

    html += `</div>`;
  }

  return html;
}


function agruparSkills(skills) {
  const grupos = {};
  for (const s of skills) {
    if (!grupos[s.sistema]) grupos[s.sistema] = [];
    grupos[s.sistema].push(s);
  }
  return grupos;
}


  back.innerHTML = `
    <h3>Skills</h3>
    ${data.skills.map(s => `
      <p><strong>${s.raw_title}</strong><br>${s.descripcion}</p>
    `).join("")}

    <h3>Passivas</h3>
    ${data.passivas.map(p => `
      <p><strong>${p.nombre}</strong><br>${p.descripcion}</p>
    `).join("")}
  `;

  modal.classList.remove("hidden");
  card.classList.remove("flipped");
// botón cerrar
const closeBtn = document.getElementById("close-modal");
closeBtn.onclick = (e) => {
  e.stopPropagation();
  modal.classList.add("hidden");
  cardFace = 0;
  card.classList.remove("flipped");
};



// evitar que el click en la card cierre el modal
cardInner.addEventListener("pointerup", (e) => {
  if (suppressFlip) {
    suppressFlip = false; // reset inmediato
    return;
  }

  if (e.target.closest(".close-btn")) return;

  e.stopPropagation();

  cardFace = (cardFace + 1) % 3;
  card.classList.toggle("flipped", cardFace !== 0);

  if (cardFace === 1) {
    back.innerHTML = `
      <div class="skills-view">
        ${renderAllSkills(data.skills)}
      </div>
    `;
  } else if (cardFace === 2) {
    back.innerHTML = `
      <div class="passives-view">
        ${renderPassivas(data.passivas)}
      </div>
    `;
  }
});



function getSlotClass(tipo) {
  if (tipo.includes("物")) return "atk";     // 物攻
  if (tipo.includes("魔")) return "mag";     // 魔攻
  if (tipo.includes("防")) return "def";     // 防御
  if (tipo.includes("援")) return "sup";     // 援護
  if (tipo.includes("回")) return "heal";    // 回復
  return "";
}

}
function renderSkills(skills) {
  const groups = {};

  skills.forEach(s => {
    if (!groups[s.sistema]) groups[s.sistema] = [];
    groups[s.sistema].push(s);
  });

  const ORDER = ["super_arts", "true_arts", "arts", "skill", "other"];
  const TITLES = {
    super_arts: "SUPER ARTS",
    true_arts: "TRUE ARTS",
    arts: "ARTS",
    skill: "SKILL",
    other: "OTHER"
  };

  return ORDER.filter(type => groups[type]).map(type => `
    <div class="skill-group ${type}">
      <h3>${TITLES[type]}</h3>
      ${groups[type].map(s => `
        <div class="skill-item">
          <strong>${s.raw_title}</strong>
          <p>${translateText(s.descripcion)}</p>
        </div>
      `).join("")}
    </div>
  `).join("");
}


function renderPassivas(passivas) {
  if (!passivas || passivas.length === 0) {
    return `<p class="empty">No hay pasivas registradas.</p>`;
  }

  return `
    <div class="passives-view">
      ${passivas.map(p => `
        <div class="passive-item">
          <strong>${p.nombre}</strong>
          <p>${translateText(p.descripcion)}</p>
        </div>
      `).join("")}
    </div>
  `;
}




// ===============================
// EVENTOS
// ===============================

// Elementos
document.querySelectorAll("[data-element]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentElement = btn.dataset.element;
    setActive("[data-element]", currentElement);
    applyFilters();
  });
});

// Rareza
document.querySelectorAll("[data-rare]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentRare = btn.dataset.rare;
    setActive("[data-rare]", currentRare);
    applyFilters();
  });
});
document.querySelectorAll("[data-race]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentRace = btn.dataset.race; // "Humano", "Dios", etc.

    setActive("[data-race]", btn.dataset.race);
    applyFilters();
  });
});



// Buscador
const normalize = s => (s || "").toLowerCase();

document.getElementById("search").addEventListener("input", e => {
  searchText = normalize(e.target.value);
  applyFilters();
});
document.getElementById("toggle-filters").onclick = () => {
  document.getElementById("filters").classList.toggle("hidden");
};

// ===============================
// UX UTILITIES
// ===============================

function setActive(selector, value) {
  document.querySelectorAll(selector).forEach(btn => {
    btn.classList.remove("active");
    for (const key in btn.dataset) {
      if (btn.dataset[key] === value) btn.classList.add("active");
    }
  });
}

