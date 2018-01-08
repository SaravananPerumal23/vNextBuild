import { expect } from "chai";
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
import "mocha";

import { findFiles,
  ProcessFile,
  getSplitVersionParts
} from "../src/AppyVersionToJSONFileFunctions";

import fs = require("fs");
const copyFileSync = require("fs-copy-file-sync");
const del = require("del");

describe ("Find files tests", () => {

  it ("should be able to find one file", () => {
      var filelist = findFiles ("test/testdata", "package.json.initial" , filelist);
      expect(filelist.length).to.equal(1);
  });
});

describe ("Version number split tests", () => {

  it ("should be able to get version name with . delimiters", () => {
      var actual = getSplitVersionParts ("\d+.\d+.\d+.\d+", "{1}.{2}.{3}", "7.6.17334.5");
      expect(actual).to.equal("7.6.17334");
  });

  it ("should be able to get version name with complex delimiters", () => {
      var actual = getSplitVersionParts ("\d+.\d+.\d+.\d+_\d+", "{1}-{2}-{3}", "2017.12.5.1_11760");
      expect(actual).to.equal("2017-12-5");
   });

});

describe("Test the update file processing", () => {
    before(function() {
      // make a copy we can overright with breaking test data
      copyFileSync("test/testdata/package.json.initial", "test/testdata/package.json");
    });

    it("should be able to update a version in a file", () => {
      var file = "test/testdata/package.json";
      ProcessFile(file, "version", "1.2.3");

      var editedfilecontent = fs.readFileSync(file);
      var expectedfilecontent = fs.readFileSync(`${file}.expected`);

      expect(editedfilecontent.toString()).equals(expectedfilecontent.toString());
    });

    after(function() {
      // remove the file if created
      del.sync("test/testdata/*.json");
    });
  }
);

describe("Test the add tag file processing", () => {
  before(function() {
    // make a copy we can overright with breaking test data
    copyFileSync("test/testdata/package.json.noversion.initial", "test/testdata/package.json");
  });

  it("should be able to update a version in a file", () => {
    var file = "test/testdata/package.json";
    ProcessFile(file, "version", "1.2.3");

    var editedfilecontent = fs.readFileSync(file);
    var expectedfilecontent = fs.readFileSync(`${file}.noversion.expected`);

    expect(editedfilecontent.toString()).equals(expectedfilecontent.toString());
  });

  after(function() {
    // remove the file if created
    del.sync("test/testdata/*.json");
  });
}
);