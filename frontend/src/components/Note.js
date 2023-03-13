const Note =({title, content, last_edited, onclickNote, onclickDel})=>{
    const date = new Date(last_edited);
    return(
        <div className="note" onClick={onclickNote}>
            <div className="note-header">
                <p className="note-title">{title}</p>
                <button className="delete-btn" onClick={(e)=>{e.stopPropagation();onclickDel()}}>X</button>
            </div>
            <div className="note-content">
                <p className="note-content-p">{content}</p>
            </div>
            <div className="note-last-edited">
              <p className="note-last-edited-p">{date.toLocaleString()}</p>
            </div>
        </div>
    )
}
export {Note}