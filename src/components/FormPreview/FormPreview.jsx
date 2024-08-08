import PropTypes from 'prop-types'

const FormPreview = ({ formData }) => {
	if (formData.length === 0) {
		return <p>No forms available</p>
	}

	return (
		<div>
			<h2>Form Preview</h2>
			{formData.map((item, index) => (
				<div key={index}>
					<label>{item.label}</label>
					<input type={item.type} />
				</div>
			))}
		</div>
	)
}

FormPreview.propTypes = {
	formData: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			type: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		})
	).isRequired,
}

export default FormPreview
