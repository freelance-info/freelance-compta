// Required to use 'fs' module without ejecting create-react-app config
// https://github.com/facebook/create-react-app/issues/6782 
module.exports = {
    webpack: {
        configure: {
            target: 'electron-renderer'
        }
    }
};
