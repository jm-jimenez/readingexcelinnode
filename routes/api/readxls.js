var keystone = require('keystone'),
	Excel = require('exceljs'),
	fs = require('fs'),
	Category = keystone.list('Category'),
	async = require('async');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	var workbook;
	var worksheet;
	var categoriesMap = {};

	var loadCategoriesFromColumn = function (index){
		var categorias = worksheet.getColumn(1);
		var cat = [];
		//console.log(categorias);
		categorias.eachCell(function (cell, rownumber){
			if (rownumber>1){
				var index = cat.length > 1 ? cat.length-1 : 0;
				if ((valor = cell.value) != cat[index]){
					cat.push(valor);
				}
			}
		});

		return cat;
	};

	var insertCategories = function (categories){

		console.log("Entro en insertCategories");

		async.each(categories, function(category, callback){
			var newCategory = new Category.model({name: category});
			newCategory.save(function(err, saved){
				categoriesMap[saved.name] = saved._id;
				callback();
			});
		}, function (err){
			if (err){
				console.log("ERROR");
			}

			else{
				console.log(categoriesMap);
			}
		});
	};

	workbook = new Excel.Workbook();
	workbook.xlsx.readFile(__dirname + "/input.xlsx")
		.then(function(){
			worksheet = workbook.getWorksheet(1);
			var cat = loadCategoriesFromColumn(1);
			insertCategories(cat);
		});
	
};