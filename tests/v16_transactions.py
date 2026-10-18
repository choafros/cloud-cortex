from pathlib import Path
from playwright.sync_api import sync_playwright
import base64
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text().replace('<link rel="stylesheet" href="styles.css">','<style>'+(root/'styles.css').read_text()+'</style>').replace('<script src="script.js" defer></script>','')
for filename in ('brain.svg','favicon.svg'):
    html=html.replace('assets/'+filename,'data:image/svg+xml;base64,'+base64.b64encode((root/'assets'/filename).read_bytes()).decode())
html=html.replace('</body>','<script>'+(root/'script.js').read_text()+'</script></body>')
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True)
    try:
        for width in (1440,390):
            page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
            errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.set_content(html)
            page.locator('#zoom-in').click()
            page.evaluate('Math.random=()=>.52')
            page.locator('#send-inline').click()
            assert page.locator('#architecture').get_attribute('data-view')=='system'
            page.wait_for_function('document.querySelector("#metric-completed").textContent==="01"',timeout=13000)
            page.locator('#send-burst').click()
            page.wait_for_function('document.querySelector("#metric-replicas").textContent.includes("03")',timeout=15000)
            page.wait_for_function('document.querySelector("#metric-completed").textContent==="06"',timeout=15000)
            page.wait_for_function('document.querySelector("#metric-flight").textContent==="00"',timeout=15000)
            page.wait_for_function('document.querySelector("#metric-replicas").textContent.includes("01")',timeout=15000)
            assert not errors,errors
            page.close()
        print('V1.6 transactions and elastic scaling checks passed')
    finally: browser.close()
