var slideMapButtonVisibility = 0;
var panelToChange;

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

MainMapObj=new google.maps.Map(document.getElementById("googleMap"),mapProp);

myloc = new google.maps.Marker({
    clickable: false,
    icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                    new google.maps.Size(22,22),
                                                    new google.maps.Point(0,18),
                                                    new google.maps.Point(11,11)),
    shadow: null,
    zIndex: 999,
    map: MainMapObj
});

// Dopiero tutaj inicjalizuje geolokalizacje zeby nie podac za wczesnie wspolrzednych
watchID = navigator.geolocation.watchPosition(onMapSuccess, onMapError, { timeout: 30000 });
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
						MainMapObj.setPosition({lat: position.coords.latitude, lng: position.coords.longitude});
}

// onError Callback receives a PositionError object
//
function onMapError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
