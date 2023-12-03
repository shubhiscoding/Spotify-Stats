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
        return artistData.artists.items[0].external_urls.spotify;
      } else {
        console.error('Error: Unable to retrieve artist URL');
        return null; // or handle this case accordingly
      }
    } catch (error) {
      console.error('Error fetching artist data:', error);
      alert('Error fetching artist data:', error);
      return null; // or handle this case accordingly
    }
  }
}


async function getArtist() {
  const IDurl = await getArtisturl();
  console.log(IDurl);
  const ID = IDurl.split('/')[4];
  const url = 'https://api.spotify.com/v1/artists/' + ID;

  const clientId = "827b37123b254ddfa210f3c730739654";
  const clientSecret = 'f50082f5547f47dfa555c117f9e2e396';
  const spotifyImg = "https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Black.png";

  const accessToken = async () => {
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
  };

  // Use the access token inside the fetch call
  accessToken()
    .then((token) => {
      fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      })
        .then(response => response.json())
        .then(data => {
          // Update your HTML elements with the retrieved data
          document.getElementById('Profile').innerHTML = `<img src="${data.images[0].url}" width="100%"></img>`;
          document.getElementById('artist_name').innerHTML = `${data.name} <a href="${data.external_urls.spotify}" target="_blank"><img src="${spotifyImg}" width="100px"></img></a>`;
          document.getElementById('followers').innerHTML = `Followers:<span class="label"> ${data.followers.total}</span>`;
          document.getElementById('popularity').innerHTML = `Popularity on Spotify:<span class="label"> ${data.popularity}%</span>`;
          document.getElementById('genres').innerHTML = `Genres:<span class="label"> ${data.genres.join(', ')}</span>`;
        })
        .catch(error => {
          console.error('Error fetching artist data:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching access token:', error);
    });
}
document.getElementById('btn').addEventListener('click', getArtist);
