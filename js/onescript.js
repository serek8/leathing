var slideMapButtonVisibility = 0;
var panelToChange;
var MyCurrentLatitude=0, MyCurrentLongitude=0;
var myUser = {UserName: "", UserEmail: "", UserIdToSignUp: 0, UserImageURL:"", IsSignedIn:0};


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


function initialize()
{
var mapProp = {
  zoom:5,
  mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  
MainMapObj=new google.maps.Map(document.getElementById("googleMap"),mapProp);

var myloc = new google.maps.Marker({
      map: MainMapObj,
      title: 'Hello World!'
	});

// Dopiero tutaj inicjalizuje geolokalizacje zeby nie podac za wczesnie wspolrzednych

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
	
	
	MainMapObj.setCenter({lat: MyCurrentLatitude, lng: MyCurrentLongitude});
	
	myloc.setPosition({lat: MyCurrentLatitude, lng: MyCurrentLongitude});
	
	
	
}

// onError Callback receives a PositionError object
//
function onMapError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
