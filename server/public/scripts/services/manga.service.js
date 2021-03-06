myApp.service('MangaService', ['$http', '$location', function ($http, $location) {
    // console.log('MangaService Loaded');
    var self = this;

    self.mangaResults = { list: [] }
    self.genreResults = { list: [] }
    self.userFavorites = { list: [] }
    self.detailsPage = {}
    self.favoriteDetailsPage;

    /******************************************/
    /*              GET REQUESTS              */
    /******************************************/

    //Sending search inquiry to the service to perform get request.
    self.searchManga = function (searchInput) { //Search manga function (Used in all views except register & login)
        $http.get(`/api/manga/${searchInput}`)
            .then(response => {
                // console.log(response);
                if (Array.isArray(response.data)) { // If the resulting search is an array. Then continue to display the results.
                    self.mangaResults.list = response
                    // console.log(self.mangaResults);
                    window.scrollTo(0, 0) //Reset window scroll to top.
                    $location.path("/results");
                }
                else { //This is if the search results into only a single resulting manga. It will go to the manga details page directly. 
                    // console.log(response.data);
                    self.detailsPage.list = response.data
                    $location.path("/mangainfo");
                }
            })
            .catch(error => {
                if (error.status === 403) {
                    swal({
                        text: `You are not logged in.`,
                        title: 'Not Allowed!',
                        icon: "error",
                    })
                    $location.path("/login");
                }
                else {
                    swal({
                        text: `Please try a different one`,
                        title: `There was an error with the search`,
                        icon: "error",
                    })
                }
            })
    }; //Search manga function (Used in all views except register & login)


    self.getFavorites = function () { //get Favorites function (Used in favorites view, but loaded once user logs in. / refreshes page.)
        $http.get(`/api/manga`)
            .then(response => {
                // console.log('User Favorites', response);
                self.userFavorites.list = response
            })
            .catch(error => {
                if (error.status === 403) {
                    swal({
                        text: `You are not logged in.`,
                        title: 'Not Allowed!',
                        icon: "error",
                    })
                    $location.path("/login");
                }
                else {
                    // console.log('Error retrieving favorites', error);
                }
            })
    }; //End of get Favorites function (Used in favorites view, but loaded once user logs in. / refreshes page.)

    //Doesnt do this if the user refreshes page on login/register view or if he logs in normally. 
    if ($location.$$url !== '/login' && $location.$$url !== '/register') {
        if (performance.navigation.type == 1) { // Check if page was reloaded. Since the user did not use the login method will pull his favorites.
            // console.info("This page is reloaded");
            self.getFavorites()
        }
    }

    self.searchGenre = function (genre) { //Search specified genre function (Used in home view and both results views)
        $http.get(`/api/manga/genres/${genre}`)
            .then(response => {
                // console.log(response);
                self.genreResults.list = response
                window.scrollTo(0, 0) //Reset window scroll to top.
                $location.path("/genre");
            })
            .catch(error => {
                if (error.status === 403) {
                    swal({
                        text: `You are not logged in.`,
                        title: 'Not Allowed!',
                        icon: "error",
                    })
                    $location.path("/login");
                }
                else {
                    // console.log(error);
                    swal({
                        text: `Please try a different one`,
                        title: `Error retrieving "${genre}" genre results`,
                        icon: "error",
                    })
                }
            })
    }; //Search specified genre function (Used in home view and both results views)

    self.randomManga = function () {
        $http.get(`/api/manga/button/random/manga`)
            .then(response => {
                // console.log(response);
                if (Array.isArray(response.data)) { // If the resulting search is an array. Then it will pick a random one and display it.
                    self.detailsPage.list = response.data[Math.floor(Math.random() * response.data.length)]
                    $location.path("/mangainfo");
                }
                else { //This is if the search results into only a single resulting manga. It will go to the manga details page directly. 
                    self.detailsPage.list = response.data
                    $location.path("/mangainfo");
                }
            })
            .catch(error => {
                if (error.status === 403) {
                    swal({
                        title: 'Not Allowed!',
                        text: `You are not logged in.`,
                        icon: "error",
                    })
                    $location.path("/login");
                }
                else {
                    // console.log(error);
                    swal({
                        title: `Error spinning up a Manga`,
                        text: `Please try again`,
                        icon: "error",
                    })
                }
            })
    }


    /******************************************/
    /*             POST REQUESTS              */
    /******************************************/

    self.addFavorite = function (mangaInfo) {//Start of Add Favorites function (Used in results view and detailed manga (not infavorites yet) view)
        // console.log('data to add to the favorites', mangaInfo);
        $http.post(`/api/manga`, mangaInfo)
            .then(response => {
                // console.log('added', response);   
                swal({
                    title: `${mangaInfo.title} has been added to favorites!`,
                    icon: "success",
                    timer: 1200,
                    buttons: false,
                })
                self.getFavorites()
            })
            .catch(error => {
                if (error.status === 403) {
                    swal({
                        text: `You are not logged in.`,
                        title: 'Not Allowed!',
                        icon: "error",
                    })
                    $location.path("/login");
                }
                else {
                    // console.log('Error on adding to favorites.', error);
                    swal({
                        text: `Please add a different one`,
                        title: `${mangaInfo.title} is already in your favorites!`,
                        icon: "info",
                    })
                }
            })
    }//End of Add Favorites function (Used in results view and detailed manga (not infavorites yet) view)

    /******************************************/
    /*              PUT REQUESTS              */
    /******************************************/

    self.editChapterRead = function (chapterRead) { //Start of edit last chapter read function (Used in favorites view)
        // console.log('Edited last chapter read: ', chapterRead.newChapterRead);
        $http.put(`/api/manga`, chapterRead)
            .then(response => {
                // console.log('Success from update manga: ', response);
                self.getFavorites()
            })
            .catch(error => {
                if (error.status === 403) {
                    swal({
                        text: `You are not logged in.`,
                        title: 'Not Allowed!',
                        icon: "error",
                    })
                    $location.path("/login");
                }
                else {
                    // console.log('Error updating favorites', error);
                    swal({
                        text: `Please Try Again!`,
                        title: 'Error Updating Chapter',
                        icon: "error",
                    })
                    // to refresh the edits (Since this is most likely caused by a null chapter edit)
                    self.getFavorites()

                }
            })
    } //End of edit last chapter read function (Used in favorites view)

    /******************************************/
    /*            DELETE REQUESTS             */
    /******************************************/

    self.removeFavorite = function (toDelete) { // Start of remove selected manga function (used in favorites view)
        // console.log('this is the data to delete: ', toDelete);
        swal({
            title: `Are you sure you want to delete ${toDelete.manga_name}`,
            icon: "warning",
            dangerMode: 'Yes',
            buttons: ["No", "Yes"],
        })
            .then(value => { //Sweet Alerts confirmation if user wants to delete the manga. 
                if (value) { //To make sure that the user wants to delete the specific manga. 
                    $http.delete(`/api/manga/${toDelete.manga_id}`)
                        .then(response => {
                            // console.log('Success from delete manga: ', response);
                            swal({
                                title: `${toDelete.manga_name} has been removed!`,
                                icon: "success",
                                timer: 1200,
                                buttons: false,
                                icon: "../../styles/icons/trash.svg",
                            })
                            self.getFavorites()
                            // This is if the user is viewing the manga details page, it returns him to the favorites view.
                            $location.path("/favorites");
                        })
                        .catch(error => {
                            if (error.status === 403) {
                                swal({
                                    text: `You are not logged in.`,
                                    title: 'Not Allowed!',
                                    icon: "error",
                                })
                                $location.path("/login");
                            }
                            else {
                                // console.log('Error deleting favorites', error);
                            }
                        })
                }
            })

        // NORMAL CONFIRMATION
        // if (confirm(`Are you sure you want to delete ${toDelete.manga_name}`)) { //To make sure that the user wants to delete the specific manga. 
        //     $http.delete(`/api/manga/${toDelete.manga_id}`)
        //         .then(response => {
        //             console.log('Success from delete manga: ', response);
        //             self.getFavorites()
        //             $location.path("/favorites");
        //         })
        //         .catch(error => {
        //             if (error.status === 403) {
        //                 swal(`You are not logged in.`);
        //                 $location.path("/login");
        //             }
        //             else {
        //                 console.log('Error deleting favorites', error);
        //             }
        //         })
        // }
    }// End of remove selected manga function (used in favorites view)

    /******************************************/
    /*            OTHER FUNCTIONS             */
    /******************************************/

    // FUNCTIONS FOR DISPLAYING MANGA DETAILS ON MANGA.DETAILS.HTML

    // These display all the manga information in the form of object to be placed on the DOM directly.

    self.mangaDetail = function (manga) {
        self.detailsPage.list = manga;
        $location.path("/mangainfo");
    }

    self.favoriteDetail = function (favoriteManga) {
        self.detailsPage.list = favoriteManga;
        $location.path("/mangainfo");
    }

    // END OF FUNCTIONS FOR DISPLAYING MANGA DETAILS ON MANGA.DETAILS.HTML

}]);
