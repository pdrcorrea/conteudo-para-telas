const CULTURE_TOPICS = [
  ["Tarsila do Amaral","Arte brasileira"],["Candido Portinari","Arte brasileira"],["Aleijadinho","Arte brasileira"],["Anita Malfatti","Arte brasileira"],
  ["Museu de Arte de São Paulo","Museus"],["Museu do Amanhã","Museus"],["Teatro Amazonas","Arquitetura"],["Congresso Nacional do Brasil","Arquitetura"],
  ["Oscar Niemeyer","Arquitetura"],["Bossa nova","Música"],["Samba","Música"],["Choro","Música"],["Cinema do Brasil","Cinema"],
  ["Literatura do Brasil","Literatura"],["Machado de Assis","Literatura"],["Clarice Lispector","Literatura"],["Semana de Arte Moderna","História da arte"],
  ["Festa Junina no Brasil","Cultura popular"],["Carnaval do Brasil","Cultura popular"],["Capoeira","Patrimônio cultural"]
];

const CORS = {
  "access-control-allow-origin":"*",
  "access-control-allow-methods":"GET, OPTIONS",
  "access-control-allow-headers":"Content-Type",
  "content-type":"application/json; charset=utf-8"
};

function json(data, status = 200, cache = "public, max-age=180, s-maxage=300"){
  return new Response(JSON.stringify(data), { status, headers:{...CORS,"cache-control":cache} });
}

async function fetchJSON(url, timeout = 9000, ttl = 300){
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try{
    const res = await fetch(url, {
      signal:ctrl.signal,
      headers:{"user-agent":"PontoView-Content/1.0 (+https://pontoview.com.br)","accept":"application/json,*/*"},
      cf:{cacheTtl:ttl,cacheEverything:true}
    });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally { clearTimeout(timer); }
}

function clean(value = ""){
  return String(value).replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
}

function trimText(value, max = 560){
  const t = clean(value);
  return t.length <= max ? t : t.slice(0,max-3).replace(/\s+\S*$/,"") + "...";
}

function isSuitable(text){
  const normalized = clean(text).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const blocked = ["suicidio","assassinato","homicidio","massacre","estupro","pornografia","sexo explicito","guerra civil","cadaver","tortura","feminicidio"];
  return !blocked.some(term => normalized.includes(term));
}

async function getHoje(){
  const now = new Date();
  let holidays = [];
  try{ holidays = await fetchJSON(`https://brasilapi.com.br/api/feriados/v1/${now.getUTCFullYear()}`,8000,21600); }catch{}
  return {ok:true,source:"BrasilAPI",now:now.toISOString(),holidays:Array.isArray(holidays)?holidays:[]};
}

async function getCuriosidades(){
  const url = "https://pt.wikipedia.org/w/api.php?action=query&format=json&generator=random&grnnamespace=0&grnlimit=12&prop=extracts|pageimages|info&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=1200&inprop=url&origin=*";
  const data = await fetchJSON(url,9000,900);
  const pages = Object.values(data?.query?.pages || {}).map(p => ({
    title:clean(p.title),
    text:trimText(p.extract,520),
    image:p.thumbnail?.source || "",
    link:p.fullurl || "",
    topic:"Conhecimento"
  })).filter(p => p.title && p.text.length >= 120 && !/^(Lista|Anexo|Categoria|Wikipédia:)/i.test(p.title) && isSuitable(`${p.title} ${p.text}`));
  return {ok:pages.length>0,source:"Wikipédia",items:pages.slice(0,8)};
}

async function getCultura(){
  const titles = CULTURE_TOPICS.map(x=>x[0]).join("|");
  const url = "https://pt.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages|info&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=1400&inprop=url&redirects=1&origin=*&titles=" + encodeURIComponent(titles);
  const data = await fetchJSON(url,9000,21600);
  const map = new Map(CULTURE_TOPICS.map(x=>[x[0].toLowerCase(),x[1]]));
  const pages = Object.values(data?.query?.pages || {}).filter(p=>!p.missing).map(p=>({
    title:clean(p.title),text:trimText(p.extract,560),image:p.thumbnail?.source||"",link:p.fullurl||"",category:map.get(clean(p.title).toLowerCase())||"Cultura brasileira"
  })).filter(x=>x.title&&x.text.length>100);
  for(let i=pages.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pages[i],pages[j]]=[pages[j],pages[i]]}
  return {ok:pages.length>0,source:"Wikipédia",items:pages};
}

async function getEconomia(){
  const [quotesRes,ratesRes] = await Promise.allSettled([
    fetchJSON("https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL",8000,180),
    fetchJSON("https://brasilapi.com.br/api/taxas/v1",8000,1800)
  ]);
  const q = quotesRes.status === "fulfilled" ? quotesRes.value : {};
  const quotes = [
    q.USDBRL && {code:"USD",label:"Dólar americano",value:Number(q.USDBRL.bid),change:Number(q.USDBRL.pctChange),updated:q.USDBRL.create_date},
    q.EURBRL && {code:"EUR",label:"Euro",value:Number(q.EURBRL.bid),change:Number(q.EURBRL.pctChange),updated:q.EURBRL.create_date},
    q.BTCBRL && {code:"BTC",label:"Bitcoin",value:Number(q.BTCBRL.bid),change:Number(q.BTCBRL.pctChange),updated:q.BTCBRL.create_date}
  ].filter(Boolean);
  return {ok:quotes.length>0 || ratesRes.status==="fulfilled",sources:["AwesomeAPI","BrasilAPI"],quotes,rates:ratesRes.status==="fulfilled"&&Array.isArray(ratesRes.value)?ratesRes.value:[]};
}

function latestWorldBank(jsonData){
  const rows = Array.isArray(jsonData) && Array.isArray(jsonData[1]) ? jsonData[1] : [];
  const row = rows.find(x=>x&&x.value!==null&&x.value!==undefined);
  return row ? {value:Number(row.value),year:row.date} : null;
}

async function getSustentabilidade(url){
  const lat = Number(url.searchParams.get("lat") || -15.793889);
  const lon = Number(url.searchParams.get("lon") || -47.882778);
  const city = clean(url.searchParams.get("cidade") || "Brasil");
  const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=us_aqi,pm2_5,pm10&timezone=auto`;
  const base = "https://api.worldbank.org/v2/country/BR/indicator/";
  const results = await Promise.allSettled([
    fetchJSON(airUrl,8500,900),
    fetchJSON(base+"EG.FEC.RNEW.ZS?format=json&per_page=12",8500,43200),
    fetchJSON(base+"AG.LND.FRST.ZS?format=json&per_page=12",8500,43200),
    fetchJSON(base+"EN.ATM.CO2E.PC?format=json&per_page=12",8500,43200)
  ]);
  return {
    ok:results.some(r=>r.status==="fulfilled"),location:city,
    air:results[0].status==="fulfilled"?results[0].value.current||{}:{},
    renewable:results[1].status==="fulfilled"?latestWorldBank(results[1].value):null,
    forest:results[2].status==="fulfilled"?latestWorldBank(results[2].value):null,
    co2:results[3].status==="fulfilled"?latestWorldBank(results[3].value):null,
    sources:["Open-Meteo","World Bank"]
  };
}

export default {
  async fetch(request){
    const url = new URL(request.url);
    if(request.method === "OPTIONS") return new Response(null,{status:204,headers:CORS});
    if(request.method !== "GET") return json({ok:false,error:"Method not allowed"},405,"no-store");
    try{
      if(url.pathname === "/api/hoje") return json(await getHoje());
      if(url.pathname === "/api/curiosidades") return json(await getCuriosidades());
      if(url.pathname === "/api/cultura") return json(await getCultura());
      if(url.pathname === "/api/economia") return json(await getEconomia());
      if(url.pathname === "/api/sustentabilidade") return json(await getSustentabilidade(url));
      if(url.pathname === "/health") return json({ok:true,service:"PontoView Automatic Content API",endpoints:["/api/hoje","/api/curiosidades","/api/cultura","/api/economia","/api/sustentabilidade"]});
      return json({ok:true,service:"PontoView Automatic Content API",health:"/health"});
    }catch(error){
      return json({ok:false,error:error instanceof Error?error.message:"Unexpected error"},500,"no-store");
    }
  }
};
