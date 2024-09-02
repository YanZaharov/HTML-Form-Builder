import { Box, Button, FormControl, Input, InputLabel } from '@mui/material'
import { useState } from 'react'
import ModalFormEditor from './ModalFormEditor' // Импортируем компонент для редактирования виджетов

function FormActions({ formElements, setFormElements, setJsonCode }) {
	const [fileInputKey, setFileInputKey] = useState(Date.now())
	const [selectedElement, setSelectedElement] = useState(null)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const convertToJsonSchema = elements => {
		const properties = elements.reduce((acc, el) => {
			const type =
				el.type === 'number'
					? 'number'
					: el.type === 'checkbox'
					? 'boolean'
					: 'string'
			acc[el.id] = { type, title: el.label }
			return acc
		}, {})
		return {
			type: 'object',
			properties,
		}
	}

	const convertToUiSchema = elements => ({
		type: 'VerticalLayout',
		elements: elements.map(el => ({
			type: 'Control',
			scope: `#/properties/${el.id}`,
			options: {
				format: el.type === 'checkbox' ? 'checkbox' : el.type,
			},
		})),
	})

	const handleSave = () => {
		const schema = convertToJsonSchema(formElements)
		const uischema = convertToUiSchema(formElements)
		const json = JSON.stringify({ schema, uischema }, null, 2)
		const blob = new Blob([json], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'form.json'
		a.click()
		URL.revokeObjectURL(url) // Отменяем URL после загрузки
	}

	const handleLoad = e => {
		const file = e.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = event => {
				const json = event.target.result
				const { schema, uischema } = JSON.parse(json)
				const elements = Object.keys(schema.properties).map(key => {
					const type = schema.properties[key].type
					let elementType = 'text'
					if (uischema.elements) {
						const uiElement = uischema.elements.find(
							el => el.scope === `#/properties/${key}`
						)
						if (uiElement) {
							if (uiElement.options && uiElement.options.format === 'radio') {
								elementType = 'radiobuttons'
							} else if (
								uiElement.options &&
								uiElement.options.format === 'select'
							) {
								elementType = 'combobox'
							}
						}
					}
					switch (type) {
						case 'number':
							elementType = 'number'
							break
						case 'boolean':
							elementType = 'checkbox'
							break
						case 'string':
							if (schema.properties[key].enum) {
								if (
									elementType !== 'radiobuttons' &&
									elementType !== 'combobox'
								) {
									elementType = 'listbox'
								}
							}
							break
						default:
							break
					}
					return {
						id: key,
						type: elementType,
						label: schema.properties[key].title,
						value: '', // начальное значение
					}
				})
				setFormElements(elements)
				setJsonCode(JSON.stringify({ schema, uischema }, null, 2))
				setFileInputKey(Date.now())
			}
			reader.readAsText(file)
		}
	}

	const openModal = element => {
		setSelectedElement(element)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
	}

	const saveElement = data => {
		setFormElements(prevElements =>
			prevElements.map(el =>
				el.id === selectedElement.id ? { ...el, ...data } : el
			)
		)
		setJsonCode(
			JSON.stringify(
				{
					schema: convertToJsonSchema(formElements),
					uischema: convertToUiSchema(formElements),
				},
				null,
				2
			)
		)
		closeModal()
	}

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'space-around',
				mb: 1,
				mt: 1,
				gap: 2,
			}}
		>
			<Button variant='contained' color='primary' onClick={handleSave}>
				Save JSON
			</Button>
			<FormControl>
				<InputLabel htmlFor='file-upload' sx={{ display: 'block', mb: 1 }}>
					{/* Load JSON */}
				</InputLabel>
				<Input
					key={fileInputKey}
					id='file-upload'
					type='file'
					accept='.json'
					onChange={handleLoad}
					style={{ display: 'none' }}
				/>
				<label htmlFor='file-upload'>
					<Button variant='contained' color='secondary' component='span'>
						Load JSON
					</Button>
				</label>
			</FormControl>
			{isModalOpen && (
				<ModalFormEditor
					isOpen={isModalOpen}
					onClose={closeModal}
					widget={selectedElement}
					onSave={saveElement}
				/>
			)}
		</Box>
	)
}

export default FormActions
