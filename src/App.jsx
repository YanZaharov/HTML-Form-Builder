import { DndContext } from '@dnd-kit/core'
import { useState } from 'react'
import DropZone from './components/DropZone/DropZone'
import FormActions from './components/FormActions/FormActions'
import FormPreview from './components/FormPreview/FormPreview'
import WidgetList from './components/WidgetList/WidgetList'

const App = () => {
	const [formData, setFormData] = useState([])
	const [widgets] = useState([
		{ id: '1', type: 'text', label: 'Text Field' },
		{ id: '2', type: 'number', label: 'Number Field' },
		{ id: '3', type: 'email', label: 'Email Field' },
		{ id: '4', type: 'date', label: 'Date Field' },
		{ id: '5', type: 'checkbox', label: 'Checkbox' },
		{ id: '6', type: 'radio', label: 'Radio Button' },
		{ id: '7', type: 'textarea', label: 'Text Area' },
	])

	const handleDragEnd = event => {
		const { active } = event
		const widget = widgets.find(w => w.id === active.id)
		if (widget) {
			setFormData(prevData => [...prevData, widget])
		}
	}

	const handleSave = () => {
		localStorage.setItem('formData', JSON.stringify(formData))
		console.log('Form data saved:', formData)
	}

	const handleLoad = () => {
		const savedData = localStorage.getItem('formData')
		if (savedData) {
			setFormData(JSON.parse(savedData))
			console.log('Form data loaded:', JSON.parse(savedData))
		}
	}

	const handlePreview = () => {
		console.log('Previewing form data:', formData)
	}

	return (
		<DndContext onDragEnd={handleDragEnd}>
			<div className='app-container'>
				<WidgetList widgets={widgets} />
				<DropZone>
					<FormPreview formData={formData} />
				</DropZone>
				<FormActions
					onSave={handleSave}
					onLoad={handleLoad}
					onPreview={handlePreview}
				/>
			</div>
		</DndContext>
	)
}

export default App
