var MyCurrentLatitude = 0;
var MyCurrentLongitude = 0;
var myUser = {UserId:0, UserName: "", UserEmail: "", UserIdUsedToSignUp: 0, UserImageURL: "", IsSignedIn: 0};
var LeathingAjaxURL = "http://serek8.webatu.com/leathing.php";
var LeathingEventsAjax= "http://serek8.webatu.com/leathingEvents.php";
var MyPinId = 0;	// id pinezki ktora dodaje
var MyNewPhotoLocation = '';
function cutDomainOwnCodeFromJSON(arg){

return arg.substr(0, arg.indexOf('<!--'));
}

function getPinsNearby(){
	$.post(LeathingEventsAjax,
	{
		RequestMethodId : 13 // id:13	Id pobierania pozycji pinezek
	},
	function(data, status){
		alert('wszedlem');
		var jsonObj = JSON.parse(cutDomainOwnCodeFromJSON(data));
		alert(JSON.stringify(jsonObj));
		if((jsonObj.FeedbackAlert !== 0)) {alert('BLAD7'); }
		
			for (i = 0; i < jsonObj.FeedbackDescription ; i++) { 
				//alert(jsonObj.FeedbackObj[i].Latitude+" i= "+jsonObj.FeedbackObj[i].Longtitude);
				myMainMap.showNewPin(jsonObj.FeedbackObj[i].PinId, jsonObj.FeedbackObj[i].Latitude, jsonObj.FeedbackObj[i].Longtitude);
			}
	});
}



function onLoad() {
        document.addEventListener("deviceready", onDeviceReady, false);
    }	
	

// wyswietla dane uzytkownika po zalogowaniu facebookiem oraz odczytuje jego UserId
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
			getPinsNearby();
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
				getPinsNearby();
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
		myMainMap.MapInitialize();
		watchID = navigator.geolocation.watchPosition(onWatchPositionSuccess, onWatchPositionError, { maximumAge: 1000, timeout: 5000, enableHighAccuracy: true });
    }

	
$(document).on("pagecreate","#pageone",function(){
	$("#addNewLeathDiv").on("tap",function(){
		//alert('koordtnaty:'+MyCurrentLatitude+" i= "+MyCurrentLongitude);
		navigator.camera.getPicture(onCameraSuccess,
			function(message) { alert('get picture failed'); },
			{ quality: 50, 
				destinationType: navigator.camera.DestinationType.FILE_URI/*,
				sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY*/ }
			);
	});
});


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *  * * */
/*  pagecreate		#pagethree	(strony dodawania pinezki)				*/
/*																		*/
/* Funckje jQuery po zaladowaniu #pagethree (strony dodawania pinezki)	*/
/*																		*/
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *  * */
$(document).on("pagecreate","#pagethree",function(){
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *  * */
	/*  onTap	addNewLeathImg3		#pagethree						*/
	/*																*/
	/*	Funkcja wysyła wszystkie dane z form przez Ajax				*/
	/*	a nastepnie laduje zdjecie na serwer pod nazwa				*/
	/*	PinId.jpg													*/
	/*																*/
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *  * */
	$("#addNewLeathImg3").on("tap",function(){		
		$.post(LeathingEventsAjax,
			{
				RequestMethodId : 11, // id dodawania nowej pinezki 
				UserId : myUser.UserId,
				PinDescription: $('#FormEventDescription').val(),
				PinOptions: getRadioValue('FormShareOption'),
				PinLatitude: MyCurrentLatitude*10000000,		// 10^7
				PinLongtitude: MyCurrentLongitude*10000000
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
var myMainMap = {
	MainMapObj : 0,
	MainMapObjFlag : 0,	// Uzywam do sprawdzania czy googleMaps sie juz zaladowalo
	myloc: 0,	// marker mojej lokalizacji
	
	MapInitialize : function() {
	
		var myCurrentLatIng = new google.maps.LatLng(MyCurrentLatitude,MyCurrentLongitude);
		var mapOptions = {
			center: myCurrentLatIng,
			zoom: 15
		};
		this.MainMapObj = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
		this.myloc = new google.maps.Marker({
			position: myCurrentLatIng,
			map: this.MainMapObj,
			icon: 'res/icon/maps/myloc.png'
		});
		this.MainMapObjFlag = 1;
	},
	
	showNewPin : function(Latitude, Longitude, PinId) {
		var marker = new google.maps.Marker({
		position: new google.maps.LatLng((Latitude/10000000),(Longitude/10000000)), // bo w bazie danych jest 10^7
		map: this.MainMapObj
		});
		//marker.addListener('click', function(){moveToPinPreview(PinId);});
	}
	
};

function moveToPinPreview(PinId)
{
alert(PinId);

}



//google.maps.event.addDomListener(window, 'load', initialize);


// GEOLOKALIZACJA

// onSuccess Callback
//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
function onWatchPositionSuccess(position) {
	MyCurrentLatitude=position.coords.latitude;
	MyCurrentLongitude=position.coords.longitude;
	
	if(myMainMap.MainMapObjFlag===1){myMainMap.MainMapObjFlag=2; myMainMap.MainMapObj.setCenter(new google.maps.LatLng(MyCurrentLatitude,MyCurrentLongitude)); }
	
	if(myMainMap.MainMapObjFlag===2) myMainMap.myloc.setPosition(new google.maps.LatLng(MyCurrentLatitude,MyCurrentLongitude));
}

// onError Callback receives a PositionError object
//
function onWatchPositionError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}


// Wysylanie fotografi przy tworzeniu nowej pinezki

function uploadPhoto() {
            
	/* zakomentowane zeby nie zrzeralo transferu
	var options = new FileUploadOptions();
	options.fileKey="file";
	options.fileName=MyPinId+".jpeg";
	options.mimeType="image/jpeg";

	var params = {RequestMethodId : 12};		//RequestMethodId:12 id ladowania pliku
	options.params = params;

	var ft = new FileTransfer();
	ft.upload(MyNewPhotoLocation, LeathingEventsAjax, win, fail, options);
	*/
}

function win(r) {
	alert("Code = " + r.responseCode);
	alert("Response = " + cutDomainOwnCodeFromJSON(r.response));
	alert("Sent = " + r.bytesSent);
}

function fail(error) {
	alert("An error has occurred: Code = " + error.code);
	alert("upload error source " + error.source);
	alert("upload error target " + error.target);
}



function getRadioValue(theRadioGroup)
{
    var elements = document.getElementsByName(theRadioGroup);
    for (var i = 0, l = elements.length; i < l; i++)
    {
        if (elements[i].checked)
        {
            return elements[i].value;
        }
    }
}

