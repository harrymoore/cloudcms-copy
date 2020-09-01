// node app-assets.js input-xlsx-path group artifact version
require('dotenv').config();
const fs = require('fs');
const PACKAGER = require("cloudcms-packager");

const inputFolder = process.argv[1]; // path to category folder containing content
const group = process.argv[2];
const artifact = process.argv[3];
const version = process.argv[4];

PACKAGER.create({
    outputPath: "./",
    archiveGroup: group,
    archiveName: artifact,
    archiveVersion: version
}, function(err, packager) {
    if (err) {
        return console.error(err);
    }

    // need to add all the category and sub categories here in case they are referenced by the assets
    var categoryData = require(inputJSON);
    var categoryByName = {};
    var subCategoryByName = {};
    categoryData.forEach(json => {
        packager.addNode(json)
        if (json._type == "dvor:category") {
            categoryByName[json.title.toLowerCase()] = json._alias;
        }
        if (json._type == "dvor:subcategory") {
            subCategoryByName[json.title.toLowerCase()] = json._alias;
        }
    });

    // read assets from excel
    let inputData = parseInput(inputExcel);
    
    inputData.forEach(json => {
        let assetNode = new ASSET(json);
        if (assetNode.title == "Women with flowers") debugger;
        if (assetNode.title || assetNode.binderId) {
            if (assetNode.category) {
                console.log(`assetNode.category: ${assetNode.category}`);
                // find the referenced category
                if (categoryByName[assetNode.category]) {
                    console.log(`setting category related node alias to: ${categoryByName[assetNode.category]}`);
                    assetNode.category = {
                        "__related_node__": categoryByName[assetNode.category]
                    };
                } else {
                    // couldn't find the category
                    console.log(`Could not find category "${assetNode.category}" for node with binder id: "${assetNode.binderId}" and title: "${assetNode.title}". Assigning it to "Art"`);
                    assetNode.category = {
                        __related_node__: categoryByName["art"]
                    };
                }
            }
            if (assetNode.subCategory) {
                console.log(`assetNode.subCategory: ${assetNode.subCategory}`);

                // find the referenced subCategory
                if (subCategoryByName[assetNode.subCategory]) {
                    console.log(`setting subCategory related node alias to: ${subCategoryByName[assetNode.subCategory]}`);
                    assetNode.subCategory = {
                        __related_node__: subCategoryByName[assetNode.subCategory]
                    };
                } else {
                    console.log(`Could not find subCategory "${assetNode.subCategory}" for node with binder id: "${assetNode.binderId}" and title: "${assetNode.title}". Not assigning it to sub category`);
                    delete assetNode.subCategory;
                }
            }
            if (assetNode.subCategory == "") {
                delete assetNode.subCategory;
            }

            packager.addNode(assetNode);
        } else {
            // let result = packager.addNode(assetNode);
            // console.log("asset node does not have title or binder id: " + JSON.stringify(assetNode, null, 2));
        }
    });

    // package up the archive
    packager.package(function(err, info) {
        if (err) {
            return console.error(err);
        }
        console.log("All done - wrote file: " + info.filename);
    });
});

function parseInput(xlsxSource) {
    if (!fs.existsSync(xlsxSource)) {
        console.log("Input file not found: " + xlsxSource);
        return;
    }

    const result = excelToJson({
        sourceFile: xlsxSource,
        header: {
            rows: 1
        }
    });

    // just keep the first tab
    let list = result[Object.keys(result)[0]];

    // console.log("node list from input file: " + JSON.stringify(list, null, 2));
    return list;
}

function ASSET(json) {
    this._type = "dvor:asset";
    this.title = s(json.D);
    this.binderId = s(json.C);
    this.assetAltTitle = s(json.G);
    this.summary = s(json.O);

    // this._alias = "dvor:asset_" + this.binderId + "_" + this.title;
    // this._key = this._alias;
    this._existing = {
        _type: "dvor:asset",
        title: this.title,
        binderId: this.binderId
    };

    this.assetComplete = false;
    this.lastNameOrModel = s(json.A);
    this.firstNamemake = s(json.B);
    this.currentLocation = s(json.E);
    this.proof = b(json.F);
    this.status = e(json.H, "in progress");
    this.category = s(json.I);
    this.subCategory = s(json.J);
    this.sizeOrMark = s(json.K);
    this.germanTook = b(json.L);
    this.foreign = b(json.M);
    this.boughtFrom = s(json.N);
};

// string value using supplied default
function s(str, alt="") {
    if (typeof str === 'undefined') return "";
    return (""+str).trim() || alt;
}

// boolean value from string "yes" | "no"
function b(str) {
    return s(str, "no").toUpperCase() === "YES"
}

// enum string value
function e(str, alt) {
    str = s(str, alt).toLowerCase();
    if (str == "") str = alt;
    return str;
}
