var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    Campground   = require("./models/campground"),
    Comment      = require("./models/comment"),
    seedDB       = require("./seeds");
    
// connect to db
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

// Landing page
app.get("/", function(req, res){
    res.render("landing");
});
// Index - show all campgrounds
app.get("/campgrounds", function(req, res){
    // get campground from db and then render
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// Create - Add new campground to DB 
app.post("/campgrounds", function(req, res){
    // get data from form and add to the campground array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    // Create a new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//Form for creating new campground
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

// Show more info about one campground
app.get("/campgrounds/:id", function(req, res){
    // find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else  {
            console.log(foundCampground);
            //rend show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});    
        }
    });
});

// =========
// Comments Routes
// =========

app.get("/campgrounds/:id/comments/new", function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
           console.log(err);
           res.redirect("/campgrounds");
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   //connect new comment to campground
                   campground.comments.push(comment);
                   campground.save();
                    //redirect to campground show page
                   res.redirect('/campgrounds/'+ campground._id);
               }
           });
       }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp started");
});
