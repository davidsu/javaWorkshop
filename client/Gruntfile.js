module.exports = grunt => {
    // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
    require('load-grunt-tasks')(grunt);

    var configs = require('load-grunt-configs')(grunt);
    grunt.initConfig(configs);

    grunt.registerTask('build', ['copy:internal'])
    grunt.registerTask('default', ['build', 'copy:toResources']);
};