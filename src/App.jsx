import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Editor from "./components/Editor.jsx";
import Split from "react-split";
import { notesCollection, db } from "./config/firebase.js";
import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";

export default function App() {
	const [notes, setNotes] = useState([]);
	const [currentNoteId, setCurrentNoteId] = useState("");

	const currentNote =
		notes.find((note) => {
			return note.id === currentNoteId;
		}) || notes[0];

	useEffect(() => {
		const unsub = onSnapshot(notesCollection, (snapshot) => {
			const notesArr = snapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}));

			const sortedNotesArr = notesArr.sort((a, b) => b.updatedAt - a.updatedAt);

			setNotes(sortedNotesArr);
		});

		return unsub;
	}, []);

	useEffect(() => {
		if (!currentNoteId) setCurrentNoteId(notes[0]?.id);
	}, [notes]);

	const createNewNote = async () => {
		try {
			const newNote = {
				body: "# Note title \n\n Type your markdown here",
				createdAt: Date.now(),
				updatedAt: Date.now(),
			};

			const newNoteRef = await addDoc(notesCollection, newNote);
			setCurrentNoteId(newNoteRef.id);
		} catch (err) {
			console.error(err);
		}
	};

	// Update note function - push updated note to the top of list
	async function updateNote(text) {
		const noteRef = doc(db, "notes", currentNoteId);
		await setDoc(noteRef, { body: text, updatedAt: Date.now()}, { merge: true });
	}

	const deleteNote = async (id) => {
		const noteRef = doc(db, "notes", id);
		await deleteDoc(noteRef);
	};

	return (
		<main>
			{notes.length > 0 ? (
				<Split
					sizes={[30, 70]}
					direction="horizontal"
					className="split"
				>
					<Sidebar
						notes={notes}
						currentNote={currentNote}
						setCurrentNoteId={setCurrentNoteId}
						newNote={createNewNote}
						deleteNote={deleteNote}
					/>

					<Editor currentNote={currentNote} updateNote={updateNote} />
				</Split>
			) : (
				<div className="no-notes">
					<h1>You have no notes</h1>
					<button className="first-note" onClick={createNewNote}>
						Create one now
					</button>
				</div>
			)}
		</main>
	);
}
