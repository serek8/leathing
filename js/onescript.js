var slideMapButtonVisibility = 0;
var panelToChange;

var myUser = {UserName: "", UserEmail: "", UserIdToSignUp: 0, UserIsSet:0, UserImageURL:"", UserIsPictureSet:0};


function onLoad() {
        document.addEventListener("deviceready", onDeviceReady, false);
    }
	
	
function GetUserPicture()
{
	apiGetPicture();
		/* * * * * * * * * SABLON * * * * * * * * * * * * * * * * * * * * * * */
	/* checkVariable(FinalFunction_obj) -> UWAGA ZMIEN WARTOSCI PRZY 'if' */
		function checkVariable() {
			if(myUser.UserIsPictureSet==1)		
			{ document.getElementById("accountImgElement").src=myUser.UserImageURL; alert(myUser.UserImageURL);} 
			else {setTimeout(checkVariable,100); }
		}
		checkVariable();
	/* Koniec checkVariable */
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
}
	
	
	
function GetSomeInfoAboutUser()
{
	apiTest();
	/* * * * * * * * * SABLON * * * * * * * * * * * * * * * * * * * * * * */
	/* checkVariable(FinalFunction_obj) -> UWAGA ZMIEN WARTOSCI PRZY 'if' */
		function checkVariable() {
			if(myUser.UserIsSet==1)		{ alert('Wypisuje info'); document.getElementById("AccountTopBarUserName").innerHTML=myUser.UserName; GetUserPicture();} 
			else {setTimeout(checkVariable,100); }
		}
		checkVariable();
	/* Koniec checkVariable */
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

}
		
function SignInWhenNotSignedIn(){
	login();
	/* * * * * * * * * SABLON * * * * * * * * * * * * * * * * * * * * * * */
	/* checkVariable(FinalFunction_obj) -> UWAGA ZMIEN WARTOSCI PRZY 'if' */
		function checkVariable() {
			if(myCurrentStatus=="connected")		{ alert('Zalogowany'); GetSomeInfoAboutUser();} 
			else {setTimeout(checkVariable,100); }
		}
		checkVariable();
	/* Koniec checkVariable */
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
}
	


// device APIs are available
    function onDeviceReady() {
	
		/* Sprawdzam czy uzytkownik sie zalogowal i przypisuje		*/
		/*  wynik zmiennej 'myCurrentStatus' sa mozliwe				*/
		/*  dwie wartosci tej zmiennej: 'connected' i 'undefinied'	*/
		getStatus(); 
		
		/* * * * * * * * * SABLON * * * * * * * * * * * * * * * * * * * * * * */
		/* checkVariable(FinalFunction_obj) -> UWAGA ZMIEN WARTOSCI PRZY 'if' */
			function checkVariable() {
				if(myCurrentStatus=="connected")		{ alert('Zalogowany'); GetSomeInfoAboutUser();} 
				else if(myCurrentStatus=="unknown")	{ alert('Bede logowal'); SignInWhenNotSignedIn(); }
				else {setTimeout(checkVariable,100); }
			}
			checkVariable();
		/* Koniec checkVariable */
		/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
		
		
    }

$(document).ready(function(){
  $(".slidebutton").click(function(){
	panelToChange="#panel"+(this.id);
	
    if(slideMapButtonVisibility == 0){
		$(panelToChange).slideDown("slow");
		slideMapButtonVisibility=1;
	}
	else{
	$(panelToChange).slideUp("slow");
	slideMapButtonVisibility = 0;
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