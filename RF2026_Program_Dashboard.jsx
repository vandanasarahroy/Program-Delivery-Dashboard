import { useState, useMemo, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

/* ── UPDATED BUDGETS: Column D (Team Target) × $1M ─────────────── */
const PROJECTS = [
  'PE-RF-NuCLEAR Cont. Modern-DA',
  'PE-RF-Public Records Content-DM',
  'PE-RF-Public Records Content-ND',
  'PE-RF-PR CLEAR App. Opt. Content-DA',
  'PE-CE-Content SHA-ND',
];
const CORE_PROJECTS = PROJECTS.filter(p => p !== 'PE-CE-Content SHA-ND');
const SHA = 'PE-CE-Content SHA-ND';

const PS = {
  'PE-RF-NuCLEAR Cont. Modern-DA':'PE-RF-NuCLEAR Cont. Modern-DA',
  'PE-RF-Public Records Content-DM':'PE-RF-Public Records Content-DM',
  'PE-RF-Public Records Content-ND':'PE-RF-Public Records Content-ND',
  'PE-RF-PR CLEAR App. Opt. Content-DA':'PE-RF-PR CLEAR App. Opt. Content-DA',
  'PE-CE-Content SHA-ND':'PE-CE-Content SHA-ND',
};
// Short labels for compact display (charts, badges)
const PS_SHORT = {
  'PE-RF-NuCLEAR Cont. Modern-DA':'NuCLEAR-DA',
  'PE-RF-Public Records Content-DM':'PR Content-DM',
  'PE-RF-Public Records Content-ND':'PR Content-ND',
  'PE-RF-PR CLEAR App. Opt. Content-DA':'CLEAR App-DA',
  'PE-CE-Content SHA-ND':'SHA-ND',
};

const BUDGET = {
  'PE-RF-NuCLEAR Cont. Modern-DA':5484000,
  'PE-RF-Public Records Content-DM':430000,
  'PE-RF-Public Records Content-ND':930000,
  'PE-RF-PR CLEAR App. Opt. Content-DA':330000,
  'PE-CE-Content SHA-ND':331158,
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun'];
const YTD = ['Jan','Feb','Mar','Apr','May','Jun'];

const MD = {
  'PE-RF-NuCLEAR Cont. Modern-DA':{
    Jan:{fc:408773,fo:42533,ac:422211,ao:29147,cc:369716,co:4913},
    Feb:{fc:488861,fo:51605,ac:560886,ao:62180,cc:480674,co:43941},
    Mar:{fc:460817,fo:48750,ac:529076,ao:46685,cc:453670,co:5006},
    Apr:{fc:431808,fo:45465,ac:623911,ao:45331,cc:455953,co:37919},
    May:{fc:527532,fo:54668,ac:508859,ao:17535,cc:409113,co:4536},
    Jun:{fc:413614,fo:43581,ac:508396,ao:30904,cc:378501,co:37477},
    Jul:{fc:500885,fo:56512,ac:0,ao:0,cc:0,co:0},
    Aug:{fc:423326,fo:47318,ac:0,ao:0,cc:0,co:0},
    Sep:{fc:419287,fo:46942,ac:0,ao:0,cc:0,co:0},
    Oct:{fc:525118,fo:58771,ac:0,ao:0,cc:0,co:0},
    Nov:{fc:423326,fo:47318,ac:0,ao:0,cc:0,co:0},
    Dec:{fc:575452,fo:65034,ac:0,ao:0,cc:0,co:0},
  },
  'PE-RF-Public Records Content-DM':{
    Jan:{fc:25825,fo:3466,ac:7338,ao:1814,cc:4773,co:346},
    Feb:{fc:31872,fo:4196,ac:17481,ao:2698,cc:13285,co:553},
    Mar:{fc:32973,fo:4283,ac:12827,ao:1247,cc:9070,co:214},
    Apr:{fc:32973,fo:4283,ac:17849,ao:1364,cc:13700,co:232},
    May:{fc:40115,fo:5266,ac:52311,ao:7108,cc:19661,co:1115},
    Jun:{fc:29179,fo:3828,ac:103460,ao:8358,cc:67426,co:1076},
    Jul:{fc:31398,fo:4379,ac:0,ao:0,cc:0,co:0},
    Aug:{fc:15367,fo:2925,ac:0,ao:0,cc:0,co:0},
    Sep:{fc:15067,fo:2892,ac:0,ao:0,cc:0,co:0},
    Oct:{fc:18908,fo:3623,ac:0,ao:0,cc:0,co:0},
    Nov:{fc:15367,fo:2925,ac:0,ao:0,cc:0,co:0},
    Dec:{fc:19298,fo:3910,ac:0,ao:0,cc:0,co:0},
  },
  'PE-RF-Public Records Content-ND':{
    Jan:{fc:71802,fo:8299,ac:56321,ao:6145,cc:44016,co:1346},
    Feb:{fc:82348,fo:9099,ac:55752,ao:7487,cc:45584,co:1633},
    Mar:{fc:83862,fo:9202,ac:49360,ao:4890,cc:40590,co:1087},
    Apr:{fc:97504,fo:10718,ac:65734,ao:10926,cc:55327,co:2159},
    May:{fc:119293,fo:13322,ac:49339,ao:18539,cc:36480,co:2594},
    Jun:{fc:87588,fo:9887,ac:126553,ao:34201,cc:46150,co:1804},
    Jul:{fc:106206,fo:12255,ac:0,ao:0,cc:0,co:0},
    Aug:{fc:87232,fo:9732,ac:0,ao:0,cc:0,co:0},
    Sep:{fc:81967,fo:9205,ac:0,ao:0,cc:0,co:0},
    Oct:{fc:102803,fo:11530,ac:0,ao:0,cc:0,co:0},
    Nov:{fc:83344,fo:9300,ac:0,ao:0,cc:0,co:0},
    Dec:{fc:110296,fo:12862,ac:0,ao:0,cc:0,co:0},
  },
  'PE-RF-PR CLEAR App. Opt. Content-DA':{
    Jan:{fc:34102,fo:5413,ac:33988,ao:3914,cc:22325,co:584},
    Feb:{fc:52173,fo:8046,ac:67104,ao:9645,cc:49689,co:1458},
    Mar:{fc:57767,fo:8739,ac:83159,ao:9555,cc:59161,co:1429},
    Apr:{fc:54763,fo:8464,ac:98975,ao:11380,cc:72870,co:1845},
    May:{fc:65318,fo:10072,ac:39307,ao:5014,cc:28689,co:757},
    Jun:{fc:51186,fo:7924,ac:-3974,ao:-442,cc:0,co:0},
    Jul:{fc:73591,fo:12825,ac:0,ao:0,cc:0,co:0},
    Aug:{fc:63954,fo:10894,ac:0,ao:0,cc:0,co:0},
    Sep:{fc:59047,fo:10571,ac:0,ao:0,cc:0,co:0},
    Oct:{fc:73978,fo:13239,ac:0,ao:0,cc:0,co:0},
    Nov:{fc:59725,fo:10671,ac:0,ao:0,cc:0,co:0},
    Dec:{fc:80023,fo:14507,ac:0,ao:0,cc:0,co:0},
  },
  'PE-CE-Content SHA-ND':{
    Jan:{fc:18406,fo:2256,ac:81921,ao:12735,cc:16040,co:114},
    Feb:{fc:26094,fo:3357,ac:137585,ao:14884,cc:27456,co:156},
    Mar:{fc:27219,fo:3496,ac:127692,ao:16394,cc:29319,co:159},
    Apr:{fc:27219,fo:3496,ac:148874,ao:15040,cc:36344,co:202},
    May:{fc:32899,fo:4231,ac:125865,ao:14515,cc:28573,co:176},
    Jun:{fc:24969,fo:3218,ac:119591,ao:15186,cc:25958,co:181},
    Jul:{fc:26149,fo:3397,ac:0,ao:0,cc:0,co:0},
    Aug:{fc:4720,fo:715,ac:0,ao:0,cc:0,co:0},
    Sep:{fc:4720,fo:715,ac:0,ao:0,cc:0,co:0},
    Oct:{fc:5900,fo:894,ac:0,ao:0,cc:0,co:0},
    Nov:{fc:4720,fo:715,ac:0,ao:0,cc:0,co:0},
    Dec:{fc:6844,fo:1037,ac:0,ao:0,cc:0,co:0},
  },
};

/* ── HELPERS ─────────────────────────────────────────────────────── */
const fmt=(n)=>{if(n==null||isNaN(n))return'$0';const a=Math.abs(n),s=n<0?'-':'';if(a>=1e6)return`${s}$${(a/1e6).toFixed(2)}M`;if(a>=1000)return`${s}$${(a/1000).toFixed(1)}K`;return`${s}$${Math.round(a)}`;};
const fmtPct=(n)=>(!isFinite(n)||isNaN(n))?'—':`${n.toFixed(1)}%`;
const ytdActCapex=(p)=>YTD.reduce((s,m)=>s+(MD[p][m]?.ac||0),0);
const ytdActOpex=(p)=>YTD.reduce((s,m)=>s+(MD[p][m]?.ao||0),0);
const ytdFcCapex=(p)=>YTD.reduce((s,m)=>s+(MD[p][m]?.fc||0),0);
const ytdFcOpex=(p)=>YTD.reduce((s,m)=>s+(MD[p][m]?.fo||0),0);
const ytdCalCapex=(p)=>YTD.reduce((s,m)=>s+(MD[p][m]?.cc||0),0);
const ytdCalOpex=(p)=>YTD.reduce((s,m)=>s+(MD[p][m]?.co||0),0);

/* ── THEME ───────────────────────────────────────────────────────── */
const C={bg:'#f0f2f5',sidebar:'#ffffff',sidebarBorder:'#e2e8f0',surface:'#ffffff',surfaceBorder:'#e2e8f0',text:'#1a202c',textMuted:'#718096',textDim:'#a0aec0',orange:'#D64000',orangeSoft:'#fff0e8',green:'#38a169',greenSoft:'#f0fff4',blue:'#3182ce',blueSoft:'#ebf8ff',teal:'#319795',tealSoft:'#e6fffa',gold:'#d69e2e',goldSoft:'#fffff0',red:'#e53e3e',redSoft:'#fff5f5',purple:'#805ad5',white:'#ffffff'};

const TT=({active,payload,label})=>{if(!active||!payload?.length)return null;return(<div style={{background:C.surface,border:`1px solid ${C.surfaceBorder}`,padding:'10px 14px',borderRadius:6,fontSize:12,color:C.text}}><p style={{margin:'0 0 6px',fontWeight:700}}>{label}</p>{payload.map((p,i)=><p key={i} style={{margin:'2px 0',color:p.color}}>{p.name}: {fmt(p.value)}</p>)}</div>);};

const KPI=({label,value,sub,color,period})=>(<div style={{background:C.surface,border:`1px solid ${C.surfaceBorder}`,borderRadius:8,padding:'14px 16px',borderLeft:`3px solid ${color||C.blue}`}}><div style={{fontSize:11,color:C.textMuted,marginBottom:4,textTransform:'uppercase',letterSpacing:'0.5px'}}>{label}</div><div style={{fontSize:20,fontWeight:700,color:color||C.text}}>{value}</div>{period&&<div style={{fontSize:10,color:C.textDim,marginTop:2,fontStyle:'italic'}}>{period}</div>}{sub&&<div style={{fontSize:11,color:C.textMuted,marginTop:3}}>{sub}</div>}</div>);

const Bdg=({children,color,bg})=>(<span style={{display:'inline-block',padding:'2px 8px',borderRadius:10,fontSize:10,fontWeight:600,background:bg||C.blueSoft,color:color||C.blue}}>{children}</span>);

const TH=({children,right,sub})=>(<th style={{padding:'8px 12px',color:C.textMuted,fontWeight:600,textAlign:right?'right':'left',fontSize:11,borderBottom:`1px solid ${C.surfaceBorder}`,whiteSpace:'nowrap',background:'#f7fafc'}}>{children}{sub&&<div style={{fontSize:9,fontWeight:400,color:C.textDim,marginTop:1}}>{sub}</div>}</th>);
const TD=({children,color,right,bold})=>(<td style={{padding:'9px 12px',color:color||C.textMuted,textAlign:right?'right':'left',fontWeight:bold?700:400,whiteSpace:'nowrap',borderBottom:`1px solid ${C.surfaceBorder}22`}}>{children}</td>);

const RADIAN=Math.PI/180;
const PieLabel=({cx,cy,midAngle,innerRadius,outerRadius,percent})=>{
  const r=innerRadius+(outerRadius-innerRadius)*0.5;
  const x=cx+r*Math.cos(-midAngle*RADIAN);
  const y=cy+r*Math.sin(-midAngle*RADIAN);
  if(percent<0.04)return null;
  return(<text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" style={{fontSize:10,fontWeight:600}}>{`${(percent*100).toFixed(0)}%`}</text>);
};

/* ── PROGRAM HOME ────────────────────────────────────────────────── */
const SOW_FTE={
  'PE-RF-NuCLEAR Cont. Modern-DA':{sow_fc:560903,sow_cc:517648,fte_fc:2168864,fte_cc:2047011},
  'PE-RF-Public Records Content-DM':{sow_fc:127735,sow_cc:44727,fte_fc:65198,fte_cc:42737},
  'PE-RF-Public Records Content-ND':{sow_fc:196184,sow_cc:71889,fte_fc:346212,fte_cc:201377},
  'PE-RF-PR CLEAR App. Opt. Content-DA':{sow_fc:96457,sow_cc:69980,fte_fc:218848,fte_cc:180869},
  'PE-CE-Content SHA-ND':{sow_fc:130494,sow_cc:120771,fte_fc:26307,fte_cc:43658},
};

function ProgramHome(){
  const [cxShow,setCxShow]=useState(true);
  const [oxShow,setOxShow]=useState(false);
  const coreRows=CORE_PROJECTS.map(p=>{
    const ac=ytdActCapex(p),fc=ytdFcCapex(p),b=BUDGET[p];
    const rr=(ac/6)*12,varB=b-ac,varF=fc-ac,varRR=b-rr,spentPct=(ac/b)*100;
    return{p,b,fc,fo:ytdFcOpex(p),ac,ao:ytdActOpex(p),cc:ytdCalCapex(p),co:ytdCalOpex(p),
      rr,varB,varF,varRR,spentPct,
      overage:varB<0?Math.abs(varB):0,underspend:varRR>0?varRR:0};
  });
  const sha={
    ac:ytdActCapex(SHA),ao:ytdActOpex(SHA),
    fc:ytdFcCapex(SHA),fo:ytdFcOpex(SHA),
    cc:ytdCalCapex(SHA),co:ytdCalOpex(SHA),
    b:BUDGET[SHA]
  };
  sha.rr=(sha.ac/6)*12; sha.varB=sha.b-sha.ac; sha.varF=sha.fc-sha.ac;
  sha.varRR=sha.b-sha.rr; sha.spentPct=(sha.ac/sha.b)*100;
  sha.overage=sha.varB<0?Math.abs(sha.varB):0; sha.underspend=sha.varRR>0?sha.varRR:0;
  const totB=PROJECTS.reduce((s,p)=>s+BUDGET[p],0);
  const coreAc=coreRows.reduce((s,r)=>s+r.ac,0);
  const coreAo=coreRows.reduce((s,r)=>s+r.ao,0);
  const CT_PH=coreRows.reduce((a,r)=>({b:a.b+r.b,fc:a.fc+r.fc,fo:a.fo+r.fo,ac:a.ac+r.ac,ao:a.ao+r.ao,co:a.co+r.co,rr:a.rr+r.rr,varB:a.varB+r.varB,varF:a.varF+r.varF,varRR:a.varRR+r.varRR,overage:a.overage+r.overage,underspend:a.underspend+r.underspend}),{b:0,fc:0,fo:0,ac:0,ao:0,co:0,rr:0,varB:0,varF:0,varRR:0,overage:0,underspend:0});
  const allAc=coreAc+sha.ac;

  const barData=MONTHS.map(m=>({'month':m,
    'Fc CapEx':CORE_PROJECTS.reduce((s,p)=>s+MD[p][m].fc,0),
    'Fc OpEx':CORE_PROJECTS.reduce((s,p)=>s+MD[p][m].fo,0),
    'Act CapEx':CORE_PROJECTS.reduce((s,p)=>s+MD[p][m].ac,0),
    'Act OpEx':CORE_PROJECTS.reduce((s,p)=>s+MD[p][m].ao,0),
    'Cal CapEx':CORE_PROJECTS.reduce((s,p)=>s+MD[p][m].cc,0),
    'Cal OpEx':CORE_PROJECTS.reduce((s,p)=>s+MD[p][m].co,0),
  }));
  const PIE_COLORS=[C.orange,C.blue,C.teal,C.gold,C.purple];
  const pieData=PROJECTS.map((p,i)=>({name:PS_SHORT[p],value:ytdActCapex(p),budget:BUDGET[p],pct:(ytdActCapex(p)/BUDGET[p])*100,color:PIE_COLORS[i]}));

  const selStyle={background:C.surface,color:C.text,border:`1px solid ${C.surfaceBorder}`,borderRadius:6,padding:'5px 10px',fontSize:12,fontFamily:'inherit'};
  const toggleBtn=(active,label,color,onClick)=>(
    <button onClick={onClick} style={{padding:'5px 12px',borderRadius:6,border:`1.5px solid ${active?color:C.surfaceBorder}`,background:active?color+'22':'transparent',color:active?color:C.textMuted,fontSize:12,fontWeight:active?700:400,cursor:'pointer',fontFamily:'inherit',transition:'all 0.15s'}}>{label}</button>
  );

  return(
    <div>
      <div style={{marginBottom:20}}>
        <h1 style={{color:C.text,fontWeight:700,fontSize:22,margin:'0 0 4px'}}>Program Home</h1>
        <p style={{color:C.textMuted,fontSize:13,margin:0}}>All financial initiatives · Jan–Jun 2026 · Actuals: Jan–Jun</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:20}}>
        <KPI label="Total Budget (incl. SHA)" value={fmt(totB)} color={C.green}/>
        <KPI label="Total Annual Forecast" value={fmt(CORE_PROJECTS.reduce((s,p)=>s+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].reduce((ss,m)=>ss+(MD[p][m]?.fc||0),0),0))} color={C.teal} period="FY Jan–Dec" sub="Core only (excl. SHA)"/>
        <KPI label="Core YTD Actuals — CapEx" value={fmt(coreAc)} color={C.orange} sub={fmtPct(coreAc/totB*100)+' of total budget'}/>
        <KPI label="Core YTD Actuals — OpEx" value={fmt(coreAo)} color={C.gold} sub="Excluded from overall total"/>
        <KPI label="Overall YTD Actuals (CapEx only)" value={fmt(allAc)} color={C.blue} sub={fmtPct(allAc/totB*100)+' of total budget'}/>
      </div>

      {/* Charts row */}
      <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:16,marginBottom:20}}>
        <div style={{background:C.surface,border:`1px solid ${C.surfaceBorder}`,borderRadius:8,padding:16}}>
          <h3 style={{color:C.text,fontSize:13,fontWeight:600,margin:'0 0 4px'}}>Monthly Spend — Core Projects</h3>
          <p style={{color:C.textMuted,fontSize:11,margin:'0 0 12px'}}>SHA-ND excluded from this view</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{top:4,right:8,left:0,bottom:4}}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.surfaceBorder}/>
              <XAxis dataKey="month" tick={{fill:C.textMuted,fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tickFormatter={v=>fmt(v)} tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip content={<TT/>}/>
              <Legend wrapperStyle={{fontSize:10,color:C.textMuted}}/>
              <Bar dataKey="Fc CapEx" fill={C.blue} stackId="f" opacity={0.85}/>
              <Bar dataKey="Fc OpEx" fill={'#4299e1'} stackId="f" radius={[2,2,0,0]} opacity={0.5}/>
              <Bar dataKey="Act CapEx" fill={C.orange} stackId="a"/>
              <Bar dataKey="Act OpEx" fill={C.gold} stackId="a" radius={[2,2,0,0]} opacity={0.6}/>
              <Bar dataKey="Cal CapEx" fill={C.teal} stackId="c"/>
              <Bar dataKey="Cal OpEx" fill={'#81e6d9'} stackId="c" radius={[2,2,0,0]} opacity={0.6}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:C.surface,border:`1px solid ${C.surfaceBorder}`,borderRadius:8,padding:16}}>
          <h3 style={{color:C.text,fontSize:13,fontWeight:600,margin:'0 0 4px'}}>YTD Actuals by Project</h3>
          <p style={{color:C.textMuted,fontSize:11,margin:'0 0 8px'}}>CapEx actuals vs team budget</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={75} dataKey="value" labelLine={false} label={PieLabel}>
                {pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip formatter={(v,n,p)=>[`${fmt(v)} (${fmtPct(p.payload.pct)} of budget)`,p.payload.name]} contentStyle={{background:'#ffffff',border:`1px solid ${C.surfaceBorder}`,color:C.text,boxShadow:'0 2px 8px rgba(0,0,0,0.12)',fontSize:11}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:'flex',flexDirection:'column',gap:4,marginTop:4}}>
            {pieData.map((e,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:11}}>
                <span style={{display:'flex',alignItems:'center',gap:6}}>
                  <span style={{width:8,height:8,borderRadius:2,background:e.color,display:'inline-block'}}/>
                  <span style={{color:C.textMuted}}>{e.name}</span>
                </span>
                <span style={{color:e.color,fontWeight:600}}>{fmt(e.value)} <span style={{color:C.textDim}}>/ {fmt(e.budget)}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Projects Summary — CapEx / OpEx toggle */}
      <div style={{background:C.surface,border:`1px solid ${C.surfaceBorder}`,borderRadius:8,overflow:'hidden',marginBottom:12}}>
        <div style={{padding:'10px 16px',borderBottom:`1px solid ${C.surfaceBorder}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <h3 style={{color:C.text,fontSize:13,fontWeight:600,margin:0}}>Core Projects Summary</h3>
            <Bdg color={C.blue} bg={C.blueSoft}>Excluding SHA-ND</Bdg>
          </div>
          {/* Separate CapEx / OpEx toggles */}
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <span style={{color:C.textMuted,fontSize:11}}>Show:</span>
            {toggleBtn(cxShow,'CapEx',C.blue,()=>setCxShow(v=>!v))}
            {toggleBtn(oxShow,'OpEx',C.gold,()=>setOxShow(v=>!v))}
            {!cxShow&&!oxShow&&<span style={{color:C.red,fontSize:11}}>Select at least one</span>}
          </div>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead>
              <tr>
                <TH>Project</TH>
                <TH right>Budget</TH>
                {cxShow&&<th style={{padding:'0',background:'#f7fafc',borderBottom:`1px solid ${C.surfaceBorder}`}}><div style={{padding:'8px 12px',textAlign:'right',color:C.blue,fontSize:11,fontWeight:700,borderLeft:`2px solid ${C.blue}22`}}>YTD Fc CapEx<span style={{fontSize:9,fontStyle:"italic",fontWeight:400,color:"#a0aec0",display:"block",marginTop:1}}>Jan–Jun</span></div></th>}
                {oxShow&&<th style={{padding:'0',background:'#f7fafc',borderBottom:`1px solid ${C.surfaceBorder}`}}><div style={{padding:'8px 12px',textAlign:'right',color:C.gold,fontSize:11,fontWeight:700,borderLeft:`2px solid ${C.gold}22`}}>YTD Fc OpEx<span style={{fontSize:9,fontStyle:"italic",fontWeight:400,color:"#a0aec0",display:"block",marginTop:1}}>Jan–Jun</span></div></th>}
                {cxShow&&<th style={{padding:'0',background:'#f7fafc',borderBottom:`1px solid ${C.surfaceBorder}`}}><div style={{padding:'8px 12px',textAlign:'right',color:C.orange,fontSize:11,fontWeight:700,borderLeft:`2px solid ${C.orange}33`}}>YTD Act CapEx<span style={{fontSize:9,fontStyle:"italic",fontWeight:400,color:"#a0aec0",display:"block",marginTop:1}}>Jan–Jun</span></div></th>}
                {oxShow&&<th style={{padding:'0',background:'#f7fafc',borderBottom:`1px solid ${C.surfaceBorder}`}}><div style={{padding:'8px 12px',textAlign:'right',color:C.gold,fontSize:11,fontWeight:700,borderLeft:`2px solid ${C.gold}22`}}>YTD Act OpEx<span style={{fontSize:9,fontStyle:"italic",fontWeight:400,color:"#a0aec0",display:"block",marginTop:1}}>Jan–Jun</span></div></th>}
                {oxShow&&<th style={{padding:'0',background:'#f7fafc',borderBottom:`1px solid ${C.surfaceBorder}`}}><div style={{padding:'8px 12px',textAlign:'right',color:C.gold,fontSize:11,fontWeight:700,borderLeft:`2px solid ${C.gold}22`}}>YTD Cal OpEx<span style={{fontSize:9,fontStyle:"italic",fontWeight:400,color:"#a0aec0",display:"block",marginTop:1}}>Jan–Jun</span></div></th>}
                {cxShow&&<TH right sub="Jan–Jun">Var to Budget</TH>}
                {cxShow&&<TH right sub="Jan–Jun">Actuals Var to YTD Fc</TH>}
                {cxShow&&<TH right sub="Annualised">Run Rate Based on Actuals</TH>}
                {cxShow&&<TH right sub="Annualised">Var Based on Run Rate</TH>}
                {cxShow&&<TH right sub="Jan–Jun">% Spent</TH>}
                {cxShow&&<TH right sub="Jan–Jun">Overage</TH>}
                {cxShow&&<TH right sub="Jan–Jun">Underspend</TH>}
                <TH>Status</TH>
              </tr>
            </thead>
            <tbody>
              {coreRows.map(r=>(
                <tr key={r.p} style={{borderBottom:`1px solid ${C.surfaceBorder}`}}>
                  <TD bold color={C.text}>{PS[r.p]}</TD>
                  <TD right>{fmt(r.b)}</TD>
                  {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:C.blue,fontWeight:600}}>{fmt(r.fc)}</td>}
                  {oxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:C.gold}}>{fmt(r.fo)}</td>}
                  {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:C.orange,fontWeight:700}}>{fmt(r.ac)}</td>}
                  {oxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:C.gold}}>{fmt(r.ao)}</td>}
                  {oxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:C.teal}}>{fmt(r.co)}</td>}
                  {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:r.varB<0?C.red:C.green,fontWeight:700}}>{fmt(r.varB)}</td>}
                  {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:r.varF<0?C.red:C.green}}>{fmt(r.varF)}</td>}
                  {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:C.gold,fontWeight:600}}>{fmt(r.rr)}</td>}
                  {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:r.varRR<0?C.red:C.green}}>{fmt(r.varRR)}</td>}
                  {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:r.spentPct>100?C.red:C.text}}>{r.spentPct.toFixed(1)}%</td>}
                  {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:r.overage>0?C.red:C.textDim}}>{fmt(r.overage)}</td>}
                  {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:r.underspend>0?C.green:C.textDim}}>{r.underspend>0?fmt(r.underspend):'—'}</td>}
                  <td style={{padding:'9px 12px'}}><Bdg color={r.varRR<0||r.varB<0?C.red:C.green} bg={r.varRR<0||r.varB<0?C.redSoft:C.greenSoft}>{r.varRR<0||r.varB<0?'OVERSPEND':'ON TRACK'}</Bdg></td>
                </tr>
              ))}
              <tr style={{background:'#f7fafc',borderTop:`2px solid ${C.orange}`}}>
                <TD bold color={C.orange}>CORE TOTAL</TD>
                <TD right bold>{fmt(CT_PH.b)}</TD>
                {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:C.blue,fontWeight:700}}>{fmt(CT_PH.fc)}</td>}
                {oxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:C.gold,fontWeight:700}}>{fmt(CT_PH.fo)}</td>}
                {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:C.orange,fontWeight:700}}>{fmt(CT_PH.ac)}</td>}
                {oxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:C.gold,fontWeight:700}}>{fmt(CT_PH.ao)}</td>}
                {oxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:C.teal,fontWeight:700}}>{fmt(CT_PH.co)}</td>}
                {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:CT_PH.varB<0?C.red:C.green,fontWeight:700}}>{fmt(CT_PH.varB)}</td>}
                {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:CT_PH.varF<0?C.red:C.green,fontWeight:700}}>{fmt(CT_PH.varF)}</td>}
                {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:C.gold,fontWeight:700}}>{fmt(CT_PH.rr)}</td>}
                {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:CT_PH.varRR<0?C.red:C.green,fontWeight:700}}>{fmt(CT_PH.varRR)}</td>}
                {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:CT_PH.ac/CT_PH.b>1?C.red:C.gold,fontWeight:700}}>{fmtPct(CT_PH.ac/CT_PH.b*100)}</td>}
                {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:CT_PH.overage>0?C.red:C.textDim,fontWeight:700}}>{fmt(CT_PH.overage)}</td>}
                {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:C.green,fontWeight:700}}>{CT_PH.underspend>0?fmt(CT_PH.underspend):'—'}</td>}
                {cxShow&&<td/>}
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{padding:'7px 16px',borderTop:`1px solid ${C.surfaceBorder}`,display:'flex',gap:16}}>
          <p style={{color:C.textDim,fontSize:11,margin:0}}>
            <span style={{color:C.blue,fontWeight:600}}>CapEx</span> — capitalised spend against team budget · 
            <span style={{color:C.gold,fontWeight:600}}> OpEx</span> — operating expenses tracked separately · 
            Budget, Run Rate Based on Actuals, and Spent% are CapEx-only · Var Based on Run Rate = Budget − Run Rate
          </p>
        </div>
      </div>

      {/* SHA callout */}
      <div style={{background:C.surface,border:`1px solid ${C.purple}44`,borderRadius:8,overflow:'hidden'}}>
        <div style={{padding:'8px 14px',background:C.purple+'18',borderBottom:`1px solid ${C.purple}33`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <p style={{color:C.purple,fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',margin:'0 0 2px'}}>SHA-ND — Separate Expense</p>
            <p style={{color:C.textMuted,fontSize:11,margin:0}}>Tracked independently · not included in core project totals</p>
          </div>
          <Bdg color={sha.varRR<0||sha.varB<0?C.red:C.green} bg={sha.varRR<0||sha.varB<0?C.redSoft:C.greenSoft}>{sha.varRR<0||sha.varB<0?'OVERSPEND':'ON TRACK'}</Bdg>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead>
              <tr>
                <TH>Project</TH>
                <TH right sub="Full Year">Budget</TH>
                {cxShow&&<th style={{padding:'0',background:'#f7fafc',borderBottom:`1px solid ${C.surfaceBorder}`}}><div style={{padding:'8px 12px',textAlign:'right',color:C.blue,fontSize:11,fontWeight:700,borderLeft:`2px solid ${C.blue}22`}}>YTD Fc CapEx<span style={{fontSize:9,fontStyle:'italic',fontWeight:400,color:C.textDim,display:'block',marginTop:1}}>Jan–Jun</span></div></th>}
                {oxShow&&<th style={{padding:'0',background:'#f7fafc',borderBottom:`1px solid ${C.surfaceBorder}`}}><div style={{padding:'8px 12px',textAlign:'right',color:C.gold,fontSize:11,fontWeight:700,borderLeft:`2px solid ${C.gold}22`}}>YTD Fc OpEx<span style={{fontSize:9,fontStyle:'italic',fontWeight:400,color:C.textDim,display:'block',marginTop:1}}>Jan–Jun</span></div></th>}
                {cxShow&&<th style={{padding:'0',background:'#f7fafc',borderBottom:`1px solid ${C.surfaceBorder}`}}><div style={{padding:'8px 12px',textAlign:'right',color:C.orange,fontSize:11,fontWeight:700,borderLeft:`2px solid ${C.orange}33`}}>YTD Act CapEx<span style={{fontSize:9,fontStyle:'italic',fontWeight:400,color:C.textDim,display:'block',marginTop:1}}>Jan–Jun</span></div></th>}
                {oxShow&&<th style={{padding:'0',background:'#f7fafc',borderBottom:`1px solid ${C.surfaceBorder}`}}><div style={{padding:'8px 12px',textAlign:'right',color:C.gold,fontSize:11,fontWeight:700,borderLeft:`2px solid ${C.gold}22`}}>YTD Act OpEx<span style={{fontSize:9,fontStyle:'italic',fontWeight:400,color:C.textDim,display:'block',marginTop:1}}>Jan–Jun</span></div></th>}
                {cxShow&&<TH right sub="Jan–Jun">Var to Budget</TH>}
                {cxShow&&<TH right sub="Jan–Jun">Actuals Var to YTD Fc</TH>}
                {cxShow&&<TH right sub="Annualised">Run Rate Based on Actuals</TH>}
                {cxShow&&<TH right sub="Annualised">Var Based on Run Rate</TH>}
                {cxShow&&<TH right sub="Jan–Jun">% Spent</TH>}
                {cxShow&&<TH right sub="Jan–Jun">Overage</TH>}
                {cxShow&&<TH right sub="Jan–Jun">Underspend</TH>}
              </tr>
            </thead>
            <tbody>
              <tr>
                <TD bold color={C.purple}>SHA-ND</TD>
                <TD right>{fmt(sha.b)}</TD>
                {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:C.blue,fontWeight:400,borderLeft:`2px solid ${C.blue}22`,whiteSpace:'nowrap'}}>{fmt(sha.fc)}</td>}
                {oxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:C.gold,fontWeight:400,borderLeft:`2px solid ${C.gold}22`,whiteSpace:'nowrap'}}>{fmt(sha.fo)}</td>}
                {cxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:C.orange,fontWeight:700,borderLeft:`2px solid ${C.orange}33`,whiteSpace:'nowrap'}}>{fmt(sha.ac)}</td>}
                {oxShow&&<td style={{padding:'9px 12px',textAlign:'right',color:C.gold,fontWeight:400,borderLeft:`2px solid ${C.gold}22`,whiteSpace:'nowrap'}}>{fmt(sha.ao)}</td>}
                {cxShow&&<TD right color={sha.varB<0?C.red:C.green} bold>{fmt(sha.varB)}</TD>}
                {cxShow&&<TD right color={sha.varF<0?C.red:C.green}>{fmt(sha.varF)}</TD>}
                {cxShow&&<TD right color={C.gold}>{fmt(sha.rr)}</TD>}
                {cxShow&&<TD right color={sha.varRR<0?C.red:C.green}>{fmt(sha.varRR)}</TD>}
                {cxShow&&<td style={{padding:'9px 12px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6,justifyContent:'flex-end'}}>
                    <div style={{width:48,height:4,background:C.surfaceBorder,borderRadius:2,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${Math.min(sha.spentPct,100)}%`,background:sha.spentPct>100?C.red:sha.spentPct>80?C.gold:C.green}}/>
                    </div>
                    <span style={{color:sha.spentPct>100?C.red:C.text,minWidth:36,textAlign:'right',fontWeight:sha.spentPct>100?700:400}}>{fmtPct(sha.spentPct)}</span>
                  </div>
                </td>}
                {cxShow&&<TD right color={sha.overage>0?C.red:C.textDim}>{fmt(sha.overage)}</TD>}
                {cxShow&&<TD right color={sha.underspend>0?C.green:C.textDim}>{sha.underspend>0?fmt(sha.underspend):'—'}</TD>}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
/* ── MONTHLY VIEW ────────────────────────────────────────────────── */
function MonthlyView(){
  const ALL='__ALL__';
  const [selProj,setSelProj]=useState(PROJECTS[0]);
  const isAll=selProj===ALL;
  const isSHA=selProj===SHA;

  // Aggregate across all projects when "All" selected
  const d=isAll
    ? Object.fromEntries(MONTHS.map(m=>[m,{
        fc:PROJECTS.reduce((s,p)=>s+MD[p][m].fc,0),
        fo:PROJECTS.reduce((s,p)=>s+MD[p][m].fo,0),
        ac:PROJECTS.reduce((s,p)=>s+MD[p][m].ac,0),
        ao:PROJECTS.reduce((s,p)=>s+MD[p][m].ao,0),
        cc:PROJECTS.reduce((s,p)=>s+MD[p][m].cc,0),
        co:PROJECTS.reduce((s,p)=>s+MD[p][m].co,0),
      }]))
    : MD[selProj];
  const b=isAll?PROJECTS.reduce((s,p)=>s+BUDGET[p],0):BUDGET[selProj];

  const ac_mv=isAll?PROJECTS.reduce((s,p)=>s+ytdActCapex(p),0):ytdActCapex(selProj);
  const ao_mv=isAll?PROJECTS.reduce((s,p)=>s+ytdActOpex(p),0):ytdActOpex(selProj);
  const fc_mv=isAll?PROJECTS.reduce((s,p)=>s+ytdFcCapex(p),0):ytdFcCapex(selProj);
  const fo_mv=isAll?PROJECTS.reduce((s,p)=>s+ytdFcOpex(p),0):ytdFcOpex(selProj);
  const cc_mv=isAll?PROJECTS.reduce((s,p)=>s+ytdCalCapex(p),0):ytdCalCapex(selProj);
  const co_mv=isAll?PROJECTS.reduce((s,p)=>s+ytdCalOpex(p),0):ytdCalOpex(selProj);
  const chartData=MONTHS.map(m=>({'month':m,'Fc CapEx':d[m].fc,'Fc OpEx':d[m].fo,'Act CapEx':d[m].ac||null,'Act OpEx':d[m].ao||null,'Cal CapEx':d[m].cc,'Cal OpEx':d[m].co}));

  return(
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
        <div>
          <h1 style={{color:C.text,fontWeight:700,fontSize:22,margin:'0 0 4px'}}>Monthly Financial View</h1>
          <p style={{color:C.textMuted,fontSize:13,margin:0}}>Forecast · Actuals · Calculated Actuals by month</p>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {isSHA&&<Bdg color={C.purple} bg={C.purple+'22'}>Separate Expense</Bdg>}
          <select value={selProj} onChange={e=>setSelProj(e.target.value)} style={{background:C.surface,color:C.text,border:`1px solid ${C.surfaceBorder}`,borderRadius:6,padding:'6px 10px',fontSize:12,fontFamily:'inherit'}}>
            <option value="__ALL__">All Projects</option>
            {PROJECTS.map(p=><option key={p} value={p}>{PS[p]}{p===SHA?' (Separate)':''}</option>)}
          </select>
        </div>
      </div>

      {isSHA&&!isAll&&(
        <div style={{background:C.purple+'11',border:`1px solid ${C.purple}44`,borderRadius:6,padding:'10px 14px',marginBottom:16,fontSize:12,color:C.textMuted}}>
          <strong style={{color:C.purple}}>SHA-ND</strong> is tracked as a separate expense and is <strong style={{color:C.text}}>not included</strong> in the overall programme YTD actuals totals.
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
        <KPI label="Team Target Budget" value={fmt(b)} color={C.green}/>
        <KPI label="YTD Forecast CapEx" value={fmt(fc_mv)} period="Jan–Jun" sub={"OpEx: "+fmt(fo_mv)} color={C.blue}/>
        <KPI label="YTD Actuals CapEx" value={fmt(ac_mv)} period="Jan–Jun" sub={"OpEx: "+fmt(ao_mv)} color={C.orange}/>
        <KPI label="YTD Cal Actuals CapEx" value={fmt(cc_mv)} period="Jan–Jun" sub={"Cal OpEx: "+fmt(co_mv)} color={C.teal}/>
      </div>

      <div style={{background:C.surface,border:`1px solid ${isSHA?C.purple+'66':C.surfaceBorder}`,borderRadius:8,padding:16,marginBottom:16}}>
        <h3 style={{color:C.text,fontSize:13,fontWeight:600,margin:'0 0 14px'}}>{isAll?'All Projects':PS[selProj]} — Monthly Spend</h3>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={chartData} margin={{top:4,right:16,left:0,bottom:4}}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.surfaceBorder}/>
            <XAxis dataKey="month" tick={{fill:C.textMuted,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tickFormatter={v=>fmt(v)} tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false}/>
            <Tooltip content={<TT/>}/>
            <Legend wrapperStyle={{fontSize:11,color:C.textMuted}}/>
            <Bar dataKey="Fc CapEx" fill={C.blue} stackId="f" opacity={0.85}/>
            <Bar dataKey="Fc OpEx" fill={'#4299e1'} stackId="f" radius={[2,2,0,0]} opacity={0.5}/>
            <Bar dataKey="Act CapEx" fill={isSHA&&!isAll?C.purple:C.orange} stackId="a"/>
            <Bar dataKey="Act OpEx" fill={C.gold} stackId="a" radius={[2,2,0,0]} opacity={0.6}/>
            <Bar dataKey="Cal CapEx" fill={C.teal} stackId="c"/>
            <Bar dataKey="Cal OpEx" fill={'#81e6d9'} stackId="c" radius={[2,2,0,0]} opacity={0.6}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{background:C.surface,border:`1px solid ${C.surfaceBorder}`,borderRadius:8,overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
          <thead><tr><TH>Month</TH><TH right>Fc CapEx</TH><TH right>Fc OpEx</TH><TH right>Act CapEx</TH><TH right>Act OpEx</TH><TH right>Var (CapEx)</TH><TH right>Cal CapEx</TH><TH right>Cal OpEx</TH></tr></thead>
          <tbody>
            {MONTHS.map((m,i)=>{
              const r=d[m],diff=r.ac-r.fc,noAct=r.ac===0;
              return(
                <tr key={m} style={{background:i%2?'transparent':'#f0f2f5'}}>
                  <TD bold color={C.text}>{m}</TD>
                  <TD right color={C.blue} bold>{fmt(r.fc)}</TD>
                  <TD right color={C.blue}>{fmt(r.fo)}</TD>
                  <TD right color={noAct?C.textDim:isSHA&&!isAll?C.purple:C.orange} bold>{noAct?'TBD':fmt(r.ac)}</TD>
                  <TD right color={noAct?C.textDim:C.gold}>{noAct?'TBD':fmt(r.ao)}</TD>
                  <TD right color={noAct?C.textDim:diff>0?C.red:C.green} bold>{noAct?'TBD':fmt(diff)}</TD>
                  <TD right color={C.teal} bold>{fmt(r.cc)}</TD>
                  <TD right color={C.teal}>{fmt(r.co)}</TD>
                </tr>
              );
            })}
            {(()=>{
              const tFc=MONTHS.reduce((s,m)=>s+d[m].fc,0);
              const tFo=MONTHS.reduce((s,m)=>s+d[m].fo,0);
              const tAc=MONTHS.reduce((s,m)=>s+d[m].ac,0);
              const tAo=MONTHS.reduce((s,m)=>s+d[m].ao,0);
              const tCc=MONTHS.reduce((s,m)=>s+d[m].cc,0);
              const tCo=MONTHS.reduce((s,m)=>s+d[m].co,0);
              const tDiff=tAc-tFc;
              return(
                <tr style={{background:'#f7fafc',borderTop:`2px solid ${C.orange}`}}>
                  <TD bold color={C.orange}>TOTAL</TD>
                  <TD right color={C.blue} bold>{fmt(tFc)}</TD>
                  <TD right color={C.blue}>{fmt(tFo)}</TD>
                  <TD right color={isSHA&&!isAll?C.purple:C.orange} bold>{fmt(tAc)}</TD>
                  <TD right color={C.gold}>{fmt(tAo)}</TD>
                  <TD right color={tDiff>0?C.red:C.green} bold>{fmt(tDiff)}</TD>
                  <TD right color={C.teal} bold>{fmt(tCc)}</TD>
                  <TD right color={C.teal}>{fmt(tCo)}</TD>
                </tr>
              );
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── YTD OVERVIEW ────────────────────────────────────────────────── */
function YTDOverview(){
  const coreRows=CORE_PROJECTS.map(p=>{
    const ac=ytdActCapex(p),fc=ytdFcCapex(p),cc=ytdCalCapex(p);
    const b=BUDGET[p],rr=(ac/6)*12;
    const fullFc=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].reduce((s,m)=>s+(MD[p][m]?.fc||0),0);
    const varB=b-ac, varF=fc-ac, varRR=b-rr;
    return{p,b,fullFc,fc,ac,cc,rr,varB,varF,varRR,spentPct:(ac/b)*100,
      overage:varB<0?Math.abs(varB):0, underspend:varRR>0?varRR:0};
  });
  const sha={ac:ytdActCapex(SHA),fc:ytdFcCapex(SHA),cc:ytdCalCapex(SHA),b:BUDGET[SHA]};
  sha.rr=(sha.ac/6)*12; sha.varB=sha.b-sha.ac; sha.varF=sha.fc-sha.ac;
  sha.varRR=sha.b-sha.rr; sha.spentPct=(sha.ac/sha.b)*100;
  sha.overage=sha.varB<0?Math.abs(sha.varB):0; sha.underspend=sha.varRR>0?sha.varRR:0;

  const CT=coreRows.reduce((acc,r)=>({b:acc.b+r.b,fullFc:acc.fullFc+r.fullFc,fc:acc.fc+r.fc,ac:acc.ac+r.ac,cc:acc.cc+r.cc,rr:acc.rr+r.rr,varB:acc.varB+r.varB,varF:acc.varF+r.varF,overage:acc.overage+r.overage,underspend:acc.underspend+r.underspend}),{b:0,fullFc:0,fc:0,ac:0,cc:0,rr:0,varB:0,varF:0,overage:0,underspend:0});
  const totB=CT.b+sha.b;

  return(
    <div>
      <div style={{marginBottom:20}}>
        <h1 style={{color:C.text,fontWeight:700,fontSize:22,margin:'0 0 4px'}}>YTD Financial Overview</h1>
        <p style={{color:C.textMuted,fontSize:13,margin:0}}>Budget · Forecast · Actuals · Variances · Run Rate — Jan–Jun 2026</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
        <KPI label="Total Budget (incl. SHA)" value={fmt(totB)} color={C.green}/>
        <KPI label="Core YTD Actuals CapEx" value={fmt(CT.ac)} color={C.orange} sub={fmtPct(CT.ac/totB*100)+' of total budget'}/>
        <KPI label="Core Budget Variance" value={fmt(CT.varB)} color={CT.varB<0?C.red:C.green} sub={CT.varB<0?'Overspend':'Under budget'}/>
        <KPI label="Core Run Rate" value={fmt(CT.rr)} color={C.gold} sub={fmt(CT.b-CT.rr)+' vs core budget'}/>
      </div>

      {/* Core projects table */}
      <div style={{background:C.surface,border:`1px solid ${C.surfaceBorder}`,borderRadius:8,overflow:'hidden',marginBottom:16}}>
        <div style={{padding:'10px 16px',borderBottom:`1px solid ${C.surfaceBorder}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <h3 style={{color:C.text,fontSize:13,fontWeight:600,margin:0}}>Core Projects — YTD Breakdown</h3>
          <Bdg color={C.blue} bg={C.blueSoft}>SHA-ND Excluded</Bdg>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:11.5}}>
            <thead>
              <tr><TH>Project</TH><TH right>Budget</TH><TH right sub="Full Year">FY Fc CapEx</TH><TH right sub="Jan–Jun">YTD Fc CapEx</TH><TH right sub="Jan–Jun">YTD Act CapEx</TH><TH right sub="Jan–Jun">YTD Cal CapEx</TH><TH right sub="Jan–Jun">Var to Budget</TH><TH right sub="Jan–Jun">Act vs Fc</TH><TH right sub="Annualised">Run Rate</TH><TH right sub="Jan–Jun">% Spent</TH><TH right sub="Jan–Jun">Overage</TH><TH right sub="Jan–Jun">Underspend</TH><TH>Status</TH></tr>
            </thead>
            <tbody>
              {coreRows.map((r)=>(
                <tr key={r.p} style={{borderBottom:`1px solid ${C.surfaceBorder}`}}>
                  <TD bold color={C.text}>{PS[r.p]}</TD>
                  <TD right>{fmt(r.b)}</TD>
                  <TD right>{fmt(r.fullFc)}</TD>
                  <TD right color={C.blue}>{fmt(r.fc)}</TD>
                  <TD right color={C.orange} bold>{fmt(r.ac)}</TD>
                  <TD right color={C.teal}>{fmt(r.cc)}</TD>
                  <TD right color={r.varB<0?C.red:C.green} bold>{fmt(r.varB)}</TD>
                  <TD right color={r.varF<0?C.red:C.green}>{fmt(r.varF)}</TD>
                  <TD right color={C.gold}>{fmt(r.rr)}</TD>
                  <td style={{padding:'9px 12px',whiteSpace:'nowrap'}}>
                    <div style={{display:'flex',alignItems:'center',gap:6,justifyContent:'flex-end'}}>
                      <div style={{width:48,height:4,background:'#e2e8f0',borderRadius:2,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${Math.min(r.spentPct,100)}%`,background:r.spentPct>100?C.red:r.spentPct>80?C.gold:C.green}}/>
                      </div>
                      <span style={{color:r.spentPct>100?C.red:C.text,minWidth:40,textAlign:'right',fontWeight:r.spentPct>100?700:400}}>{fmtPct(r.spentPct)}</span>
                    </div>
                  </td>
                  <TD right color={r.overage>0?C.red:C.textDim}>{fmt(r.overage)}</TD>
                  <TD right color={r.underspend>0?C.green:C.textDim}>{r.underspend>0?fmt(r.underspend):'—'}</TD>
                  <TD><Bdg color={r.varRR<0||r.varB<0?C.red:C.green} bg={r.varRR<0||r.varB<0?C.redSoft:C.greenSoft}>{r.varRR<0||r.varB<0?'OVERSPEND':'ON TRACK'}</Bdg></TD>
                </tr>
              ))}
              {/* Core totals */}
              <tr style={{background:C.surface,borderTop:`2px solid ${C.orange}`}}>
                <td style={{padding:'10px 12px',color:C.text,fontWeight:700,fontSize:12}}>CORE TOTAL</td>
                <td style={{padding:'10px 12px',textAlign:'right',color:C.text,fontWeight:700}}>{fmt(CT.b)}</td>
                <td style={{padding:'10px 12px',textAlign:'right',color:C.text,fontWeight:700}}>{fmt(CT.fullFc)}</td>
                <td style={{padding:'10px 12px',textAlign:'right',color:C.blue,fontWeight:700}}>{fmt(CT.fc)}</td>
                <td style={{padding:'10px 12px',textAlign:'right',color:C.orange,fontWeight:700}}>{fmt(CT.ac)}</td>
                <td style={{padding:'10px 12px',textAlign:'right',color:C.teal,fontWeight:700}}>{fmt(CT.cc)}</td>
                <td style={{padding:'10px 12px',textAlign:'right',color:CT.varB<0?C.red:C.green,fontWeight:700}}>{fmt(CT.varB)}</td>
                <td style={{padding:'10px 12px',textAlign:'right',color:CT.varF<0?C.red:C.green,fontWeight:700}}>{fmt(CT.varF)}</td>
                <td style={{padding:'10px 12px',textAlign:'right',color:C.gold,fontWeight:700}}>{fmt(CT.rr)}</td>
                <td style={{padding:'10px 12px',textAlign:'right',color:CT.ac/CT.b>1?C.red:C.gold,fontWeight:700}}>{fmtPct(CT.ac/CT.b*100)}</td>
                <td style={{padding:'10px 12px',textAlign:'right',color:CT.overage>0?C.red:C.textDim,fontWeight:700}}>{fmt(CT.overage)}</td>
                <td style={{padding:'10px 12px',textAlign:'right',color:C.green,fontWeight:700}}>{CT.underspend>0?fmt(CT.underspend):'—'}</td>
                <td/>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SHA separate section */}
      <div style={{background:C.surface,border:`1px solid ${C.purple}55`,borderRadius:8,overflow:'hidden'}}>
        <div style={{padding:'10px 16px',borderBottom:`1px solid ${C.purple}33`,display:'flex',alignItems:'center',justifyContent:'space-between',background:C.purple+'11'}}>
          <h3 style={{color:C.purple,fontSize:13,fontWeight:600,margin:0}}>SHA-ND — Separate Expense (not included in core totals)</h3>
          <Bdg color={C.purple} bg={C.purple+'22'}>Tracked Independently</Bdg>
        </div>
        <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:11.5}}>
          <thead>
            <tr><TH>Project</TH><TH right>Budget</TH><TH right sub="Full Year">FY Fc CapEx</TH><TH right sub="Jan–Jun">YTD Fc CapEx</TH><TH right sub="Jan–Jun">YTD Act CapEx</TH><TH right sub="Jan–Jun">YTD Cal CapEx</TH><TH right sub="Jan–Jun">Var to Budget</TH><TH right sub="Jan–Jun">Act vs Fc</TH><TH right sub="Annualised">Run Rate</TH><TH right sub="Jan–Jun">% Spent</TH><TH right sub="Jan–Jun">Overage</TH><TH right sub="Jan–Jun">Underspend</TH><TH>Status</TH></tr>
          </thead>
          <tbody>
            <tr>
              <TD bold color={C.text}>SHA-ND</TD>
              <TD right>{fmt(sha.b)}</TD>
              <TD right>{fmt(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].reduce((s,m)=>s+(MD[SHA][m]?.fc||0),0))}</TD>
              <TD right color={C.blue}>{fmt(sha.fc)}</TD>
              <TD right color={C.purple} bold>{fmt(sha.ac)}</TD>
              <TD right color={C.teal}>{fmt(sha.cc)}</TD>
              <TD right color={sha.varB<0?C.red:C.green} bold>{fmt(sha.varB)}</TD>
              <TD right color={sha.varF<0?C.red:C.green}>{fmt(sha.varF)}</TD>
              <TD right color={C.gold}>{fmt(sha.rr)}</TD>
              <td style={{padding:'9px 12px'}}>
                <div style={{display:'flex',alignItems:'center',gap:6,justifyContent:'flex-end'}}>
                  <div style={{width:48,height:4,background:'#e2e8f0',borderRadius:2,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${Math.min(sha.spentPct,100)}%`,background:sha.spentPct>100?C.red:sha.spentPct>80?C.gold:C.green}}/>
                  </div>
                  <span style={{color:sha.spentPct>100?C.red:C.text,minWidth:40,textAlign:'right',fontWeight:sha.spentPct>100?700:400}}>{fmtPct(sha.spentPct)}</span>
                </div>
              </td>
              <TD right color={sha.overage>0?C.red:C.textDim}>{fmt(sha.overage)}</TD>
              <TD right color={sha.underspend>0?C.green:C.textDim}>{sha.underspend>0?fmt(sha.underspend):'—'}</TD>
              <TD><Bdg color={sha.varRR<0||sha.varB<0?C.red:C.purple} bg={sha.varRR<0||sha.varB<0?C.redSoft:C.purple+'22'}>{sha.varRR<0||sha.varB<0?'OVERSPEND':'ON TRACK'}</Bdg></TD>
            </tr>
          </tbody>
        </table>
        </div>
        <div style={{padding:'8px 16px',borderTop:`1px solid ${C.purple}22`}}>
          <p style={{color:C.textDim,fontSize:11,margin:0}}>SHA-ND budget ({fmt(sha.b)}) is included in the overall programme budget ({fmt(totB)}) but its actuals are not counted in core project YTD totals.</p>
        </div>
      </div>
    </div>
  );
}

/* ── SOW vs FTE ──────────────────────────────────────────────────── */
function SOWFTEView(){
  const chartData=PROJECTS.map(p=>({name:PS_SHORT[p],'SOW Forecast':SOW_FTE[p].sow_fc,'SOW Cal Actuals':SOW_FTE[p].sow_cc,'FTE Forecast':SOW_FTE[p].fte_fc,'FTE Cal Actuals':SOW_FTE[p].fte_cc}));
  return(
    <div>
      <div style={{marginBottom:20}}>
        <h1 style={{color:C.text,fontWeight:700,fontSize:22,margin:'0 0 4px'}}>SOW vs FTE</h1>
        <p style={{color:C.textMuted,fontSize:13,margin:0}}>Forecast and Calculated Actuals by resource type per project</p>
      </div>
      <div style={{background:C.surface,border:`1px solid ${C.surfaceBorder}`,borderRadius:8,padding:16,marginBottom:16}}>
        <h3 style={{color:C.text,fontSize:13,fontWeight:600,margin:'0 0 14px'}}>SOW vs FTE Spend Comparison</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{top:4,right:16,left:0,bottom:4}}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.surfaceBorder}/>
            <XAxis dataKey="name" tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tickFormatter={v=>fmt(v)} tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false}/>
            <Tooltip content={<TT/>}/>
            <Legend wrapperStyle={{fontSize:11,color:C.textMuted}}/>
            <Bar dataKey="SOW Forecast" fill={C.gold} opacity={0.75} radius={[2,2,0,0]}/>
            <Bar dataKey="SOW Cal Actuals" fill={C.orange} radius={[2,2,0,0]}/>
            <Bar dataKey="FTE Forecast" fill={C.blue+'99'} radius={[2,2,0,0]}/>
            <Bar dataKey="FTE Cal Actuals" fill={C.blue} radius={[2,2,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{background:C.surface,border:`1px solid ${C.surfaceBorder}`,borderRadius:8,overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
          <thead><tr><TH>Project</TH><TH right sub="Jan–Jun">SOW Forecast</TH><TH right sub="Jan–Jun">SOW Cal Act</TH><TH right sub="Jan–Jun">SOW Δ</TH><TH right sub="Jan–Jun">FTE Forecast</TH><TH right sub="Jan–Jun">FTE Cal Act</TH><TH right sub="Jan–Jun">FTE Δ</TH><TH right sub="Jan–Jun">Total Forecast</TH><TH right sub="Jan–Jun">Total Cal</TH></tr></thead>
          <tbody>
            {PROJECTS.map((p,i)=>{
              const s=SOW_FTE[p];
              const isShaRow=p===SHA;
              return(
                <tr key={p} style={{borderBottom:`1px solid ${C.surfaceBorder}`,background:isShaRow?C.purple+'08':'transparent'}}>
                  <td style={{padding:'10px 12px',color:isShaRow?C.purple:C.text,fontWeight:700}}>{PS[p]}{isShaRow&&' ✦'}</td>
                  <TD right color={C.gold}>{fmt(s.sow_fc)}</TD>
                  <TD right color={C.orange} bold>{fmt(s.sow_cc)}</TD>
                  <TD right color={s.sow_cc-s.sow_fc>0?C.red:C.green}>{fmt(s.sow_cc-s.sow_fc)}</TD>
                  <TD right color={C.blue+'99'}>{fmt(s.fte_fc)}</TD>
                  <TD right color={C.blue} bold>{fmt(s.fte_cc)}</TD>
                  <TD right color={s.fte_cc-s.fte_fc>0?C.red:C.green}>{fmt(s.fte_cc-s.fte_fc)}</TD>
                  <TD right bold>{fmt(s.sow_fc+s.fte_fc)}</TD>
                  <TD right color={C.teal} bold>{fmt(s.sow_cc+s.fte_cc)}</TD>
                </tr>
              );
            })}
            {(()=>{
              const core=CORE_PROJECTS.map(p=>SOW_FTE[p]);
              const tSf=core.reduce((s,r)=>s+r.sow_fc,0),tSc=core.reduce((s,r)=>s+r.sow_cc,0);
              const tFf=core.reduce((s,r)=>s+r.fte_fc,0),tFc2=core.reduce((s,r)=>s+r.fte_cc,0);
              return(
                <tr style={{background:'#f7fafc',borderTop:`2px solid ${C.orange}`}}>
                  <td style={{padding:'10px 12px',color:C.orange,fontWeight:700}}>CORE TOTAL (excl. SHA)</td>
                  <TD right color={C.gold} bold>{fmt(tSf)}</TD>
                  <TD right color={C.orange} bold>{fmt(tSc)}</TD>
                  <TD right color={tSc-tSf>0?C.red:C.green} bold>{fmt(tSc-tSf)}</TD>
                  <TD right color={C.blue+'99'} bold>{fmt(tFf)}</TD>
                  <TD right color={C.blue} bold>{fmt(tFc2)}</TD>
                  <TD right color={tFc2-tFf>0?C.red:C.green} bold>{fmt(tFc2-tFf)}</TD>
                  <TD right bold>{fmt(tSf+tFf)}</TD>
                  <TD right color={C.teal} bold>{fmt(tSc+tFc2)}</TD>
                </tr>
              );
            })()}
          </tbody>
        </table>
        <div style={{padding:'8px 14px',borderTop:`1px solid ${C.surfaceBorder}`}}>
          <p style={{color:C.textDim,fontSize:11,margin:0}}>✦ SHA-ND is a separate expense and tracked independently from core project totals.</p>
        </div>
      </div>
    </div>
  );
}

/* ── CAPEX vs OPEX ───────────────────────────────────────────────── */
function CapExOpExView(){
  const projData=PROJECTS.map(p=>{const d=MD[p];return{name:PS_SHORT[p],
    'Forecast CapEx':MONTHS.reduce((s,m)=>s+d[m].fc,0),
    'Forecast OpEx':MONTHS.reduce((s,m)=>s+d[m].fo,0),
    'Actuals CapEx':YTD.reduce((s,m)=>s+d[m].ac,0),
    'Actuals OpEx':YTD.reduce((s,m)=>s+d[m].ao,0),
    'Cal CapEx':MONTHS.reduce((s,m)=>s+d[m].cc,0),
    'Cal OpEx':MONTHS.reduce((s,m)=>s+d[m].co,0)};});
  const tFc=projData.reduce((s,r)=>s+r['Forecast CapEx'],0);
  const tFo=projData.reduce((s,r)=>s+r['Forecast OpEx'],0);
  const tAc=projData.reduce((s,r)=>s+r['Actuals CapEx'],0);
  const tAo=projData.reduce((s,r)=>s+r['Actuals OpEx'],0);
  const tCc=projData.reduce((s,r)=>s+r['Cal CapEx'],0);
  const tCo=projData.reduce((s,r)=>s+r['Cal OpEx'],0);
  const p1=[{name:'Act CapEx',value:tAc,color:C.orange},{name:'Act OpEx',value:tAo,color:C.red}];
  const p2=[{name:'Cal CapEx',value:tCc,color:C.blue},{name:'Cal OpEx',value:tCo,color:C.purple}];
  const p3=[{name:'Fc CapEx',value:tFc,color:C.teal},{name:'Fc OpEx',value:tFo,color:C.gold}];
  const pieStyle={background:C.surface,border:`1px solid ${C.surfaceBorder}`,borderRadius:8,padding:16};
  const ttStyle={background:'#ffffff',border:`1px solid ${C.surfaceBorder}`,color:C.text,boxShadow:'0 2px 8px rgba(0,0,0,0.12)'};
  return(
    <div>
      <div style={{marginBottom:20}}>
        <h1 style={{color:C.text,fontWeight:700,fontSize:22,margin:'0 0 4px'}}>CapEx vs OpEx — 2026</h1>
        <p style={{color:C.textMuted,fontSize:13,margin:0}}>Capital and operating expenditure breakdown across all projects · Jan–Jun</p>
      </div>

      {/* KPI rows: Forecast / Actuals / Cal Actuals */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:8}}>
        <KPI label="Forecast CapEx" value={fmt(tFc)} color={C.teal} sub="Jan–Jun · RM"/>
        <KPI label="Forecast OpEx" value={fmt(tFo)} color={C.gold} sub="Jan–Jun · RM"/>
        <KPI label="CapEx % of Forecast" value={fmtPct(tFc/(tFc+tFo)*100)} color={C.teal}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:8}}>
        <KPI label="Actuals CapEx" value={fmt(tAc)} color={C.orange} sub="Jan–Jun · Financial System"/>
        <KPI label="Actuals OpEx" value={fmt(tAo)} color={C.red} sub="Jan–Jun · Financial System"/>
        <KPI label="CapEx % of Actuals" value={fmtPct(tAc/(tAc+tAo)*100)} color={C.orange}/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
        <KPI label="Cal Actuals CapEx" value={fmt(tCc)} color={C.blue} sub="Jan–Jun · MyTime"/>
        <KPI label="Cal Actuals OpEx" value={fmt(tCo)} color={C.purple} sub="Jan–Jun · MyTime"/>
        <KPI label="CapEx % of Cal Actuals" value={fmtPct(tCc/(tCc+tCo)*100)} color={C.blue}/>
      </div>

      {/* Pie charts — 3 across */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:16}}>
        {[['Actuals (BEX) — CapEx vs OpEx',p1],['Cal Actuals — CapEx vs OpEx',p2],['Forecast — CapEx vs OpEx',p3]].map(([title,data],idx)=>(
          <div key={idx} style={pieStyle}>
            <h3 style={{color:C.text,fontSize:13,fontWeight:600,margin:'0 0 8px'}}>{title}</h3>
            <ResponsiveContainer width="100%" height={170}>
              <PieChart><Pie data={data} cx="50%" cy="50%" outerRadius={65} dataKey="value" labelLine={false} label={PieLabel}>{data.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie>
                <Tooltip formatter={v=>fmt(v)} contentStyle={ttStyle}/>
                <Legend wrapperStyle={{fontSize:11,color:C.textMuted}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Stacked bar — all 3 series */}
      <div style={{background:C.surface,border:`1px solid ${C.surfaceBorder}`,borderRadius:8,padding:16}}>
        <h3 style={{color:C.text,fontSize:13,fontWeight:600,margin:'0 0 14px'}}>CapEx vs OpEx by Project — All Sources</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={projData} margin={{top:4,right:16,left:0,bottom:4}}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.surfaceBorder}/>
            <XAxis dataKey="name" tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tickFormatter={v=>fmt(v)} tick={{fill:C.textMuted,fontSize:10}} axisLine={false} tickLine={false}/>
            <Tooltip content={<TT/>}/><Legend wrapperStyle={{fontSize:11,color:C.textMuted}}/>
            <Bar dataKey="Forecast CapEx" fill={C.teal} stackId="f"/><Bar dataKey="Forecast OpEx" fill={C.gold} stackId="f" radius={[2,2,0,0]}/>
            <Bar dataKey="Actuals CapEx" fill={C.orange} stackId="a"/><Bar dataKey="Actuals OpEx" fill={C.red} stackId="a" radius={[2,2,0,0]}/>
            <Bar dataKey="Cal CapEx" fill={C.blue} stackId="c"/><Bar dataKey="Cal OpEx" fill={C.purple} stackId="c" radius={[2,2,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ── RESOURCE VIEW ───────────────────────────────────────────────── */
/* ── RESOURCE OVERVIEW (3-panel) ────────────────────────────────── */
const RD=[{"n":"Aaron Litzenberg","t":"FTE","p":"NuCLEAR-DA","r":"Associate Architect","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Thomas Klein","s":"Active","cr":95.0,"tfc":170268,"tfo":8961,"tca":86595},{"n":"Abhijeet Paul","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Krishanu Bhattacharya","s":"Active","cr":90.0,"tfc":47372,"tfo":5264,"tca":23119},{"n":"Aditi Agarwal","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Herman Lee","s":"Active","cr":90.0,"tfc":47372,"tfo":5264,"tca":22106},{"n":"Akanksha Vaidya","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Brian McNulty","s":"Non-Billable Active","cr":0.0,"tfc":0,"tfo":0,"tca":0},{"n":"Akshay Sanjay Dakhore","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Krishanu Bhattacharya","s":"Active","cr":90.0,"tfc":47372,"tfo":5264,"tca":22613},{"n":"Amit Shmerling","t":"FTE","p":"NuCLEAR-DA","r":"Technical Product Owner","l":"CAN","v":"Thomson Reuters","b":"TR4","sup":"Thomas Klein","s":"Active","cr":95.0,"tfc":125175,"tfo":6588,"tca":54776},{"n":"Andie Jackson","t":"FTE","p":"NuCLEAR-DA","r":"Software Engineer","l":"US","v":"Thomson Reuters","b":"TR6","sup":"Todd Suhsen","s":"Active","cr":90.0,"tfc":85202,"tfo":9467,"tca":32692},{"n":"Andrew Norgren","t":"FTE","p":"NuCLEAR-DA","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Thomas Klein","s":"Active","cr":95.0,"tfc":85134,"tfo":4481,"tca":39462},{"n":"Andrew Norgren","t":"FTE","p":"CLEAR App-DA","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Thomas Klein","s":"Active","cr":95.0,"tfc":85134,"tfo":4481,"tca":32376},{"n":"Andrew Schewe","t":"FTE","p":"NuCLEAR-DA","r":"Sr. Software Engineer","l":"US","v":"Thomson Reuters","b":"TR5","sup":"Todd Suhsen","s":"Active","cr":90.0,"tfc":109957,"tfo":12217,"tca":45264},{"n":"Aravinda Reddy","t":"FTE","p":"NuCLEAR-DA","r":"Associate Architect","l":"IND","v":"Thomson Reuters","b":"TR4","sup":"Krishanu Bhattacharya","s":"Active","cr":90.0,"tfc":47014,"tfo":5224,"tca":21389},{"n":"Arvind Shamaraya","t":"SOW","p":"PR Content-ND","r":"Contractor","l":"US Mav","v":"US Maverick","b":"Student","sup":"Lisa Steigerwald","s":"Exit","cr":90.0,"tfc":12701,"tfo":1411,"tca":11275},{"n":"Atul Pratap Singh Tomar","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Krishanu Bhattacharya","s":"Active","cr":90.0,"tfc":47372,"tfo":5264,"tca":22513},{"n":"Balajee Venkatesh","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Herman Lee","s":"Active","cr":90.0,"tfc":47372,"tfo":5264,"tca":21904},{"n":"Betholi Venkata Ramana Reddy","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Krishanu Bhattacharya","s":"Active","cr":90.0,"tfc":47372,"tfo":5264,"tca":21834},{"n":"Bharath Kumar V","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Todd Suhsen","s":"Active","cr":95.0,"tfc":50004,"tfo":2632,"tca":24974},{"n":"Bhuvanteja Lnu","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Todd Suhsen","s":"Exit","cr":95.0,"tfc":12474,"tfo":657,"tca":11179},{"n":"Brian McNulty","t":"FTE","p":"NuCLEAR-DA","r":"Director, Technology","l":"US","v":"Thomson Reuters","b":"TR3","sup":"Todd Van Otterloo","s":"Active","cr":90.0,"tfc":101850,"tfo":11317,"tca":59464},{"n":"Brian McNulty","t":"FTE","p":"CLEAR App-DA","r":"Director, Technology","l":"US","v":"Thomson Reuters","b":"TR3","sup":"Todd Van Otterloo","s":"Active","cr":90.0,"tfc":50925,"tfo":5658,"tca":11498},{"n":"Brian McNulty","t":"FTE","p":"PR Content-ND","r":"Director, Technology","l":"US","v":"Thomson Reuters","b":"TR3","sup":"Todd Van Otterloo","s":"Active","cr":90.0,"tfc":50925,"tfo":5658,"tca":18118},{"n":"Candace Bielke","t":"FTE","p":"NuCLEAR-DA","r":"Sr. Software Engineer","l":"US","v":"Thomson Reuters","b":"TR5","sup":"Thomas Klein","s":"Active","cr":95.0,"tfc":116066,"tfo":6109,"tca":55719},{"n":"Curtis Baughman","t":"FTE","p":"PR Content-ND","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Lisa Steigerwald","s":"Active","cr":75.0,"tfc":40327,"tfo":13442,"tca":5442},{"n":"Curtis Baughman","t":"FTE","p":"CLEAR App-DA","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Lisa Steigerwald","s":"Active","cr":75.0,"tfc":47048,"tfo":15683,"tca":31653},{"n":"Curtis Baughman","t":"FTE","p":"NuCLEAR-DA","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Lisa Steigerwald","s":"Active","cr":75.0,"tfc":47048,"tfo":15683,"tca":3219},{"n":"Gwen Mecklenburg","t":"FTE","p":"NuCLEAR-DA","r":"Sr. Software Engineer","l":"US","v":"Thomson Reuters","b":"TR5","sup":"Thomas Klein","s":"Active","cr":90.0,"tfc":109957,"tfo":12217,"tca":47771},{"n":"Devendra Lodhi","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Krishanu Bhattacharya","s":"Active","cr":90.0,"tfc":44367,"tfo":4930,"tca":16138},{"n":"Eduardo Allain Martinez Resendiz","t":"SOW","p":"PR Content-DM","r":"Contractor","l":"Innover","v":"Innover Mexico","b":"Mexico","sup":"Lisa Steigerwald","s":"Active","cr":95.0,"tfc":80454,"tfo":4234,"tca":17449},{"n":"Elena Zilberman","t":"FTE","p":"NuCLEAR-DA","r":"Lead Software Engineer","l":"CAN","v":"Thomson Reuters","b":"TR4","sup":"Krishanu Bhattacharya","s":"Active","cr":95.0,"tfc":125175,"tfo":6588,"tca":62233},{"n":"Eric Hansen","t":"SOW","p":"PR Content-ND","r":"Contractor","l":"RBA","v":"Horizontal Integrated","b":"US","sup":"Lisa Steigerwald","s":"Active","cr":95.0,"tfc":233662,"tfo":12298,"tca":11362},{"n":"Erik Stockton","t":"FTE","p":"NuCLEAR-DA","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Thomas Klein","s":"Exit","cr":95.0,"tfc":79589,"tfo":4189,"tca":79994},{"n":"Fernando Lugo Garc\u00c3\u00ada","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Innover","v":"Innover Mexico","b":"Mexico","sup":"Thomas Klein","s":"Active","cr":95.0,"tfc":141995,"tfo":7473,"tca":57001},{"n":"Gokul Rajakumar","t":"FTE","p":"NuCLEAR-DA","r":"Sr. Software Engineer","l":"IND","v":"Thomson Reuters","b":"TR5","sup":"Herman Lee","s":"Active","cr":95.0,"tfc":26194,"tfo":1379,"tca":11469},{"n":"Greg Bates","t":"FTE","p":"NuCLEAR-DA","r":"Development","l":"US","v":"Thomson Reuters","b":"TR3","sup":"Mark McCall","s":"Active","cr":90.0,"tfc":87412,"tfo":9712,"tca":63121},{"n":"Gregg Dale","t":"FTE","p":"NuCLEAR-DA","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Herman Lee","s":"Active","cr":95.0,"tfc":92473,"tfo":4867,"tca":85237},{"n":"Gregg Dale","t":"FTE","p":"PR Content-ND","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Herman Lee","s":"Active","cr":95.0,"tfc":144336,"tfo":7597,"tca":0},{"n":"Haarika A G K S","t":"FTE","p":"NuCLEAR-DA","r":"Software Engineer","l":"IND","v":"Thomson Reuters","b":"TR6","sup":"Todd Suhsen","s":"Active","cr":90.0,"tfc":16458,"tfo":1829,"tca":6690},{"n":"Herman Lee","t":"FTE","p":"NuCLEAR-DA","r":"Manager, Software Development","l":"CAN","v":"Thomson Reuters","b":"TR4","sup":"Brian McNulty","s":"Active","cr":90.0,"tfc":118587,"tfo":13176,"tca":61933},{"n":"Immanuel Solc","t":"SOW","p":"PR Content-ND","r":"Contractor","l":"US Mav","v":"US Maverick","b":"Student","sup":"Lisa Steigerwald","s":"Exit","cr":95.0,"tfc":13406,"tfo":706,"tca":9627},{"n":"Jack Ryan","t":"FTE","p":"NuCLEAR-DA","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Thomas Klein","s":"Active","cr":80.0,"tfc":71692,"tfo":17923,"tca":8665},{"n":"Jack Ryan","t":"FTE","p":"CLEAR App-DA","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Thomas Klein","s":"Active","cr":80.0,"tfc":67022,"tfo":16756,"tca":35725},{"n":"James Nystrom","t":"FTE","p":"NuCLEAR-DA","r":"Associate Architect","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Thomas Klein","s":"Active","cr":90.0,"tfc":161307,"tfo":17923,"tca":76243},{"n":"Jason Binger","t":"FTE","p":"NuCLEAR-DA","r":"Sr. Software Engineer","l":"US","v":"Thomson Reuters","b":"TR5","sup":"Herman Lee","s":"Active","cr":95.0,"tfc":116066,"tfo":6109,"tca":58368},{"n":"Jesus Roberto Vazque Garcia","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte Mexico","b":"Mexico","sup":"Brian McNulty","s":"Non-Billable Active","cr":0.0,"tfc":0,"tfo":0,"tca":0},{"n":"Jitesh Talreja","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Todd Suhsen","s":"Active","cr":95.0,"tfc":50004,"tfo":2632,"tca":24976},{"n":"Joseph Krambeer","t":"FTE","p":"NuCLEAR-DA","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Herman Lee","s":"Active","cr":95.0,"tfc":170268,"tfo":8961,"tca":84968},{"n":"Jyoti Prateem","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Brian McNulty","s":"Non-Billable Active","cr":0.0,"tfc":0,"tfo":0,"tca":0},{"n":"Karen Super","t":"FTE","p":"PR Content-DM","r":"Sr. Software Engineer","l":"US","v":"Thomson Reuters","b":"TR5","sup":"Lisa Steigerwald","s":"Exit","cr":85.0,"tfc":8117,"tfo":1432,"tca":0},{"n":"Karen Super","t":"FTE","p":"PR Content-ND","r":"Sr. Software Engineer","l":"US","v":"Thomson Reuters","b":"TR5","sup":"Lisa Steigerwald","s":"Exit","cr":85.0,"tfc":24351,"tfo":4297,"tca":23743},{"n":"Karen Super","t":"FTE","p":"NuCLEAR-DA","r":"Sr. Software Engineer","l":"US","v":"Thomson Reuters","b":"TR5","sup":"Lisa Steigerwald","s":"Exit","cr":85.0,"tfc":8117,"tfo":1432,"tca":0},{"n":"Karthik S","t":"FTE","p":"PR Content-ND","r":"Sr. Software Engineer","l":"IND","v":"Thomson Reuters","b":"TR5","sup":"Shruthi Shetty","s":"Active","cr":85.0,"tfc":16523,"tfo":2916,"tca":1203},{"n":"Karthik S","t":"FTE","p":"CLEAR App-DA","r":"Sr. Software Engineer","l":"IND","v":"Thomson Reuters","b":"TR5","sup":"Shruthi Shetty","s":"Active","cr":85.0,"tfc":3457,"tfo":610,"tca":561},{"n":"Kaustav Maity","t":"SOW","p":"CLEAR App-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Lisa Steigerwald","s":"Active","cr":90.0,"tfc":47372,"tfo":5264,"tca":19672},{"n":"Krishanu Bhattacharya","t":"FTE","p":"NuCLEAR-DA","r":"Manager, Software Development","l":"IND","v":"Thomson Reuters","b":"TR4","sup":"Brian McNulty","s":"Active","cr":90.0,"tfc":47014,"tfo":5224,"tca":20853},{"n":"Kurt Koch","t":"FTE","p":"NuCLEAR-DA","r":"Architect","l":"US","v":"Thomson Reuters","b":"TR2","sup":"Emre Caglar","s":"Active","cr":95.0,"tfc":88783,"tfo":4673,"tca":45254},{"n":"Lisa Steigerwald","t":"FTE","p":"CLEAR App-DA","r":"Manager, Technology","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Brian McNulty","s":"Active","cr":70.0,"tfc":31365,"tfo":13442,"tca":21173},{"n":"Lisa Steigerwald","t":"FTE","p":"PR Content-DM","r":"Manager, Technology","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Brian McNulty","s":"Active","cr":70.0,"tfc":31365,"tfo":13442,"tca":12161},{"n":"Lisa Steigerwald","t":"FTE","p":"PR Content-ND","r":"Manager, Technology","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Brian McNulty","s":"Active","cr":70.0,"tfc":62730,"tfo":26884,"tca":11017},{"n":"Maia Hall","t":"FTE","p":"NuCLEAR-DA","r":"Software Engineer","l":"US","v":"Thomson Reuters","b":"TR6","sup":"Herman Lee","s":"Active","cr":95.0,"tfc":89935,"tfo":4733,"tca":31176},{"n":"Manish Kumar","t":"FTE","p":"NuCLEAR-DA","r":"Lead Software Engineer","l":"IND","v":"Thomson Reuters","b":"TR4","sup":"Krishanu Bhattacharya","s":"Active","cr":95.0,"tfc":49626,"tfo":2612,"tca":25352},{"n":"Mitali Srivastava","t":"FTE","p":"PR Content-ND","r":"Software Engineer","l":"IND","v":"Thomson Reuters","b":"TR6","sup":"Shruthi Shetty","s":"Exit","cr":80.0,"tfc":953,"tfo":238,"tca":1051},{"n":"Mohd Shadab","t":"SOW","p":"PR Content-DM","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Lisa Steigerwald","s":"Active","cr":90.0,"tfc":26841,"tfo":2982,"tca":1014},{"n":"Nick Knysh","t":"FTE","p":"NuCLEAR-DA","r":"Lead Software Engineer","l":"CAN","v":"Thomson Reuters","b":"TR4","sup":"Krishanu Bhattacharya","s":"Active","cr":95.0,"tfc":125175,"tfo":6588,"tca":58379},{"n":"Nidhi Bhardwaj","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Brian McNulty","s":"Non-Billable Active","cr":0.0,"tfc":0,"tfo":0,"tca":0},{"n":"Nidhi Gupta","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Todd Suhsen","s":"Active","cr":95.0,"tfc":50004,"tfo":2632,"tca":25425},{"n":"Nishant Kumar Saraswat","t":"FTE","p":"NuCLEAR-DA","r":"Lead Software Engineer","l":"IND","v":"Thomson Reuters","b":"TR4","sup":"Todd Suhsen","s":"Active","cr":85.0,"tfc":44402,"tfo":7836,"tca":18330},{"n":"Nitesh Rawat","t":"FTE","p":"SHA-ND","r":"Lead Software Engineer","l":"IND","v":"Thomson Reuters","b":"TR4","sup":"Shruthi Shetty","s":"Active","cr":90.0,"tfc":23507,"tfo":2612,"tca":8913},{"n":"Nitesh Rawat","t":"FTE","p":"PR Content-ND","r":"Lead Software Engineer","l":"IND","v":"Thomson Reuters","b":"TR4","sup":"Shruthi Shetty","s":"Active","cr":90.0,"tfc":23507,"tfo":2612,"tca":10320},{"n":"Nitesh Suresh Singh","t":"SOW","p":"CLEAR App-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Lisa Steigerwald","s":"Active","cr":90.0,"tfc":23436,"tfo":2604,"tca":16833},{"n":"Nitesh Suresh Singh","t":"SOW","p":"PR Content-DM","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Lisa Steigerwald","s":"Active","cr":90.0,"tfc":23436,"tfo":2604,"tca":4462},{"n":"Open2","t":"FTE","p":"NuCLEAR-DA","r":"Lead  Software Engineer, AI","l":"US AI","v":"Thomson Reuters","b":"TR4","sup":"Thomas Klein","s":"Open","cr":80.0,"tfc":121532,"tfo":30383,"tca":0},{"n":"Open3","t":"FTE","p":"CLEAR App-DA","r":"Staff Data Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Lisa Steigerwald","s":"Open","cr":80.0,"tfc":81855,"tfo":20464,"tca":0},{"n":"Oscar Levi Jimenez","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Innover","v":"Innover Mexico","b":"Mexico","sup":"Thomas Klein","s":"Active","cr":95.0,"tfc":14710,"tfo":774,"tca":17562},{"n":"Pankhuri Prasad","t":"FTE","p":"PR Content-DM","r":"Lead Software Engineer","l":"IND","v":"Thomson Reuters","b":"TR4","sup":"Lisa Steigerwald","s":"Active","cr":85.0,"tfc":22201,"tfo":3918,"tca":8860},{"n":"Pankhuri Prasad","t":"FTE","p":"CLEAR App-DA","r":"Lead Software Engineer","l":"IND","v":"Thomson Reuters","b":"TR4","sup":"Lisa Steigerwald","s":"Active","cr":85.0,"tfc":22201,"tfo":3918,"tca":10455},{"n":"Papun Kumar","t":"SOW","p":"CLEAR App-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Lisa Steigerwald","s":"Active","cr":80.0,"tfc":42108,"tfo":10527,"tca":18749},{"n":"Patricia Schell","t":"FTE","p":"NuCLEAR-DA","r":"PM","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Karen Steadman","s":"Active","cr":80.0,"tfc":71692,"tfo":17923,"tca":18640},{"n":"Prasenjit Aich","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Krishanu Bhattacharya","s":"Active","cr":90.0,"tfc":47372,"tfo":5264,"tca":22715},{"n":"PRATAP KARRI","t":"FTE","p":"NuCLEAR-DA","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Herman Lee","s":"Active","cr":95.0,"tfc":170268,"tfo":8961,"tca":86595},{"n":"Prathyusha Tadepalli","t":"SOW","p":"CLEAR App-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Lisa Steigerwald","s":"Active","cr":95.0,"tfc":32561,"tfo":1714,"tca":4067},{"n":"RAMYA MADAPUSI","t":"SOW","p":"CLEAR App-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Lisa Steigerwald","s":"Active","cr":90.0,"tfc":40562,"tfo":4507,"tca":10659},{"n":"Prithvi Raj","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Herman Lee","s":"Active","cr":90.0,"tfc":47372,"tfo":5264,"tca":18862},{"n":"Priyanshu Solanki","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Brian McNulty","s":"Non-Billable Active","cr":0.0,"tfc":0,"tfo":0,"tca":0},{"n":"Raj Ramadoss","t":"FTE","p":"PR Content-DM","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Todd Suhsen","s":"Active","cr":85.0,"tfc":68555,"tfo":12098,"tca":21716},{"n":"Raj Ramadoss","t":"FTE","p":"SHA-ND","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Todd Suhsen","s":"Active","cr":85.0,"tfc":35606,"tfo":6283,"tca":34745},{"n":"Raj Ramadoss","t":"FTE","p":"NuCLEAR-DA","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Todd Suhsen","s":"Active","cr":85.0,"tfc":35606,"tfo":6283,"tca":7122},{"n":"Raj Ramadoss","t":"FTE","p":"PR Content-ND","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Todd Suhsen","s":"Active","cr":85.0,"tfc":2481,"tfo":438,"tca":9381},{"n":"Ranjit Sahu","t":"FTE","p":"NuCLEAR-DA","r":"Sr, Architect","l":"CAN","v":"Thomson Reuters","b":"TR3","sup":"Kurt Koch","s":"Active","cr":90.0,"tfc":154523,"tfo":17169,"tca":64446},{"n":"Renee Skrbec","t":"FTE","p":"NuCLEAR-DA","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Herman Lee","s":"Active","cr":90.0,"tfc":141221,"tfo":15691,"tca":37983},{"n":"Renee Skrbec","t":"FTE","p":"PR Content-ND","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Herman Lee","s":"Active","cr":90.0,"tfc":118353,"tfo":13150,"tca":23913},{"n":"Repakula Mounika","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Todd Suhsen","s":"Active","cr":95.0,"tfc":50004,"tfo":2632,"tca":25689},{"n":"Riley Kunkel","t":"FTE","p":"PR Content-ND","r":"Sr. Software Engineer","l":"US","v":"Thomson Reuters","b":"TR5","sup":"Lisa Steigerwald","s":"Active","cr":95.0,"tfc":116066,"tfo":6109,"tca":47151},{"n":"Roberto Carlos Paredes Cetina","t":"SOW","p":"SHA-ND","r":"Contractor","l":"Innover","v":"Innover Mexico","b":"Mexico","sup":"Sean McPherson","s":"Active","cr":90.0,"tfc":76219,"tfo":8469,"tca":61999},{"n":"Roberto Vilchis Alvarez","t":"SOW","p":"SHA-ND","r":"Contractor","l":"Innover","v":"Innover Mexico","b":"Mexico","sup":"Lisa Steigerwald","s":"Exit","cr":88.0,"tfc":74525,"tfo":10163,"tca":58772},{"n":"Rumman Ahmar","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Herman Lee","s":"Exit","cr":90.0,"tfc":7812,"tfo":868,"tca":8519},{"n":"Samuel Omar Tovias Alanis","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Innover","v":"Innover Mexico","b":"Mexico","sup":"Herman Lee","s":"Exit","cr":90.0,"tfc":25027,"tfo":2781,"tca":28440},{"n":"Sarmistha Tosh","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Herman Lee","s":"Active","cr":90.0,"tfc":47372,"tfo":5264,"tca":22511},{"n":"Satya Gudimetla","t":"FTE","p":"CLEAR App-DA","r":"Architect","l":"IND","v":"Thomson Reuters","b":"TR4","sup":"Kurt Koch","s":"Active","cr":90.0,"tfc":37611,"tfo":4179,"tca":18495},{"n":"Satya Gudimetla","t":"FTE","p":"PR Content-ND","r":"Architect","l":"IND","v":"Thomson Reuters","b":"TR4","sup":"Kurt Koch","s":"Active","cr":90.0,"tfc":9403,"tfo":1045,"tca":1058},{"n":"Saurabh Jadhav","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Brian McNulty","s":"Non-Billable Active","cr":0.0,"tfc":0,"tfo":0,"tca":0},{"n":"Sean McPherson","t":"FTE","p":"CLEAR App-DA","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Shruthi Shetty","s":"Active","cr":95.0,"tfc":79589,"tfo":4189,"tca":0},{"n":"Sean McPherson","t":"FTE","p":"NuCLEAR-DA","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Shruthi Shetty","s":"Active","cr":95.0,"tfc":5545,"tfo":292,"tca":22911},{"n":"Sean McPherson","t":"FTE","p":"PR Content-ND","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Shruthi Shetty","s":"Active","cr":95.0,"tfc":85134,"tfo":4481,"tca":22911},{"n":"Shalini Gupta","t":"FTE","p":"NuCLEAR-DA","r":"Software Engineer","l":"IND","v":"Thomson Reuters","b":"TR6","sup":"Krishanu Bhattacharya","s":"Active","cr":95.0,"tfc":16240,"tfo":855,"tca":5805},{"n":"Sharath Upadhya","t":"FTE","p":"NuCLEAR-DA","r":"Lead Software Engineer","l":"IND","v":"Thomson Reuters","b":"TR4","sup":"Krishanu Bhattacharya","s":"Active","cr":95.0,"tfc":49626,"tfo":2612,"tca":20881},{"n":"Shivalik Malhotra","t":"FTE","p":"NuCLEAR-DA","r":"Technical Lead","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Herman Lee","s":"Active","cr":95.0,"tfc":170268,"tfo":8961,"tca":78052},{"n":"Shruthi Shetty","t":"FTE","p":"PR Content-DM","r":"Manager, Technoloay","l":"IND","v":"Thomson Reuters","b":"TR4","sup":"Brian McNulty","s":"Active","cr":0.0,"tfc":0,"tfo":0,"tca":238},{"n":"Shruthi Shetty","t":"FTE","p":"CLEAR App-DA","r":"Manager, Technoloay","l":"IND","v":"Thomson Reuters","b":"TR4","sup":"Brian McNulty","s":"Active","cr":80.0,"tfc":20895,"tfo":5224,"tca":6409},{"n":"Shruthi Shetty","t":"FTE","p":"PR Content-ND","r":"Manager, Technology","l":"IND","v":"Thomson Reuters","b":"TR4","sup":"Brian McNulty","s":"Active","cr":80.0,"tfc":20895,"tfo":5224,"tca":10840},{"n":"Shubhada Somashekar","t":"FTE","p":"PR Content-ND","r":"Software Engineer","l":"IND","v":"Thomson Reuters","b":"TR6","sup":"Shruthi Shetty","s":"Exit","cr":95.0,"tfc":113,"tfo":6,"tca":277},{"n":"Shubham Bengani","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Herman Lee","s":"Exit","cr":85.0,"tfc":10216,"tfo":1803,"tca":7662},{"n":"Shushrut Prakash Sawant","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Krishanu Bhattacharya","s":"Active","cr":90.0,"tfc":47372,"tfo":5264,"tca":21341},{"n":"Sirangula Subrahmanyeswari","t":"FTE","p":"CLEAR App-DA","r":"Software Engineer","l":"IND","v":"Thomson Reuters","b":"TR6","sup":"Shruthi Shetty","s":"Active","cr":75.0,"tfc":6857,"tfo":2286,"tca":2072},{"n":"Sirangula Subrahmanyeswari","t":"FTE","p":"PR Content-ND","r":"Software Engineer","l":"IND","v":"Thomson Reuters","b":"TR6","sup":"Shruthi Shetty","s":"Active","cr":75.0,"tfc":6857,"tfo":2286,"tca":3222},{"n":"Siva Padmanaban","t":"SOW","p":"PR Content-DM","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Lisa Steigerwald","s":"Active","cr":90.0,"tfc":47372,"tfo":5264,"tca":21802},{"n":"Steve Hestness","t":"FTE","p":"NuCLEAR-DA","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Todd Suhsen","s":"Exit","cr":85.0,"tfc":44945,"tfo":7931,"tca":40128},{"n":"Sunil Kanchibhotla","t":"FTE","p":"NuCLEAR-DA","r":"Lead Software Engineer","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Todd Suhsen","s":"Active","cr":85.0,"tfc":152345,"tfo":26884,"tca":60279},{"n":"Sunitha Vijayanarayan","t":"FTE","p":"NuCLEAR-DA","r":"Architect","l":"US","v":"Thomson Reuters","b":"TR3","sup":"Kurt Koch","s":"Active","cr":95.0,"tfc":215017,"tfo":11317,"tca":102487},{"n":"Tanmay Ashok Virkar","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Krishanu Bhattacharya","s":"Active","cr":90.0,"tfc":47372,"tfo":5264,"tca":22815},{"n":"Thomas Klein","t":"FTE","p":"NuCLEAR-DA","r":"Technology Manager","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Brian McNulty","s":"Active","cr":90.0,"tfc":161307,"tfo":17923,"tca":81945},{"n":"Todd Suhsen","t":"FTE","p":"NuCLEAR-DA","r":"Manager, Software Development","l":"US","v":"Thomson Reuters","b":"TR4","sup":"Brian McNulty","s":"Active","cr":80.0,"tfc":143384,"tfo":35846,"tca":47989},{"n":"Todd Van Otterloo","t":"FTE","p":"NuCLEAR-DA","r":"VP","l":"US","v":"Thomson Reuters","b":"TR2","sup":"Emre Caglar","s":"Active","cr":70.0,"tfc":130839,"tfo":56074,"tca":15069},{"n":"Troy Hanisch","t":"FTE","p":"NuCLEAR-DA","r":"Architect","l":"US","v":"Thomson Reuters","b":"TR3","sup":"Brian McNulty","s":"Exit","cr":90.0,"tfc":28877,"tfo":3209,"tca":9639},{"n":"Troy Hanisch","t":"FTE","p":"CLEAR App-DA","r":"Architect","l":"US","v":"Thomson Reuters","b":"TR3","sup":"Brian McNulty","s":"Exit","cr":90.0,"tfc":11122,"tfo":1236,"tca":10452},{"n":"Troy Hanisch","t":"FTE","p":"PR Content-ND","r":"Architect","l":"US","v":"Thomson Reuters","b":"TR3","sup":"Brian McNulty","s":"Exit","cr":90.0,"tfc":11122,"tfo":1236,"tca":11730},{"n":"Uttam Shrestha","t":"FTE","p":"NuCLEAR-DA","r":"Sr. Software Engineer","l":"US","v":"Thomson Reuters","b":"TR5","sup":"Herman Lee","s":"Active","cr":90.0,"tfc":109957,"tfo":12217,"tca":52662},{"n":"Julio Saenz Martinez Sanchez","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Brian McNulty","s":"Non-Billable Active","cr":0.0,"tfc":0,"tfo":0,"tca":0},{"n":"Kevin Liu","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"MEX","v":"Innover Mexico","b":"Mexico","sup":"Brian McNulty","s":"Non-Billable Active","cr":90.0,"tfc":25153,"tfo":2795,"tca":3699},{"n":"Saikumar Mujja","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Brian McNulty","s":"Non-Billable Active","cr":0.0,"tfc":0,"tfo":0,"tca":0},{"n":"Tribhuvan Narain Watts","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Innover","v":"Mexico","b":"Mexico","sup":"Brian McNulty","s":"Non-Billable Active","cr":0.0,"tfc":0,"tfo":0,"tca":0},{"n":"V Srikar","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Innover","v":"Innover Mexico","b":"Mexico","sup":"Brian McNulty","s":"Non-Billable Active","cr":0.0,"tfc":0,"tfo":0,"tca":0},{"n":"Vaibhav Sahu","t":"SOW","p":"NuCLEAR-DA","r":"Contractor","l":"Deloitte","v":"Deloitte India","b":"India","sup":"Krishanu Bhattacharya","s":"Active","cr":85.0,"tfc":44740,"tfo":7895,"tca":24051},{"n":"Vandana Sarah Roy","t":"FTE","p":"NuCLEAR-DA","r":"Project Manager","l":"CAN","v":"Thomson Reuters","b":"TR4","sup":"Maggie Schumacher","s":"Active","cr":90.0,"tfc":118587,"tfo":13176,"tca":49762},{"n":"Will Reishus","t":"SOW","p":"PR Content-ND","r":"Contractor","l":"US Mav","v":"US Maverick","b":"Student","sup":"Lisa Steigerwald","s":"Active","cr":90.0,"tfc":40565,"tfo":4507,"tca":20509},{"n":"Zane Hungerford","t":"SOW","p":"PR Content-ND","r":"Contractor","l":"US Mav","v":"US Maverick","b":"Student","sup":"Lisa Steigerwald","s":"Exit","cr":90.0,"tfc":12701,"tfo":1411,"tca":11405},{"n":"Chloe McCormick","t":"SOW","p":"PR Content-ND","r":"Contractor","l":"US Mav","v":"US Maverick","b":"Student","sup":"Lisa Steigerwald","s":"Active","cr":90.0,"tfc":33566,"tfo":3730,"tca":7711},{"n":"Mustafa El-huni","t":"SOW","p":"PR Content-ND","r":"Contractor","l":"US Mav","v":"US Maverick","b":"Student","sup":"Lisa Steigerwald","s":"Active","cr":90.0,"tfc":33566,"tfo":3730,"tca":0}];
const ALLOC_PROJ=['NuCLEAR-DA','PR Content-DM','PR Content-ND','CLEAR App-DA','SHA-ND'];
// [name,type(0=FTE/1=SOW),proj_idx,hourly,cr_pct,[pj×5],[ac×5]]
const ALLOC=[["Aaron Litzenberg",0,0,102.19,95.0,100.0,[11090,13047,13047,13047,16309,13047],[10873,14715,15533,15124,14756,13898]],["Abhijeet Paul",1,0,27.82,90.0,90.0,[3005,3806,4006,4006,4807,3605],[2839,4507,3853,3831,3651,4507]],["Aditi Agarwal",1,0,27.82,90.0,90.0,[3005,3806,4006,4006,4807,3605],[2637,4281,3245,4056,3853,4281]],["Akshay Sanjay Dakhore",1,0,27.82,90.0,90.0,[3005,3806,4006,4006,4807,3605],[2839,4507,3651,4281,3651,4281]],["Amit Shmerling",0,0,75.12,95.0,96.1,[8153,9592,9592,9592,11990,9592],[5139,9315,10277,10892,8493,9841]],["Andie Jackson",0,0,53.98,90.0,82.0,[5550,6529,6529,6529,8161,6529],[4129,6154,5829,5884,4663,5776]],["Andrew Norgren",0,0,102.19,95.0,100.0,[5545,6524,6524,6524,8155,6524],[10290,1737,1456,5416,5339,9401]],["Andrew Schewe",0,0,69.66,90.0,87.5,[7162,8426,8426,8426,10532,8426],[6144,7802,7460,9752,7899,6896]],["Aravinda Reddy",0,0,29.78,90.0,87.5,[3062,3603,3603,3603,4503,3603],[2627,4169,3377,3961,3377,4169]],["Atul Pratap Singh Tomar",1,0,27.82,90.0,90.0,[3005,3806,4006,4006,4807,3605],[2637,4507,3651,4056,3651,4507]],["Balajee Venkatesh",1,0,27.82,90.0,90.0,[3005,3806,4006,4006,4807,3605],[2839,4281,3651,3831,3448,4281]],["Betholi Venkata Ramana Reddy",1,0,27.82,90.0,88.9,[3005,3806,4006,4006,4807,3605],[2404,4451,3405,4229,3205,4451]],["Bharath Kumar V",1,0,27.82,95.0,100.0,[3171,4017,4229,4229,5074,3806],[3330,4757,3806,3756,4519,4507]],["Bhuvanteja Lnu",1,0,27.82,95.0,100.0,[3171,4017,4229,1057,0,0],[3330,4757,4281,0,0,0]],["Brian McNulty",0,0,129.04,90.0,94.7,[6634,7805,7805,7805,9756,7805],[11614,14969,9872,9162,9175,6581]],["Candace Bielke",0,0,69.66,95.0,100.0,[7560,8894,8894,8894,11117,8894],[7941,9056,9529,10031,9529,8359]],["Curtis Baughman",0,0,102.19,75.0,100.0,[3064,3605,3605,3605,4506,3605],[2529,409,77,0,0,0]],["Gwen Mecklenburg",0,0,69.66,90.0,87.3,[7162,8426,8426,8426,10532,8426],[6018,9265,8777,9334,7774,7036]],["Devendra Lodhi",1,0,27.82,90.0,88.8,[0,3806,4006,4006,4807,3605],[0,3116,3005,3561,3205,3561]],["Elena Zilberman",0,0,75.12,95.0,100.0,[8153,9592,9592,9592,11990,9592],[9135,10817,11419,11418,10277,7812]],["Erik Stockton",0,0,102.19,95.0,100.0,[11090,13047,13047,13047,16309,13047],[10873,13898,13203,11445,14756,13898]],["Fernando Lugo Garc\u00c3\u00ada",1,0,79.0,95.0,96.9,[9006,11408,12008,12008,14410,10807],[8725,0,11633,0,11051,0]],["Gokul Rajakumar",0,0,15.72,95.0,100.0,[1706,2007,2007,2007,2509,2007],[956,2138,2867,2138,1553,1635]],["Greg Bates",0,0,129.04,90.0,80.7,[0,0,7805,7805,9756,7805],[7026,10452,11672,11936,12775,12969]],["Gregg Dale",0,0,102.19,95.0,100.0,[11090,13047,13047,13047,16309,3262],[10873,13898,22911,16146,18445,15942]],["Haarika A G K S",0,0,10.43,90.0,88.9,[1072,1261,1261,1261,1576,1261],[741,1345,1126,1262,863,1502]],["Herman Lee",0,0,75.12,90.0,100.0,[7724,9087,9087,9087,11359,9087],[8114,12019,10818,11418,9736,11418]],["Jack Ryan",0,0,102.19,80.0,81.1,[4670,5494,5494,5494,6867,5494],[7766,0,0,0,327,715]],["James Nystrom",0,0,102.19,90.0,93.8,[10507,12361,12361,12361,15451,12361],[9335,14562,12416,14920,12784,13029]],["Jason Binger",0,0,69.66,95.0,100.0,[7560,8894,8894,8894,11117,8894],[7792,14141,11548,11442,10009,5016]],["Jitesh Talreja",1,0,27.82,95.0,100.0,[3171,4017,4229,4229,5074,3806],[2854,4757,4044,4757,4044,4256]],["Joseph Krambeer",0,0,102.19,95.0,100.0,[11090,13047,13047,13047,16309,13047],[11649,15533,15144,13898,13907,13898]],["Karen Super",0,0,69.66,85.0,null,[1353,1592,1592,1592,1989,0],[0,0,0,0,0,0]],["Krishanu Bhattacharya",0,0,29.78,90.0,90.1,[3062,3603,3603,3603,4503,3603],[2707,4288,3672,3633,2118,4288]],["Kurt Koch",0,0,213.14,95.0,100.0,[5783,6803,6803,6803,8504,6803],[2835,1279,2025,7673,7694,15453]],["Maia Hall",0,0,53.98,95.0,100.0,[5858,6892,6892,6892,8614,6892],[3692,3455,4102,8637,10255,3887]],["Manish Kumar",0,0,29.78,95.0,100.0,[3232,3803,3803,3803,4753,3803],[3169,4765,4301,4765,4527,3574]],["Nick Knysh",0,0,75.12,95.0,100.0,[8153,9592,9592,9592,11990,9592],[8564,11418,11419,11869,6709,7512]],["Nidhi Gupta",1,0,27.82,95.0,100.0,[3171,4017,4229,4229,5074,3806],[3330,4980,3806,4256,4519,4006]],["Nishant Kumar Saraswat",0,0,29.78,85.0,87.4,[2892,3402,3402,3402,4253,3402],[2481,3961,3013,2799,2127,4169]],["Oscar Levi Jimenez",1,0,79.0,95.0,97.5,[9006,5704,0,0,0,0],[8781,6162,0,0,0,0]],["Patricia Schell",0,0,102.19,80.0,85.4,[4670,5494,5494,5494,6867,5494],[3842,4905,2616,4088,2616,1839]],["Prasenjit Aich",1,0,27.82,90.0,90.0,[3005,3806,4006,4006,4807,3605],[2839,4507,3651,4056,3651,4281]],["PRATAP KARRI",0,0,102.19,95.0,100.0,[11090,13047,13047,13047,16309,13047],[10873,10628,18639,15942,15533,14715]],["Prithvi Raj",1,0,27.82,90.0,89.9,[3005,3806,4006,4006,4807,3605],[2637,4281,3651,3831,811,4056]],["Raj Ramadoss",0,0,102.19,85.0,100.0,[0,2918,2918,2918,3648,2918],[0,3577,3474,715,782,0]],["Ranjit Sahu",0,0,97.89,90.0,100.0,[10065,11841,11841,11841,14801,11841],[9911,13949,9581,14316,11894,6999]],["Renee Skrbec",0,0,102.19,90.0,87.4,[10507,12361,12361,0,7725,12361],[9013,12876,10944,0,0,0]],["Repakula Mounika",1,0,27.82,95.0,100.0,[3171,4017,4229,4229,5074,3806],[3330,4757,3568,4256,4044,5008]],["Rumman Ahmar",1,0,27.82,90.0,90.0,[0,3806,4006,0,0,0],[2637,3605,3651,0,0,0]],["Samuel Omar Tovias Alanis",1,0,79.0,90.0,100.0,[8532,10807,5688,0,0,0],[8532,12640,8532,0,0,0]],["Sarmistha Tosh",1,0,27.82,90.0,90.0,[3005,3806,4006,4006,4807,3605],[2231,4507,3651,4281,3853,4507]],["Sean McPherson",0,0,102.19,95.0,100.0,[5545,0,0,0,0,0],[5825,7766,7766,0,0,0]],["Shalini Gupta",0,0,10.43,95.0,85.8,[0,1331,1331,1331,1664,1331],[0,668,1258,1387,1179,1387]],["Sharath Upadhya",0,0,29.78,95.0,100.0,[3232,3803,3803,3803,4753,3803],[2716,4169,3735,4050,1924,2263]],["Shivalik Malhotra",0,0,102.19,95.0,100.0,[11090,13047,13047,13047,16309,13047],[10873,14715,10484,16350,14756,8584]],["Shubham Bengani",1,0,27.82,85.0,90.0,[2838,3594,3784,0,0,0],[2682,2253,3256,0,0,0]],["Shushrut Prakash Sawant",1,0,27.82,90.0,89.2,[3005,3806,4006,4006,4807,3605],[2637,4056,3132,4281,3403,4056]],["Steve Hestness",0,0,102.19,85.0,87.5,[9923,11674,11674,11674,0,0],[7296,12161,7296,12161,1216,0]],["Sunil Kanchibhotla",0,0,102.19,85.0,82.2,[9923,11674,11674,11674,14592,11674],[8599,12774,10857,13489,10857,7051]],["Sunitha Vijayanarayan",0,0,129.04,95.0,100.0,[14005,16476,16476,16476,20596,16476],[12750,10323,17653,20646,22067,13936]],["Tanmay Ashok Virkar",1,0,27.82,90.0,90.0,[3005,3806,4006,4006,4807,3605],[2839,4507,3448,4169,3853,4281]],["Thomas Klein",0,0,102.19,90.0,100.0,[10507,12361,12361,12361,15451,12361],[10944,12876,14163,17985,9749,12263]],["Todd Suhsen",0,0,102.19,80.0,72.8,[9339,10987,10987,10987,13734,10987],[4905,11037,8339,11650,8993,5825]],["Todd Van Otterloo",0,0,213.14,70.0,100.0,[8522,10026,10026,10026,12532,10026],[0,0,0,11296,10294,5115]],["Troy Hanisch",0,0,129.04,90.0,100.0,[13268,15609,0,0,0,0],[4065,4516,1161,0,0,0]],["Uttam Shrestha",0,0,69.66,90.0,100.0,[7162,8426,8426,8426,10532,8426],[6520,13375,9780,6687,8777,7802]],["Kevin Liu",1,0,102.75,90.0,5.8,[11097,14056,0,0,0,0],[0,0,0,0,0,0]],["Vaibhav Sahu",1,0,27.82,85.0,100.0,[2838,3594,3784,3784,4540,3405],[2767,5008,4044,4757,4044,4507]],["Vandana Sarah Roy",0,0,75.12,90.0,88.6,[7724,9087,9087,9087,11359,9087],[6896,9615,9466,9991,6153,8714]],["Andrew Norgren",0,3,102.19,95.0,100.0,[5545,6524,6524,6524,8155,6524],[0,9708,10873,9174,2621,0]],["Arvind Shamaraya",1,2,36.0,90.0,100.0,[1944,2462,2592,2592,3110,0],[1685,2592,2592,3240,1166,0]],["Brian McNulty",0,3,129.04,90.0,100.0,[3317,3902,3902,3902,4878,3902],[0,1161,3136,3949,3252,0]],["Brian McNulty",0,2,129.04,90.0,100.0,[3317,3902,3902,3902,4878,3902],[0,1161,3949,4181,4065,4762]],["Curtis Baughman",0,2,102.19,75.0,0.0,[2627,3090,3090,3090,3863,3090],[0,0,0,0,0,5442]],["Curtis Baughman",0,3,102.19,75.0,100.0,[3064,3605,3605,3605,4506,3605],[3909,6361,6821,11496,3066,0]],["Eduardo Allain Martinez Resendiz",1,1,79.0,95.0,96.9,[9006,11408,12008,12008,14410,10807],[0,0,0,0,5816,11633]],["Eric Hansen",1,2,130.0,95.0,null,[14820,18772,19760,19760,23712,17784],[0,0,0,0,0,11362]],["Gregg Dale",0,2,102.19,95.0,null,[11090,13047,13047,13047,16309,9786],[0,0,0,0,0,0]],["Immanuel Solc",1,2,36.0,95.0,100.0,[2052,2599,2736,2736,3283,0],[1676,2565,2052,2958,376,0]],["Jack Ryan",0,3,102.19,80.0,82.8,[0,5494,5494,5494,6867,5494],[0,9401,8584,13162,4578,0]],["Karen Super",0,1,69.66,85.0,0.0,[1353,1592,1592,1592,1989,0],[0,0,0,0,0,0]],["Karen Super",0,2,69.66,85.0,82.0,[4058,4775,4775,4775,5968,0],[5033,5210,3849,6158,3493,0]],["Karthik S",0,2,15.72,85.0,null,[0,0,0,0,2245,1796],[0,0,0,0,0,1203]],["Karthik S",0,3,15.72,85.0,75.0,[763,0,898,1796,0,0],[561,0,0,0,0,0]],["Kaustav Maity",1,3,27.82,90.0,90.0,[3005,3806,4006,4006,4807,3605],[2839,3448,3549,3752,2028,4056]],["Lisa Steigerwald",0,3,102.19,70.0,77.6,[2043,2403,2403,2403,3004,2403],[787,3004,5866,6724,1931,2861]],["Lisa Steigerwald",0,1,102.19,70.0,75.3,[2043,2403,2403,2403,3004,2403],[1073,2289,2003,2289,2790,1717]],["Lisa Steigerwald",0,2,102.19,70.0,72.3,[4086,4807,4807,4807,6009,4807],[1359,2504,1574,2003,2289,1288]],["Mitali Srivastava",0,2,10.43,80.0,87.5,[953,0,0,0,0,0],[817,234,0,0,0,0]],["Mohd Shadab",1,1,27.82,90.0,90.0,[3005,3806,4006,4006,4807,3605],[0,0,0,0,1014,0]],["Nitesh Rawat",0,4,29.78,90.0,87.5,[1531,1801,1801,1801,2252,1801],[0,751,2252,751,1501,3658]],["Nitesh Rawat",0,2,29.78,90.0,87.5,[1531,1801,1801,1801,2252,1801],[2627,2815,938,3565,375,0]],["Nitesh Suresh Singh",1,3,27.82,90.0,90.0,[1502,1903,2003,2003,2404,1803],[2839,3448,3651,4867,2028,0]],["Nitesh Suresh Singh",1,1,27.82,90.0,90.0,[1502,1903,2003,2003,2404,1803],[0,0,0,0,1014,3448]],["Pankhuri Prasad",0,1,29.78,85.0,87.5,[1446,1701,1701,1701,2127,1701],[1063,2481,0,0,1772,3544]],["Pankhuri Prasad",0,3,29.78,85.0,87.5,[1446,1701,1701,1701,2127,1701],[1595,0,4076,3721,1063,0]],["Papun Kumar",1,3,27.82,80.0,90.0,[2671,3383,3561,3561,4273,3205],[2344,3245,3425,4146,2344,3245]],["Prathyusha Tadepalli",1,3,27.82,95.0,null,[3171,4017,4229,4229,5074,3806],[0,0,0,0,0,4067]],["RAMYA MADAPUSI",1,3,27.82,90.0,91.0,[0,0,4006,4006,4807,3605],[0,0,3155,4867,2637,0]],["Raj Ramadoss",0,1,102.19,85.0,100.0,[4465,5253,5253,5253,6567,5253],[0,4864,3822,6341,3909,2780]],["Raj Ramadoss",0,4,102.19,85.0,100.0,[0,2918,2918,2918,3648,2918],[0,5820,5472,8860,6254,8339]],["Raj Ramadoss",0,2,102.19,85.0,100.0,[2481,0,0,0,0,0],[9381,0,0,0,0,0]],["Renee Skrbec",0,2,102.19,90.0,76.8,[0,0,0,12361,7725,12361],[0,0,0,8875,7404,7634]],["Riley Kunkel",0,2,69.66,95.0,99.0,[7560,8894,8894,8894,11117,8894],[7015,5493,5823,13103,9529,6188]],["Roberto Carlos Paredes Cetina",1,4,79.0,90.0,100.0,[8532,10807,11376,11376,13651,10238],[8532,11376,11376,14220,10807,5688]],["Roberto Vilchis Alvarez",1,4,79.0,88.0,90.4,[8342,10567,11123,11123,13348,10011],[7508,9510,10219,12514,10011,9010]],["Satya Gudimetla",0,3,29.78,90.0,100.0,[2450,2882,2882,2882,3603,2882],[2252,3324,2466,5066,1501,3886]],["Satya Gudimetla",0,2,29.78,90.0,100.0,[612,721,721,721,901,721],[375,442,241,0,0,0]],["Sean McPherson",0,3,102.19,95.0,null,[0,6524,6524,6524,8155,6524],[0,0,0,0,0,0]],["Sean McPherson",0,2,102.19,95.0,100.0,[5545,6524,6524,6524,8155,6524],[5825,7378,7766,1942,0,0]],["Shruthi Shetty",0,3,29.78,80.0,77.1,[1361,1601,1601,1601,2001,1601],[357,1334,1930,1358,1430,0]],["Shruthi Shetty",0,2,29.78,80.0,96.3,[1361,1601,1601,1601,2001,1601],[1334,1430,2073,1334,1334,3335]],["Shubhada Somashekar",0,2,10.43,95.0,87.5,[113,0,0,0,0,0],[277,0,0,0,0,0]],["Sirangula Subrahmanyeswari",0,3,10.43,75.0,75.7,[447,525,525,525,657,525],[313,493,469,586,211,0]],["Sirangula Subrahmanyeswari",0,2,10.43,75.0,74.1,[447,525,525,525,657,525],[383,383,422,516,665,853]],["Siva Padmanaban",1,1,27.82,90.0,90.0,[3005,3806,4006,4006,4807,3605],[2637,3651,3245,5070,3346,3853]],["Troy Hanisch",0,3,129.04,90.0,100.0,[3317,3902,3902,0,0,0],[4529,4762,1161,0,0,0]],["Troy Hanisch",0,2,129.04,90.0,100.0,[3317,3902,3902,0,0,0],[1045,7433,3252,0,0,0]],["Will Reishus",1,2,36.0,90.0,100.0,[1944,2462,2592,2592,4666,4666],[3240,3353,3467,3953,1701,4795]],["Zane Hungerford",1,2,36.0,90.0,100.0,[1944,2462,2592,2592,3110,0],[1944,2592,2592,3240,1037,0]],["Chloe McCormick",1,2,36.0,90.0,100.0,[0,0,0,2592,4666,4666],[0,0,0,259,3046,4406]],["Mustafa El-huni",1,2,36.0,90.0,null,[0,0,0,2592,4666,4666],[0,0,0,0,0,0]]];
const RSTATUS={"Thomas Klein":{"A":9,"E":1,"N":0,"O":1},"Krishanu Bhattacharya":{"A":15,"E":0,"N":0,"O":0},"Herman Lee":{"A":13,"E":3,"N":0,"O":0},"Brian McNulty":{"A":6,"E":1,"N":11,"O":0},"Todd Suhsen":{"A":10,"E":2,"N":0,"O":0},"Lisa Steigerwald":{"A":15,"E":5,"N":0,"O":1},"Todd Van Otterloo":{"A":1,"E":0,"N":0,"O":0},"Mark McCall":{"A":1,"E":0,"N":0,"O":0},"Shruthi Shetty":{"A":4,"E":2,"N":0,"O":0},"Emre Caglar":{"A":2,"E":0,"N":0,"O":0},"Karen Steadman":{"A":1,"E":0,"N":0,"O":0},"Kurt Koch":{"A":3,"E":0,"N":0,"O":0},"Sean McPherson":{"A":1,"E":0,"N":0,"O":0},"Maggie Schumacher":{"A":1,"E":0,"N":0,"O":0}};
const COMPLIANCE=[{"n":"Andrew Norgren","t":"FTE","sup":"Thomas Klein","s":"Active","f":"WRONG_PROJECT","alloc":["CLEAR App-DA","NuCLEAR-DA"],"tracked":["CLEAR App-DA","NuCLEAR-DA","PR Content-DM"],"correct":["CLEAR App-DA","NuCLEAR-DA"],"missing":[],"wrong":["PR Content-DM"],"hrs":760.0,"whrs":20.0,"pa":{"CLEAR App-DA":{"ytd":3.0,"fy":6.0},"NuCLEAR-DA":{"ytd":3.0,"fy":6.0}}},{"n":"Curtis Baughman","t":"FTE","sup":"Lisa Steigerwald","s":"Active","f":"WRONG_PROJECT","alloc":["CLEAR App-DA","NuCLEAR-DA","PR Content-ND"],"tracked":["CLEAR App-DA","NuCLEAR-DA","PR Content-DM","PR Content-ND"],"correct":["CLEAR App-DA","NuCLEAR-DA","PR Content-ND"],"missing":[],"wrong":["PR Content-DM"],"hrs":824.0,"whrs":54.0,"pa":{"PR Content-ND":{"ytd":1.8,"fy":3.6},"CLEAR App-DA":{"ytd":2.1,"fy":4.2},"NuCLEAR-DA":{"ytd":2.1,"fy":4.2}}},{"n":"Karen Super","t":"FTE","sup":"Lisa Steigerwald","s":"Exit","f":"WRONG_PROJECT","alloc":["NuCLEAR-DA","PR Content-DM","PR Content-ND"],"tracked":["CLEAR App-DA","PR Content-DM","PR Content-ND"],"correct":["PR Content-DM","PR Content-ND"],"missing":["NuCLEAR-DA"],"wrong":["CLEAR App-DA"],"hrs":597.5,"whrs":74.0,"pa":{"PR Content-ND":{"ytd":3.0,"fy":3.0},"PR Content-DM":{"ytd":1.0,"fy":1.0},"NuCLEAR-DA":{"ytd":1.0,"fy":1.0}}},{"n":"Karthik S","t":"FTE","sup":"Shruthi Shetty","s":"Active","f":"WRONG_PROJECT","alloc":["CLEAR App-DA","PR Content-ND"],"tracked":["CLEAR App-DA","NuCLEAR-DA","PR Content-DM"],"correct":["CLEAR App-DA"],"missing":["PR Content-ND"],"wrong":["NuCLEAR-DA","PR Content-DM"],"hrs":525.0,"whrs":349.0,"pa":{"PR Content-ND":{"ytd":4.0,"fy":8.0},"CLEAR App-DA":{"ytd":1.0,"fy":2.0}}},{"n":"Kaustav Maity","t":"SOW","sup":"Lisa Steigerwald","s":"Active","f":"WRONG_PROJECT","alloc":["CLEAR App-DA"],"tracked":["CLEAR App-DA","PR Content-DM"],"correct":["CLEAR App-DA"],"missing":[],"wrong":["PR Content-DM"],"hrs":918.0,"whrs":45.0,"pa":{"CLEAR App-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Kurt Koch","t":"FTE","sup":"Emre Caglar","s":"Active","f":"WRONG_PROJECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA","PR Content-DM"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":["PR Content-DM"],"hrs":260.5,"whrs":37.0,"pa":{"NuCLEAR-DA":{"ytd":1.5,"fy":3.0}}},{"n":"Lisa Steigerwald","t":"FTE","sup":"Brian McNulty","s":"Active","f":"WRONG_PROJECT","alloc":["CLEAR App-DA","PR Content-DM","PR Content-ND"],"tracked":["CLEAR App-DA","NuCLEAR-DA","PR Content-DM","PR Content-ND"],"correct":["CLEAR App-DA","PR Content-DM","PR Content-ND"],"missing":[],"wrong":["NuCLEAR-DA"],"hrs":839.0,"whrs":13.0,"pa":{"PR Content-ND":{"ytd":3.0,"fy":6.0},"CLEAR App-DA":{"ytd":1.5,"fy":3.0},"PR Content-DM":{"ytd":1.5,"fy":3.0}}},{"n":"Mohd Shadab","t":"SOW","sup":"Lisa Steigerwald","s":"Active","f":"WRONG_PROJECT","alloc":["PR Content-DM"],"tracked":["CLEAR App-DA","PR Content-DM"],"correct":["PR Content-DM"],"missing":[],"wrong":["CLEAR App-DA"],"hrs":756.0,"whrs":711.0,"pa":{"PR Content-DM":{"ytd":3.38,"fy":6.75}}},{"n":"Mustafa El-huni","t":"SOW","sup":"Lisa Steigerwald","s":"Active","f":"WRONG_PROJECT","alloc":["PR Content-ND"],"tracked":["NuCLEAR-DA"],"correct":[],"missing":["PR Content-ND"],"wrong":["NuCLEAR-DA"],"hrs":123.5,"whrs":123.5,"pa":{"PR Content-ND":{"ytd":3.0,"fy":6.0}}},{"n":"Nick Knysh","t":"FTE","sup":"Krishanu Bhattacharya","s":"Active","f":"WRONG_PROJECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA","PR Content-ND"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":["PR Content-ND"],"hrs":920.0,"whrs":50.0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Nitesh Rawat","t":"FTE","sup":"Shruthi Shetty","s":"Active","f":"WRONG_PROJECT","alloc":["PR Content-ND","SHA-ND"],"tracked":["PR Content-DM","PR Content-ND","SHA-ND"],"correct":["PR Content-ND","SHA-ND"],"missing":[],"wrong":["PR Content-DM"],"hrs":864.0,"whrs":40.0,"pa":{"PR Content-ND":{"ytd":3.0,"fy":6.0},"SHA-ND":{"ytd":3.0,"fy":6.0}}},{"n":"Papun Kumar","t":"SOW","sup":"Lisa Steigerwald","s":"Active","f":"WRONG_PROJECT","alloc":["CLEAR App-DA"],"tracked":["CLEAR App-DA","PR Content-DM"],"correct":["CLEAR App-DA"],"missing":[],"wrong":["PR Content-DM"],"hrs":981.0,"whrs":45.0,"pa":{"CLEAR App-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Prathyusha Tadepalli","t":"SOW","sup":"Lisa Steigerwald","s":"Active","f":"WRONG_PROJECT","alloc":["CLEAR App-DA"],"tracked":["NuCLEAR-DA","PR Content-DM"],"correct":[],"missing":["CLEAR App-DA"],"wrong":["NuCLEAR-DA","PR Content-DM"],"hrs":990.0,"whrs":819.0,"pa":{"CLEAR App-DA":{"ytd":3.88,"fy":7.75}}},{"n":"RAMYA MADAPUSI","t":"SOW","sup":"Lisa Steigerwald","s":"Active","f":"WRONG_PROJECT","alloc":["CLEAR App-DA"],"tracked":["CLEAR App-DA","PR Content-DM"],"correct":["CLEAR App-DA"],"missing":[],"wrong":["PR Content-DM"],"hrs":513.0,"whrs":45.0,"pa":{"CLEAR App-DA":{"ytd":4.75,"fy":9.5}}},{"n":"Riley Kunkel","t":"FTE","sup":"Lisa Steigerwald","s":"Active","f":"WRONG_PROJECT","alloc":["PR Content-ND"],"tracked":["NuCLEAR-DA","PR Content-ND"],"correct":["PR Content-ND"],"missing":[],"wrong":["NuCLEAR-DA"],"hrs":769.5,"whrs":51.0,"pa":{"PR Content-ND":{"ytd":6.0,"fy":12.0}}},{"n":"Satya Gudimetla","t":"FTE","sup":"Kurt Koch","s":"Active","f":"WRONG_PROJECT","alloc":["CLEAR App-DA","PR Content-ND"],"tracked":["CLEAR App-DA","PR Content-DM","PR Content-ND"],"correct":["CLEAR App-DA","PR Content-ND"],"missing":[],"wrong":["PR Content-DM"],"hrs":792.5,"whrs":63.0,"pa":{"PR Content-ND":{"ytd":1.2,"fy":2.4},"CLEAR App-DA":{"ytd":4.8,"fy":9.6}}},{"n":"Sharath Upadhya","t":"FTE","sup":"Krishanu Bhattacharya","s":"Active","f":"WRONG_PROJECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA","PR Content-ND"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":["PR Content-ND"],"hrs":824.0,"whrs":68.0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Gregg Dale","t":"FTE","sup":"Herman Lee","s":"Active","f":"PARTIAL","alloc":["NuCLEAR-DA","PR Content-ND"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":["PR Content-ND"],"wrong":[],"hrs":878.0,"whrs":0,"pa":{"PR Content-ND":{"ytd":5.12,"fy":10.25},"NuCLEAR-DA":{"ytd":3.38,"fy":6.75}}},{"n":"Sean McPherson","t":"FTE","sup":"Shruthi Shetty","s":"Active","f":"PARTIAL","alloc":["CLEAR App-DA","NuCLEAR-DA","PR Content-ND"],"tracked":["NuCLEAR-DA","PR Content-ND"],"correct":["NuCLEAR-DA","PR Content-ND"],"missing":["CLEAR App-DA"],"wrong":[],"hrs":472.0,"whrs":0,"pa":{"PR Content-ND":{"ytd":3.0,"fy":6.0},"CLEAR App-DA":{"ytd":2.75,"fy":5.5},"NuCLEAR-DA":{"ytd":0.25,"fy":0.5}}},{"n":"Aaron Litzenberg","t":"FTE","sup":"Thomas Klein","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":892.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Abhijeet Paul","t":"SOW","sup":"Krishanu Bhattacharya","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":1026.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Aditi Agarwal","t":"SOW","sup":"Herman Lee","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":981.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Akshay Sanjay Dakhore","t":"SOW","sup":"Krishanu Bhattacharya","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":1003.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Amit Shmerling","t":"FTE","sup":"Thomas Klein","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":797.5,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Andie Jackson","t":"FTE","sup":"Todd Suhsen","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":825.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Andrew Schewe","t":"FTE","sup":"Todd Suhsen","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":826.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Aravinda Reddy","t":"FTE","sup":"Krishanu Bhattacharya","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":912.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Arvind Shamaraya","t":"SOW","sup":"Lisa Steigerwald","s":"Exit","f":"CORRECT","alloc":["PR Content-ND"],"tracked":["PR Content-ND"],"correct":["PR Content-ND"],"missing":[],"wrong":[],"hrs":348.0,"whrs":0,"pa":{"PR Content-ND":{"ytd":2.5,"fy":2.5}}},{"n":"Atul Pratap Singh Tomar","t":"SOW","sup":"Krishanu Bhattacharya","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":999.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Balajee Venkatesh","t":"SOW","sup":"Herman Lee","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":972.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Betholi Venkata Ramana Reddy","t":"SOW","sup":"Krishanu Bhattacharya","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":981.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Bharath Kumar V","t":"SOW","sup":"Todd Suhsen","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":945.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Bhuvanteja Lnu","t":"SOW","sup":"Todd Suhsen","s":"Exit","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":423.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":3.25,"fy":3.25}}},{"n":"Brian McNulty","t":"FTE","sup":"Todd Van Otterloo","s":"Active","f":"CORRECT","alloc":["CLEAR App-DA","NuCLEAR-DA","PR Content-ND"],"tracked":["CLEAR App-DA","NuCLEAR-DA","PR Content-ND"],"correct":["CLEAR App-DA","NuCLEAR-DA","PR Content-ND"],"missing":[],"wrong":[],"hrs":795.0,"whrs":0,"pa":{"PR Content-ND":{"ytd":1.5,"fy":3.0},"CLEAR App-DA":{"ytd":1.5,"fy":3.0},"NuCLEAR-DA":{"ytd":3.0,"fy":6.0}}},{"n":"Candace Bielke","t":"FTE","sup":"Thomas Klein","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":842.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Chloe McCormick","t":"SOW","sup":"Lisa Steigerwald","s":"Active","f":"CORRECT","alloc":["PR Content-ND"],"tracked":["PR Content-ND"],"correct":["PR Content-ND"],"missing":[],"wrong":[],"hrs":238.0,"whrs":0,"pa":{"PR Content-ND":{"ytd":3.0,"fy":6.0}}},{"n":"Devendra Lodhi","t":"SOW","sup":"Krishanu Bhattacharya","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":725.5,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.25,"fy":10.5}}},{"n":"Eduardo Allain Martinez Resendiz","t":"SOW","sup":"Lisa Steigerwald","s":"Active","f":"CORRECT","alloc":["PR Content-DM"],"tracked":["PR Content-DM"],"correct":["PR Content-DM"],"missing":[],"wrong":[],"hrs":240.0,"whrs":0,"pa":{"PR Content-DM":{"ytd":3.38,"fy":6.75}}},{"n":"Elena Zilberman","t":"FTE","sup":"Krishanu Bhattacharya","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":872.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Erik Stockton","t":"FTE","sup":"Thomas Klein","s":"Exit","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":824.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":3.0,"fy":6.0}}},{"n":"Fernando Lugo Garc\u00c3\u00ada","t":"SOW","sup":"Thomas Klein","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":784.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Gokul Rajakumar","t":"FTE","sup":"Herman Lee","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":768.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Greg Bates","t":"FTE","sup":"Mark McCall","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":659.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":2.5,"fy":5.0}}},{"n":"Gwen Mecklenburg","t":"FTE","sup":"Thomas Klein","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":873.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Haarika A G K S","t":"FTE","sup":"Todd Suhsen","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":800.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Herman Lee","t":"FTE","sup":"Brian McNulty","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":916.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Immanuel Solc","t":"SOW","sup":"Lisa Steigerwald","s":"Exit","f":"CORRECT","alloc":["PR Content-ND"],"tracked":["PR Content-ND"],"correct":["PR Content-ND"],"missing":[],"wrong":[],"hrs":281.5,"whrs":0,"pa":{"PR Content-ND":{"ytd":2.5,"fy":2.5}}},{"n":"Jack Ryan","t":"FTE","sup":"Thomas Klein","s":"Active","f":"CORRECT","alloc":["CLEAR App-DA","NuCLEAR-DA"],"tracked":["CLEAR App-DA","NuCLEAR-DA"],"correct":["CLEAR App-DA","NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":657.0,"whrs":0,"pa":{"CLEAR App-DA":{"ytd":2.75,"fy":5.5},"NuCLEAR-DA":{"ytd":3.0,"fy":6.0}}},{"n":"James Nystrom","t":"FTE","sup":"Thomas Klein","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":884.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Jason Binger","t":"FTE","sup":"Herman Lee","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":882.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Jitesh Talreja","t":"SOW","sup":"Todd Suhsen","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":945.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Joseph Krambeer","t":"FTE","sup":"Herman Lee","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":875.2,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Kevin Liu","t":"SOW","sup":"Brian McNulty","s":"Non-Billable Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":832.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":1.0,"fy":2.0}}},{"n":"Krishanu Bhattacharya","t":"FTE","sup":"Brian McNulty","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":864.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Maia Hall","t":"FTE","sup":"Herman Lee","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":608.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Manish Kumar","t":"FTE","sup":"Krishanu Bhattacharya","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":896.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Mitali Srivastava","t":"FTE","sup":"Shruthi Shetty","s":"Exit","f":"CORRECT","alloc":["PR Content-ND"],"tracked":["PR Content-ND"],"correct":["PR Content-ND"],"missing":[],"wrong":[],"hrs":144.0,"whrs":0,"pa":{"PR Content-ND":{"ytd":1.0,"fy":1.0}}},{"n":"Nidhi Gupta","t":"SOW","sup":"Todd Suhsen","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":962.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Nishant Kumar Saraswat","t":"FTE","sup":"Todd Suhsen","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":828.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Nitesh Suresh Singh","t":"SOW","sup":"Lisa Steigerwald","s":"Active","f":"CORRECT","alloc":["CLEAR App-DA","PR Content-DM"],"tracked":["CLEAR App-DA","PR Content-DM"],"correct":["CLEAR App-DA","PR Content-DM"],"missing":[],"wrong":[],"hrs":945.0,"whrs":0,"pa":{"CLEAR App-DA":{"ytd":2.85,"fy":5.7},"PR Content-DM":{"ytd":2.85,"fy":5.7}}},{"n":"Oscar Levi Jimenez","t":"SOW","sup":"Thomas Klein","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":240.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":0.75,"fy":1.5}}},{"n":"PRATAP KARRI","t":"FTE","sup":"Herman Lee","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":892.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Pankhuri Prasad","t":"FTE","sup":"Lisa Steigerwald","s":"Active","f":"CORRECT","alloc":["CLEAR App-DA","PR Content-DM"],"tracked":["CLEAR App-DA","PR Content-DM"],"correct":["CLEAR App-DA","PR Content-DM"],"missing":[],"wrong":[],"hrs":872.0,"whrs":0,"pa":{"PR Content-DM":{"ytd":3.0,"fy":6.0},"CLEAR App-DA":{"ytd":3.0,"fy":6.0}}},{"n":"Patricia Schell","t":"FTE","sup":"Karen Steadman","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":264.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":3.0,"fy":6.0}}},{"n":"Prasenjit Aich","t":"SOW","sup":"Krishanu Bhattacharya","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":1008.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Prithvi Raj","t":"SOW","sup":"Herman Lee","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":837.9,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Raj Ramadoss","t":"FTE","sup":"Todd Suhsen","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA","PR Content-DM","PR Content-ND","SHA-ND"],"tracked":["NuCLEAR-DA","PR Content-DM","PR Content-ND","SHA-ND"],"correct":["NuCLEAR-DA","PR Content-DM","PR Content-ND","SHA-ND"],"missing":[],"wrong":[],"hrs":840.0,"whrs":0,"pa":{"PR Content-ND":{"ytd":0.12,"fy":0.25},"PR Content-DM":{"ytd":2.7,"fy":5.4},"SHA-ND":{"ytd":1.38,"fy":2.75},"NuCLEAR-DA":{"ytd":1.38,"fy":2.75}}},{"n":"Ranjit Sahu","t":"FTE","sup":"Kurt Koch","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":742.5,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Renee Skrbec","t":"FTE","sup":"Herman Lee","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA","PR Content-ND"],"tracked":["NuCLEAR-DA","PR Content-ND"],"correct":["NuCLEAR-DA","PR Content-ND"],"missing":[],"wrong":[],"hrs":798.0,"whrs":0,"pa":{"PR Content-ND":{"ytd":4.25,"fy":8.5},"NuCLEAR-DA":{"ytd":5.25,"fy":10.5}}},{"n":"Repakula Mounika","t":"SOW","sup":"Todd Suhsen","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":972.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Roberto Carlos Paredes Cetina","t":"SOW","sup":"Sean McPherson","s":"Active","f":"CORRECT","alloc":["SHA-ND"],"tracked":["SHA-ND"],"correct":["SHA-ND"],"missing":[],"wrong":[],"hrs":872.0,"whrs":0,"pa":{"SHA-ND":{"ytd":3.38,"fy":6.75}}},{"n":"Roberto Vilchis Alvarez","t":"SOW","sup":"Lisa Steigerwald","s":"Exit","f":"CORRECT","alloc":["SHA-ND"],"tracked":["SHA-ND"],"correct":["SHA-ND"],"missing":[],"wrong":[],"hrs":936.0,"whrs":0,"pa":{"SHA-ND":{"ytd":3.38,"fy":6.75}}},{"n":"Rumman Ahmar","t":"SOW","sup":"Herman Lee","s":"Exit","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":378.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":2.0,"fy":2.0}}},{"n":"Samuel Omar Tovias Alanis","t":"SOW","sup":"Herman Lee","s":"Exit","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":400.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":2.5,"fy":2.5}}},{"n":"Sarmistha Tosh","t":"SOW","sup":"Herman Lee","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":999.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Shalini Gupta","t":"FTE","sup":"Krishanu Bhattacharya","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":680.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.5,"fy":11.0}}},{"n":"Shivalik Malhotra","t":"FTE","sup":"Herman Lee","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":804.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Shruthi Shetty","t":"FTE","sup":"Brian McNulty","s":"Active","f":"CORRECT","alloc":["CLEAR App-DA","PR Content-DM","PR Content-ND"],"tracked":["CLEAR App-DA","PR Content-DM","PR Content-ND"],"correct":["CLEAR App-DA","PR Content-DM","PR Content-ND"],"missing":[],"wrong":[],"hrs":844.0,"whrs":0,"pa":{"PR Content-ND":{"ytd":3.0,"fy":6.0},"PR Content-DM":{"ytd":0.0,"fy":0.0},"CLEAR App-DA":{"ytd":3.0,"fy":6.0}}},{"n":"Shubhada Somashekar","t":"FTE","sup":"Shruthi Shetty","s":"Exit","f":"CORRECT","alloc":["PR Content-ND"],"tracked":["PR Content-ND"],"correct":["PR Content-ND"],"missing":[],"wrong":[],"hrs":32.0,"whrs":0,"pa":{"PR Content-ND":{"ytd":0.1,"fy":0.1}}},{"n":"Shubham Bengani","t":"SOW","sup":"Herman Lee","s":"Exit","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":360.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":3.0,"fy":3.0}}},{"n":"Shushrut Prakash Sawant","t":"SOW","sup":"Krishanu Bhattacharya","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":954.2,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Sirangula Subrahmanyeswari","t":"FTE","sup":"Shruthi Shetty","s":"Active","f":"CORRECT","alloc":["CLEAR App-DA","PR Content-ND"],"tracked":["CLEAR App-DA","PR Content-ND"],"correct":["CLEAR App-DA","PR Content-ND"],"missing":[],"wrong":[],"hrs":919.0,"whrs":0,"pa":{"PR Content-ND":{"ytd":3.0,"fy":6.0},"CLEAR App-DA":{"ytd":3.0,"fy":6.0}}},{"n":"Siva Padmanaban","t":"SOW","sup":"Lisa Steigerwald","s":"Active","f":"CORRECT","alloc":["PR Content-DM"],"tracked":["PR Content-DM"],"correct":["PR Content-DM"],"missing":[],"wrong":[],"hrs":967.5,"whrs":0,"pa":{"PR Content-DM":{"ytd":5.75,"fy":11.5}}},{"n":"Steve Hestness","t":"FTE","sup":"Todd Suhsen","s":"Exit","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":528.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":4.0,"fy":4.0}}},{"n":"Sunil Kanchibhotla","t":"FTE","sup":"Todd Suhsen","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":844.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Sunitha Vijayanarayan","t":"FTE","sup":"Kurt Koch","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":836.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Tanmay Ashok Virkar","t":"SOW","sup":"Krishanu Bhattacharya","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":1012.5,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Thomas Klein","t":"FTE","sup":"Brian McNulty","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":891.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Todd Suhsen","t":"FTE","sup":"Brian McNulty","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":829.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Todd Van Otterloo","t":"FTE","sup":"Emre Caglar","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":101.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":3.0,"fy":6.0}}},{"n":"Troy Hanisch","t":"FTE","sup":"Brian McNulty","s":"Exit","f":"CORRECT","alloc":["CLEAR App-DA","NuCLEAR-DA","PR Content-ND"],"tracked":["CLEAR App-DA","NuCLEAR-DA","PR Content-ND"],"correct":["CLEAR App-DA","NuCLEAR-DA","PR Content-ND"],"missing":[],"wrong":[],"hrs":274.0,"whrs":0,"pa":{"PR Content-ND":{"ytd":0.75,"fy":0.75},"CLEAR App-DA":{"ytd":0.75,"fy":0.75},"NuCLEAR-DA":{"ytd":2.0,"fy":2.0}}},{"n":"Uttam Shrestha","t":"FTE","sup":"Herman Lee","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":840.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Vaibhav Sahu","t":"SOW","sup":"Krishanu Bhattacharya","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":1017.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":5.75,"fy":11.5}}},{"n":"Vandana Sarah Roy","t":"FTE","sup":"Maggie Schumacher","s":"Active","f":"CORRECT","alloc":["NuCLEAR-DA"],"tracked":["NuCLEAR-DA"],"correct":["NuCLEAR-DA"],"missing":[],"wrong":[],"hrs":836.0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":6.0,"fy":12.0}}},{"n":"Will Reishus","t":"SOW","sup":"Lisa Steigerwald","s":"Active","f":"CORRECT","alloc":["PR Content-ND"],"tracked":["PR Content-ND"],"correct":["PR Content-ND"],"missing":[],"wrong":[],"hrs":633.0,"whrs":0,"pa":{"PR Content-ND":{"ytd":3.75,"fy":7.5}}},{"n":"Zane Hungerford","t":"SOW","sup":"Lisa Steigerwald","s":"Exit","f":"CORRECT","alloc":["PR Content-ND"],"tracked":["PR Content-ND"],"correct":["PR Content-ND"],"missing":[],"wrong":[],"hrs":352.0,"whrs":0,"pa":{"PR Content-ND":{"ytd":2.5,"fy":2.5}}},{"n":"Akanksha Vaidya","t":"SOW","sup":"Brian McNulty","s":"Non-Billable Active","f":"NO_HOURS","alloc":["NuCLEAR-DA"],"tracked":[],"correct":[],"missing":["NuCLEAR-DA"],"wrong":[],"hrs":0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":0.0,"fy":0.0}}},{"n":"Eric Hansen","t":"SOW","sup":"Lisa Steigerwald","s":"Active","f":"NO_HOURS","alloc":["PR Content-ND"],"tracked":[],"correct":[],"missing":["PR Content-ND"],"wrong":[],"hrs":116.0,"whrs":0,"pa":{"PR Content-ND":{"ytd":5.75,"fy":11.5}}},{"n":"Jesus Roberto Vazque Garcia","t":"SOW","sup":"Brian McNulty","s":"Non-Billable Active","f":"NO_HOURS","alloc":["NuCLEAR-DA"],"tracked":[],"correct":[],"missing":["NuCLEAR-DA"],"wrong":[],"hrs":0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":0.0,"fy":0.0}}},{"n":"Julio Saenz Martinez Sanchez","t":"SOW","sup":"Brian McNulty","s":"Non-Billable Active","f":"NO_HOURS","alloc":["NuCLEAR-DA"],"tracked":[],"correct":[],"missing":["NuCLEAR-DA"],"wrong":[],"hrs":0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":0.0,"fy":0.0}}},{"n":"Jyoti Prateem","t":"SOW","sup":"Brian McNulty","s":"Non-Billable Active","f":"NO_HOURS","alloc":["NuCLEAR-DA"],"tracked":[],"correct":[],"missing":["NuCLEAR-DA"],"wrong":[],"hrs":0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":0.0,"fy":0.0}}},{"n":"Nidhi Bhardwaj","t":"SOW","sup":"Brian McNulty","s":"Non-Billable Active","f":"NO_HOURS","alloc":["NuCLEAR-DA"],"tracked":[],"correct":[],"missing":["NuCLEAR-DA"],"wrong":[],"hrs":0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":0.0,"fy":0.0}}},{"n":"Open2","t":"FTE","sup":"Thomas Klein","s":"Open","f":"NO_HOURS","alloc":["NuCLEAR-DA"],"tracked":[],"correct":[],"missing":["NuCLEAR-DA"],"wrong":[],"hrs":0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":0.0,"fy":6.5}}},{"n":"Open3","t":"FTE","sup":"Lisa Steigerwald","s":"Open","f":"NO_HOURS","alloc":["CLEAR App-DA"],"tracked":[],"correct":[],"missing":["CLEAR App-DA"],"wrong":[],"hrs":0,"whrs":0,"pa":{"CLEAR App-DA":{"ytd":0.0,"fy":6.5}}},{"n":"Priyanshu Solanki","t":"SOW","sup":"Brian McNulty","s":"Non-Billable Active","f":"NO_HOURS","alloc":["NuCLEAR-DA"],"tracked":[],"correct":[],"missing":["NuCLEAR-DA"],"wrong":[],"hrs":0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":0.0,"fy":0.0}}},{"n":"Saikumar Mujja","t":"SOW","sup":"Brian McNulty","s":"Non-Billable Active","f":"NO_HOURS","alloc":["NuCLEAR-DA"],"tracked":[],"correct":[],"missing":["NuCLEAR-DA"],"wrong":[],"hrs":0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":0.0,"fy":0.0}}},{"n":"Saurabh Jadhav","t":"SOW","sup":"Brian McNulty","s":"Non-Billable Active","f":"NO_HOURS","alloc":["NuCLEAR-DA"],"tracked":[],"correct":[],"missing":["NuCLEAR-DA"],"wrong":[],"hrs":0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":0.0,"fy":0.0}}},{"n":"Tribhuvan Narain Watts","t":"SOW","sup":"Brian McNulty","s":"Non-Billable Active","f":"NO_HOURS","alloc":["NuCLEAR-DA"],"tracked":[],"correct":[],"missing":["NuCLEAR-DA"],"wrong":[],"hrs":0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":0.0,"fy":0.0}}},{"n":"V Srikar","t":"SOW","sup":"Brian McNulty","s":"Non-Billable Active","f":"NO_HOURS","alloc":["NuCLEAR-DA"],"tracked":[],"correct":[],"missing":["NuCLEAR-DA"],"wrong":[],"hrs":0,"whrs":0,"pa":{"NuCLEAR-DA":{"ytd":0.0,"fy":0.0}}}];
function ResourceView(){
  const MONTHS=['Jan','Feb','Mar','Apr','May','Jun'];
  const PROJ_ORDER=['NuCLEAR-DA','PR Content-DM','PR Content-ND','CLEAR App-DA','SHA-ND'];
  const P_FULL={'NuCLEAR-DA':'PE-RF-NuCLEAR Cont. Modern-DA','PR Content-DM':'PE-RF-Public Records Content-DM','PR Content-ND':'PE-RF-Public Records Content-ND','CLEAR App-DA':'PE-RF-PR CLEAR App. Opt. Content-DA','SHA-ND':'PE-CE-Content SHA-ND'};
  const PROJ_KEY={'NuCLEAR-DA':'PE-RF-NuCLEAR Cont. Modern-DA','PR Content-DM':'PE-RF-Public Records Content-DM','PR Content-ND':'PE-RF-Public Records Content-ND','CLEAR App-DA':'PE-RF-PR CLEAR App. Opt. Content-DA','SHA-ND':'PE-CE-Content SHA-ND'};
  const fmM=(n)=>n==null||isNaN(n)||n===0?'—':fmt(n);
  const [expanded,setExpanded]=useState({});

  // Build lookup from ALLOC data: name|project → {pj[6], ac[6]}
  // ALLOC format: [name, type, proj_idx, hourly, cr, [pj×5], [ac×5]]
  const allocMap=useMemo(()=>{
    const m={};
    ALLOC.forEach(r=>{const k=r[0]+'|'+ALLOC_PROJ[r[2]]; m[k]={pj:r[6],ac:r[7]};});
    return m;
  },[]);
  const [projF,setProjF]=useState('All');
  const [typeF,setTypeF]=useState('All');
  const [statusF,setStatusF]=useState('All');
  const [bandF,setBandF]=useState('All');
  const [locF,setLocF]=useState('All');
  const [vendF,setVendF]=useState('All');
  const [supF,setSupF]=useState('All');
  const [nameF,setNameF]=useState('All');
  const toggle=(p)=>setExpanded(e=>({...e,[p]:!e[p]}));
  const selStyle={background:C.surface,color:C.text,border:`1px solid ${C.surfaceBorder}`,borderRadius:6,padding:'6px 10px',fontSize:12,fontFamily:'inherit'};

  // Unique values for dropdown options (derived from RD)
  const uniq=(field)=>['All',...new Set(RD.map(r=>r[field]).filter(Boolean).sort())];
  const bands=uniq('b'), locs=uniq('l'), vends=uniq('v'), sups=uniq('sup');
  const names=['All',...new Set(RD.map(r=>r.n).filter(Boolean).sort())];

  const filtered=RD.filter(r=>
    (projF==='All'||r.p===projF)&&
    (typeF==='All'||r.t===typeF||(typeF==='Open'&&r.s==='Open'))&&
    (statusF==='All'||r.s===statusF||(statusF==='Non-Billable'&&r.s==='Non-Billable Active')||(statusF==='Open'&&r.s==='Open'))&&
    (bandF==='All'||r.b===bandF)&&
    (locF==='All'||r.l===locF)&&
    (vendF==='All'||r.v===vendF)&&
    (supF==='All'||r.sup===supF)&&
    (nameF==='All'||r.n===nameF)
  );

  const byProj={};
  PROJ_ORDER.forEach(p=>{byProj[p]=filtered.filter(r=>r.p===p);});

  // Project monthly totals from MD (already computed at project level)
  const projMD=(proj)=>PROJ_KEY[proj]?MD[PROJ_KEY[proj]]:null;

  // Grand totals across all months from MD for filtered projects
  const filteredProjKeys=[...new Set(filtered.map(r=>r.p))];
  const grandFc=MONTHS.reduce((s,m)=>s+filteredProjKeys.reduce((ss,p)=>ss+(MD[PROJ_KEY[p]]?.[m]?.fc||0)+(MD[PROJ_KEY[p]]?.[m]?.fo||0),0),0);
  const grandCc=MONTHS.reduce((s,m)=>s+filteredProjKeys.reduce((ss,p)=>ss+(MD[PROJ_KEY[p]]?.[m]?.cc||0)+(MD[PROJ_KEY[p]]?.[m]?.co||0),0),0);

  const totRRC=filtered.reduce((s,r)=>s+r.tfc,0);
  const totRRO=filtered.reduce((s,r)=>s+r.tfo,0);
  const avgCR=filtered.filter(r=>r.cr>0).length>0?filtered.filter(r=>r.cr>0).reduce((s,r)=>s+r.cr,0)/filtered.filter(r=>r.cr>0).length:0;
  const statusDotColor=(s)=>s==='Active'?C.green:s==='Exit'?C.red:s==='Non-Billable Active'?C.gold:s==='Open'?C.blue:'#888';
  const hdCell={padding:'5px 8px',color:C.textMuted,fontWeight:600,textAlign:'right',fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}`,whiteSpace:'nowrap',background:'#f7fafc'};
  const cell=(v,color,bold)=>({padding:'6px 8px',textAlign:'right',color:color||C.textMuted,fontWeight:bold?700:400,fontSize:11,whiteSpace:'nowrap',borderBottom:`1px solid ${C.surfaceBorder}22`});

  return(
    <div>
      <div style={{marginBottom:16}}>
        <div style={{marginBottom:10}}>
          <h1 style={{color:C.text,fontWeight:700,fontSize:22,margin:'0 0 4px'}}>Resource Overview</h1>
          <p style={{color:C.textMuted,fontSize:13,margin:0}}>Spend by project · Run rate · Employee status</p>
        </div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          <select value={projF} onChange={e=>setProjF(e.target.value)} style={selStyle}>
            <option value="All">All Projects</option>
            {PROJ_ORDER.map(p=><option key={p} value={p}>{P_FULL[p]||p}</option>)}
          </select>
          <select value={typeF} onChange={e=>setTypeF(e.target.value)} style={selStyle}>
            <option value="All">All Types</option>
            <option value="FTE">FTE</option>
            <option value="SOW">SOW</option>
            <option value="Open">Open Positions</option>
          </select>
          <select value={statusF} onChange={e=>setStatusF(e.target.value)} style={selStyle}>
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Exit">Exit</option>
            <option value="Non-Billable">Non-Billable</option>
            <option value="Open">Open</option>
          </select>
          <select value={supF} onChange={e=>setSupF(e.target.value)} style={selStyle}>
            <option value="All">All Supervisors</option>
            {sups.slice(1).map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <select value={bandF} onChange={e=>setBandF(e.target.value)} style={selStyle}>
            <option value="All">All Bands</option>
            {bands.slice(1).map(b=><option key={b} value={b}>{b}</option>)}
          </select>
          <select value={locF} onChange={e=>setLocF(e.target.value)} style={selStyle}>
            <option value="All">All Locations</option>
            {locs.slice(1).map(l=><option key={l} value={l}>{l}</option>)}
          </select>
          <select value={vendF} onChange={e=>setVendF(e.target.value)} style={selStyle}>
            <option value="All">All Vendors</option>
            {vends.slice(1).map(v=><option key={v} value={v}>{v}</option>)}
          </select>
          <select value={nameF} onChange={e=>setNameF(e.target.value)} style={selStyle}>
            <option value="All">All Resources</option>
            {names.slice(1).map(n=><option key={n} value={n}>{n}</option>)}
          </select>
          {(projF!=='All'||typeF!=='All'||statusF!=='All'||bandF!=='All'||locF!=='All'||vendF!=='All'||supF!=='All'||nameF!=='All')&&(
            <button onClick={()=>{setProjF('All');setTypeF('All');setStatusF('All');setBandF('All');setLocF('All');setVendF('All');setSupF('All');setNameF('All');}} style={{padding:'6px 10px',borderRadius:6,border:`1px solid ${C.red}44`,background:C.redSoft,color:C.red,fontSize:11,cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>✕ Clear</button>
          )}
        </div>
      </div>

      {/* Resource Spend by Project */}
      <div style={{background:C.surface,border:`1px solid ${C.surfaceBorder}`,borderRadius:8,overflow:'hidden',marginBottom:16}}>
        <div style={{background:'#c05621',padding:'8px 14px'}}>
          <h3 style={{color:'#fff',fontSize:13,fontWeight:700,margin:0}}>Resource Spend by Project — Monthly (Forecast CapEx | Forecast OpEx | Cal Actuals)</h3>
        </div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:11,tableLayout:'auto'}}>
            <thead>
              <tr style={{background:'#f7fafc'}}>
                <th style={{...hdCell,textAlign:'left',minWidth:200,position:'sticky',left:0,background:'#f7fafc',zIndex:2,boxShadow:'2px 0 5px rgba(0,0,0,0.08)'}}>Project / Resource</th>
                <th colSpan={3} style={{...hdCell,textAlign:'center',borderLeft:`1px solid ${C.surfaceBorder}`,color:C.gold,background:'#ebebeb'}}>YTD Total<div style={{fontSize:9,fontStyle:'italic',fontWeight:400,color:C.textDim,marginTop:1}}>Jan–Jun</div></th>
                {MONTHS.map(m=><th key={m} colSpan={3} style={{...hdCell,textAlign:'center',borderLeft:`1px solid ${C.surfaceBorder}`}}>{m}</th>)}
              </tr>
              <tr style={{background:'#f7fafc'}}>
                <th style={{...hdCell,textAlign:'left',position:'sticky',left:0,background:'#f7fafc',zIndex:2,boxShadow:'2px 0 5px rgba(0,0,0,0.08)'}}></th>
                {['Fc Cap','Fc Op','Cal Act'].map((h,j)=>(
                  <th key={`YTD_${h}`} style={{...hdCell,color:j===2?C.teal:C.gold,borderLeft:j===0?`1px solid ${C.surfaceBorder}`:'none',background:'#ebebeb'}}>{h}</th>
                ))}
                {[...MONTHS].map(m=>['Fc Cap','Fc Op','Cal Act'].map((h,j)=>(
                  <th key={`${m}_${h}`} style={{...hdCell,color:j===2?C.teal:C.textMuted,borderLeft:j===0?`1px solid ${C.surfaceBorder}`:'none'}}>{h}</th>
                )))}
              </tr>
            </thead>
            <tbody>
              {PROJ_ORDER.map(proj=>{
                const pKey=PROJ_KEY[proj]; const pmd=MD[pKey]; const rows=byProj[proj];
                if(!pmd) return null;
                const isSHA=proj==='SHA-ND'; const projColor=isSHA?C.purple:C.orange;
                const isExp=expanded[proj];
                const ytdFc=MONTHS.reduce((s,m)=>s+pmd[m].fc,0);
                const ytdFo=MONTHS.reduce((s,m)=>s+pmd[m].fo,0);
                const ytdCc=MONTHS.reduce((s,m)=>s+pmd[m].cc,0);
                const ytdCo=MONTHS.reduce((s,m)=>s+pmd[m].co,0);
                return([
                  <tr key={`proj_${proj}`} style={{background:isSHA?C.purple+'11':C.surface,borderTop:`1px solid ${C.surfaceBorder}`,cursor:'pointer'}} onClick={()=>toggle(proj)}>
                    <td style={{padding:'8px 10px',color:projColor,fontWeight:700,position:'sticky',left:0,background:isSHA?'#f3e8ff':C.surface,fontSize:12,whiteSpace:'nowrap',boxShadow:'2px 0 5px rgba(0,0,0,0.08)'}}>
                      <span style={{marginRight:6,fontSize:10}}>{isExp?'▼':'▶'}</span>
                      {P_FULL[proj]} <span style={{color:C.textDim,fontWeight:400,fontSize:10}}>({rows.length})</span>
                    </td>
                    <td style={{...cell(ytdFc,projColor,true),borderLeft:`1px solid ${C.surfaceBorder}22`,background:'#ebebeb'}}>{fmM(ytdFc)}</td>
                    <td style={{...cell(ytdFo,projColor+'99'),background:'#ebebeb'}}>{fmM(ytdFo)}</td>
                    <td style={{...cell(ytdCc,C.teal,true),background:'#ebebeb'}}>{fmM(ytdCc)}</td>
                    {MONTHS.map(m=>[
                      <td key={`${proj}_${m}_fc`} style={{...cell(pmd[m].fc,projColor,true),borderLeft:`1px solid ${C.surfaceBorder}22`}}>{fmM(pmd[m].fc)}</td>,
                      <td key={`${proj}_${m}_fo`} style={cell(pmd[m].fo,projColor+'99')}>{fmM(pmd[m].fo)}</td>,
                      <td key={`${proj}_${m}_cc`} style={cell(pmd[m].cc,C.teal,true)}>{fmM(pmd[m].cc)}</td>,
                    ])}
                  </tr>,
                  ...(isExp?rows.map((r,ri)=>(
                    <tr key={`res_${r.n}_${proj}_${ri}`} style={{background:ri%2?'#f0f2f566':'transparent'}}>
                      <td style={{padding:'5px 10px 5px 26px',color:C.text,position:'sticky',left:0,background:ri%2?'#f0f2f5':C.surface,whiteSpace:'nowrap',boxShadow:'2px 0 5px rgba(0,0,0,0.08)'}}>
                        <span style={{color:statusDotColor(r.s),marginRight:5,fontSize:9}}>●</span>
                        {r.n}
                        <span style={{marginLeft:6,padding:'1px 5px',borderRadius:6,fontSize:9,background:r.t==='FTE'?C.blueSoft:C.goldSoft,color:r.t==='FTE'?C.blue:C.gold}}>{r.t}</span>
                      </td>
                      <td style={{...cell(r.tfc,null,true),borderLeft:`1px solid ${C.surfaceBorder}11`,background:'#ebebeb'}}>{fmM(r.tfc)}</td>
                      <td style={{...cell(r.tfo),background:'#ebebeb'}}>{fmM(r.tfo)}</td>
                      <td style={{...cell(r.tca,C.teal,true),background:'#ebebeb'}}>{fmM(r.tca)}</td>
                      {(() => {
                        const ad=allocMap[r.n+'|'+r.p];
                        const MI={'Jan':0,'Feb':1,'Mar':2,'Apr':3,'May':4,'Jun':5};
                        return MONTHS.map(m=>{
                          const mi=MI[m];
                          const fc=ad?.pj[mi]||0;
                          const cc=ad?.ac[mi]||0;
                          // Derive monthly OpEx proportionally from YTD total
                          const ytdPj=(ad?.pj||[]).slice(0,6).reduce((s,v)=>s+v,0);
                          const fo=ytdPj>0&&r.tfo>0?Math.round(r.tfo*(ad?.pj[mi]||0)/ytdPj):0;
                          return[
                            <td key={`${r.n}_${m}_fc`} style={{...cell(fc),borderLeft:`1px solid ${C.surfaceBorder}11`}}>{fc>0?fmM(fc):'—'}</td>,
                            <td key={`${r.n}_${m}_fo`} style={cell(fo)}>{fo>0?fmM(fo):'—'}</td>,
                            <td key={`${r.n}_${m}_cc`} style={cell(cc,C.teal)}>{cc>0?fmM(cc):'—'}</td>,
                          ];
                        });
                      })()}
                    </tr>
                  )):[])
                ]);
              })}
            </tbody>
          </table>
        </div>
        <div style={{padding:'6px 14px',borderTop:`1px solid ${C.surfaceBorder}`}}>
          <p style={{color:C.textDim,fontSize:10,margin:0}}>▶ Click a project to expand resources. Project rows show monthly CapEx/OpEx. Individual rows show YTD totals. Values in $M.</p>
        </div>
      </div>

      {/* Run Rate + Employee Status */}
      <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:16}}>
        <div style={{background:C.surface,border:`1px solid ${C.surfaceBorder}`,borderRadius:8,overflow:'hidden'}}>
          <div style={{background:'#c05621',padding:'8px 14px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3 style={{color:'#fff',fontSize:13,fontWeight:700,margin:0}}>2026 Run Rate</h3>
            <span style={{color:'#ffccbb',fontSize:11}}>Avg CapEx: {avgCR.toFixed(1)}% · RR Fc: {fmM(totRRC)} · RR Op: {fmM(totRRO)}</span>
          </div>
          <div style={{overflowY:'auto',maxHeight:420}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
              <thead style={{position:'sticky',top:0,zIndex:1}}>
                <tr style={{background:'#f7fafc'}}>
                  {['Resource','Type','Role','Location','Vendor','Band','CapEx%','RR Capex','RR Opex'].map(h=>(
                    <th key={h} style={{padding:'7px 10px',color:C.textMuted,fontWeight:600,textAlign:['CapEx%','RR Capex','RR Opex'].includes(h)?'right':'left',fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}`,whiteSpace:'nowrap',...(h==='Resource'?{position:'sticky',left:0,background:'#f7fafc',zIndex:2,boxShadow:'2px 0 5px rgba(0,0,0,0.08)'}:{})}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.filter(r=>r.tfc>0||r.tfo>0).sort((a,b)=>b.tfc-a.tfc).map((r,i)=>(
                  <tr key={`rr_${r.id}_${r.p}_${i}`} style={{borderBottom:`1px solid ${C.surfaceBorder}11`,background:i%2?'transparent':'#f0f2f566'}}>
                    <td style={{padding:'5px 10px',color:C.text,fontWeight:600,whiteSpace:'nowrap',maxWidth:130,overflow:'hidden',textOverflow:'ellipsis',position:'sticky',left:0,background:i%2?C.surface:'#f0f2f5',zIndex:1,boxShadow:'2px 0 5px rgba(0,0,0,0.08)'}}>{r.n}</td>
                    <td style={{padding:'5px 10px'}}><span style={{padding:'1px 5px',borderRadius:6,fontSize:9,background:r.t==='FTE'?C.blueSoft:C.goldSoft,color:r.t==='FTE'?C.blue:C.gold}}>{r.t}</span></td>
                    <td style={{padding:'5px 10px',color:C.textMuted,maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.r}</td>
                    <td style={{padding:'5px 10px',color:C.textMuted}}>{r.l}</td>
                    <td style={{padding:'5px 10px',color:C.textMuted,maxWidth:90,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.v}</td>
                    <td style={{padding:'5px 10px',color:C.textMuted}}>{r.b}</td>
                    <td style={{padding:'5px 10px',textAlign:'right',color:r.cr>=90?C.teal:r.cr>=70?C.gold:C.orange,fontWeight:600}}>{r.cr}%</td>
                    <td style={{padding:'5px 10px',textAlign:'right',color:C.blue,fontWeight:600}}>{fmM(r.tfc)}</td>
                    <td style={{padding:'5px 10px',textAlign:'right',color:C.gold}}>{fmM(r.tfo)}</td>
                  </tr>
                ))}
                <tr style={{background:C.surface,borderTop:`1px solid ${C.orange}`}}>
                  <td colSpan={6} style={{padding:'7px 10px',color:C.text,fontWeight:700,fontSize:11,position:'sticky',left:0,background:C.surface,boxShadow:'2px 0 5px rgba(0,0,0,0.08)'}}>TOTAL</td>
                  <td style={{padding:'7px 10px',textAlign:'right',color:C.teal,fontWeight:700}}>{avgCR.toFixed(1)}%</td>
                  <td style={{padding:'7px 10px',textAlign:'right',color:C.blue,fontWeight:700}}>{fmM(totRRC)}</td>
                  <td style={{padding:'7px 10px',textAlign:'right',color:C.gold,fontWeight:700}}>{fmM(totRRO)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{background:C.surface,border:`1px solid ${C.surfaceBorder}`,borderRadius:8,overflow:'hidden'}}>
          <div style={{background:'#c05621',padding:'8px 14px'}}>
            <h3 style={{color:'#fff',fontSize:13,fontWeight:700,margin:0}}>Employee Status</h3>
          </div>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
            <thead><tr style={{background:'#f7fafc'}}>
              {['Supervisor','Active','Exit','Non-Bill','Open'].map(h=>(
                <th key={h} style={{padding:'7px 10px',color:C.textMuted,fontWeight:600,textAlign:h==='Supervisor'?'left':'center',fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}`,whiteSpace:'nowrap'}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {(()=>{
                const fp={};
                filtered.forEach(r=>{if(!fp[r.n])fp[r.n]={s:r.s,sup:r.sup};});
                const frs={};
                Object.values(fp).forEach(({s,sup})=>{
                  if(!frs[sup])frs[sup]={A:0,E:0,N:0,O:0};
                  if(s==='Active')frs[sup].A++;
                  else if(s==='Exit')frs[sup].E++;
                  else if(s==='Non-Billable Active')frs[sup].N++;
                  else if(s==='Open')frs[sup].O++;
                });
                return Object.entries(frs).sort((a,b)=>b[1].A-a[1].A).map(([sup,c],i)=>(
                  <tr key={sup} style={{borderBottom:`1px solid ${C.surfaceBorder}11`,background:i%2?'transparent':'#f0f2f566'}}>
                    <td style={{padding:'6px 10px',color:C.text,fontWeight:600,whiteSpace:'nowrap'}}>{sup}</td>
                    {['A','E','N','O'].map(k=>{
                      const col=k==='A'?C.green:k==='E'?C.red:k==='N'?C.gold:C.blue;
                      const bg=k==='A'?C.greenSoft:k==='E'?C.redSoft:k==='N'?C.goldSoft:C.blueSoft;
                      return <td key={k} style={{padding:'6px 10px',textAlign:'center'}}>
                        {c[k]>0&&<span style={{display:'inline-block',minWidth:20,padding:'1px 6px',borderRadius:10,background:bg,color:col,fontWeight:700,fontSize:11}}>{c[k]}</span>}
                      </td>;
                    })}
                  </tr>
                ));
              })()}
              <tr style={{background:C.surface,borderTop:`1px solid ${C.orange}`}}>
                <td style={{padding:'7px 10px',color:C.text,fontWeight:700}}>TOTAL</td>
                {['A','E','N','O'].map(k=>{
                  const fp={};
                  filtered.forEach(r=>{if(!fp[r.n])fp[r.n]=r.s;});
                  const sMap={'A':'Active','E':'Exit','N':'Non-Billable Active','O':'Open'};
                  const tot=Object.values(fp).filter(s=>s===sMap[k]).length;
                  const col=k==='A'?C.green:k==='E'?C.red:k==='N'?C.gold:C.blue;
                  return <td key={k} style={{padding:'7px 10px',textAlign:'center',fontWeight:700,color:col}}>{tot||'—'}</td>;
                })}
              </tr>
            </tbody>
          </table>
          <div style={{padding:'10px 14px',borderTop:`1px solid ${C.surfaceBorder}`}}>
            <p style={{color:C.textMuted,fontSize:11,margin:'0 0 8px',fontWeight:600}}>Filtered headcount ({filtered.length} resources)</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
              {[['Active',new Set(filtered.filter(r=>r.s==='Active').map(r=>r.n)).size,C.green,C.greenSoft],
                ['Exit',new Set(filtered.filter(r=>r.s==='Exit').map(r=>r.n)).size,C.red,C.redSoft],
                ['Non-Billable',new Set(filtered.filter(r=>r.s==='Non-Billable Active').map(r=>r.n)).size,C.gold,C.goldSoft],
                ['Open',new Set(filtered.filter(r=>r.s==='Open').map(r=>r.n)).size,C.blue,C.blueSoft],
              ].map(([lbl,cnt,col,bg])=>(
                <div key={lbl} style={{background:bg,borderRadius:6,padding:'7px 10px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{color:col,fontSize:11,fontWeight:600}}>{lbl}</span>
                  <span style={{color:col,fontSize:17,fontWeight:700}}>{cnt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ALLOCATION vs ACTUALS ──────────────────────────────────────── */
function AllocSpendView(){
  const YTD=['Jan','Feb','Mar','Apr','May'];
  const [projF,setProjF]=useState('All');
  const [typeF,setTypeF]=useState('All');
  const [exM,setExM]=useState(new Set());
  const togM=m=>setExM(prev=>{const n=new Set(prev);n.has(m)?n.delete(m):n.add(m);return n;});
  const [exFTE,setExFTE]=useState(true);
  const [exSOW,setExSOW]=useState(true);
  const MOS=['Jan','Feb','Mar','Apr','May','Jun'];
  const hdrRef=useRef(null),fteRef=useRef(null),sowRef=useRef(null),totRef=useRef(null);
  const syncScroll=src=>{const sl=src.scrollLeft;[hdrRef,fteRef,sowRef,totRef].forEach(r=>{if(r.current&&r.current!==src)r.current.scrollLeft=sl;});};

  const f$=(n)=>n==null?'—':Math.abs(n)>=1e6?`$${(n/1e6).toFixed(2)}M`:Math.abs(n)>=1000?`$${(n/1e3).toFixed(1)}K`:`$${Math.round(n)}`;
  const vc=(v)=>v>0?C.red:v<0?C.green:C.textMuted;
  const vs=(v)=>v>0?'+':'';
  const rows=ALLOC
    .filter(r=>(projF==='All'||ALLOC_PROJ[r[2]]===projF)&&(typeF==='All'||(typeF==='FTE'&&r[1]===0)||(typeF==='SOW'&&r[1]===1)))
    .map(r=>{
      const [nm,tp,pi,hr,cr,acr,pj,ac]=r;
      const yp=pj.slice(0,6).reduce((s,v)=>s+v,0);
      const ya=ac.slice(0,6).reduce((s,v)=>s+v,0);
      return{nm,tp:tp?'SOW':'FTE',pn:ALLOC_PROJ[pi],cr,acr,pj,ac,yp,ya,yv:ya-yp,yvp:yp>0?(ya-yp)/yp*100:0};
    }).sort((a,b)=>a.pn.localeCompare(b.pn)||a.nm.localeCompare(b.nm));
  const gp=rows.reduce((s,r)=>s+r.yp,0),ga=rows.reduce((s,r)=>s+r.ya,0),gv=ga-gp;
  const fteRows=rows.filter(r=>r.tp==='FTE');
  const sowRows=rows.filter(r=>r.tp==='SOW');
  const ftePgp=fteRows.reduce((s,r)=>s+r.yp,0),fteGa=fteRows.reduce((s,r)=>s+r.ya,0);
  const sowGp=sowRows.reduce((s,r)=>s+r.yp,0),sowGa=sowRows.reduce((s,r)=>s+r.ya,0);
  const ss={background:C.surface,color:C.text,border:`1px solid ${C.surfaceBorder}`,borderRadius:6,padding:'5px 10px',fontSize:12,fontFamily:'inherit'};
  const tb=(v,l,c)=><button onClick={()=>setTypeF(v)} style={{padding:'5px 11px',borderRadius:6,border:`1.5px solid ${typeF===v?c:C.surfaceBorder}`,background:typeF===v?c+'22':'transparent',color:typeF===v?c:C.textMuted,fontSize:12,fontWeight:typeF===v?700:400,cursor:'pointer',fontFamily:'inherit'}}>{l}</button>;
  const hd=(lbl,c,bg)=><th style={{padding:'6px 8px',color:c||C.textMuted,fontWeight:700,textAlign:'right',fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}`,whiteSpace:'nowrap',background:bg?'#ebebeb':'#f7fafc'}}>{lbl}</th>;
  const mc=(v,c,b,bg)=><td style={{padding:'5px 8px',textAlign:'right',color:c||C.textMuted,fontWeight:b?700:400,fontSize:11,whiteSpace:'nowrap',borderBottom:`1px solid ${C.surfaceBorder}11`,background:bg||'transparent'}}>{v}</td>;
  const avgPlan=(arr)=>arr.length>0?(arr.reduce((s,r)=>s+r.cr,0)/arr.length).toFixed(1)+'%':'—';
  const avgAct=(arr)=>{const v=arr.filter(r=>r.acr!=null);return v.length>0?(v.reduce((s,r)=>s+r.acr,0)/v.length).toFixed(1)+'%':'—';};
  const crTd=(val,col)=><td style={{padding:'5px 6px',textAlign:'center',color:col||C.textMuted,fontWeight:700,fontSize:10}}>{val}</td>;

  return(<div>
    <div style={{marginBottom:16}}>
      <h1 style={{color:C.text,fontWeight:700,fontSize:22,margin:'0 0 4px'}}>Allocation vs Spend</h1>
      <p style={{color:C.textMuted,fontSize:13,margin:0}}>Monthly CapEx allocation (Resourcing Model) vs actual spend (MyTime hrs × Hourly Rate × CapEx Rate) · Actuals: Jan–Jun</p>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:14}}>
      <KPI label="YTD RM Fc" value={f$(gp)} color={C.blue} period="Jan–Jun" sub="Sum of monthly allocations"/>
      <KPI label="YTD Cal Act" value={f$(ga)} color={C.orange} period="Jan–Jun" sub="MyTime hrs × Rate × CapEx%"/>
      <KPI label="YTD Variance" value={(gv>=0?'+':'')+f$(gv)} color={vc(gv)} period="Jan–Jun" sub={gp>0?`${(gv/gp*100).toFixed(1)}% vs projection`:''}/>
      <KPI label="Utilisation" value={gp>0?`${(ga/gp*100).toFixed(1)}%`:'—'} color={ga>gp?C.red:C.teal} period="Jan–Jun" sub={ga>gp?'Over-allocated':'Under-allocated'}/>
    </div>
    <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:12,flexWrap:'wrap'}}>
      <select value={projF} onChange={e=>setProjF(e.target.value)} style={ss}>
        <option value="All">All Projects</option>
        {ALLOC_PROJ.map(p=><option key={p} value={p}>{p}</option>)}
      </select>
      <div style={{display:'flex',gap:6}}>{tb('All','All',C.text)}{tb('FTE','FTE',C.blue)}{tb('SOW','SOW',C.gold)}</div>
      <span style={{color:C.textDim,fontSize:11,marginLeft:'auto'}}>{rows.length} resources · Jun RM Fc loaded · MyTime Jun loaded</span>
    </div>
    <div style={{background:C.surface,border:`1px solid ${C.surfaceBorder}`,borderRadius:8,overflow:'hidden'}}>
      <div style={{background:'#c05621',padding:'8px 14px',display:'flex',gap:16,alignItems:'center'}}>
        <h3 style={{color:'#fff',fontSize:13,fontWeight:700,margin:0}}>Allocation vs Spend — Per Resource per Month</h3>
        <span style={{color:'#ffccbb',fontSize:11}}>Formula: MyTime CapEx Hours × Hourly Rate × CapEx Rate</span>
      </div>
      {/* ── Sticky Column Header ─────────────────────────────────────── */}
      <div ref={hdrRef} onScroll={e=>syncScroll(e.currentTarget)}
           style={{overflowX:'hidden',position:'sticky',top:0,zIndex:10,background:'#f7fafc',boxShadow:'0 2px 4px rgba(0,0,0,0.08)'}}>
        <table style={{width:'100%',minWidth:1600,borderCollapse:'collapse',fontSize:11}}>
<thead style={{visibility:'collapse',height:0}}>
            <tr style={{background:'#f7fafc'}}>
              <th style={{padding:'7px 10px',textAlign:'left',color:C.textMuted,fontWeight:600,fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}`,position:'sticky',left:0,background:'#f7fafc',minWidth:170,whiteSpace:'nowrap'}}>Resource</th>
              <th style={{padding:'7px 8px',textAlign:'left',color:C.textMuted,fontWeight:600,fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}`,whiteSpace:'nowrap'}}>Project</th>
              <th style={{padding:'7px 6px',textAlign:'center',color:C.textMuted,fontWeight:600,fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}`}}>Plan CR%</th>
              <th style={{padding:'7px 6px',textAlign:'center',color:C.teal,fontWeight:600,fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}`}}>Act CR%</th>
              <th colSpan={3} style={{padding:'6px 8px',textAlign:'center',color:C.gold,fontWeight:700,fontSize:10,borderLeft:`2px solid ${C.gold}44`,borderBottom:`1px solid ${C.surfaceBorder}`,background:'#ebebeb'}}>YTD<div style={{fontSize:8,fontStyle:'italic',fontWeight:400,color:C.textDim}}>Jan–Jun</div></th>
              {MOS.map(m=>{const ex=exM.has(m);return(
                <th key={m} colSpan={ex?3:1} onClick={()=>togM(m)} style={{padding:'6px 8px',textAlign:'center',color:ex?C.text:C.textMuted,fontWeight:700,fontSize:10,borderLeft:`1px solid ${C.surfaceBorder}22`,borderBottom:`1px solid ${C.surfaceBorder}`,cursor:'pointer',userSelect:'none',whiteSpace:'nowrap',background:ex?'transparent':'#fafafa'}}>
                  <span style={{marginRight:3,fontSize:9,color:C.textDim}}>{ex?'▼':'▶'}</span>{m}
                </th>
              );})}
            </tr>
            <tr style={{background:'#f7fafc'}}>
              <th style={{padding:'4px 10px',position:'sticky',left:0,background:'#f7fafc',borderBottom:`1px solid ${C.surfaceBorder}`}}></th>
              <th style={{borderBottom:`1px solid ${C.surfaceBorder}`}}></th>
              <th style={{borderBottom:`1px solid ${C.surfaceBorder}`}}></th>
              <th style={{borderBottom:`1px solid ${C.surfaceBorder}`}}></th>
              {hd('RM Fc',C.blue,true)}{hd('Cal Act',C.teal,true)}{hd('Var',C.gold,true)}
              {MOS.map(m=>exM.has(m)?[hd('RM Fc',C.blue),hd('Cal Act',C.orange),hd('Var')]:<th key={m} style={{borderBottom:`1px solid ${C.surfaceBorder}`,background:'#fafafa'}}></th>)}
            </tr>
          </thead>
        </table>
      </div>
      {/* ── FTE Section ─────────────────────────────────────── */}
      <div ref={fteRef} onScroll={e=>syncScroll(e.currentTarget)} style={{overflowX:'scroll'}}>
        <table style={{width:'100%',minWidth:1600,borderCollapse:'collapse',fontSize:11}}>
          <thead style={{visibility:'collapse',height:0}}>
          </thead>
          <tbody>
            {/* ── FTE Section ──────────────────────────────── */}
            <tr onClick={()=>setExFTE(v=>!v)} style={{cursor:'pointer',background:'#dbeafe55',borderTop:`2px solid ${C.blue}33`}}>
              <td colSpan={100} style={{padding:'7px 12px',fontWeight:700,fontSize:11,color:C.blue,userSelect:'none'}}>
                <span style={{marginRight:6,fontSize:10}}>{exFTE?'▼':'▶'}</span>
                FTE Resources<span style={{marginLeft:6,fontWeight:400,fontSize:10,color:C.textMuted}}>({fteRows.length})</span>
              </td>
            </tr>
          </tbody>
          <tbody>
            {exFTE&&fteRows.map((r,i)=>(
              <tr key={`fte_${r.nm}_${r.pn}`} style={{background:i%2?'transparent':'#f0f2f544'}}>
                <td style={{padding:'5px 10px',position:'sticky',left:0,background:C.surface,fontSize:11,color:C.text,whiteSpace:'nowrap',boxShadow:'2px 0 5px rgba(0,0,0,0.08)'}}>
                  <span style={{marginRight:5,padding:'1px 4px',borderRadius:4,fontSize:9,background:C.blueSoft,color:C.blue}}>FTE</span>{r.nm}
                </td>
                <td style={{padding:'5px 8px',color:C.textMuted,fontSize:10,whiteSpace:'nowrap'}}>{r.pn}</td>
                <td style={{padding:'5px 6px',textAlign:'center',color:r.cr>=90?C.teal:r.cr>=70?C.gold:C.orange,fontWeight:600,fontSize:10}}>{r.cr}%</td>
                <td style={{padding:'5px 6px',textAlign:'center',color:r.acr!=null?(r.acr>=90?C.teal:r.acr>=70?C.gold:C.orange):C.textDim,fontWeight:600,fontSize:10}}>{r.acr!=null?`${r.acr}%`:'—'}</td>
                {mc(f$(r.yp),C.blue,true,'#ebebeb')}
                {mc(f$(r.ya),C.teal,true,'#ebebeb')}
                <td style={{padding:'5px 8px',textAlign:'right',color:vc(r.yv),fontWeight:700,fontSize:11,whiteSpace:'nowrap',background:'#ebebeb'}}>
                  {vs(r.yv)+f$(r.yv)}<span style={{fontSize:9,opacity:0.75,marginLeft:2}}>({r.yvp>=0?'+':''}{r.yvp.toFixed(0)}%)</span>
                </td>
                {MOS.map((m,mi)=>{
                  const ex=exM.has(m),pjv=r.pj[mi],acv=r.ac[mi],v=acv-pjv;
                  if(ex) return[mc(f$(pjv),C.blue),mc(acv>0?f$(acv):'—',acv>0?C.teal:C.textDim),mc(acv>0?vs(v)+f$(v):'—',acv>0?vc(v):C.textDim,acv>0)];
                  return <td key={m} style={{padding:'5px 8px',textAlign:'right',color:acv>0?C.teal:pjv>0?C.textDim:C.textDim,fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}11`,background:'#fafafa'}}>{acv>0?f$(acv):pjv>0?f$(pjv):'—'}</td>;
                })}
              </tr>
            ))}
          </tbody>
          <tbody>
            {exFTE&&<tr style={{background:'#dbeafe33',borderTop:`1px solid ${C.blue}33`}}>
              <td style={{padding:'6px 10px',color:C.blue,fontWeight:700,position:'sticky',left:0,background:'#dbeafe',fontSize:11,boxShadow:'2px 0 5px rgba(0,0,0,0.08)'}}>FTE Total ({fteRows.length})</td>
              <td/>{crTd(avgPlan(fteRows),C.textMuted)}{crTd(avgAct(fteRows),C.teal)}
              {mc(f$(ftePgp),C.blue,true,'#ebebeb')}
              {mc(f$(fteGa),C.teal,true,'#ebebeb')}
              <td style={{padding:'5px 8px',textAlign:'right',color:vc(fteGa-ftePgp),fontWeight:700,background:'#ebebeb'}}>{vs(fteGa-ftePgp)+f$(fteGa-ftePgp)}</td>
              {MOS.map((m,mi)=>{
                const ex=exM.has(m);
                const tp=fteRows.reduce((s,r)=>s+r.pj[mi],0),ta=fteRows.reduce((s,r)=>s+r.ac[mi],0),tv=ta-tp;
                if(ex) return[mc(f$(tp),C.blue,true),mc(f$(ta),C.teal,true),mc(vs(tv)+f$(tv),vc(tv),true)];
                return <td key={m} style={{padding:'6px 8px',textAlign:'right',color:ta>0?C.teal:C.textDim,fontWeight:700,fontSize:10,background:'#fafafa'}}>{ta>0?f$(ta):f$(tp)}</td>;
              })}
            </tr>}
          </tbody>
        </table>
      </div>

      {/* ── SOW Section ─────────────────────────────────────── */}
      <div ref={sowRef} onScroll={e=>syncScroll(e.currentTarget)} style={{overflowX:'scroll',marginTop:2}}>
        <table style={{width:'100%',minWidth:1600,borderCollapse:'collapse',fontSize:11}}>
          <thead style={{visibility:'collapse',height:0}}>
            <tr style={{background:'#f7fafc'}}>
              <th style={{padding:'7px 10px',textAlign:'left',color:C.textMuted,fontWeight:600,fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}`,position:'sticky',left:0,background:'#f7fafc',minWidth:170,whiteSpace:'nowrap'}}>Resource</th>
              <th style={{padding:'7px 8px',textAlign:'left',color:C.textMuted,fontWeight:600,fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}`,whiteSpace:'nowrap'}}>Project</th>
              <th style={{padding:'7px 6px',textAlign:'center',color:C.textMuted,fontWeight:600,fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}`}}>Plan CR%</th>
              <th style={{padding:'7px 6px',textAlign:'center',color:C.teal,fontWeight:600,fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}`}}>Act CR%</th>
              <th colSpan={3} style={{padding:'6px 8px',textAlign:'center',color:C.gold,fontWeight:700,fontSize:10,borderLeft:`2px solid ${C.gold}44`,borderBottom:`1px solid ${C.surfaceBorder}`,background:'#ebebeb'}}>YTD<div style={{fontSize:8,fontStyle:'italic',fontWeight:400,color:C.textDim}}>Jan–Jun</div></th>
              {MOS.map(m=>{const ex=exM.has(m);return(
                <th key={m} colSpan={ex?3:1} onClick={()=>togM(m)} style={{padding:'6px 8px',textAlign:'center',color:ex?C.text:C.textMuted,fontWeight:700,fontSize:10,borderLeft:`1px solid ${C.surfaceBorder}22`,borderBottom:`1px solid ${C.surfaceBorder}`,cursor:'pointer',userSelect:'none',whiteSpace:'nowrap',background:ex?'transparent':'#fafafa'}}>
                  <span style={{marginRight:3,fontSize:9,color:C.textDim}}>{ex?'▼':'▶'}</span>{m}
                </th>
              );})}
            </tr>
            <tr style={{background:'#f7fafc'}}>
              <th style={{padding:'4px 10px',position:'sticky',left:0,background:'#f7fafc',borderBottom:`1px solid ${C.surfaceBorder}`}}></th>
              <th style={{borderBottom:`1px solid ${C.surfaceBorder}`}}></th>
              <th style={{borderBottom:`1px solid ${C.surfaceBorder}`}}></th>
              <th style={{borderBottom:`1px solid ${C.surfaceBorder}`}}></th>
              {hd('RM Fc',C.blue,true)}{hd('Cal Act',C.teal,true)}{hd('Var',C.gold,true)}
              {MOS.map(m=>exM.has(m)?[hd('RM Fc',C.blue),hd('Cal Act',C.orange),hd('Var')]:<th key={m} style={{borderBottom:`1px solid ${C.surfaceBorder}`,background:'#fafafa'}}></th>)}
            </tr>
          </thead>
          <tbody>
            {/* ── SOW Section ──────────────────────────────── */}
            <tr onClick={()=>setExSOW(v=>!v)} style={{cursor:'pointer',background:'#fef3c755',borderTop:`2px solid ${C.gold}55`}}>
              <td colSpan={100} style={{padding:'7px 12px',fontWeight:700,fontSize:11,color:C.gold,userSelect:'none'}}>
                <span style={{marginRight:6,fontSize:10}}>{exSOW?'▼':'▶'}</span>
                SOW Resources<span style={{marginLeft:6,fontWeight:400,fontSize:10,color:C.textMuted}}>({sowRows.length})</span>
              </td>
            </tr>
          </tbody>
          <tbody>
            {exSOW&&sowRows.map((r,i)=>(
              <tr key={`sow_${r.nm}_${r.pn}`} style={{background:i%2?'transparent':'#fef9ec55'}}>
                <td style={{padding:'5px 10px',position:'sticky',left:0,background:C.surface,fontSize:11,color:C.text,whiteSpace:'nowrap',boxShadow:'2px 0 5px rgba(0,0,0,0.08)'}}>
                  <span style={{marginRight:5,padding:'1px 4px',borderRadius:4,fontSize:9,background:C.goldSoft,color:C.gold}}>SOW</span>{r.nm}
                </td>
                <td style={{padding:'5px 8px',color:C.textMuted,fontSize:10,whiteSpace:'nowrap'}}>{r.pn}</td>
                <td style={{padding:'5px 6px',textAlign:'center',color:r.cr>=90?C.teal:r.cr>=70?C.gold:C.orange,fontWeight:600,fontSize:10}}>{r.cr}%</td>
                <td style={{padding:'5px 6px',textAlign:'center',color:r.acr!=null?(r.acr>=90?C.teal:r.acr>=70?C.gold:C.orange):C.textDim,fontWeight:600,fontSize:10}}>{r.acr!=null?`${r.acr}%`:'—'}</td>
                {mc(f$(r.yp),C.blue,true,'#ebebeb')}
                {mc(f$(r.ya),C.teal,true,'#ebebeb')}
                <td style={{padding:'5px 8px',textAlign:'right',color:vc(r.yv),fontWeight:700,fontSize:11,whiteSpace:'nowrap',background:'#ebebeb'}}>
                  {vs(r.yv)+f$(r.yv)}<span style={{fontSize:9,opacity:0.75,marginLeft:2}}>({r.yvp>=0?'+':''}{r.yvp.toFixed(0)}%)</span>
                </td>
                {MOS.map((m,mi)=>{
                  const ex=exM.has(m),pjv=r.pj[mi],acv=r.ac[mi],v=acv-pjv;
                  if(ex) return[mc(f$(pjv),C.blue),mc(acv>0?f$(acv):'—',acv>0?C.teal:C.textDim),mc(acv>0?vs(v)+f$(v):'—',acv>0?vc(v):C.textDim,acv>0)];
                  return <td key={m} style={{padding:'5px 8px',textAlign:'right',color:acv>0?C.teal:pjv>0?C.textDim:C.textDim,fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}11`,background:'#fafafa'}}>{acv>0?f$(acv):pjv>0?f$(pjv):'—'}</td>;
                })}
              </tr>
            ))}
          </tbody>
          <tbody>
            {exSOW&&<tr style={{background:'#fef3c733',borderTop:`1px solid ${C.gold}44`}}>
              <td style={{padding:'6px 10px',color:C.gold,fontWeight:700,position:'sticky',left:0,background:'#fef3c7',fontSize:11,boxShadow:'2px 0 5px rgba(0,0,0,0.08)'}}>SOW Total ({sowRows.length})</td>
              <td/>{crTd(avgPlan(sowRows),C.textMuted)}{crTd(avgAct(sowRows),C.teal)}
              {mc(f$(sowGp),C.blue,true,'#ebebeb')}
              {mc(f$(sowGa),C.teal,true,'#ebebeb')}
              <td style={{padding:'5px 8px',textAlign:'right',color:vc(sowGa-sowGp),fontWeight:700,background:'#ebebeb'}}>{vs(sowGa-sowGp)+f$(sowGa-sowGp)}</td>
              {MOS.map((m,mi)=>{
                const ex=exM.has(m);
                const tp=sowRows.reduce((s,r)=>s+r.pj[mi],0),ta=sowRows.reduce((s,r)=>s+r.ac[mi],0),tv=ta-tp;
                if(ex) return[mc(f$(tp),C.blue,true),mc(f$(ta),C.teal,true),mc(vs(tv)+f$(tv),vc(tv),true)];
                return <td key={m} style={{padding:'6px 8px',textAlign:'right',color:ta>0?C.teal:C.textDim,fontWeight:700,fontSize:10,background:'#fafafa'}}>{ta>0?f$(ta):f$(tp)}</td>;
              })}
            </tr>}
          </tbody>
        </table>
      </div>

      {/* ── Combined Totals ──────────────────────────────────── */}
      <div ref={totRef} onScroll={e=>syncScroll(e.currentTarget)} style={{overflowX:'scroll',marginTop:2}}>
        <table style={{width:'100%',minWidth:1600,borderCollapse:'collapse',fontSize:11}}>
          <thead style={{visibility:'collapse',height:0}}>
            <tr style={{background:'#f7fafc'}}>
              <th style={{padding:'7px 10px',textAlign:'left',color:C.textMuted,fontWeight:600,fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}`,position:'sticky',left:0,background:'#f7fafc',minWidth:170,whiteSpace:'nowrap'}}>Resource</th>
              <th style={{padding:'7px 8px',textAlign:'left',color:C.textMuted,fontWeight:600,fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}`,whiteSpace:'nowrap'}}>Project</th>
              <th style={{padding:'7px 6px',textAlign:'center',color:C.textMuted,fontWeight:600,fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}`}}>Plan CR%</th>
              <th style={{padding:'7px 6px',textAlign:'center',color:C.teal,fontWeight:600,fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}`}}>Act CR%</th>
              <th colSpan={3} style={{padding:'6px 8px',textAlign:'center',color:C.gold,fontWeight:700,fontSize:10,borderLeft:`2px solid ${C.gold}44`,borderBottom:`1px solid ${C.surfaceBorder}`,background:'#ebebeb'}}>YTD<div style={{fontSize:8,fontStyle:'italic',fontWeight:400,color:C.textDim}}>Jan–Jun</div></th>
              {MOS.map(m=>{const ex=exM.has(m);return(
                <th key={m} colSpan={ex?3:1} onClick={()=>togM(m)} style={{padding:'6px 8px',textAlign:'center',color:ex?C.text:C.textMuted,fontWeight:700,fontSize:10,borderLeft:`1px solid ${C.surfaceBorder}22`,borderBottom:`1px solid ${C.surfaceBorder}`,cursor:'pointer',userSelect:'none',whiteSpace:'nowrap',background:ex?'transparent':'#fafafa'}}>
                  <span style={{marginRight:3,fontSize:9,color:C.textDim}}>{ex?'▼':'▶'}</span>{m}
                </th>
              );})}
            </tr>
            <tr style={{background:'#f7fafc'}}>
              <th style={{padding:'4px 10px',position:'sticky',left:0,background:'#f7fafc',borderBottom:`1px solid ${C.surfaceBorder}`}}></th>
              <th style={{borderBottom:`1px solid ${C.surfaceBorder}`}}></th>
              <th style={{borderBottom:`1px solid ${C.surfaceBorder}`}}></th>
              <th style={{borderBottom:`1px solid ${C.surfaceBorder}`}}></th>
              {hd('RM Fc',C.blue,true)}{hd('Cal Act',C.teal,true)}{hd('Var',C.gold,true)}
              {MOS.map(m=>exM.has(m)?[hd('RM Fc',C.blue),hd('Cal Act',C.orange),hd('Var')]:<th key={m} style={{borderBottom:`1px solid ${C.surfaceBorder}`,background:'#fafafa'}}></th>)}
            </tr>
          </thead>
          <tbody>
            <tr style={{borderTop:`3px solid ${C.orange}`}}>
              <td colSpan={100} style={{padding:'5px 12px',background:'#fff3ec',fontWeight:700,fontSize:10,color:C.orange}}>COMBINED TOTALS — FTE + SOW</td>
            </tr>
            <tr style={{background:'#fff3ec'}}>
              <td style={{padding:'6px 10px',color:C.text,fontWeight:700,position:'sticky',left:0,background:'#fff3ec',fontSize:11,boxShadow:'2px 0 5px rgba(0,0,0,0.08)'}}>FTE ({fteRows.length})</td>
              <td/>{crTd(avgPlan(fteRows),C.textMuted)}{crTd(avgAct(fteRows),C.teal)}
              {mc(f$(ftePgp),C.blue,true,'#ebebeb')}{mc(f$(fteGa),C.teal,true,'#ebebeb')}
              <td style={{padding:'5px 8px',textAlign:'right',color:vc(fteGa-ftePgp),fontWeight:700,background:'#ebebeb'}}>{vs(fteGa-ftePgp)+f$(fteGa-ftePgp)}</td>
              {MOS.map((m,mi)=>{const ex=exM.has(m);const tp=fteRows.reduce((s,r)=>s+r.pj[mi],0),ta=fteRows.reduce((s,r)=>s+r.ac[mi],0),tv=ta-tp;if(ex)return[mc(f$(tp),C.blue,true),mc(f$(ta),C.teal,true),mc(vs(tv)+f$(tv),vc(tv),true)];return <td key={m} style={{padding:'6px 8px',textAlign:'right',color:ta>0?C.teal:C.textDim,fontWeight:700,fontSize:10,background:'#fafafa'}}>{ta>0?f$(ta):f$(tp)}</td>;})}
            </tr>
            <tr style={{background:'#fff3ec'}}>
              <td style={{padding:'6px 10px',color:C.text,fontWeight:700,position:'sticky',left:0,background:'#fff3ec',fontSize:11,boxShadow:'2px 0 5px rgba(0,0,0,0.08)'}}>SOW ({sowRows.length})</td>
              <td/>{crTd(avgPlan(sowRows),C.textMuted)}{crTd(avgAct(sowRows),C.teal)}
              {mc(f$(sowGp),C.blue,true,'#ebebeb')}{mc(f$(sowGa),C.teal,true,'#ebebeb')}
              <td style={{padding:'5px 8px',textAlign:'right',color:vc(sowGa-sowGp),fontWeight:700,background:'#ebebeb'}}>{vs(sowGa-sowGp)+f$(sowGa-sowGp)}</td>
              {MOS.map((m,mi)=>{const ex=exM.has(m);const tp=sowRows.reduce((s,r)=>s+r.pj[mi],0),ta=sowRows.reduce((s,r)=>s+r.ac[mi],0),tv=ta-tp;if(ex)return[mc(f$(tp),C.blue,true),mc(f$(ta),C.teal,true),mc(vs(tv)+f$(tv),vc(tv),true)];return <td key={m} style={{padding:'6px 8px',textAlign:'right',color:ta>0?C.teal:C.textDim,fontWeight:700,fontSize:10,background:'#fafafa'}}>{ta>0?f$(ta):f$(tp)}</td>;})}
            </tr>
            <tr style={{background:'#f7fafc',borderTop:`2px solid ${C.orange}`}}>
              <td style={{padding:'7px 10px',color:C.orange,fontWeight:800,position:'sticky',left:0,background:'#f7fafc',fontSize:12,boxShadow:'2px 0 5px rgba(0,0,0,0.08)'}}>TOTAL ({rows.length})</td>
              <td/>{crTd(avgPlan(rows),C.textMuted)}{crTd(avgAct(rows),C.teal)}
              {mc(f$(gp),C.blue,true,'#ebebeb')}{mc(f$(ga),C.teal,true,'#ebebeb')}
              <td style={{padding:'7px 8px',textAlign:'right',color:vc(gv),fontWeight:800,background:'#ebebeb'}}>{vs(gv)+f$(gv)} <span style={{fontSize:9}}>({gp>0?(gv/gp*100).toFixed(1):0}%)</span></td>
              {MOS.map((m,mi)=>{const ex=exM.has(m);const tp=rows.reduce((s,r)=>s+r.pj[mi],0),ta=rows.reduce((s,r)=>s+r.ac[mi],0),tv=ta-tp;if(ex)return[mc(f$(tp),C.blue,true),mc(f$(ta),C.teal,true),mc(vs(tv)+f$(tv),vc(tv),true)];return <td key={m} style={{padding:'7px 8px',textAlign:'right',color:ta>0?C.teal:C.textDim,fontWeight:800,fontSize:10,background:'#fafafa'}}>{ta>0?f$(ta):f$(tp)}</td>;})}
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{padding:'7px 14px',borderTop:`1px solid ${C.surfaceBorder}`,display:'flex',gap:16,flexWrap:'wrap'}}>
        <span style={{color:C.textDim,fontSize:11}}>⚑ Cal Actuals: MyTime CapEx Hrs × Hourly Rate × CapEx Rate · Jan–Jun 2026</span>
      </div>
      <div style={{padding:'6px 14px 8px',borderTop:`1px solid ${C.surfaceBorder}`,display:'flex',gap:16,flexWrap:'wrap'}}>
        <span style={{color:C.blue,fontSize:11}}>● RM Fc (Resourcing Model Forecast)</span>
        <span style={{color:C.teal,fontSize:11}}>● Cal Act (Calculated Actuals)</span>
        <span style={{color:C.green,fontSize:11}}>● Under-allocated (Var &lt; 0)</span>
        <span style={{color:C.red,fontSize:11}}>● Over-allocated (Var &gt; 0)</span>
        <span style={{color:C.gold,fontSize:11}}>● CR% 70–89%</span>
        <span style={{color:C.orange,fontSize:11}}>● CR% below 70%</span>
        <span style={{color:C.textDim,fontSize:11}}>· CR% = CapEx Rate % (CapEx Hrs ÷ Total Hrs × 100)</span>
      </div>
    </div>
  </div>);
}

/* ── TIME TRACKING COMPLIANCE ────────────────────────────────────── */
function TimeTrackingView(){
  const FLAG_META={
    CORRECT:     {label:'Correct',       col:C.green,  bg:C.greenSoft, desc:'Tracked to allocated project(s) only'},
    PARTIAL:     {label:'Partial',       col:C.gold,   bg:C.goldSoft,  desc:'Allocated but not all projects tracked'},
    WRONG_PROJECT:{label:'Misallocated',col:C.red,    bg:C.redSoft,   desc:'Tracked to a non-allocated project'},
    NO_HOURS:    {label:'No Hours',      col:C.textDim,bg:'#e2e8f0',   desc:'No MyTime hours logged'},
  };

  const [fCompliance, setFCompliance] = useState('All');
  const [fStatus,     setFStatus]     = useState('All');
  const [fSup,        setFSup]        = useState('All');
  const [fType,       setFType]       = useState('All');
  const [fProject,    setFProject]    = useState('All');
  const [fName,       setFName]       = useState('All');

  // Derived option lists
  const allNames     = ['All', ...COMPLIANCE.map(r=>r.n).sort()];
  const allSups      = ['All', ...new Set(COMPLIANCE.map(r=>r.sup).filter(Boolean).sort())];
  const allStatuses  = ['All', ...new Set(COMPLIANCE.map(r=>r.s).filter(Boolean).sort())];
  const allTypes     = ['All', ...new Set(COMPLIANCE.map(r=>r.t).filter(Boolean).sort())];
  const allProjects  = ['All', ...new Set(COMPLIANCE.flatMap(r=>r.alloc||[]).sort())];
  const compFlags    = ['All','WRONG_PROJECT','PARTIAL','CORRECT','NO_HOURS'];

  const filtered = COMPLIANCE.filter(r=>
    (fCompliance==='All' || r.f===fCompliance) &&
    (fStatus==='All'     || r.s===fStatus) &&
    (fSup==='All'        || r.sup===fSup) &&
    (fType==='All'       || r.t===fType) &&
    (fProject==='All'    || (r.alloc||[]).includes(fProject)) &&
    (fName==='All'       || r.n===fName)
  );

  const cnt={};['CORRECT','PARTIAL','WRONG_PROJECT','NO_HOURS'].forEach(f=>cnt[f]=COMPLIANCE.filter(r=>r.f===f).length);
  const wrongHrs=COMPLIANCE.filter(r=>r.f==='WRONG_PROJECT').reduce((s,r)=>s+r.whrs,0);

  const selStyle={background:C.surface,color:C.text,border:`1px solid ${C.surfaceBorder}`,
    borderRadius:6,padding:'6px 10px',fontSize:12,fontFamily:'inherit',minWidth:140};

  const ProjPill=({p,col})=>(
    <div style={{display:'inline-block',
      background:col==='blue'?C.blueSoft:col==='red'?C.redSoft:C.tealSoft,
      color:col==='blue'?C.blue:col==='red'?C.red:C.teal,
      padding:'2px 8px',borderRadius:4,fontSize:10,fontWeight:600,
      marginBottom:3,whiteSpace:'nowrap'}}>{p}</div>
  );

  return(
    <div>
      <div style={{marginBottom:16}}>
        <h1 style={{color:C.text,fontWeight:700,fontSize:22,margin:'0 0 4px'}}>Time Tracking Compliance</h1>
        <p style={{color:C.textMuted,fontSize:13,margin:0}}>MyTime vs Resourcing Model · Jan–Jun 2026 · {COMPLIANCE.length} resources</p>
      </div>

      {/* Summary cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:16}}>
        {[['Total Resources',COMPLIANCE.length,C.blue,'All'],['✅ Correct',cnt.CORRECT,C.green,'CORRECT'],
          ['⚠️ Partial',cnt.PARTIAL,C.gold,'PARTIAL'],['❌ Misallocated',cnt.WRONG_PROJECT,C.red,'WRONG_PROJECT'],
          ['○ No Hours',cnt.NO_HOURS,C.textDim,'NO_HOURS']].map(([l,v,col,key])=>{
          const active = fCompliance===key;
          return(
            <div key={l} onClick={()=>setFCompliance(active?'All':key)}
              style={{background:active?col+'18':C.surface,
                border:`1px solid ${active?col:C.surfaceBorder}`,
                borderRadius:8,padding:'12px 14px',borderLeft:`3px solid ${col}`,
                cursor:'pointer',transition:'all 0.15s',userSelect:'none',
                boxShadow:active?`0 0 0 2px ${col}33`:'none'}}>
              <div style={{fontSize:10,color:active?col:C.textMuted,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4}}>{l}</div>
              <div style={{fontSize:24,fontWeight:700,color:col}}>{v}</div>
              {active&&<div style={{fontSize:9,color:col,marginTop:2,fontWeight:600}}>▼ FILTERING</div>}
            </div>
          );
        })}
      </div>

      {/* Misallocated-hrs banner */}
      {cnt.WRONG_PROJECT>0&&<div style={{background:C.redSoft,border:`1px solid ${C.red}44`,borderRadius:8,
        padding:'10px 14px',marginBottom:14,display:'flex',alignItems:'center',gap:10}}>
        <span style={{fontSize:16}}>⚠️</span>
        <span style={{color:C.red,fontWeight:700,fontSize:13}}>{cnt.WRONG_PROJECT} resources tracked {Math.round(wrongHrs)} hrs to misallocated projects</span>
        <span style={{color:C.textMuted,fontSize:12}}>· These hours may need to be reallocated</span>
      </div>}

            {/* Filter bar */}
      <div style={{display:'flex',gap:8,marginBottom:8,flexWrap:'nowrap',overflowX:'auto',alignItems:'flex-end',paddingBottom:2}}>
        {/* Resource Name */}
        <div style={{display:'flex',flexDirection:'column',gap:2,flexShrink:0}}>
          <span style={{fontSize:10,color:C.textMuted,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px'}}>Resource Name</span>
          <select value={fName} onChange={e=>setFName(e.target.value)} style={selStyle}>
            {allNames.map(n=><option key={n} value={n}>{n==='All'?'All Resources':n}</option>)}
          </select>
        </div>
        {/* Project */}
        <div style={{display:'flex',flexDirection:'column',gap:2,flexShrink:0}}>
          <span style={{fontSize:10,color:C.textMuted,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px'}}>Project</span>
          <select value={fProject} onChange={e=>setFProject(e.target.value)} style={selStyle}>
            {allProjects.map(p=><option key={p} value={p}>{p==='All'?'All Projects':p}</option>)}
          </select>
        </div>
        {/* Compliance */}
        <div style={{display:'flex',flexDirection:'column',gap:2,flexShrink:0}}>
          <span style={{fontSize:10,color:C.textMuted,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px'}}>Compliance</span>
          <select value={fCompliance} onChange={e=>setFCompliance(e.target.value)} style={selStyle}>
            {compFlags.map(f=><option key={f} value={f}>{f==='All'?'All':FLAG_META[f]?.label||f}</option>)}
          </select>
        </div>
        {/* Status */}
        <div style={{display:'flex',flexDirection:'column',gap:2,flexShrink:0}}>
          <span style={{fontSize:10,color:C.textMuted,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px'}}>Status</span>
          <select value={fStatus} onChange={e=>setFStatus(e.target.value)} style={selStyle}>
            {allStatuses.map(s=><option key={s} value={s}>{s==='All'?'All Statuses':s}</option>)}
          </select>
        </div>
        {/* Supervisor */}
        <div style={{display:'flex',flexDirection:'column',gap:2,flexShrink:0}}>
          <span style={{fontSize:10,color:C.textMuted,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px'}}>Supervisor</span>
          <select value={fSup} onChange={e=>setFSup(e.target.value)} style={selStyle}>
            {allSups.map(s=><option key={s} value={s}>{s==='All'?'All Supervisors':s}</option>)}
          </select>
        </div>
        {/* Type */}
        <div style={{display:'flex',flexDirection:'column',gap:2,flexShrink:0}}>
          <span style={{fontSize:10,color:C.textMuted,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px'}}>Type</span>
          <select value={fType} onChange={e=>setFType(e.target.value)} style={selStyle}>
            {allTypes.map(t=><option key={t} value={t}>{t==='All'?'All Types':t}</option>)}
          </select>
        </div>
        {/* Count + Reset */}
        <div style={{display:'flex',flexDirection:'column',gap:2,flexShrink:0}}>
          <span style={{fontSize:10,color:C.textMuted}}>&nbsp;</span>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{color:C.textMuted,fontSize:11,whiteSpace:'nowrap'}}>{filtered.length} of {COMPLIANCE.length}</span>
            <button onClick={()=>{setFCompliance('All');setFStatus('All');setFSup('All');setFType('All');setFProject('All');setFName('All');}}
              style={{background:'transparent',border:`1px solid ${C.surfaceBorder}`,borderRadius:6,
                padding:'5px 10px',fontSize:11,color:C.textMuted,cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{background:C.surface,border:`1px solid ${C.surfaceBorder}`,borderRadius:8,overflow:'hidden'}}>
        <div style={{overflowX:'auto',maxHeight:'calc(100vh - 420px)',overflowY:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead style={{position:'sticky',top:0,zIndex:1}}>
              <tr style={{background:'#f7fafc'}}>
                {[['Name','180px'],['Type','60px'],['Supervisor','120px'],['Status','90px'],
                  ['Compliance','105px'],['Allocated To','140px'],
                  ['YTD Allocation (FTE-mo)','120px'],
                  ['Tracked To','140px'],['Misallocated Projects','140px'],
                  ['Total Hrs · Jan–Jun','90px'],['Misallocated Hrs','80px']
                ].map(([h,w])=>(
                  <th key={h} style={{padding:'8px 12px',color:C.textMuted,fontWeight:600,textAlign:'left',
                    fontSize:10,borderBottom:`1px solid ${C.surfaceBorder}`,
                    minWidth:w,background:'#f7fafc',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r,i)=>{
                const fm=FLAG_META[r.f]||FLAG_META.NO_HOURS;
                const pa=r.pa||{};
                return(
                  <tr key={r.n+i} style={{borderBottom:`1px solid ${C.surfaceBorder}33`,
                    background:i%2===0?'transparent':'#f7fafc55',verticalAlign:'top'}}>
                    <td style={{padding:'10px 12px',color:C.text,fontWeight:600}}>{r.n}</td>
                    <td style={{padding:'10px 12px',color:C.textMuted}}>{r.t}</td>
                    <td style={{padding:'10px 12px',color:C.textMuted,fontSize:11}}>{r.sup||'—'}</td>
                    <td style={{padding:'10px 12px'}}>
                      <span style={{padding:'2px 7px',borderRadius:8,fontSize:10,fontWeight:600,
                        background:r.s==='Active'?C.greenSoft:r.s==='Exit'?C.redSoft:r.s==='Non-Billable Active'?C.goldSoft:'#e2e8f0',
                        color:r.s==='Active'?C.green:r.s==='Exit'?C.red:r.s==='Non-Billable Active'?C.gold:C.textDim}}>
                        {r.s||'—'}
                      </span>
                    </td>
                    <td style={{padding:'10px 12px'}}>
                      <span style={{padding:'3px 8px',borderRadius:8,fontSize:10,fontWeight:700,
                        background:fm.bg,color:fm.col}}>{fm.label}</span>
                    </td>
                    <td style={{padding:'10px 12px'}}>
                      {(r.alloc||[]).length>0
                        ?(r.alloc||[]).map(p=><div key={p} style={{marginBottom:3}}><ProjPill p={p} col="blue"/></div>)
                        :<span style={{color:C.textDim}}>—</span>}
                    </td>
                    <td style={{padding:'10px 12px'}}>
                      {(r.alloc||[]).length>0
                        ?(r.alloc||[]).map(p=>{
                            const ytd=pa[p]?.ytd||0; const fy=pa[p]?.fy||0;
                            return(
                              <div key={p} style={{marginBottom:3,height:22,display:'flex',alignItems:'center'}}>
                                <span style={{fontSize:11,fontWeight:600,color:C.text}}>{ytd.toFixed(1)}</span>
                                <span style={{fontSize:10,color:C.textMuted,marginLeft:4}}>/ {fy.toFixed(1)} FY</span>
                              </div>
                            );
                          })
                        :<span style={{color:C.textDim}}>—</span>}
                    </td>
                    <td style={{padding:'10px 12px'}}>
                      {(r.tracked||[]).length>0
                        ?(r.tracked||[]).map(p=><div key={p} style={{marginBottom:3}}><ProjPill p={p} col="teal"/></div>)
                        :<span style={{color:C.textDim}}>—</span>}
                    </td>
                    <td style={{padding:'10px 12px'}}>
                      {r.wrong&&r.wrong.length>0
                        ?r.wrong.map(p=><div key={p} style={{marginBottom:3}}><ProjPill p={p} col="red"/></div>)
                        :<span style={{color:C.textDim}}>—</span>}
                    </td>
                    <td style={{padding:'10px 12px',textAlign:'right',color:C.text,fontWeight:r.hrs>0?600:400}}>
                      {r.hrs>0?`${r.hrs}h`:'—'}
                    </td>
                    <td style={{padding:'10px 12px',textAlign:'right',fontWeight:r.whrs>0?700:400,
                      color:r.whrs>0?C.red:C.textDim}}>
                      {r.whrs>0?`${r.whrs}h`:'—'}
                    </td>
                  </tr>
                );
              })}
              {filtered.length===0&&(
                <tr><td colSpan={11} style={{padding:32,textAlign:'center',color:C.textMuted}}>No resources match the selected filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{padding:'8px 14px',borderTop:`1px solid ${C.surfaceBorder}`,display:'flex',gap:16,flexWrap:'wrap',alignItems:'center'}}>
          {Object.entries(FLAG_META).map(([k,v])=>(
            <span key={k} style={{fontSize:11,color:v.col}}><strong>{v.label}:</strong> {v.desc}</span>
          ))}
          <span style={{fontSize:11,color:C.textMuted,marginLeft:'auto'}}>YTD Allocation = FTE-months Jan–Jun · FY = full-year total</span>
        </div>
      </div>
    </div>
  );
}
/* ── NAV + SHELL ─────────────────────────────────────────────────── */
const NAV=[
  {id:'home',   label:'Program Home',     dot:C.blue,  view:ProgramHome},
  {id:'monthly',label:'Monthly View',     dot:C.teal,  view:MonthlyView},
  {id:'ytd',    label:'YTD Overview',     dot:C.gold,  view:YTDOverview},
  {id:'sowfte', label:'SOW & FTE',        dot:C.purple,view:SOWFTEView},
  {id:'capex',  label:'CapEx vs OpEx',    dot:C.orange,view:CapExOpExView},
  {id:'resource',label:'Resource Overview',dot:C.green,view:ResourceView},
  {id:'alloc',label:'Allocation vs Spend',dot:C.teal,view:AllocSpendView},
  {id:'timetrack',label:'Time Tracking',dot:C.red,view:TimeTrackingView},
];
const now=new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});

export default function App(){
  const [active,setActive]=useState('home');
  const View=NAV.find(n=>n.id===active).view;
  return(
    <div style={{display:'flex',height:'100vh',fontFamily:"'Clario',system-ui,sans-serif",background:C.bg,color:C.text,overflow:'hidden'}}>
      <div style={{width:240,minWidth:240,background:C.sidebar,borderRight:`1px solid ${C.sidebarBorder}`,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{padding:'20px 16px 16px'}}>
          <p style={{color:C.textMuted,fontSize:11,fontWeight:600,letterSpacing:'0.8px',textTransform:'uppercase',margin:'0 0 4px'}}>Thomson Reuters</p>
          <p style={{color:C.text,fontWeight:700,fontSize:15,margin:'0 0 10px'}}>Risk & Fraud Program</p>
          <span style={{background:C.blueSoft,color:C.blue,fontSize:11,fontWeight:600,padding:'3px 10px',borderRadius:12}}>Finance · 2026</span>
        </div>
        <div style={{height:1,background:C.sidebarBorder,margin:'0 16px'}}/>
        <div style={{padding:'12px 8px',flex:1}}>
          <p style={{color:C.textDim,fontSize:10,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',padding:'0 8px',marginBottom:6}}>Financial Views</p>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setActive(n.id)} style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'8px 10px',borderRadius:6,border:'none',background:active===n.id?C.blueSoft:'transparent',color:active===n.id?C.text:C.textMuted,cursor:'pointer',fontFamily:'inherit',fontSize:13,fontWeight:active===n.id?600:400,textAlign:'left',marginBottom:2}}>
              <span style={{width:8,height:8,borderRadius:'50%',background:n.dot,display:'inline-block',flexShrink:0,opacity:active===n.id?1:0.5}}/>
              {n.label}
            </button>
          ))}
        </div>
        <div style={{padding:'12px 16px',borderTop:`1px solid ${C.sidebarBorder}`}}>
          <p style={{color:C.textDim,fontSize:10,margin:'0 0 2px'}}>Data sources</p>
          <p style={{color:C.textMuted,fontSize:11,margin:0}}>Resourcing Model · MyTime Jun · BEX Actuals</p>
        </div>
      </div>
      <div style={{flex:1,overflow:'auto',display:'flex',flexDirection:'column'}}>
        <div style={{padding:'12px 24px',borderBottom:`1px solid ${C.sidebarBorder}`,display:'flex',alignItems:'center',justifyContent:'space-between',background:C.sidebar,flexShrink:0}}>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <span style={{color:C.textMuted,fontSize:12}}>Risk & Fraud 2026</span>
            <span style={{color:C.textDim}}>›</span>
            <span style={{color:C.text,fontSize:12,fontWeight:600}}>{NAV.find(n=>n.id===active)?.label}</span>
          </div>
          <span style={{color:C.textMuted,fontSize:12}}>{now}</span>
        </div>
        <div style={{padding:'24px',flex:1}}>
          <View/>
        </div>
      </div>
    </div>
  );
}
