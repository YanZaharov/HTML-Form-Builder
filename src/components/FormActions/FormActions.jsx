import { useState } from 'react'
import './FormActions.css'

function FormActions({ formElements, setFormElements, setJsonCode }) {
	const [fileInputKey, setFileInputKey] = useState(Date.now())

	const convertToJsonSchema = elements => {
		const properties = elements.reduce((acc, el) => {
			let type = 'string'
			switch (el.type) {
				case 'number':
					type = 'number'
					break
				case 'checkbox':
					type = 'boolean'
					break
				case 'listbox':
				case 'combobox':
				case 'radiobuttons':
					type = 'string'
					break
				default:
					break
			}

			acc[el.id] = {
				type,
				title: el.label,
				...(el.type === 'listbox' ||
				el.type === 'combobox' ||
				el.type === 'radiobuttons'
					? { enum: ['Option 1', 'Option 2'] } // Добавляем enum для списка и радио-кнопок
					: {}),
			}
			return acc
		}, {})

		return {
			type: 'object',
			properties,
		}
	}

	const convertToUiSchema = elements => {
		return {
			type: 'VerticalLayout',
			elements: elements.map(el => {
				let control = {
					type: 'Control',
					scope: `#/properties/${el.id}`,
				}

				switch (el.type) {
					case 'number':
						control = { ...control, options: { inputType: 'number' } }
						break
					case 'checkbox':
						control = { ...control, options: { format: 'checkbox' } }
						break
					case 'listbox':
					case 'combobox':
						control = { ...control, options: { format: 'select' } }
						break
					case 'radiobuttons':
						control = { ...control, options: { format: 'radio' } }
						break
					default:
						control = { ...control, options: { format: 'text' } }
						break
				}

				return control
			}),
		}
	}

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
	}

	const handleLoad = e => {
		const file = e.target.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = event => {
				const json = event.target.result
				const { schema, uischema } = JSON.parse(json)

				// Преобразуем schema и uischema обратно в formElements
				const elements = Object.keys(schema.properties).map(key => {
					const type = schema.properties[key].type
					let elementType = 'text'

					if (uischema.elements) {
						// Найдем соответствующий элемент в uischema для определения типа
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
								elementType = 'combobox' // можно добавить 'listbox', если нужно
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
								// Если это enum, то это может быть listbox, combobox или radiobuttons
								if (
									elementType !== 'radiobuttons' &&
									elementType !== 'combobox'
								) {
									elementType = 'listbox' // по умолчанию listbox, если не найдено другое сопоставление
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

				// Сбрасываем значение input для загрузки файла
				setFileInputKey(Date.now())
			}
			reader.readAsText(file)
		}
	}

	return (
		<div className='form-actions'>
			<button onClick={handleSave}>Save JSON</button>
			<label htmlFor='file-upload' className='custom-file-upload'>
				Load JSON
			</label>
			<input
				key={fileInputKey} // используем уникальный ключ для перерендера input
				id='file-upload'
				type='file'
				accept='.json'
				onChange={handleLoad}
			/>
		</div>
	)
}

export default FormActions
