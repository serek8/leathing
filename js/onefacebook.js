// Natywna czaesc aplikacji do logowania przez Facebooka

// Logowanie - lancuch funkcji odpowiadajacych za logowanie i gromadzenie danych o uzytkowniku
	var oneFacebookLogin = function () {
		facebookConnectPlugin.login( ["public_profile","email"],
			function (response) { oneFacebookApiGetInfoAfterSignIn(); },
			function (response) { alert("Musisz byc zalogowany aby korzystac z aplikacji"); oneFacebookLogin(); }
		);
	};
	
	var oneFacebookApiGetInfoAfterSignIn = function () { 
		facebookConnectPlugin.api( "me?fields=id,email,name", ["public_profile"],
			function (response) {
				myUser.UserName=response.name;  
				myUser.UserIdUsedToSignUp=response.id;
				myUser.UserEmail=response.email;
				oneFacebookApiGetPicture();
			},
			function (response) { alert("Nie moge pobrac podstawowych info o uzytkowniku="+JSON.stringify(response)); myUser.IsSignedIn=0;}
		); 
    };	
			
// funkcja uzywana tylko przy logowaniu bo uruchamia kolejne potrzebne do dokonczenia logowania
	var oneFacebookApiGetPicture = function () { 
        facebookConnectPlugin.api( "me/picture?redirect=false", ["public_profile"],
            function (response) {
				myUser.UserImageURL=response.data.url;  
				setUserDecsriptionAfterSignIn();
			},
            function (response) { alert("Nie moge pobrac profilowego: "+JSON.stringify(response)); }
		); 
    };
 
 
    var oneFacebookGetStatus = function () { 
        facebookConnectPlugin.getLoginStatus( 
			function (response) { 
				if(response.status=="connected")	{ oneFacebookApiGetInfoAfterSignIn();}
				else if(response.status=="unknown")	{ oneFacebookLogin(); }
			},
			function (response) { alert(JSON.stringify(response)); }
		);
    };
 
    var oneFacebookLogout = function () { 
        facebookConnectPlugin.logout( 
			function (response) { oneFacebookLogin();},
            function (response) { alert("Blad przy wylogowywaniu"); oneFacebookLogin();}
		);
	}; 
 
// Koniec czynnosci do logowania 


 
			var login = function () {
                facebookConnectPlugin.login( ["public_profile","email"],
                    function (response) { apiGetInfoAfterSignIn(); },
                    function (response) { alert("Aby uzywaz aplikacji musisz byc zalogowany ! Koncze program."); navigator.app.exitApp(); });
            }; 
 
 
            var showDialog = function () { 
                facebookConnectPlugin.showDialog( { method: "feed" }, 
                    function (response) { alert(JSON.stringify(response)); },
                    function (response) { alert(JSON.stringify(response)); });
            };
            
            var apiTest = function () { 
                facebookConnectPlugin.api( "me?fields=id,email,name", ["public_profile"],
                    function (response) {
						myUser.UserName=response.name;  
						myUser.UserIdUsedToSignUp=response.id;
						myUser.UserEmail=response.email;
						myUser.UserIsInfoReceived=1;
						},
                    function (response) { alert("muERROE="+JSON.stringify(response)); }); 
            };


		
			
			
            var logPurchase = function () {
                facebookConnectPlugin.logPurchase(1.99, "USD",
                    function (response) { alert(JSON.stringify(response)); },
                    function (response) { alert(JSON.stringify(response)); });
            };
            var logEvent = function () {
                // For more information on AppEvent param structure see
                // https://developers.facebook.com/docs/ios/app-events
                // https://developers.facebook.com/docs/android/app-events
                facebookConnectPlugin.logEvent("Purchased",
                    {
                        NumItems: 1,
                        Currency: "USD",
                        ContentType: "shoes",
                        ContentID: "HDFU-8452"
                    }, null,
                    function (response) { alert(JSON.stringify(response)); },
                    function (response) { alert(JSON.stringify(response)); });
            };
            var getAccessToken = function () { 
                facebookConnectPlugin.getAccessToken( 
                    function (response) { alert(JSON.stringify(response)); },
                    function (response) { alert(JSON.stringify(response)); });
            };
            
            var getStatus = function () { 
				myCurrentStatus="";
                facebookConnectPlugin.getLoginStatus( 
                    function (response) { myCurrentStatus=response.status;},
                    function (response) { alert(JSON.stringify(response)); });
				return myCurrentStatus;
            };
						
			
			
            var logout = function () { 
                facebookConnectPlugin.logout( 
                    function (response) { myUser.IsSignedIn=0;	},
                    function (response) { alert("Aby uzywaz aplikacji musisz byc zalogowany ! Koncze program."); navigator.app.exitApp();});
					
            };