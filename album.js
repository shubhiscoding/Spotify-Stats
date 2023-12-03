async function getArtisturl() {
  const ch = document.getElementById('artist_name_search').value;
  if (!ch) {
    return document.getElementById('artist').value.toString();
  } else {
    const name = document.getElementById('artist_name_search').value;
    const urlID = 'https://api.spotify.com/v1/search?q=' + name;
    const url = urlID + '&type=artist&market=IN&include_external=audio';

    const clientId = "827b37123b254ddfa210f3c730739654";
    const clientSecret = 'f50082f5547f47dfa555c117f9e2e396';

    try {
      const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
        },
        body: 'grant_type=client_credentials',
      });

      const data = await result.json();

      const response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + data.access_token,
        },
      });

      const artistData = await response.json();

      if (artistData.artists && artistData.artists.items && artistData.artists.items[0] && artistData.artists.items[0].external_urls && artistData.artists.items[0].external_urls.spotify) {
        //document.getElementById('url').innerText = artistData.artists.items[0].external_urls.spotify;
        return artistData.artists.items[0].external_urls.spotify;
      } else {
        console.error('Error: Unable to retrieve artist URL');
        return null; // or handle this case accordingly
      }
    } catch (error) {
      console.error('Error fetching artist data:', error);
      return null; // or handle this case accordingly
    }
  }
}

async function getAlbum() {
    try {
      const IDurl = await getArtisturl();
      const ID = IDurl.split('/')[4];
      const newID = ID.split('?')[0];
      const urlh = 'https://api.spotify.com/v1/artists/' + newID;
      console.log(urlh);
      const url2 = urlh + '/top-tracks?market=US';
      const clientId = "827b37123b254ddfa210f3c730739654";
      const clientSecret = 'f50082f5547f47dfa555c117f9e2e396';
  
      const token = await getAccessToken(clientId, clientSecret);
  
      const response = await fetch(url2, {
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });
  
      const data = await response.json();
      console.log(data);
      document.getElementById('top_albums').style.backgroundColor = 'rgb(50 222 176)';
      document.getElementById('artist').style.backgroundColor = '#fff'
      document.getElementById('artist_name_search').style.backgroundColor = '#fff'
      document.getElementById('artist').style.color = 'rgb(7,7,7)'
      document.getElementById('artist_name_search').style.color = 'rgb(7,7,7)'
      document.getElementById('body').style.background = 'linear-gradient(rgb(7, 7, 7), rgb(57 160 174))';
      document.getElementById('top_albums').style.boxShadow = '5px 5px 5px rgba(74, 73, 73, 0.5), -6px -6px 5px rgba(218, 103, 103, 0.5)';
      document.getElementById('output').style.backgroundColor = '#32dade';
      document.getElementById('output').style.boxShadow = '5px 5px 5px rgba(196, 190, 190, 0.5), -5px -5px 5px rgba(137, 58, 58, 0.5)';
      document.getElementById('output').style.border = '1px solid #ccc';

      document.getElementById('top_albums').innerHTML = 
      `<span id="album">Artist's Top Album:</span> 
        <div id="albumimg">
              <a href="${data.tracks[0].album.external_urls.spotify}" target="_blank">
                <img src="${data.tracks[0].album.images[0].url}" width="60%"></img> 
                <span id="spotify_link"><img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Black.png" width="60vw"></img></span>
              </a>
              <span id="album_name">Album name: <i>${data.tracks[0].album.name}</i></span>
          </div>
          <div class="album_info">
          <span id="release_date">Release on Spotify: ${data.tracks[0].album.release_date}</span>
          <span id="total_tracks">Total tracks: ${data.tracks[0].album.total_tracks}</span>
        </div>`;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  async function getAccessToken(clientId, clientSecret) {
    try {
      const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
        },
        body: 'grant_type=client_credentials',
      });
  
      const data = await result.json();
      return data.access_token;
    } catch (error) {
      throw new Error('Error fetching access token:', error);
    }
  }
  
  document.getElementById('btn').addEventListener('click', getAlbum);
  
