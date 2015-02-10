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


/* Skrypt do mapy */
var myCenter=new google.maps.LatLng(51.508742,-0.120850);
function initialize()
{
var mapProp = {
  center:myCenter,
  zoom:5,
  mapTypeId:google.maps.MapTypeId.ROADMAP
  };

var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);

var marker=new google.maps.Marker({
  position:myCenter,
  });

marker.setMap(map);
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
}

// onError Callback receives a PositionError object
//
function onMapError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
var watchID = navigator.geolocation.watchPosition(onMapSuccess, onMapError, { timeout: 30000 });