import http from 'node:http';
import fs from 'node:fs';

const server = http.createServer((req, res) => {
  console.log(req.url);

  // res.writeHead(200, { 'content-type': 'text/html' });
  // res.write(`<h1>URL ${req.url}</h1>`);
  // res.end();

  // const data = { name: 'John Doe', age: 30, city: 'Canada' };
  // res.writeHead(200, { 'content-type': 'application/json' });
  // res.end(JSON.stringify(data));

  if (req.url === '/') {
    const htmlFile = fs.readFileSync('./public/index.html', 'utf-8');
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(htmlFile);
    return;
  }

  if (req.url?.endsWith('.js')) {
    res.writeHead(200, { 'content-type': 'application/javascript' });
  } else if (req.url?.endsWith('.css')) {
    res.writeHead(200, { 'content-type': 'text/css' });
  }

  const responseContent = fs.readFileSync(`./public${req.url}`, 'utf-8');
  res.end(responseContent);
});

server.listen(8080, () => {
  console.log('servidor corriendo en el puerto 8080');
});
