const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const path = require('path');
const app = express();
const hbs = require('hbs');

// Remember to paste here your credentials
let clientId = '67c997edad514e7f85c1969ef49b6f08',
    clientSecret = '47a4e5549da64338b43ee9774d8f10ca';

let spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res, exit)=>{
  res.render('home');
});

app.get('/artists', (req, res, next) => {
  let artistSearch = req.query.artist

  // console.log("--> artistsSearch: ", artistSearch)

  spotifyApi.searchArtists(artistSearch)
    .then(data => {
      let artists = data.body.artists.items
      // console.log("--> artists: ", artists)
      res.render('artists', {artists} );
    })
    .catch(err => {
      console.log(err)
    })
});

app.get('/artists/:artistID/albums', (req, res, exit)=>{
  let artistID = req.params.artistID;

  spotifyApi.getArtistAlbums(artistID)
    .then(data => {
      let albums = data.body.items
      // console.log("--> data: ", albums)
      res.render('albums', {albums} );
    })
    .catch(err => {
      console.log(err)
    })
});

app.get('/artists/:artistID/albums/:albumID', (req, res, next) => {
  
  let albumID = req.params.albumID
   console.log("--> albumID: ", albumID)
  
  spotifyApi.getAlbum([albumID])
    .then(data => {
      let tracks = data.body.tracks.items
      console.log('tracks ######################: ', tracks)
      res.render('tracks', {tracks} );
    })
    .catch(err => {
      console.log(err)
    })
});
app.listen(3000, () => {console.log('server up')});