//REQUIRE-------------------------------------------------------------------------------------------------------
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); 

//USE------------------------------------------------------------------------------------------------------------
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/animal_dash');

//SCHEMA--------------------------------------------------------------------------------------------------------
var MemberSchema = new mongoose.Schema({
	name: String,
	type: String
})
var Member = mongoose.model("Member",MemberSchema);

//ROUTES--------------------------------------------------------------------------------------------------------
app.get('/', function(req, res){ 														//render root view. 
    Member.find({}, function(err,members){			//use RENDER when calling a view page.
    	if(err){
    		console.log("couldn't find members in db oh noes.");
    	}
    	else{
    		res.render('index',{"members":members});
    	}	
    })
})

app.get("/new", function(req,res){														//render add form view.
	res.render("new");												
})

app.post("/", function(req,res){														//add new member to db.
	var member = new Member(
		{
			name: req.body.name, 
			type: req.body.type
		});
	member.save(function(err){
		if(err){
			console.log("Couldn't save this animal :(");
		}
		else{
			console.log("New member saved! SQUADSQUADSQUAD");
			res.redirect("/"); 						//use REDIRECT when coming back here for route.
		}
	})
});

app.get("/:id", function(req,res){											//render individual member's view.
	Member.find({_id: req.params.id}, function(err, member){
		if(err){
			console.log("either this member DNE or something else wrong.");
		}
		else{
			res.render("show", {"member":member[0]});
		}
	})
})

app.get("/:id/edit", function(req,res){								//render individual member's edit form view.
	Member.find({_id: req.params.id}, function(err, member){
		if(err){
			console.log("either this member DNE or something else wrong.");
		}
		else{
			res.render("edit", {"member":member[0]});
		}
	})
})

app.post("/:id", function(req,res){											//update member info in db.
	Member.update({_id: req.params.id}, req.body, function(err, result){
		if(err){
			console.log("couldn't update member info.");
		}
		else{
			res.redirect("/");
		}
	})
})

app.get("/:id/destroy", function(res,req){ 										//delete member from db
	Member.remove({_id: req.params.id}, function(err, result){
		if (err){
			console.log("Can't delete member.");
		}
		else{
			console.log("FINE, LEAVE US.");
			res.redirect("/");
		}
	})
})


//mysterious PROMISE thing--------------------------------------------------------------------------------------
mongoose.Promise = global.Promise;

//SERVER LISTEN-------------------------------------------------------------------------------------------------
app.listen(8000, function(){
	console.log("Animal Squad is in your 8000");
})



