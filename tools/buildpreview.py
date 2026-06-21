import base64, re, os, sys
page=sys.argv[1]; out=sys.argv[2]; include_three=(sys.argv[3]=='1') if len(sys.argv)>3 else True
force_case=sys.argv[4] if len(sys.argv)>4 else ''
MIME={'png':'image/png','jpg':'image/jpeg','jpeg':'image/jpeg','svg':'image/svg+xml','webp':'image/webp','gif':'image/gif','mp4':'video/mp4'}
def b64(p):
    with open(p,'rb') as f: return base64.b64encode(f.read()).decode()
def du(p):
    ext=p.rsplit('.',1)[-1].lower(); return f"data:{MIME.get(ext,'application/octet-stream')};base64,{b64(p)}"
logo=du('assets/logo-light.png'); fav=du('assets/favicon.png')
css=open('css/styles.css',encoding='utf-8').read()
css=re.sub(r"url\('(\.\./assets/fonts/[^']+\.woff2)'\)\s*format\('woff2'\)",
           lambda m:"url('%s') format('woff2')"%('data:font/woff2;base64,'+b64(m.group(1).replace('../',''))), css)
css=css.replace("url(assets/logo-light.png)","url(%s)"%logo)
def js(p): return open(p,encoding='utf-8').read()
main=js('js/main.js').replace("'assets/logo-light.png'","'%s'"%logo)
if force_case:
    target="function caseId(){ try{return new URLSearchParams(location.search).get('id')||'';}catch(e){return '';} }"
    main=main.replace(target, "function caseId(){ return '%s'; }"%force_case)
html=open(page,encoding='utf-8').read()
html=re.sub(r'\s*<link rel="preload"[^>]*>','',html)
html=html.replace('<link rel="stylesheet" href="css/styles.css" />','<style>%s</style>'%css)
html=html.replace('href="assets/favicon.png"','href="%s"'%fav)
html=html.replace('src="assets/logo-light.png"','src="%s"'%logo)
libs=['assets/vendor/gsap.min.js','assets/vendor/ScrollTrigger.min.js','assets/vendor/lenis.min.js']
if include_three: libs.append('assets/vendor/three.min.js')
scripts="\n".join("<script>%s</script>"%js(p) for p in libs)+"\n<script>%s</script>"%js('js/content.js')+"\n<script>%s</script>"%main
html=re.sub(r'<script src="assets/vendor/[^"]+"></script>\s*','',html)
html=re.sub(r'<script src="js/content\.js"></script>\s*','',html)
html=html.replace('<script src="js/main.js"></script>', scripts)
# inline ALL remaining local image asset refs (brand logos, work posts, photo, etc.)
refs=set(re.findall(r"assets/[A-Za-z0-9_./-]+\.(?:png|jpg|jpeg|svg|webp|gif|mp4)", html))
for r in sorted(refs, key=len, reverse=True):
    if os.path.exists(r):
        html=html.replace(r, du(r))
open(out,'w',encoding='utf-8').write(html)
left=re.findall(r'(?:href|src)="(?:assets/|css/|js/)[^"]*"',html)
print('built %s  %.2f MB | leftover:'%(os.path.basename(out),os.path.getsize(out)/1048576), left[:4])
