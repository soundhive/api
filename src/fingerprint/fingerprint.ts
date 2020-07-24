/* eslint-disable no-console */

import { execFile } from 'child_process';

export function getFingerprints() : void{
    execFile('src/fingerprint/bin/CPP_fingerprint_generator', ["arg1", "arg2"],
   (error, stdout, stderr) => {
    // This callback is invoked once the child terminates
    // You'd want to check err/stderr as well!
    if (stderr !== "") {
        console.log(stdout);
        return;
        
    }

    console.log("Here is the complete output of the program: ");
    console.log(stdout)
});
}

// this launches the executable and returns immediately

