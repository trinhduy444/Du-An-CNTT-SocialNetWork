const handleTextData = (req, res, next) => {
  const chunks = [];
  req.on('data', (chunk) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    const data = Buffer.concat(chunks);
    req.body = data.toString('utf8');
    next();
  });
};

module.exports = handleTextData;
