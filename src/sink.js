
var through = require('through2'),
    BatchManager = require('./BatchManager'),
    config = require('pelias-config').generate();

function streamFactory( opts ){
  opts = opts || {};
  if( !opts.client ){ opts.client = require('./client')(); }

  // Empty dbclient will use defaults defined in source files.
  if( !opts.dbclient ) { opts.dbclient = config.dbclient || {}; }

  var manager = new BatchManager( opts );

  var stream = through.obj( function( item, enc, next ){
    manager.push( item, next );
  }, function(next) {
    manager.end(next);
  });

  // export client
  stream.client = opts.client;

  return stream;
}

module.exports = streamFactory;
