var execSync = require('child_process').execSync;
var path = require('path');
var expect = require('chai').expect;
var fs = require('fs');

const paths = {
  'package': path.resolve('test/package'),
  'packagejson': path.resolve('test/package/package.json'),
  'parentpackage': path.resolve('test/parentpackage'),
  'parentpackagejson': path.resolve('test/parentpackage/package.json'),
};

const originalPackageJSON = fs.readFileSync(paths.packagejson, 'utf8');
const originalParentPackageJSON = fs.readFileSync(paths.parentpackagejson, 'utf8');

describe("setup.test.js", () => {

  // restore the originals package.json
  after(() => {
    fs.writeFileSync(paths.packagejson, originalPackageJSON, "utf8");
    fs.writeFileSync(paths.parentpackagejson, originalParentPackageJSON, "utf8");
  })

  it("doesn't run setup if not in development environment", function(done) {
    this.timeout(10000);
    const proc = execSync("cross-env NODE_ENV=production npm install " + path.resolve(__dirname, "../"), { cwd: paths.package });
    const package = JSON.parse(fs.readFileSync(paths.packagejson, 'utf8'));
    expect(package.collective).to.not.exist;
    done();
  });

  it("run setup and add postinstall script and collective info to package.json", function(done) {
    this.timeout(10000);
    const proc = execSync("cross-env OC_POSTINSTALL_TEST=true npm install --save " + path.resolve(__dirname, "../"), { cwd: paths.package });
    // const setup = execSync("cross-env OC_POSTINSTALL_TEST=true npm run setup", { cwd: paths.postinstallpackage });
    const package = JSON.parse(fs.readFileSync(paths.packagejson, 'utf8'));
    expect(package.collective).to.exist;
    expect(package.scripts.postinstall).to.equal("opencollective-postinstall || exit 0");
    expect(package.collective.type).to.equal("opencollective");
    expect(package.collective.url).to.equal("https://opencollective.com/testpackage");
    expect(package.collective.logo).to.equal("https://opencollective.com/opencollective/logo.txt");
    expect(package.dependencies).to.have.property("opencollective-postinstall");
    done();
  })

  it("runs the postinstall script after npm install", function(done) {
    this.timeout(10000);
    const proc = execSync("npm install", { cwd: paths.package });
    const stdout = proc.toString('utf8');
    expect(stdout).to.contain("*** Thank you for using testpackage! ***");
    expect(stdout).to.contain("https://opencollective.com/testpackage/donate");
    done();
  });

  it("installs a package that has opencollective-postinstall", function(done) {
    this.timeout(10000);
    const proc = execSync("cross-env DEBUG=postinstall npm install --save " + path.resolve(__dirname, "package"), { cwd: paths.parentpackage });
    const stdout = proc.toString('utf8');
    const package = JSON.parse(fs.readFileSync(paths.parentpackagejson, 'utf8'));
    expect(package.dependencies).to.have.property("testpackage");
    expect(stdout).to.contain("https://opencollective.com/testpackage/donate");
    done();
  });
});