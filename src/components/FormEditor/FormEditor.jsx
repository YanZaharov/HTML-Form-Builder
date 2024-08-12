import { DragPreviewImage, useDrag, useDrop } from 'react-dnd'
import './FormEditor.css'

// Компонент для одного элемента формы
const FormElement = ({
	element,
	index,
	moveElement,
	handleElementChange,
	handleElementDelete,
}) => {
	const [, drag, preview] = useDrag({
		type: 'form-element',
		item: { index },
	})

	const [, drop] = useDrop({
		accept: 'form-element',
		hover: draggedItem => {
			if (draggedItem.index !== index) {
				moveElement(draggedItem.index, index)
				draggedItem.index = index
			}
		},
	})

	return (
		<div ref={node => drag(drop(node))} className='form-editor-element'>
			<DragPreviewImage connect={preview} src='/path-to-drag-preview.png' />
			<label style={{ marginBottom: '10px', display: 'block' }}>
				{element.label}
			</label>
			{element.type === 'input' && (
				<input
					type='text'
					value={element.value}
					onChange={e =>
						handleElementChange(element.id, { value: e.target.value })
					}
				/>
			)}
			{element.type === 'number' && (
				<input
					type='number'
					value={element.value}
					onChange={e =>
						handleElementChange(element.id, { value: e.target.value })
					}
				/>
			)}
			{element.type === 'checkbox' && (
				<input
					type='checkbox'
					checked={element.value}
					onChange={e =>
						handleElementChange(element.id, { value: e.target.checked })
					}
				/>
			)}
			{element.type === 'listbox' && (
				<select
					value={element.value}
					onChange={e =>
						handleElementChange(element.id, { value: e.target.value })
					}
				>
					<option value='option1'>Option 1</option>
					<option value='option2'>Option 2</option>
				</select>
			)}
			{element.type === 'combobox' && (
				<select
					value={element.value}
					onChange={e =>
						handleElementChange(element.id, { value: e.target.value })
					}
				>
					<option value='option1'>Option 1</option>
					<option value='option2'>Option 2</option>
				</select>
			)}
			{element.type === 'radiobuttons' && (
				<>
					<input
						type='radio'
						name={`radio-${element.id}`}
						value='option1'
						checked={element.value === 'option1'}
						onChange={e =>
							handleElementChange(element.id, { value: e.target.value })
						}
					/>{' '}
					Option 1
					<input
						type='radio'
						name={`radio-${element.id}`}
						value='option2'
						checked={element.value === 'option2'}
						onChange={e =>
							handleElementChange(element.id, { value: e.target.value })
						}
					/>{' '}
					Option 2
				</>
			)}
			<button
				style={{ marginTop: '10px', padding: '4px 8px' }}
				onClick={() => handleElementDelete(element.id)}
			>
				Delete
			</button>
		</div>
	)
}

// Главный компонент редактора формы
function FormEditor({ formElements, setFormElements, setJsonCode }) {
	const [, drop] = useDrop({
		accept: 'widget',
		drop: item => {
			handleDrop(item)
		},
	})

	const moveElement = (fromIndex, toIndex) => {
		const updatedElements = [...formElements]
		const [movedElement] = updatedElements.splice(fromIndex, 1)
		updatedElements.splice(toIndex, 0, movedElement)
		setFormElements(updatedElements)
		updateJsonCode(updatedElements)
	}

	const handleDrop = item => {
		const newElement = {
			id: Date.now(),
			type: item.type,
			label: item.label,
			value: '',
		}
		const updatedElements = [...formElements, newElement]
		setFormElements(updatedElements)
		updateJsonCode(updatedElements)
	}

	const updateJsonCode = elements => {
		const json = JSON.stringify(elements, null, 2)
		setJsonCode(json)
	}

	const handleElementChange = (id, newProps) => {
		const updatedElements = formElements.map(el =>
			el.id === id ? { ...el, ...newProps } : el
		)
		setFormElements(updatedElements)
		updateJsonCode(updatedElements)
	}

	const handleElementDelete = id => {
		const updatedElements = formElements.filter(el => el.id !== id)
		setFormElements(updatedElements)
		updateJsonCode(updatedElements)
	}

	return (
		<div className='form-editor' ref={drop}>
			{formElements.map((element, index) => (
				<FormElement
					key={element.id}
					element={element}
					index={index}
					moveElement={moveElement}
					handleElementChange={handleElementChange}
					handleElementDelete={handleElementDelete}
				/>
			))}
		</div>
	)
}

export default FormEditor
