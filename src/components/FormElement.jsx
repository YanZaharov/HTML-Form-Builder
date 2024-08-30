import {
	Delete as DeleteIcon,
	DragIndicator as DragIcon,
	Edit as EditIcon,
} from '@mui/icons-material'
import {
	Box,
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText,
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
	onOpenEditModal,
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
			if (draggedItem.index !== index && draggingIndex === draggedItem.index) {
				moveElement(draggedItem.index, index)
				draggedItem.index = index
			}
		},
	})

	const handleChange = e => {
		let newValue = e.target.value
		if (element.type === 'checkbox') {
			newValue = e.target.checked
		}
		setValue(newValue)
		handleElementChange(element.id, { value: newValue })
	}

	const renderElement = () => {
		switch (element.type) {
			case 'number':
				return (
					<>
						<TextField
							label={element.label}
							type='number'
							value={value}
							onChange={handleChange}
							fullWidth
							inputProps={{
								min: element.minValue || undefined,
								max: element.maxValue || undefined,
							}}
						/>
						{element.minValue && (
							<FormHelperText>Min Value: {element.minValue}</FormHelperText>
						)}
						{element.maxValue && (
							<FormHelperText>Max Value: {element.maxValue}</FormHelperText>
						)}
					</>
				)
			case 'text':
				return (
					<>
						<TextField
							label={element.label}
							value={value}
							onChange={handleChange}
							fullWidth
							inputProps={{
								minLength: element.minLength || undefined,
								maxLength: element.maxLength || undefined,
							}}
						/>
						{element.minLength && (
							<FormHelperText>Min Length: {element.minLength}</FormHelperText>
						)}
						{element.maxLength && (
							<FormHelperText>Max Length: {element.maxLength}</FormHelperText>
						)}
					</>
				)
			case 'checkbox':
				return (
					<FormControlLabel
						control={
							<Checkbox checked={value === true} onChange={handleChange} />
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
							{element.options?.map((option, idx) => (
								<MenuItem key={idx} value={option}>
									{option}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				)
			case 'radiobuttons':
				return (
					<FormControl>
						<RadioGroup value={value} onChange={handleChange}>
							{element.options?.map((option, idx) => (
								<FormControlLabel
									key={idx}
									value={option}
									control={<Radio />}
									label={option}
								/>
							))}
						</RadioGroup>
					</FormControl>
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
				p: 1,
				fontSize: '0.875rem',
				backgroundColor: highlighted ? 'action.hover' : 'background.paper',
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
				transition: 'all 0.3s ease',
				width: '100%',
				maxWidth: '450px',
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
				<DragIcon sx={{ marginRight: 1 }} />
				<Typography variant='h6' sx={{ flex: 1, fontSize: '1rem' }}>
					{element.label}
				</Typography>
				<Button
					variant='outlined'
					color='info'
					onClick={() => onOpenEditModal(element)}
					sx={{ minWidth: '32px', padding: '4px', marginRight: 1 }}
				>
					<EditIcon />
				</Button>
				<Button
					variant='outlined'
					color='error'
					onClick={() => handleElementDelete(element.id)}
					sx={{ minWidth: '32px', padding: '4px' }}
				>
					<DeleteIcon />
				</Button>
			</Box>
			{renderElement()}
		</Box>
	)
}

export default FormElement
