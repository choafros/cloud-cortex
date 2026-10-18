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
 for width in (1440,390):
  page=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
  page.set_content(h)
  page.locator('#zoom-out').click()
  page.evaluate('Math.random=()=>.25')
  page.locator('#send-inline').click()
  assert page.locator('#architecture').get_attribute('data-view')=='overview'
  assert page.locator('#overview-layer .semantic-packet').count()==1
  page.locator('#zoom-in').click();page.locator('#zoom-in').click()
  assert page.locator('#architecture').get_attribute('data-view')=='deep'
  assert page.locator('#deep-layer .semantic-packet').first.get_attribute('data-live-request')=='1'
  page.wait_for_function('document.querySelector("#metric-flight").textContent==="00"',timeout=16000)
  page.locator('#send-burst').click()
  page.wait_for_function('document.querySelector("#metric-replicas").textContent.includes("03")',timeout=13000)
  page.wait_for_function('document.querySelector("#metric-flight").textContent==="00"',timeout=18000)
  page.wait_for_function('document.querySelector("#metric-replicas").textContent.includes("01")',timeout=12000)
  assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
  assert not errors,errors
  page.close()
 b.close()
print('V1.7 request continuity and scaling: PASS')
