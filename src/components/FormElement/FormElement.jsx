import { useDrag, useDrop } from 'react-dnd'
import './FormElement.css'

const FormElement = ({
	element,
	index,
	moveElement,
	handleElementChange,
	handleElementDelete,
}) => {
	const [, drag] = useDrag({
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

	const renderInputField = () => {
		switch (element.type) {
			case 'number':
				return (
					<input
						id={element.id}
						type='number'
						value={element.value || ''}
						onChange={e =>
							handleElementChange(element.id, { value: e.target.value })
						}
					/>
				)
			case 'checkbox':
				return (
					<input
						id={element.id}
						type='checkbox'
						checked={element.value || false}
						onChange={e =>
							handleElementChange(element.id, { value: e.target.checked })
						}
					/>
				)
			case 'listbox':
				return (
					<select
						id={element.id}
						value={element.value || ''}
						onChange={e =>
							handleElementChange(element.id, { value: e.target.value })
						}
					>
						<option value='Option 1'>Option 1</option>
						<option value='Option 2'>Option 2</option>
					</select>
				)
			case 'combobox':
				return (
					<select
						id={element.id}
						value={element.value || ''}
						onChange={e =>
							handleElementChange(element.id, { value: e.target.value })
						}
					>
						<option value='Option 1'>Option 1</option>
						<option value='Option 2'>Option 2</option>
					</select>
				)
			case 'radiobuttons':
				return (
					<div>
						<label>
							<input
								type='radio'
								id={`${element.id}_option1`}
								value='Option 1'
								checked={element.value === 'Option 1'}
								onChange={e =>
									handleElementChange(element.id, { value: e.target.value })
								}
							/>
							Option 1
						</label>
						<label>
							<input
								type='radio'
								id={`${element.id}_option2`}
								value='Option 2'
								checked={element.value === 'Option 2'}
								onChange={e =>
									handleElementChange(element.id, { value: e.target.value })
								}
							/>
							Option 2
						</label>
					</div>
				)
			default:
				return (
					<input
						id={element.id}
						type='text'
						value={element.value || ''}
						onChange={e =>
							handleElementChange(element.id, { value: e.target.value })
						}
					/>
				)
		}
	}

	return (
		<div ref={node => drag(drop(node))} className='form-editor-element'>
			<label htmlFor={element.id}>{element.label}</label>
			{renderInputField()}
			<button onClick={() => handleElementDelete(element.id)}>Delete</button>
		</div>
	)
}

export default FormElement
