

var map, marker;
var markers = [];


var ViewModel = {
    //var self = this;

    init: function() {
        // This Map constructor creates a new Map.

        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 17.361555,
                lng: 78.474666
            },
            zoom: 11,
            mapTypeControl: false
        });
        locationsView.init();

        var requestTimeout = setTimeout(function(){
            // $wikiElem.text("failed to get wikipedia resources.");
            console.log("failed to get resources");
        }, 8000);

        var fsquare_id = 'K3QM5R5HR0FLEUVDY2EU5PWVXL5TAGAC2EAKLVJ5UVZHSSDA';
        var fsquare_secret = 'BU5ATIO30ETMIMAUGWVCXLBZGIMDQJAZ1ASLKT5NVURXS01W';
    },

    requestAJAX: function() {
        model.forEach(function(item){
            $.ajax({
                url: 'https://api.foursquare.com/v2/venues/explore',
                dataType: 'jsonp',
                type: "GET",
                cache: 'false',
                data: 'limit=1&ll=' + item.location.lat + ',' + item.location.lng + '&query=' + item.title + '&client_id=' + fsquare_id + '&client_secret=' + fsquare_secret + '&v=20140806&m=foursquare',
            }).done(function(data){
                item.rating = data.response.groups[0].items[0].venue.rating;
                console.log(data);
                if (!item.rating) {
                    item.rating = 'No rating in foursquare';
                }
                infowindow.open(map, marker);
                marker.content = '<br><div class="labels">' + '<div class="title">' + item.title + '</div><div class="rating">Foursquare rating: ' + item.rating + '</div><p>' + item.description + '</p>' + '<a href=' + item.URL + '>' + item.URL + '</a>' + '</div>';


                clearTimeout(requestTimeout);
            });
        });
    },


    // This function takes in a color, and then creates a new marker icon of that color.
    makeMarkerIcon: function(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(22, 35), // 22 px wide by 35 px high.
            new google.maps.Point(0, 0), // origin to (0,0)
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    },

    // This function takes the input value in the find nearby area text input
    // locates it, and then zooms into that area. This is so that the user can
    // show all listings, then decide to focus on one area of the map.
    zoomToArea: function() {
        // Initialize the geocoder.
        var geocoder = new google.maps.Geocoder();
        // Get the address or place that the user entered.
        var address = document.getElementById('zoom-to-area-text').value;
        // Make sure the address isn't blank.
        if (address === '') {
            window.alert('You must enter an area, or address.');
        } else {
            // Geocode the address/area entered to get the center. Then, center the map
            // on it and zoom in
            geocoder.geocode({
                address: address,
                componentRestrictions: {
                    locality: 'Hyderabad'
                }
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    map.setZoom(15);
                } else {

                  window.alert('We could not find that location - try entering a more' +
                        ' specific place.');
                }
            });
        }
    },

    // This function populates the infowindow when the marker is clicked.
    populateInfoWindow: function(marker, infowindow) {
        // Checking the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map, marker);

            ViewModel.requestAJAX();
            // clearing the marker property if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    },

    // looping through the markers array and displaying them.
    showListings: function() {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0, len = markers.length; i < len; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    },

    // loop through the listings and hiding them.
    hideListings: function() {
        for (var i = 0, len = markers.length; i < len; i++) {
            markers[i].setMap(null);
        }
    },

    toggleBounce: function() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }
};

