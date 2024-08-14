import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './App.css'
import FormActions from './components/FormActions/FormActions'
import FormEditor from './components/FormEditor/FormEditor'
import FormPreview from './components/FormPreview/FormPreview'
import JSONEditor from './components/JSONEditor/JSONEditor'
import WidgetList from './components/WidgetList/WidgetList'

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
})

function App() {
	const [formElements, setFormElements] = useState([])
	const [jsonCode, setJsonCode] = useState('{}')

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<DndProvider backend={HTML5Backend}>
				<div className='app'>
					<WidgetList />
					<FormEditor
						formElements={formElements}
						setFormElements={setFormElements}
						setJsonCode={setJsonCode}
					/>
					<FormPreview formElements={formElements} />
					<JSONEditor jsonCode={jsonCode} setJsonCode={setJsonCode} />
				</div>
				<FormActions
					formElements={formElements}
					setFormElements={setFormElements}
					setJsonCode={setJsonCode}
				/>
			</DndProvider>
		</ThemeProvider>
	)
}

export default App
