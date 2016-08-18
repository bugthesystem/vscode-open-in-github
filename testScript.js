function call(command, args) {
    var util  = require('util'),
        spawn = require('child_process').spawn,
        cp    = spawn(command, args);

    cp.stdout.on('data', function (data) {
        console.log(data.toString());
    });

    cp.stderr.on('data', function (data) {
        console.log(data.toString());
    });

    cp.on('exit', function (code) {
        return process.exit(code);
    });
}

if(process.platform === "win32") {
    call("npm.cmd", ["run", "test:windows"]);
}
else {
    call("npm", ["run", "test:linuxOSX"]);
}
