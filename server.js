const express = require('express');
const mongoose = require('mongoose');

const ShortUrl = require('./models/shortUrl');

const app = express();

mongoose.connect('mongodb://localhost/urlShortner', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ urlencoded: false }));

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrl', async (req, res) => {
  await ShortUrl.create({ fullUrl: req.body.fullUrl });
  res.redirect('/');
});

app.post('/remove/:_id', async (req, res) => {
  const id = req.params._id;
  await ShortUrl.findOne({ id: id }).deleteOne().exec();
  res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ shortUrl: req.params.shortUrl });
  if (shortUrl === null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.fullUrl);
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Listening on port 5000');
});
