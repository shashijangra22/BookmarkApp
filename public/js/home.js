var firebaseModule = (function() {
  // Initializing Firebase
  var config = {
    apiKey: "AIzaSyDOTjtvRGcPSYXd_vP9ZmjUSgaxOs61pI4",
    authDomain: "bookmark-app-d54c6.firebaseapp.com",
    databaseURL: "https://bookmark-app-d54c6.firebaseio.com",
    projectId: "bookmark-app-d54c6",
    storageBucket: "bookmark-app-d54c6.appspot.com",
    messagingSenderId: "28866234193"
  };
  firebase.initializeApp(config);

	var $signOutBtn = $('#signOutBtn');	// caching the sign out button

	$signOutBtn.on('click',signOut);		// binding an event listener for logout
 	
 	function signOut() {					// the function to handle the logout
		firebase.auth().signOut();
	}

	// triggers when the user sign in or sign out

	firebase.auth().onAuthStateChanged(user => {
		if(user)  {
			signOutBtn.classList.remove('hide');
			bookmarkModule.getBookmarks();		// get the bookmarks associated with user at log in
			$(".spinner-wrapper").fadeOut("slow");
			$('.modal').modal()
		}
		else{
			window.location.replace('index.html');		// if no user is logged in then redirect to login dashboard
		}
	});

})();

var bookmarkModule = (function() {
		
	// caching the DOM to be used in the app

	var bookmarks = [];
	var count = 0;
	var $el = $('#myBookmarks');
	var $protoMark = $('#protoMark');
	var $addNewBookmarkBtn = $('#addNewBookmarkBtn');
	var $newUrl = $('#newUrl');
	var $newHead = $('#newHead');
	var $delBtn = $el.find('i');

	// binding events to add new bookmark and delete a bookmark button

	$addNewBookmarkBtn.on('click',addNewBookmark);		
	$el.delegate('i','click',deleteBM);

	// to delete a bookmark

	function deleteBM(e) {
		count--;
		var target = $(e.target);
		var mid = target.data('id');	// getting the unique ID of bookmark
		target.closest('div.col').fadeOut();
		target.closest('div.col').remove();	// removing the mark from DOM
		firebase.database().ref('bookmarks/'+firebase.auth().currentUser.uid+'/'+mid).remove();	// actually removing the mark from database
		Materialize.toast('Bookmark Deleted !',2000);	// notifying the user 
	}

	// to get all the user's bookmarks

	function getBookmarks() {
		var user = firebase.auth().currentUser;		// getting currently logged in user
		if (user) {
			Materialize.toast('Loading Your Bookmarks...',2000);
			var bookmarksRef = firebase.database().ref('bookmarks/'+user.uid);
			bookmarksRef.once('value').then(function(snapshot) {
				var data = snapshot.val();
				for (var key in data){
					var temp = {
						key : key,
						url : data[key].url,
						name : data[key].name
					}
					bookmarks.push(temp);		// adding JSON from the firebase to bookmarks[] array
				}
				showBookmarks();	// calling this to show the bookmarks to user
			});
		}
	}

	// to show the bookmarks on the screen

	function showBookmarks() {
		var len = bookmarks.length;
		count = len;
		if (len) {
			for (var i = len-1; i >= 0; i--) {
				// this will make Cards for bookmark and add them to DOM
				var card = makeCard($protoMark.clone(true),bookmarks[i].url,bookmarks[i].name,bookmarks[i].key);
				$el.append(card);
			}
			bookmarks.length=0;
		}
		else{
			Materialize.toast('No Saved Bookmarks :(',2000);	// notify if no bookmarks found
		}	
	}

	// to add new bookmark

	function addNewBookmark() {
		const CUser = firebase.auth().currentUser;	// getting currently logged in user
		if (CUser) {
	        var firebaseRef = firebase.database().ref("bookmarks/"+CUser.uid).push();	// getting reference to where new bookmark is being saved
		    var newKey = firebaseRef.key;	
		    firebaseRef.set({	// save the url and name of bookmark to the ref
		    	url : newUrl.value,
		    	name : newHead.value
		    });
		    Materialize.toast('Bookmark Added !',2000);	// notifying the user
		    // making the card for bookmark and then adding it to DOM
		    var card = makeCard($protoMark.clone(true),newUrl.value,newHead.value,newKey);
			$el.prepend(card);
			newUrl.value="";
		    newHead.value="";
		}
	}

	// to make the card UI for bookmark

	function makeCard(card,url,name,key) {
		card.attr('id',++count+'bookmark');
		card.find('p.name').append(name);
		card.find('p.truncate').append(url);
		card.find('img').attr('data-url',url);
		card.find('a.url').attr('href',url);
		card.find('i').data('id',key);	// adding the unique Key for bookmark
		card.removeClass('hide');
			// to resolve the URL into an IMAGE using google APIs
	        $.ajax({
	        	url: 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=' + card.find('img').data('url') + '&screenshot=true',
	        	type: 'GET',
	        	dataType: 'json',
	        	success: function(data) {
	           		data = data.screenshot.data.replace(/_/g, '/').replace(/-/g, '+');
	            	card.find('img').attr('src', 'data:image/jpeg;base64,' + data);	// adding result to image source
	            }
	        });
		return card;
	}

	return {
		getBookmarks : getBookmarks	// revealing the module so that it can be called by other modules too
	}
})();