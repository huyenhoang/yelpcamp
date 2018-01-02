var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose");

// connect to db
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema)

/* Campground.create(
    {
        name: "Granite Hill",
        image: "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?auto=format&fit=crop&w=1050&q=80"
    
    }, function(err, campground) {
        if(err){
            console.log(err);
        } else {
            console.log("Newly created campground: ");
            console.log(campground);
        }
    });

var campgrounds = [
    {name: "Salmon Creek", image: "https://images.unsplash.com/photo-1505735754789-3404132203ed?auto=format&fit=crop&w=1050&q=80"},
    {name: "Granite Hill", image: "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?auto=format&fit=crop&w=1050&q=80"},        
    {name: "Angel's Rest", image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?auto=format&fit=crop&w=1050&q=80"},
    {name: "Silver Falls", image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=1050&q=80"},
];*/

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    // get campground from db and then render
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
    // get data from form and add to the campground array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image}
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

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp started");
});
