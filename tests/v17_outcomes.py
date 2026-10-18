from pathlib import Path
from playwright.sync_api import sync_playwright
import base64
r=Path(__file__).resolve().parents[1]
h=(r/'index.html').read_text().replace('<link rel="stylesheet" href="styles.css">','<style>'+(r/'styles.css').read_text()+'</style>').replace('<script src="script.js" defer></script>','')
for a in ('brain.svg','favicon.svg'):
 h=h.replace('assets/'+a,'data:image/svg+xml;base64,'+base64.b64encode((r/'assets'/a).read_bytes()).decode())
h=h.replace('</body>','<script>'+(r/'script.js').read_text()+'</script></body>')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True)
 page=b.new_page(viewport={'width':1440,'height':900},reduced_motion='reduce')
 errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
 page.set_content(h)
 for i,(roll,code) in enumerate(((.15,'200'),(.65,'200'),(.75,'403'),(.85,'429'),(.95,'503')),1):
  page.evaluate('(roll)=>Math.random=()=>roll',roll)
  page.locator('#send-inline').click()
  page.wait_for_function('(i)=>Number(document.querySelector("#metric-completed").textContent)+Number(document.querySelector("#metric-failed").textContent)===i',arg=i,timeout=16000)
  assert code in page.locator('#metric-result').inner_text()
  page.wait_for_function('document.querySelector("#metric-flight").textContent==="00"',timeout=16000)
 assert page.locator('#metric-completed').inner_text()=='02'
 assert page.locator('#metric-failed').inner_text()=='03'
 assert not errors,errors
 b.close()
print('V1.7 weighted scenarios: PASS')
