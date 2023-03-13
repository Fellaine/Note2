const Form = ({formVisible, setFormVisible, title, setTitle, content, setContent,
              formSubmitAction})=>{
    return(
        <div className="form" onClick={(e)=>e.stopPropagation()}>
          <div className="form-header">
            <div>
              <p className="form-title">Create Note</p>
            </div>
            <div>
              <button className="close-btn" onClick={()=>setFormVisible(!formVisible)}>X</button>
            </div>
          </div>
          <form action="">
            <div className="form-group">
              <label htmlFor="form-title" className="form-label">Title</label>
              <input type="text" name="form-title" className="form-input" value={title}
                onChange={(e)=>setTitle(e.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="content" className="form-label">Content</label>
              <textarea type="text" name="content" className="form-input" rows={4} value = {content}
                onChange={(e)=>setContent(e.target.value)}/>
            </div>
            <div className="form-group">
              <button type="submit" disabled={!content} className="form-btn" onClick={formSubmitAction}>Save</button>
            </div>
            <div className="test"></div>
          </form>
        </div>
    )
}
export {Form}