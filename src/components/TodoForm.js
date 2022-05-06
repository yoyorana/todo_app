import React, { useEffect } from "react";
import { useState } from "react";
import './TodoForm.css';



const TodoForm = ()=>{
    const [input,setInput] = useState('');
    const [list,setList] = useState([]);
    const [temproryList,setTemproryList] = useState([]);
    const [editing,setEditing] = useState(true);
    const [todoCount,setTodoCount] = useState(0);
    const [allChecked,setAllChecked] = useState(false);
    const [filter,setFilter] = useState("");
    const [anyCompleted,setAnyCompleted] = useState(0);
    useEffect(()=>{
        if(localStorage.getItem('list'))
        {
            setList(JSON.parse(localStorage.getItem('list')));
            if(localStorage.getItem('todoCount'))
            setTodoCount(JSON.parse(localStorage.getItem('todoCount')));
    }
    },[]);

    

useEffect(()=>{
    if(list.length===0)
        localStorage.setItem('list', JSON.stringify([]));
    else 
    {
        localStorage.setItem('list', JSON.stringify(list));
        localStorage.setItem('todoCount', JSON.stringify(todoCount));
        
}
},[list,anyCompleted,editing]);


 

    useEffect(()=>{
        if(filter==="")
        setTemproryList(list);
        if(filter==="active")
        setTemproryList(list.filter((item)=>!item.completed ));
        if(filter==="completed")
        setTemproryList(list.filter((item)=>item.completed ));
    },[list,filter])
    
   

    function inputHandler(e){
        setInput(e.target.value);
    }

    function hitEnterHandler(e){
        if(e.key === 'Enter')
         {
            e.preventDefault();
            if(input.trim()!=='')
            {
                 setList([{id:Math.random(), title:input, completed:false, editing:false},...list]);
                 setTodoCount(todoCount+1);
                 setInput('');
                 if(allChecked===true)
                 setAllChecked(false);
            }
        }
    }

    function handleDestroy(e,id,completed){
        e.preventDefault();
        setList(list.filter((listItem) => listItem.id!==id ));
        if(!completed)
       { 
          if(todoCount===1 && allChecked===false)
            setAllChecked(true); 
          setTodoCount(todoCount-1);
       }
    }

    function handleUpdate(e,item){
        e.preventDefault();
        item.editing=true;
        setEditing(!editing);
    }

    function saveUpdate(e, item){
        const newTitle=e.target.value;
        if(newTitle.trim()==="")
        handleDestroy(e,item.id,item.completed)
        else{
            item.title = newTitle;
            item.editing=false;
        }
       
        setEditing(!editing);    
    }
     function classHandler(item){
        if(item.editing)
        return "editing"
        if(item.completed)
        return "completed"
        return "yo"
     }

function addatlast(item){
    
    setList(list.shift());

    setList([...list,{id:Math.random(), title:item.title, completed:true, editing:false}]);
                 setTodoCount(todoCount+1);
                 
}
     function markCompleted(item){
     
        item.completed=!item.completed;
        if(item.completed)
        {
            setTodoCount(todoCount-1);
            setAnyCompleted(anyCompleted+1);
            addatlast(item);
       
        }
        
   
     }

     function markAllCompleted(){
         
        if(!allChecked)
        {
            list.map((item)=>{item.completed=true});
            setTodoCount(0);
            setAnyCompleted(list.length);
        }
        else
        {
            list.map((item)=>{item.completed=false})
            setTodoCount(list.length);
            setAnyCompleted(0);
        }
        setAllChecked(!allChecked)
     }
    function clearincomplete(e){
        e.preventDefault();
        
        setList(list.filter((item)=>item.completed));
    }
     function clearCompletedHandler(e){
         e.preventDefault();
         setList( list.filter((item)=> !item.completed ) )
     }
    return (
 <>
        <div className="reset"><button  onClick={(e)=>clearincomplete(e)} className={anyCompleted?"clear-completed":"hidden"}  >Reset</button></div>
        <form className="todoapp">
        <input 
            type="text"
            value={input}  
            className="new-todo"
            name="text"
            placeholder="What needs to be done?" 
            onChange={inputHandler}
            onKeyDown={hitEnterHandler}
            
        />
        <section className="main">
        <input id="toggle-all" className={list.length?"toggle-all":"hidden"} type="checkbox"  onClick={markAllCompleted}/>
        <label for="toggle-all"></label>
       { temproryList.map((item)=>(
               <ul className="todo-list" key={item.id}>
                   <li className={classHandler(item)}  onClick={()=>{markCompleted(item)}} checked={item.completed?true:false} >
                      

                            <label >
                            
                            {item.editing?<input autoFocus className="edit" defaultValue={item.title} onBlur={(e)=>saveUpdate(e, item)} 
                            onKeyDown={(e)=>{if(e.key === 'Enter') saveUpdate(e, item); else if(e.key === 'Escape') { item.editing=false;setEditing(!editing); }} } /> :<div onDoubleClick={(e)=>handleUpdate(e,item)}>{item.title}  
                             </div>
                            }                         
                            </label>
                           < button  className={item.editing?"view":"destroy"}  onClick={(e)=>handleDestroy(e,item.id,item.completed)}></button>
                           
                      
                        </li>
               </ul>
           )
       ) }
       </section>
       <footer class={list.length?"footer":"hidden"}>
           <span class="todo-count">
               <strong>{todoCount}</strong>
               <span>  </span>
               <span>items</span>
               <span>  </span>
               <span>left</span>
           </span>
           <ul class="filters">
             <li>
                 <a href="#/" className={(filter=="")?"selected":"abc"}  onClick={(e)=>{e.preventDefault();setFilter("")}}>All</a>
             </li>
             <span>  </span>
             <li>
                 <a href="#/active" className={(filter=="active")?"selected":"abc"} onClick={(e)=>{e.preventDefault() ;setFilter("active");}} >Active</a>
             </li>
             <span>  </span>
             <li>
                < a href="#/completed" className={(filter=="completed")?"selected":"abc"} onClick={(e)=>{e.preventDefault();setFilter("completed")}}>Completed</a>
                 </li>
           </ul>
           <button onClick={(e)=>clearCompletedHandler(e)} className={anyCompleted?"clear-completed":"hidden"}>Clear completed</button>
       </footer>
        </form>

        </>
    );
}

export default TodoForm;

