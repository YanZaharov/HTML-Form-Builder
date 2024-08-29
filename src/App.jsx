import {
	Box,
	createTheme,
	CssBaseline,
	Paper,
	ThemeProvider,
	Typography,
} from '@mui/material'
import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import FormActions from './components/FormActions'
import FormEditor from './components/FormEditor'
import FormPreview from './components/FormPreview'
import JSONEditor from './components/JSONEditor'
import WidgetList from './components/WidgetList'

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
	typography: {
		fontFamily: 'Arial, sans-serif',
	},
})

function App() {
	const [formElements, setFormElements] = useState([])
	const [jsonCode, setJsonCode] = useState('{}')
	const [readOnly, setReadOnly] = useState(false)

	const handleToggleReadOnly = () => {
		setReadOnly(prev => !prev)
	}

	const handleFormElementsChange = newElements => {
		setFormElements(newElements)
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<DndProvider backend={HTML5Backend}>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						padding: 2,
						height: '100vh',
					}}
				>
					{/* Верхний блок */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							gap: 2,
							flex: 1,
						}}
					>
						{/* Виджет лист */}
						<Paper
							elevation={3}
							sx={{
								width: 300,
								overflow: 'hidden',
								padding: 2,
								borderRadius: 2,
								backgroundColor: '#1e1e1e',
							}}
						>
							<Typography variant='h6' sx={{ mb: 2 }}>
								Widget List
							</Typography>
							<Box
								sx={{
									maxHeight: 'calc(100vh - 150px)', // Обновленный подсчет высоты с учетом заголовка и отступов
									overflowY: 'auto',
								}}
							>
								<WidgetList />
							</Box>
						</Paper>

						{/* Редактор формы */}
						<Paper
							elevation={3}
							sx={{
								flex: 1,
								overflow: 'hidden',
								padding: 2,
								borderRadius: 2,
								backgroundColor: '#1e1e1e',
							}}
						>
							<Typography variant='h6' sx={{ mb: 2 }}>
								Form Editor
							</Typography>
							<Box
								sx={{
									maxHeight: 'calc(100vh - 150px)', // Обновленный подсчет высоты с учетом заголовка и отступов
									overflowY: 'auto',
								}}
							>
								<FormEditor
									formElements={formElements}
									setFormElements={handleFormElementsChange}
									setJsonCode={setJsonCode}
								/>
							</Box>
						</Paper>
					</Box>

					{/* Нижний блок */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							gap: 2,
							flex: 1,
						}}
					>
						{/* JSON Editor */}
						<Paper
							elevation={3}
							sx={{
								width: 300,
								overflow: 'hidden',
								padding: 2,
								borderRadius: 2,
								backgroundColor: '#1e1e1e',
							}}
						>
							<Typography variant='h6' sx={{ mb: 2 }}>
								JSON Schema
							</Typography>
							<Box
								sx={{
									maxHeight: 'calc(100vh - 150px)', // Обновленный подсчет высоты с учетом заголовка и отступов
									overflowY: 'auto',
								}}
							>
								<JSONEditor jsonCode={jsonCode} setJsonCode={setJsonCode} />
							</Box>
						</Paper>

						{/* Предпросмотр формы */}
						<Paper
							elevation={3}
							sx={{
								flex: 1,
								overflow: 'hidden',
								padding: 2,
								borderRadius: 2,
								backgroundColor: '#1e1e1e',
							}}
						>
							<Typography variant='h6' sx={{ mb: 2 }}>
								Form Preview
							</Typography>
							<Box
								sx={{
									maxHeight: 'calc(100vh - 150px)', // Обновленный подсчет высоты с учетом заголовка и отступов
									overflowY: 'auto',
								}}
							>
								<FormPreview formElements={formElements} readOnly={readOnly} />
							</Box>
						</Paper>
					</Box>

					{/* Кнопки */}
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							mt: 2,
						}}
					>
						<FormActions
							formElements={formElements}
							setFormElements={handleFormElementsChange}
							setJsonCode={setJsonCode}
							onToggleReadOnly={handleToggleReadOnly}
						/>
					</Box>
				</Box>
			</DndProvider>
		</ThemeProvider>
	)
}

export default App
