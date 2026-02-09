"use client";

import { useEffect, useState } from "react";

export default function Home() {
	const [message, setMessage] = useState("");

	useEffect(() => {
		fetch("http://localhost:3000/api/hello")
			.then(res => res.json())
			.then(data => setMessage(data.message));
	}, []);

	function handleClick() {
		console.log("increment like count");
	}

	return (
		<main>
			<h1>{message}</h1>
			<button onClick={handleClick}>+</button>
		</main>
	);
}
