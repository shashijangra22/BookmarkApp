var firebaseModule = (function() {
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

	var $signOutBtn = $('#signOutBtn');

	$signOutBtn.on('click',signOut);
 	
 	function signOut() {
		firebase.auth().signOut();
	}

	firebase.auth().onAuthStateChanged(user => {
		if(user)  {
			signOutBtn.classList.remove('hide');
			bookmarkModule.getBookmarks();
			$(".spinner-wrapper").fadeOut("slow");
			$('.modal').modal()
		}
		else{
			window.location.replace('index.html');
		}
	});

})();

var bookmarkModule = (function() {
	var bookmarks = [];
	var count = 0;
	var $el = $('#myBookmarks');
	var $protoMark = $('#protoMark');
	var $addNewBookmarkBtn = $('#addNewBookmarkBtn');
	var $newUrl = $('#newUrl');
	var $newHead = $('#newHead');
	var $delBtn = $el.find('i');

	$addNewBookmarkBtn.on('click',addNewBookmark);
	$el.delegate('i','click',deleteBM);

	function deleteBM(e) {
		count--;
		var target = $(e.target);
		var mid = target.data('id');
		console.log(mid);
		target.closest('div.col').fadeOut();
		target.closest('div.col').remove();
		Materialize.toast('Bookmark Deleted !',2000);
		firebase.database().ref('bookmarks/'+firebase.auth().currentUser.uid+'/'+mid).remove();
	}

	function getBookmarks() {
		var user = firebase.auth().currentUser;
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
					bookmarks.push(temp);
				}
				showBookmarks();
			});
		}
	}

	function showBookmarks() {
		var len = bookmarks.length;
		count = len;
		if (len) {
			for (var i = len-1; i >= 0; i--) {
				var card = makeCard($protoMark.clone(true),bookmarks[i].url,bookmarks[i].name,bookmarks[i].key);
				$el.append(card);
			}
			bookmarks.length=0;
		}
		else{
			Materialize.toast('No Saved Bookmarks :(',2000);
		}	
	}

	function addNewBookmark() {
		const CUser = firebase.auth().currentUser;
		if (CUser) {
	        var firebaseRef = firebase.database().ref("bookmarks/"+CUser.uid).push();
		    var newKey = firebaseRef.key;
		    firebaseRef.set({
		    	url : newUrl.value,
		    	name : newHead.value
		    });
		    Materialize.toast('Bookmark Added !',2000);
		    var card = makeCard($protoMark.clone(true),newUrl.value,newHead.value,newKey);
			$el.prepend(card);
			newUrl.value="";
		    newHead.value="";
		}
	}

	function makeCard(card,url,name,key) {
		card.attr('id',++count+'bookmark');
		card.find('p.name').append(name);
		card.find('p.truncate').append(url);
		card.find('img').attr('data-url',url);
		card.find('a.url').attr('href',url);
		card.find('i').data('id',key);
		card.removeClass('hide');
	        $.ajax({
	        	url: 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=' + card.find('img').data('url') + '&screenshot=true',
	        	type: 'GET',
	        	dataType: 'json',
	        	success: function(data) {
	           		data = data.screenshot.data.replace(/_/g, '/').replace(/-/g, '+');
	            	card.find('img').attr('src', 'data:image/jpeg;base64,' + data);
	            }
	        });
		return card;
	}

	return {
		getBookmarks : getBookmarks
	}
})();