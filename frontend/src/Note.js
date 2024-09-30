export default function Note({ note, handleUpdate }) {
    return (
        <div style={{
            position: 'absolute',
            top: note.y,
            left: note.x,
            width: 300,
            height: 200,
            background: 'blue'
        }} onClick={e => e.stopPropagation()}>
            <div style={{
                width: '100%',
                height: 20
            }}>
            </div>
            <textarea style={{
                resize: 'none',
                width: '100%',
                height: '100%',
                outline: 'none'
            }} value={note.body} onChange={handleUpdate}>
            </textarea>
        </div>
    );
}
