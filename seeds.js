var mongoose    = require("mongoose");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment");

var data = [
    { 
        name: "Cloud's Rest", 
        image: "https://images.unsplash.com/photo-1484960055659-a39d25adcb3c?auto=format&fit=crop&w=1050&q=80",
        description: "A great place to sleep outdoor"
    },
    { 
        name: "Jupiter Peak", 
        image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?auto=format&fit=crop&w=1050&q=80",
        description: "A great place to view the stars"
    },
    { 
        name: "Cannon Park", 
        image: "https://images.unsplash.com/photo-1455763916899-e8b50eca9967?auto=format&fit=crop&w=1050&q=80",
        description: "Starry skies by the desert sand"
    },
    { 
        name: "Alabama Peak", 
        image: "https://images.unsplash.com/photo-1499363145340-41a1b6ed3630?auto=format&fit=crop&w=1050&q=80",
        description: "Not the same as the Alabama Hills but still a great camping site"
    }
]

function seedDB(){
    //remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } 
        console.log("removed campgrounds!");
        //add new campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a new campground");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great but I wish there was WiFi",
                            author: "James"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    });
}

module.exports = seedDB;