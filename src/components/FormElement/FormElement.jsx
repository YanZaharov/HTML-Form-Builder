import { DragPreviewImage, useDrag, useDrop } from 'react-dnd'
import './FormElement.css'

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
			<label
				htmlFor={`element-${element.id}`}
				style={{ marginBottom: '10px', display: 'block' }}
			>
				{element.label}
			</label>
			{element.type === 'input' && (
				<input
					id={`element-${element.id}`}
					name={`element-${element.id}`}
					type='text'
					value={element.value}
					onChange={e =>
						handleElementChange(element.id, { value: e.target.value })
					}
				/>
			)}
			{element.type === 'number' && (
				<input
					id={`element-${element.id}`}
					name={`element-${element.id}`}
					type='number'
					value={element.value}
					onChange={e =>
						handleElementChange(element.id, { value: e.target.value })
					}
				/>
			)}
			{element.type === 'checkbox' && (
				<input
					id={`element-${element.id}`}
					name={`element-${element.id}`}
					type='checkbox'
					checked={element.value}
					onChange={e =>
						handleElementChange(element.id, { value: e.target.checked })
					}
				/>
			)}
			{element.type === 'listbox' && (
				<select
					id={`element-${element.id}`}
					name={`element-${element.id}`}
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
					id={`element-${element.id}`}
					name={`element-${element.id}`}
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
						id={`element-${element.id}-option1`}
						name={`element-${element.id}`}
						type='radio'
						value='option1'
						checked={element.value === 'option1'}
						onChange={e =>
							handleElementChange(element.id, { value: e.target.value })
						}
					/>{' '}
					Option 1
					<input
						id={`element-${element.id}-option2`}
						name={`element-${element.id}`}
						type='radio'
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

export default FormElement
