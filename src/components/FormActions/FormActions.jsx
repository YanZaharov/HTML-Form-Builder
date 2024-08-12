import './FormActions.css'

function FormActions({ formElements, setFormElements, setJsonCode }) {
	const handleSave = () => {
		const json = JSON.stringify(formElements, null, 2)
		const blob = new Blob([json], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'form.json'
		a.click()
	}

	const handleLoad = e => {
		const file = e.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = event => {
				const json = event.target.result
				const elements = JSON.parse(json)
				setFormElements(elements)
				setJsonCode(json)
			}
			reader.readAsText(file)
		}
	}

	return (
		<div className='form-actions'>
			<button onClick={handleSave}>Save JSON</button>
			<label htmlFor='file-upload' className='custom-file-upload'>
				Load JSON
			</label>
			<input
				id='file-upload'
				type='file'
				accept='.json'
				onChange={handleLoad}
			/>
		</div>
	)
}

export default FormActions
