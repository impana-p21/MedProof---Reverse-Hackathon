import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
let coolModule = null;
try { coolModule = await import('cool-nwc'); } catch { /* install dependency to enable real CooL mode */ }

const send = (res, status, type, body) => { res.writeHead(status, {'Content-Type':type}); res.end(body); };
const server = http.createServer(async (req,res)=>{
  if (req.url === '/api/status') return send(res,200,'application/json',JSON.stringify({coolInstalled:!!coolModule}));
  if (req.url === '/api/record' && req.method === 'POST') {
    let raw=''; for await (const c of req) raw += c;
    try {
      const d=JSON.parse(raw);
      if (!coolModule) return send(res,503,'application/json',JSON.stringify({error:'CooL SDK not installed on this runtime. Use the browser demo or run npm install.'}));
      const {CooL}=coolModule;
      const cool=new CooL({applicationId:'medproof-clinical-ai'});
      const {evidence}=await cool.record({type:'model.execution',metadata:d.metadata,payloads:{input:d.input,output:d.output}});
      return send(res,200,'application/json',JSON.stringify({evidence}));
    } catch(e) { return send(res,400,'application/json',JSON.stringify({error:String(e?.message||e)})); }
  }
  let p=req.url==='/'?'/index.html':req.url;
  const fp=path.join(root,'public',path.normalize(p).replace(/^\/+/,''));
  if (!fp.startsWith(path.join(root,'public'))) return send(res,403,'text/plain','Forbidden');
  try { const ext=path.extname(fp); const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'}; send(res,200,types[ext]||'application/octet-stream',fs.readFileSync(fp)); }
  catch { send(res,404,'text/plain','Not found'); }
});
server.listen(3000,()=>console.log('MedProof running at http://localhost:3000'));
