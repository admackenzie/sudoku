import { Route, Routes } from 'react-router-dom';

// Layout
import Layout from './components/layout/Layout';

// Routes
import CalcudokuPage from './pages/CalcudokuPage';
import IndexPage from './pages/IndexPage';
import SudokuPage from './pages/SudokuPage.js';

export default function App() {
	return (
		<Layout>
			<Routes>
				<Route element={<IndexPage />} exact path="/" />

				<Route element={<SudokuPage />} path="/sudoku" />

				<Route element={<CalcudokuPage />} path="/calcudoku" />
			</Routes>
		</Layout>
	);
}
