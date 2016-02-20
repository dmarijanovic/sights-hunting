var express = require('express');
var multiparty = require('multiparty');
var aws = require('aws-sdk');

module.exports = function(router) {
    
    router.route('/users/:user_id/files')
        .post(function(req, res) {
            console.log('files controller');

            var form = new multiparty.Form();
 
            form.parse(req, function(err, fields, files) {
                /*res.writeHead(200, {'content-type': 'text/plain'});
                res.write('received upload:\n\n');
                console.log(fields);
                console.log(files);
                res.end();*/
                var path, mapId;
                
                Object.keys(fields).forEach(function(name) {
                    //mapId = fields[name][0]._id;
                    console.log(fields[name][0]);
                });
                
                Object.keys(files).forEach(function(name) {
                    //path = files[name][0].path;
                    console.log(files[name][0].path);
                });
                console.log('File upload for map')
                
                res.json({ message: 'OK' })
                //res.end(util.inspect({fields: fields, files: files}));
            });
        });
}