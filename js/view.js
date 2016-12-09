var locationsView = {

    init: function() {
        // Create a new array for all the listing markers.

        var largeInfowindow = new google.maps.InfoWindow();
        var defaultIcon = ViewModel.makeMarkerIcon('1D97C4');
        // Highlighting the marker when the user mouses over.
        var highlightedIcon = ViewModel.makeMarkerIcon('AAE12C');

        // this for loop creates an array of markers on initialization.
        for (var i = 0, len = model.length; i < len; i++) {
            // Get the position from the location array.
            var position = model[i].location;
            var title = model[i].title;
            // Create a marker per location, and put into markers array.
            marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                icon: defaultIcon,
                id: i
            });
            // Push the marker to our array of markers.
            markers.push(marker);

            // Two event listeners to change the colors back and forth.
            marker.addListener('mouseover', function() {
                this.setIcon(highlightedIcon);
            });
            marker.addListener('mouseout', function() {
                this.setIcon(defaultIcon);
            });
            // onclick event to open an infowindow at each marker.
            marker.addListener('click', function() {
                ViewModel.populateInfoWindow(this, largeInfowindow);
                //call ajax here
                ViewModel.requestAJAX();
                ViewModel.toggleBounce();
            });

            document.getElementById('show-locations').addEventListener('click', ViewModel.showListings);
            document.getElementById('hide-locations').addEventListener('click', ViewModel.hideListings);
        }
    }
};

var SimpleListModel = function(items) {
    this.items = ko.observableArray(items);

    //this.clickedItem = ko.observable('');

    var self = this;
    this.places = ko.observableArray(model);

    this.filter = ko.observable('');

    this.visiblePlaces = ko.computed(function(){
       return this.places().filter(function(place){
           if(!self.filter() || place.title.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1)
             return place;
       });
   },this);
}

ko.applyBindings(new SimpleListModel(model) );
