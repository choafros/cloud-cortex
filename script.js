/* Cloud Cortex V1.7 — one simulated request engine projected into three synchronized semantic views. No network calls. */
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
  // Concise, technically grounded notes for each concept. This is a teaching demo,
  // not a claim that these components actually run in this static website.
  const architectureNotes = {
    client:['ENTRY POINT','The visitor begins a transaction; a backend has to decide what to trust and what to do.','Use request IDs, idempotency keys and tight timeouts so repeat clicks do not silently duplicate writes.','Slow clients and interrupted connections need safe cancellation and retry semantics.'],
    waf:['SECURITY / EDGE','Filters malicious or abnormal traffic before it reaches the application.','Combine managed rules with tuned exceptions, bot signals and request-size limits. Avoid blocking legitimate customers.','False positives require audit trails and safe override procedures.'],
    rate:['SECURITY / CAPACITY','Controls how often a client can call an API.','Use token-bucket limits, distributed counters and fair quotas across IPs, tokens and tenants.','Return 429 with a useful Retry-After value; counters should fail safely during outages.'],
    lb:['TRAFFIC / ROUTING','Spreads incoming traffic across healthy application instances.','Balance algorithms, health probes, connection draining and session affinity need deliberate trade-offs.','A failed replica should be removed quickly without dropping healthy in-flight requests.'],
    gateway:['API PLATFORM','Acts as a policy and routing boundary for backend APIs.','Handle versioning, request validation, auth propagation, timeouts and stable error contracts.','Misconfiguration can impact every service; release routes gradually and measure errors.'],
    auth:['IDENTITY / TRUST','Decides who is calling and whether the operation is permitted.','Validate token signatures and claims; check fine-grained authorization, not just login state.','Expired tokens, compromised credentials and identity-provider outages need explicit handling.'],
    apiA:['COMPUTE / REPLICA','A stateless backend instance executes business logic and hands off slow work.','Keep handlers idempotent; bound concurrency; externalize session state for horizontal scaling.','Unhealthy pods must drain; repeated writes must not duplicate work.'],
    apiB:['COMPUTE / SCALE-OUT','An extra instance appears when traffic passes the scaling threshold.','Provisioning needs warm-up checks, service discovery and routing once readiness passes.','Cold starts and dependency bottlenecks can erase expected scaling gains.'],
    apiC:['COMPUTE / ELASTICITY','A third instance absorbs a further burst of concurrent requests.','Scale from useful signals such as concurrency and latency, with cooldowns to avoid flapping.','More replicas cannot fix a saturated database or an unhealthy downstream queue.'],
    cache:['DATA / CACHE','A fast in-memory path reduces repeated expensive operations.','Pick TTLs, eviction policy and key structure carefully; plan cache misses and invalidation.','Avoid stampedes when a hot key expires; keep correctness independent of the cache.'],
    queue:['MESSAGING / BACKPRESSURE','Buffers asynchronous work so spikes do not overwhelm downstream services.','Choose delivery guarantees, visibility timeouts, ordering scope and idempotent consumers.','Watch queue age, retry storms and poison messages—not only queue length.'],
    worker:['COMPUTE / ASYNC','Processes buffered jobs and performs durable writes.','Bound consumer concurrency, checkpoint safely, and design jobs to run more than once.','A crash between commit and acknowledgement can redeliver a job.'],
    retry:['RESILIENCE / BACKOFF','Retries temporary errors without amplifying an outage.','Use bounded exponential backoff, jitter, error classification and a retry budget.','Never blindly retry non-idempotent writes or permanent validation failures.'],
    dlq:['RESILIENCE / ISOLATION','Keeps repeatedly failing messages available for review.','Preserve failure context, alert operators and provide safe redrive tooling after a fix.','A growing DLQ is an operational incident, not a substitute for solving the root cause.'],
    shardA:['DATA / PARTITION 01','One logical partition of a sharded data store.','Shard-key choice impacts routing, hotspots, data locality and cross-shard queries.','Plan for rebalancing, partial shard outages and consistency during migration.'],
    shardB:['DATA / PARTITION 02','A second data partition shares write demand with other shards.','Use deterministic routing and observability per shard rather than averages only.','Skewed keys can create hot partitions while others appear idle.'],
    shardC:['DATA / PARTITION 03','A third partition illustrates independent ownership of a key range.','Design key mapping, safe data movement and read-after-write expectations.','Cross-shard transactions and resharding remain costly engineering problems.'],
    ws:['REALTIME / DELIVERY','Pushes an asynchronous completion event to the connected client.','Manage authentication, reconnects, fan-out, ordering, heartbeats and missed-event replay.','Clients disconnect; durable business events should not depend on socket delivery.'],
    success:['RESULT / SUCCESS','The request completed successfully in the simulation.','A 200 response should reflect a clearly defined contract; long-running work may need 202 first.','Do not report success before the required durable operation has actually completed.'],
    blocked:['RESULT / CLIENT ERROR','A security or quota rule rejected this transaction.','Differentiate access-denied 403 and quota-exceeded 429 with stable error payloads.','Log enough for investigation without leaking sensitive security logic.'],
    failed:['RESULT / SERVICE ERROR','The job exhausted its simulated retry budget.','Separate transient from permanent failures and trace the request across its retry history.','Surface partial failures honestly and offer recovery or reprocessing paths.'],
    metrics:['OBSERVABILITY','Connects request IDs, timing, errors and service events into a trace.','Use trace propagation, cardinality limits and latency/error dashboards tied to user experience.','Missing spans and noisy alerts hide the critical failure during an incident.'],
    autoscale:['CONTROL PLANE','Changes replica capacity as load rises and later subsides.','Consider desired/ready replicas, startup delay, HPA thresholds, cooldown and capacity limits.','Scaling too slowly hurts latency; scaling too eagerly causes churn and cost.']
  };
  // Semantic zoom deliberately changes architectural detail rather than merely
  // enlarging SVG labels. These teaching nodes are not live simulated services.
  const semanticViews={
    overview:{
      title:'OVERVIEW', nodes:{
        edge:['Edge & trust','WAF · QUOTAS','Protect the perimeter and enforce client trust boundaries.','Inspect malicious traffic, define rate-limit strategies and reject requests safely before application work.','False positives, coordinated attacks and overloaded counters must not compromise legitimate traffic.'],
        routing:['Traffic & API','BALANCING · GATEWAY','Direct requests to healthy services and enforce API contracts.','Health checks, draining, policy enforcement, identity propagation and predictable timeout budgets all shape reliability.','Misrouted requests or cascading policy failures affect every downstream service.'],
        compute:['Application','REPLICAS · CACHE','Stateless API replicas handle the interactive request.','Horizontal scaling works best with idempotent handlers, independent sessions, a good shard key and bounded dependency calls.','Autoscaling cannot fix a shared dependency bottleneck or bad cache invalidation.'],
        events:['Async processing','QUEUE · WORKERS','Separate incoming traffic from durable background processing.','Queues absorb bursts; consumers manage ordering, delivery guarantees, retries and poisoned messages.','Unbounded queue growth and retry storms can take down otherwise healthy systems.'],
        data:['Data & delivery','SHARDS · WEBSOCKET','Persist results across partitions and notify clients asynchronously.','Shard-key distribution, consistency expectations, connection management and event sequencing matter at scale.','Partial writes or disconnections demand idempotent reconciliation and replay.'],
        resilience:['Resilience','RETRY · DLQ','Failure is a first-class execution path, not an afterthought.','Budgets, exponential backoff, circuit breakers and dead-letter operations turn outages into bounded incidents.','Retries can amplify an outage without jitter and effective backpressure.'],
        observe:['Operations','TRACING · SCALING','Measure latency, errors and capacity to guide decisions.','Trace propagation, service-level objectives, controlled scale-up and clear alerts reduce diagnosis time.','Noisy alerts and scaling flaps hide the real fault and waste resources.']
      },
      desktop:{edge:[205,240],routing:[455,240],compute:[705,240],events:[960,240],data:[1250,240],resilience:[560,485],observe:[990,485]},
      mobile:{edge:[136,168],routing:[386,168],compute:[136,350],events:[386,350],data:[136,532],resilience:[386,532],observe:[258,735]},
      links:[['edge','routing'],['routing','compute'],['compute','events'],['events','data'],['compute','resilience'],['resilience','events'],['events','observe']]
    },
    deep:{
      title:'DEEP DIVE',nodes:{
        ingress:['Request context','TRACE ID','Each request carries information used across many services.','Correlation IDs, deadlines, tenant identity, cancellation and idempotency tokens travel together.','Context loss makes failures hard to trace and can break authorization guarantees.'],
        policy:['Policy engine','VALIDATE','Validate input and authorize the operation before mutation.','Apply schema checks, scoped authorization and consistent error contracts at trust boundaries.','A bypassed validation step can corrupt data or leak resources.'],
        mutex:['Idempotency','DEDUPE','Protect writes against repeated retries and repeated clicks.','Atomic claim-and-store, stable dedupe keys, TTLs and replayed results all require care.','A race between duplicate requests can cause double charging or duplicated jobs.'],
        api:['API handler','STATELESS','A service replica implements the business operation.','Use bounded fan-out, per-hop timeouts, concurrency limits and safe dependency isolation.','Thread exhaustion or a slow downstream call can saturate every replica.'],
        cachePolicy:['Cache strategy','TTL · STAMPEDE','Understand where to cache and when to invalidate.','TTL selection, negative caching, eviction and stampede control influence both speed and correctness.','A stale cache entry can return inconsistent results or overwhelm a recovering database.'],
        outbox:['Outbox','ATOMIC EVENT','Write a business change and an event together.','A transactional outbox bridges a database commit and eventually reliable publication.','Publishing outside the commit boundary risks lost or duplicated events.'],
        broker:['Message broker','ACK · DELIVERY','Transport work asynchronously with explicit delivery guarantees.','Visibility timeout, ack semantics, partitions and deduplication govern reliable consumption.','Poison events and consumer lag need bounded reprocessing.'],
        consumer:['Worker concurrency','BACKPRESSURE','Regulate consumer throughput based on downstream capacity.','Bound consumer concurrency, tune prefetch and use idempotent handlers for at-least-once delivery.','A consumer fleet can overload the storage layer if scaled independently.'],
        breaker:['Circuit breaker','BULKHEAD','Stop repeated requests to an unhealthy dependency.','Open, half-open and closed states balance recovery probes with fault containment.','Incorrect thresholds cause cascading failures or block healthy traffic.'],
        budget:['Retry budget','JITTER','Retries are limited and staggered instead of immediate loops.','Use classified errors, exponential backoff with jitter and maximum attempts.','Aggressive retries lengthen outages and magnify traffic.'],
        isolate:['Dead-letter policy','QUARANTINE','Isolate failed jobs so healthy work can continue.','Store failure context, alarm on trends and offer safe controlled replays.','An ignored DLQ becomes a permanent data-loss queue.'],
        router:['Shard router','PARTITION KEY','Map each record to the correct data shard.','Choose stable keys, hash distribution, routing metadata and rebalancing plans.','Hot keys and stale routing maps can stall writes and affect consistency.'],
        shard1:['Partition A','CONSISTENCY','Owns one range of the data set.','Per-shard pools, indexes and replication lag are tracked individually.','Partial outages require explicit response contracts and recovery procedures.'],
        shard2:['Partition B','HOTSPOT WATCH','Shares the write workload, independently monitored.','Skew analysis and online rebalancing avoid one shard carrying most of the load.','Cross-shard queries introduce latency and coordination overhead.'],
        push:['Client notification','RECONNECT','Notify clients when asynchronous work has completed.','Out-of-order events, resume tokens, authentication and missed-event replay deserve design attention.','A WebSocket disconnect must never undo a successful database commit.']
      },
      desktop:{ingress:[130,135],policy:[355,135],mutex:[580,135],api:[810,135],cachePolicy:[1045,135],outbox:[1310,135],
        broker:[1310,335],consumer:[1070,335],breaker:[815,335],budget:[580,335],isolate:[345,335],router:[580,580],shard1:[875,580],shard2:[1140,580],push:[1370,580]},
      mobile:{ingress:[137,100],policy:[383,100],mutex:[137,225],api:[383,225],cachePolicy:[137,350],outbox:[383,350],broker:[137,475],consumer:[383,475],breaker:[137,600],budget:[383,600],isolate:[137,725],router:[383,725],shard1:[137,850],shard2:[383,850],push:[258,965]},
      links:[['ingress','policy'],['policy','mutex'],['mutex','api'],['api','cachePolicy'],['cachePolicy','outbox'],['outbox','broker'],['broker','consumer'],['consumer','breaker'],['breaker','budget'],['budget','isolate'],['consumer','router'],['router','shard1'],['router','shard2'],['shard1','push'],['shard2','push']]
    }
  };
  const zoomLevels=['overview','system','deep'];
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
  const state={nextId:0,completed:0,failed:0,retried:0,inFlight:0,queueDepth:0,replicas:1,desiredReplicas:1,apiAPosition:null,scaleTransitioning:false,selectedNode:null,
    recentClicks:[],scaleHoldUntil:0,nodes:new Map(),nodeStates:new Map(),paths:new Map(),activeWires:new Map(),mobile:mobileMedia.matches,resizePending:false,zoomLevel:1,semanticNodes:new Map(),liveRequests:new Map()};
  let scaleResetTimeout;
  function el(tag,attrs={},text){const node=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))node.setAttribute(k,String(v));if(text!==undefined)node.textContent=text;return node;}
  function clear(layer){layer.replaceChildren();}
  function position(id){
    if(id==='apiA' && state.apiAPosition) return state.apiAPosition;
    return layouts[state.mobile?'mobile':'desktop'].nodes[id];
  }
  function apiAHome(){return state.mobile?[260,308]:[873,368];}
  function apiATop(){return state.mobile?[92,308]:[873,225];}
  function syncApiWires(){
    for(const [from,to] of primaryLinks){
      if(from!=='apiA' && to!=='apiA')continue;
      const path=state.paths.get(`${from}->${to}`);
      if(path)path.setAttribute('d',pathData(from,to));
    }
  }
  function updateApiAPosition(x,y){
    state.apiAPosition=[x,y];
    const node=state.nodes.get('apiA');
    if(node)node.setAttribute('transform',`translate(${x} ${y})`);
    syncApiWires();
  }
  function pause(ms){return new Promise(resolve=>setTimeout(resolve,reducedMotion.matches?0:ms));}
  function movePrimary(to,duration=520){
    const from=[...position('apiA')];
    if(reducedMotion.matches){updateApiAPosition(...to);return Promise.resolve();}
    return new Promise(resolve=>{
      const start=performance.now();
      function tick(now){
        const t=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-t,3);
        updateApiAPosition(from[0]+(to[0]-from[0])*ease,from[1]+(to[1]-from[1])*ease);
        if(t<1)requestAnimationFrame(tick);else resolve();
      }
      requestAnimationFrame(tick);
    });
  }

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
      [['01 / EDGE & TRUST',43,129],['02 / SERVICES',743,76],['03 / EVENTS & DATA',1050,76],['04 / RESILIENCE',1100,689]];
    zones.forEach(([name,x,y])=>layers.zones.append(el('text',{x,y,class:'zone-label'},name)));
    if(!mobile)for(const x of [318,617,964,1290])layers.zones.append(el('line',{x1:x,y1:95,x2:x,y2:710,class:'zone-rule'}));
  }
  function renderDiagram(){
    if(state.inFlight>0){state.resizePending=true;return;}
    state.mobile=mobileMedia.matches;
    state.apiAPosition=state.replicas>1?apiATop():apiAHome();
    svg.setAttribute('viewBox',layouts[state.mobile?'mobile':'desktop'].view);
    Object.values(layers).forEach(clear);
    state.nodes.clear();state.nodeStates.clear();state.paths.clear();state.activeWires.clear();
    addBackdrop();
    for(const [index,[from,to]] of [...primaryLinks,...ambientLinks].entries()){
      const key=`${from}->${to}`;
      const wire=el('path',{d:pathData(from,to),class:`wire${index>=primaryLinks.length?' wire-ambient':''}`,'data-edge':key});
      layers.wires.append(wire);state.paths.set(key,wire);
    }
    Object.entries(definitions).forEach(([id,[name,detail,explanation]],index)=>{
      const [x,y]=position(id);
      const group=el('g',{class:`node${['apiB','apiC'].includes(id)?' is-dormant':''}${['metrics','autoscale'].includes(id)?' is-observer':''}`, 'data-node':id,transform:`translate(${x} ${y})`,tabindex:['apiB','apiC'].includes(id)?'-1':'0',role:'button','aria-label':`Inspect ${name}`, 'aria-controls':'node-inspector','aria-pressed':'false'});
      group.append(el('title',{},`${name}: ${explanation}`));
      group.append(el('rect',{class:'node-halo',x:-52,y:-26,width:104,height:52,rx:12}));
      group.append(el('rect',{class:'node-bg',x:-57,y:-28,width:114,height:56,rx:9}));
      group.append(el('circle',{class:'node-circle',cx:-44,cy:-16,r:2.7,style:`--spark-phase:${index%7}`}));
      group.append(el('circle',{class:'node-spark',cx:44,cy:-16,r:2.1,style:`--spark-phase:${index%9}`}));
      group.append(el('text',{class:'node-title',x:0,y:-2,'text-anchor':'middle'},name));
      group.append(el('text',{class:'node-detail',x:0,y:13,'text-anchor':'middle'},detail));
      group.addEventListener('click',()=>openInspector(id));
      group.addEventListener('keydown',event=>{
        if(event.key==='Enter'||event.key===' '){event.preventDefault();openInspector(id);}
      });
      layers.nodes.append(group);state.nodes.set(id,group);
      state.nodeStates.set(id,{processing:0,retrying:0,failed:0,success:0});
      refreshNode(id);
    });
    renderSemanticViews();
    refreshReplicas();
    refreshReplicaWires();
    if(state.selectedNode)highlightSelection();
  }
  // Each simulated transaction has ONE lifecycle and ONE sampled outcome.  The
  // alternative diagrams project the same progress; switching detail levels does
  // not restart requests, resample their outcomes or alter their request IDs.
  const scenarioSteps={healthy:12,recovered:14,blocked:2,throttled:3,outage:14};
  function semanticRoute(level,scenario,shardIndex){
    if(level==='overview'){
      if(scenario==='blocked'||scenario==='throttled')return ['edge'];
      const base=['edge','routing','compute','events'];
      if(scenario==='recovered'||scenario==='outage')base.push('resilience');
      if(scenario==='outage')return base;
      if(scenario==='recovered')base.push('events');
      return [...base,'data'];
    }
    const route=['ingress','policy'];
    if(scenario==='blocked'||scenario==='throttled')return route;
    route.push('mutex','api','cachePolicy','outbox','broker','consumer');
    if(scenario==='recovered'||scenario==='outage')route.push('breaker','budget');
    if(scenario==='outage')return [...route,'isolate'];
    if(scenario==='recovered')route.push('consumer');
    return [...route,'router',shardIndex===0?'shard1':'shard2','push'];
  }
  function tracePath(level,route){
    const positions=semanticViews[level][state.mobile?'mobile':'desktop'];
    return route.map((id,i)=>`${i?'L':'M'} ${positions[id][0]} ${positions[id][1]}`).join(' ');
  }
  function createProjection(request,level){
    const parent=$(level+'-layer'),route=semanticRoute(level,request.scenario,request.shardIndex);
    const path=el('path',{d:tracePath(level,route),class:'live-route', 'aria-hidden':'true'});
    const trail=el('path',{d:path.getAttribute('d'),class:'live-route-progress','aria-hidden':'true'});
    const dot=el('g',{class:'semantic-packet','aria-hidden':'true','data-live-request':request.id});
    dot.append(el('circle',{class:'semantic-packet-halo',r:14}));
    dot.append(el('circle',{class:'semantic-packet-core',r:5}));
    dot.append(el('text',{class:'semantic-packet-label',x:13,y:-13},`#${pad(request.id)}`));
    parent.append(path,trail,dot);
    const total=Math.max(0.001,path.getTotalLength());
    request.projections[level]={route,path,trail,dot,total,activeNode:null};
    updateProjection(request,level);
  }
  function updateProjection(request,level){
    const p=request.projections[level];if(!p)return;
    const progress=Math.max(0,Math.min(1,request.progress));
    const distance=p.total*progress,point=p.path.getPointAtLength(distance);
    p.dot.setAttribute('transform',`translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
    const tail=Math.min(distance,62);
    p.trail.style.strokeDasharray=`${tail} ${p.total+8}`;
    p.trail.style.strokeDashoffset=String(-(distance-tail));
    p.dot.classList.toggle('is-failure',request.terminalCode!==null&&request.terminalCode!==200);
    p.dot.classList.toggle('is-retry',request.retrying&&request.terminalCode===null);
    const current=p.route[Math.min(p.route.length-1,Math.floor(progress*(p.route.length-1)+.25))];
    p.activeNode=current;
  }
  function refreshSemanticActivity(){
    const active=new Map();
    for(const req of state.liveRequests.values()){
      for(const level of ['overview','deep']){
        const p=req.projections[level];if(!p)continue;
        const key=`${level}:${p.activeNode}`;
        const value=req.terminalCode!==null?(req.terminalCode===200?'success':'failed'):(req.retrying?'retry':'active');
        const current=active.get(key);
        if(!current||value==='failed'||(value==='retry'&&current!=='failed'))active.set(key,value);
      }
    }
    for(const [key,node] of state.semanticNodes){
      const value=active.get(key)||'idle';
      if(node.dataset.state!==value){node.dataset.state=value;node.classList.toggle('is-signalled',value!=='idle');node.classList.toggle('is-retry',value==='retry');node.classList.toggle('is-failed',value==='failed');node.classList.toggle('is-complete',value==='success');}
    }
    updateInspectorState();
  }
  function updateRequestProgress(request,progress){
    request.progress=progress;
    for(const level of ['overview','deep'])updateProjection(request,level);
    const now=performance.now();
    if(now-(request.lastSignal||0)>70||progress===1){request.lastSignal=now;refreshSemanticActivity();}
  }
  function startProjectedRequest(id,scenario,shardIndex){
    const request={id,scenario,shardIndex,progress:0,step:0,total:scenarioSteps[scenario],terminalCode:null,retrying:false,projections:{},lastSignal:0};
    state.liveRequests.set(id,request);
    createProjection(request,'overview');createProjection(request,'deep');
    refreshSemanticActivity();return request;
  }
  function finishProjectedRequest(request,code){
    request.terminalCode=code;request.retrying=false;
    updateRequestProgress(request,1);refreshSemanticActivity();
    for(const p of Object.values(request.projections)){
      p.dot.classList.add('is-settled');
      const tag=p.dot.querySelector('.semantic-packet-label');
      if(tag)tag.textContent=`#${pad(request.id)} · ${code}`;
    }
    setTimeout(()=>{
      if(state.liveRequests.get(request.id)!==request)return;
      for(const p of Object.values(request.projections)){p.dot.remove();p.trail.remove();p.path.remove();}
      state.liveRequests.delete(request.id);refreshSemanticActivity();
    },reducedMotion.matches?160:1200);
  }
  function renderSemanticViews(){
    state.semanticNodes.clear();
    for(const level of ['overview','deep']){
      const layer=$(level+'-layer');layer.replaceChildren();
      const view=semanticViews[level],coords=view[state.mobile?'mobile':'desktop'];
      for(const [from,to] of view.links){
        const a=coords[from],b=coords[to];
        const d=`M ${a[0]} ${a[1]} Q ${(a[0]+b[0])/2} ${(a[1]+b[1])/2-20} ${b[0]} ${b[1]}`;
        layer.append(el('path',{d,class:'semantic-wire','data-semantic-edge':`${from}->${to}`}));
      }
      for(const [id,data] of Object.entries(view.nodes)){
        const [x,y]=coords[id],key=`${level}:${id}`;
        const group=el('g',{'data-semantic-id':key,transform:`translate(${x} ${y})`,class:'semantic-node',tabindex:'0',role:'button','aria-label':`Explore ${data[0]}`,'aria-controls':'node-inspector','aria-pressed':'false'});
        group.append(el('rect',{x:-88,y:-37,width:176,height:74,rx:12,class:'semantic-bg'}));
        group.append(el('circle',{cx:-70,cy:-19,r:3,class:'semantic-led'}));
        group.append(el('text',{x:0,y:-1,'text-anchor':'middle',class:'semantic-title'},data[0]));
        group.append(el('text',{x:0,y:18,'text-anchor':'middle',class:'semantic-subtitle'},data[1]));
        group.addEventListener('click',()=>openInspector(key));
        group.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openInspector(key);}});
        layer.append(group);state.semanticNodes.set(key,group);
      }
    }
    for(const req of state.liveRequests.values()){
      req.projections={};createProjection(req,'overview');createProjection(req,'deep');
    }
    refreshSemanticActivity();updateZoomUI();
  }
  function updateZoomUI(){
    const level=zoomLevels[state.zoomLevel];
    svg.dataset.view=level;
    wrap.dataset.zoom=level;
    $('zoom-current').textContent=level==='overview'?'OVERVIEW':level==='deep'?'DEEP DIVE':'SYSTEM';
    $('zoom-out').disabled=state.zoomLevel===0;
    $('zoom-in').disabled=state.zoomLevel===2;
    $('zoom-live').textContent=state.inFlight?`${state.inFlight} LIVE · SAME REQUESTS`:'ONE REQUEST · THREE PERSPECTIVES';
    for(const name of ['overview','deep']) $(name+'-layer').setAttribute('aria-hidden',level===name?'false':'true');
    layers.nodes.setAttribute('aria-hidden',level==='system'?'false':'true');
    // Hide inactive layouts from keyboard, including unmounted replicas.
    for(const [id,node] of state.nodes)node.setAttribute('tabindex',level==='system'&&!node.classList.contains('is-unmounted')?'0':'-1');
    for(const [id,node] of state.semanticNodes)node.setAttribute('tabindex',id.startsWith(level+':')?'0':'-1');
  }
  function setZoomLevel(value){
    const target=Math.max(0,Math.min(2,value));
    if(target===state.zoomLevel)return;
    if(!$('node-inspector').hidden)closeInspector({focus:false});
    state.zoomLevel=target;openCortex();updateZoomUI();
    const info={overview:'Overview · seven connected architectural domains.',system:'System · 23 interactive infrastructure nodes.',deep:'Deep dive · 15 internal engineering decisions.'};
    setTrace(info[zoomLevels[target]]);
  }
  $('zoom-out').addEventListener('click',()=>setZoomLevel(state.zoomLevel-1));
  $('zoom-in').addEventListener('click',()=>setZoomLevel(state.zoomLevel+1));
  let lastWheelAt=0;
  svg.addEventListener('wheel',event=>{
    // Only the diagram itself captures wheel input. The document is free to scroll
    // beyond the first or last level. Inspector scrolling is always independent.
    if(Math.abs(event.deltaY)<5)return;
    const direction=event.deltaY>0?1:-1;
    const target=Math.min(2,Math.max(0,state.zoomLevel+direction));
    if(target===state.zoomLevel)return;
    event.preventDefault();
    const now=performance.now();
    if(now-lastWheelAt<560)return;
    lastWheelAt=now;setZoomLevel(target);
  },{passive:false});
  function pad(n){return String(n).padStart(2,'0');}
  function refreshMetrics(){
    metrics.sent.textContent=pad(state.nextId);metrics.completed.textContent=pad(state.completed);
    metrics.failed.textContent=pad(state.failed);metrics.retried.textContent=pad(state.retried);
    metrics.flight.textContent=pad(state.inFlight);metrics.queue.textContent=pad(state.queueDepth);
    metrics.replicas.innerHTML=`${pad(state.replicas)} <small>/ 03</small>`;
  }
  function setTrace(s){$('trace-message').textContent=s;}
  function setStatus(s){$('system-status').textContent=s;}
  const nodeStates = {processing:'PROCESSING',retrying:'RETRYING',failed:'FAILED',success:'COMPLETE'};
  // Each request contributes an independent temporary state. Concurrent requests
  // cannot clear each other's indicators before their own stage has finished.
  function refreshNode(id){
    const node=state.nodes.get(id),counts=state.nodeStates.get(id);
    if(!node||!counts)return;
    let live='idle';
    if(counts.failed>0)live='failed';
    else if(counts.retrying>0)live='retrying';
    else if(counts.processing>0)live='processing';
    else if(counts.success>0)live='success';
    const standby=(id==='apiB'&&state.replicas<2)||(id==='apiC'&&state.replicas<3);
    node.dataset.state=live;
    node.classList.toggle('is-active',live==='processing');
    node.classList.toggle('is-retrying',live==='retrying');
    node.classList.toggle('is-error',live==='failed');
    node.classList.toggle('is-success',live==='success');
    node.classList.toggle('is-unmounted',standby);
    node.classList.remove('is-dormant');
    node.setAttribute('tabindex',standby||state.zoomLevel!==1?'-1':'0');
    node.setAttribute('aria-hidden',standby?'true':'false');
    node.classList.toggle('is-scaled',!standby&&(id==='apiB'||id==='apiC'));
    const displayed=live==='idle'?(standby?'STANDBY':definitions[id][1]):nodeStates[live];
    node.querySelector('.node-detail').textContent=displayed;
    node.querySelector('title').textContent=`${definitions[id][0]} — ${standby?'not running':live}. ${definitions[id][2]}`;
    if(state.selectedNode===id)updateInspectorState();
  }
  function refreshReplicas(){['apiA','apiB','apiC'].forEach(refreshNode);}
  function refreshReplicaWires(){
    for(const id of ['apiB','apiC']){
      const visible=id==='apiB'?state.replicas>=2:state.replicas>=3;
      for(const [from,to] of primaryLinks){
        if(from!==id && to!==id)continue;
        const edge=state.paths.get(`${from}->${to}`);
        if(edge)edge.classList.toggle('is-unmounted',!visible);
      }
    }
  }
  function setReplicas(count){
    if((count<3&&state.selectedNode==='apiC')||(count<2&&state.selectedNode==='apiB'))closeInspector();
    state.replicas=count;
    refreshReplicas();refreshReplicaWires();refreshMetrics();
    activate('autoscale',720);
    updateInspectorState();
  }
  async function reconcileReplicas(){
    if(state.scaleTransitioning)return;
    state.scaleTransitioning=true;
    try{
      while(state.replicas!==state.desiredReplicas){
        if(state.replicas===1 && state.desiredReplicas>=2){
          setStatus('SCALING / WARMING');
          await movePrimary(apiATop());
          // The first new replica arrives only after the main one has made room.
          setReplicas(2);
          await pause(360);
          addEvent('scale','↗','API / 02 is ready — second replica online');
        }else if(state.replicas===2 && state.desiredReplicas>=3){
          setReplicas(3);
          await pause(410);
          addEvent('scale','↗','API / 03 joined — traffic spread across 3 replicas');
        }else if(state.replicas===3 && state.desiredReplicas<=2){
          setReplicas(2);
          await pause(350);
        }else if(state.replicas===2 && state.desiredReplicas===1){
          setReplicas(1);
          await pause(300);
          await movePrimary(apiAHome());
          addEvent('scale','↘','Traffic settled — API / 01 recentred, 1 replica active');
        }
      }
      if(state.inFlight===0&&state.replicas===1)setStatus('SYSTEM IDLE');
    }finally{
      state.scaleTransitioning=false;
      if(state.replicas!==state.desiredReplicas)void reconcileReplicas();
    }
  }
  function requestReplicas(count){
    state.desiredReplicas=count;
    void reconcileReplicas();
  }
  function updateInspectorState(){
    if(!state.selectedNode || $('node-inspector').hidden)return;
    const id=state.selectedNode;
    if(id.includes(':')){
      const value=state.semanticNodes.get(id)?.dataset.state||'idle';
      const status=value==='idle'?(id.startsWith('overview:')?'OVERVIEW':'DESIGN'):value.toUpperCase();
      $('inspector-state').textContent=status;
      $('inspector-state').dataset.state=value;return;
    }
    const node=state.nodes.get(id);
    if(!node)return;
    const standby=node.classList.contains('is-unmounted');
    const live=standby?'STANDBY':(node.dataset.state||'idle').toUpperCase();
    $('inspector-state').textContent=live;
    $('inspector-state').dataset.state=live.toLowerCase();
  }
  function highlightSelection(){
    for(const [id,group] of state.nodes){
      group.classList.toggle('is-inspected',id===state.selectedNode);
      group.setAttribute('aria-pressed',id===state.selectedNode?'true':'false');
    }
    for(const [key,node] of state.semanticNodes){
      node.classList.toggle('is-inspected',key===state.selectedNode);
      node.setAttribute('aria-pressed',key===state.selectedNode?'true':'false');
    }
    for(const [key,wire] of state.paths){
      const [from,to]=key.split('->');
      wire.classList.toggle('is-inspected',Boolean(state.selectedNode && (from===state.selectedNode||to===state.selectedNode)));
    }
  }
  function openInspector(id){
    const isSemantic=id.includes(':');
    const node=isSemantic?state.semanticNodes.get(id):state.nodes.get(id);
    if(!node||node.classList.contains('is-unmounted'))return;
    openCortex();state.selectedNode=id;
    let zone,summary,design,failure,connections,title;
    if(isSemantic){
      const [level,key]=id.split(':');
      const view=semanticViews[level],info=view.nodes[key];
      title=info[0];zone=level==='overview'?'ARCHITECTURAL DOMAIN':'INSIDE THE SYSTEM';
      [,,summary,design,failure]=info;
      connections=[...new Set(view.links.filter(([from,to])=>from===key||to===key).map(([from,to])=>view.nodes[from===key?to:from][0]))].join('  ·  ');
    }else{
      [zone,summary,design,failure]=architectureNotes[id];title=definitions[id][0];
      connections=[...new Set(primaryLinks.concat(ambientLinks).filter(([from,to])=>from===id||to===id).map(([from,to])=>definitions[from===id?to:from][0]))].join('  ·  ');
    }
    $('inspector-zone').textContent=zone;
    $('inspector-title').textContent=title;
    $('inspector-summary').textContent=summary;
    $('inspector-design').textContent=design;
    $('inspector-failure').textContent=failure;
    $('inspector-connections-label').textContent='DIRECT CONNECTIONS';
    $('inspector-connections').textContent=connections||'Independent result';
    $('node-inspector').hidden=false;
    $('inspector-scroll').scrollTop=0;
    wrap.classList.add('inspector-visible');
    updateInspectorState();highlightSelection();
    if(state.mobile)$('node-inspector').scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'nearest'});
  }
  function closeInspector({focus=true}={}){
    $('node-inspector').hidden=true;
    wrap.classList.remove('inspector-visible');
    const selected=state.selectedNode;
    state.selectedNode=null;
    highlightSelection();
    if(focus&&selected){
      const node=state.nodes.get(selected)||state.semanticNodes.get(selected);
      if(node?.getAttribute('tabindex')==='0')node.focus();
    }
  }
  $('inspector-close').addEventListener('click',closeInspector);
  addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('node-inspector').hidden)closeInspector();});

  function activate(id,duration=760,type='active'){
    const counts=state.nodeStates.get(id);if(!counts)return;
    const key=type==='error'?'failed':type==='retry'?'retrying':type==='success'?'success':'processing';
    counts[key]++;
    refreshNode(id);
    setTimeout(()=>{if(state.nodeStates.get(id)!==counts)return;counts[key]=Math.max(0,counts[key]-1);refreshNode(id);},duration);
  }
  function scaleUp(){
    state.scaleHoldUntil=Date.now()+2800;
    const clicks=state.recentClicks.length;
    const target=(clicks>=5||state.inFlight>=5)?3:2;
    if(target<=state.desiredReplicas)return;
    clearTimeout(scaleResetTimeout);
    requestReplicas(target);
    setStatus('BURST / SCALING');
    setTrace(`Burst detected — ${target===2?'repositioning API / 01 to add a second replica':'warming the third API replica'}.`);
    addEvent('scale','↗',`${target} replicas requested · autoscaling in progress`);
  }
  function maybeScaleDown(){
    clearTimeout(scaleResetTimeout);
    const delay=Math.max(0,state.scaleHoldUntil-Date.now());
    scaleResetTimeout=setTimeout(()=>{
      if(state.inFlight!==0){maybeScaleDown();return;}
      requestReplicas(1);
      setTrace(`Traffic settled · ${state.completed} succeeded · ${state.failed} failed · scaling down.`);
    },delay+400);
  }
  function lightWire(key,on){const wire=state.paths.get(key);if(!wire)return;const count=(state.activeWires.get(key)||0)+(on?1:-1);if(count<=0){state.activeWires.delete(key);wire.classList.remove('is-active');}else{state.activeWires.set(key,count);wire.classList.add('is-active');}}
  function makePacket(id){
    const group=el('g',{class:'packet'});
    group.append(el('circle',{class:'packet-outer',r:13}));
    group.append(el('circle',{class:'packet-core',r:4.5}));
    group.append(el('text',{class:'packet-tag',x:10,y:-10},`#${pad(id)}`));
    layers.packets.append(group);return group;
  }
  function tweenWire(from,to,packet,duration,request){
    const path=state.paths.get(`${from}->${to}`);    if(!path)throw Error(`Missing architecture link ${from} -> ${to}`);
    const key=`${from}->${to}`;lightWire(key,true);
    const length=path.getTotalLength(),d=reducedMotion.matches?28:duration;
    return new Promise(resolve=>{
      const start=performance.now();
      function tick(now){const p=Math.min(1,(now-start)/d),ease=p*p*(3-2*p),pos=path.getPointAtLength(length*ease);
        packet.setAttribute('transform',`translate(${pos.x.toFixed(2)} ${pos.y.toFixed(2)})`);
        updateRequestProgress(request,(request.step+p)/request.total);
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
    const projected=state.liveRequests.get(id);
    if(projected)finishProjectedRequest(projected,status);
    activate('metrics',620);refreshMetrics();
  }
  // Final outcomes: 70% successful (60% direct + 10% recovered), 30% unsuccessful.
  // Independent draws are deliberate; a five-request burst will not always be 70/30.
  function sampleScenario(roll=Math.random()) {
    if(roll<.60)return 'healthy';
    if(roll<.70)return 'recovered';
    if(roll<.80)return 'blocked';
    if(roll<.90)return 'throttled';
    return 'outage';
  }
  async function runRequest(){
    const scenario=sampleScenario();
    if(state.inFlight>=15){setTrace('Traffic guard: maximum 15 simulated requests in flight.');return;}
    openCortex();clearTimeout(scaleResetTimeout);
    const now=Date.now();state.recentClicks=state.recentClicks.filter(ts=>now-ts<1600);state.recentClicks.push(now);
    const id=++state.nextId;state.inFlight++;
    if(state.recentClicks.length>=3||state.inFlight>=3)scaleUp();
    else if(state.replicas===1)setStatus('PROCESSING');
    refreshMetrics();updateZoomUI();
    if(state.inFlight<3)setTrace(`#${pad(id)}  →  Request entering the edge · outcome sampled.`);
    const packet=makePacket(id),[x,y]=position('client');packet.setAttribute('transform',`translate(${x} ${y})`);
    const request=startProjectedRequest(id,scenario,(id-1)%3);
    activate('client');
    let queued=false;
    async function go(from,to,duration=285,type='active'){
      await tweenWire(from,to,packet,duration,request);request.step++;
      if(type==='retry')request.retrying=true;
      else if(type==='error')request.retrying=false;
      activate(to,type==='error'?1100:620,type);stageMessage(id,to);
    }
    try{
      await go('client','waf');
      if(scenario==='blocked'){
        activate('waf',1700,'error');markPacket(packet,'error');await go('waf','blocked',450,'error');result(id,403,'FORBIDDEN');return;
      }
      await go('waf','rate');
      if(scenario==='throttled'){
        activate('rate',1700,'error');markPacket(packet,'error');await go('rate','blocked',390,'error');result(id,429,'RATE LIMITED');return;
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
          markPacket(packet,'error');activate('worker',1800,'error');await go('retry','dlq',440,'error');await go('dlq','failed',350,'error');
          result(id,503,'UNAVAILABLE');return;
        }
        await go('retry','worker',325,'retry');markPacket(packet,'healthy');request.retrying=false;
      }
      await go('worker',shard,345);await go(shard,'ws',400);await go('ws','success',340,'success');
      result(id,200,scenario==='recovered'?'OK · RECOVERED':'OK');
    }catch(e){
      console.error('Cloud Cortex simulation error:',e);
      result(id,500,'SIMULATION ERROR');
    }finally{
      if(queued)state.queueDepth=Math.max(0,state.queueDepth-1);
      packet.remove();state.inFlight=Math.max(0,state.inFlight-1);refreshMetrics();updateZoomUI();
      if(state.inFlight===0){
        if(state.resizePending){state.resizePending=false;renderDiagram();}
        if(state.replicas>1||state.desiredReplicas>1||state.scaleTransitioning)maybeScaleDown();
        else setStatus('SYSTEM IDLE');
      }
    }
  }
  $('send-inline').addEventListener('click',()=>{void runRequest();});
  $('send-burst').addEventListener('click',()=>{
    for(let i=0;i<5;i++)setTimeout(()=>{void runRequest();},i*130);
  });
  mobileMedia.addEventListener('change',renderDiagram);
  updateReveal();renderDiagram();refreshMetrics();
})();
