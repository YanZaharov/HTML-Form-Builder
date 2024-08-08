import { useState } from 'react'
import DropZone from '../DropZone/DropZone'
import FormPreview from '../FormPreview/FormPreview'
import './FormEditor.css'

const FormEditor = () => {
	const [formData, setFormData] = useState([])

	const handleDropWidget = widget => {
		const newWidget = {
			type: widget.type,
			value: widget.value || '',
		}
		setFormData(prevData => [...prevData, newWidget])
	}

	return (
		<div className='form-editor'>
			<DropZone onDropWidget={handleDropWidget} />
			<FormPreview formData={formData} />
		</div>
	)
}

export default FormEditor
