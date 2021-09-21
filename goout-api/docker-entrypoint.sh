dockerize -wait tcp://mysql:3306 -timeout 80s

npm install
npm run build
npm run start:prod