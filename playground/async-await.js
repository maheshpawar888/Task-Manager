require('../src/db/mongodb');
const Task = require('../src/model/task');

const deletetaskandCound = async(id) =>{
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed:false })
    return result = {
        count,
        task
    }
}

deletetaskandCound('6056ef3a4faa8e21476b10ca')
    .then( (result) => {
        console.log(result)
    })
    .catch( (err)=> {
        console.log(err)
    })