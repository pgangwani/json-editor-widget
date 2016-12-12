/*
 *   Copyright 2016 CoNWeT Lab., Universidad Politecnica de Madrid
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

var ConfigParser = require('wirecloud-config-parser');
var parser = new ConfigParser('src/config.xml');

module.exports = function (grunt) {

    'use strict';

    grunt.initConfig({

        metadata: parser.getData(),

        bower: {
            install: {
                options: {
                    bowerOptions: {
                        production: true
                    },
                    layout: function (type, component, source) {
                        return type;
                    },
                    targetDir: './build/lib/lib'
                }
            }
        },

        eslint: {
            operator: {
                src: 'src/js/**/*.js',
            },
            grunt: {
                options: {
                    configFile: '.eslintrc-node'
                },
                src: 'Gruntfile.js',
            }
        },

        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'src/js', src: '*', dest: 'build/src/js'}
                ]
            }
        },

        strip_code: {
            multiple_files: {
                src: ['build/src/js/**/*.js']
            },
            imports: {
                options: {
                    start_comment: 'import-block',
                    end_comment: 'end-import-block'
                },
                src: ['src/js/*.js']
            }
        },

        compress: {
            operator: {
                options: {
                    mode: 'zip',
                    archive: 'dist/<%= metadata.vendor %>_<%= metadata.name %>_<%= metadata.version %>.wgt'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: [
                            'DESCRIPTION.md',
                            'css/**/*',
                            'doc/**/*',
                            'images/**/*',
                            'index.html',
                            'config.xml'
                        ]
                    },
                    {
                        expand: true,
                        cwd: 'build/lib',
                        src: [
                            'lib/**/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: 'build/src',
                        src: [
                            'js/**/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.',
                        src: [
                            'LICENSE'
                        ]
                    }
                ]
            }
        },

        clean: {
            build: {
                src: ['build', 'bower_components']
            },
            temp: {
                src: ['build/src']
            }
        },

        wirecloud: {
            options: {
                overwrite: false
            },
            publish: {
                file: 'dist/<%= metadata.vendor %>_<%= metadata.name %>_<%= metadata.version %>.wgt'
            }
        }

    });

    grunt.loadNpmTasks('grunt-wirecloud');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('gruntify-eslint');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-strip-code');
    grunt.loadNpmTasks('grunt-text-replace');

    grunt.registerTask('test', [
        'bower:install',
        'eslint'
    ]);

    grunt.registerTask('build', [
        'clean:temp',
        'copy:main',
        'strip_code',
        'compress:operator'
    ]);

    grunt.registerTask('default', [
        'test',
        'build'
    ]);

    grunt.registerTask('publish', [
        'default',
        'wirecloud'
    ]);

};
