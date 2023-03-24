const {default: mongoose} = require('mongoose')

const dbConnect = () => {
    try {
        const connect = mongoose.connect(process.env.DB);
        console.log('Success')
    } catch (error) {
        console.log('error')
    }
};
module.exports=dbConnect;