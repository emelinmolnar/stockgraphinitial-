import React, { useRef } from 'react';


function Input(props, ref) {
    
    return(
        <input name = {props.name} id={props.id} onChange={props.onChange} type="text" ref={ref}/>
    );
}

export default React.forwardRef(Input);