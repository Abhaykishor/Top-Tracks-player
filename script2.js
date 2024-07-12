const artists = [
    { name: 'Taylor Swift', id: '159260351' },
    { name: 'Ed Sheeran', id: '183313439' },
    { name: 'Arijit Singh', id: '1326575456' }
];
const playlist = document.getElementById('playlist');
const audioPlayer = document.getElementById('audio-player');

function fetchArtistTopTracks(artist, elementId) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(artist.name)}&entity=song&limit=5`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayArtistTopTracks(data.results, elementId, artist.name);
        })
        .catch(error => console.error('Error:', error));
}

function displayArtistTopTracks(tracks, elementId, artistName) {
    const artistSection = document.getElementById(elementId);
    
    if (tracks.length === 0) {
        artistSection.innerHTML = `<h2>${artistName}</h2><p>No tracks found.</p>`;
        return;
    }

    const artistImage = tracks[0].artworkUrl100.replace('100x100', '300x300');

    artistSection.innerHTML = `
        <h2>${artistName}</h2>
        <img src="${artistImage}" alt="${artistName}" />
        <h3>Top Tracks:</h3>
        <ul>
            ${tracks.map(track => `
                <li data-preview="${track.previewUrl}" data-track-name="${track.trackName}" data-artist-name="${track.artistName}" data-artwork-url="${track.artworkUrl100}">
                    ${track.trackName} - ${track.collectionName}
                </li>
            `).join('')}
        </ul>
    `;

    artistSection.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => addToPlaylist(li.dataset));
    });
}

function addToPlaylist(trackData) {
    const li = document.createElement('li');
    li.innerHTML = `
        <img src="${trackData.artworkUrl}" alt="${trackData.trackName} cover" width="50">
        <span>${trackData.trackName}</span> - <span>${trackData.artistName}</span>
    `;
    li.addEventListener('click', () => playTrack(trackData.preview));
    playlist.appendChild(li);
}

function playTrack(previewUrl) {
    audioPlayer.src = previewUrl;
    audioPlayer.play();
}

artists.forEach((artist, index) => {
    fetchArtistTopTracks(artist, `artist${index + 1}`);
});