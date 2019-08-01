// This is a Masonry layout libray 
// Maybe it is another rebuild-the-wheel, but I think it would become a cool project or an art !? Oh .forgot it ...
// So.... here comes the rocket

import React, { ReactNode, CSSProperties, useState, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import ResizeObserver from 'resize-observer-polyfill';


type Props = {
    items: any[]
    columnWidth: number
    width?:number
    height?: number
    gutterWidth?: number
    children?: (props: childrenProps)=> ReactNode
}

type childrenProps = {  
    index:number
    style: CSSProperties
    ref: any
    item: any
}





type LayoutDesignerProps = {
    width: number
    columnWidth: number
    gutterWidth: number
    heightStore: WeakMap<any,number>
    items: any[]
}


type Layout = {
    positionStore: WeakMap< any, Position>
    indexColumns: Array<Array<number>> 
    height: number
}

type Position ={
    top: number
    left: number
    bottom: number
}


const translate = ( position: Position ) => {
    const style :CSSProperties = {
        position: 'absolute',
        visibility: 'hidden'
    }
    if(position){
        style.visibility= 'visible'
        style.transition= '0.2s ease-in-out'
        style.top = position.top
        style.left = position.left
    }
    return style
}



const defaultLayout = (columnNum:number ) :Layout=>{

    let height = 0
    const positionStore = new WeakMap()
    const indexColumns = new Array(columnNum).fill(null).map(e=> new Array()) 
    return {positionStore, indexColumns, height}
} 


const caculateLayout = ( props:LayoutDesignerProps) : Layout =>{
    const { width, columnWidth, gutterWidth, heightStore, items } = props

    const columnNum = Math.floor(width/(columnWidth+gutterWidth))
    const offset = (width - columnNum*(columnWidth+gutterWidth) + gutterWidth)/2
    let {height, positionStore, indexColumns} = defaultLayout(columnNum)

    if(columnNum>0){
        items.map(( item,index)=>{
            // fill the empty column first
            if(index < columnNum){
                const position = { 
                    top: 0, 
                    left: (columnWidth+ gutterWidth)*index + offset,
                    bottom: heightStore.get(item) 
                }
                height = Math.max(height, position.bottom)
                positionStore.set(item, position)
                indexColumns[index].push(index)
            }
            // compare the bottom of each column
            else{
                const lastIndexs = indexColumns.map(column=> column.slice(-1)[0])
                const bottomValues = lastIndexs.map( index=> positionStore.get(items[index]).bottom)
                
                const lightestColumn = bottomValues.indexOf(Math.min(...bottomValues))
                const refItemIndex = lastIndexs[lightestColumn]
                const refPosition = positionStore.get(items[refItemIndex])
                
                const position = {
                    top: refPosition.bottom+ gutterWidth,
                    left: refPosition.left,
                    bottom:  refPosition.bottom+ gutterWidth + heightStore.get(item)
                }
                
                height = Math.max(height, position.bottom)
                positionStore.set(item,position)
                indexColumns[lightestColumn].push(index)
            }
        })
    }
        

    return {positionStore, indexColumns,height}
}



const Masonry: React.FC<Props> = (props) => {
    const { 
        items, 
        children,
        columnWidth = 236,
        gutterWidth = 25
    } = props
    
    const heightStore = new WeakMap()
    const [ layout, setLayout] = useState(defaultLayout(0))
    const [ containerWidth, setContainerWidth ] = useState(0)
    const ContainerEl = useRef()

    const MeasurerEl = (item:any, el:HTMLDivElement)=>{
        if(el){ 
            heightStore.set(item, el.getBoundingClientRect().height)
        }
    }

    // handle onReside 
    useLayoutEffect(()=>{
        const observer = new ResizeObserver((entries)=>{
            const newWidth = entries[0].contentRect.width
            
            if( containerWidth!== newWidth ){
                const newLayout  = caculateLayout({ 
                    width: newWidth,
                    columnWidth, 
                    gutterWidth, 
                    heightStore, 
                    items 
                })
                setContainerWidth(newWidth)
                setLayout(newLayout)  
            }    
        })
        observer.observe(ContainerEl.current)
        return() =>{
            observer.disconnect()
        }
    }, [items, containerWidth])

    // handle items
    useLayoutEffect(()=>{ 
        const newLayout  = caculateLayout({ 
            width: containerWidth,
            columnWidth, 
            gutterWidth, 
            heightStore, 
            items 
        })
        setLayout(newLayout)
    },[items])

    return(
        <div style={{position: 'relative', height: layout.height}} ref={ContainerEl}>
        {items.map( (item,index)=>
            children({
                index, 
                style: translate(layout.positionStore.get(item)),
                ref: MeasurerEl.bind(this,item),
                item: item
            })
        )}
        </div>
    )
}



export default Masonry