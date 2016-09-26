var keystone = require('keystone'),
	Excel = require('exceljs'),
	fs = require('fs'),
	Category = keystone.list('Category'),
	Client = keystone.list('Client'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	var workbook;
	var worksheet;
	var categoriesMap = {};

	var loadCategoriesFromColumn = function (index){

		console.log(">>>>>>>>>>entro en loadCategoriesFromColumn");

		var categorias = worksheet.getColumn(1);
		var cat = [];
		categorias.eachCell(function (cell, rownumber){
			if (rownumber>1){
				var index = cat.length > 1 ? cat.length-1 : 0;
				if ((valor = cell.value) != cat[index]){
					cat.push(valor);
				}
			}
		});

		console.log("<<<<<<<<<<salgo de loadCategoriesFromColumn");

		return cat;
	};

	var insertCategories = function (categories){

		console.log(">>>>>>>>>>>entro en insertCategories");

		async.each(categories, function(category, callback){

			Category.model.findOne({name: category}, function (err,exists){
				if (!exists){
					new Category.model({name: category}).save(function (err, saved){
						categoriesMap[saved.name] = saved._id;
						callback();
					});
				}
				else{
					categoriesMap[exists.name] = exists._id;
					callback(err);
				}
			});
		}, function(err){

		});
	};

	var startTaskAsyncally = function (categories){
		console.log ("startTaskAsyncally");
		async.waterfall([
			function (callback){
				async.each(categories, function(category, next){

					Category.model.findOne({name: category}, function (err,exists){
						if (!exists){
							new Category.model({name: category}).save(function (err, saved){
								categoriesMap[saved.name] = saved._id;
								console.log("adljshgsjdgyshdgkjshgjk");
								next();
							});
						}
						else{
							categoriesMap[exists.name] = exists._id;
							next(err);
						}
					});
				}, function (err){
					if (!err){
						callback(null, "He llegado hasta aquí.");
					}
					else{
						console.log ("morí");
					}

				});
			},
			loadUsers,
			insertUsers
		], function (err, result){
			if(!err){
				console.log(result);
				res.send(true);

			}
			else{
				console.log(err);
			}
		});
	};

	var insertUsers = function (users, callback){

		console.log(">>>>>>>>>entro en insertUsers");
		console.log(categoriesMap);

		async.each(users, function(user, next){
			Client.model.findOne({name: user.name}, function (err, exists){
				if (!exists){
					new Client.model({category: categoriesMap[user.category], name: user.name}).save(function (err, saved){
						next;
					});
				}
				else {
					next(err);
				}
			})
		}, function (err){
			if(err){
				//console.log(err);
			}
			else {
				console.log("<<<<<<<<<<salgo de insertUsers");
				callback(null, "bitttccchh");
			}
		});

	};

	var loadUsers = function (arg1, callback){

		console.log(">>>>>>>>>>>entro en loadUsers");

		var users = [];
		worksheet.eachRow(function(row, rownumber){
			if (rownumber >1){
				var currentUser = {};
				row.eachCell(function(cell, colNumber){
					switch (colNumber){
						case 1:
							currentUser.category = cell.value;
							break;
						case 2:
							currentUser.name = cell.value;
							break;
					}
				});

				users.push(currentUser);
			}
		});
		callback(null, users);
		console.log("<<<<<<<salgo de loadUsers");
	};

	workbook = new Excel.Workbook();
	workbook.xlsx.readFile(__dirname + "/input.xlsx")
		.then(function(){
			console.log("antes de nada");
			worksheet = workbook.getWorksheet(1);
			var cat = loadCategoriesFromColumn(1);
			startTaskAsyncally(cat);
		});
	
};