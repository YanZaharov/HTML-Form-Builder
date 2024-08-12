import './FormPreview.css'

function FormPreview({ formElements }) {
	return (
		<div className='form-preview'>
			{formElements.map(element => (
				<div key={element.id} className='form-preview-element'>
					<label>{element.label}</label>
					{element.type === 'input' && (
						<input type='text' value={element.value} readOnly />
					)}
					{element.type === 'number' && (
						<input type='number' value={element.value} readOnly />
					)}
					{element.type === 'checkbox' && (
						<input type='checkbox' checked={element.value} readOnly />
					)}
					{element.type === 'listbox' && (
						<select value={element.value} readOnly>
							<option value='option1'>Option 1</option>
							<option value='option2'>Option 2</option>
						</select>
					)}
					{element.type === 'combobox' && (
						<select value={element.value} readOnly>
							<option value='option1'>Option 1</option>
							<option value='option2'>Option 2</option>
						</select>
					)}
					{element.type === 'radiobuttons' && (
						<>
							<input
								type='radio'
								name={`radio-preview-${element.id}`}
								value='option1'
								checked={element.value === 'option1'}
								readOnly
							/>{' '}
							Option 1
							<input
								type='radio'
								name={`radio-preview-${element.id}`}
								value='option2'
								checked={element.value === 'option2'}
								readOnly
							/>{' '}
							Option 2
						</>
					)}
				</div>
			))}
		</div>
	)
}

export default FormPreview
