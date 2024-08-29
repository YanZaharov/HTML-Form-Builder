import {
	Delete as DeleteIcon,
	DragIndicator as DragIcon,
} from '@mui/icons-material'
import {
	Box,
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	TextField,
	Typography,
} from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'

const ItemType = 'widget'

const FormElement = ({
	element,
	index,
	moveElement,
	handleElementChange,
	handleElementDelete,
	draggingIndex,
	highlighted,
	readOnly,
}) => {
	if (!element || !element.type) {
		console.warn(`Invalid element or missing type: ${element}`)
		return null
	}

	const [value, setValue] = useState(element.value || '')
	const ref = useRef(null)

	// Drag and drop hooks
	const [{ isDragging }, drag] = useDrag({
		type: ItemType,
		item: { id: element.id, index },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	})

	const [, drop] = useDrop({
		accept: ItemType,
		hover: draggedItem => {
			if (draggedItem.index === index) return
			moveElement(draggedItem.index, index)
			draggedItem.index = index
		},
	})

	const combinedRef = useCallback(
		node => {
			ref.current = node
			drag(drop(node))
		},
		[drag, drop]
	)

	// Handle value changes
	const handleChange = e => {
		if (readOnly) return

		let newValue = e.target.value
		if (element.type === 'checkbox') {
			newValue = e.target.checked
		}
		setValue(newValue)
		handleElementChange(element.id, { value: newValue })
	}

	// Update local value when element's value changes
	useEffect(() => {
		setValue(element.value || '')
	}, [element.value])

	// Render functions for different element types
	const renderTextField = () => (
		<TextField
			label={element.label || 'Input'}
			type={element.type}
			value={value}
			onChange={handleChange}
			fullWidth
			disabled={readOnly}
		/>
	)

	const renderCheckbox = () => (
		<FormControlLabel
			control={
				<Checkbox
					checked={!!value}
					onChange={handleChange}
					disabled={readOnly}
				/>
			}
			label={element.label || 'Checkbox'}
		/>
	)

	const renderSelect = () => (
		<FormControl fullWidth>
			<InputLabel>{element.label || 'Select'}</InputLabel>
			<Select value={value} onChange={handleChange} disabled={readOnly}>
				{(element.options || []).map((option, idx) => (
					<MenuItem key={idx} value={option}>
						{option}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)

	const renderRadioButtons = () => (
		<FormControl component='fieldset'>
			<RadioGroup value={value} onChange={handleChange}>
				{(element.options || []).map((option, idx) => (
					<FormControlLabel
						key={idx}
						value={option}
						control={<Radio disabled={readOnly} />}
						label={option}
					/>
				))}
			</RadioGroup>
		</FormControl>
	)

	const renderGroup = () => (
		<Box sx={{ marginLeft: 2, borderLeft: '4px solid', paddingLeft: 2 }}>
			<Typography variant='h6'>{element.label || 'Group'}</Typography>
			{element.children?.map((childElement, idx) => (
				<FormElement
					key={childElement.id}
					element={childElement}
					index={idx}
					moveElement={moveElement}
					handleElementChange={handleElementChange}
					handleElementDelete={handleElementDelete}
					draggingIndex={draggingIndex}
					highlighted={highlighted}
					readOnly={readOnly}
				/>
			))}
		</Box>
	)

	const renderLayout = () => (
		<Box
			sx={{
				display: 'flex',
				flexDirection:
					element.layoutType === 'HorizontalLayout' ? 'row' : 'column',
				flexWrap: 'wrap',
				gap: 2,
				width: '100%',
				padding: 2,
				border: '1px dashed',
				borderColor: highlighted ? 'primary.main' : 'divider',
				backgroundColor: 'background.paper',
				overflow: 'auto',
			}}
		>
			{element.children?.map((childElement, idx) => (
				<FormElement
					key={childElement.id}
					element={childElement}
					index={idx}
					moveElement={moveElement}
					handleElementChange={handleElementChange}
					handleElementDelete={handleElementDelete}
					draggingIndex={draggingIndex}
					highlighted={highlighted}
					readOnly={readOnly}
				/>
			))}
		</Box>
	)

	const renderElement = () => {
		switch (element.type) {
			case 'number':
			case 'text':
			case 'input':
				return renderTextField()
			case 'checkbox':
				return renderCheckbox()
			case 'listbox':
			case 'combobox':
				return renderSelect()
			case 'radiobuttons':
				return renderRadioButtons()
			case 'group':
				return renderGroup()
			case 'layout':
				return renderLayout()
			default:
				console.warn(`Unsupported element type: ${element.type}`)
				return null
		}
	}

	return (
		<Box
			ref={combinedRef}
			sx={{
				border: '1px solid',
				borderColor: highlighted ? 'primary.main' : 'divider',
				padding: 1,
				marginBottom: 1,
				borderRadius: 1,
				backgroundColor: isDragging
					? 'action.disabledBackground'
					: 'background.paper',
				position: 'relative',
				cursor: readOnly ? 'default' : 'move',
				opacity: isDragging ? 0.5 : 1,
				minWidth: 150,
			}}
		>
			<Box display='flex' alignItems='center' justifyContent='space-between'>
				<Box display='flex' alignItems='center'>
					<DragIcon
						sx={{ cursor: readOnly ? 'default' : 'move', marginRight: 1 }}
					/>
					{renderElement()}
				</Box>
				{!readOnly && (
					<Button
						onClick={() => handleElementDelete(element.id)}
						sx={{
							position: 'absolute',
							top: '50%',
							right: 4,
							transform: 'translateY(-50%)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<DeleteIcon />
					</Button>
				)}
			</Box>
		</Box>
	)
}

export default FormElement
