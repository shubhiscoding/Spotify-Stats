const artistname = document.querySelector('.artistname');
const artisturl = document.querySelector('.artisturl');
const search_btn = document.querySelector('.search_btn');
search_btn.addEventListener('click', function(){
    if(artistname.value && artisturl.value){
        window.alert("Fill Only One Field");
    }else if(artistname.value.length==0 && artisturl.value.length==0){
        window.alert("Fill Atleast One Field");
    }else{
        var url_temp="";
        var url_fun;
        if(artisturl.value){
            url_temp = String(artisturl.value);
            getArtist(url_temp);
        }
        if(artistname.value){
            url_fun = getArtisturl(artistname.value);
            url_fun.then((result)=>{
                url_temp  = result;
                getArtist(url_temp);
            })
        }
    }
});

const artist_statsbtn = document.querySelector('.artist_statsbtn');
artist_statsbtn.addEventListener('click', function(){
    var searchSection = document.getElementById('search');
    searchSection.scrollIntoView({ behavior: 'smooth' });
});
const artbtn  = document.querySelector('.artbtn');
artbtn.addEventListener('click', function(){
    var searchSection = document.getElementById('search');
    searchSection.scrollIntoView({ behavior: 'smooth' });
});

const cmprbtn = document.querySelector('.cmprbtn');
cmprbtn.addEventListener('click', function(){
    var compareSection = document.getElementById('compare');
    compareSection.scrollIntoView({ behavior: 'smooth' });
});

const compare_artistbtn = document.querySelector('.compare_artistbtn');
compare_artistbtn.addEventListener('click', function(){
    var compareSection = document.getElementById('compare');
    compareSection.scrollIntoView({ behavior: 'smooth' });
});

async function getArtisturl(x) {
    const name = x;
    console.log(name);
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
        var chk = artistData.artists.items[0].external_urls.spotify.toString();
        console.log(chk+" chk function");
        return chk;
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
async function getArtist(url_temp) {
    console.log(url_temp+" chk url");
    const ID = url_temp.split('/')[4];
    console.log(ID+" chk ID");
    const url = 'https://api.spotify.com/v1/artists/' + ID;
    console.log(url);
    const clientId = "827b37123b254ddfa210f3c730739654";
    const clientSecret = 'f50082f5547f47dfa555c117f9e2e396';
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
        accessToken().then((token) => {
        fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const output = document.querySelector(".output");
                output.innerHTML = 
                `<div class="artist_profile">
                <div class="artist_img"></div>
                <div class="artist_info">
                    <h2>${data.name}</h2>
                    <p>Followers: ${data.followers.total.toLocaleString()}</p>
                    <p>Popularity: ${data.popularity}%</p>
                    <p>Genres: <span>${data.genres.join(', ')}</span></p>
                    <p>Spotify URL: <a href="${data.external_urls.spotify}" target="_blank">Click Here</a></p>
                </div>
                </div>
                <div class="top_album">
                </div>
                <div class="piechart">
                    <div class="pie_img"></div>
                </div>`
                const profimg = document.querySelector(".artist_img");
                const img = data.images;
                var artimg;
                var ch =0;
                for(var i=0;i<img.length;i++){
                    if(img[i].height<340){
                        if(ch<img[i].height){
                            artimg = img[i].url;
                            ch = img[i].height;
                        }
                    }
                }
                console.log(artimg+" profimg");
                profimg.innerHTML = `<a href="${data.external_urls.spotify}" target="_blank"><img src="${artimg}" alt="artist image"></a>`;

                //chart creation
                const chart = document.querySelector(".pie_img");
                chart.innerHTML = `<canvas id="myPieChart" width="100%" height="100%"></canvas>
                <h3 style="margin-top:1%">Popularity in Spotify</h3>`;
                const chartimg = document.getElementById('myPieChart');
                const artist_name = data.name;
                var ctx = document.getElementById('myPieChart').getContext('2d');
                // Define the data for the pie chart
                var data = {
                  labels: [artist_name, 'Others'],
                  datasets: [{
                    data: [data.popularity, 100-data.popularity], // Values for each slice
                    backgroundColor: ['#9cd8fe', '#4c3a32']
                  }]
                };
              
                // Create the pie chart
                var myPieChart = new Chart(ctx, {
                  type: 'pie',
                  data: data
                });
            })
            .catch(error => {
                console.error('Error fetching artist data:', error);
            });
        }).then(()=>{
        accessToken().then((token)=>{
            var url2 = url + '/top-tracks?market=US';
            fetch(url2, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            }).then(response2 => response2.json())
            .then(data2 => {
                console.log(data2);
                const top_album = document.querySelector(".top_album");
                top_album.innerHTML = `                    <div class="album_img"></div>
                <div class="album_info">
                    <h2>${data2.tracks[0].album.name}</h2>
                    <p>Release Date: ${data2.tracks[0].album.release_date}</p>
                    <p>Popularity: ${data2.tracks[0].popularity}%</p>
                    <p>No. Of Tracks: ${data2.tracks[0].album.total_tracks}</p>
                    <p>Spotify URL: <a href="${data2.tracks[0].album.external_urls.spotify}" target="_blank">Click Here</a></p>
                </div>`;
                const albumimg = document.querySelector(".album_img");
                const img2 = data2.tracks[0].album.images;
                var albmimg;
                var ch2=0;
                for(var i =0; i<img2.length;i++){
                    if(img2[i].height<340){
                        if(ch2<img2[i].height){
                            albmimg = img2[i].url;
                            ch2 = img2[i].height;
                        }
                    }
                }
                albumimg.innerHTML = `<a href="${data2.tracks[0].album.external_urls.spotify}" target="_blank">
                                        <img src="${albmimg}" alt="album image"></a>`;
            }).catch(error => {
                console.error('Error fetching artist data:', error);
            });
        })
    });
}

const artist1 = document.querySelector('.artist1');
const artist2 = document.querySelector('.artist2');
const compare_btn = document.querySelector('.compare_btn');
compare_btn.addEventListener('click', function(){
    var artist1url;
    var artist2url;
    if(artist1.value && artist2.value){
        var val1 = artist1.value;
        var val2 = artist2.value;
        if(val1.includes("https://open.spotify.com/artist/")){
            console.log(val1);
        }else{
            const output = document.querySelector("#cmprout");
            artist1url = getArtisturl(val1);
            artist1url.then((result)=>{
                popularity(result, output, "chart1");
                return getArtisturl(val2);
            }).then((result)=>{
                popularity(result, output, "chart2");
            });
        }
    }else{
        window.alert("Fill Both Fields");
    }
});

async function popularity(url_inp, x, y){
    let ret;
    console.log(url_inp+" chk url");
    const ID = url_inp.split('/')[4];
    console.log(ID+" chk ID");
    const url = 'https://api.spotify.com/v1/artists/' + ID;
    console.log(url);
    const clientId = "827b37123b254ddfa210f3c730739654";
    const clientSecret = 'f50082f5547f47dfa555c117f9e2e396';
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
    accessToken().then((token)=>{
        fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            const chk = document.getElementsByClassName(y);
            if(chk.length==0){
                markechart(data.popularity, x, y, data.name);
            }else{
                x.removeChild(document.querySelector(".chart2"));
                x.removeChild(document.querySelector(".chart1"));
                markechart(data.popularity, x, y, data.name);
            }
        });
        return ret;
    });
    return ret;
}

function markechart(popularity, x, y, name){
        const chart = document.createElement('div');
        chart.className = y;
        x.appendChild(chart);
        //chart creation
            chart.innerHTML = `
            <h1>${name}</h1>
            <canvas id="${y}" width="100%" height="100%"></canvas>
            <h3 style="margin-top:1%">Popularity in Spotify</h3>`;
            console.log(x);
            const artist_name = name;
            var ctx = document.getElementById(y).getContext('2d');
        // Define the data for the pie chart
            var data = {
                labels: [artist_name, 'Others'],
                datasets: [{
                data: [popularity, 100-popularity], // Values for each slice
                backgroundColor: ['#9cd8fe', '#4c3a32']
                }]
            };
            
        // Create the pie chart
            var myPieChart = new Chart(ctx, {
                type: 'pie',
                data: data
            });
}