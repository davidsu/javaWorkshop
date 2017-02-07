module.exports.tasks = {
    babel: {
        options: {
            plugins: ['transform-react-jsx'],
            presets: [/*'es2015',*/ 'react']
        },
        jsx: {
            files: [{
                expand: true,
                cwd: 'src/', // Custom folder
                src: ['**/*.jsx'],
                dest: 'target/', // Custom folder
                ext: '.js'
            }]
        }
    }
}