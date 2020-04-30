window.onload = () => {
}
var map;
var markers = [];
var infoWindow;

function initMap() {
    var Medellin = {
        lat: 6.2518401, 
        lng: -75.563591
    };

  map = new google.maps.Map(document.getElementById('map'), 
    {
        center: Medellin,
        zoom: 11,
        mapTypeId: 'roadmap',
        mapTypeControl: true,
        
    } );
    infoWindow = new google.maps.InfoWindow();
    searchStores();
  }

function searchStores(){
    var foundStores = [];
    var zipCode = window.value;
    if(zipCode){
        for(var store of stores){
            var postal = store['citylist'];
            if(postal == zipCode){
                foundStores.push(store);
            }
        }
    } else {
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function clearLocations(){
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}

function setOnClickListener(){
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem, index){
        elem.addEventListener('click', function(){
            new google.maps.event.trigger(markers[index], 'click');
        })
    })
}

function displayStores(stores){
    var storesHtml = '';
    for(var [index, store] of stores.entries()){
        var name = store['storeName'];
        var direccion = store['direcciones'];
        var idTienda = store['storeId'];
        storesHtml += `
            <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-address">
                            <span><img src ="imagenes-tiendas/${idTienda}_matt.jpg"></span>
                            <span><b>${name}</b></span>
                            <span style="font-size: 0.8em;">${direccion}</span>
                        </div>
                        </div>
                    <div class="store-number-container">
                        <div class="store-number">
                            ${index+1}
                        </div>
                    </div>
                </div>
            </div>
        `
        document.querySelector('.stores-list').innerHTML = storesHtml;
    }
}

function showStoresMarkers(stores){
    var bounds = new google.maps.LatLngBounds();
    for(var [index, store] of stores.entries()){
        var latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"]);
        var name = store["storeName"];
        var address = store["direcciones"];
        var texto = store["texto"]
        var phoneNumber = store["whatsApp"];
        bounds.extend(latlng);
        createMarker(latlng, name, address, texto, phoneNumber, index+1);
    }
    map.fitBounds(bounds);
}

function createMarker(latlng, name, address, texto, phoneNumber, index){
    var html = `
        <div class="store-info-window">

            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-status">
                ${texto}
            </div>

            <div class="store-info-address">
                <img src="resources/blackFace.png">
                ${address}
            </div>
`
;

    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      label: "",
      icon: 'resources/matt-corazon-r.png'
    });
    
    var sedecentral = {lat: 6.235342,lng: -75.572108};

    var marker2 = new google.maps.Marker({
      map: map,
      position: sedecentral,
      label: "",
      icon: 'resources/matt-central-little.png'
    });

    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
    markers.push(marker2);

}
