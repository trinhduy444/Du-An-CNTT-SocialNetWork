const bodyParser = require('body-parser');

const bodyParserMiddleware = () => {
    const middleware = [
      bodyParser.json(),
      bodyParser.urlencoded({ extended: true }),
    ];
    
    return middleware;  
};
  

module.exports = bodyParserMiddleware;
