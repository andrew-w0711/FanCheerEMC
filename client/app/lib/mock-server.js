/**
* Created by haffo on 2/2/15.
*/

angular.module('fancheerEMC').run(function ($httpBackend) {

    $httpBackend.whenGET('api/accounts/cuser').respond(function (method, url, data, headers) {
        return [200, {"username": "dev", "accountId": 46, "authorities": [
            {"authority": "costumer"},
            {"authority": "user"}
        ], "authenticated": true}, {}];
    });

    $httpBackend.whenGET('api/accounts/46').respond(function (method, url, data, headers) {
        return [200, {"id": 46, "entityDisabled": false, "pending": false, "accountType": "customer", "username": "haffo", "email": "test@gmail.com", "fullName": "Harold Affo", "phone": '2400000000', "venue": "VENUE-001", "signedConfidentialityAgreement": true, "password": null}, {}];
    });

    $httpBackend.whenGET('api/accounts/0').respond(function (method, url, data, headers) {
        return [200, {"id": 46, "entityDisabled": false, "pending": false, "accountType": "customer", "username": "haffo", "email": "test@gmail.com", "fullName": "Harold Affo", "phone": '2400000000', "venue": "VENUE-001", "signedConfidentialityAgreement": true, "password": null}, {}];
    });


    $httpBackend.whenGET('api/accounts/login').respond(function (method, url, data, headers) {
        return [200, {}, {}];
    });

    $httpBackend.whenGET('api/sooa/usernames/aaaa').respond(function (method, url, data, headers) {
        return [200, {}, {}];
    });

    $httpBackend.whenGET('j_spring_security_logout').respond(function (method, url, data, headers) {
        return [200, {}, {}];
    });


    $httpBackend.whenGET(/GetGamesOnDateService\/\webresources\/\GetGamesOnDateService/).respond(function (method, url, data, headers) {
        var dayGames = [

            {

                "game": {

                    "gameId": 1248,
                    "sportId": 2,
                    "homeTeamId": 593,
                    "awayTeamId": 611,
                    "arenaId": 419,
                    "homeScore": 0,
                    "awayScore": 0,
                    "winnerTeamId": 0,
                    "timeToNextInterval": "00:00",
                    "tieGame": false,
                    "network": "Demo Game",
                    "startTime": "2015-05-20 23:30:00.0",
                    "placeId": "530a127808a3e70b331a86ec",
                    "fullCoverage": true,
                    "hotGameIndicator": "BLACK"

                },
                "homeTeam": {

                    "teamId": 593,
                    "sportsDataTeamId": "7412",
                    "teamName": "Miami Heat",
                    "primaryColor": "#000000",
                    "secondaryColor": "#B62630",
                    "shortName": "MIA",
                    "mascott": "NONE",
                    "division": "NONE",
                    "conference": "NONE",
                    "league": "NONE",
                    "gender": "Male",
                    "level": "Professional",
                    "scheduleText": "Schedule",
                    "newsText": "Latest News"

                },
                "awayTeam": {
                    "teamId": 611,
                    "sportsDataTeamId": "7430",
                    "teamName": "San Antonio Spurs",
                    "primaryColor": "#000000",
                    "secondaryColor": "#BEC8C9",
                    "shortName": "SA",
                    "mascott": "NONE",
                    "division": "NONE",
                    "conference": "NONE",
                    "league": "NONE",
                    "gender": "Male",
                    "level": "Professional",
                    "scheduleText": "Schedule",
                    "newsText": "Latest News"
                }

            }
        ];

        var res = angular.toJson(dayGames);
        return [200, res, {}];
    });


    $httpBackend.whenGET(/VersionService\/\webresources\/\VersionService/).respond(function (method, url, data, headers) {
        return [200, [], {}];
    });


    $httpBackend.whenGET(/GetControllersService\/\webresources\/\GetControllersService/).respond(function (method, url, data, headers) {
        var controllers = [
            {netvControllerId: "1", netvControllerName: "Controller #1 - Channel A"},
            {netvControllerId: "2", netvControllerName: "Controller #2 - Channel B"},
            {netvControllerId: "3", netvControllerName: "Controller #3 - Channel C"},
            {netvControllerId: "4", netvControllerName: "Controller #4 - Channel D"}
        ];

        var res = angular.toJson(controllers);
        return [200, res, {}];
    });


    $httpBackend.whenGET(/GetPromotionsBetweenDateService\/\webresources\/\GetPromotionsBetweenDateService/).respond(function (method, url, data, headers) {
        var promos = [
            {"promoId": 5, "venueId": 1, "promoType": "NO_PROMO", "teamId": 0, "promoText": "Txt1111", "promoDuration": 600, "promoStartDate": "2015-07-18 05:00:00.0", "promoEndDate": "2015-07-19 05:15:00.0", "userId": 0, "promoRunDuration": 0, "promoRunFrequency": 0, "promoUsageFrequency": 0, "imageFileName": "transparent-drums-wallpapers_5841_1600x1200-1437267231138.jpg", "promoTrigger": "NO_PROMO", "promoEvent": "1251", "isExpired": false, "gameId": 1251}
        ];

        var res = angular.toJson(promos);
        return [200, res, {}];
    });


    $httpBackend.whenGET(/GetPromotionsOnDateService\/\webresources\/\GetPromotionsOnDateService/).respond(function (method, url, data, headers) {

        var incrementDate = function (date, incr) {
            date.setDate(date.getDate() + incr);
            return date;
        };

        var promos = [

            {

                "promoId": 5,
                "venueId": 1,
                "promoType": "PRE_GAME",
                "teamId": 0,
                "promoText": "Txt",
                "promoDuration": 600,
                "promoStartDate": "2015-07-16 00:00:00.0",
                "promoEndDate": "2015-07-16 09:01:00.0",
                "userId": 0,
                "promoRunDuration": 0,
                "promoRunFrequency": 0,
                "promoUsageFrequency": 0,
                "imageFileName": "",
                "isExpired": false,
                "gameId": 18625

            },
            {

                "promoId": 6,
                "venueId": 1,
                "promoType": "PRE_GAME",
                "teamId": 0,
                "promoText": "Txt",
                "promoDuration": 600,
                "promoStartDate": "2015-07-16 07:00:00.0",
                "promoEndDate": "2015-07-16 10:01:00.0",
                "userId": 0,
                "promoRunDuration": 0,
                "promoRunFrequency": 0,
                "promoUsageFrequency": 0,
                "imageFileName": "",
                "isExpired": false,
                "gameId": 18625

            },
            {

                "promoId": 7,
                "venueId": 1,
                "promoType": "DEFAULT_PROMO",
                "teamId": 0,
                "promoText": "Txt",
                "promoDuration": 600,
                "promoStartDate": "2015-07-16 00:00:00.0",
                "promoEndDate": "2015-07-16 11:01:00.0",
                "userId": 0,
                "promoRunDuration": 0,
                "promoRunFrequency": 0,
                "promoUsageFrequency": 0,
                "imageFileName": "",
                "isExpired": false,
                "gameId": 18625

            },
            {

                "promoId": 8,
                "venueId": 1,
                "promoType": "DEFAULT_PROMO",
                "teamId": 0,
                "promoText": "Txt",
                "promoDuration": 600,
                "promoStartDate": "2015-07-16 00:00:00.0",
                "userId": 0,
                "promoRunDuration": 0,
                "promoRunFrequency": 0,
                "promoUsageFrequency": 0,
                "imageFileName": "",
                "isExpired": false,
                "gameId": 18625

            }

        ];

        var res = angular.toJson(promos);
        return [200, res, {}];
    });


    $httpBackend.whenGET(/GetPromotionTriggersService\/\webresources\/\GetPromotionTriggersService/).respond(function (method, url, data, headers) {
        var triggers = {
            "1Q": "Start of 1st Qtr",
            "2X": "End of 2nd Half",
            "2F": "2 minutes before Halftime",
            "5E": "5 minutes before End of Game",
            "GO": "Game Over",
            "PR": "Pre Game"
        };
        var res = angular.toJson(triggers);
        return [200, res, {}];
    });


    $httpBackend.whenGET(/GetPromotionEventsService\/\webresources\/\GetPromotionEventsService/).respond(function (method, url, data, headers) {
        var events = ["Game"];
        var res = angular.toJson(events);
        return [200, res, {}];
    });

    $httpBackend.whenGET(/GetSportsService\/\webresources\/\GetSportsService/).respond(function (method, url, data, headers) {
        var sports = [
            {"sportId": 2, "sportName": "Basketball"},
            {"sportId": 3, "sportName": "Football"}
        ];
        var res = angular.toJson(sports);
        return [200, res, {}];
    });


    $httpBackend.whenPOST(/PostPromotionService\/\webresources\/\PostPromotionService/).respond(function (method, url, data) {
        var promo = angular.fromJson(data);
        if (promo) {
            var res = null;
            if (promo && promo.promoId && promo.promoId != null) {
                res = angular.toJson(promo);
                return [200, res, {}];
            }

            if (promo.promoId === null) {
                promo.promoId = Math.floor((Math.random() * 100) + 1);
                res = angular.toJson(promo);
                return [200, res, {}];
            }

            promo["errorMessage"] = "Invalid promo";
            var res = angular.toJson(data);
            return [200, res, {}];
        } else {
            return [404, "Invalid promo", {}];
        }

    });


    $httpBackend.whenPOST(/DeletePromotionService\/\webresources\/\DeletePromotionService/).respond(function (method, url, data) {
        var promo = angular.fromJson(data);
        if (promo) {
            return [200, {"message": "Promotion Deleted Successfully"}, {}];
        } else {
            return [404, {"errorMessage": "Invalid promo"}, {}];
        }
    });

    $httpBackend.whenPOST(/PostControllerAssignmentsService\/\webresources\/\PostControllerAssignmentsService/).respond(function (method, url, data) {
        return [200, {"message": "Game Selection Saved"}, {}];
    });

    $httpBackend.whenPOST('api/promo/uploadImage').respond(function (method, url, data, headers) {
        return [200, "image_saved.jpg", {}];
    });


    $httpBackend.whenGET(/DeletePromotionService\/\webresources\/\DeletePromotionService/).respond(function (method, url, data) {
        return [200, {}, {}];
    });


    $httpBackend.whenGET(/index.html\//).passThrough();
    $httpBackend.whenGET(/views\//).passThrough();


});

