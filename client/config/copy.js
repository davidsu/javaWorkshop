module.exports.tasks = {
    copy:{
        internal: {
            files: [{
                expand: true,
                cwd: 'src/',
                src: ['**/*.html'],
                dest: 'target/'
            }]
        },
        toResources: {
            files:[{
                expand: true,
                cwd: 'target/',
                src: ['**'],
                dest: '../src/main/resources'
            }]
        }
    }
}