const {add} = require('../math');

test('Addition',()=>{
    const result = add(1)
    expect(result).toBe(3)
})