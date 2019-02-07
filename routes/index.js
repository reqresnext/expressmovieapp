var express = require('express');
var router = express.Router();
const request = require('request');

const apiKey = 'cbc0eae69d9918c164750966a3bb6370';
const apiBaseUrl = "http://api.themoviedb.org/3";
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`; //maybe 3
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  request.get(nowPlayingUrl, (err, response, movieData) => {
      console.log('*****ERROR*****');
      console.log(err);
      let parsedData = JSON.parse(movieData);
      res.render('index', {
        parsedData: parsedData.results,
        title: 'Now Playing'
      });
  });
});

router.get('/movie/:id', (req, res, next) => {
  let movieId = req.params.id;
  let thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`
  // res.send(thisMovieUrl);
  request.get(thisMovieUrl, (err, response, movieData) => {
    if(err) {
      console.log(err);
    } else {
      let parsedData = JSON.parse(movieData);
      res.render('single-movie', {
        parsedData
      })
    }
  });
});

router.post('/search', (req, res, next) => {
  // res.send("Sanity check");
  let userSearchTerm = req.body.movieSearch;
  let cat = req.body.cat;
  let movieUrl = `${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`;
  request.get(movieUrl, (err, response, movieData) => {
    if(err) {
      console.log('Error ', err);
      next();
    } else {
      let parsedData = JSON.parse(movieData);
      // 
      if(cat == 'person') {
        parsedData.results = parsedData.results[0].known_for;
      }
      res.render('index', {
          parsedData: parsedData.results,
          title: `Search results for: '${userSearchTerm}'`
      });
    }
  });
});

module.exports = router;
