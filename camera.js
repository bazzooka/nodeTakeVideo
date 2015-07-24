// Command is ffmpeg -f avfoundation -i "default" -c copy rawd.avi \ -c:v libx264 -preset veryfast -qp 0  encodedd.mp4
// var spawn = require('child_process').spawn;

// // Make the child sleep for 3000 miliseconds
// var child = spawn('ffmpeg', ['-y', '-duration', '0:02', '-f', 'avfoundation', '-i',  'default', '-c', 'copy', 'raw.avi' /*'\ -c:v libx264, '-preset', 'veryfast', '-qp', '0', 'encoded.mp4'*/]);


// child.stdout.on('data', function (data) {
//   console.log('stdout: ' + data);
// });

// child.stderr.on('data', function (data) {
//   console.log('stderr: ' + data);
// });

// child.on('close', function (code) {
//   console.log('child process exited with code ' + code);
// });

// // Kill the child midway through its sleep.
// setTimeout(function () {
//     child.kill();
// }, 3000);

var ffmpeg = require('fluent-ffmpeg');

var Camera = {
    capture: function(duration, callback){
        console.log(typeof(duration));
        if(typeof(duration) === "function"){
            callback = duration;
            duration = '0:05';
        }

        var capture = ffmpeg('default') // See above article
        // Set input format (depends on OS, will not work if this isn't correct!)
        .inputFormat('avfoundation')
        // Set output format
        .format('avi')
        // Set size
        //.size(SIZE)
        // Set FPS
        //.fps(FPS)
        // Set video codec
        .videoCodec('libx264')
        // Record stream for 15sec
        .duration('0:05')
        //.addOption('-vf', 'movie='+wmimage+ ' [watermark]; [in] [watermark] overlay=0:0 [out]')
        .save('camera-recording.avi')
        .on('end', function(commandLine) {
            console.log('Capture finished: ');
            callback();
            // CONVERT
            // ffmpeg('./camera-recording.avi')
            //     .output('outputfile.mp4') 
            //     .save('outputfile.mp4')
            //     .on('end', function(command){
            //         console.log("Capure end");
            //         callback();
            //     })
        });        
    },

    screenshot: function(){
        var screenshot = ffmpeg("./camera-recording.avi")
        // setup event handlers
          .on('end', function(files) {
            console.log('screenshots were saved as ' );
          })
          .on('error', function(err) {
            console.log('an error happened: ' + err.message);
          })
          // take 2 screenshots at predefined timemarks
          .takeScreenshots({ count: 4, timemarks: [ '1', '2', "3", '4' ] }, './');
    }
}

module.exports = Camera;


