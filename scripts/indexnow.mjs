// 배포 뒤 sitemap의 모든 주소를 IndexNow(빙·네이버 등)로 알린다. 실패해도 배포는 실패로 치지 않는다.
const HOST = 'paper-digest.app';
const KEY = 'd21984cc03f0f2507f63cc8dbac26fa5';
const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
for (let i = 0; i < urls.length; i += 10000) {
  const chunk = urls.slice(i, i + 10000);
  for (const ep of ['https://searchadvisor.naver.com/indexnow', 'https://api.indexnow.org/indexnow']) {
    try {
      const r = await fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: chunk }),
      });
      console.log('indexnow', new URL(ep).host, r.status, i + chunk.length);
    } catch (e) { console.log('indexnow', ep, 'fail', String(e)); }
  }
}
