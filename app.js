(function() {
	
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDOTjtvRGcPSYXd_vP9ZmjUSgaxOs61pI4",
    authDomain: "bookmark-app-d54c6.firebaseapp.com",
    databaseURL: "https://bookmark-app-d54c6.firebaseio.com",
    projectId: "bookmark-app-d54c6",
    storageBucket: "bookmark-app-d54c6.appspot.com",
    messagingSenderId: "28866234193"
  };
  firebase.initializeApp(config);

// cacheDom
	const LoginEmail = document.getElementById('LoginEmail');
	const RegisterEmail = document.getElementById('RegisterEmail');
	const LoginPassword = document.getElementById('LoginPassword');
	const RegisterPassword = document.getElementById('RegisterPassword');
	const ConfirmPassword = document.getElementById('ConfirmPassword');
	const LoginFormButton = document.getElementById('LoginFormButton');
	const RegisterFormButton = document.getElementById('RegisterFormButton');
	const signOutBtn = document.getElementById('signOutBtn');
	const LoginSpinner = document.getElementById('LoginSpinner');
	const RegisterSpinner = document.getElementById('RegisterSpinner');

	// add login event

	LoginFormButton.addEventListener('click',e => {
		e.preventDefault();
		const auth = firebase.auth();
		LoginFormButton.classList.add('hide');
        LoginSpinner.classList.add('active');
        LoginSpinner.classList.remove('hide');
		const promise = auth.signInWithEmailAndPassword(LoginEmail.value,LoginPassword.value);
		promise.catch(e=> {
			Materialize.toast(e.message, 3000);
			LoginFormButton.classList.remove('hide');
	        LoginSpinner.classList.remove('active');
	        LoginSpinner.classList.add('hide');
	});
	});

	// add register event

	RegisterFormButton.addEventListener('click',e => {
		e.preventDefault();
		if (RegisterPassword.value!=ConfirmPassword.value) {
			Materialize.toast('Password Mismatch !',2000);
			return false;
		}
		const auth = firebase.auth();
		RegisterFormButton.classList.add('hide');
        RegisterSpinner.classList.add('active');
        RegisterSpinner.classList.remove('hide');
		const promise = auth.createUserWithEmailAndPassword(RegisterEmail.value,RegisterPassword.value);
		promise.catch(e=> {
			Materialize.toast(e.message, 3000);
			RegisterFormButton.classList.remove('hide');
	        RegisterSpinner.classList.remove('active');
	        RegisterSpinner.classList.add('hide');

	});
	});

	// on auth state change

	firebase.auth().onAuthStateChanged(user => {
		if(user)  {
			window.location.replace('home.html');
		}
	});

}());