myApp.service('MangaService', ['$http', '$location', function($http, $location){
    console.log('MangaService Loaded');
    var self = this;

    self.mangaResults = { list: [] }
    self.userFavorites = { list: [] }
    self.detailsPage;

    //Sending search inquiry to the service to perform get request.
    self.searchManga = function(searchInput) { //Search manga function (Used in all views except register & login)
        $http.get(`/api/manga/${searchInput}`)
            .then(response => {
                // console.log(response);
                self.mangaResults.list = response
                // console.log(self.mangaResults);
                
                $location.path("/results");
            })
            .catch(error => {
                console.log(error);
                alert('There was an error with your search request, please try a different keyword')
            })
    }; //Search manga function (Used in all views except register & login)

    self.addFavorite = function(mangaInfo) {//Start of Add Favorites function (Used in results view and detailed manga (not infavorites yet) view)
        console.log('data to add to the favorites', mangaInfo);
        $http.post(`/api/manga`, mangaInfo)
            .then(response => {
                // console.log('added', response);   
                alert(`${mangaInfo.title} has been added to favorites!`) 
                self.getFavorites()            
            })
            .catch(error => {
                console.log('Error on adding to favorites.', error);
                alert(`You already have ${mangaInfo.title} on your favorites!`)
            })
    }//End of Add Favorites function (Used in results view and detailed manga (not infavorites yet) view)

    self.getFavorites = function() { //get Favorites function (Used in favorites view, but loaded once user logs in. / refreshes page.)
        $http.get(`/api/manga`)
            .then(response => {
                // console.log('User Favorites', response);
                self.userFavorites.list = response
            })
            .catch(error => {
                console.log('Error retrieving favorites', error);
            })
    }; //End of get Favorites function (Used in favorites view, but loaded once user logs in. / refreshes page.)

    // NOTE TO SELF; THIS CURRENTLY ONLY RELOADS ONCE. IF THE USER LOGS OUT AND SOMEONE ELSE LOGS IN WITHOUT REFRESHING THE PAGE THEIR FAVORITES WONT LOAD.
    // QUICK FIX WOULD BE TO RELOAD ON CONTROLLER BUT THAT IS TOO MANY REFRESHES. FIX IN TIME. 
    self.getFavorites()


    self.editChapterRead = function(chapterRead) { //Start of edit last chapter read function (Used in favorites view)
        // console.log('Edited last chapter read: ', chapterRead.newChapterRead);
        $http.put(`/api/manga`, chapterRead)
            .then(response => {
                console.log('Success from update manga: ', response);
                self.getFavorites()
            })
            .catch(error => {
                console.log('Error updating favorites', error);
            })
    } //End of edit last chapter read function (Used in favorites view)


    self.removeFavorite = function(toDelete) { // Start of remove selected manga function (used in favorites view)
        console.log('this is the data to delete: ', toDelete);
        if (confirm(`Are you sure you want to delete ${toDelete.manga_name}`)) { //To make sure that the user wants to delete the specific manga. 
            $http.delete(`/api/manga/${toDelete.manga_id}`)
                .then(response => {
                    console.log('Success from delete manga: ', response);
                    self.getFavorites()
                })
                .catch(error => {
                    console.log('Error deleting favorites', error);
                })
        }
    }// End of remove selected manga function (used in favorites view)


    self.mangaDetail = function(manga) {
        $location.path("/mangainfo");
        self.detailsPage = manga;
    }


}]);
  