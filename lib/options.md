# Dustjs Helper - options

Loads an option value:

    {@options key="my-test" resource="/models/example/test.json" /}

The JSON file would look something like:
    
    {
        "my-test": "My Test",
        "other-option": 1234
    }

If you are re-using this dustjs template on the browser (using browserify), make sure the json file is required when compiling. 

Using Grunt-Browserify:

    module.exports = function browserify(grunt) {
        grunt.loadNpmTasks('grunt-browserify');

        return {
            build: {
                files: grunt.file.expandMapping('public/js/*.js', '../htdocs/js/', {
                    flatten: true,
                    ext: '.js'
                }),
                options: {
                    watch: false,
                    keepAlive: false,
                    debug: true,
                    require: [
                        './models/example/test.json'
                    ]
                }
            }
        };
    };