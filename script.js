let artistname = document.querySelector('.artistname');
const artisturl = document.querySelector('.artisturl');
const search_btn = document.querySelector('.search_btn');
const logo = document.querySelector('.logo');
setTimeout(function(){
    if (isMobileDevice()) {
        // Code to run if the user is on a mobile device
        window.alert("Charts appear better in Desktop.");
      } else {
        // Code to run if the user is not on a mobile device
        console.log("Not a mobile device.");
      }
}, 1000);

logo.querySelector('span').addEventListener('click', function(){
    window.open(location.href, '_blank');
});
logo.querySelector('img').addEventListener('click', function(){
    window.open(location.href, '_blank');
});
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
            var searchSection = document.querySelector('.output');
            searchSection.scrollIntoView({ behavior: 'smooth' });
        }
        if(artistname.value){
            url_fun = getArtisturl(artistname.value);
            url_fun.then((result)=>{
                url_temp  = result;
                getArtist(url_temp);
                var searchSection = document.querySelector('.output');
                setTimeout(function(){
                    searchSection.scrollIntoView({ behavior: 'smooth' });
                    },700);
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
        return chk;
      } else {
        return null; // or handle this case accordingly
      }
    } catch (error) {
      console.error('Error fetching artist data:', error);
      alert('Error fetching artist data:', error);
      return null; // or handle this case accordingly
    }
}
async function getArtist(url_temp) {
    const ID = url_temp.split('/')[4];
    const url = 'https://api.spotify.com/v1/artists/' + ID;
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
                const output = document.querySelector(".output");
                output.style.visibility = "visible";
                output.innerHTML = 
                `<div class="artist_profile">
                <h3>Artist Profile</h3>
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
                <h3>Popularity in Spotify</h3>
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
                profimg.innerHTML = `<a href="${data.external_urls.spotify}" target="_blank"><img src="${artimg}" alt="artist image"></a>`;

                //chart creation
                const chart = document.querySelector(".pie_img");
                chart.innerHTML = `<h4>Popularity Percentile</h4>
                <canvas id="myPieChart" width="100%" height="100%"></canvas>`;
                const chartimg = document.getElementById('myPieChart');
                const artist_name = data.name;
                var ctx = document.getElementById('myPieChart').getContext('2d');
                // Define the data for the pie chart
                var data = {
                  labels: [artist_name, 'Others'],
                  datasets: [{
                    data: [data.popularity, 100-data.popularity], // Values for each slice
                    backgroundColor: ['white', '#092D36']
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
            const srch = document.querySelector(".search");
            srch.style.marginBottom = "10%";
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
                top_album.innerHTML = `                    
                <h3>Top Track</h3>
                <div class="album_img"></div>
                <div class="album_info">
                    <h2>${data2.tracks[0].name}</h2>
                    <p>Release Date: ${data2.tracks[0].album.release_date}</p>
                    <p>Popularity: ${data2.tracks[0].popularity}%</p>
                    <p>Explicit: ${data2.tracks[0].explicit}</p>
                    <p>Spotify URL: <a href="${data2.tracks[0].external_urls.spotify}" target="_blank">Click Here</a></p>
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
                albumimg.innerHTML = `<a href="${data2.tracks[0].external_urls.spotify}" target="_blank">
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
    var data1=[];
    if(artist1.value && artist2.value){
        var val1 = artist1.value;
        var val2 = artist2.value;
        if(val1.includes("https://open.spotify.com/artist/") && val2.includes("https://open.spotify.com/artist/")){
            popularity(val1, document.querySelector("#cmprout"), "chart1", data1).then((result)=>{
                return popularity(val2, document.querySelector("#cmprout"), "chart2", data1);
            });
        }else if(val1.includes("https://open.spotify.com/artist/") && !val2.includes("https://open.spotify.com/artist/")){
            popularity(val1, document.querySelector("#cmprout"), "chart1", data1).then((result)=>{
                return getArtisturl(val2);
            }).then((result)=>{
                popularity(result, document.querySelector("#cmprout"), "chart2", data1);
            });
        }else if(!val1.includes("https://open.spotify.com/artist/") && val2.includes("https://open.spotify.com/artist/")){
            getArtisturl(val1).then((result)=>{
                popularity(result, document.querySelector("#cmprout"), "chart1", data1);
                return popularity(val2, document.querySelector("#cmprout"), "chart2", data1);
            })
        }else{
            const output = document.querySelector("#cmprout");
            artist1url = getArtisturl(val1);
            artist1url.then((result)=>{
                popularity(result, output, "chart1", data1);
                return getArtisturl(val2);
            }).then((result)=>{
                popularity(result, output, "chart2", data1);
                return data1;
            })
        }

        var searchSection = document.querySelector('#cmprout');
        setTimeout(function(){
        searchSection.scrollIntoView({ behavior: 'smooth' });
        },100);
    }else{
        window.alert("Fill Both Fields");
    }
});

async function popularity(url_inp, x, y, arr){
    let ret;
    const ID = url_inp.split('/')[4];
    const url = 'https://api.spotify.com/v1/artists/' + ID;
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
            const chk = document.getElementsByClassName(y);
            if(chk.length==0){
                markechart(data.popularity, x, y, data.name);
                arr = storedata(data.name, data.followers.total, arr);
                if(arr.length==2){makegraph(arr);}
            }else{
                x.removeChild(document.querySelector(".chart2"));
                x.removeChild(document.querySelector(".chart1"));
                x.removeChild(document.querySelector("h2"));
                document.querySelector(".bargraph").removeChild(document.querySelector(".mybargraph"));
                markechart(data.popularity, x, y, data.name);
                arr = storedata(data.name, data.followers.total, arr);
            }
            const  cmpr = document.querySelector(".compare");
            cmpr.style.marginBottom = "2.5%";
        });
        return ret;
    });
    return ret;
}

function markechart(popularity, x, y, name){
        x.style.visibility = "visible";
        const chart = document.createElement('div');
        chart.className = y;
        x.appendChild(chart);
        const chk = document.querySelector("h2");
        //chart creation
        if(!chk){
            const h1 = document.createElement('h2');
            h1.innerHTML = "Popularity Comparison";
            x.appendChild(h1);
        }
            chart.innerHTML = `
            <h1>${name}<h3>Popularity Percentile</h3></h1>
            <canvas id="${y}" width="50%" height="50%"></canvas>`;
            const artist_name = name;
            var ctx = document.getElementById(y).getContext('2d');
        // Define the data for the pie chart
            var data = {
                labels: [artist_name, 'Others'],
                datasets: [{
                data: [popularity, 100-popularity], // Values for each slice
                backgroundColor: ['white', '#092D36']
                }]
            };
            
        // Create the pie chart
            var myPieChart = new Chart(ctx, {
                type: 'pie',
                data: data
            });
}
function storedata(name, popularity, arr){
    arr.push([name, popularity]);
    return arr;
}
function makegraph(arr){
    var dataLabels = [];
    dataLabels.push(arr[0][0]);
    dataLabels.push(arr[1][0]);
    var dataset1 = [];
    dataset1.push(arr[0][1]);
    dataset1.push(arr[1][1]);
    const bargraph = document.createElement('div');
    bargraph.className = "mybargraph";
    document.querySelector(".bargraph").appendChild(bargraph);
    bargraph.innerHTML = `
    <h2>Followers Comparison</h2>
    <canvas id="myBarChart" width="50px" height="25px"></canvas>`;
        var ctx = document.getElementById('myBarChart').getContext('2d');
        var myBarChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: dataLabels,
            datasets: [{
              label: 'Followers',
              data: dataset1,
              backgroundColor: '#9cd8fe', // Bar color
              borderColor: 'rgba(75, 192, 192, 1)', // Border color
              borderWidth: 1 // Border width
            }]
          },
          options: {
            scales: {
              x: {
                ticks: {
                  color: '#9cd8fe', // X-axis label color
                  fontSize: 30 // X-axis label font size
                },
                grid: {
                    color: '#9cd8fe' // X-axis grid line color
                  }
              },
              y: {
                ticks: {
                  color: '#9cd8fe', // Y-axis label color
                  fontSize: 30 // Y-axis label font size
                },
                grid: {
                    color: '#9cd8fe' // X-axis grid line color
                  }
              }
            }
          }
        });
}
function isMobileDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
  }
  