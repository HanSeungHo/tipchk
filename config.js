// Rinker default option
var ARGV = {
  PORT: process.env.PORT || 3000,
  WS : 'http://127.0.0.1:3000'
};

var SERVER = {
  PORT: 3000,
  WS : 'http://rinker.kr:3000'
}

// Console setting
process.argv.forEach(function (val, index, array) {
  if(val == '-p') {
    if(process.argv[index+1]){
      ARGV.PORT = process.argv[index+1];
    }else {
      console.log ('ERROR: node app -p [PORT]');
      process.exit();
    }
  }else if(val == 'server') {
    //Server setting
    ARGV = SERVER;
    console.log('-- SERVER SETTING --\n', ARGV);
  }else if(val == '-h') {
    console.log('-- Tipchk HELP --');
    process.exit();
  }
});

exports.ARGV = ARGV;