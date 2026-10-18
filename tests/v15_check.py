from pathlib import Path
import base64
from playwright.sync_api import sync_playwright
root = Path(__file__).resolve().parents[1]
html = (root/'index.html').read_text().replace('<link rel="stylesheet" href="styles.css">','<style>'+(root/'styles.css').read_text()+'</style>').replace('<script src="script.js" defer></script>','')
for a in ('brain.svg','favicon.svg'):
    html = html.replace('assets/'+a,'data:image/svg+xml;base64,'+base64.b64encode((root/'assets'/a).read_bytes()).decode())
html = html.replace('</body>','<script>'+(root/'script.js').read_text()+'</script></body>')
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    try:
        for width in (1440,390):
            page = b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
            errors = []
            page.on('pageerror',lambda e: errors.append(str(e)))
            page.set_content(html)
            assert page.locator('.node').count()==23
            assert page.locator('.node.is-unmounted').count()==2
            assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
            page.locator('.node[data-node="queue"]').click()
            assert page.locator('#inspector-title').inner_text()=='Message queue'
            page.locator('#inspector-close').click()
            page.evaluate('Math.random=()=>.05')
            page.locator('#send-burst').click()
            page.wait_for_function('document.querySelector("#metric-replicas").textContent.includes("02")',timeout=8000)
            page.wait_for_function('document.querySelector("#metric-replicas").textContent.includes("03")',timeout=8000)
            page.wait_for_function('document.querySelector("#metric-flight").textContent==="00"',timeout=18000)
            page.wait_for_function('document.querySelector("#metric-replicas").textContent.includes("01")',timeout=10000)
            assert not errors,errors
            page.close()
        print('Cloud Cortex V1.5 smoke tests passed')
    finally: b.close()
