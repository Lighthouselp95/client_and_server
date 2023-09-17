const { createWriteStream } = require('fs');
const http = require('http')
// http.request()

// const http = require('node:http');

try {

const options = {
  hostname: 'http://localhost',
  port: 3000,
  path: '/testfile',
  method: 'get',
//   mode: 'cors'
//   headers: {
//   },
  
};
for (let i=0; i<100; i++) {
const req = http.request(options, (res) => {
//     // console.log(req);
  console.log(`STATUS ${i}: ${res.statusCode}`);
//   console.log(`HEADERS ${i}: ${JSON.stringify(res.headers)}`);
//   res.setEncoding('utf8');
const ws = createWriteStream(`E:/Downloads/test${i}`)
  res.on('data', (chunk) => {
    // ws.write(chunk);
  });
  res.on('end', () => {
    console.log(`No more data in response${i}`);
  });
});
req.on('data', data => {

})
req.on('error', (e) => {
  console.error(`problem with request ${i}: ${e.message}`);
});

// Write data to request body
req.end();
}
}
catch (err) {console.log(err)}