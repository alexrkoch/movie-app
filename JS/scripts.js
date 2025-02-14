
// highest level jQuery function, runs win the DOM is ready for javascript to run.
$(document).ready(function(){

	// (The base url for all API calls)
	var apiBaseURL = 'http://api.themoviedb.org/3/';

	// (URL in Authentication. Base URL of image)
	var imageBaseUrl = 'https://image.tmdb.org/t/p/';

	// URL to request for all movies "now playing" 
	// apiKey variable is available through global scope of config.js (separated to be gitignored).
	const nowPlayingURL = apiBaseURL + 'movie/now_playing?api_key=' + apiKey;

	

	//==============================================================================
	//====================== Get "now playing" data on default. ====================
	//=================== Change results when a genre is clicked on.================
	//==============================================================================
	function getNowPlayingData(){

		// jQuery function to make an HTTP request: $.getJSON(request URL, function to perform on success)
		$.getJSON(nowPlayingURL, function(nowPlayingData){

			// loop through each movie in the nowPlayingData results, 
			// (we needed to add .results because nowPlayingData is an array.)
			for(let i = 0; i<nowPlayingData.results.length; i++){
				
				// (mid = movie ID)
				var mid = nowPlayingData.results[i].id;
				
				// construct the request URL for a particular movie.
				var thisMovieUrl = apiBaseURL+'movie/'+mid+'/videos?api_key=' + apiKey;

				// movieKey is the data recieved from the http request. the object is created on the fly in this function call, not anywhere before. 
				$.getJSON(thisMovieUrl, function(movieKey){
					
					// image URL for movie poster (w300 is the width format of the poster)
					var poster = imageBaseUrl+'w300'+nowPlayingData.results[i].poster_path;
					
					// next 6 statements are pulling basic info  and media for the movie from the results.
					var title = nowPlayingData.results[i].original_title;

					var releaseDate = nowPlayingData.results[i].release_date;

					var overview = nowPlayingData.results[i].overview;
					
					var voteAverage = nowPlayingData.results[i].vote_average;				
					
					var youtubeKey = movieKey.results[0].key;

					var youtubeLink = 'https://www.youtube.com/watch?v='+youtubeKey;
					
					// construct the HTML for each movie.
					// the movie poster is the only thing that shows on the main view.
					// the rest of the data shows in the modal.
					var nowPlayingHTML = '';
					// added in i to nowPlayingHTML. Without it, only the details for the first movie in the results display in the modal no matter which movie poster you click on.
					nowPlayingHTML += '<div class="col-sm-3 eachMovie">';
						nowPlayingHTML += '<button type="button" class="btnModal" data-toggle="modal" data-target="#exampleModal'+ i + '" data-whatever="@' + i + '">'+'<img src="'+poster+'"></button>'; 	
						nowPlayingHTML += '<div class="modal fade" id="exampleModal' + i +'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">';
							nowPlayingHTML += '<div class="modal-dialog" role="document">';
								nowPlayingHTML += '<div class="modal-content col-sm-12">';
									nowPlayingHTML += '<div class="col-sm-6 moviePosterInModal">';
										nowPlayingHTML += '<a href="'+youtubeLink+'"><img src="'+poster+'"></a>'; 
									nowPlayingHTML += '</div><br>';//close trailerLink
									nowPlayingHTML += '<div class="col-sm-6 movieDetails">';
										nowPlayingHTML += '<div class="movieName">'+title+'</div><br>';
										nowPlayingHTML += '<div class="linkToTrailer"><a href="'+youtubeLink+'"><span class="glyphicon glyphicon-play"></span>&nbspPlay trailer</a>' + '</div><br>';	
										nowPlayingHTML += '<div class="release">Release Date: '+releaseDate+'</div><br>';
										// nowPlayingHTML += '<div class="genre">Genre: '+genre+'</div><br>';
										nowPlayingHTML += '<div class="overview">' +overview+ '</div><br>';// Put overview in a separate div to make it easier to style
										nowPlayingHTML += '<div class="rating">Rating: '+voteAverage+ '/10</div><br>';
										// fake movie time buttons
										nowPlayingHTML += '<div class="col-sm-3 btn btn-primary">8:30 AM' + '</div>';
										nowPlayingHTML += '<div class="col-sm-3 btn btn-primary">10:00 AM' + '</div>';
										nowPlayingHTML += '<div class="col-sm-3 btn btn-primary">12:30 PM' + '</div>';
										nowPlayingHTML += '<div class="col-sm-3 btn btn-primary">3:00 PM' + '</div>';
										nowPlayingHTML += '<div class="col-sm-3 btn btn-primary">4:10 PM' + '</div>';
										nowPlayingHTML += '<div class="col-sm-3 btn btn-primary">5:30 PM' + '</div>';
										nowPlayingHTML += '<div class="col-sm-3 btn btn-primary">8:00 PM' + '</div>';
										nowPlayingHTML += '<div class="col-sm-3 btn btn-primary">10:30 PM' + '</div>';
									nowPlayingHTML += '</div>'; //close movieDetails
								nowPlayingHTML += '</div>'; //close modal-content
							nowPlayingHTML += '</div>'; //close modal-dialog
						nowPlayingHTML += '</div>'; //close modal
					nowPlayingHTML += '</div>'; //close off each div

					// depend the HTML movie block onto the DOM
					$('#movie-grid').append(nowPlayingHTML);
					
					//h1 will change depending on what is clicked. Will display "Now Playing" in this case.
					$('#movieGenreLabel').html("Now Playing");
				})
			}
		}) 
	}



	//==============================================================================
	//====================== Get movies by genre ===================================
	//==============================================================================

		// Check genreIDs and genre names: 
		// http://api.themoviedb.org/3/movie/:movieID?api_key=<<>>
					//28 = action
					//12 = adventure
					//16 = animation
					//35 = comedy
					//80 = crime
					//18 = drama
					//10751 = family
					//14 = fantasy
					//36 = history
					//27 = horror
					//10402 = music
					//10749 = romance
					//878 = science fiction
					//53 = thriller

	function getMoviesByGenre(genre_id){

		// request URL for a list of movies by genre
		const getMoviesByGenreURL = apiBaseURL + 'genre/' + genre_id + '/movies?api_key=' + apiKey + '&language=en-US&include_adult=false&sort_by=created_at.asc';
		
		// make the request
		$.getJSON(getMoviesByGenreURL, function(genreData){
			
			// loop through the movies in the results
			for(let i = 0; i<genreData.results.length; i++){
				var mid = genreData.results[i].id;
				var thisMovieUrl = apiBaseURL+'movie/'+mid+'/videos?api_key=' + apiKey;

				// request for each specific movie, get movie details and media.
				// I can't figure out where the function argument movieKey is coming from...
				$.getJSON(thisMovieUrl, function(movieKey){
					var poster = imageBaseUrl+'w300'+genreData.results[i].poster_path;
					var title = genreData.results[i].original_title;
					var releaseDate = genreData.results[i].release_date;
					var overview = genreData.results[i].overview;
					var voteAverage = genreData.results[i].vote_average;				
					var youtubeKey = movieKey.results[0].key;
					var youtubeLink = 'https://www.youtube.com/watch?v='+youtubeKey;
					var genreHTML = '';

					// generate the movie's HTML block / modal
					genreHTML += '<div class="col-sm-3 col-md-3 col-lg-3 eachMovie">';
						genreHTML += '<button type="button" class="btnModal" data-toggle="modal" data-target="#exampleModal'+ i + '" data-whatever="@' + i + '">'+'<img src="'+poster+'"></button>'; 	
						genreHTML += '<div class="modal fade" id="exampleModal' + i +'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">';
							genreHTML += '<div class="modal-dialog" role="document">';
								genreHTML += '<div class="modal-content col-sm-12 col-lg-12">';
									genreHTML += '<div class="col-sm-6 moviePosterInModal">';
										genreHTML += '<a href="'+youtubeLink+'"><img src="'+poster+'"></a>'; 
									genreHTML += '</div><br>';//close trailerLink
									genreHTML += '<div class="col-sm-6 movieDetails">';
										genreHTML += '<div class="movieName">'+title+'</div><br>';
										genreHTML += '<div class="linkToTrailer"><a href="'+youtubeLink+'"><span class="glyphicon glyphicon-play"></span>&nbspPlay trailer</a>' + '</div><br>';	
										genreHTML += '<div class="release">Release Date: '+releaseDate+'</div><br>';
										genreHTML += '<div class="overview">' +overview+ '</div><br>';
										genreHTML += '<div class="rating">Rating: '+voteAverage+ '/10</div><br>';
										genreHTML += '<div class="col-sm-3 btn btn-primary">8:30 AM' + '</div>';
										genreHTML += '<div class="col-sm-3 btn btn-primary">10:00 AM' + '</div>';
										genreHTML += '<div class="col-sm-3 btn btn-primary">12:30 PM' + '</div>';
										genreHTML += '<div class="col-sm-3 btn btn-primary">3:00 PM' + '</div>';
										genreHTML += '<div class="col-sm-3 btn btn-primary">4:10 PM' + '</div>';
										genreHTML += '<div class="col-sm-3 btn btn-primary">5:30 PM' + '</div>';
										genreHTML += '<div class="col-sm-3 btn btn-primary">8:00 PM' + '</div>';
										genreHTML += '<div class="col-sm-3 btn btn-primary">10:30 PM' + '</div>';
									genreHTML += '</div>'; //close movieDetails
								genreHTML += '</div>'; //close modal-content
							genreHTML += '</div>'; //close modal-dialog
						genreHTML += '</div>'; //close modal
					genreHTML += '</div>'; //close off each div
					$('#movie-grid').append(genreHTML);
					//Without this line, there is nowhere for the posters and overviews to display so it doesn't show up 
					// $('#movieGenreLabel').html("Now Playing");
					//h1 will change depending on what is clicked. Will display "Now Playing" in this case.
				})
			}
		}) 
	}



	// call getMoviesByGenre using click function but call getNowPlayingData on default.
	getNowPlayingData();

	//Reset HTML strings to empty to overwrite with new one!
	var nowPlayingHTML = '';
	var genreHTML = '';



	// .click attaches an event handler for clicks on the targeted element.
	$('.navbar-brand').click(function(){
		
		// make the proper request, create movie html blocks and append them to the DOM.
		getNowPlayingData();
		
		// $().html()
		$('#movie-grid').html(nowPlayingHTML);
		$('#movieGenreLabel').html("Now Playing");
	})		
	$('.nowPlaying').click(function(){
		getNowPlayingData();
		$('#movie-grid').html(nowPlayingHTML);
		$('#movieGenreLabel').html("Now Playing");
	})
	$('#action').click(function(){
		getMoviesByGenre(28);
		$('#movie-grid').html(genreHTML);
		$('#movieGenreLabel').html("Action");
	})
	$('#adventure').click(function(){
		getMoviesByGenre(12);
		$('#movie-grid').html(genreHTML);
		$('#movieGenreLabel').html("Adventure");
	})
	$('#animation').click(function(){
		getMoviesByGenre(16);
		$('#movie-grid').html(genreHTML);
		$('#movieGenreLabel').html("Animation");
	})
	$('#comedy').click(function(){
		getMoviesByGenre(35);
		$('#movie-grid').html(genreHTML);
		$('#movieGenreLabel').html("Comedy");
	})
	$('#crime').click(function(){
		getMoviesByGenre(80);
		$('#movie-grid').html(genreHTML);
		$('#movieGenreLabel').html("Crime");
	})
	$('#drama').click(function(){
		getMoviesByGenre(18);
		$('#movie-grid').html(genreHTML);
		$('#movieGenreLabel').html("Drama");
	})
	$('#family').click(function(){
		getMoviesByGenre(10751);
		$('#movie-grid').html(genreHTML);
		$('#movieGenreLabel').html("Family");
	})
	$('#fantasy').click(function(){
		getMoviesByGenre(14);
		$('#movie-grid').html(genreHTML);
		$('#movieGenreLabel').html("Fantasy");
	})
	$('#history').click(function(){
		getMoviesByGenre(36);
		$('#movie-grid').html(genreHTML);
		$('#movieGenreLabel').html("History");
	})
	$('#horror').click(function(){
		getMoviesByGenre(27);
		$('#movie-grid').html(genreHTML);
		$('#movieGenreLabel').html("Horror");
	})
	$('#music').click(function(){
		getMoviesByGenre(10402);
		$('#movie-grid').html(genreHTML);
		$('#movieGenreLabel').html("Music");
	})
	$('#romance').click(function(){
		getMoviesByGenre(10749);
		$('#movie-grid').html(genreHTML);
		$('#movieGenreLabel').html("Romance");
	})
	$('#scifi').click(function(){
		getMoviesByGenre(878);
		$('#movie-grid').html(genreHTML);
		$('#movieGenreLabel').html("Science Fiction");
	})
	$('#thriller').click(function(){
		getMoviesByGenre(53);
		$('#movie-grid').html(genreHTML);
		$('#movieGenreLabel').html("Thriller");
	})


	
	//==============================================================================
	//====================== Search Function =======================================
	//==============================================================================

	//Run function searchMovies AFTER an input has been submitted. Submit form first.
	//Run searchMovies once to add an empty html to movie-grid using .html(). Then, overwrite it with the new html using .append(). Need to use .append() to overwrite or all the images will display on top of each other.

	// not sure why searchTerm is global?
	var searchTerm = '';

	// this is run automatically on page load?
	searchMovies();

	//reference entire search form, fires off when submit button is pressed.
	$('.searchForm').submit(function(event){

		// sets the movie-grid element to be empty.
		$('#movie-grid').html('');
		
		// I think this prevents the "submit" field of the search form from submitting like a typical form would. Instead we want to use the entry into that field in a customized way.
		event.preventDefault();
		//search term is only concerned with what the user inputted 

		//Get input with .val();
		searchTerm = $('.form-control').val();

		// call searchMovies function now that global searchTerm is entered.
		searchMovies();
	})

	function searchMovies(){

		//need to include query in url. (ex: &query=boss+baby)
		const searchMovieURL = apiBaseURL + 'search/movie?api_key=' + apiKey + '&language=en-US&page=1&include_adult=false&query=' + searchTerm;
			
		// request for set of movies from from search results
		$.getJSON(searchMovieURL, function(movieSearchResults){
			
			for (let i = 0; i<movieSearchResults.results.length; i++){
				var mid = movieSearchResults.results[i].id;
				var thisMovieUrl = apiBaseURL+'movie/'+mid+'/videos?api_key=' + apiKey;		

				$.getJSON(thisMovieUrl, function(movieKey){
					
					var poster = imageBaseUrl+'w300'+movieSearchResults.results[i].poster_path;
					var title = movieSearchResults.results[i].original_title;
					var releaseDate = movieSearchResults.results[i].release_date;
					var overview = movieSearchResults.results[i].overview;
					var voteAverage = movieSearchResults.results[i].vote_average;				
					var youtubeKey = movieKey.results[0].key;
					var youtubeLink = 'https://www.youtube.com/watch?v='+youtubeKey;
					var searchResultsHTML = '';
					searchResultsHTML += '<div class="col-sm-3 col-md-3 col-lg-3 eachMovie">';
						searchResultsHTML += '<button type="button" class="btnModal" data-toggle="modal" data-target="#exampleModal'+ i + '" data-whatever="@' + i + '">'+'<img src="'+poster+'"></button>'; 	
						searchResultsHTML += '<div class="modal fade" id="exampleModal' + i +'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">';
							searchResultsHTML += '<div class="modal-dialog" role="document">';
								searchResultsHTML += '<div class="modal-content col-sm-12 col-lg-12">';
									searchResultsHTML += '<div class="col-sm-6 moviePosterInModal">';
										searchResultsHTML += '<a href="'+youtubeLink+'"><img src="'+poster+'"></a>'; 
									searchResultsHTML += '</div><br>';//close trailerLink
									searchResultsHTML += '<div class="col-sm-6 movieDetails">';
										searchResultsHTML += '<div class="movieName">'+title+'</div><br>';
										searchResultsHTML += '<div class="linkToTrailer"><a href="'+youtubeLink+'"><span class="glyphicon glyphicon-play"></span>&nbspPlay trailer</a>' + '</div><br>';	
										searchResultsHTML += '<div class="release">Release Date: '+releaseDate+'</div><br>';
										searchResultsHTML += '<div class="overview">' +overview+ '</div><br>';
										searchResultsHTML += '<div class="rating">Rating: '+voteAverage+ '/10</div><br>';
										searchResultsHTML += '<div class="col-sm-3 btn btn-primary">8:30 AM' + '</div>';
										searchResultsHTML += '<div class="col-sm-3 btn btn-primary">10:00 AM' + '</div>';
										searchResultsHTML += '<div class="col-sm-3 btn btn-primary">12:30 PM' + '</div>';
										searchResultsHTML += '<div class="col-sm-3 btn btn-primary">3:00 PM' + '</div>';
										searchResultsHTML += '<div class="col-sm-3 btn btn-primary">4:10 PM' + '</div>';
										searchResultsHTML += '<div class="col-sm-3 btn btn-primary">5:30 PM' + '</div>';
										searchResultsHTML += '<div class="col-sm-3 btn btn-primary">8:00 PM' + '</div>';
										searchResultsHTML += '<div class="col-sm-3 btn btn-primary">10:30 PM' + '</div>';
									searchResultsHTML += '</div>'; //close movieDetails
							searchResultsHTML += '</div>'; //close modal-dialog
						searchResultsHTML += '</div>'; //close modal
					searchResultsHTML += '</div>'; //close off each div
					// console.log(searchResultsHTML)
					$('#movie-grid').append(searchResultsHTML);
					//Label will be whatever user input was
					$('#movieGenreLabel').html(searchTerm);	
				})
			}
		})
	}
});


//.append(nowPlayingHTML) adds nowPlayingHTML to the present HTML
//.html(nowPlayingHTML) ovwrwrites the HTML present with nowPlayingHTML. 
//.html() is faster than DOM creation
//.html() is good for when the element is empty. 
//.append() is better when you want to add something dynamically, like adding a list item dynamically. (You would be adding a new string of HTML to the element.)



