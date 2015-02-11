var slideMapButtonVisibility = 0;
var panelToChange;
var MyCurrentLatitude = 0;
var MyCurrentLongitude = 0;
var myUser = {UserName: "", UserEmail: "", UserIdToSignUp: 0, UserImageURL: "", IsSignedIn: 0};
var MainMapObjFlag = 0;

function onLoad() {
        document.addEventListener("deviceready", onDeviceReady, false);
    }	
	

// wyswietla dane uzytkownika po zalogowaniu facebookiem
function setUserDecsriptionAfterSignIn() {
	document.getElementById("AccountTopBarUserName").innerHTML=(myUser.UserName);	
	document.getElementById("AccountTopBarImgElement").src=myUser.UserImageURL;
	myUser.IsSignedIn=1;
}	
	

// device APIs are available
    function onDeviceReady() {
	
		oneFacebookGetStatus();
		//google.maps.event.addDomListener(window, 'load', initialize);
		watchID = navigator.geolocation.watchPosition(onMapSuccess, onMapError, { timeout: 30000 });
    }

$(document).ready(function(){
  $(".AccountTopBarImgElement").click(function () {
		if ( $( ".AccountSetting" ).is( ":hidden" ) ) {
		$( "#googleMap" ).hide();
		$( ".AccountSetting" ).show();			
		}
		else {
			$( ".AccountSetting" ).hide();
			$( "#googleMap" ).show();
		}  
	});

});


/* API dla GOOGLE MAPS Skrypt do mapy */


function initialize() {
var myCurrentLatIng = new google.maps.LatLng(MyCurrentLatitude,MyCurrentLongitude);
    var mapOptions = {
        center: myCurrentLatIng,
        zoom: 8
    };
    MainMapObj = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
	myloc = new google.maps.Marker({
		position: myCurrentLatIng,
		map: MainMapObj,
		image: 'http://i.stack.imgur.com/orZ4x.png'
	});
	MainMapObjFlag = 1;
}
google.maps.event.addDomListener(window, 'load', initialize);



/* Koniec skryptu mapy */

// GEOLOKALIZACJA

// onSuccess Callback
//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
function onMapSuccess(position) {
    var element = document.getElementById('lokalizacjaTest');
    element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
                        'Longitude: ' + position.coords.longitude     + '<br />' +
                        '<hr />'      + element.innerHTML;
	MyCurrentLatitude=position.coords.latitude;
	MyCurrentLongitude=position.coords.longitude;
	
	if(MainMapObjFlag===1){MainMapObjFlag=2; MainMapObj.setCenter(new google.maps.LatLng(MyCurrentLatitude,MyCurrentLongitude)); }
	
	if(MainMapObjFlag===2) myloc.setPosition(new google.maps.LatLng(MyCurrentLatitude,MyCurrentLongitude));
}

// onError Callback receives a PositionError object
//
function onMapError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
