/* Cloud Cortex V1.2 — deterministic, browser-only system story. No network calls. */
(() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.querySelector('#architecture');
  if (!svg) return;
  const $ = id => document.getElementById(id);
  const layers = {brain:$('brain-backdrop'),zones:$('zone-labels'),wires:$('wire-layer'),nodes:$('node-layer'),packets:$('packet-layer')};
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const mobileMedia = matchMedia('(max-width: 760px)');
  const wrap = document.querySelector('.diagram-wrap');
  let revealQueued = false;
  let revealForTransaction = false;
  function updateReveal(){
    revealQueued = false;
    const distance=Math.min(window.innerHeight*.78,590);
    const progress=reducedMotion.matches?1:Math.min(1,Math.max(0,window.scrollY/Math.max(1,distance)));
    const reveal=revealForTransaction?1:progress;
    document.documentElement.style.setProperty('--cortex-reveal',String(reveal));
    wrap.dataset.revealed=reveal>=.98?'true':'false';
  }
  function scheduleReveal(){if(!revealQueued){revealQueued=true;requestAnimationFrame(updateReveal);}}
  function openCortex(){revealForTransaction=true;updateReveal();}
  addEventListener('scroll',scheduleReveal,{passive:true});
  addEventListener('resize',scheduleReveal,{passive:true});
  reducedMotion.addEventListener('change',scheduleReveal);

  const definitions = {
    client:['Request','CLIENT','An incoming transaction from the visitor'],
    waf:['WAF','EDGE DEFENCE','Inspect traffic and reject suspicious requests'],
    rate:['Rate limiter','QUOTAS','Apply throttling before application routing'],
    lb:['Load balancer','TRAFFIC','Distribute concurrent traffic across capacity'],
    gateway:['API gateway','POLICIES','Route and normalize API requests'],
    auth:['Identity','AUTHN · AUTHZ','Check token and permissions'],
    apiA:['API / 01','REPLICA A','Stateless API instance'],
    apiB:['API / 02','REPLICA B','Additional instance activated under load'],
    apiC:['API / 03','REPLICA C','Additional instance activated under load'],
    cache:['Redis cache','FAST PATH','Example idempotency lookup before queuing'],
    queue:['Message queue','BUFFER','Durable job delivery and backpressure'],
    worker:['Worker pool','ASYNC JOBS','Consume jobs and write to data storage'],
    retry:['Retry policy','BACKOFF','Retry transient worker failures'],
    dlq:['Dead-letter','ISOLATION','Hold jobs after retry budget is exhausted'],
    shardA:['Shard 01','PARTITION A','Partition chosen by key'],
    shardB:['Shard 02','PARTITION B','Partition chosen by key'],
    shardC:['Shard 03','PARTITION C','Partition chosen by key'],
    ws:['WebSocket','PUSH EVENT','Publish an async completion event'],
    success:['200 OK','DELIVERED','Successful simulated completion'],
    blocked:['4XX','REJECTED','Request rejected before application processing'],
    failed:['503 ERROR','UNAVAILABLE','Request failed and entered a dead-letter path'],
    metrics:['Telemetry','TRACES','Observe stages, errors and retries'],
    autoscale:['Autoscaler','CAPACITY','Add API replicas for simulated burst load']
  };
  const primaryLinks=[
    ['client','waf'],['waf','rate'],['waf','blocked'],['rate','blocked'],['rate','lb'],
    ['lb','gateway'],['gateway','auth'],['auth','blocked'],
    ['auth','apiA'],['auth','apiB'],['auth','apiC'],
    ['apiA','cache'],['apiB','cache'],['apiC','cache'],
    ['cache','queue'],['queue','worker'],['worker','retry'],['retry','worker'],['retry','dlq'],['dlq','failed'],
    ['worker','shardA'],['worker','shardB'],['worker','shardC'],
    ['shardA','ws'],['shardB','ws'],['shardC','ws'],['ws','success']
  ];
  const ambientLinks=[['apiB','metrics'],['worker','metrics'],['metrics','autoscale']];
  const layouts={
    desktop:{view:'0 0 1500 750',nodes:{
      client:[92,368],waf:[242,252],rate:[242,368],lb:[391,368],gateway:[548,368],auth:[705,368],
      apiA:[873,225],apiB:[873,368],apiC:[873,511],cache:[1037,225],queue:[1037,368],worker:[1204,368],
      retry:[1204,522],dlq:[1360,612],shardA:[1370,247],shardB:[1370,368],shardC:[1370,489],
      ws:[1204,103],success:[1365,103],blocked:[548,585],failed:[1360,701],metrics:[885,658],autoscale:[705,658]
    }},
    mobile:{view:'0 0 520 1025',nodes:{
      client:[92,75],waf:[260,75],rate:[428,75],lb:[92,191],gateway:[260,191],auth:[428,191],
      apiA:[92,308],apiB:[260,308],apiC:[428,308],cache:[92,426],queue:[260,426],worker:[428,426],
      retry:[92,548],dlq:[260,548],blocked:[428,548],
      shardA:[92,671],shardB:[260,671],shardC:[428,671],
      ws:[92,795],success:[260,795],failed:[428,795],
      metrics:[170,934],autoscale:[350,934]
    }}
  };
  const metrics={sent:$('metric-sent'),completed:$('metric-completed'),failed:$('metric-failed'),flight:$('metric-flight'),queue:$('metric-queue'),replicas:$('metric-replicas'),result:$('metric-result'),retried:$('metric-retried')};
  const state={nextId:0,completed:0,failed:0,retried:0,inFlight:0,queueDepth:0,replicas:1,
    recentClicks:[],scaleHoldUntil:0,nodes:new Map(),paths:new Map(),activeWires:new Map(),mobile:mobileMedia.matches,resizePending:false};
  let scaleResetTimeout;
  function el(tag,attrs={},text){const node=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))node.setAttribute(k,String(v));if(text!==undefined)node.textContent=text;return node;}
  function clear(layer){layer.replaceChildren();}
  function position(id){return layouts[state.mobile?'mobile':'desktop'].nodes[id];}
  function pathData(from,to){
    const [x1,y1]=position(from),[x2,y2]=position(to);
    const dx=x2-x1,dy=y2-y1;
    const bend=Math.abs(dy)>45?Math.min(44,Math.abs(dx)*.18+11)*(dx>=0?1:-1):0;
    return `M ${x1} ${y1} Q ${(x1+x2)/2+bend} ${(y1+y2)/2-bend} ${x2} ${y2}`;
  }
  function addBackdrop(){
    const mobile=state.mobile;
    const c=mobile?[260,520,235,395]:[820,372,635,350];
    layers.brain.append(el('ellipse',{cx:c[0],cy:c[1],rx:c[2],ry:c[3],class:'brain-halo'}));
    for(let i=0;i<(mobile?7:14);i++){
      const base=mobile?34:220,end=mobile?486:1450;
      layers.brain.append(el('path',{d:`M ${base+i*7} ${mobile?245+i*22:245+i*12} C ${mobile?45+i*19:345+i*18} ${mobile?20+i*25:-40+i*22}, ${mobile?490-i*9:1220-i*18} ${mobile?40+i*29:10+i*18}, ${end-i*5} ${mobile?460+i*12:340+i*7} S ${mobile?44+i*10:870+i*24} ${mobile?950-i*6:760-i*8}, ${base+i*7} ${mobile?800-i*4:640-i*4}`,class:'brain-arc'}));
    }
    const zones=mobile?[['EDGE & ROUTING',14,30],['SERVICES & EVENTS',14,263],['RESILIENCE',14,503],['SHARDED DATA',14,625],['OBSERVABILITY',14,890]]:
      [['01 / EDGE & TRUST',43,76],['02 / SERVICES',743,76],['03 / EVENTS & DATA',1050,76],['04 / RESILIENCE',1100,689]];
    zones.forEach(([name,x,y])=>layers.zones.append(el('text',{x,y,class:'zone-label'},name)));
    if(!mobile)for(const x of [318,617,964,1290])layers.zones.append(el('line',{x1:x,y1:95,x2:x,y2:710,class:'zone-rule'}));
  }
  function renderDiagram(){
    if(state.inFlight>0){state.resizePending=true;return;}
    state.mobile=mobileMedia.matches;
    svg.setAttribute('viewBox',layouts[state.mobile?'mobile':'desktop'].view);
    Object.values(layers).forEach(clear);
    state.nodes.clear();state.paths.clear();state.activeWires.clear();
    addBackdrop();
    for(const [index,[from,to]] of [...primaryLinks,...ambientLinks].entries()){
      const key=`${from}->${to}`;
      const wire=el('path',{d:pathData(from,to),class:`wire${index%6===0?' wire-dash':''}${index>=primaryLinks.length?' wire-ambient':''}`,'data-edge':key});
      layers.wires.append(wire);state.paths.set(key,wire);
    }
    Object.entries(definitions).forEach(([id,[name,detail,explanation]],index)=>{
      const [x,y]=position(id);
      const group=el('g',{class:`node${['apiB','apiC'].includes(id)?' is-dormant':''}${['metrics','autoscale'].includes(id)?' is-observer':''}`, 'data-node':id,transform:`translate(${x} ${y})`});
      group.append(el('title',{},`${name}: ${explanation}`));
      group.append(el('rect',{class:'node-halo',x:-52,y:-26,width:104,height:52,rx:12}));
      group.append(el('rect',{class:'node-bg',x:-57,y:-28,width:114,height:56,rx:9}));
      group.append(el('rect',{class:'node-meter',x:-49,y:22,width:98,height:2,rx:1}));
      group.append(el('circle',{class:'node-circle',cx:-44,cy:-16,r:2.7,style:`animation-delay:-${index%7*.35}s`}));
      group.append(el('circle',{class:'node-spark',cx:44,cy:-16,r:2.1,style:`animation-delay:-${index%9*.43}s`}));
      group.append(el('text',{class:'node-title',x:0,y:-2,'text-anchor':'middle'},name));
      group.append(el('text',{class:'node-detail',x:0,y:13,'text-anchor':'middle'},detail));
      layers.nodes.append(group);state.nodes.set(id,group);
    });
    refreshReplicas();
  }
  function pad(n){return String(n).padStart(2,'0');}
  function refreshMetrics(){
    metrics.sent.textContent=pad(state.nextId);metrics.completed.textContent=pad(state.completed);
    metrics.failed.textContent=pad(state.failed);metrics.retried.textContent=pad(state.retried);
    metrics.flight.textContent=pad(state.inFlight);metrics.queue.textContent=pad(state.queueDepth);
    metrics.replicas.innerHTML=`${pad(state.replicas)} <small>/ 03</small>`;
  }
  function setTrace(s){$('trace-message').textContent=s;}
  function setStatus(s){$('system-status').textContent=s;}
  function refreshReplicas(){['apiA','apiB','apiC'].forEach((id,i)=>{const node=state.nodes.get(id);if(node){node.classList.toggle('is-dormant',i>=state.replicas);node.classList.toggle('is-scaled',i>0&&i<state.replicas);}});}
  function activate(id,duration=500,type='active'){
    const node=state.nodes.get(id);if(!node)return;
    const cls=type==='error'?'is-error':type==='retry'?'is-retrying':type==='success'?'is-success':'is-active';
    node.classList.add(cls);
    clearTimeout(node.pulseTimeout);
    node.pulseTimeout=setTimeout(()=>node.classList.remove('is-active','is-error','is-retrying','is-success'),duration);
  }
  function scaleUp(){
    state.scaleHoldUntil=Date.now()+2800;
    if(state.replicas===3)return;
    state.replicas=3;clearTimeout(scaleResetTimeout);refreshReplicas();refreshMetrics();
    activate('autoscale',1500);setStatus('BURST / SCALING');
    setTrace('Burst detected — autoscaler activated two more API replicas.');
    addEvent('scale','↗','Autoscaler expanded the pool to 3 replicas');
  }
  function maybeScaleDown(){
    clearTimeout(scaleResetTimeout);
    const delay=Math.max(0,state.scaleHoldUntil-Date.now());
    scaleResetTimeout=setTimeout(()=>{
      if(state.inFlight!==0){maybeScaleDown();return;}
      state.replicas=1;refreshReplicas();refreshMetrics();setStatus('SYSTEM IDLE');
      setTrace(`System settled · ${state.completed} succeeded · ${state.failed} failed · ready for more.`);
      addEvent('scale','↘','Load settled — scaled down to 1 replica');
    },delay+300);
  }
  function lightWire(key,on){const wire=state.paths.get(key);if(!wire)return;const count=(state.activeWires.get(key)||0)+(on?1:-1);if(count<=0){state.activeWires.delete(key);wire.classList.remove('is-active');}else{state.activeWires.set(key,count);wire.classList.add('is-active');}}
  function makePacket(id){
    const group=el('g',{class:'packet'});
    group.append(el('circle',{class:'packet-outer',r:13}));
    group.append(el('circle',{class:'packet-core',r:4.5}));
    group.append(el('text',{class:'packet-tag',x:10,y:-10},`#${pad(id)}`));
    layers.packets.append(group);return group;
  }
  function tweenWire(from,to,packet,duration){
    const path=state.paths.get(`${from}->${to}`);
    if(!path)throw Error(`Missing architecture link ${from} -> ${to}`);
    const key=`${from}->${to}`;lightWire(key,true);
    const length=path.getTotalLength(),d=reducedMotion.matches?28:duration;
    return new Promise(resolve=>{
      const start=performance.now();
      function tick(now){const p=Math.min(1,(now-start)/d),ease=p*p*(3-2*p),pos=path.getPointAtLength(length*ease);
        packet.setAttribute('transform',`translate(${pos.x.toFixed(2)} ${pos.y.toFixed(2)})`);
        if(p<1)requestAnimationFrame(tick);else{lightWire(key,false);resolve();}
      }
      requestAnimationFrame(tick);
    });
  }
  function addEvent(kind,code,message){
    const feed=$('event-feed');
    const li=document.createElement('li');li.className=`event-item event-${kind}`;
    const s=document.createElement('span');s.className='event-code';s.textContent=code;
    const t=document.createElement('span');t.textContent=message;
    li.append(s,t);feed.prepend(li);
    while(feed.children.length>5)feed.lastElementChild.remove();
  }
  function stageMessage(id,node){
    const desc={waf:'Security inspection',rate:'Rate quota check',lb:'Load distribution',gateway:'API policy routing',auth:'Identity validated',
      apiA:'Replica A processing',apiB:'Replica B processing',apiC:'Replica C processing',cache:'Redis idempotency lookup',
      queue:'Message queued',worker:'Worker consuming',retry:'Retry with backoff',shardA:'Shard A commit',shardB:'Shard B commit',shardC:'Shard C commit',
      ws:'WebSocket pushed an event',blocked:'Request rejected',dlq:'Dead-letter isolation',success:'200 delivered',failed:'503 unavailable'};
    if(state.inFlight<=2)setTrace(`#${pad(id)}  →  ${desc[node]||node}`);
  }
  function markPacket(packet,type){packet.classList.toggle('packet-error',type==='error');packet.classList.toggle('packet-retry',type==='retry');}
  function result(id,status,reason){
    const failure=status!==200;
    if(failure)state.failed++;else state.completed++;
    metrics.result.replaceChildren();
    const led=document.createElement('i');led.className='result-led';led.setAttribute('aria-hidden','true');
    metrics.result.append(led,document.createTextNode(` #${pad(id)} / ${status} ${reason}`));
    metrics.result.parentElement.classList.toggle('done',!failure);
    metrics.result.parentElement.classList.toggle('error',failure);
    const description=`#${pad(id)} · ${status} ${reason}`;
    addEvent(failure?'error':'success',String(status),description);
    setTrace(description+(status===503?' · Job placed in the dead-letter queue.':status===403?' · Blocked at the edge.':status===429?' · Rate limit enforced.':' · Trace complete.'));
    activate('metrics',620);refreshMetrics();
  }
  async function runRequest(scenario='healthy'){
    if(state.inFlight>=15){setTrace('Traffic guard: maximum 15 simulated requests in flight.');return;}
    openCortex();clearTimeout(scaleResetTimeout);
    const now=Date.now();state.recentClicks=state.recentClicks.filter(ts=>now-ts<1600);state.recentClicks.push(now);
    const id=++state.nextId;state.inFlight++;
    if(state.recentClicks.length>=3||state.inFlight>=4)scaleUp();
    else if(state.replicas===1)setStatus('PROCESSING');
    refreshMetrics();
    if(state.inFlight<3)setTrace(`#${pad(id)}  →  New ${scenario==='healthy'?'request':scenario} scenario entering the edge.`);
    const packet=makePacket(id),[x,y]=position('client');packet.setAttribute('transform',`translate(${x} ${y})`);
    activate('client');
    let queued=false;
    async function go(from,to,duration=285,type='active'){
      await tweenWire(from,to,packet,duration);activate(to,type==='error'?1100:620,type);stageMessage(id,to);
    }
    try{
      await go('client','waf');
      if(scenario==='blocked'){
        markPacket(packet,'error');await go('waf','blocked',450,'error');result(id,403,'FORBIDDEN');return;
      }
      await go('waf','rate');
      if(scenario==='throttled'){
        markPacket(packet,'error');await go('rate','blocked',390,'error');result(id,429,'RATE LIMITED');return;
      }
      await go('rate','lb');await go('lb','gateway');await go('gateway','auth');
      const replica=['apiA','apiB','apiC'][(id-1)%state.replicas];
      const shard=['shardA','shardB','shardC'][(id-1)%3];
      await go('auth',replica,335);await go(replica,'cache',340);await go('cache','queue');
      state.queueDepth++;queued=true;refreshMetrics();
      await go('queue','worker');state.queueDepth=Math.max(0,state.queueDepth-1);queued=false;refreshMetrics();
      if(scenario==='recovered'||scenario==='outage'){
        markPacket(packet,'retry');state.retried++;refreshMetrics();
        await go('worker','retry',300,'retry');addEvent('retry','↻',`#${pad(id)} · Worker error, retry policy activated`);
        if(scenario==='outage'){
          // One illustrative retry cycle, then isolation to a DLQ.
          await go('retry','worker',325,'retry');state.retried++;refreshMetrics();
          await go('worker','retry',300,'retry');
          markPacket(packet,'error');await go('retry','dlq',440,'error');await go('dlq','failed',350,'error');
          result(id,503,'UNAVAILABLE');return;
        }
        await go('retry','worker',325,'retry');markPacket(packet,'healthy');
      }
      await go('worker',shard,345);await go(shard,'ws',400);await go('ws','success',340,'success');
      result(id,200,scenario==='recovered'?'OK · RECOVERED':'OK');
    }catch(e){
      console.error('Cloud Cortex simulation error:',e);
      result(id,500,'SIMULATION ERROR');
    }finally{
      if(queued)state.queueDepth=Math.max(0,state.queueDepth-1);
      packet.remove();state.inFlight=Math.max(0,state.inFlight-1);refreshMetrics();
      if(state.inFlight===0){if(state.resizePending){state.resizePending=false;renderDiagram();}
        if(state.replicas>1)maybeScaleDown();else setStatus('SYSTEM IDLE');}
    }
  }
  function bringDiagramIntoView(){
    const diagram=document.querySelector('.system-shell'),rect=diagram.getBoundingClientRect();
    const visible=Math.max(0,Math.min(innerHeight,rect.bottom)-Math.max(0,rect.top));
    const needsScroll=visible<Math.min(390,rect.height*.6);
    if(needsScroll)diagram.scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth',block:'start'});
    return needsScroll&&!reducedMotion.matches?500:0;
  }
  let heroClicks=0,heroTimer;
  $('send-request').addEventListener('click',()=>{
    heroClicks++;clearTimeout(heroTimer);
    heroTimer=setTimeout(()=>{
      const count=heroClicks;heroClicks=0;const delay=bringDiagramIntoView();
      for(let i=0;i<count;i++)setTimeout(()=>{void runRequest();},delay+i*115);
    },240);
  });
  $('send-inline').addEventListener('click',()=>{void runRequest($('scenario-mode').value);});
  $('send-burst').addEventListener('click',()=>{
    const delay=bringDiagramIntoView();
    ['healthy','healthy','recovered','outage','healthy'].forEach((scenario,i)=>setTimeout(()=>{void runRequest(scenario);},delay+i*145));
  });
  mobileMedia.addEventListener('change',renderDiagram);
  updateReveal();renderDiagram();refreshMetrics();
})();
