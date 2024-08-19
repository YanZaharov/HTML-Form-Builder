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
import { useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'

const ItemType = 'widget'

const FormElement = ({
	element,
	index,
	moveElement,
	handleElementChange,
	handleElementDelete,
	onDragStart,
	onDragEnd,
	draggingIndex,
	highlighted,
	onHover,
	onLeave,
}) => {
	const [value, setValue] = useState(element.value || '')
	const ref = useRef(null)

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
			if (draggedItem.index !== index) {
				moveElement(draggedItem.index, index)
				draggedItem.index = index
			}
		},
	})

	const handleChange = e => {
		let newValue = e.target.value
		if (element.type === 'checkbox') {
			newValue = e.target.checked // Checkbox возвращает булево значение
		}
		setValue(newValue)
		handleElementChange(element.id, { value: newValue })
	}

	const renderElement = () => {
		switch (element.type) {
			case 'number':
				return (
					<TextField
						label={element.label}
						type='number'
						value={value}
						onChange={handleChange}
						fullWidth
					/>
				)
			case 'checkbox':
				return (
					<FormControlLabel
						control={
							<Checkbox
								checked={value === true} // Сравниваем с true для корректной работы
								onChange={handleChange}
							/>
						}
						label={element.label}
					/>
				)
			case 'listbox':
			case 'combobox':
				return (
					<FormControl fullWidth>
						<InputLabel>{element.label}</InputLabel>
						<Select value={value} onChange={handleChange}>
							<MenuItem value='Option 1'>Option 1</MenuItem>
							<MenuItem value='Option 2'>Option 2</MenuItem>
						</Select>
					</FormControl>
				)
			case 'radiobuttons':
				return (
					<RadioGroup value={value} onChange={handleChange}>
						<FormControlLabel
							value='Option 1'
							control={<Radio />}
							label='Option 1'
						/>
						<FormControlLabel
							value='Option 2'
							control={<Radio />}
							label='Option 2'
						/>
					</RadioGroup>
				)
			default:
				return (
					<TextField
						label={element.label}
						value={value}
						onChange={handleChange}
						fullWidth
					/>
				)
		}
	}

	return (
		<Box
			ref={node => {
				drag(drop(node))
				ref.current = node
			}}
			sx={{
				p: 2,
				backgroundColor: 'background.paper',
				border: '1px solid',
				borderColor: highlighted ? 'secondary.main' : 'divider',
				borderRadius: 1,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'start',
				justifyContent: 'space-between',
				gap: 1,
				cursor: 'move',
				opacity: isDragging ? 0.5 : 1,
				transition: 'all 0.2s ease',
				marginBottom: draggingIndex === index ? '20px' : '10px', // Отступ между элементами
			}}
			onMouseEnter={onHover}
			onMouseLeave={onLeave}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
				<DragIcon />
				<Typography variant='h6' sx={{ flex: 1 }}>
					{element.label}
				</Typography>
				<Button
					variant='outlined'
					color='error'
					onClick={() => handleElementDelete(element.id)}
				>
					<DeleteIcon />
				</Button>
			</Box>
			{renderElement()}
		</Box>
	)
}

export default FormElement
