var slideMapButtonVisibility = 0;
var panelToChange;

var myUser = {UserName: "", UserEmail: "", UserIdToSignUp: 0, UserIsInfoReceived:0, UserImageURL:"", UserIsPictureSet:0, IsSignedIn:0};


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
			{ document.getElementById("AccountTopBarImgElement").src=myUser.UserImageURL; } 
			else {setTimeout(checkVariable,100); }
		}
		checkVariable();
	/* Koniec checkVariable */
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
}
	
function LogOutAndPrepareForSignIn()
{
logout();
	/* * * * * * * * * SABLON * * * * * * * * * * * * * * * * * * * * * * */
	/* checkVariable(FinalFunction_obj) -> UWAGA ZMIEN WARTOSCI PRZY 'if' */
		function checkVariable() {
			if(myUser.IsSignedIn==0) {
				myUser.UserName="";
				myUser.UserIsInfoReceived=0;
				myUser.UserIsPictureSet=0;
				myUser.UserIdToSignUp=0;
				myUser.UserImageURL="";
				myUser.UserEmail='';
				$( ".AccountSetting" ).hide();
				document.getElementById("AccountTopBarUserName").innerHTML="leathing.com";
				document.getElementById("AccountTopBarImgElement").src='';
				SignInWhenNotSignedIn(); 
			} 
			else {setTimeout(checkVariable,100); }
		}
		checkVariable();
	/* Koniec checkVariable */
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

}

function setUserDecsriptionAfterSignIn()
{
	document.getElementById("AccountTopBarUserName").innerHTML=(myUser.UserName);	
	document.getElementById("AccountTopBarImgElement").src=myUser.UserImageURL;
}	
	
	
function GetSomeInfoAboutUser()
{
	apiTest();
	/* * * * * * * * * SABLON * * * * * * * * * * * * * * * * * * * * * * */
	/* checkVariable(FinalFunction_obj) -> UWAGA ZMIEN WARTOSCI PRZY 'if' */
		function checkVariable() {
			if(myUser.UserIsInfoReceived==1)	
				{alert(myUser.UserName); document.getElementById("AccountTopBarUserName").innerHTML=(myUser.UserName); GetUserPicture();} 
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
			if(myCurrentStatus=="connected")		{ alert('Zalogowany'); IsSignedIn=1; GetSomeInfoAboutUser(); } 
			else {setTimeout(checkVariable,100); }
		}
		checkVariable();
	/* Koniec checkVariable */
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
}
	


// device APIs are available
    function onDeviceReady() {
	
		oneFacebookGetStatus();
    }

$(document).ready(function(){
  $(".AccountTopBarImgElement").click(function () {
		if ( $( ".AccountSetting" ).is( ":hidden" ) ) {
			$( ".AccountSetting" ).slideDown( "slow" );
			//$( "#googleMap" ).hide();
		}
		else {
			$( ".AccountSetting" ).hide();
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