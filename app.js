#!/usr/bin/env node

/********************
 * Node-Reddit
 *
 * A simple CLI app that reads in Reddit's frontpage and colorizes it
 *
 * by Kamran Ayub
 ********************/

var cli     = require('cli'),
	  http    = require('http'),
	  request = require('request'),
	  colors	= require('colors');

cli.main(function (args, options) {
	console.log("***********".rainbow);
	console.log("Node Reddit".cyan);
	console.log("***********\n\n".rainbow);

	request('http://reddit.com/.json', function (err, res, body) {
		if (!err && res.statusCode === 200) {
			var reddit  = JSON.parse(body),
				  stories = reddit.data.children.map(function (s) { 
							        return s.data; 
						        });
			
			// Descending score
			stories.sort(function (a, b) { return b.score - a.score; });

			stories.forEach(function (story) {
				var row = "",
					title = story.title.length > 100
						    ? story.title.substr(0, 100) + "..." 
						    : story.title;

				// Build row
				// [score] [title] [comments] [subreddit]
				// This sucks
				row += story.score.toString().green + "\t";
				row += title.bold
				row += " (" + story.domain + ")";
				row += (" /r/" + story.subreddit).cyan;
				row += "\n\t";
				row += story.author.grey;			
				row += " " + (story.num_comments + " comments").italic.yellow;
				row += "\n";

				console.log(row);
			});
		}
	});
});