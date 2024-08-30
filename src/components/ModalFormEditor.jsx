import DeleteIcon from '@mui/icons-material/Delete'
import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	IconButton,
	List,
	ListItem,
	ListItemText,
	TextField,
} from '@mui/material'
import { useState } from 'react'

// Универсальный редактор для элементов формы
const ModalFormEditor = ({ element, onSave, onClose }) => {
	const [label, setLabel] = useState(element.label || '')
	const [required, setRequired] = useState(element.required || false)
	const [minLength, setMinLength] = useState(element.minLength || '')
	const [maxLength, setMaxLength] = useState(element.maxLength || '')
	const [minValue, setMinValue] = useState(element.minValue || '')
	const [maxValue, setMaxValue] = useState(element.maxValue || '')
	const [options, setOptions] = useState(element.options || [])
	const [newOption, setNewOption] = useState('')
	const [error, setError] = useState('')

	const validate = () => {
		if (!label) {
			setError('Label is required.')
			return false
		}
		if (
			required &&
			(element.type === 'text' || element.type === 'number') &&
			!minLength &&
			!maxLength &&
			!minValue &&
			!maxValue
		) {
			setError('Min and Max values are required for required fields.')
			return false
		}
		return true
	}

	const handleSave = () => {
		if (!validate()) return

		const updatedElement = {
			...element,
			label,
			required,
			minLength:
				element.type === 'text'
					? minLength
						? Number(minLength)
						: undefined
					: undefined,
			maxLength:
				element.type === 'text'
					? maxLength
						? Number(maxLength)
						: undefined
					: undefined,
			minValue:
				element.type === 'number'
					? minValue
						? Number(minValue)
						: undefined
					: undefined,
			maxValue:
				element.type === 'number'
					? maxValue
						? Number(maxValue)
						: undefined
					: undefined,
			options:
				element.type !== 'checkbox' && options.length ? options : undefined, // Удаление enum для Checkbox
		}
		onSave(updatedElement)
	}

	const handleAddOption = () => {
		if (newOption.trim() !== '') {
			setOptions([...options, newOption.trim()])
			setNewOption('')
		}
	}

	const handleDeleteOption = index => {
		setOptions(options.filter((_, i) => i !== index))
	}

	const renderTypeSpecificFields = () => {
		switch (element.type) {
			case 'text':
				return (
					<>
						<TextField
							label='Minimum Length'
							type='number'
							value={minLength}
							onChange={e => setMinLength(e.target.value)}
							fullWidth
							margin='normal'
						/>
						<TextField
							label='Maximum Length'
							type='number'
							value={maxLength}
							onChange={e => setMaxLength(e.target.value)}
							fullWidth
							margin='normal'
						/>
					</>
				)
			case 'number':
				return (
					<>
						<TextField
							label='Minimum Value'
							type='number'
							value={minValue}
							onChange={e => setMinValue(e.target.value)}
							fullWidth
							margin='normal'
						/>
						<TextField
							label='Maximum Value'
							type='number'
							value={maxValue}
							onChange={e => setMaxValue(e.target.value)}
							fullWidth
							margin='normal'
						/>
					</>
				)
			case 'combobox':
			case 'listbox':
			case 'radiobuttons': // Обновлено название типа
				return (
					<>
						<TextField
							label='New Option'
							value={newOption}
							onChange={e => setNewOption(e.target.value)}
							fullWidth
							margin='normal'
						/>
						<Button
							variant='contained'
							onClick={handleAddOption}
							sx={{ mt: 2, mb: 2 }}
							disabled={!newOption.trim()}
						>
							Add Option
						</Button>
						<List>
							{options.map((option, index) => (
								<ListItem
									key={index}
									secondaryAction={
										<IconButton
											edge='end'
											aria-label='delete'
											onClick={() => handleDeleteOption(index)}
										>
											<DeleteIcon />
										</IconButton>
									}
								>
									<ListItemText primary={option} />
								</ListItem>
							))}
						</List>
					</>
				)
			case 'checkbox':
				return null
			default:
				return null
		}
	}

	return (
		<Dialog open onClose={onClose}>
			<DialogTitle>Edit {element.type} Element</DialogTitle>
			<DialogContent>
				{error && <p style={{ color: 'red' }}>{error}</p>}
				<TextField
					label='Label'
					value={label}
					onChange={e => setLabel(e.target.value)}
					fullWidth
					margin='normal'
					error={!label && error.includes('Label')}
				/>
				<FormControlLabel
					control={
						<Checkbox
							checked={required}
							onChange={e => setRequired(e.target.checked)}
						/>
					}
					label='Required'
				/>
				{renderTypeSpecificFields()}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSave}>Save</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ModalFormEditor
