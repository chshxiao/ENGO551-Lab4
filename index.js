
// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken = 'pk.eyJ1Ijoicm95eGlhbyIsImEiOiJjbHRoeXNmNnYwYWFzMmlvMXJ5bXRtaHZuIn0.7wuCPxXiZeN9KyF8oAKPFg'; 
const map = new mapboxgl.Map({
  container: 'map',
  // Replace YOUR_STYLE_URL with your style URL.
  style: 'mapbox://styles/royxiao/cltktgs8900qi01r57npa48jp', 
  center: [-114.05, 51.02],
  zoom: 10.7
});


/*
Create a marker cluster to group markers
*/
map.on('load', ()=> {
  map.addSource('incidents', {
    type: 'geojson',
    data: 'https://api.mapbox.com/datasets/v1/royxiao/cltma5nnl67jc1us4wdzkdqjf/features' + 
          '?access_token=pk.eyJ1Ijoicm95eGlhbyIsImEiOiJjbHRoeXNmNnYwYWFzMmlvMXJ5bXRtaHZuIn0.7wuCPxXiZeN9KyF8oAKPFg',
    cluster:  true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  })
  
  const test = fetch('https://api.mapbox.com/datasets/v1/royxiao/cltma5nnl67jc1us4wdzkdqjf/features' + 
                      '?access_token=pk.eyJ1Ijoicm95eGlhbyIsImEiOiJjbHRoeXNmNnYwYWFzMmlvMXJ5bXRtaHZuIn0.7wuCPxXiZeN9KyF8oAKPFg')
              .then(response => response.json())
              .then(data => {
                console.log(data);
              })

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'incidents',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#51bbd6',
        100,
        '#f1f075',
        750,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        100,
        30,
        750,
        40
      ]
    }
  });

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'incidents',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  });

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'incidents',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#d51b21',
      'circle-radius': 3,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  // inspect a cluster on a click
  map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters']
    });

    const cluster_id = features[0].properties.cluster_id;
    map.getSource('incidents').getClusterExpansionZoom(
      cluster_id,
      (err, zoom) => {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom+1
        });
      }
    )
  });

  // When a click event occurs on a feature in
  // the unclustered-point layer, open a popup at
  // the location of the feature, with
  // description HTML from its properties.
  map.on('click', 'unclustered-point', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const info = e.features[0].properties['INCIDENT INFO'];
    const description = e.features[0].properties.DESCRIPTION;
    const date = e.features[0].properties.START_DT;

    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(
      `${info}<br>${description}<br>${date}`
    )
    .addTo(map);
  });

  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
  });

  map.on('mouseenter', 'unclustered-point', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'unclustered-point', () => {
    map.getCanvas().style.cursor = '';
  });
});


// /* 
// Add an event listener that runs
//   when a user clicks on the map element.
// */
// map.on('click', (event) => {
//   // If the user clicked on one of your markers, get its information.
//   const features = map.queryRenderedFeatures(event.point, {
//     layers: ['traffic-incidents'] // replace with your layer name
//   });
//   if (!features.length) {
//     return;
//   }
//   const feature = features[0];

//   /* 
//   Create a popup, specify its options 
//   and properties, and add it to the map.
//   */
//   const popup = new mapboxgl.Popup({ offset: [0, -15] })
//     .setLngLat(feature.geometry.coordinates)
//     .setHTML(
//       `<p>${feature.properties['INCIDENT INFO']}</p>`+
//       `<p>${feature.properties.DESCRIPTION}</p>`+
//       `<p>${feature.properties.START_DT}</p>`
//     )
//     .addTo(map);
// });

