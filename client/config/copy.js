module.exports.tasks = {
    copy:{
        internal: {
            files: [{
                expand: true,
                cwd: 'src/',
                src: ['**'],
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