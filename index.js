

// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken = 'pk.eyJ1Ijoicm95eGlhbyIsImEiOiJjbHRoeXNmNnYwYWFzMmlvMXJ5bXRtaHZuIn0.7wuCPxXiZeN9KyF8oAKPFg'; 
const map = new mapboxgl.Map({
  container: 'map',
  // Replace YOUR_STYLE_URL with your style URL.
  style: 'mapbox://styles/royxiao/cltktgs8900qi01r57npa48jp', 
  center: [-114.05, 51.02],
  zoom: 10.7
});



fetch('https://raw.githubusercontent.com/chshxiao/ENGO551-Lab4/master/features.geojson')
.then(response => response.json())
.then(data => {
  map.on('load', ()=> {


  /*
  Add data and layers of the incidents in two layers: cluster and unclustered-points
  The data comes from fetch API heading Github repository
  */
    map.addSource('incidents', {
      type: 'geojson',
      // data: 'https://api.mapbox.com/datasets/v1/royxiao/cltma5nnl67jc1us4wdzkdqjf/features' + 
      //       '?access_token=pk.eyJ1Ijoicm95eGlhbyIsImEiOiJjbHRoeXNmNnYwYWFzMmlvMXJ5bXRtaHZuIn0.7wuCPxXiZeN9KyF8oAKPFg',
      data: data,
      cluster:  true,
      clusterMaxZoom: 14,
      clusterRadius: 50
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
        ],
        'circle-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0.5
        ]
      },
      layout: {
        'visibility': 'visible'
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
        'text-size': 12,
        'visibility': 'visible'
      }
    });
  
    map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'incidents',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#d51b21',
        'circle-radius': 5,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      },
      layout: {
        'visibility': 'visible'
      }
    });


    /**
    The function to toggle layers on
    Used in refresh button and function toggleOnAndOff
    */
    function toggleOn() {
      map.setLayoutProperty(
        'clusters',
        'visibility',
        'visible'
      );

      map.setLayoutProperty(
        'unclustered-point',
        'visibility',
        'visible'
      );

      map.setLayoutProperty(
        'cluster-count',
        'visibility',
        'visible'
      );
    }


    /*
    The function to toggle layers on and off
    Used in layer button and refresh button
    */
    function toggleOnAndOff() {
      // get the visibility properties of layers
      const cluster_visibility = map.getLayoutProperty(
        'clusters',
        'visibility'
      );

      const uncluster_visibility = map.getLayoutProperty(
        'unclustered-point',
        'visibility'
      );

      const cluster_num_visibility = map.getLayoutProperty(
        'cluster-count',
        'visibility'
      )

      // toggle off the layers if any of the layer is visible
      if (cluster_visibility === 'visible' || uncluster_visibility === 'visible' || cluster_num_visibility === 'visible')
      {
        map.setLayoutProperty(
          'clusters',
          'visibility',
          'none'
        );

        map.setLayoutProperty(
          'unclustered-point',
          'visibility',
          'none'
        );

        map.setLayoutProperty(
          'cluster-count',
          'visibility',
          'none'
        );
      } else {
        map.setLayoutProperty(
          'clusters',
          'visibility',
          'visible'
        );

        map.setLayoutProperty(
          'unclustered-point',
          'visibility',
          'visible'
        );

        map.setLayoutProperty(
          'cluster-count',
          'visibility',
          'visible'
        );
      }
    };


    /*
    the interaction with the button to toggle layers on and off
    */
    map.on('idle', () => {
      
      // If these two layers were not added to the map, abort
      if (!map.getLayer('clusters') || !map.getLayer('unclustered-point')) {
        return;
      }

      document.querySelector('#layerButton').onclick = function () {
        toggleOnAndOff();
      }

      // // Enumerate ids of the layers.
      // const toggleableLayerIds = ['contours', 'museums'];

      // // Set up the corresponding toggle button for each layer.
      // for (const id of toggleableLayerIds) {

      //   // Skip layers that already have a button set up.
      //   if (document.getElementById(id)) {
      //     continue;
      //   }

      //   // Create a link.
      //   const link = document.createElement('a');
      //   link.id = id;
      //   link.href = '#';
      //   link.textContent = id;
      //   link.className = 'active';

      //   // Show or hide layer when the toggle is clicked.
      //   link.onclick = function (e) {
      //     const clickedLayer = this.textContent;
      //     e.preventDefault();
      //     e.stopPropagation();

      //     const visibility = map.getLayoutProperty(
      //       clickedLayer,
      //       'visibility'
      //     );

      //     // Toggle layer visibility by changing the layout object's visibility property.
      //     if (visibility === 'visible') {
      //       map.setLayoutProperty(clickedLayer, 'visibility', 'none');
      //       this.className = '';
      //     } else {
      //       this.className = 'active';
      //       map.setLayoutProperty(
      //         clickedLayer,
      //         'visibility',
      //         'visible'
      //       );
      //     }
      //   };
      // }
    });


    //refresh the page when the user clicks the refresh button
    map.on('idle', () => {
      document.querySelector('#refreshButton').onclick = function () {
        // set the default view
        map.setCenter([-114.05, 51.02]);
        map.setZoom(10.7);
        
        // set the layers back to visible
        toggleOn();
      }
    })


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
  
    // points to the features with mouse hover
    let feature_id;

    map.on('mouseenter', 'clusters', (e) => {
      map.getCanvas().style.cursor = 'pointer';

      // update the features to a hover state
      if (e.features.length > 0) {
        feature_id = e.features[0].id;                  // point the feature_id to the hovered feature
        map.setFeatureState({
          source: 'incidents',
          id: feature_id,
        },
        {
          hover: true,
        });
      } 
    });
    map.on('mouseleave', 'clusters', () => {
      map.getCanvas().style.cursor = '';

      // update the features to a hover state
      map.setFeatureState({
        source: 'incidents',
        id: feature_id,
      },
      {
        hover: false,
      });
      feature_id = null;                             // null the feature id
    });
  
    map.on('mouseenter', 'unclustered-point', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'unclustered-point', () => {
      map.getCanvas().style.cursor = '';
    });


  });





})



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

