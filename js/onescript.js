var MyCurrentLatitude = 0;
var MyCurrentLongitude = 0;
var myUser = {UserId:0, UserName: "", UserEmail: "", UserIdUsedToSignUp: 0, UserImageURL: "", IsSignedIn: 0};
var MainMapObjFlag = 0; // Uzywam do sprawdzania czy googleMaps sie juz zaladowalo
var LeathingAjaxURL = "http://serek8.webatu.com/leathing.php";
var LeathingEventsAjax= "http://serek8.webatu.com/leathingEvents.php";
var MyPinId = 0;
var MyNewPhotoLocation = '';
function cutDomainOwnCodeFromJSON(arg){

return arg.substr(0, arg.indexOf('<!--'));
}

function onLoad() {
        document.addEventListener("deviceready", onDeviceReady, false);
    }	
	

// wyswietla dane uzytkownika po zalogowaniu facebookiem
function setUserDecsriptionAfterSignIn() {
	document.getElementById("AccountTopBarUserName").innerHTML=(myUser.UserName);	
	document.getElementById("AccountTopBarImgElement").src=myUser.UserImageURL;
	/**
	Wysylem zapytanie AJAX czy user o podanym UserIdUsedToSignUp istnieje
	*/
	$.post(LeathingAjaxURL,
    {
		RequestMethodId : 1, // id logowania
        UserIdUsedToSignUp: myUser.UserIdUsedToSignUp
    },
    function(data, status){
		var jsonObj = JSON.parse(cutDomainOwnCodeFromJSON(data));

		if (jsonObj.FeedbackAlert === 0){ /* id:0 Logowanie zakonczylo sie sukcsem */
			myUser.UserId=jsonObj.FeedbackObj.UserId;
			myUser.IsSignedIn=1;	// Flaga ze user jest zalogowany
		}
		else if(jsonObj.FeedbackAlert === 1) { /* id:1  Taki uzytkownik nie istnieje, podejmuje probe rejestracji*/
			$.post(LeathingAjaxURL,
			{
				RequestMethodId : 2, // id:2	Id rejestracji uzytkownika w bazie danych na serwerze
				UserIdUsedToSignUp: myUser.UserIdUsedToSignUp,
				UserName: myUser.UserName,
				UserEmail: myUser.UserEmail
			},
			function(data, status){
				var jsonObj = JSON.parse(cutDomainOwnCodeFromJSON(data));
				if((jsonObj.FeedbackAlert !== 0)) {alert('BLAD6'); }
				myUser.UserId=jsonObj.FeedbackObj.UserId;
				myUser.IsSignedIn=1;
			});
		}
		else{
			alert("Nie moglem zalogowac uzytkownika BLAD !");
		}
		
		
    });
	
}	
	

// device APIs are available
    function onDeviceReady() {
		oneFacebookGetStatus();
		MapInitialize();
		watchID = navigator.geolocation.watchPosition(onMapSuccess, onMapError, { maximumAge: 1000, timeout: 5000, enableHighAccuracy: true });
    }

	
$(document).on("pagecreate","#pageone",function(){
	$("#addNewLeathDiv").on("tap",function(){
		
										navigator.camera.getPicture(onCameraSuccess,
                                        function(message) { alert('get picture failed'); },
                                        { quality: 50, 
                                        destinationType: navigator.camera.DestinationType.FILE_URI/*,
                                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY*/ }
                                        );
	});
});

/* Stronda dodawania pinezki*/
$(document).on("pagecreate","#pagethree",function(){

	/* PO kliknieciu na addNewLeathImg3 na trzeciej stronie*/
	$("#addNewLeathImg3").on("tap",function(){		
		$.post(LeathingEventsAjax,
			{
				RequestMethodId : 11, // id dodawania nowej pinezki 
				UserId : myUser.UserId,
				PinDescription: $('#FormEventDescription').val(),
				PinOptions: $("input[name='FormShareOption']:checked", '#newLeathForm').val(),
				PinLatitude: MyCurrentLatitude,
				PinLongtitude: MyCurrentLongitude
			},
			function(data, status){
				var jsonObj = JSON.parse(cutDomainOwnCodeFromJSON(data));
		
				if (jsonObj.FeedbackAlert === 0){ /* id:0 Dodawanie zakonczylo sie sukcsem */
					MyPinId=jsonObj.FeedbackObj.PinId;
					alert(MyPinId);
					uploadPhoto();
				}
				else{
					alert("Nie moglem dodac podstawowych informacji o pinezce BLAD="+jsonObj.FeedbackAlert+" | Desc="+jsonObj.FeedbackDescription);
				}
			});
	}); 
});

function onCameraSuccess(imageURI) {	// po zrobieniu zdjecia
    var image = document.getElementById('EventPhoto');
    image.src = imageURI;
	MyNewPhotoLocation = imageURI;
	$.mobile.changePage('#pagethree', { transition: "flip"} );
}

function onCameraFail(message) {
    alert('Failed because: ' + message);
}



/* API dla GOOGLE MAPS Skrypt do mapy */


function MapInitialize() {
var myCurrentLatIng = new google.maps.LatLng(MyCurrentLatitude,MyCurrentLongitude);
    var mapOptions = {
        center: myCurrentLatIng,
        zoom: 15
    };
    MainMapObj = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
	myloc = new google.maps.Marker({
		position: myCurrentLatIng,
		map: MainMapObj,
		icon: 'res/icon/maps/myloc.png'
	});
	MainMapObjFlag = 1;
}
//google.maps.event.addDomListener(window, 'load', initialize);



/* Koniec skryptu mapy */

// GEOLOKALIZACJA

// onSuccess Callback
//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
function onMapSuccess(position) {
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


// Wysylanie fotografi przy tworzeniu nowej pinezki

        function uploadPhoto() {
            var options = new FileUploadOptions();
            options.fileKey="file";
            options.fileName=MyPinId+".jpeg";
            options.mimeType="image/jpeg";

            var params = {RequestMethodId : 12};		//RequestMethodId:12 id ladowania pliku
            options.params = params;

            var ft = new FileTransfer();
            ft.upload(MyNewPhotoLocation, LeathingEventsAjax, win, fail, options);
        }

        function win(r) {
            alert("Code = " + r.responseCode);
            alert("Response = " + r.response);
            alert("Sent = " + r.bytesSent);
        }

        function fail(error) {
            alert("An error has occurred: Code = " + error.code);
			alert("upload error source " + error.source);
            alert("upload error target " + error.target);
        }





