import './JSONEditor.css'

function JSONEditor({ jsonCode, setJsonCode }) {
	const handleJsonChange = e => {
		setJsonCode(e.target.value)
	}

	return (
		<textarea
			className='json-editor'
			value={jsonCode}
			onChange={handleJsonChange}
			spellCheck='false'
		/>
	)
}

export default JSONEditor
