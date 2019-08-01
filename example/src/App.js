import React from 'react'
import Masonry from '../../src/Masonry'


const items=[
    { name: 'john'},
    { name: 'Alice'},
    { name: 'Peter'},
    { name: 'Whatever'}
]



const App = ()=>{
    return (
        <div>
            <div>Display Masonry </div>
            <Masonry items={items} columnWidth={300}>
            { ({index,item,style,ref})=>
                <div key={index} ref={ref} style={style}>
                    <div style={{sbackgroundColor:'whitesmoke'}}>
                        <div>{item.name}</div>
                    </div>
                </div>
            }
            </Masonry>

        </div>
    )
}



export default App