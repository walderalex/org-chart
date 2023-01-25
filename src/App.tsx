import "./App.css";
import CanvasChart from "./Chart";
import Org from "./Org";

function App() {
	return (
		<>
			<header>
				<h1>Org chart</h1>
				<nav>
					<a href="/">Home</a>
				</nav>
			</header>
			<div className="scroller">
				<div className="main">
					<main>
						{/* <CanvasChart /> */}
						<Org />
					</main>
					<footer>&copy; Walder 2023</footer>
				</div>
			</div>
		</>
	);
}

export default App;
