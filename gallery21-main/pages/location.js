// pages/location.js
//import '../styles/global.css'; // If location.js is in pages/location/
import Head from 'next/head';
import { useEffect } from 'react';

export default function Location() {
  useEffect(() => {
    // Ensure Leaflet is only loaded on the client side
    if (typeof window !== 'undefined') {
      const L = require('leaflet');

      const map = L.map('map').setView([33.523778, 73.149278], 16.5);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      }).addTo(map);

      const greenIcon = L.icon({
        iconUrl: '/assets/icon-location.svg',
        iconSize: [52, 64], // size of the icon
        iconAnchor: [26, 64], // point of the icon which will correspond to marker's location
      });

      L.marker([33.523778, 73.149278], { icon: greenIcon }).addTo(map);

      const popup = L.popup();

      function onMapClick(e) {
        popup
          .setLatLng(e.latlng)
          .setContent('You clicked the map at ' + e.latlng.toString())
          .openOn(map);
      }

      map.on('click', onMapClick);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Our Location - Gallery21</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
          integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
          crossOrigin=""
        />
      </Head>
      <main className="bg">
        <div id="map" style={{ height: '500px' }}></div>
        <section className="container">
          <div className="btn-2">
            <a className="btn-link" href="./frontpg_location">Our Location</a>
            <a className="arrow-right" href="./frontpg_location">
              <img src="./assets/icon-arrow-left.svg" alt="Arrow Button" />
            </a>
          </div>
          <div className="address location-block">
            <h1 className="heading-l white">Our location</h1>
            <div className="address-list">
              <h2 className="heading-s brown">Orchard Road</h2>
              <div>
                <p>Sector C</p>
                <p>DHA Phase II</p>
                <p>Islamabad</p>
              </div>
              <p>
                Gallery21 is free to all visitors and open seven days a week
                from 8am to 6pm. Find us at 21 Orchard Rd, Sector C DHA Phase
                II, Islamabad, Islamabad Capital Territory.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
