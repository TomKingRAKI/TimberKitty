// To jest tymczasowy kod testowy do debugowania Render.com
const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Ten log powinien pojawić się przy każdej próbie wejścia na stronę
  console.log('Test "Hello World" - otrzymano zapytanie!');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Serwer testowy dziala!\n');
});

server.listen(port, () => {
  // Ten log powinien pojawić się zaraz po starcie serwera
  console.log(`Minimalny serwer testowy uruchomiony na porcie ${port}`);
});