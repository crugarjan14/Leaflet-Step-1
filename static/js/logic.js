// USGS API link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

// Set the size
function markerSize(mag) {
  return mag * 30000;
}

// Set the colours
function markerColor(mag) {
  if (mag <= 1) {
      return "#77ff33";
  } else if (mag <= 2) {
      return "#d2ff4d";
  } else if (mag <= 3) {
      return "#ffff66";
  } else if (mag <= 4) {
      return "#ffd700";
  } else if (mag <= 5) {
      return "#ff6600";
  } else {
      return "#e60000";
  };
}

// GET request 
d3.json(link, function(data) {
  // Send the object from data.features to createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
  // Function to run once for each feature in the features array
  // Pop-up description of when and where an earthquake occurred
 onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, latlong) {
      return new L.circle(latlong,
        {radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        fillOpacity: 1,
        stroke: false,
    })
  }
  });
    


  // Earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Satellite and dark map layers
  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // BaseMaps object to hold base layers
  var baseMaps = {
    "Satellite Map": satellitemap,
    "Dark Map": darkmap
  };

  // Overlay object to hold the overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map, render the satellitemap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [31.57853542647338,-99.580078125],
    zoom: 3,
    layers: [satellitemap, earthquakes]
  });

  // Layer control
  // Pass to baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Legend section

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [0, 1, 2, 3, 4, 5];
  
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' + 
      + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
      }
  
      return div;
  };
  
  legend.addTo(myMap);

}



  