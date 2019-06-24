const path = require('path');
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

let ROOT_DIR = __dirname;
let ALLOWED_DEPTH = 1;
const installedPackages = [];

const isDirectory = dir => fs.lstatSync(dir).isDirectory();
const getDirectories = dir => fs.readdirSync(dir).map(name => path.join(dir, name)).filter(isDirectory);
const nextModules = dir => path.join(dir, 'node_modules');

const runInstall = async () => {
    console.log('Installing on', process.cwd());
    const { stdout, stderr } = await exec('npm i');

    if (stderr) {
      console.error(`error: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
}

const getNextDirectory = () => {
    const currentDir = process.cwd();
    const parentModulesDir = path.join(currentDir, '../');
    const parentDir = path.join(currentDir, '../../');
    const directories = getDirectories(parentModulesDir);
    const nextSiblingDir = directories[directories.indexOf(currentDir) + 1];
    const isRootDir = ROOT_DIR.length > parentDir.length;
    if (nextSiblingDir) {
        return nextSiblingDir;
    }
    else if (!isRootDir) {
        return parentDir;
    }
    else {
        console.log('END PROCESS');
        process.exit();
    }
};

const installAll = (dir, isRoot, allowedDepth) => {

    if(allowedDepth) {
        ALLOWED_DEPTH = allowedDepth;
    }

    if(isRoot) {
        ROOT_DIR = dir;
    }

    const goToNextDirectory = () => {
        try {
            process.chdir(getNextDirectory());
            return installAll(process.cwd());
        } catch (err) {
            return console.error(`chdir: ${err}`);
        }
    };

    const alreadyInstalled = installedPackages.includes(path.basename(dir));
    const hasPackageJson = fs.existsSync(path.join(dir, 'package.json'));
    const hasModules = fs.existsSync(path.join(dir, 'node_modules'));

    // console.log('alreadyInstalled', alreadyInstalled);
    // console.log('hasPackageJson', hasPackageJson);
    // console.log('hasModules', hasModules);

    if (!alreadyInstalled && hasPackageJson && !hasModules) {
        return runInstall()
            .then(() => {
                // storeDependencies()
                installedPackages.push(path.basename(dir));
                // console.log(installedPackages);
                const currentDepth = (dir.match(/node_modules/g) || []).length - (ROOT_DIR.match(/node_modules/g) || []).length;
                // console.log(currentDepth, dir)
                if (currentDepth === ALLOWED_DEPTH) {
                    return goToNextDirectory();
                }
                const modulesDir = nextModules(dir);
                const directories = getDirectories(modulesDir);
                try {
                    process.chdir(directories[0]);
                    installAll(process.cwd());
                } catch (err) {
                    console.error(`chdir: ${err}`);
                    return goToNextDirectory();
                }
            })
            .catch((err) => {
                console.log(err);
                goToNextDirectory();
            });
    }
    else {
        return goToNextDirectory();
    }
}

module.exports = {
    installAll
}
