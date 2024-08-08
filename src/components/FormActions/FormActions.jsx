import PropTypes from 'prop-types'

const FormActions = ({ onSave, onLoad, onPreview }) => {
	return (
		<div>
			<button onClick={onSave}>Save</button>
			<button onClick={onLoad}>Load</button>
			<button onClick={onPreview}>Preview</button>
		</div>
	)
}

FormActions.propTypes = {
	onSave: PropTypes.func.isRequired,
	onLoad: PropTypes.func.isRequired,
	onPreview: PropTypes.func.isRequired,
}

export default FormActions
