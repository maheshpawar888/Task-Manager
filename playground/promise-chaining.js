require('../src/db/mongodb');
const Task = require('../src/model/task');

Task.findByIdAndDelete('6056e25934599f1770298d94')
    .then((result) => {
        console.log('Removed Successfully',result)
        return Task.countDocuments({ completed:false })
    }).then( (count)=>{
        console.log(count);
    }).catch( (e)=>{
        console.log(e)
    })

